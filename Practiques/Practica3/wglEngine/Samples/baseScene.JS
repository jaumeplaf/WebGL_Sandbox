//Initialize camera
const camera01 = new Camera(0.1, 500.0, [15,15,15], [0,15,-1]);

//Initialize player
const player01 = new Player(camera01);

//Initialize scene  
const currentScene = new Scene(camera01, player01);

//Initialize shaders. Shaders must be declared in the HTML document and have an ID
const material01 = new Material(currentScene, "VS_01", "FS_01");

//Initialize MeshObject
const base_plane = new MeshObject(SM_Plane, material01);
const base_cube = new MeshObject(SM_Cube, material01);
const base_arrowX = new MeshObject(SM_DebugArrow_X, material01);
const base_arrowY = new MeshObject(SM_DebugArrow_Y, material01);
const base_arrowZ = new MeshObject(SM_DebugArrow_Z, material01);

//Initialize object instances
const floor = new MeshActor(base_plane);
floor.setMatrix(0, -10, -5, 1000);
floor.setColor([0.6, 0.6, 0.6, 1.0]);

const arrowX = new MeshActor(base_arrowX);
arrowX.setMatrix(0, 0, -5, 100);
arrowX.setScale(-1,1,1);
const arrowY = new MeshActor(base_arrowY);
arrowY.setMatrix(0, 0, -5, 100);
const arrowZ = new MeshActor(base_arrowZ);
arrowZ.setMatrix(0, 0, -5, 100);

currentScene.addMeshActor(floor);
currentScene.addMeshActor(arrowX);
currentScene.addMeshActor(arrowY);
currentScene.addMeshActor(arrowZ);

debugInstance("arrowX", arrowX);

window.onload = function(){
    currentScene.drawScene();
}