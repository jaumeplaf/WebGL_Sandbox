
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

var points = [];
function initHandlers() {
    var canvas     = document.getElementById("myCanvas");
    canvas.addEventListener("mousedown", function(event){
        tx = 2*event.clientX/canvas.width-1;
        ty = 2*(canvas.height-event.clientY)/canvas.height-1;
		points.push([tx,ty]);
        console.log(tx,ty);
        //console.log(event.clientX, event.clientX)
	} );
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

  //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  //gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);

}


var size = 60.; // size of the points
function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT);
   size+=.1; //console.log(size);
  
  
  gl.uniform4f (idMyColor, 1.0, .0, 0.0, 1.0 );
  gl.uniform1f (idMySize, size);
  draw(exampleTriangle);
  requestAnimationFrame(drawScene);

}

function initWebGL() {
  
  gl = getWebGLContext();
  
  if (!gl) {
    alert("WebGL 2.0 no está disponible");
    return;
  }
  
  initShaders();
  initBuffers(exampleTriangle);
  initRendering();
  initHandlers();
  
  requestAnimationFrame(drawScene);
  //setInterval(drawScene,10000);
}

initWebGL();
