class Scene
{

    constructor()
    {
        this.collections = [];
    }
    addCollection(collection, shader)
    {
        this.collections.push(collection);
    }
    
     drawScene(camera)
    {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        for(let collection of this.collections){
            collection.shader.use();
            collection.shader.setProjection(camera.getProjection());
            collection.draw();
        }
    }
 
}