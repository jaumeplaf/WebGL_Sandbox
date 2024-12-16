//Initialize camera
const camera01 = new Camera(0.1, 500.0, [0,0,0], [0,0,-1], true);

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
wall.setMatrix(0, 40, 0, 100);
wall.setTransform(1, .5, 1);

let shark01 = new  ObjectInstance(base_shark01, gameObjects01);
shark01.setMatrix(0, 10, -50, 200);
debugInstance("shark01", shark01);

let coral01Instances = generateInstancesRadial(base_coral01, gameObjects01, 400, [0, -10, 0], 60, 100, 95, 0, false, 0, 0);
let coral02Instances = generateInstancesRadial(base_coral02, gameObjects01, 400, [0, -10, 0], 50, 90, 95, 0, false, 0, 0);
let fish01Instances = generateInstancesRadial(base_fish01, gameObjects01, 100, [0, 40, 0], 30, 100, 99.5, 48, true, 270, 10);
let fish02Instances = generateInstancesRadial(base_fish02, gameObjects01, 100, [0, 40, 0], 40, 150, 99.5, 48, true, 270, 10);
let fish03Instances = generateInstancesRadial(base_fish03, gameObjects01, 100, [0, 40, 0], 50, 200, 99.5, 48, true, 270, 10);
let shark01Instances = generateInstancesRadial(base_shark01, gameObjects01, 10, [0, 45, 0], 60, 120, 85, 40, true, 270, 10);

for(let inst of shark01Instances) inst.setRotationSpeed(2, [0,1,0]);
for(let inst of fish01Instances) inst.setRotationSpeed(3, [0,1,0]);
for(let inst of fish02Instances) inst.setRotationSpeed(4, [0,1,0]);
for(let inst of fish03Instances) inst.setRotationSpeed(6, [0,1,0]);



window.onload = function(){
    P2.drawScene();
    console.log(gameObjects01.totalTriCount + " triangles");
}