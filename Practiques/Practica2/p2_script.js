var gl, program;

//Declare primitives
var cube01 = new newObject();
var cube02 = new newObject();
var cube03 = new newObject();
var sphere01 = new newObject();

function getWebGLContext() {
  
  var canvas = document.getElementById("myCanvas");
  
  try {
    return canvas.getContext("webgl2");
  }
  catch(e) {
  }
  
  return null;
  
}

function initShaders() {
  
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  
  gl.shaderSource(vertexShader, document.getElementById("myVertexShader").text);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vertexShader));
    return null;
  }
  
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById("myFragmentShader").text);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(fragmentShader));
    return null;
  }
  
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  gl.linkProgram(program);
  
  gl.useProgram(program);
  
  program.vertexPositionAttribute = gl.getAttribLocation( program, "VertexPosition");
  gl.enableVertexAttribArray(program.vertexPositionAttribute);
  
  //Uniforms
  program.projectionMatrixIndex = gl.getUniformLocation(program,"projectionMatrix");
  program.modelMatrixIndex = gl.getUniformLocation(program, "modelMatrix");
  program.customColor = gl.getUniformLocation (program, "baseColor" );
  
}

function initBuffers(model) {
  
  model.idBufferVertices = gl.createBuffer ();
  gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
  
  model.idBufferIndices = gl.createBuffer ();
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
  
}

function initRendering() {
  
  gl.clearColor(0.0,0.5,0.8,1.0);
  gl.lineWidth(1.5);
  gl.enable(gl.DEPTH_TEST);
  //Fix Z-fighting
  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.polygonOffset(0.0, 0.0);
  
}

function setProjection() {
  
  //Get the projection perspective's transformation matrix
  var projectionMatrix  = mat4.create();
  
  //Perspective (out, FOVy, aspect, near, far)
  mat4.perspective(projectionMatrix, Math.PI/4.0, 1.0, 0.1, 1000.0);
  
  //Send transformation matrix to vertex shader (location, transpose, value)
  gl.uniformMatrix4fv(program.projectionMatrixIndex, false, projectionMatrix);
}

function initPrimitives() 
{  
    cube01.initializeObject(baseCube);
    initBuffers(cube01);
    cube02.initializeObject(baseCube);
    initBuffers(cube02);
    cube03.initializeObject(baseCube);
    initBuffers(cube03);
    sphere01.initializeObject(baseSphere);
    initBuffers(sphere01);
}

function draw(model) {
  
  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);

  gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
  
  for (var i = 0; i < model.indices.length; i += 3){
    gl.drawElements (gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i*2);
  }
}
function drawFlatColor(model, baseColor) {
  
  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  
  gl.uniform4f (program.customColor, baseColor[0], baseColor[1], baseColor[2], 1.0 );
  gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
}
function drawWireframe(model, lineColor) {
  
  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  
  gl.uniform4f (program.customColor, lineColor[0], lineColor[1], lineColor[2], 1.0 );

  for (var i = 0; i < model.indices.length; i += 3){
    gl.drawElements (gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i*2);
  }
}
function drawFlatWireframe(model, baseColor, lineColor) {
  
  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);

  gl.polygonOffset(1.0, 1.0);
  gl.uniform4f (program.customColor, baseColor[0], baseColor[1], baseColor[2], 1.0 );
  gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
  
  gl.polygonOffset(0.0, 0.0);
  gl.uniform4f (program.customColor, lineColor[0], lineColor[1], lineColor[2], 1.0 );
  for (var i = 0; i < model.indices.length; i += 3){
    gl.drawElements (gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i*2);
  }
}

function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  setProjection();

  //Draw with only wireframe
  cube01.setLineColor([0.0, 0.0, 0.0]);
  cube01.setMatrix(-1.0, 1.0, -5.0, 1.0);
  gl.uniformMatrix4fv(program.modelMatrixIndex, false, cube01.modelMatrixIndex);
  drawWireframe(cube01, cube01.lineColor);

  //Draw with only flat color
  cube02.setBaseColor([1,0,0]);
  cube02.setMatrix(1.0, 1.0, -5.0, 1.0);
  gl.uniformMatrix4fv(program.modelMatrixIndex, false, cube02.modelMatrixIndex);
  drawFlatColor(cube02, cube02.baseColor);

  //Draw with both flat color and wireframe
  cube03.setBaseColor([0,1,0]);
  cube03.setLineColor([0,0,0]);
  cube03.setMatrix(-1.0, -1.0, -5.0, 1.0);
  gl.uniformMatrix4fv(program.modelMatrixIndex, false, cube03.modelMatrixIndex);
  drawFlatWireframe(cube03, cube03.baseColor, cube03.lineColor);

  sphere01.setBaseColor([1,1,0]);
  sphere01.setMatrix(1.0, -1.0, -5.0, 0.75);
  gl.uniformMatrix4fv(program.modelMatrixIndex, false, sphere01.modelMatrixIndex);
  drawFlatWireframe(sphere01, sphere01.baseColor, sphere01.lineColor);

}

function initWebGL() {
  
  gl = getWebGLContext();
  
  if (!gl) {
    alert("WebGL 2.0 no está disponible");
    return;
  }
  
  initShaders();
  initPrimitives();
  initRendering();
  
  requestAnimationFrame(drawScene);
  
}

initWebGL();

