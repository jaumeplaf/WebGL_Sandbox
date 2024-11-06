class Camera {
    constructor(inNearPlane, inFarPlane, inFov) 
    {
        //type: fps, editor ...
        //this.type = inType;
        this.nearPlane = inNearPlane;
        this.farPlane = inFarPlane;
        this.fov = inFov;
        this.projectionMatrix = mat4.create();
        
        this.initProjectionMatrix();
    }

    initProjectionMatrix() 
    {
        mat4.perspective(this.projectionMatrix, Math.PI / this.fov, getCanvasRatio(window.canvas), this.nearPlane, this.farPlane);
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