async function loadShaderSource(path) 
{
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load shader: ${path}`);
      }
      return await response.text();
    } catch (error) {
      console.error(error);
      return null;
    }
}
  class Shader {
    constructor(gl, vertexSource, fragmentSource) {
        this.gl = gl;
        this.program = this.createProgram(vertexSource, fragmentSource);
        this.uniformLocations = {};
        this.initUniformLocations();
    }

    createProgram(vertexSource, fragmentSource) {
        const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Shader program failed to link:', this.gl.getProgramInfoLog(program));
            return null;
        }
        
        this.gl.useProgram(program);
        return program;
    }

    compileShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader failed to compile:', this.gl.getShaderInfoLog(shader));
            return null;
        }
        
        return shader;
    }

    initUniformLocations() {
        // Remove redundant declarations and use class properties directly
        this.uniformLocations.baseColor = this.gl.getUniformLocation(this.program, 'baseColor');
        this.uniformLocations.lineColor = this.gl.getUniformLocation(this.program, 'lineColor');
        this.uniformLocations.modelMatrix = this.gl.getUniformLocation(this.program, 'modelMatrix');
        this.uniformLocations.projectionMatrix = this.gl.getUniformLocation(this.program, 'projectionMatrix');
        this.uniformLocations.shadingMode = this.gl.getUniformLocation(this.program, 'shadingMode');
    }

    use() {
        this.gl.useProgram(this.program);
    }

    // Expose methods to set uniform variables
    baseColor(value) {
        this.gl.uniform4fv(this.uniformLocations.baseColor, value);
    }

    lineColor(value) {
        this.gl.uniform4fv(this.uniformLocations.lineColor, value);
    }

    modelMatrix(value) {
        this.gl.uniformMatrix4fv(this.uniformLocations.modelMatrix, false, value);
    }

    projectionMatrix(value) {
        this.gl.uniformMatrix4fv(this.uniformLocations.projectionMatrix, false, value);
    }
    
    shadingMode(value) {
        this.gl.uniform1f(this.uniformLocations.shadingMode, value);
    }
}

