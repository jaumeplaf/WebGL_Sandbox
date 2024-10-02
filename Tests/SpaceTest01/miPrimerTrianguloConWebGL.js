var gl = null;
var program;
const pi = Math.PI;

var poly1 = {};

var exampleTriangle = {

  "vertices" : [-0.7, -0.7, 0.0,
                 0.7, -0.7, 0.0,
                 0.0,  0.7, 0.0],

  "indices" : [ 0, 1, 2]

};

function drawPolygon(sides, r1, r2, depth) {
  var faces = 2*sides;
  var angleStep = 2 * pi / sides
  var polyPoints = {
    "vertices" : [0, 0, 0],
    "indices" : [0]
  };
  for(i = 1; i < faces; i++)
  {
    let angle = i * angleStep;
    if (i%2 == 0) 
      {
        let x1 = r1 * Math.cos(angle);
        let y1 = r1 * Math.sin(angle);
        polyPoints.indices.push = i;
        polyPoints.vertices.push(x1,y1, depth);
      }
      else
      {
        let x2 = r2 * Math.cos(angle);
        let y2 = r2 * Math.sin(angle);
        polyPoints.indices.push = i;
        polyPoints.vertices.push(x2,y2, depth);
      }
  }
  return polyPoints;

}

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

  // paso 1
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, document.getElementById('myVertexShader').text);
  gl.compileShader(vertexShader);

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById('myFragmentShader').text);
  gl.compileShader(fragmentShader);
  
  // paso 2
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  // paso 3
  gl.linkProgram(program);

  gl.useProgram(program);

  program.vertexPositionAttribute = gl.getAttribLocation( program, "VertexPosition");
  gl.enableVertexAttribArray(program.vertexPositionAttribute);

}

function initRendering() {

  gl.clearColor(0.0,0.0,1.0,1.0);

}
  
function initBuffers(model) {
  model.idBufferVertices = gl.createBuffer ();
  gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

  model.idBufferIndices = gl.createBuffer ();
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

}

function draw(model) {

  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.drawElements(gl.TRIANGLE_STRIP, 3, gl.UNSIGNED_SHORT, 0);
  
}

function drawScene() {

  gl.clear(gl.COLOR_BUFFER_BIT);

  draw(poly1);

}

function initWebGL() {
      
  gl = getWebGLContext();

  if (!gl) {
    alert("WebGL 2.0 no está disponible");
    return;
  }
  
  poly1 = drawPolygon(5, 2, 4, 0);
  initShaders();
  initBuffers(poly1);
  initRendering();
  
  requestAnimationFrame(drawScene);

}

initWebGL();     
