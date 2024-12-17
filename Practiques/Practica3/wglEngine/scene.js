class Scene
{
    constructor(inCamera, inPlayer)
    {
        this.camera = inCamera;
        this.player = inPlayer;

        this.meshActors = [];
        this.textures = [];
        this.currentMaterial = null;
        
        this.previousTime = performance.now();

        this.input = new InputParameters(this.camera);
        this.input.initializeEventListeners(this);
    }

    addMeshActor(inMeshActor)
    {
        const material = inMeshActor.meshObject.material;
        let insertIndex = this.meshActors.length;

        for (let i = 0; i < this.meshActors.length; i++) {
            if (this.meshActors[i].meshObject.material === material) {
                insertIndex = i + 1;
            }
        }
        this.meshActors.splice(insertIndex, 0, inMeshActor);
    }

    addTexture(texturePath)
    {
        const texture = new TextureObject(texturePath);
        this.textures.push(texture);
    }
    
    updateDeltaTime() 
    {
        const now = performance.now();
        this.deltaTime = Math.min((now - this.previousTime) / 1000, 0.1);
        this.previousTime = now;

        this.input.time = now / 1000;
    }

     drawScene() //Main rendering loop
    {
        this.player.moveCamera();
        
        window.gl.clearColor(this.input.fogColor[0], this.input.fogColor[1], this.input.fogColor[2], this.input.fogColor[3]);
        
        window.gl.clear(window.gl.COLOR_BUFFER_BIT | window.gl.DEPTH_BUFFER_BIT);
        
        this.updateDeltaTime();
        updateFpsCounter(this.deltaTime, 2);

        for(let object of this.meshActors)
        {
            let objectMaterial = object.meshObject.material;
            if(objectMaterial != this.currentMaterial){
                objectMaterial.use(this.input);
                this.currentMaterial = objectMaterial;

                // Set textures
                if (objectMaterial.useTextureBaseColor) {
                    objectMaterial.setTexture(objectMaterial.textures['baseColor'], 0, objectMaterial.program.baseColorSampler);
                }
                if (objectMaterial.useTextureNormal) {
                    objectMaterial.setTexture(objectMaterial.textures['normalMap'], 1, objectMaterial.program.normalSampler);
                }
            }
            else {
                console.log("Material already in use");
            }

            objectMaterial.setProjection(this.camera.getProjectionMatrix());
            objectMaterial.setView(this.camera.getViewMatrix());
            
            object.drawMeshActor();

        }

        //We need to use "requestAnimationFrame(() => scene.drawScene())" instead of "requestAnimationFrame(scene.drawScene)" to have access to "this", and it's properties
        requestAnimationFrame(() => this.drawScene())
    }

}