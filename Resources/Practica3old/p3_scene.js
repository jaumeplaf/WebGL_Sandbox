//Initialize camera
const camera01 = new Camera(0.1, 500.0, [15,15,15], [0,15,-1], false);

//Initialize player
const player01 = new Player(camera01);

//Initialize scene  
const P3 = new Scene(camera01, player01);

//Initialize shaders. Shaders must be declared in the HTML document and have an ID
//TODO: RENAME TO MATERIALS. MATERIALS ARE SHADER INSTANCES. SHADERS ARE SOURCE GLSL
//TODO: find some way to link imported material name (MODIFY JSON EXPORTER TO HAVE THIS, per vertex ID? look into .obj(.mtl)) with these initialized materials
const M_Color = new Material(P3, "VS_01", "FS_01");

//TODO: refactor MeshObjects to get created on shader initialization (can have the same name), auto-add it on instance creation,
//create instance method to overwrite shader, removing itself from the collection and adding to new collection.

//Initialize MeshObjects
const base_plane = new MeshObject(SM_Plane, M_Color);
const base_cube = new MeshObject(SM_Cube, M_Color);
const base_arrowX = new MeshObject(SM_DebugArrow_X, M_Color);
const base_arrowY = new MeshObject(SM_DebugArrow_Y, M_Color);
const base_arrowZ = new MeshObject(SM_DebugArrow_Z, M_Color);

//const base_wheel = new MeshObject(Wheel01, M_Color);

//Initialize object instances
const floor = new MeshActor(base_plane);
floor.setMatrix(0, -10, -5, 1000);
floor.setColor([0.6, 0.6, 0.6, 1.0]);

const arrowX = new MeshActor(base_arrowX);
arrowX.setMatrix(0, 0, -5, 100);
arrowX.setTransform(-1,1,1);
const arrowY = new MeshActor(base_arrowY);
arrowY.setMatrix(0, 0, -5, 100);
const arrowZ = new MeshActor(base_arrowZ);
arrowZ.setMatrix(0, 0, -5, 100);

//const wheel01 = new MeshActor(base_wheel);
//wheel01.setMatrix(0, 0, -5, 10);


//TODO: shader: add a on/off uniform float UseTextureMap, UseNormalMap, UseDisplacementMap, UseEnvironmentMap, UseLightingMaps. Look into shader permutations/instances/variants.
//TODO: texture manager script, create texture class

function debugInstance(name, instance) {
    console.log(name.toUpperCase());
    console.log("Debug attributes: ");
    console.log("Indices: ", instance.indices);
    console.log("Vertices: ", instance.vertices);
    console.log("Colors: ", instance.colors);
    console.log("Normals: ", instance.normals);
    console.log("Texture Coordinates 1: ", instance.texcoords1);
    console.log("Debug idBuffers: ");
    console.log("Index Buffer: ", instance.idBufferIndices);
    console.log("Vertex Buffer: ", instance.idBufferVertices);
    console.log("Normal Buffer: ", instance.idBufferNormals);
    console.log("Color Buffer: ", instance.idBufferColors);
    console.log("Texture Coordinate Buffer 1: ", instance.idBufferTexcoords1);

    console.log("Debug model matrix: ", instance.modelMatrixIndex); 
    console.log("Debug view matrix: ", camera01.viewMatrix);
    console.log("Debug projection matrix: ", camera01.projectionMatrix); 
}

debugInstance("arrowX", arrowX);
/*
debugInstance(arrowY);
debugInstance(arrowZ);
*/

window.onload = function(){
    P3.drawScene();
    //console.log((M_Color.collection.totalTriCount + shaderT01.collection.totalTriCount) + " triangles");
}