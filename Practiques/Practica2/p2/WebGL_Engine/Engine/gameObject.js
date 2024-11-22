class GameObject 
{
  constructor(inModel, inShader)
  {
    this.model = inModel;
    this.instances = [];

    this.modelMatrixIndex = mat4.create();
    this.color = [0.8,0.8,0.8];
    
    this.shader = inShader;
    this.timeScale = 1;
    this.axis = [0,0,1];
    
    this.initializeBuffers();
  }
  
  initializeBuffers()
  {
    this.initAttributeBuffer('indices', 'ELEMENT_ARRAY_BUFFER', Uint16Array);
    this.initAttributeBuffer('vertices', 'ARRAY_BUFFER', Float32Array);
    this.initAttributeBuffer('normals', 'ARRAY_BUFFER', Float32Array);
    this.initAttributeBuffer('colors', 'ARRAY_BUFFER', Float32Array);
  }

  initAttributeBuffer(attributeName, bufferType, arrayType) {
    const data = this.model[attributeName];
    this[attributeName] = data;
    const bufferIdName = `idBuffer${attributeName.charAt(0).toUpperCase() + attributeName.slice(1)}`;
    this[bufferIdName] = window.gl.createBuffer();
    window.gl.bindBuffer(window.gl[bufferType], this[bufferIdName]);
    window.gl.bufferData(window.gl[bufferType], new arrayType(data), window.gl.STATIC_DRAW);
  }

  setMatrix(tx, ty, tz, uniformS)
  {
    //Initilaize ModelView, translation, scale matrix 
    let M = mat4.create();
    let T = mat4.create();
    let S = mat4.create ();

    mat4.fromScaling(S, [uniformS, uniformS, uniformS]);
    mat4.fromTranslation(T, [tx, ty, tz]);
    mat4.multiply(M, T, S);

    this.modelMatrixIndex = M;
  }

  setTransform(sx, sy, sz)
  {
    let M = mat4.create();
    let S = mat4.create ();

    mat4.fromScaling(S, [sx, sy, sz]);
    mat4.multiply(M, this.modelMatrixIndex, S);

    this.modelMatrixIndex = M;
  }

  setRotation(angle, axis)
  {
    let R = mat4.create();
    mat4.fromRotation(R, degToRad(angle), axis);
    mat4.multiply(this.modelMatrixIndex, this.modelMatrixIndex, R);
  }

  draw(inInput){
    drawModel(inInput, this);
  }

 
  }

class ObjectInstance extends GameObject
{
  constructor(inGameObject, inObjectCollection)
  {
    super(inGameObject.model, inGameObject.shader);

    this.parent = inGameObject;
    this.collection = inObjectCollection;
    
    this.modelMatrixIndex = mat4.create();

    this.triCount = Math.round(this.parent.indices.length / 9);

    this.addInstance();
  } 
  
  setColor(newColor)
  {
    this.color = newColor;
  }

  addInstance(){
    this.parent.instances.push(this);
    this.collection.add(this);
  }

  removeInstance() {
    const index = this.parent.instances.indexOf(this);
    if (index !== -1) {
      this.instances.splice(index, 1);
    }
    this.collection.remove(this);
  }

  destroy()
  {
    this.removeInstance();
    //Clear buffers
  }

  draw(inInput)
  {
    this.collection.shader.setModelMatrix(this.modelMatrixIndex);
    drawModel(inInput, this);
  }
}

class ObjectCollection
{
    constructor(inShader)
    {
        this.sharedShaderGroup = [];
        this.shader = inShader;
        this.totalTriCount = 0;
        this.drawCalls = 0;
    }

    add(model)
    {
        this.sharedShaderGroup.push(model);
    }

    remove(model) 
    {
      const index = this.sharedShaderGroup.indexOf(model);
      if (index !== -1) {
        this.sharedShaderGroup.splice(index, 1);
      }
    }

    draw(inInput)
    {
      for(let object of this.sharedShaderGroup){
          this.shader.setModelMatrix(object.modelMatrixIndex);
          this.totalTriCount += object.triCount;
          this.drawCalls ++;
          object.draw(inInput);
      }
    }

}
  
