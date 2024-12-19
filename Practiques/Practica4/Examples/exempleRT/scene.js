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