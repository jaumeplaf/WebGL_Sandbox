//Initialize server: "python -m http.server 8000"
//Navigate to http://localhost:8000/baseScene.html

//Set scene as active
const ACTIVE_SCENE = currentScene;

//Initialize object instances

const floor = new MeshActor(base_plane);
floor.setMatrix(0, -10, -5, 1000);
floor.setColor([0.6, 0.6, 0.6, 1.0]);

const arrowX = new MeshActor(base_arrowX);
arrowX.setMatrix(0, 0, -5, 100);
const arrowY = new MeshActor(base_arrowY);
arrowY.setMatrix(0, 0, -5, 100);
const arrowZ = new MeshActor(base_arrowZ);
arrowZ.setMatrix(0, 0, -5, 100);

const suz01 = new MeshActor(base_suzanne);
suz01.setMatrix(-15, 30, -5, 10);
suz01.setColor([0.3, 0.7, 0.7, 1.0]);

const suz02 = new MeshActor(base_suzanne);
suz02.setMatrix(-45, 30, -5, 10);
suz02.setColor([0.8, 0.3, 0.3, 1.0]);

const barrel01 = new MeshActor(base_barrel);
barrel01.setMatrix(-15, 5, -5, 10);

const barrel02 = new MeshActor(base_barrel2);
barrel02.setMatrix(-45, 5, -5, 10);

window.onload = function(){
    ACTIVE_SCENE.drawScene();
}