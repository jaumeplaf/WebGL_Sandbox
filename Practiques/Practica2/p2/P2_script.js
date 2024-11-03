//Initialize camera

let camera01 = new Camera(0.1, 250.0, 4);

//Initialize shaders. Shaders must be declared in the HTML document and have an ID
let masterShader01 = new Shader("baseVS01", "baseFS01");

//Initialize scene
let P2 = new Scene(camera01);


//Initialize GameObject collections, for batch drawing objects with shared shader

let gameObjects01 = new ObjectCollection(camera01);
gameObjects01.initialize(masterShader01);
P2.addCollection(gameObjects01);


//Initialize GameObjects, and assign them to a collection

let cube01 = new GameObject();
let sphere01 = new GameObject();
cube01.initializeObject(exampleCube, masterShader01);
sphere01.initializeObject(exampleSphere, masterShader01);

//Add object instances to draw

cube01.setMatrix(-1, 1, -5, 1);
gameObjects01.add(cube01);

sphere01.setMatrix(1, 1, -15, 1);
gameObjects01.add(sphere01);

    
//Draw 

P2.drawScene(camera01);
//requestAnimationFrame(P2.drawScene(camera01));
