var Screen = {
    width 	: 0,
    height 	: 0,
    canvas 	: null,
    context : null,
    buffer 	: null,
};

var Scene = {
    Fons: [1, 0, 0],
    Shapes: [
        // {
        //     id		: "pla_gris",
        //     tipus	: "pla",
        //     normal	: vec3.fromValues(0, 1, 0),
        //     point   : vec3.fromValues( 0, 0, 0),
		// 	material : { ...Silver },
		// 	shadow : false,
		// 	specular : false,
		// 	specularCoeff : null
        // },
        // {
        //     id		: "pla_vermell",
        //     tipus	: "pla",
        //     normal	: vec3.fromValues(0, 0, 1),
        //     point   : vec3.fromValues(0, 0, -0.5),
		// 	material : { ...Ruby },
		// 	shadow : false,
		// 	specular : false,
		// 	specularCoeff : null
        // },
		// {
        //     id		: "pla_groc",
        //     tipus	: "pla",
        //     normal	: vec3.fromValues(0, 0, -1),
        //     point   : vec3.fromValues(0, 0, 100),
		// 	material : { ...Gold },
		// 	shadow : false,
		// 	specular : false,
		// 	specularCoeff : null
        // },
		// {
        //     id		: "pla_lila",
        //     tipus	: "pla",
        //     normal	: vec3.fromValues(1, 0, 0),
        //     point   : vec3.fromValues(-100, 0, 0),
		// 	material : { ...Tin },
		// 	shadow : false,
		// 	specular : false,
		// 	specularCoeff : null
        // },
		// {
        //     id		: "pla_verd",
        //     tipus	: "pla",
        //     normal	: vec3.fromValues(-1, 0, 0),
        //     point   : vec3.fromValues(100, 0, 0),
		// 	material : { ...Jade },
		// 	specular : false,
		// 	shadow : false,
		// 	specularCoeff : null
        // },
		// {
        //     id		: "pla_negre",
        //     tipus	: "pla",
        //     normal	: vec3.fromValues(0, -1, 0),
        //     point   : vec3.fromValues(0, 100, 0),
		// 	material : { ...Obsidian },
		// 	specular : false,
		// 	shadow : false,
		// 	specularCoeff : null
        // },
        {
            id		: "esfera_blava",
            tipus	: "esfera",
            radi	: 1.5,
            centre	: [-1.5,1.5,1],
			material : { ...Silver },
			shadow : true,
			specular : true,
			specularCoeff : 1.0

        },
		{
			id : "triangle1",
			tipus : "triangle",
			a : vec3.fromValues(-3.5, 3.2, 1),
			b : vec3.fromValues(-2.5, 3.2, 1),
			c : vec3.fromValues(-3, 4.0, 1),
			material : { ...Obsidian },
			shadow : true,
			specular : false,
			specularCoeff : 0.7
		},		
		{
			id : "triangle2",
			tipus : "triangle",
			a : vec3.fromValues(0.0, 3.2, 1),
			b : vec3.fromValues(1.0, 3.2, 1),
			c : vec3.fromValues(0.5, 4.0, 1),
			material : { ...Esmerald },
			shadow : true,
			specular : false,
			specularCoeff : null
		},
		{
            id		: "esfera_verda",
            tipus	: "esfera",
            radi	: 0.4,
            centre	: [-2.5,0.4,4],
			material : { ...Jade },
			shadow : true,
			specular : false,
			specularCoeff : null
        },
		{
            id		: "esfera_blava",
            tipus	: "esfera",
            radi	: 0.4,
            centre	: [-1.7,0.4,4],
			material : { ...White_rubber },
			shadow : true,
			specular : true,
			specularCoeff : 0.8
        },
		{
            id		: "esfera_vermella",
            tipus	: "esfera",
            radi	: 0.4,
            centre	: [-0.9,0.4,4],
			material : { ...Red_plastic },
			shadow : true,
			specular : false,
			specularCoeff : null
        },
		{
            id		: "esfera_groga",
            tipus	: "esfera",
            radi	: 0.4,
            centre	: [-0.1,0.4,4],
			material : { ...White_rubber },
			shadow : true,
			specular : true,
			specularCoeff : 0.8
        },
		{
            id		: "esfera_bronze",
            tipus	: "esfera",
            radi	: 0.4,
            centre	: [0.7,0.4,4],
			material : { ...Bronze },
			shadow : true,
			specular : false,
			specularCoeff : null
        }
    ],
    Camera: {
        position: vec3.fromValues(-1, 3.5, 8), 	// posicio camera
        up 		: [0,1,0], 		// vector amunt
        centre  : [-1,0.5,0], 	// centre escena
        fov 	: 60, 			// field of view
        X		: vec3.create(),
        Z		: vec3.create(),
        Y		: vec3.create()
    },
    Lights: [
        {
            position: vec3.fromValues(-1.0, 5.0, 2.0),
            color   : vec3.fromValues(0.75, 0.75, 0.75)
        },
		{
            position: vec3.fromValues(-4.0, 6.0, 2.0),
            color   : vec3.fromValues(0.2, 0.2, 0.2)
        }
    ]
};

//Function to intersect whole scene
function IntersectScene(scene, ray, origin, depth){
    //We get the first hit information
    var hit = computeFirstHit(scene, ray, origin);
    //Check if it's not undefined neither null
    if (hit){
        if (hit.t !== null){
            //Compute light
            var light = computeLight(scene, hit, ray, depth);
            //Check if surface we hit is specular and if we can proceed (necessary to stop recursivity)
            if (hit.specular && depth < 4){
                //Compute reflected ray
                var d1 = computeReflectionDirection(hit, ray); //The new ray will be the vector d1 and origin hit.point
                //Get a little bit modified origin point in order to have correct specular behaviour (avoid "self-specularity")
                var newHitPoint = vec3.add(vec3.create(), hit.point, vec3.scale(vec3.create(), d1, 0.01));
                //Re-intersect whole scene with new vector and ray
                var color = IntersectScene(scene, d1, newHitPoint, depth + 1);
                //Convert into vec3 from gl-matrix
                var colorVec3 = vec3.fromValues(color[0], color[1], color[2]);
                //We add new specular property to light
                var specularContribution = vec3.multiply(vec3.create(), colorVec3, vec3.fromValues(hit.specularCoeff, hit.specularCoeff, hit.specularCoeff));
                light = vec3.add(vec3.create(), light, specularContribution);
            }
            return [light[0], light[1], light[2]];
        }
    }
    return [0.5, 0.5, 0.5];
}

//Function to compute light
function computeLight(scene, hit, ray, depth) {
    var ambientLight = vec3.fromValues(0.1, 0.1, 0.1); // Ambient light contribution
    var lightContribution = vec3.clone(ambientLight);

    for (var light of scene.Lights) {
        var lightDir = vec3.subtract(vec3.create(), light.position, hit.point);
        vec3.normalize(lightDir, lightDir);

        // Check for shadows
        var shadowRay = vec3.clone(lightDir);
        var shadowHit = computeShadowing(scene, shadowRay, hit.point, hit.surfaceId);
        if (shadowHit) {
            continue; // Skip this light if the point is in shadow
        }

        // Diffuse lighting (Lambertian reflectance)
        var diffuseFactor = Math.max(0, vec3.dot(hit.normal, lightDir));
        var diffuse = vec3.multiply(vec3.create(), hit.material.mat_diffuse, light.color);
        vec3.scale(diffuse, diffuse, diffuseFactor);

        // Specular lighting (Phong reflection model)
        var specular = vec3.fromValues(0, 0, 0);
        if (hit.specular) {
            var viewDir = vec3.negate(vec3.create(), ray);
            var reflectDir = computeReflectionDirection(hit, lightDir);
            var specFactor = Math.pow(Math.max(0, vec3.dot(viewDir, reflectDir)), hit.material.alpha[0]);
            specular = vec3.multiply(vec3.create(), hit.material.mat_specular, light.color);
            vec3.scale(specular, specular, specFactor);
        }

        // Add contributions to the light
        vec3.add(lightContribution, lightContribution, diffuse);
        vec3.add(lightContribution, lightContribution, specular);
    }

    return lightContribution;
}