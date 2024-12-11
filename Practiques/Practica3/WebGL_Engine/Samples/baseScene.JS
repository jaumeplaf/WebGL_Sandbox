//Initialize camera
const camera01 = new Camera(0.1, 500.0, [15,15,15], [0,15,-1], false);

//Initialize player
const player01 = new Player(camera01);

//Initialize shaders. Shaders must be declared in the HTML document and have an ID
const masterShader01 = new Shader("VS01", "FS01");

//Initialize scene  
const P2 = new Scene(camera01, player01);

//Initialize GameObject collections, for "batch drawing" (TBI) objects with shared shader

let gameObjects01 = new SceneActorsCollection(masterShader01);
P2.addCollection(gameObjects01);


//Initialize GameObjects
let base_plane = new GameObject(SM_Plane, masterShader01);
let base_cube = new GameObject(SM_Cube, masterShader01);
let base_arrowX = new GameObject(SM_DebugArrow_X, masterShader01);
let base_arrowY = new GameObject(SM_DebugArrow_Y, masterShader01);
let base_arrowZ = new GameObject(SM_DebugArrow_Z, masterShader01);

//Initialize object instances
let floor = new ObjectInstance(base_plane, gameObjects01);
floor.setMatrix(0, -10, -5, 100);

let arrowX = new ObjectInstance(base_arrowX, gameObjects01);
arrowX.setMatrix(0, 0, -5, 100);
arrowX.setTransform(-1,1,1);
let arrowY = new ObjectInstance(base_arrowY, gameObjects01);
arrowY.setMatrix(0, 0, -5, 100);
let arrowZ = new ObjectInstance(base_arrowZ, gameObjects01);
arrowZ.setMatrix(0, 0, -5, 100);

let cube01 = new ObjectInstance(base_cube, gameObjects01);
cube01.setMatrix(25, 5, 30, 10);


window.onload = function(){
    P2.drawScene();
    console.log(gameObjects01.totalTriCount + " triangles");
}