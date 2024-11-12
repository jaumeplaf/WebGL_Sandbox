class Scene
{
    constructor(inCamera, inPlayer)
    {
        this.collections = [];
        this.camera = inCamera;
        this.fov;
        this.player = inPlayer;
        this.input = new InputParameters(this.camera);
        this.previousTime = performance.now();
        this.currentTime;
        this.deltaTime;

        this.baseGrid;
        this.baseGridModel;
        this.baseGridShader;

        //this.initializeGrid();
        
        this.input.initializeEventListeners(this);
    }

    //TODO: fix
    initializeGrid()
    {
        this.baseGridShader = new Shader("VS01", "FS01");
        this.baseGridModel = generateGrid(10, .1);

        this.baseGrid = new GameObject();
        //this.baseGrid.initializeObject(this.baseGridModel, this.baseGridShader);
        this.baseGrid.initializeObject(examplePlane, this.baseGridShader);

        this.baseGrid.setMatrix(0, -2, -25, 1);
        this.baseGrid.setAnimation(0, [-0,0,0]);
        this.baseGrid.setBaseColor([0.7,0.7,0.7]);

        //console.log(this.baseGridModel);
    }

    addCollection(inCollection)
    {
        this.collections.push(inCollection);
    }

    //TODO: fix delta time infinity scaling

    updateDeltaTime()
    {
        this.currentTime = performance.now();
        this.deltaTime = (this.currentTime - this.previousTime) / 1000;
        this.previousTime = this.currentTime;
    }

     drawScene()
    {

        this.player.moveCamera();
        
        window.gl.clearColor(this.input.fogColor[0], this.input.fogColor[1], this.input.fogColor[2], this.input.fogColor[3]);
        
        window.gl.clear(window.gl.COLOR_BUFFER_BIT | window.gl.DEPTH_BUFFER_BIT);
        
        this.updateDeltaTime();
        updateFpsCounter(this.deltaTime, 2);
        
        /*
        this.baseGrid.shader.use();
        this.baseGrid.animate(this.deltaTime * this.baseGrid.timeScale, this.baseGrid.axis)
        this.input.updateUniforms(this.baseGrid.shader);
        this.baseGrid.shader.setProjection(this.camera.getProjectionMatrix());
        this.baseGrid.shader.setView(this.camera.getViewMatrix());
        this.baseGrid.draw(this.input);
        */

        for(let collection of this.collections){
            //collection.update(this.deltaTime);
            
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