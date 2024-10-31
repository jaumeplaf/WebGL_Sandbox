var gl, program;

const canvas = document.getElementById("myCanvas");
const wireframeToggle = document.getElementById('wireframeToggle');
const wireframeOpacity = document.getElementById('wireframeOpacityValue');
const shadingModeSelect = document.getElementById('shadingMode');
const fogAmountSlider = document.getElementById('fogAmountValue');
const fogPowerSlider = document.getElementById('fogPowerValue');

let shadingMode = 2;
var nearPlane = 0.1;
var farPlane = 250.0;
var wireOpacity;

var fogColor =  [0.25, 0.45, 0.7, 1.0];
var fogAmount;
var fogPower;

var wireframeIgnoreFog = 0.0;

//Declare primitives
var cube01 = new newObject();
var sphere01 = new newObject();

//Link HTML parameters
function linkParameters(glContext){
  //Shading mode select
  shadingModeSelect.addEventListener('change', (event) => {
    shadingMode = parseInt(event.target.value);
    requestAnimationFrame(drawScene);
  });

  wireframeOpacity.addEventListener('change', (event) =>{
    wireOpacity = event.target.value;
    gl.uniform1f(program.progWireframeOpacity, wireOpacity);
    requestAnimationFrame(drawScene);
  });
  
  //Wireframe ignore fog toggle
  wireframeToggle.addEventListener('change', (event) => {
    if(shadingMode == 0 || shadingMode == 2){
      wireframeIgnoreFog = event.target.checked ? 1.0 : 0.0;
      gl.uniform1f(program.progWireframeAmount, wireframeIgnoreFog);
    }
    requestAnimationFrame(drawScene);
  });

  fogAmountSlider.addEventListener('change', (event) =>{
    fogAmount = event.target.value;
    gl.uniform1f(program.progFogAmount, fogAmount);
    requestAnimationFrame(drawScene);
    console.log(fogAmount);
  });

  fogPowerSlider.addEventListener('change', (event) =>{
    fogPower = event.target.value;
    gl.uniform1f(program.progFogPower, fogPower);
    requestAnimationFrame(drawScene);
    console.log(fogPower);
  });

  wireOpacity = wireframeOpacity.value;
  fogAmount = fogAmountSlider.value;
  fogPower = fogPowerSlider.value;
  gl.uniform1f(program.progWireframeOpacity, wireOpacity);
  gl.uniform1f(program.progFogAmount, fogAmount);
  gl.uniform1f(program.progFogPower, fogPower);

}

function getWebGLContext() {
  
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

  program.customShadingMode = gl.getUniformLocation (program, "shadingMode");

  program.customColor = gl.getUniformLocation (program, "baseColor");
  program.customLineColor = gl.getUniformLocation (program, "lineColor");
  
  //Depth based "water medium" fog parameters
  program.progNearPlane = gl.getUniformLocation (program, "nPlane");
  program.progFarPlane = gl.getUniformLocation (program, "fPlane");
  program.progFogColor = gl.getUniformLocation (program, "fogColor");
  program.progFogAmount = gl.getUniformLocation (program, "fogAmount");
  program.progFogPower = gl.getUniformLocation (program, "fogPower");
  
  gl.uniform1f (program.progNearPlane, nearPlane);
  gl.uniform1f (program.progFarPlane, farPlane);
  gl.uniform4f (program.progFogColor, fogColor[0], fogColor[1], fogColor[2], fogColor[3]);
  gl.uniform1f (program.progFogAmount, fogAmount);
  gl.uniform1f (program.progFogPower, fogPower);
  
  //Wireframe parameters
  program.progWireframeAmount = gl.getUniformLocation (program, "wireframeIgnoreFog");
  program.progWireframeOpacity = gl.getUniformLocation (program, "wireOpacity");

  gl.uniform1f (program.progWireframeAmount, wireframeIgnoreFog);
  gl.uniform1f (program.progWireframeOpacity, wireOpacity);
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
  
  gl.clearColor(fogColor[0], fogColor[1], fogColor[2], fogColor[3]);
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
  mat4.perspective(projectionMatrix, Math.PI/4, 1.0, nearPlane, farPlane);
  
  //Send transformation matrix to vertex shader (location, transpose, value)
  gl.uniformMatrix4fv(program.projectionMatrixIndex, false, projectionMatrix);
}

function initPrimitives() 
{  
    cube01.initializeObject(baseCube);
    initBuffers(cube01);
    sphere01.initializeObject(baseSphere);
    initBuffers(sphere01);
}

function draw(model, bColor, lColor) {
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
  wireframeIgnoreFog = 1.0;
  gl.uniform1f (program.progWireframeAmount, wireframeIgnoreFog);
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
  gl.uniform1f (program.progWireframeAmount, 0.0);
  //Draw base
  gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
  
  gl.polygonOffset(0.0, 0.0);
  gl.uniform4f (program.customColor, lineColor[0], lineColor[1], lineColor[2], 1.0 );
  //Make wireframe ignore fog
  gl.uniform1f (program.progWireframeAmount, wireframeIgnoreFog);
  //Draw wireframe
  for (var i = 0; i < model.indices.length; i += 3){
    gl.drawElements (gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i*2);
  }
}

function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  setProjection();

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

function initWebGL() {
  
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

initWebGL();

