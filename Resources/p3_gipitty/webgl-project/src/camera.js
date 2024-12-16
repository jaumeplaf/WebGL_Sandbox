class Camera 
{
    constructor(inNearPlane, inFarPlane, initPos = [0,0,0], initTarg = [0,0,-1]) 
    {
        this.position = initPos;
        this.target = initTarg;
        this.up = [0,1,0];

        this.yaw = Math.PI;
        this.pitch = 0;

        this.floor = -9;
        this.ceiling = 89;
        this.maxRadius = 95;
        this.constraints = false;

        this.positionPOI = null;
        this.targetPOI = null;

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
        mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);
    }

    getViewMatrix()
    {
        return this.viewMatrix;
    }

    updatePosition(newPosition)
    {
        this.position = newPosition;
        this.setViewMatrix();
    }

    updateTarget(newTarget)
    {
        this.target = newTarget;
        this.setViewMatrix();
    }

    savePOI(position, target) 
    {
        this.positionPOI = position;
        this.targetPOI = target;
    }

    loadPOI() 
    {
        if (this.positionPOI && this.targetPOI) {
            this.updatePosition(this.positionPOI);
            this.updateTarget(this.targetPOI);
        }
    }
}