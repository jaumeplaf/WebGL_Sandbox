class Shader 
{
    constructor(vsSource, fsSource, useColors = false, useUv1 = true, useUv2 = false, useUv3 = false) 
    {
        this.program = this.compileAndLinkShaders(document.getElementById(vsSource).text, document.getElementById(fsSource).text);
        this.initializeUniforms(useColors, useUv1, useUv2, useUv3);
    }

    compileAndLinkShaders(vertexSource, fragmentSource) 
    {
        const vertexShader = this.newShader(window.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.newShader(window.gl.FRAGMENT_SHADER, fragmentSource);
        const newProgram = window.gl.createProgram();

        //
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

    initializeUniforms(inUseColor, inUseUv1, inUseUv2, inUseUv3)
    {
        
        this.program.vertexPositionAttribute = window.gl.getAttribLocation(this.program, "VertexPosition");
        window.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
        
        this.program.vertexNormalAttribute = window.gl.getAttribLocation(this.program, "VertexNormal");
        window.gl.enableVertexAttribArray(this.program.vertexNormalAttribute);

        if(inUseColor){
            this.program.vertexColorAttribute = window.gl.getAttribLocation(this.program, "VertexColor");
            window.gl.enableVertexAttribArray(this.program.vertexColorAttribute);
        }

        if(inUseUv1){
            this.program.texCoords1Attribute = window.gl.getAttribLocation(this.program, "TexCoords1");
            window.gl.enableVertexAttribArray(this.program.texCoords1Attribute);
        }

        if(inUseUv2){
            this.program.texCoords2Attribute = window.gl.getAttribLocation(this.program, "TexCoords2");
            window.gl.enableVertexAttribArray(this.program.texCoords2Attribute);
        }

        if(inUseUv3){
            this.program.texCoords3Attribute = window.gl.getAttribLocation(this.program, "TexCoords3");
            window.gl.enableVertexAttribArray(this.program.texCoords3Attribute);
        }
        
        //Uniforms
        this.program.modelMatrixIndex = window.gl.getUniformLocation(this.program, "modelMatrix");
        this.program.projectionMatrixIndex = window.gl.getUniformLocation(this.program, "projectionMatrix");
        this.program.viewMatrixIndex = window.gl.getUniformLocation(this.program, "viewMatrix");
        
        //TODO: handle these?
        this.program.progShadingMode = window.gl.getUniformLocation(this.program, "shadingMode");
        this.program.progIsLine = window.gl.getUniformLocation(this.program, "isLine");
        this.program.progWireframeOpacity = window.gl.getUniformLocation(this.program, "wireframeOpacity");

        //Fog parameters
        this.program.progFogColor = window.gl.getUniformLocation(this.program, "fogColor");
        this.program.progFogAmount = window.gl.getUniformLocation(this.program, "fogAmount");
        this.program.progFogPower = window.gl.getUniformLocation(this.program, "fogPower");
        this.program.progWireframeIgnoreFog = window.gl.getUniformLocation(this.program, "wireframeIgnoreFog");
        this.program.progNearPlane = window.gl.getUniformLocation(this.program, "nPlane");
        this.program.progFarPlane = window.gl.getUniformLocation(this.program, "fPlane");

        this.program.progTime = window.gl.getUniformLocation(this.program, "time");
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
