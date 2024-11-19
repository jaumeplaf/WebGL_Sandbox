//Initialize camera
const camera01 = new Camera(0.1, 250.0);

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

let base_cube01 = new GameObject(mesh_cube01, masterShader01);
let base_sphere01 = new GameObject(mesh_sphere01, masterShader01);
let base_plane01 = new GameObject(mesh_circle01, masterShader01);
let base_wall = new GameObject(mesh_cylinderInvert01, masterShader01);

let base_fish01 = new GameObject(mesh_fish01, masterShader01);
let base_fish02 = new GameObject(mesh_fish02, masterShader01);
let base_fish03 = new GameObject(mesh_fish03, masterShader01);
let base_coral01 = new GameObject(mesh_coral01, masterShader01);
let base_coral02 = new GameObject(mesh_coral02, masterShader01);
let base_shark01 = new GameObject(mesh_shark01, masterShader01);

//Initialize object instances

let floor = new ObjectInstance(base_plane01, gameObjects01);
let ceiling = new ObjectInstance(base_plane01, gameObjects01);
let wall = new ObjectInstance(base_wall, gameObjects01);
let cube01 = new ObjectInstance(base_cube01, gameObjects01);
let sphere01 = new ObjectInstance(base_sphere01, gameObjects01);

let fish01 = new ObjectInstance(base_fish01, gameObjects01);
let fish02 = new ObjectInstance(base_fish02, gameObjects01);
let fish03 = new ObjectInstance(base_fish03, gameObjects01);
let shark01 = new ObjectInstance(base_shark01, gameObjects01);
let coral01 = new ObjectInstance(base_coral01, gameObjects01);
let coral02 = new ObjectInstance(base_coral02, gameObjects01);

//Add object instances to draw
floor.setMatrix(0, -2, -25, 100);
floor.setRotation(180, [1,0,0]);

ceiling.setMatrix(0, 52, -25, 100);
ceiling.setRotation(180, [1,0,0]);

wall.setMatrix(0, -2, -25, 100);
wall.setRotation(0, [1,0,0]);

cube01.setMatrix(-1, -1, -10, 1);

sphere01.setMatrix(5, 1, -25, 1);

fish01.setMatrix(5, 2, -10, 100);
fish01.setRotation(-90, [1,0,0]);

fish02.setMatrix(-8, 3, -15, 100);
fish02.setRotation(-90, [1,0,0]);


fish03.setMatrix(-10, 9, -20, 100);
fish03.setRotation(-90, [1,0,0]);

shark01.setMatrix(0, 3, -30, 50);
shark01.setRotation(-90, [1,0,0]);

coral01.setMatrix(-5, -2, -5, 50);
coral01.setRotation(-90, [1,0,0]);

coral02.setMatrix(3, -2, -15, 50);
coral02.setRotation(-90, [1,0,0]);

window.onload = function(){
    P2.drawScene();
}