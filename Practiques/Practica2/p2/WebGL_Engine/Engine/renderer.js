function initRendering() 
{
  
  let fogColor = [0.2,0.4,0.8];//temp
  
  gl.clearColor(fogColor[0], fogColor[1], fogColor[2], fogColor[3]);
  gl.lineWidth(1.5);

  gl.enable(gl.DEPTH_TEST);

  //Fix Z-fighting
  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.polygonOffset(0.0, 0.0);
}

function drawModel(model) 
{
  let program = model.shader;
  //let bColor = model.baseColor;
  //let lColor = model.lineColor;

  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  
  //gl.uniform1f (program.customShadingMode, shadingMode);

  //Temp
  gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);

  /*
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
    }*/
  }