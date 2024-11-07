class Camera {
    constructor(inNearPlane, inFarPlane) 
    {
        //type: fps, editor ...
        //this.type = inType;
        this.nearPlane = inNearPlane;
        this.farPlane = inFarPlane;
        this.fov = degToRad(inFov.value);
        console.log("INITIAL FOV: " + this.fov);
        this.projectionMatrix = mat4.create();
        
        this.setProjectionMatrix();
        updateFovDisplay(inFov.value);
    }

    setProjectionMatrix() 
    {
        mat4.perspective(this.projectionMatrix, this.fov, getCanvasRatio(window.canvas), this.nearPlane, this.farPlane);
    }

    getProjection() 
    {
        return this.projectionMatrix;
    }
}

//projections->viewing->model->viewport
//
//LookAt(eye, at, up) -> frame of reference
//mat4.lookAt(out, p, c, up)
//move eye -> modify perspective?
//move eye + center -> move camera through space
//
//Shader -> gl_Position = projection * view * model * vec4(position, 1.0) 
//
//MVP matrix -> mults apply from the end, so it's PVM
//
//examples-> mueveLaCamara.js / html
//
//Implement:
    //fpsCam:
        //wasd (hold)-> movement
        //ctrl (hold) -> float down
        //space (hold) -> float up
        //shift (hold) -> sprint
        //
    //editorCam:
        //lAlt + lMouse drag: pan around, AKA move eye in a "sphere" around center/at
        //lAlt + 
        //