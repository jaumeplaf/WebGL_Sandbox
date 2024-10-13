console.log("Loaded WebGL2.0 Utilities library");

function getWebGLContext(canv) 
{
    try {
        return document.getElementById(canv).getContext("webgl2");
    }
    catch(e) {
    }
    return null;
}

function getCanvasRatio(canv)
{
    let currCanv = document.getElementById(canv);
    let aspectRatio = 1 / (currCanv.width / currCanv.height);
    return aspectRatio;
}

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

    //program.vertexCenterAttribute = gl.getAttribLocation( program, "StarCenter");
    //gl.enableVertexAttribArray(program.vertexCenterAttribute);
}

function initBuffers(model) 
{
    model.idBufferVertices = gl.createBuffer ();
    gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

    model.idBufferIndices = gl.createBuffer ();
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
}

function initBuffersCenter(model) 
{
    model.idBufferVertices = gl.createBuffer ();
    gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

    model.idBufferIndices = gl.createBuffer ();
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
    
    //Shape center buffer
    model.idBufferCenter = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferCenter);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.center), gl.STATIC_DRAW);
}

function initRendering(color) 
{
    //Initializes background color
    gl.clearColor(color[0], color[1], color[2], color[3]);
}

//draw shapes

function drawTriangles(model, useArray) 
{ 
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);

    if(!useArray) gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
    else gl.drawArrays(gl.TRIANGLES, 0, model.indices.length);

}

function drawTriangleFan(model, useArray) 
{ 
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    if (!useArray) gl.drawElements(gl.TRIANGLE_FAN, model.indices.length, gl.UNSIGNED_SHORT, 0); 
    else gl.drawArrays(gl.TRIANGLE_FAN, 0, model.vertices.length / 3);
}

function drawTriangleStrip(model) 
{ 
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    if(!useArray) gl.drawElements(gl.TRIANGLE_STRIP, 3, gl.UNSIGNED_SHORT, 0);
    else gl.drawArrays(gl.TRIANGLE_STRIP, 0, model.indices.length);
}

function drawLineStrip(model) 
{
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, model.np);
}

function drawLines(model) 
{
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, model.np);
}