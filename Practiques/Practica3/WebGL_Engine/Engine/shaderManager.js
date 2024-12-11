class Material 
{
    constructor(inScene, vsSource, fsSource, useColors = false, useUv1 = true, useUv2 = false, useUv3 = false) 
    {
        this.scene = inScene;
        this.program = this.compileAndLinkShaders(document.getElementById(vsSource).text, document.getElementById(fsSource).text);
        this.initializeUniforms(useColors, useUv1, useUv2, useUv3);
        this.initializeCollection();
    }
    
    initializeCollection(){
        this.collection = new SceneActorsCollection(this);
        this.scene.addCollection(this.collection);
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
        const material = window.gl.createShader(type);
        window.gl.shaderSource(material, source);
        window.gl.compileShader(material);

        if (!window.gl.getShaderParameter(material, window.gl.COMPILE_STATUS)) {
            console.error("Error compiling material:", window.gl.getShaderInfoLog(material));
            return null;
        }

        return material;
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
        //console.log("VERTEX ON!");
        
        this.program.vertexNormalAttribute = window.gl.getAttribLocation(this.program, "VertexNormal");
        window.gl.enableVertexAttribArray(this.program.vertexNormalAttribute);
        //console.log("NORMAL ON!");

        if(inUseColor){
            this.program.vertexColorAttribute = window.gl.getAttribLocation(this.program, "VertexColor");
            window.gl.enableVertexAttribArray(this.program.vertexColorAttribute);
            //console.log("COLOR ON!");
        }

        if(inUseUv1){
            this.program.texCoords1Attribute = window.gl.getAttribLocation(this.program, "TexCoords1");
            window.gl.enableVertexAttribArray(this.program.texCoords1Attribute);
            //console.log("UV1 ON!");
        }

        if(inUseUv2){
            this.program.texCoords2Attribute = window.gl.getAttribLocation(this.program, "TexCoords2");
            window.gl.enableVertexAttribArray(this.program.texCoords2Attribute);
            //console.log("UV2 ON!");
        }

        if(inUseUv3){
            this.program.texCoords3Attribute = window.gl.getAttribLocation(this.program, "TexCoords3");
            window.gl.enableVertexAttribArray(this.program.texCoords3Attribute);
            //console.log("UV3 ON!");
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
