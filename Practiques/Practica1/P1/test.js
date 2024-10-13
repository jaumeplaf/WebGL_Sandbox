var gl, program;

var idMyColor, idMySize;

function getWebGLContext() {
  var canvas = document.getElementById("myCanvas");
  try {
    return canvas.getContext("webgl2");
  } catch (e) {}
  return null;
}

var lineArray = [];
var currentLine = {
  "vertices": [],
  "np": 0,
  "idBufferVertices": null
};

function initHandlers() {
  // Mouse click listener
  var canvas = document.getElementById("myCanvas");
  canvas.addEventListener("mousedown", function(event) {
    // Fix click position due to canvas offset
    let rect = canvas.getBoundingClientRect();
    let tx = 2 * (event.clientX - rect.left) / canvas.width - 1;
    let ty = 2 * (rect.height - (event.clientY - rect.top)) / canvas.height - 1;

    currentLine.vertices.push(tx);
    currentLine.vertices.push(ty);
    currentLine.vertices.push(0.0);
    currentLine.np++;

    updateBuffer(currentLine);
    drawScene();
  });

  // New line button listener
  var newLineButton = document.getElementById("newLineButton");
  newLineButton.addEventListener("click", function() {
    // Add the current line to the lineArray
    lineArray.push(currentLine);

    // Start a new line and initialize its buffer
    currentLine = {
      "vertices": [],
      "np": 0,
      "idBufferVertices": gl.createBuffer()
    };
    initBuffersPoints(currentLine);
  });
}

function updateBuffer(model) {
  if (model.idBufferVertices) {
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
  }
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

  program.vertexPositionAttribute = gl.getAttribLocation(program, "VertexPosition");
  gl.enableVertexAttribArray(program.vertexPositionAttribute);

  idMyColor = gl.getUniformLocation(program, "myColor");
  idMySize = gl.getUniformLocation(program, "mySize");
}

function initBuffersPoints(model) {
  model.idBufferVertices = gl.createBuffer();
}

function initRendering() {
  gl.clearColor(0.15, 0.15, 0.15, 1.0);
}

function drawLines(model) {
  if (model.idBufferVertices && model.np > 0) {
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, model.np);
  }
}

var size = 2.; // size of the points
function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  size = 10.;
  gl.uniform1f(idMySize, size);
  gl.uniform4f(idMyColor, 1.0, 0.0, 0.0, 1.0);

  // Draw all lines stored in the lineArray
  for (let i = 0; i < lineArray.length; i++) {
    drawLines(lineArray[i]);
  }

  // Draw the current line
  drawLines(currentLine);
}

function initWebGL() {
  gl = getWebGLContext();

  if (!gl) {
    alert("WebGL 2.0 no está disponible");
    return;
  }

  initShaders();
  initBuffersPoints(currentLine);
  initRendering();
  initHandlers();

  requestAnimationFrame(drawScene);
}

initWebGL();
