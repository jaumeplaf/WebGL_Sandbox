//Use launcher or initialize server running: "python -m http.server 8000" on the project folder
//Navigate to http://localhost:8000/baseScene.html

//Set scene as active
const ACTIVE_SCENE = currentScene;

//Initialize object instances

const floor = new MeshActor(base_floor);
floor.setMatrix(0, -10, -5, 100);
floor.setColor([1.0, 1.0, 1.0, 1.0]);

const sphere1 = new MeshActor(base_sphere);
sphere1.setMatrix(-55, 25, 85, 30);
sphere1.setColor([1.0, 1.0, 1.0, 1.0]);

const arrowX = new MeshActor(base_arrowX);
arrowX.setMatrix(0, -9, -5, 40);
const arrowY = new MeshActor(base_arrowY);
arrowY.setMatrix(0, -9, -5, 40);
const arrowZ = new MeshActor(base_arrowZ);
arrowZ.setMatrix(0, -9, -5, 40);


const barrel01 = new MeshActor(base_barrel);
barrel01.setMatrix(-15, -10, -5, 10);





//TODO: IMPLEMENT MULTIPLE LIGHTS

const L00 = new PointLight(4, 75, [-152, 47, 5], [1.0, 1.0, 1.0], [1.0, 0.3, 0.3], [1.0, 0.3, 0.3]);
const L01 = new PointLight(2, 50, [-45, 11, 0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
const L02 = new PointLight(10, 50, [24, 32, 5], [0.8, 0.8, 1.0], [0.8, 0.8, 1.0], [0.8, 0.8, 1.0]);
const L03 = new PointLight(2, 100, [0, 20, -150], [0.0, 1.0, 1.0], [0.0, 1.0, 1.0], [0.0, 1.0, 1.0]);
const L04 = new PointLight(2, 300, [0, 80, 225], [1.0, 1.0, 0.0], [1.0, 1.0, 0.0], [1.0, 1.0, 0.0]);
const L05 = new PointLight(5, 150, [-45, 135, 120], [1.0, 1.0, 0.8], [1.0, 1.0, 0.8], [1.0, 1.0, 0.8]);

window.onload = function(){
    ACTIVE_SCENE.drawScene();
}