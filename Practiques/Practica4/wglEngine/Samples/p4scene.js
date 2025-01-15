//Use launcher or initialize server running: "python -m http.server 8000" on the project folder
//Navigate to http://localhost:8000/baseScene.html

//Set scene as active
const ACTIVE_SCENE = currentScene;

//Initialize object instances

const floor = new MeshActor(base_plane);
floor.setMatrix(0, -10, -5, 200);
floor.setColor([1.0, 1.0, 1.0, 1.0]);

const sphere1 = new MeshActor(base_sphere);
sphere1.setMatrix(-55, 25, 85, 30);
sphere1.setColor([1.0, 1.0, 1.0, 1.0]);

const sphere2 = new MeshActor(base_sphere);
sphere2.setMatrix(0, 20, 0, 5);
sphere2.setColor([1.0, 1.0, 1.0, 1.0]);

const arrowX = new MeshActor(base_arrowX);
arrowX.setMatrix(0, -9, -5, 40);
const arrowY = new MeshActor(base_arrowY);
arrowY.setMatrix(0, -9, -5, 40);
const arrowZ = new MeshActor(base_arrowZ);
arrowZ.setMatrix(0, -9, -5, 40);

const L00 = new PointLight(1.45, 90, [-45, 11, 0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]);
const L01 = new PointLight(2, 100, [27, 19.5, -66], [0.0, 1.0, 1.0], [0.0, 1.0, 1.0], [0.0, 1.0, 1.0]);
const L02 = new PointLight(2, 300, [0, 80, 225], [1.0, 1.0, 0.0], [1.0, 1.0, 0.0], [1.0, 1.0, 0.0]);
const L03 = new PointLight(5, 150, [-45, 135, 120], [1.0, 1.0, 0.8], [1.0, 1.0, 0.8], [1.0, 1.0, 0.8]);

window.onload = function(){
    ACTIVE_SCENE.drawScene();
}