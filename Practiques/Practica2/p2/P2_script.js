//Initialize camera
const camera01 = new Camera(0.1, 1000.0);

//Initialize player
const player01 = new Player(camera01);

//Initialize shaders. Shaders must be declared in the HTML document and have an ID
const masterShader01 = new Shader("VS01", "FS01");

//Initialize scene  
const P2 = new Scene(camera01, player01);


//Initialize GameObject collections, for "batch drawing" (TBI) objects with shared shader

let gameObjects01 = new ObjectCollection(camera01);
gameObjects01.initialize(masterShader01);
P2.addCollection(gameObjects01);


//Initialize GameObjects, and assign them to a collection

let cube01 = new GameObject();
let sphere01 = new GameObject();
let plane01 = new GameObject();
cube01.initializeObject(exampleCube, masterShader01, false, false);
sphere01.initializeObject(exampleSphere, masterShader01, false, false);
plane01.initializeObject(examplePlane, masterShader01, false, false);
let fish01 = new GameObject();
let fish02 = new GameObject();
let fish03 = new GameObject();
let coral01 = new GameObject();
let coral02 = new GameObject();
let shark01 = new GameObject();
fish01.initializeObject(baseFish01, masterShader01, true, true);
fish02.initializeObject(baseFish02, masterShader01, true, true);
fish03.initializeObject(baseFish03, masterShader01, true, true);
coral01.initializeObject(baseCoral01, masterShader01, true, true);
coral02.initializeObject(baseCoral02, masterShader01, true, true);
shark01.initializeObject(baseShark01, masterShader01, true, true);

//Add object instances to draw
//TODO: right now it's instancing a single instance per gameObject, should be re-instancable
cube01.setMatrix(-1, -1, -5, 1);
//cube01.setAnimation(0.25, [0,1,1]);
cube01.setBaseColor([1,1,1]);
gameObjects01.add(cube01);

sphere01.setMatrix(5, 1, -25, 1);
//sphere01.setAnimation(1, [1,0,-0.5]);
sphere01.setBaseColor([1,1,1]);
gameObjects01.add(sphere01);

plane01.setMatrix(0, -2, -25, 100);
//plane01.setAnimation(0, [-0,0,0]);
plane01.setBaseColor([0.7,0.7,0.7]);
gameObjects01.add(plane01);


//Imported
fish01.setMatrix(5, 2, -10, 100);
fish01.setRotation(-90, [1,0,0]);
//fish01.setAnimation(0, [0,0,0]);
fish01.setBaseColor([1,0,0]);
gameObjects01.add(fish01);

fish02.setMatrix(-8, 3, -15, 100);
fish02.setRotation(-90, [1,0,0]);
//fish02.setAnimation(0, [0,0,0]);
fish02.setBaseColor([0,1,0]);
gameObjects01.add(fish02);


fish03.setMatrix(-10, 9, -20, 100);
fish03.setRotation(-90, [1,0,0]);
//fish03.setAnimation(0, [0,0,0]);
fish03.setBaseColor([0,0,1]);
gameObjects01.add(fish03);

shark01.setMatrix(0, 3, -30, 50);
shark01.setRotation(-90, [1,0,0]);
//shark01.setAnimation(0, [0,0,0]);
shark01.setBaseColor([1,1,0]);
gameObjects01.add(shark01);


//TODO: JSON load example, works (returns vertices array), but gives errors (I think this will get fixed adding "var name = {")
//console.log("vertices: " + fish01.vertices + ", normals: " + fish01.normals + ", colors: " + fish01.colors);

window.onload = function(){
    P2.drawScene();
}