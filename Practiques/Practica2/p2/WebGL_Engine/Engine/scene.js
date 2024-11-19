class Scene
{
    constructor(inCamera, inPlayer)
    {
        this.collections = [];
        this.camera = inCamera;
        this.player = inPlayer;
        this.input = new InputParameters(this.camera);
        this.previousTime = performance.now();

        this.input.initializeEventListeners(this);
    }

    addCollection(inCollection)
    {
        this.collections.push(inCollection);
    }

    updateDeltaTime() 
    {
        const now = performance.now();
        this.deltaTime = Math.min((now - this.previousTime) / 1000, 0.1);
        this.previousTime = now;
    }

     drawScene() //Main rendering loop
    {
        this.player.moveCamera();
        
        window.gl.clearColor(this.input.fogColor[0], this.input.fogColor[1], this.input.fogColor[2], this.input.fogColor[3]);
        
        window.gl.clear(window.gl.COLOR_BUFFER_BIT | window.gl.DEPTH_BUFFER_BIT);
        
        this.updateDeltaTime();
        updateFpsCounter(this.deltaTime, 2);

        for(let collection of this.collections)
        {
            
            collection.shader.use();
            
            this.input.updateUniforms(collection.shader.program);
            collection.shader.setProjection(this.camera.getProjectionMatrix());
            collection.shader.setView(this.camera.getViewMatrix());
            
            collection.draw(this.input);
        }

        //We need to use "requestAnimationFrame(() => scene.drawScene())" instead of "requestAnimationFrame(scene.drawScene)" to have access to "this", and it's properties
        requestAnimationFrame(() => this.drawScene())
    }

}