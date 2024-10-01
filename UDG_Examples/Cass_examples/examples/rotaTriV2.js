
var gl, program;

var exampleTriangle = {
  
  "vertices" : [-0.7, -0.7, 0.0,
                 0.7, -0.7, 0.0,
                 0.0,  0.7, 0.0],
  
  "indices" : [ 0, 1, 2]
  
};

var idMyColor, idMySize;

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
  
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById("myFragmentShader").text);
  gl.compileShader(fragmentShader);
  
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  gl.linkProgram(program);
  
  gl.useProgram(program);
  
  program.vertexPositionAttribute = gl.getAttribLocation( program, "VertexPosition");
  gl.enableVertexAttribArray(program.vertexPositionAttribute);
  
  idMyColor = gl.getUniformLocation (program, "myColor" );
  idMyAngle = gl.getUniformLocation (program, "myAngle" );
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
  
  gl.clearColor(0.15,0.15,0.15,1.0);
  
}

function draw(model) {
  
  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}


// Rotation angle (degrees/second)
var ANGLE_STEP = .1;
// Current rotation angle
var currentAngle = 0.0;
function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  gl.uniform4f (idMyColor, 1.0, .0, 0.0, 1.0 );
  currentAngle = animate(currentAngle);
  gl.uniform1f (idMyAngle, currentAngle);
  draw(exampleTriangle);
  requestAnimationFrame(drawScene);
}


// Last time that this function was called
var g_last = Date.now();
function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle;
}

// Control andle speed
function up() {
    ANGLE_STEP += .1; 
}
  
function down() {
    ANGLE_STEP -= .1; 
}
//////////////////////

function initWebGL() {
  
  gl = getWebGLContext();
  
  if (!gl) {
    alert("WebGL 2.0 no está disponible");
    return;
  }
  
  initShaders();
  initBuffers(exampleTriangle);
  initRendering();
  
  requestAnimationFrame(drawScene);
}

initWebGL();
