var program;

function initShaders(){
    program = gl.createProgram();

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

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    
    gl.linkProgram(program);
    
    gl.useProgram(program);
    
    program.vertexPositionAttribute = gl.getAttribLocation( program, "VertexPosition");
    gl.enableVertexAttribArray(program.vertexPositionAttribute);
    
    //Uniforms
    program.projectionMatrixIndex = gl.getUniformLocation(program,"projectionMatrix");
    program.modelMatrixIndex = gl.getUniformLocation(program, "modelMatrix");
  
    program.customShadingMode = gl.getUniformLocation (program, "shadingMode");
  
    program.customColor = gl.getUniformLocation (program, "baseColor");
    program.customLineColor = gl.getUniformLocation (program, "lineColor");
    
    //Depth based "water medium" fog parameters
    program.progNearPlane = gl.getUniformLocation (program, "nPlane");
    program.progFarPlane = gl.getUniformLocation (program, "fPlane");
    program.progFogColor = gl.getUniformLocation (program, "fogColor");
    program.progFogAmount = gl.getUniformLocation (program, "fogAmount");
    program.progFogPower = gl.getUniformLocation (program, "fogPower");
    
    gl.uniform1f (program.progNearPlane, nearPlane);
    gl.uniform1f (program.progFarPlane, farPlane);
    gl.uniform4f (program.progFogColor, fogColor[0], fogColor[1], fogColor[2], fogColor[3]);
    gl.uniform1f (program.progFogAmount, fogAmount);
    gl.uniform1f (program.progFogPower, fogPower);
    
    //Wireframe parameters
    program.progWireframeAmount = gl.getUniformLocation (program, "wireframeIgnoreFog");
    program.progWireframeOpacity = gl.getUniformLocation (program, "wireOpacity");
  
    gl.uniform1f (program.progWireframeAmount, wireframeIgnoreFog);
    gl.uniform1f (program.progWireframeOpacity, wireOpacity);
}