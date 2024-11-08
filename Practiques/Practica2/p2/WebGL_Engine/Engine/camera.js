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

    getDirectionVectors()
    {
        let forw = vec3.subtract([], this.target, this.position);
        this.forwardVec = vec3.normalize([], forw);

        let righ = vec3.cross([], this.forwardVec, this.up)
        this.rightVec = vec3.normalize([], righ);

        this.upVec =  vec3.normalize([], this.up);
    }

    rotateView(deltaYaw, deltaPitch)
    {
      // Update yaw and pitch by delta
      this.yaw -= deltaYaw;
      this.pitch -= deltaPitch;

      // Clamp pitch to avoid flipping (around 90 degrees up/down)
      const maxPitch = Math.PI / 2 - 0.01;
      this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

      // Calculate new forward direction from yaw and pitch
      let newForward = vec3.fromValues(
          Math.cos(this.pitch) * Math.sin(this.yaw),
          Math.sin(this.pitch),
          Math.cos(this.pitch) * Math.cos(this.yaw)
      );

      vec3.add(this.target, this.position, newForward);

      this.setViewMatrix();
    }

    updateCameraPosition(inPlayer)
    {
        this.getDirectionVectors();
        
        if(inPlayer.moveForward && !inPlayer.moveBack){
            this.position[0] += this.forwardVec[0] * inPlayer.walkSpeed;
            this.position[2] += this.forwardVec[2] * inPlayer.walkSpeed;
            this.target[0] += this.forwardVec[0] * inPlayer.walkSpeed;
            this.target[2] += this.forwardVec[2] * inPlayer.walkSpeed;
        }
        if(inPlayer.moveBack){
            this.position[0] -= this.forwardVec[0] * inPlayer.walkSpeed;
            this.position[2] -= this.forwardVec[2] * inPlayer.walkSpeed;
            this.target[0] -= this.forwardVec[0] * inPlayer.walkSpeed;
            this.target[2] -= this.forwardVec[2] * inPlayer.walkSpeed;
        }
        if(inPlayer.moveLeft){
            this.position[0] -= this.rightVec[0] * inPlayer.walkSpeed;
            this.position[2] -= this.rightVec[2] * inPlayer.walkSpeed;
            this.target[0] -= this.rightVec[0] * inPlayer.walkSpeed;
            this.target[2] -= this.rightVec[2] * inPlayer.walkSpeed;
        }
        if(inPlayer.moveRight && !inPlayer.moveLeft){
            this.position[0] += this.rightVec[0] * inPlayer.walkSpeed;
            this.position[2] += this.rightVec[2] * inPlayer.walkSpeed;
            this.target[0] += this.rightVec[0] * inPlayer.walkSpeed;
            this.target[2] += this.rightVec[2] * inPlayer.walkSpeed;
        }
        if(inPlayer.moveUp && !inPlayer.moveDown){
            this.position[1] += this.upVec[1] * inPlayer.floatSpeed;
            this.target[1] += this.upVec[1] * inPlayer.floatSpeed;
        }
        if(inPlayer.moveDown){
            this.position[1] -= this.upVec[1] * inPlayer.floatSpeed;
            this.target[1] -= this.upVec[1] * inPlayer.floatSpeed;
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
        //wasd (hold)-> movement DONE
        //ctrl (hold) -> float down
        //space (hold) -> float up
        //shift (hold) -> sprint
        //mouse -> view DONE
    //editorCam:
        //lAlt + lMouse drag: pan around, AKA move eye in a "sphere" around center/at
        //lAlt + 
        //