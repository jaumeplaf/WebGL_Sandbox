
var gl, program;

var exampleTriangle = {
  
  "vertices" : [ -0.7, -0.7, 0.0,    1.0, 0.0, 0.0, 1.0,  // rojo
                  0.7, -0.7, 0.0,    0.0, 1.0, 0.0, 1.0,  // verde
                  0.0,  0.7, 0.0,    0.0, 0.0, 1.0, 1.0], // azul
  
  "indices" : [ 0, 1, 2]
  
};

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
  
  program.vertexPositionAttribute = gl.getAttribLocation(program, "VertexPosition");
  gl.enableVertexAttribArray(program.vertexPositionAttribute);

  program.vertexColorAttribute    = gl.getAttribLocation(program, "VertexColor");
  gl.enableVertexAttribArray(program.vertexColorAttribute);

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
  
  gl.clearColor(1.0,1.0,1.0,1.0);
  
}

function draw(model) {
  
  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 7*4, 0); // el 4 es de bytes, el 7 de los elementos para cada vertice
  gl.vertexAttribPointer(program.vertexColorAttribute,    4, gl.FLOAT, false, 7*4, 3*4);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

}

function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  draw(exampleTriangle);
  
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
  
  requestAnimationFrame(drawScene);
  
}

initWebGL();
