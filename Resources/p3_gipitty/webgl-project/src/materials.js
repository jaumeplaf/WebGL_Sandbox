class Material 
{
    constructor(inScene, vsSource, fsSource) 
    {
        this.scene = inScene;
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
        const material = window.gl.createShader(type);
        window.gl.shaderSource(material, source);
        window.gl.compileShader(material);
        
        if (!window.gl.getShaderParameter(material, window.gl.COMPILE_STATUS)) {
            console.error("Error compiling material:", window.gl.getShaderInfoLog(material));
            return null;
        }
        return material;
    }
    
    use(inInput) 
    {
        if (this.program) {
            window.gl.useProgram(this.program);
            inInput.setUniforms(this.program);
        }
        else console.error("Can't use material, program is null");
    }
    
    initializeUniforms()
    {
        this.program.vertexPositionAttribute = window.gl.getAttribLocation(this.program, "VertexPosition");
        window.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
        this.program.vertexNormalAttribute = window.gl.getAttribLocation(this.program, "VertexNormal");
        window.gl.enableVertexAttribArray(this.program.vertexNormalAttribute);
        this.program.vertexColorAttribute = window.gl.getAttribLocation(this.program, "VertexColor");
        window.gl.enableVertexAttribArray(this.program.vertexColorAttribute);
        this.program.texCoords1Attribute = window.gl.getAttribLocation(this.program, "TexCoords1");
        window.gl.enableVertexAttribArray(this.program.texCoords1Attribute);
        
        //Uniforms
        this.program.modelMatrixIndex = window.gl.getUniformLocation(this.program, "modelMatrix");
        this.program.projectionMatrixIndex = window.gl.getUniformLocation(this.program, "projectionMatrix");
        this.program.viewMatrixIndex = window.gl.getUniformLocation(this.program, "viewMatrix");
        
        //Fog parameters
        this.program.progFogColor = window.gl.getUniformLocation(this.program, "fogColor");
        this.program.progFogAmount = window.gl.getUniformLocation(this.program, "fogAmount");
        this.program.progFogPower = window.gl.getUniformLocation(this.program, "fogPower");
        this.program.progNearPlane = window.gl.getUniformLocation(this.program, "nPlane");
        this.program.progFarPlane = window.gl.getUniformLocation(this.program, "fPlane");
    }

    setProjection(projectionMatrix)
    {
        window.gl.uniformMatrix4fv(this.program.projectionMatrixIndex, false, projectionMatrix);
    }

    setView(viewMatrix)
    {
        window.gl.uniformMatrix4fv(this.program.viewMatrixIndex, false, viewMatrix);
    }

    setModelMatrix(matrix)
    {
        window.gl.uniformMatrix4fv(this.program.modelMatrixIndex, false, matrix);
    }
}