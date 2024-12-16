// This file serves as the entry point for the application. It initializes the scene, camera, player, and other components, and starts the rendering loop.

const canvas = document.getElementById("wglCanvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    alert("WebGL 2.0 is not available");
}

const camera = new Camera(0.1, 1000.0, [0, 0, 5], [0, 0, 0]);
const player = new Player(camera);
const currentScene = new Scene(camera, player);

// Initialize materials and textures
const material = new Material(currentScene, "VS_01", "FS_01");
const texture1 = new TextureObject("assets/textures/texture1.png");
const texture2 = new TextureObject("assets/textures/texture2.png");

// Initialize MeshObjects
const basePlane = new MeshObject(SM_Plane, material);
const baseCube = new MeshObject(SM_Cube, material);

// Initialize object instances
const floor = new MeshActor(basePlane);
floor.setMatrix(0, -1, 0, 100);
floor.setColor([0.6, 0.6, 0.6, 1.0]);

currentScene.addMeshActor(floor);

// Start the rendering loop
function render() {
    currentScene.drawScene();
    requestAnimationFrame(render);
}

render();