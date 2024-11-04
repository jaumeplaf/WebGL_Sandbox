class Shader 
{
    constructor(vsSource, fsSource) 
    {
        this.program = this.compileAndLinkShaders(document.getElementById(vsSource).text, document.getElementById(fsSource).text);
        this.initializeUniforms();
    }

    compileAndLinkShaders(vertexSource, fragmentSource) 
    {
        const vertexShader = this.newShader(window.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.newShader(window.gl.FRAGMENT_SHADER, fragmentSource);
        const newProgram = window.gl.createProgram();

        window.gl.attachShader(newProgram, vertexShader);
        window.gl.attachShader(newProgram, fragmentShader);
        window.gl.linkProgram(newProgram);

        if (!window.gl.getProgramParameter(newProgram, window.gl.LINK_STATUS)) {
            console.error("Error linking program:", window.gl.getProgramInfoLog(newProgram));
            return null;
        }

        return newProgram;
    }

    newShader(type, source) 
    {
        const shader = window.gl.createShader(type);
        window.gl.shaderSource(shader, source);
        window.gl.compileShader(shader);

        if (!window.gl.getShaderParameter(shader, window.gl.COMPILE_STATUS)) {
            console.error("Error compiling shader:", window.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    use() 
    {
        if (this.program) {
            window.gl.useProgram(this.program);
        }
    }

    initializeUniforms()
    {
        
        this.program.vertexPositionAttribute = window.gl.getAttribLocation(this.program, "VertexPosition");
        window.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
        
        //Uniforms
        this.program.modelMatrixIndex = window.gl.getUniformLocation(this.program, "modelMatrix");
        this.program.projectionMatrixIndex = window.gl.getUniformLocation(this.program, "projectionMatrix");
        
        this.program.progShadingMode = window.gl.getUniformLocation(this.program, "shadingMode");
        this.program.progIsLine = window.gl.getUniformLocation(this.program, "isLine");
        this.program.progWireframeOpacity = window.gl.getUniformLocation(this.program, "wireframeOpacity");
        
        this.program.progBaseColor = window.gl.getUniformLocation (this.program, "baseColor");

        //Fog parameters
        this.program.progFogColor = window.gl.getUniformLocation(this.program, "fogColor");
        this.program.progFogAmount = window.gl.getUniformLocation(this.program, "fogAmount");
        this.program.progFogPower = window.gl.getUniformLocation(this.program, "fogPower");
        this.program.progWireframeIgnoreFog = window.gl.getUniformLocation(this.program, "wireframeIgnoreFog");
        this.program.progNearPlane = window.gl.getUniformLocation(this.program, "nPlane");
        this.program.progFarPlane = window.gl.getUniformLocation(this.program, "fPlane");
    }

    setProjection(projectionMatrix)
    {
        window.gl.uniformMatrix4fv(this.program.projectionMatrixIndex, false, projectionMatrix);
    }

    setModelMatrix(matrix)
    {
        window.gl.uniformMatrix4fv(this.program.modelMatrixIndex, false, matrix);
    }
}
