//Initialize camera
const camera01 = new Camera(
    0.1, // Near plane
    5000.0, // Far plane
    [20, 15, -55], // Initial Position
    [0, 20, -1] // Initial Target
);

//Initialize player
const player01 = new Player(
    camera01 //Camera
);

//Initialize scene  
const currentScene = new Scene(
    camera01, //Camera
    player01 //Player
);

//Initialize Materials. Shaders must be declared in the HTML document and have an ID
const m_matte01 = new Material(
    currentScene, // Scene
    "VS_01", // Vertex Shader ID
    "FS_01", // Fragment Shader ID
    false, //Base color texture
    false, //Normal map texture
    false //Flip V coords
);
m_matte01.setMaterialAttributes(
    [0.5, 0.5, 0.5], // Ambient
    [0.5, 0.5, 0.5], // Diffuse
    [0.5, 0.5, 0.5], // Specular
    10.0 // Shininess
);

const m_shiny01 = new Material(
    currentScene, // Scene
    "VS_01", // Vertex Shader ID
    "FS_01", // Fragment Shader ID
    false, //Base color texture
    false, //Normal map texture
    false //Flip V coords
    );
m_shiny01.setMaterialAttributes(
    [.5, .5, .5], // Ambient
    [0.6, 0.6, 0.6], // Diffuse
    [0.9, 0.9, 0.9], // Specular
    100.0 // Shininess
);

//Initialize MeshObjects
const base_plane = new MeshObject(
    SM_Plane, //Mesh origin
    m_matte01 //Material
);
const base_sphere = new MeshObject(
    SM_Sphere, //Mesh origin
    m_matte01 //Material
);
const base_triangle = new MeshObject(
    SM_Triangle, //Mesh origin
    m_matte01 //Material
);
const base_lightBulb = new MeshObject(
    SM_Sphere, //Mesh origin
    m_matte01 //Material
);
