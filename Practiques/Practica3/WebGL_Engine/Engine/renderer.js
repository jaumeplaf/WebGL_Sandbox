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

function drawModel(inInput, model) 
{
  console.log("Drawing model:", {
    indices: model.indices.length,
    vertices: model.vertices.length,
    normals: model.normals.length,
    colors: model.idBufferColors ? model.colors.length : "No colors",
    shadingMode: inInput.shadingMode
});

  window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);

  window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferVertices);
  window.gl.vertexAttribPointer(model.shader.program.vertexPositionAttribute, 3, window.gl.FLOAT, false, 0, 0);

  window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferNormals);
  window.gl.vertexAttribPointer(model.shader.program.vertexNormalAttribute, 3, window.gl.FLOAT, false, 0, 0);

  if(model.idBufferColors){
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferColors);
    window.gl.vertexAttribPointer(model.shader.program.vertexColorAttribute, 4, window.gl.FLOAT, false, 0, 0);
  }
  else{
    window.gl.disableVertexAttribArray(model.shader.program.vertexColorAttribute);
  }

  if(model.idBufferTexcoords1){
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferTexcoords1);
    window.gl.vertexAttribPointer(model.shader.program.texCoords1Attribute, 2, window.gl.FLOAT, false, 0, 0);
  }
  else{
    window.gl.disableVertexAttribArray(model.shader.program.texCoords1Attribute);
  }

  if(model.idBufferTexcoords2){
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferTexcoords2);
    window.gl.vertexAttribPointer(model.shader.program.texCoords2Attribute, 2, window.gl.FLOAT, false, 0, 0);
  }
  else{
    window.gl.disableVertexAttribArray(model.shader.program.texCoords2Attribute);
  }

  if(model.idBufferTexcoords3){  
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferTexcoords3);
    window.gl.vertexAttribPointer(model.shader.program.texCoords3Attribute, 2, window.gl.FLOAT, false, 0, 0);
  }
  else{
    window.gl.disableVertexAttribArray(model.shader.program.texCoords2Attribute);
  }
    

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

    case 3: //Normal
      window.gl.polygonOffset(0.0, 0.0);
      window.gl.uniform1f(model.shader.program.progWireframeIgnoreFog, 0.0);

      window.gl.drawElements(window.gl.TRIANGLES, model.indices.length, window.gl.UNSIGNED_SHORT, 0);
    break;

    case 4: //Normal+Wireframe
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