// This file initializes the WebGL context and sets up rendering configurations. 
// It includes functions for drawing models and managing WebGL states.

window.canvas = null;
window.gl = null;

function getWebGLContext() {
    window.canvas = document.getElementById("wglCanvas");

    try {
        return window.canvas.getContext('webgl2');
    } catch (e) {
    }

    return null;
}

function initWebGL() {
    window.gl = getWebGLContext();

    if (!window.gl) {
        alert("WebGL 2.0 is not available");
        return;
    }

    initRendering();
}

function initRendering() {
    window.gl.lineWidth(1.5);
    window.gl.enable(window.gl.DEPTH_TEST);
    window.gl.enable(window.gl.POLYGON_OFFSET_FILL);
    window.gl.polygonOffset(0.0, 0.0);
    window.gl.enable(window.gl.CULL_FACE);
}

function drawModel(model) {
    const inShader = model.meshObject.material.program;
    window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);

    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferVertices);
    window.gl.vertexAttribPointer(inShader.vertexPositionAttribute, 3, window.gl.FLOAT, false, 0, 0);

    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferNormals);
    window.gl.vertexAttribPointer(inShader.vertexNormalAttribute, 3, window.gl.FLOAT, false, 0, 0);

    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferColors);
    window.gl.vertexAttribPointer(inShader.vertexColorAttribute, 4, window.gl.FLOAT, false, 0, 0);

    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferTexcoords1);
    window.gl.vertexAttribPointer(inShader.texCoords1Attribute, 2, window.gl.FLOAT, false, 0, 0);

    window.gl.polygonOffset(0.0, 0.0);
    window.gl.drawElements(window.gl.TRIANGLES, model.indices.length, window.gl.UNSIGNED_SHORT, 0);
}

// Initiate WebGL 2.0 API
initWebGL();