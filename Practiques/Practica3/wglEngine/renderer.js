//TODO: Add lighting (phong...), ambient/diffuse/specular, multiple lights

window.canvas = null;
window.gl = null;

function getWebGLContext()
{
    window.canvas = document.getElementById("wglCanvas");

    try {
        return window.canvas.getContext('webgl2');
    } 

    catch (e) {
    }

    return null;
}

function initWebGL()
{
    window.gl = getWebGLContext();

    if (!window.gl) {
        alert("WebGL 2.0 is not available");
        return;
    }
    
    initRendering();
}

function initRendering() 
{
    window.gl.lineWidth(1.5);
    
    window.gl.enable(window.gl.DEPTH_TEST);
    
    //Fix Z-fighting
    window.gl.enable(window.gl.POLYGON_OFFSET_FILL);
    window.gl.polygonOffset(0.0, 0.0);
    
    //Enable backface culling
    window.gl.enable(gl.CULL_FACE);
}

function drawModel(model, drawPoints = false)
{
    const inShader = model.meshObject.material.program;
    model.meshObject.material.scene.camera.saveCameraPosition(inShader);
    
    window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferVertices);
    window.gl.vertexAttribPointer(inShader.vertexPositionAttribute, 3, window.gl.FLOAT, false, 0, 0);
    
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferNormals);
    window.gl.vertexAttribPointer(inShader.vertexNormalAttribute, 3, window.gl.FLOAT, false, 0, 0);
    
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferColors);
    window.gl.vertexAttribPointer(inShader.vertexColorAttribute, 4, window.gl.FLOAT, false, 0, 0);
    
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferTexcoords1);
    window.gl.vertexAttribPointer(inShader.texCoords1Attribute, 2, window.gl.FLOAT, false, 0, 0);
    
    if(drawPoints) window.gl.uniform1f(inShader.isPoint, 0.0);
    
    window.gl.drawElements(window.gl.TRIANGLES, model.indices.length, window.gl.UNSIGNED_SHORT, 0);
    
    if(drawPoints) {
        window.gl.uniform1f(inShader.isPoint, 1.0); //Enable point rendering

        window.gl.drawElements(window.gl.POINTS, model.indices.length, window.gl.UNSIGNED_SHORT, 0);
        
        window.gl.uniform1f(inShader.isPoint, 0.0); //Disable point rendering
    }
}

// Initiate WebGL 2.0 API
initWebGL();