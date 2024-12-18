//illumination + shading

//illumination:
//
//realtime vs offline
//GI vs local
//color->ambient,diffuse,specular
//types of emitting light:
    //incandescence: sunlight, lightbulbs, fires...
    //luminescence: fluorescents, neon, LED, tv screen...
//ambient, point, spot, distant light
//

//shading:
//
//light absorption (responsible for color)
//light scattering (change in direction/wavelength)
    //fluorescence
    //phosphorescence
//[solids/liquids:] 
    //light reflection
        //change in direction of a wavefront between media
        //Diffuse (observer independent), mirror (depends of the observer, a1=a1'), glossy(specular)
        //BRDF (E.g. Phong): defines how light is reflected at a point for a given wavelenght on an opaque surface f(N,L,V,lambda)
    //light refraction
//[gas:] 
    //volume scattering
//
//shading model: flat / smooth (Gouraud/Phong)
//

//GLSL -> Typedef? Struct?
//

//UE5 shading bug -> guoraud? can it be changed for phong?



//blender py json: add ticks for each export attribute (pos, index, normal, color, uv, uv2, uv3)

//TEXTURE MAPPING:
//
//UV projection -> actual projection formulas
//
//Filtering:
    //Nearest neighbor (box filter) -> steps -> blocky
    //Linear interpolation -> blend -> blending all 4 neighbors -> blurry
//
//HyperTextures? 3D+? N dimension noise?
//
//Irradiance map? HDRI? -> environment map -> webgl2 SamplerCube
//
//AO -> calcula integral per mirar que te a prop?
//
//
//Ray tracing & extensions: (Practica 4 NO webgl, nomes utiitzem <canvas>, ?webgl "editor", "render mode" button?, "colored room" scene?)
    //Pixel-model intersection
    //[...]
    //
    //Ray-triangle intersection:
        //Compute intersection with triangle plane
        //Check if intersection is inside triangle area
            //Precalculate UV, UU, VV, D, or:
            //Calculate with cross products
    //look recursive algo theory example, action RayTrace(scene, r)
    //
//
//Acceleration structures: (very necessary)
        //Bounding volumes
            //Boxes: min/max values of x y z
            //Spheres: min/max values of x y z, get center and calculate sphere
            //Check hit on lowest level volume, then check volumes inside that volume
        //Binary trees (?)
        //Octrees: 3d grid, splits in parts and "discards" empty ones
        //Uniform grids: 3d grid
//
//Reflections:
    //Snell's law!
//
//
//Components:
    //Diffuse (same as ray casting, with shadows)
    //Specular (same as ray casting, with shadows)
    //Mirror reflexion (recursive)
    //Refraction (recursive)
//
//?Recursive algos? "action"? 
    //Stop condition:
        //Lose "importance" on each bounce -> Ray tree depth
        //Max bounces
//
//Ray tree:
    //Each bounce splits into reflection and refraction
    //Tree from eye (root), bouncing in scene, then to each light
//
//
//Antialiasing (Ray tracing):
    //Jittering: area-weighted jittered gaussian distribution
    //Conventional ray tracing: 
        //infinitesimally thin rays
        //perfect, sharp multiple reflections and shadows
        //NOT reality
        //Surfaces are NOT perfectly smooth
    //Distributed ray tracing! Fixes this -> Cook-Porter-Carpenter -> rendering equation (?)
        //Can enable DOF, motion blur, diffuse reflection, soft shadows...
        //Sample number -> more definition
        //Transparency / frosted glass translucency
        //
//
//?Look at instantiation
//
//
//DOF: [...]
//
//Motion blur: 
    //Distribute rays in time
        //Give each ray a time value
        //E.g. jittered time distribution during the "shutter open"
        //for intersection, use the object position at the first ray's time
        //Combine ray colors
    //Temporal jittering sampling
//
//Global Illumination (GI)
//
//
//
//
//
//
//
//
//
//
//


//TODO: blenderJSONexporter: add warning if faces are not triangulated!!!
//TODO: scene setup (1 character/hero asset with texture+normal map)
//TODO: set up ambient/diffuse/specular
//TODO: texture maps
//TODO: roughness??
//TODO: translucency
//TODO: phong/gouraud/cel shading
//TODO: light table (multiple lights -> look examples)
//will need liveServer/local server to enable texture import! CORS