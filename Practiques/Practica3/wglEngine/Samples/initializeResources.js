//Initialize camera
const camera01 = new Camera(0.1, 500.0, [15,15,15], [0,15,-1]);

//Initialize player
const player01 = new Player(camera01);

//Initialize scene  
const currentScene = new Scene(camera01, player01);

const t_woodTrim_basecolor = new TextureObject("wglEngine/Resources/Textures/trim_baseColor.png");
const t_woodTrim_normal = new TextureObject("wglEngine/Resources/Textures/trim_normal.png");
const t_painterly01 = new TextureObject("wglEngine/Resources/Textures/PainterlyTexture01.png");

//Initialize shaders. Shaders must be declared in the HTML document and have an ID
const m_flat01 = new Material(currentScene, "VS_01", "FS_01", false);

const m_WoodTrim01 = new Material(currentScene, "VS_01", "FS_01", true);
m_WoodTrim01.assignTexture(t_woodTrim_basecolor, 'baseColor');
m_WoodTrim01.assignTexture(t_woodTrim_normal, 'normalMap');

const m_ExampleText01 = new Material(currentScene, "VS_01", "FS_01", true);
m_ExampleText01.assignTexture(t_painterly01, 'baseColor');




//Initialize MeshObject
const base_plane = new MeshObject(SM_Plane, m_flat01);
const base_cube = new MeshObject(SM_Cube, m_ExampleText01);
const base_arrowX = new MeshObject(SM_DebugArrow_X, m_flat01);
const base_arrowY = new MeshObject(SM_DebugArrow_Y, m_flat01);
const base_arrowZ = new MeshObject(SM_DebugArrow_Z, m_flat01);
const base_suzanne = new MeshObject(SM_Suzanne, m_flat01);

const base_barrel = new MeshObject(Barrel01, m_WoodTrim01);
const base_barrel2 = new MeshObject(Barrel02, m_ExampleText01);
