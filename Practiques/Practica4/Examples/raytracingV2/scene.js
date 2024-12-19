var Screen = {
    width 	: 0,
    height 	: 0,
    canvas 	: null,
    context : null,
    buffer 	: null,
};

var Scene = {
    Fons: [0, 0, 0],
    Shapes: [
        {
            id		: "pla_groc",
            tipus	: "pla",
            normal	: [0,1,0],
            point   : [0,0,0],
            // Material:
            // Rd, Rs, Ra (colors)
            // alpha specular (float)
            //  Reflexion and/or Transmision (float)

        },
        {
            id		: "pla_blau",
            tipus	: "pla",
            normal	: [0,0,1],
            point   : [0,0,0],
            // Material:
            // Rd, Rs, Ra (colors)
            // alpha specular (float)
            //  Reflexion and/or Transmision (float)

        },
        {
            id		: "esfera_blava",
            tipus	: "esfera",
            radi	: 1.5,
            centre	: [-1.5,1.3,1],
            // Material:
            // Rd, Rs, Ra (colors)
            // alpha specular (float)
            //  Reflexion and/or Transmision (float)

        },
    ],
    Camera: {
        position: [3,3.5,5], 	// posicio camera
        up 		: [0,1,0], 		// vector amunt
        centre  : [-1,0.5,0], 	// centre escena
        fov 	: 60, 			// field of view
        X		: vec3.create(),
        Z		: vec3.create(),
        Y		: vec3.create(),
    },
    Lights: [
        {
            position: vec3.create(), // S'emplena segons els valors entrats
            color   : vec3.create(), // S'emplena segons els valors entrats
        },
        {
            position: vec3.create(), // S'emplena segons els valors entrats
            color   : vec3.create(), // S'emplena segons els valors entrats
        },
    ]
};