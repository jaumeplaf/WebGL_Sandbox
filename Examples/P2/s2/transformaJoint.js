
var gl, program;

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

  program.modelMatrixIndex = gl.getUniformLocation(program, "modelMatrix");

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

function initPrimitives() {

  initBuffers(examplePlane);
  initBuffers(exampleCube);
  initBuffers(exampleCubeColor);
  initBuffers(exampleCover);
  initBuffers(exampleCone);
  initBuffers(exampleCylinder);
  initBuffers(exampleSphere);

}
      
function draw(model) {
  
  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  for (var i = 0; i < model.indices.length; i += 3)
    gl.drawElements (gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i*2);
  
}

function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 1. calcula la matriz de transformación
  var modelMatrix = mat4.create();
  var R = mat4.create();
  var T = mat4.create();
  var S = mat4.create();
  var M = mat4.create();
        
  // Defineix transformacions i acumula TS 
  mat4.fromTranslation(T, [0, 0.5, 0]);
  mat4.fromScaling (S, [0.1, 0.1, 0.1]);
  mat4.fromRotation(R, Math.PI/4, [0,0,1]);
  mat4.multiply(M,T,S);
  mat4.multiply(modelMatrix,modelMatrix,M);

  // 1ra esfera 
  gl.uniformMatrix4fv(program.modelMatrixIndex, false, modelMatrix);
  draw(exampleSphere);

  //  bucle para pintar esferas
   for (var i=0; i<7; i++)
   {
    mat4.multiply(modelMatrix,R, modelMatrix); // Acumula rotacions
    gl.uniformMatrix4fv(program.modelMatrixIndex, false, modelMatrix);
    draw(exampleSphere);
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
  
  requestAnimationFrame(drawScene);
  
}

initWebGL();
