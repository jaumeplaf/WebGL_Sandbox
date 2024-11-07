class Scene
{
    constructor(inCamera)
    {
        this.collections = [];
        this.camera = inCamera;
        this.fov;
        this.input = new InputParameters(this.camera);
        this.previousTime = performance.now();
        this.currentTime;
        this.deltaTime;
        
        this.input.initializeEventListeners(this);
    }

    addCollection(inCollection)
    {
        this.collections.push(inCollection);
    }

    updateDeltaTime()
    {
        this.currentTime = performance.now();
        this.deltaTime = (this.currentTime - this.previousTime) / 1000;
        this.previousTime = this.currentTime;
    }

    updateFov(newFov)
    {
        this.camera.fov = degToRad(newFov);
        this.camera.setProjectionMatrix();
        updateFovDisplay(newFov);
    }

     drawScene()
    {
        //TODO: fix (returning NaN), make it so it only triggers while key is pressed!
        //this.camera.updateCameraPosition();
        
        
        window.gl.clearColor(this.input.fogColor[0], this.input.fogColor[1], this.input.fogColor[2], this.input.fogColor[3]);
        
        window.gl.clear(window.gl.COLOR_BUFFER_BIT | window.gl.DEPTH_BUFFER_BIT);
        
        this.updateDeltaTime();
        updateFpsCounter(this.deltaTime, 2);
        
        for(let collection of this.collections){
            collection.update(this.deltaTime);
            
            collection.shader.use();
            
            this.input.updateUniforms(collection.shader.program);
            collection.shader.setProjection(this.camera.getProjectionMatrix());
            collection.shader.setView(this.camera.getViewMatrix());
            
            collection.draw(this.input);
        }

        //We need to use "requestAnimationFrame(() => scene.drawScene())" instead of "requestAnimationFrame(scene.drawScene)" to have access to "this", and it's properties
        requestAnimationFrame(() => P2.drawScene())
    }

}