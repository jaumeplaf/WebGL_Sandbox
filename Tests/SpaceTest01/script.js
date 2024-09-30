var gl = null;
var program;

var pointNumber = 1000;
var minSizeStar = 0;
var maxSizeStar = 4;
var rPoints = randPoints(pointNumber, minSizeStar, maxSizeStar);

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

  //Get shaders
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, document.getElementById('myVertexShader').text);
  gl.compileShader(vertexShader);

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById('myFragmentShader').text);
  gl.compileShader(fragmentShader);
  
  //Attach shaders
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  //Link & use shaders
  gl.linkProgram(program);
  gl.useProgram(program);

  //Get and enable attribute locations
  program.vertexPositionAttribute = gl.getAttribLocation( program, "VertexPosition");
  gl.enableVertexAttribArray(program.vertexPositionAttribute);
  program.vertexSizeAttribute = gl.getAttribLocation(program, "VertexSize");
  gl.enableVertexAttribArray(program.vertexSizeAttribute);

}

function initRendering() {

  gl.clearColor(0.0,0.0,0.0,1.0);

}
  
function initBuffers(model) {

  //Vertex position buffer
  model.idBufferVertices = gl.createBuffer ();
  gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
  //Vertex size buffer
  model.idBufferSizes = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferSizes);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.sizes), gl.STATIC_DRAW);

}

function draw(model) {

  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferSizes);
  gl.vertexAttribPointer(program.vertexSizeAttribute, 1, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.POINTS, 0, model.vertices.length / 3); // Draw points
  
}

function drawScene() {

  gl.clear(gl.COLOR_BUFFER_BIT);

  draw(rPoints);

}

function initWebGL() {
      
  gl = getWebGLContext();

  if (!gl) {
    alert("WebGL 2.0 no está disponible");
    return;
  }

  initShaders();
  initBuffers(rPoints);
  initRendering();
  
  requestAnimationFrame(drawScene);

}

//Utilities
function remapRange(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function randPoints(pNum, maxSize, minSize)
{
  var points = {
    "vertices" : [],
    "sizes" : []
  }

  for(var i = 0; i < pNum; i++)
  {
    let randX = remapRange(Math.random(), 0, 1, -1, 1);
    let randY = remapRange(Math.random(), 0, 1, -1, 1);
    let randZ = remapRange(Math.random(), 0, 1, -1, 1);
    let randSize = remapRange(Math.random(), 0, 1, minSize, maxSize); // Adjust range as needed
    
    points.vertices.push(randX, randY, randZ);
    points.sizes.push(randSize);
  }

  console.log(points);
  return points;
}


initWebGL();
