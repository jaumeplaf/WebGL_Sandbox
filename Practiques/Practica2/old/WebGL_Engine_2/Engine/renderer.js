var gl;

function getWebGLContext() 
{
    try {
        return canvas.getContext("webgl2");
    }
    catch(e) {
    }

    return null;
}

function initWebGL()
{
    gl = getWebGLContext();

    if (!gl) {
        alert("WebGL 2.0 no está disponible");
        return;
    }

    initShaders();
    initPrimitives();
    initRendering();

    linkParameters(gl);

    requestAnimationFrame(drawScene);
}
function initBuffers(model) 
{
    model.idBufferVertices = gl.createBuffer ();
    gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
    
    model.idBufferIndices = gl.createBuffer ();
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
}

function draw(model, bColor, lColor) 
{
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    
    gl.uniform1f (program.customShadingMode, shadingMode);
    
    switch(shadingMode){
      case 0: //Wireframe
        wireOpacity = wireframeOpacity.value;
        gl.uniform4f (program.customColor, fogColor[0], fogColor[1], fogColor[2], 1.0 );
        gl.uniform4f (program.customLineColor, lColor[0], lColor[1], lColor[2], 1.0 );
        gl.uniform1f (program.progWireframeOpacity, wireOpacity);
        gl.uniform1f (program.progWireframeAmount, wireframeIgnoreFog);
  
        for (var i = 0; i < model.indices.length; i += 3){
          gl.drawElements (gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i*2);
        }
      break;
  
      case 1: //Color
        wireframeIgnoreFog = 0.0;
        gl.uniform1f (program.progWireframeOpacity, 2.0);
        gl.uniform1f(program.progWireframeAmount, wireframeIgnoreFog);
        gl.uniform4f (program.customColor, bColor[0], bColor[1], bColor[2], 1.0 );
        gl.uniform4f (program.customLineColor, lColor[0], lColor[1], lColor[2], 1.0 );
  
        gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
      break;
  
      case 2: //Color+Wireframe
        gl.polygonOffset(1.0, 1.0);
        gl.uniform4f (program.customColor, bColor[0], bColor[1], bColor[2], 1.0 );
        gl.uniform4f (program.customLineColor, lColor[0], lColor[1], lColor[2], 1.0 );
        gl.uniform1f (program.progWireframeOpacity, 2.0);
        gl.uniform1f (program.progWireframeAmount, 0.0);
  
        gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
        
        gl.polygonOffset(0.0, 0.0);
        gl.uniform4f (program.customColor, bColor[0], bColor[1], bColor[2], 1.0 );
        gl.uniform4f (program.customLineColor, lColor[0], lColor[1], lColor[2], 1.0 );
        wireOpacity = wireframeOpacity.value;
        gl.uniform1f (program.progWireframeOpacity, wireOpacity);
        gl.uniform1f (program.progWireframeAmount, wireframeIgnoreFog);
  
        for (var i = 0; i < model.indices.length; i += 3){
          gl.drawElements (gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i*2);
        }
      break;
  
      case 3: //Normal
        wireframeIgnoreFog = 0.0;
        gl.uniform1f (program.progWireframeOpacity, 2.0);
        gl.uniform1f(program.progWireframeAmount, wireframeIgnoreFog);
        gl.uniform4f (program.customColor, 0.0, 0.0, 1.0, 1.0 );
  
        gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
      break;
    }
}

function initRendering() 
{
    gl.clearColor(fogColor[0], fogColor[1], fogColor[2], fogColor[3]);
    gl.lineWidth(1.5);
    gl.enable(gl.DEPTH_TEST);
    //Fix Z-fighting
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0.0, 0.0);
}