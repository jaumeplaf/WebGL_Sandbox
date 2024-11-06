class GameObject 
{
  constructor()
  {
    this.modelMatrixIndex = mat4.create();
    this.baseColor = [1,0,0];
    this.vertices = [];
    this.indices = [];
    //change primitivasG.js for primitivasGN.js
    //this.normals = [];
    this.shader = null;
    this.timeScale = 1;
    this.axis = [0,0,1];
  }

  initializeObject(model, inShader)
  {
    this.vertices = model.vertices;
    this.indices = model.indices;
    this.shader = inShader;
    this.initBuffers()
  }

  initBuffers() {

    this.idBufferVertices = window.gl.createBuffer ();
    window.gl.bindBuffer (window.gl.ARRAY_BUFFER, this.idBufferVertices);
    window.gl.bufferData (window.gl.ARRAY_BUFFER, new Float32Array(this.vertices), window.gl.STATIC_DRAW);
    
    this.idBufferIndices = window.gl.createBuffer ();
    window.gl.bindBuffer (window.gl.ELEMENT_ARRAY_BUFFER, this.idBufferIndices);
    window.gl.bufferData (window.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), window.gl.STATIC_DRAW);
    
  }    

  setMatrix(tx, ty, tz, uniformS)
  {
    //Initilaize ModelView, translation, scale matrix 
    let M = mat4.create();
    let T = mat4.create();
    let S = mat4.create ();
    //Initialize scale and position
    mat4.fromScaling(S, [uniformS, uniformS, uniformS]);
    mat4.fromTranslation(T, [tx, ty, tz]);
    mat4.multiply(M, T, S);

    this.modelMatrixIndex = M;

    //window.gl.uniformMatrix4fv(this.shader.modelMatrixIndex, false, this.modelMatrixIndex);

  }
  
  setAnimation(speed, axis){
    this.timeScale = speed ;
    this.axis = axis;
  }

  animate(angle, axis)
  {
    let R = mat4.create();
      //Set rotation matrix (out, rad, axis)
      mat4.fromRotation(R, angle, axis);
      mat4.multiply(this.modelMatrixIndex, this.modelMatrixIndex, R);
  }

  setBaseColor(newBaseColor)
  {
    this.baseColor = newBaseColor;
  }

  draw(inInput){
    drawModel(inInput, this);
  }

}

class ObjectCollection
{
    constructor(camera)
    {
        this.sharedShaderGroup = [];
        this.shader = null;
    }

    initialize(inShader)
    {
        this.shader = inShader;
    }

    add(model)
    {
        this.sharedShaderGroup.push(model);
    }

    draw(inInput)
    {
      for(let object of this.sharedShaderGroup)
      {
          this.shader.setModelMatrix(object.modelMatrixIndex);
          object.draw(inInput);
      }
    }
    update(time){
      for(let object of this.sharedShaderGroup){
        object.animate(time * object.timeScale, object.axis);
      }
    }
}
  
