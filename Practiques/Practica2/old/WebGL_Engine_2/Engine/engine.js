function initPrimitives() 
{  
  cube01.initializeObject(baseCube);
  initBuffers(cube01);
  sphere01.initializeObject(baseSphere);
  initBuffers(sphere01);
}
function drawScene() 
{  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    setProjection();
  
    //Get all objects with their parameters, draw them -> class
    for(let i = 2; i < 34; i++){
      let offset = 2.5;
      cube01.setMatrix(-1.0 , 1.0, - offset * i, 1.0);
      gl.uniformMatrix4fv(program.modelMatrixIndex, false, cube01.modelMatrixIndex);
      draw(cube01, cube01.baseColor, cube01.lineColor);
      
      cube01.setMatrix(-1.0, -1.0, - offset * i, 1.0);
      gl.uniformMatrix4fv(program.modelMatrixIndex, false, cube01.modelMatrixIndex);
      draw(cube01, cube01.baseColor, cube01.lineColor);
      
      cube01.setMatrix(1.0, -1.0, - offset * i, 1.0);
      gl.uniformMatrix4fv(program.modelMatrixIndex, false, cube01.modelMatrixIndex);
      draw(cube01, cube01.baseColor, cube01.lineColor);
      
      sphere01.setMatrix(1.0, 1.0, - offset * i, 0.6);
      gl.uniformMatrix4fv(program.modelMatrixIndex, false, sphere01.modelMatrixIndex);
      draw(sphere01, sphere01.baseColor, sphere01.lineColor);
    }
}

initWebGL();