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


//TODO: blenderJSONexporter: add warning if faces are not triangulated!!!
//TODO: scene setup (1 character/hero asset with texture+normal map)
//TODO: set up ambient/diffuse/specular
//TODO: texture maps
//TODO: roughness??
//TODO: translucency
//TODO: phong/gouraud/cel shading
//TODO: light table (multiple lights -> look examples)
//will need liveServer/local server to enable texture import! CORS