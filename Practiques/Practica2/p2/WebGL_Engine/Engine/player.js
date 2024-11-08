class Player 
{
    constructor(inCamera)
    {
        this.camera = inCamera;
        this.walkSpeed = .25;
        this.walkSpeed *= 0.1;
        this.aimSpeed = 0.1;
                
        this.moveForward = false;
        this.moveLeft = false;
        this.moveBack = false;
        this.moveRight = false;

    }

    setWalkSpeed(newSpeed)
    {
        this.walkSpeed = newSpeed;
    }

    setAimSpeed(newSpeed)
    {
        this.aimSpeed = newSpeed;
    }

    updateFov(newFov)
    {
        this.camera.fov = degToRad(newFov);
        this.camera.setProjectionMatrix();
        updateFovDisplay(newFov);
    }

    isMoving()
    {
        if(this.moveForward || this.moveLeft || this.moveBack || this.moveRight)
        {
            return true;
        }
    }

    moveCamera()
    {
        if(this.isMoving()){
            this.camera.updateCameraPosition(this);
        }
    }

}