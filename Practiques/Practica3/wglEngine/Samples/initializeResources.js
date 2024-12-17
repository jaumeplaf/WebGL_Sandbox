//Initialize camera
const camera01 = new Camera(0.1, 500.0, [15,15,15], [0,15,-1]);

//Initialize player
const player01 = new Player(camera01);

//Initialize scene  
const currentScene = new Scene(camera01, player01);

const t_basecolor = new TextureObject("wglEngine/Resources/Textures/trim_baseColor.png");

//Initialize shaders. Shaders must be declared in the HTML document and have an ID
const material01 = new Material(currentScene, "VS_01", "FS_01");


//Initialize MeshObject
const base_plane = new MeshObject(SM_Plane, material01);
const base_cube = new MeshObject(SM_Cube, material01);
const base_arrowX = new MeshObject(SM_DebugArrow_X, material01);
const base_arrowY = new MeshObject(SM_DebugArrow_Y, material01);
const base_arrowZ = new MeshObject(SM_DebugArrow_Z, material01);

const base_barrel = new MeshObject(Barrel01, material01);
