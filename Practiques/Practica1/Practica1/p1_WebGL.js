//WebGL resources script, handles most of the actual shader and buffer functions

console.log("Loaded WebGL2.0 Utilities library");

//Initialize program
var gl = null;
var program;

function getWebGLContext(canv) 
{
    try {
        return document.getElementById(canv).getContext("webgl2");
    }
    catch(e) {
    }
    return null;
}

//Initialize, link and use shader
function initShader(vShader, fShader) 
{
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, document.getElementById(vShader).text);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, document.getElementById(fShader).text);
    gl.compileShader(fragmentShader);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    gl.useProgram(program);

    program.vertexPositionAttribute = gl.getAttribLocation( program, "VertexPosition");
    gl.enableVertexAttribArray(program.vertexPositionAttribute);
    //To use in foreground stars and lines
    program.vertexCenterAttribute = gl.getAttribLocation( program, "StarCenter");
    gl.enableVertexAttribArray(program.vertexCenterAttribute);
    //To use in foreground stars only
    program.vertexTimeAttribute = gl.getAttribLocation( program, "TransitionTime");
    gl.enableVertexAttribArray(program.vertexTimeAttribute);
    //To use in background stars only
    program.vertexSizeAttribute = gl.getAttribLocation(program, "VertexSize");
    gl.enableVertexAttribArray(program.vertexSizeAttribute);
    //Foreground star scale uniform
    let scaleLocation = gl.getUniformLocation(program, "sScale");
    gl.uniform1f(scaleLocation, scaleValue);
}

function initBuffers(model) 
{
    model.idBufferVertices = gl.createBuffer ();
    gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

    model.idBufferIndices = gl.createBuffer ();
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

    model.idBufferCenter = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferCenter);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vCenter), gl.STATIC_DRAW);

    model.idBufferT = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferT);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.t), gl.STATIC_DRAW);

    model.idBufferSizes = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferSizes);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.sizes), gl.STATIC_DRAW);
}

function updateBuffers(model) 
{
    if (model.idBufferVertices) {
        gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferCenter);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vCenter), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferT);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.t), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferSizes);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.sizes), gl.STATIC_DRAW);
    }
}

function initRendering(color) 
{
    //Initializes background color
    gl.clearColor(color[0], color[1], color[2], color[3]);
}

function drawTriangleFan(model) 
{ 
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferCenter);
    gl.vertexAttribPointer(program.vertexCenterAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferT);
    gl.vertexAttribPointer(program.vertexTimeAttribute, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferSizes);
    gl.vertexAttribPointer(program.vertexSizeAttribute, 1, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, model.vertices.length / 3);

}

function drawLineStrip(model) 
{
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferCenter);
    gl.vertexAttribPointer(program.vertexCenterAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferT);
    gl.vertexAttribPointer(program.vertexTimeAttribute, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferSizes);
    gl.vertexAttribPointer(program.vertexSizeAttribute, 1, gl.FLOAT, false, 0, 0);
    
    gl.drawArrays(gl.LINE_STRIP, 0, model.np);
}

function drawPoints(model) {

    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferCenter);
    gl.vertexAttribPointer(program.vertexCenterAttribute, 3, gl.FLOAT, false, 0, 0);

    
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferT);
    gl.vertexAttribPointer(program.vertexTimeAttribute, 1, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferSizes);
    gl.vertexAttribPointer(program.vertexSizeAttribute, 1, gl.FLOAT, false, 0, 0);
  
    gl.drawArrays(gl.POINTS, 0, model.vertices.length / 3);
    
  }