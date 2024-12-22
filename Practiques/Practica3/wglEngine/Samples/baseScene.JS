//Use launcher or initialize server running: "python -m http.server 8000" on the project folder
//Navigate to http://localhost:8000/baseScene.html

//Set scene as active
const ACTIVE_SCENE = currentScene;

//Initialize object instances

const floor = new MeshActor(base_floor);
floor.setMatrix(0, -10, -5, 100);
floor.setColor([0.6, 0.6, 0.6, 1.0]);

const arrowX = new MeshActor(base_arrowX);
arrowX.setMatrix(0, -9, -5, 40);
const arrowY = new MeshActor(base_arrowY);
arrowY.setMatrix(0, -9, -5, 40);
const arrowZ = new MeshActor(base_arrowZ);
arrowZ.setMatrix(0, -9, -5, 40);

const suz01 = new MeshActor(base_suzanne);
suz01.setMatrix(-15, 30, -5, 10);
suz01.setColor([0.3, 0.7, 0.7, 1.0]);
suz01.setRotation(180, [0, 1, 0]);

const suz02 = new MeshActor(base_suzanne);
suz02.setMatrix(-45, 30, -5, 10);
suz02.setColor([0.8, 0.3, 0.3, 1.0]);
suz02.setRotation(180, [0, 1, 0]);

const barrel01 = new MeshActor(base_barrel);
barrel01.setMatrix(-15, -10, -5, 10);

const barrel02 = new MeshActor(base_barrel2);
barrel02.setMatrix(-45, -10, -5, 10);
barrel02.setRotation(120, [1, 1, 0]);

const barrel03 = new MeshActor(base_barrel);
barrel03.setMatrix(-22, -10, -12, 10);
barrel03.setRotation(90, [0, 1, 0]);

const cart01 = new MeshActor(base_cart01);
cart01.setMatrix(-35, -10, 20, 10);
cart01.setRotation(-40, [0, 1, 0]);

const shark01A = new MeshActor(base_shark01A);
shark01A.setMatrix(27.5, 7.5, -17.5, 15);
shark01A.setRotation(90, [0, 1, 0]);

const testPoly = new MeshActor(base_testPolygon);
testPoly.setMatrix(40, -10, 10, 10);


//TODO: IMPLEMENT MULTIPLE LIGHTS
//TODO: CHANGE LIGHT PROXY COLOR FROM La to Ld
const L01 = new PointLight(3, 100, [-30, 20, 10], [0.7, 0.7, 0.7], [1.0, 0.8, 0.0], [1.0, 1.0, 0.8]);
//const L02 = new SpotLight(3,[20, 40, 0], [0.0, 1.0, 0.0], [0.8, 0.8, 0.8], [1.0, 1.0, 1.0], [0.0, -1.0, 0.0], 30.0);
//const L03 = new AreaLight(10,[40, 40, 0], [0.0, 0.0, 1.0], [0.8, 0.8, 0.8], [1.0, 1.0, 1.0], [0.0, -1.0, 0.0], 3.0, 1.0);

window.onload = function(){
    ACTIVE_SCENE.drawScene();
}