
var gl, program;

var exampleTorus;

// transformation vector
var Tx = 0.5, Ty = 0.5, Tz = 0.0;

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

  //uniforms
  program.modelMatrixIndex = gl.getUniformLocation(program, "modelMatrix");
  program.u_Translation = gl.getUniformLocation(program, 'u_Translation');
  program.projectionMatrixIndex = gl.getUniformLocation(program,"projectionMatrix");
  idMyColor = gl.getUniformLocation (program, "myColor" );
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
  
  gl.clearColor(0.95,0.95,0.95,1.0);
  gl.lineWidth(1.5);
  
}

function setProjection() {
    
  // obtiene la matriz de transformación de la proyección perspectiva
  var projectionMatrix  = mat4.create();
  // perspective
  mat4.perspective(projectionMatrix, Math.PI/4.0, 1.0, 0.1, 100.0);
  
  // envía la matriz de transformación de la proyección al shader de vértices
  gl.uniformMatrix4fv(program.projectionMatrixIndex,false,projectionMatrix);
}

function initPrimitives() {

  initBuffers(examplePlane);
  initBuffers(exampleCube);
  initBuffers(exampleCover);
  initBuffers(exampleCone);
  initBuffers(exampleCylinder);
  initBuffers(exampleSphere);
  
  // make a torus
  var innerRadius = 0.1; var outerRadius = 0.8; var nSides = 8; var nRings = 10;
  exampleTorus = makeTorus (innerRadius, outerRadius, nSides, nRings);
  initBuffers(exampleTorus);
}
      
function draw(model) {
  
  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  for (var i = 0; i < model.indices.length; i += 3){
    gl.drawElements (gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i*2);
	//gl.drawElements (gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, i*2);
  }
  
}

function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 1. calcula la matriz de transformación
  //var modelMatrix = mat4.create();
  //mat4.fromScaling (modelMatrix, [0.5, 0.5, 0.5]); 
        
  // 2. establece la matriz modelMatrix en el shader de vértices
  //gl.uniformMatrix4fv(program.modelMatrixIndex, false, modelMatrix);
        
  var S = mat4.create ();
  var T1 = mat4.create();
  var T2 = mat4.create();
  var R = mat4.create();
  var M = mat4.create(); //console.log(M);
  mat4.fromScaling(S, [0.5,0.5,0.5]);
  mat4.fromTranslation(T1,[0.5,0, 0]);console.log(T1);
  mat4.fromRotation(R, Math.PI/6, [0,0,1]);
  //mat4.multiply(M,S,R); 
  //mat4.multiply(M, M, T1);
  mat4.multiply(M, T1, R);
  gl.uniformMatrix4fv(program.modelMatrixIndex,false,M);
  document.getElementById("demo").innerHTML = M; //console.log(R, T1, M);
  gl.uniform4f (idMyColor, 1.0, 0.0, 0.0, 1.0 );
  draw(exampleCube); // first cube

  var MRT = mat4.create();
  mat4.multiply(MRT, R, T1);
  gl.uniformMatrix4fv(program.modelMatrixIndex,false,MRT);
  document.getElementById("demo2").innerHTML = MRT;
  gl.uniform4f (idMyColor, 0.0, 1.0, 0.0, 1.0 );
  draw(exampleCube); // second cube
  
  
  // para la matriz de la normal:
//   var normalMatrix  = mat3.create();
//   mat3.normalFromMat4 (normalMatrix, modelMatrix);
//   gl.uniformMatrix3fv(program.normalMatrixIndex, false, normalMatrix);

  // 3. dibuja la primitiva
//   draw(examplePlane);
   //draw(exampleCube);
//   draw(exampleCover);
//  draw(exampleCone);
//   draw(exampleCylinder);
//   draw(exampleTorus);

// draw with traslation
//  gl.uniform4f(program.u_Translation, Tx, Ty, Tz, 0.0);
//  draw(exampleCube);
  
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
