//Initialize server: "python -m http.server 8000"
//Navigate to http://localhost:8000/baseScene.html

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

const barrel_01 = new MeshActor(base_barrel);
barrel_01.setMatrix(-5, 5, -5, 10);

currentScene.addMeshActor(floor);
currentScene.addMeshActor(arrowX);
currentScene.addMeshActor(arrowY);
currentScene.addMeshActor(arrowZ);
currentScene.addMeshActor(barrel_01);

//debugInstance("arrowX", arrowX);
//debugInstance("barrel_01", barrel_01);

window.onload = function(){
    currentScene.drawScene();
}