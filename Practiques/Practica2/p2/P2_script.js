//Initialize camera
const camera01 = new Camera(0.1, 500.0);

//Initialize player
const player01 = new Player(camera01);

//Initialize shaders. Shaders must be declared in the HTML document and have an ID
const masterShader01 = new Shader("VS01", "FS01");

//Initialize scene  
const P2 = new Scene(camera01, player01);

//Initialize GameObject collections, for "batch drawing" (TBI) objects with shared shader

let gameObjects01 = new ObjectCollection(masterShader01);
P2.addCollection(gameObjects01);

//Initialize GameObjects
let base_wall = new GameObject(SM_CylinderInvert, masterShader01);

let base_fish01 = new GameObject(SM_Fish01, masterShader01);
let base_fish02 = new GameObject(SM_Fish02, masterShader01);
let base_fish03 = new GameObject(SM_Fish03, masterShader01);
let base_coral01 = new GameObject(SM_Coral01, masterShader01);
let base_coral02 = new GameObject(SM_Coral02, masterShader01);
let base_shark01 = new GameObject(SM_Shark01, masterShader01);

//Initialize object instances
let wall = new ObjectInstance(base_wall, gameObjects01);

let fish01 = new ObjectInstance(base_fish01, gameObjects01);
let fish02 = new ObjectInstance(base_fish02, gameObjects01);
let fish03 = new ObjectInstance(base_fish03, gameObjects01);
let shark01 = new ObjectInstance(base_shark01, gameObjects01);

//Add object instances to draw
wall.setMatrix(0, 40, 0, 100);
wall.setTransform(1, .5, 1);

fish01.setMatrix(5, 2, -10, 100);
fish02.setMatrix(-8, 3, -15, 100);
fish03.setMatrix(-10, 9, -20, 100);
shark01.setMatrix(0, 3, -30, 50);



generateInstancesRadial(base_coral01, gameObjects01, 100, [0, -10, 0], 60, 100, 95, 0);
generateInstancesRadial(base_coral02, gameObjects01, 100, [0, -10, 0], 50, 90, 95, 0);
generateInstancesRadial(base_fish01, gameObjects01, 30, [0, 40, 0], 60, 100, 95, 48);
generateInstancesRadial(base_fish02, gameObjects01, 30, [0, 40, 0], 60, 150, 95, 48);
generateInstancesRadial(base_fish03, gameObjects01, 30, [0, 40, 0], 60, 200, 85, 48);
generateInstancesRadial(base_shark01, gameObjects01, 5, [0, 45, 0], 60, 125, 85, 40);

window.onload = function(){
    P2.drawScene();
    //TODO: create a function to display these like the fps/frame time
    console.log(gameObjects01.drawCalls + " draw calls");
    console.log(gameObjects01.totalTriCount + " triangles");
}
