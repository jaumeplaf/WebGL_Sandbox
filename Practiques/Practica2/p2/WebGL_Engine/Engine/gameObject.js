class GameObject 
{
  constructor(inModel, inShader, hasNrml, hasCol)
  {
    this.model = inModel;
    this.instances = [];

    this.modelMatrixIndex = mat4.create();
    this.baseColor = [0.8,0.8,0.8];
    
    this.vertices = this.model.vertices;
    this.indices = this.model.indices;
    this.normals = [];
    this.colors = [];
    
    this.shader = inShader;
    this.timeScale = 1;
    this.axis = [0,0,1];

    this.initializeObject(hasNrml, hasCol);
  }

  initializeObject(hasNrml, hasCol)
  {
    if(hasNrml) this.normals = this.model.normals;
    if(hasCol) this.colors = this.model.colors;
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
  }

  setRotation(angle, axis)
  {
    let R = mat4.create();
    mat4.fromRotation(R, degToRad(angle), axis);
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

class ObjectInstance extends GameObject
{
  constructor(inGameObject, inObjectCollection)
  {
    super(inGameObject.model, inGameObject.shader, false, false);

    this.parent = inGameObject;
    this.collection = inObjectCollection;
    
    this.modelMatrixIndex = mat4.create();

    this.addInstance();
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
    drawModel(inInput, this.parent);
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

    remove(model) {
      const index = this.sharedShaderGroup.indexOf(model);
      if (index !== -1) {
        this.sharedShaderGroup.splice(index, 1);
      }
    }

    draw(inInput)
    {
      for(let object of this.sharedShaderGroup)
      {
          this.shader.setModelMatrix(object.modelMatrixIndex);
          object.draw(inInput);
      }
    }

}
  
