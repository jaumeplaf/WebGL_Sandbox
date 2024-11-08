//Initialize camera
const camera01 = new Camera(0.1, 250.0);

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
cube01.initializeObject(exampleCube, masterShader01);
sphere01.initializeObject(exampleSphere, masterShader01);

//Add object instances to draw
//TODO: right now it's instancing a single instance per gameObject, should be re-instancable
cube01.setMatrix(-1, -1, -5, 1);
cube01.setAnimation(0.25, [0,1,1]);
gameObjects01.add(cube01);

sphere01.setMatrix(5, 1, -25, 1);
sphere01.setAnimation(1, [-1,0,-0.5]);
gameObjects01.add(sphere01);

//let angle = 0;
window.onload = function(){
    P2.drawScene();
}