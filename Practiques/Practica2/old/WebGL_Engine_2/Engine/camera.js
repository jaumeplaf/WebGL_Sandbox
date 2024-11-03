var nearPlane = 0.1;
var farPlane = 250.0;

function setProjection() {
  
    //Get the projection perspective's transformation matrix
    var projectionMatrix  = mat4.create();
    
    //Perspective (out, FOVy, aspect, near, far)
    mat4.perspective(projectionMatrix, Math.PI/4, 1.0, nearPlane, farPlane);
    
    //Send transformation matrix to vertex shader (location, transpose, value)
    gl.uniformMatrix4fv(program.projectionMatrixIndex, false, projectionMatrix);
  }