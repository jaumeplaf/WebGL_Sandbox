
var gl, program;

var exampleTriangle = {
  
  "vertices" : [-0.7, -0.7, 0.0,
                 0.7, -0.7, 0.0,
                 0.0,  0.7, 0.0],
  
  "indices" : [ 0, 1, 2]
  
};

var examplePentagon = {
	"vertices" : [ 0.0 , 0.9 , 0.0 ,
				-0.65 , 0.2, 0.0,
				-0.6 , -0.5 , 0.0 ,
				0.6 , -0.9 , 0.0 ,	
				0.45 , 0.2 , 0.0 ] ,
	"indices" : [ 0 , 1 , 2 , 0, 2, 3, 0, 3, 4]
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
  idMySize = gl.getUniformLocation (program, "mySize" );
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

   
  // for the pentagon
  gl.uniform4f (idMyColor, 1.0, 1.0, 0.0, 1.0 );
  gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);

  // for the points
  gl.uniform4f (idMyColor, 1.0, .0, .0, 1.0 );
  gl.uniform1f (idMySize, 40.0);
  //gl.drawElements(gl.POINTS, model.indices.length, gl.UNSIGNED_SHORT, 0);
  gl.drawArrays(gl.POINTS, 0, 5);
}

function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  //draw(exampleTriangle);
  draw(examplePentagon);
}

function initWebGL() {
  
  gl = getWebGLContext();
  
  if (!gl) {
    alert("WebGL 2.0 no está disponible");
    return;
  }
  
  initShaders();
  initBuffers(examplePentagon);
  initRendering();
  
  requestAnimationFrame(drawScene);
  
}

initWebGL();