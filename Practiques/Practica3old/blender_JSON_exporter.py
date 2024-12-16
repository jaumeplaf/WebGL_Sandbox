import bpy
import json
import os
from bpy.types import Operator, Panel, PropertyGroup
from bpy.props import BoolProperty, StringProperty, PointerProperty

class JsonExportSettings(PropertyGroup):
    export_to_single_file: BoolProperty(
        name="Export to Single File",
        description="Export all selected meshes to a single JSON file",
        default=False
    )
    single_file_name: StringProperty(
        name="Single File Name",
        description="Name of the single JSON file (without extension)",
        default="all_meshes",
        maxlen=255
    )
    export_path: StringProperty(
        name="Export Path",
        description="Path to export JSON files (leave empty for blend file location)",
        default="",
        subtype='DIR_PATH',
        maxlen=1024
    )
    export_vertices: BoolProperty(name="Export Vertices", default=True)
    export_normals: BoolProperty(name="Export Normals", default=True)
    export_indices: BoolProperty(name="Export Indices", default=True)
    export_texcoords1: BoolProperty(name="Export UV Channel 1", default=True)
    export_texcoords2: BoolProperty(name="Export UV Channel 2", default=False)
    export_texcoords3: BoolProperty(name="Export UV Channel 3", default=False)
    export_colors: BoolProperty(name="Export Colors", default=True)


class MESH_OT_export_json(Operator):
    """Export selected meshes to JSON"""
    bl_idname = "mesh.export_json"
    bl_label = "Export JSON"
    bl_options = {'REGISTER', 'UNDO'}

    def export_single_mesh(self, obj, settings):
        if obj.type != 'MESH':
            return None

        # Prepare storage for JSON data
        data = {}

        mesh = obj.data

        if settings.export_vertices:
            data["vertices"] = [
                [vert.co.x, vert.co.y, vert.co.z] for vert in mesh.vertices
            ]

        if settings.export_normals:
            data["normals"] = [
                [vert.normal.x, vert.normal.y, vert.normal.z] for vert in mesh.vertices
            ]

        if settings.export_indices:
            data["indices"] = [
                [poly.vertices[0], poly.vertices[1], poly.vertices[2]]
                for poly in mesh.polygons if len(poly.vertices) == 3
            ]

        if settings.export_texcoords1 or settings.export_texcoords2 or settings.export_texcoords3:
            uv_layers = mesh.uv_layers
            for i in range(3):  # Up to 3 UV layers
                if i < len(uv_layers):
                    if getattr(settings, f"export_texcoords{i+1}"):
                        uv_data = []
                        for loop in uv_layers[i].data:
                            uv_data.append([loop.uv.x, loop.uv.y])
                        data[f"texcoords{i+1}"] = uv_data

        if settings.export_colors and "colors" in mesh.color_attributes:
            color_layer = mesh.color_attributes["colors"]
            data["colors"] = [
                [color_layer.data[i].color[0],
                 color_layer.data[i].color[1],
                 color_layer.data[i].color[2],
                 color_layer.data[i].color[3]]
                for i in range(len(mesh.vertices))
            ]

        return data

    def execute(self, context):
        settings = context.scene.json_export_settings
        selected_objects = [obj for obj in context.selected_objects if obj.type == 'MESH']

        if not selected_objects:
            self.report({'WARNING'}, "No mesh objects selected")
            return {'CANCELLED'}

        export_path = bpy.path.abspath(settings.export_path) if settings.export_path.strip() else bpy.path.abspath("//")
        os.makedirs(export_path, exist_ok=True)

        if settings.export_to_single_file:
            # Export to a single file
            single_file_name = settings.single_file_name.strip() or "all_meshes"
            output_file = os.path.join(export_path, f"{single_file_name}.json")
            try:
                with open(output_file, "w") as f:
                    for obj in selected_objects:
                        mesh_data = self.export_single_mesh(obj, settings)
                        if mesh_data:
                            mesh_name = bpy.path.clean_name(obj.name)
                            f.write(f"var {mesh_name} = ")
                            json.dump(mesh_data, f, indent=4)
                            f.write(";\n")
                self.report({'INFO'}, f"Exported all meshes to {output_file}")
                return {'FINISHED'}
            except Exception as e:
                self.report({'ERROR'}, f"Failed to export meshes: {str(e)}")
                return {'CANCELLED'}
        else:
            # Export to separate files
            export_count = 0
            for obj in selected_objects:
                mesh_data = self.export_single_mesh(obj, settings)
                if mesh_data:
                    mesh_name = bpy.path.clean_name(obj.name)
                    output_file = os.path.join(export_path, f"{mesh_name}.json")
                    try:
                        with open(output_file, "w") as f:
                            f.write(f"var {mesh_name} = ")
                            json.dump(mesh_data, f, indent=4)
                        export_count += 1
                    except Exception as e:
                        self.report({'ERROR'}, f"Failed to export {obj.name}: {str(e)}")
            if export_count:
                self.report({'INFO'}, f"Successfully exported {export_count} mesh{'es' if export_count > 1 else ''}")
                return {'FINISHED'}
            else:
                self.report({'WARNING'}, "No meshes were exported")
                return {'CANCELLED'}


class VIEW3D_PT_json_exporter(Panel):
    """Creates a Panel in the Tools sidebar"""
    bl_label = "JSON Mesh Export"
    bl_idname = "VIEW3D_PT_json_exporter"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'Tool'

    def draw(self, context):
        layout = self.layout
        settings = context.scene.json_export_settings

        layout.prop(settings, "export_to_single_file")
        if settings.export_to_single_file:
            layout.prop(settings, "single_file_name")
        layout.prop(settings, "export_path")

        col = layout.column(align=True)
        col.label(text="Export Options:")
        col.prop(settings, "export_vertices")
        col.prop(settings, "export_normals")
        col.prop(settings, "export_indices")
        col.prop(settings, "export_texcoords1")
        col.prop(settings, "export_texcoords2")
        col.prop(settings, "export_texcoords3")
        col.prop(settings, "export_colors")

        layout.operator("mesh.export_json", text="Export Selected to JSON")
def register():
    bpy.utils.register_class(JsonExportSettings)
    bpy.utils.register_class(MESH_OT_export_json)
    bpy.utils.register_class(VIEW3D_PT_json_exporter)
    bpy.types.Scene.json_export_settings = PointerProperty(type=JsonExportSettings)


def unregister():
    bpy.utils.unregister_class(JsonExportSettings)
    bpy.utils.unregister_class(MESH_OT_export_json)
    bpy.utils.unregister_class(VIEW3D_PT_json_exporter)
    del bpy.types.Scene.json_export_settings


if __name__ == "__main__":
    register()