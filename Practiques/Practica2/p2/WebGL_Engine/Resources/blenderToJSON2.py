bl_info = {
    "name": "JSON Mesh Exporter",
    "author": "Your Name",
    "version": (1, 0),
    "blender": (3, 0, 0),
    "location": "View3D > Sidebar > Tools > JSON Export",
    "description": "Export selected meshes to JSON format",
    "category": "Import-Export",
}

import bpy
import json
import os
from bpy.types import Operator, Panel, PropertyGroup
from bpy.props import StringProperty, PointerProperty

class JsonExportSettings(PropertyGroup):
    export_path: StringProperty(
        name="Export Path",
        description="Path to export JSON files (leave empty for blend file location)",
        default="",
        subtype='DIR_PATH',
        maxlen=1024
    )

class MESH_OT_export_json(Operator):
    """Export selected meshes to JSON"""
    bl_idname = "mesh.export_json"
    bl_label = "Export JSON"
    bl_options = {'REGISTER', 'UNDO'}

    def export_single_mesh(self, obj, export_path):
        if obj.type != 'MESH':
            return False

        # Prepare storage for JSON data
        data = {
            "vertices": [],
            "normals": [],
            "texcoords": [],
            "indices": [],
            "colors": []
        }

        mesh = obj.data
        
        # Get vertices
        for vert in mesh.vertices:
            data["vertices"].extend([vert.co.x, vert.co.y, vert.co.z])

        # Get normals
        for vert in mesh.vertices:
            data["normals"].extend([vert.normal.x, vert.normal.y, vert.normal.z])

        # Get texture coordinates
        if len(mesh.uv_layers) > 0:
            uv_layer = mesh.uv_layers.active.data
            for uv in uv_layer:
                data["texcoords"].extend([uv.uv.x, uv.uv.y])
        else:
            for _ in range(len(mesh.vertices)):
                data["texcoords"].extend([0.0, 0.0])

        # Get indices
        for poly in mesh.polygons:
            if len(poly.vertices) == 3:  # Only process triangles
                data["indices"].extend(poly.vertices[:3])

        # Get vertex colors
        if "colors" in mesh.color_attributes:
            color_layer = mesh.color_attributes["colors"]
            
            # Create a mapping of vertex index to color
            vertex_colors = {}
            
            # First pass: collect all colors for each vertex
            for poly in mesh.polygons:
                for loop_idx, vert_idx in zip(poly.loop_indices, poly.vertices):
                    if color_layer.domain == 'POINT':
                        color = color_layer.data[vert_idx].color
                    else:
                        color = color_layer.data[loop_idx].color
                    if vert_idx not in vertex_colors:
                        vertex_colors[vert_idx] = color

            # Second pass: add colors in vertex order
            for i in range(len(mesh.vertices)):
                if i in vertex_colors:
                    color = vertex_colors[i]
                    data["colors"].extend([color[0], color[1], color[2], 1.0])
                else:
                    data["colors"].extend([1.0, 1.0, 1.0, 1.0])
        else:
            for _ in range(len(mesh.vertices)):
                data["colors"].extend([1.0, 1.0, 1.0, 1.0])

        # Generate output path
        mesh_name = bpy.path.clean_name(obj.name)
        
        # Use custom export path if specified, otherwise use blend file location
        if export_path and export_path.strip():
            # Ensure the directory exists
            os.makedirs(export_path, exist_ok=True)
            output_json_path = os.path.join(export_path, f"{mesh_name}_export.json")
        else:
            output_json_path = os.path.join(bpy.path.abspath("//"), f"{mesh_name}_export.json")

        # Write data to JSON
        try:
            with open(output_json_path, "w") as f:
                json.dump(data, f, indent=4)
            return True
        except Exception as e:
            self.report({'ERROR'}, f"Failed to export {obj.name}: {str(e)}")
            return False

    def execute(self, context):
        # Get selected objects
        selected_objects = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']
        
        if not selected_objects:
            self.report({'WARNING'}, "No mesh objects selected")
            return {'CANCELLED'}
        
        # Get export path from settings
        export_path = context.scene.json_export_settings.export_path

        # If export path is specified, ensure it's absolute
        if export_path and export_path.strip():
            export_path = bpy.path.abspath(export_path)
        
        export_count = 0
        for obj in selected_objects:
            if self.export_single_mesh(obj, export_path):
                export_count += 1
        
        if export_count > 0:
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

        # Export path field
        layout.prop(settings, "export_path")
        
        # Export button
        row = layout.row()
        row.operator("mesh.export_json", text="Export Selected to JSON")
        
        # Add selection info
        box = layout.box()
        selected_meshes = [obj for obj in context.selected_objects if obj.type == 'MESH']
        box.label(text=f"Selected Meshes: {len(selected_meshes)}")
        for obj in selected_meshes:
            box.label(text=f"• {obj.name}")

def register():
    bpy.utils.register_class(JsonExportSettings)
    bpy.utils.register_class(MESH_OT_export_json)
    bpy.utils.register_class(VIEW3D_PT_json_exporter)
    bpy.types.Scene.json_export_settings = PointerProperty(type=JsonExportSettings)

def unregister():
    bpy.utils.unregister_class(MESH_OT_export_json)
    bpy.utils.unregister_class(VIEW3D_PT_json_exporter)
    bpy.utils.unregister_class(JsonExportSettings)
    del bpy.types.Scene.json_export_settings

if __name__ == "__main__":
    register()
