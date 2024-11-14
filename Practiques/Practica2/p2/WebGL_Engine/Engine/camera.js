class Camera 
{
    constructor(inNearPlane, inFarPlane) 
    {
        //type: fps, editor ...
        //this.type = inType;

        this.position = [0,0,0];
        this.target = [0,0,-1];
        this.up = [0,1,0];

        this.yaw = Math.PI //X rotation
        this.pitch = 0 //Y rotation

        this.floor = 1;
        this.ceiling = 50;
        //his.maxDist = 50;
        //this.dist = this.getDistance();
        //this.nextPosition;
        //this.nextDist;

        this.nearPlane = inNearPlane;
        this.farPlane = inFarPlane;
        this.fov = degToRad(inFov.value);
        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        
        this.initializeCamera();
    }

    initializeCamera()
    {
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

    getSprint(inPlayer)
    {
        if(inPlayer.sprint) {
            inPlayer.currSpeed = inPlayer.sprintMult * inPlayer.walkSpeed;
            inPlayer.currFloat = inPlayer.sprintMult * inPlayer.floatSpeed;
        }
        else{
            inPlayer.currSpeed = inPlayer.walkSpeed;
            inPlayer.currFloat = inPlayer.floatSpeed;
        }
    }
    
    rotateView(deltaYaw, deltaPitch)
    {
      this.yaw -= deltaYaw;
      this.pitch -= deltaPitch;
    
      const maxPitch = Math.PI / 2 - 0.01;
      this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
    
      let newForward = vec3.fromValues(
          Math.cos(this.pitch) * Math.sin(this.yaw),
          Math.sin(this.pitch),
          Math.cos(this.pitch) * Math.cos(this.yaw)
      );
    
      vec3.add(this.target, this.position, newForward);
    
      this.setViewMatrix();
    }

    getDirectionVectors()
    {
        let forw = vec3.subtract([], this.target, this.position);
        this.forwardVec = vec3.normalize([], forw);

        let righ = vec3.cross([], this.forwardVec, this.up)
        this.rightVec = vec3.normalize([], righ);

        this.upVec =  vec3.normalize([], this.up);
    }

    updateCameraPosition(inPlayer)
    {
        this.getDirectionVectors();
        this.getSprint(inPlayer);

        if(inPlayer.moveForward && !inPlayer.moveBack){
            this.position[0] += this.forwardVec[0] * inPlayer.currSpeed;
            this.position[2] += this.forwardVec[2] * inPlayer.currSpeed;
            this.target[0] += this.forwardVec[0] * inPlayer.currSpeed;
            this.target[2] += this.forwardVec[2] * inPlayer.currSpeed;
        }
        if(inPlayer.moveBack){
            this.position[0] -= this.forwardVec[0] * inPlayer.currSpeed;
            this.position[2] -= this.forwardVec[2] * inPlayer.currSpeed;
            this.target[0] -= this.forwardVec[0] * inPlayer.currSpeed;
            this.target[2] -= this.forwardVec[2] * inPlayer.currSpeed;
        }
        if(inPlayer.moveLeft){
            this.position[0] -= this.rightVec[0] * inPlayer.currSpeed;
            this.position[2] -= this.rightVec[2] * inPlayer.currSpeed;
            this.target[0] -= this.rightVec[0] * inPlayer.currSpeed;
            this.target[2] -= this.rightVec[2] * inPlayer.currSpeed;
        }
        if(inPlayer.moveRight && !inPlayer.moveLeft){
            this.position[0] += this.rightVec[0] * inPlayer.currSpeed;
            this.position[2] += this.rightVec[2] * inPlayer.currSpeed;
            this.target[0] += this.rightVec[0] * inPlayer.currSpeed;
            this.target[2] += this.rightVec[2] * inPlayer.currSpeed;
        }
        if(inPlayer.moveUp && !inPlayer.moveDown && this.position[1] <= this.ceiling){
            this.position[1] += this.upVec[1] * inPlayer.currFloat;
            this.target[1] += this.upVec[1] * inPlayer.currFloat;
        }
        if(inPlayer.moveDown && this.position[1] >= this.floor){
            this.position[1] -= this.upVec[1] * inPlayer.currFloat;
            this.target[1] -= this.upVec[1] * inPlayer.currFloat;
        }

        this.setViewMatrix();
    }
}



//move eye + center -> move camera through space
//MVP matrix -> mults apply from the end, so it's P*V*M
//Implement:
    //fpsCam: 
        //fix trackpad
        //
        //save position/s, get position/s
    //editorCam:
        //lAlt + lMouse drag: pan around, AKA move eye in a "sphere" around center/at
        //lAlt + [...]
        //