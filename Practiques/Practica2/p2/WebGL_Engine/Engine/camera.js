class Camera {
    constructor(nearPlane = 0.1, farPlane = 250.0, fov = 4) 
    {
        this.nearPlane = nearPlane;
        this.farPlane = farPlane;
        this.fov = fov;
        this.projectionMatrix = mat4.create();
        
        this.initProjectionMatrix();
    }

    initProjectionMatrix() 
    {
        mat4.perspective(this.projectionMatrix, Math.PI / this.fov, 1.0, this.nearPlane, this.farPlane);
    }

    getProjection() 
    {
        return this.projectionMatrix;
    }
}
