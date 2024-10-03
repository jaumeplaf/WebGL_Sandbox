var gl = null;
var program;
const pi = Math.PI;

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

    gl.clearColor(0.6,0.8,1.0,1.0);
  
}

function initBuffers(model) {

    model.idBufferVertices = gl.createBuffer ();
    gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

    model.idBufferIndices = gl.createBuffer ();
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

}

function drawStar(model) { 

    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    //gl.drawElements(gl.POINTS, model.indices.length, gl.UNSIGNED_SHORT, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, model.indices.length);

}

function drawScene() {

    gl.clear(gl.COLOR_BUFFER_BIT);

    drawStar(star01);
    
}
  
function initWebGL() {
      
    gl = getWebGLContext();

    if (!gl) {
        alert("WebGL 2.0 no está disponible");
        return;
    }

    initShaders();

    initBuffers(star01);
    initRendering();

    requestAnimationFrame(drawScene);

}
var originStar01 = [-0.1, -0.4];

//var star01 = polyCircle(10, 0.5, originStar01, true);
var star01 = polyStar(5, 0.3, 0.6, originStar01);
initWebGL();     
