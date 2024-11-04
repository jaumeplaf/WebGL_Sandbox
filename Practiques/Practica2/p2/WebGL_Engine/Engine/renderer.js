function initRendering() 
{
  window.gl.lineWidth(1.5);

  window.gl.enable(window.gl.DEPTH_TEST);

  //Fix Z-fighting
  window.gl.enable(window.gl.POLYGON_OFFSET_FILL);
  window.gl.polygonOffset(0.0, 0.0);
}

function drawModel(inInput, model) 
{
  window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferVertices);
  window.gl.vertexAttribPointer(model.shader.program.vertexPositionAttribute, 3, window.gl.FLOAT, false, 0, 0);
  
  window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  
  window.gl.uniform4f (model.shader.program.progBaseColor, model.baseColor[0], model.baseColor[1], model.baseColor[2], 1.0 );

  switch(inInput.shadingMode)
  {
    case 0: //Wireframe
      window.gl.polygonOffset(0.0, 0.0);
      window.gl.uniform1f(model.shader.program.progWireframeIgnoreFog, inInput.wireframeIgnoreFog);
      window.gl.uniform1f (model.shader.program.progIsLine, 1.0);

      for (var i = 0; i < model.indices.length; i += 3)
      {
        window.gl.drawElements (window.gl.LINE_LOOP, 3, window.gl.UNSIGNED_SHORT, i*2);
      }
      
      window.gl.uniform1f (model.shader.program.progIsLine, 0.0);
    break;

    case 1: //Color
      window.gl.polygonOffset(0.0, 0.0);
      window.gl.uniform1f(model.shader.program.progWireframeIgnoreFog, 0.0);

      window.gl.drawElements(window.gl.TRIANGLES, model.indices.length, window.gl.UNSIGNED_SHORT, 0);
    break;

    case 2: //Color+Wireframe
      window.gl.polygonOffset(1.0, 1.0);
      window.gl.uniform1f(model.shader.program.progWireframeIgnoreFog, 0.0);
      window.gl.uniform1f(model.shader.program.progWireframeOpacity, 1.0);

      window.gl.drawElements(window.gl.TRIANGLES, model.indices.length, window.gl.UNSIGNED_SHORT, 0);
      
      window.gl.polygonOffset(0.0, 0.0);
      window.gl.uniform1f(model.shader.program.progWireframeIgnoreFog, inInput.wireframeIgnoreFog);
      window.gl.uniform1f(model.shader.program.progWireframeOpacity, inInput.wireframeOpacity);
      window.gl.uniform1f (model.shader.program.progIsLine, 1.0);

      for (var i = 0; i < model.indices.length; i += 3)
      {
        window.gl.drawElements (window.gl.LINE_LOOP, 3, window.gl.UNSIGNED_SHORT, i*2);
      }

      window.gl.uniform1f (model.shader.program.progIsLine, 0.0);
    break;

    case 3: //WorldNormal
      window.gl.polygonOffset(0.0, 0.0);
      window.gl.uniform1f(model.shader.program.progWireframeIgnoreFog, 0.0);

      window.gl.drawElements(window.gl.TRIANGLES, model.indices.length, window.gl.UNSIGNED_SHORT, 0);
    break;

    case 4: //WorldNormal+Wireframe
      window.gl.polygonOffset(1.0, 1.0);
      window.gl.uniform1f(model.shader.program.progWireframeIgnoreFog, 0.0);
      window.gl.drawElements(window.gl.TRIANGLES, model.indices.length, window.gl.UNSIGNED_SHORT, 0);

      window.gl.polygonOffset(0.0, 0.0);
      window.gl.uniform1f(model.shader.program.progWireframeIgnoreFog, inInput.wireframeIgnoreFog);
      window.gl.uniform1f (model.shader.program.progIsLine, 1.0);

      for (var i = 0; i < model.indices.length; i += 3)
      {
        window.gl.drawElements (window.gl.LINE_LOOP, 3, window.gl.UNSIGNED_SHORT, i*2);
      }

      window.gl.uniform1f (model.shader.program.progIsLine, 0.0);
    break; 
    }
  }