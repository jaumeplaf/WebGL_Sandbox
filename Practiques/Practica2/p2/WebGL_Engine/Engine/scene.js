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
        initializeEventListeners(this, this.input);
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
        //We need to use "requestAnimationFrame(() => scene.drawScene())" instead of "requestAnimationFrame(scene.drawScene)" to have access to "this", and it's properties

        window.gl.clearColor(this.input.fogColor[0], this.input.fogColor[1], this.input.fogColor[2], this.input.fogColor[3]);
        
        window.gl.clear(window.gl.COLOR_BUFFER_BIT | window.gl.DEPTH_BUFFER_BIT);
        
        this.updateDeltaTime();
        updateFpsCounter(this.deltaTime, 2);

        for(let collection of this.collections){
            collection.update(this.deltaTime);

            collection.shader.use();
            updateUniforms(this.input, collection.shader.program);
            collection.shader.setProjection(this.camera.getProjection());

            collection.draw(this.input);
        }
        requestAnimationFrame(() => P2.drawScene())
    }
}