
//Initialize camera
const camera01 = new Camera(0.1, 500.0, [15,15,15], [0,15,-1], false);

//Initialize player
const player01 = new Player(camera01);

//Initialize scene  
const P3 = new Scene(camera01, player01);

//Initialize shaders. Shaders must be declared in the HTML document and have an ID
//TODO: RENAME TO MATERIALS. MATERIALS ARE SHADER INSTANCES. SHADERS ARE SOURCE GLSL
//TODO: find some way to link imported material name (MODIFY JSON EXPORTER TO HAVE THIS, per vertex ID? look into .obj(.mtl)) with these initialized materials
const M_Color = new Shader(P3, "VS_VertexColors_01", "FS_VertexColors_01", true, false, false, false);

const M_Texture = new Shader(P3, "VS01", "FS01", false, true, false, false);



//TODO: refactor gameObjects to get created on shader initialization (can have the same name), auto-add it on instance creation,
//create instance method to overwrite shader, removing itself from the collection and adding to new collection.

//Initialize GameObjects
let base_plane = new GameObject(SM_Plane, M_Color, true, false);
let base_cube = new GameObject(SM_Cube, M_Color, true, false);
let base_arrowX = new GameObject(SM_DebugArrow_X, M_Color, true, false);
let base_arrowY = new GameObject(SM_DebugArrow_Y, M_Color, true, false);
let base_arrowZ = new GameObject(SM_DebugArrow_Z, M_Color, true, false);

//Initialize object instances
let floor = new ObjectInstance(base_plane);
floor.setMatrix(0, -10, -5, 1000);
floor.setColor([0.6, 0.6, 0.6, 1.0]);

let arrowX = new ObjectInstance(base_arrowX);
arrowX.setMatrix(0, 0, -5, 100);
arrowX.setTransform(-1,1,1);

let arrowY = new ObjectInstance(base_arrowY);
arrowY.setMatrix(0, 0, -5, 100);

let arrowZ = new ObjectInstance(base_arrowZ);
arrowZ.setMatrix(0, 0, -5, 100);



//TODO: shader: add a on/off uniform float UseTextureMap, UseNormalMap, UseDisplacementMap, UseEnvironmentMap, UseLightingMaps. Look into shader permutations/instances/variants.
//TODO: texture manager script, create texture class

function debugInstance(instance) {
    console.log("Debug attributes: ", instance.indices, instance.vertices, instance.colors, 
        instance.normals, instance.texcoords1, instance.texcoords2, instance.texcoords3);
    console.log("Debug idBuffers: ", instance.idBufferIndices, instance.idBufferVertices, 
        instance.idBufferNormals, instance.idBufferColors, instance.idBufferTexcoords1, 
        instance.idBufferTexcoords2, instance.idBufferTexcoords3);

    console.log("Debug model matrix: ", instance.modelMatrixIndex); 
    console.log("Debug view matrix: ", camera01.viewMatrix);
    console.log("Debug projection matrix: ", camera01.projectionMatrix); 
}

/*
debugInstance(arrowX);
debugInstance(arrowY);
debugInstance(arrowZ);
*/

window.onload = function(){
    P3.drawScene();
    //console.log((M_Color.collection.totalTriCount + shaderT01.collection.totalTriCount) + " triangles");
}