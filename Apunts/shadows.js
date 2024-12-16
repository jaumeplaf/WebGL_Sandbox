//Types: no shadows, sharp, soft, special effects
//Umbra (no light), penumbra (some light)
//
//GPU:
    //-Shadow volumes - sharp
    //-Shadow mapping (z-buffer) - sharp
    //-Accumulation buffer - soft
//Ray tracing
    //-Ray casting - sharp
    //-Distributed ray tracing - soft
    //-Cone tracing - soft
//Radiosity
    //Hemi-cube projection - soft
//
//Ray tracing example:
    //Mirar equacio ray tracing, equacio lambert lighting (ambient+diffuse+specular), mirar alternatives a lambert?
    //For each fragment, cast ray from eye to fragment geometry, then cast rays from fragment to each light source, check collision for all objects on the scene (excluding self?)
    //Area light -> integral? -> cast rays from fragment geo to light emiter area
    //[...]
//
//Shadow Z-buffer (shadow map) example:
    //Shadow depth map from light source, shadow depth map from eye.
    //Set light "view frustum"
    //Render from light source
    //Save depth values
    //We get shadow depth map
    //
    //Render scene, transform verts to light space
    //[...]
//
//2 shader sets, one for lights one for view
//
//Can be stored in texture mapping
//
//Make sure lights are transformed when camera is moved
//
//Get light object table in shader to iterate through it?
//
//Frame buffer objects (FBO) -> Deferred renderer?
    //Defined by user
    //Render not shown (Off-screen render)
    //Creates a buffer and a texture to depth
    //Can be lower resolution
    //[...]
//
//
//
//
//
//
//
//