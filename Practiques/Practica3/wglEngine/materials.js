class Material 
{
    constructor(inScene, vsSource, fsSource, inTextureBaseColor = false, inTextureNormal = false, flipVcoord = true) 
    {
        this.scene = inScene;
        this.flipV = flipVcoord;
        this.useTextureBaseColor = inTextureBaseColor;
        this.useTextureNormal = inTextureNormal;
        this.useFog = true;
        this.useAdjugateNormal = true;
        this.shaderFeatures = '';

        this.program = this.compileAndLinkShaders(this.preprocessShaderSource(vsSource), this.preprocessShaderSource(fsSource));
        
        this.initializeUniforms();
        this.textures = {};
    }
    
    preprocessShaderSource(inSource) {
        const source = document.getElementById(inSource).text;
        const versionDirective = '#version 300 es';
        if (this.flipV) {
            this.shaderFeatures += '#define USE_FLIP_V\n';
        }
        if (this.useTextureBaseColor) {
            this.shaderFeatures += '#define USE_TEXTURE_BASECOLOR\n';
        }
        if (this.useTextureNormal) {
            this.shaderFeatures += '#define USE_TEXTURE_NORMAL\n';
        }
        if (this.useFog) {
            this.shaderFeatures += '#define USE_FOG\n';
        }
        if (this.useAdjugateNormal) {
            this.shaderFeatures += '#define USE_ADJUGATE_NORMALS\n';
        }
        return `${versionDirective}\n${this.shaderFeatures}\n${source}`;
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

        this.program.isPoint = window.gl.getUniformLocation(this.program, "isPoint");

        // Texture uniforms
        this.program.baseColorSampler = window.gl.getUniformLocation(this.program, "t_baseColor");
        this.program.normalSampler = window.gl.getUniformLocation(this.program, "t_normal");
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

    setTexture(texture, textureUnit, uniformLocation)
    {
        window.gl.activeTexture(window.gl.TEXTURE0 + textureUnit);
        window.gl.bindTexture(window.gl.TEXTURE_2D, texture.texture);
        window.gl.uniform1i(uniformLocation, textureUnit);
    }

    bindTexture(image) 
    {
        window.gl.bindTexture(window.gl.TEXTURE_2D, this.texture);
        window.gl.texImage2D(window.gl.TEXTURE_2D, 0, window.gl.RGBA, window.gl.RGBA, window.gl.UNSIGNED_BYTE, image);

        window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_MIN_FILTER, window.gl.LINEAR_MIPMAP_LINEAR);
        window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_MAG_FILTER, window.gl.LINEAR);

        window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_WRAP_S, window.gl.REPEAT);
        window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_WRAP_T, window.gl.REPEAT);

        window.gl.generateMipmap(window.gl.TEXTURE_2D);
    }

    assignTexture(texture, type)
    {
        this.textures[type] = texture;
    }
}
