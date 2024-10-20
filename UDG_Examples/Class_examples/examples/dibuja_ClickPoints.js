
var gl, program;

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

var CloudPoints = {
    "vertices" : [],
    "np" : 0
};
/*
var Lines = {
    "vertices" : [],
    "indices" : []
};*/

function initHandlers() {
    var canvas     = document.getElementById("myCanvas");
    canvas.addEventListener("mousedown", function(event){
        tx = 2*event.clientX/canvas.width-1;
        ty = 2*(canvas.height-event.clientY)/canvas.height-1;
		CloudPoints.vertices.push(tx);
        CloudPoints.vertices.push(ty);
        CloudPoints.vertices.push(0.0);
        CloudPoints.np++;
        updateBuffer(CloudPoints);
        console.log(event);
        drawScene();
	} );
}

function updateBuffer(model) {
  gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
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
  idMySize = gl.getUniformLocation (program, "mySize" );
}
/*
function initBuffers(model) {
  
  model.idBufferVertices = gl.createBuffer ();
  gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
  
  model.idBufferIndices = gl.createBuffer ();
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
  
}*/

function initBuffersPoints(model) {
  
    model.idBufferVertices = gl.createBuffer ();
}

function initRendering() {
  
  gl.clearColor(0.15,0.15,0.15,1.0);
  
}
/*
function draw(model) {
  
  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.drawElements(gl.POINTS, model.indices.length, gl.UNSIGNED_SHORT, 0);
}*/

function drawPoints(model) {
  
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, model.np);
    gl.drawArrays(gl.LINE_STRIP, 0, model.np);
  }


var size = 2.; // size of the points
function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT);
  size=10.; 
  
  
  //gl.uniform4f (idMyColor, 1.0, 1.0, 0.0, 1.0 );
  gl.uniform1f (idMySize, size);
  gl.uniform4f (idMyColor, 1.0, 0.0, 0.0, 1.0 );
  drawPoints(CloudPoints);

}

function initWebGL() {
  
  gl = getWebGLContext();
  
  if (!gl) {
    alert("WebGL 2.0 no está disponible");
    return;
  }
  
  initShaders();
  initBuffersPoints(CloudPoints);
  initRendering();
  initHandlers();
  
  requestAnimationFrame(drawScene);
}

initWebGL();
