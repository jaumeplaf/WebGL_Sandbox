class Camera {
    constructor(inNearPlane, inFarPlane) 
    {
        //type: fps, editor ...
        //this.type = inType;

        this.position = [0,0,0];
        this.target = [0,0,-1];
        this.up = [0,1,0];

        
        this.moveForward = false;
        this.moveLeft = false;
        this.moveBack = false;
        this.moveRight = false;

        this.walkSpeed = 0.0001;
        this.aimSpeed = 0.1;

        this.nearPlane = inNearPlane;
        this.farPlane = inFarPlane;
        this.fov = degToRad(inFov.value);
        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        
        this.setProjectionMatrix();
        this.setViewMatrix(this.position, this.target, this.up);
        updateFovDisplay(inFov.value);
    }

    setProjectionMatrix() 
    {
        mat4.perspective(this.projectionMatrix, this.fov, getCanvasRatio(window.canvas), this.nearPlane, this.farPlane);
    }

    getProjectionMatrix() 
    {
        return this.projectionMatrix;
    }

    setViewMatrix()
    {
        this.viewMatrix = mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);
    }

    getViewMatrix()
    {
        return this.viewMatrix;
    }

    setWalkSpeed(newSpeed)
    {
        this.walkSpeed = newSpeed;
    }

    setAimSpeed(newSpeed)
    {
        this.aimSpeed = newSpeed;
    }

    getDirectionVectors()
    {
        this.forwardVec = vec3.normalize([], vec3.fromValues([], this.target, this.position));
        this.rightVec = vec3.normalize([], vec3.cross([], this.forwardVec, this.up));
    }

    updateCameraPosition()
    {
        this.getDirectionVectors();
        console.log("POSITION " + this.position);
        console.log("FORW " + this.forwardVec);
        console.log("RIGHT " + this.rightVec);
        
        if(this.moveForward){
            this.position[0] += this.forwardVec[0] * this.walkSpeed;
            this.position[1] += this.forwardVec[1] * this.walkSpeed;
            this.position[2] += this.forwardVec[2] * this.walkSpeed;
            this.target[0] += this.forwardVec[0] * this.walkSpeed;
            this.target[1] += this.forwardVec[1] * this.walkSpeed;
            this.target[2] += this.forwardVec[2] * this.walkSpeed;
        }
        if(this.moveBack){
            this.position[0] -= this.forwardVec[0] * this.walkSpeed;
            this.position[1] -= this.forwardVec[1] * this.walkSpeed;
            this.position[2] -= this.forwardVec[2] * this.walkSpeed;
            this.target[0] -= this.forwardVec[0] * this.walkSpeed;
            this.target[1] -= this.forwardVec[1] * this.walkSpeed;
            this.target[2] -= this.forwardVec[2] * this.walkSpeed;
        }
        if(this.moveLeft){
            this.position[0] -= this.rightVec[0] * this.walkSpeed;
            this.position[1] -= this.rightVec[1] * this.walkSpeed;
            this.position[2] -= this.rightVec[2] * this.walkSpeed;
            this.target[0] -= this.rightVec[0] * this.walkSpeed;
            this.target[1] -= this.rightVec[1] * this.walkSpeed;
            this.target[2] -= this.rightVec[2] * this.walkSpeed;
        }
        if(this.moveRight){
            this.position[0] += this.rightVec[0] * this.walkSpeed;
            this.position[1] += this.rightVec[1] * this.walkSpeed;
            this.position[2] += this.rightVec[2] * this.walkSpeed;
            this.target[0] += this.rightVec[0] * this.walkSpeed;
            this.target[1] += this.rightVec[1] * this.walkSpeed;
            this.target[2] += this.rightVec[2] * this.walkSpeed;
        }

        this.setViewMatrix();
    }
}



//move eye + center -> move camera through space
//
//MVP matrix -> mults apply from the end, so it's P*V*M
//
//examples-> mueveLaCamara.js / html
//
//Implement:
    //fpsCam:
        //wasd (hold)-> movement
        //ctrl (hold) -> float down
        //space (hold) -> float up
        //shift (hold) -> sprint
        //mouse -> view
    //editorCam:
        //lAlt + lMouse drag: pan around, AKA move eye in a "sphere" around center/at
        //lAlt + 
        //