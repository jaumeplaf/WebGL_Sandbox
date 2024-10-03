function getWebGLContext(canv) 
{
    var canvas = document.getElementById(canv);

    try {
        return canvas.getContext("webgl2");
    }
    catch(e) {
    }

    return null;
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

function initRendering(color) 
{
    //Initializes background color
    gl.clearColor(color[0], color[1], color[2], color[3]);
}

//draw shapes

function drawTriangleFan(model) 
{ 
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, model.indices.length);
}

function drawTriangle(model) 
{ 
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    gl.drawArrays(gl.TRIANGLES, 0, model.indices.length);
}


/*example initWebGL() function

function initWebGL() {
      
    gl = getWebGLContext(myCanvas);

    if (!gl) {
        alert("WebGL 2.0 is not aviable");
        return;
    }

    initShader(starVertexShader, starFragmentShader);

    initBuffers(star01);
    
    initRendering(colorBackground);

    requestAnimationFrame(drawScene);

}*/