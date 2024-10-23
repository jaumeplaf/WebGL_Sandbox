
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

  for (let i = 0; i < objectsScene2.length; i++)
    initBuffers(objectsScene2[i]);
}
      
function draw(model) {
  
  gl.uniformMatrix4fv(program.modelMatrixIndex, false, model.modelMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  for (var i = 0; i < model.indices.length; i += 3)
    gl.drawElements (gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i*2);
  
}


// Example scene
objectsScene2 = [];

// dinamic
var animate = 0;
function animation (v)
{
  animate = v;
}

// drawscene
var s = 0;
function drawScene2()
{
    // animate: modificar el s
    s+=0.001;
    for (let i = 0; i < objectsScene2.length; i++)
    {
        if (animate == 1)
          objectsScene2[i].animate(s);
        draw(objectsScene2[i]);    
    }
    requestAnimationFrame(drawScene2);
}

function initHandlers() 
{
    var canvas     = document.getElementById("myCanvas");
    canvas.addEventListener("mousedown", function(event){
        tx = 2*event.clientX/canvas.width-1;
        ty = 2*(canvas.height-event.clientY)/canvas.height-1;
		CreateObject(tx*2,ty*2,0);
	} );
}

// create objects
var t = vec3.create();
function CreateObject (x,y,z)
{
    var cube = new Cube();
    //cube.setMatrix(Math.random(),Math.random(),Math.random());
    cube.setMatrix(x, y, z);
    objectsScene2.push(cube); 
    initPrimitives();
}

// compose scene
function composeScene()
{
    var cube = new Cube();
    cube.setMatrix(1,1,0);
    objectsScene2.push(cube);

    // 2nd cube
    var cube = new Cube();
    cube.setMatrix(-1,1,0);
    objectsScene2.push(cube);

    // 3rd cube
    var cube = new Cube();
    cube.setMatrix(-1,-1,0);
    objectsScene2.push(cube);

    // 4th cube
    var cube = new Cube();
    cube.setMatrix(1,-1,0);
    objectsScene2.push(cube);

}
function initWebGL() {
  
  gl = getWebGLContext();
  
  if (!gl) {
    alert("WebGL 2.0 no está disponible");
    return;
  }
  
  initShaders();
  initRendering();
  initHandlers();
  //composeScene();
  initPrimitives();
  requestAnimationFrame(drawScene2);
  
}

initWebGL();
