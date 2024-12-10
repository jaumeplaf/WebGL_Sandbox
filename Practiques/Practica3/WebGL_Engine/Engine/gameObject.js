class GameObject 
{
  constructor(inModel, inShader, colors, uv1)
  {
    this.name = inModel.name;
    this.model = inModel;
    this.instances = [];

    this.modelMatrixIndex = mat4.create();
    this.color = [0.8,0.8,0.8];
    
    this.shader = inShader;

    this.rotationSpeed = 0;
    this.rotationAxis = [0, 1, 0];
    
    this.initializeBuffers(colors, uv1);
  }
  
  initializeBuffers(inColors, inUv1)
  {
    this.initAttributeBuffer('indices', 'ELEMENT_ARRAY_BUFFER', Uint16Array);
    this.initAttributeBuffer('vertices', 'ARRAY_BUFFER', Float32Array);
    this.initAttributeBuffer('normals', 'ARRAY_BUFFER', Float32Array);
    if(inColors) {this.initAttributeBuffer('colors', 'ARRAY_BUFFER', Float32Array); console.log("init colors");}
    if(inUv1) {this.initAttributeBuffer('texcoords1', 'ARRAY_BUFFER', Float32Array); console.log("init uv1");}
  }

  initializeUv2(){
    this.initAttributeBuffer('texcoords2', 'ARRAY_BUFFER', Float32Array);
    console.log("init uv2");
  }

  initializeUv3(){
    this.initAttributeBuffer('texcoords3', 'ARRAY_BUFFER', Float32Array);
    console.log("init uv3");
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

  setRotationSpeed(speed, axis) {
    this.rotationSpeed = speed; // Degrees per second
    this.rotationAxis = axis;
}

  setRotation(angle, axis)
  {
    let R = mat4.create();
    mat4.fromRotation(R, degToRad(angle), axis);
    mat4.multiply(this.modelMatrixIndex, this.modelMatrixIndex, R);
  }

  update(deltaTime) {
    if (this.rotationSpeed !== 0) {
        const angle = this.rotationSpeed * deltaTime; // Increment based on delta time
        let R = mat4.create();
        mat4.fromRotation(R, degToRad(angle), this.rotationAxis);
        mat4.multiply(this.modelMatrixIndex, R, this.modelMatrixIndex);
    }
  } 
}

class ObjectInstance extends GameObject
{
  constructor(inGameObject)
  {
    super(inGameObject.model, inGameObject.shader);

    this.parent = inGameObject;
    this.collection = this.shader.collection;
    this.triCount = Math.round(this.parent.indices.length / 9);
    this.getBuffers();
    
    console.log("Colors: ", this.colors);
    this.addInstance();
  } 

  getBuffers() {
    //Copy buffer IDs and data from parent if they exist
    const attributes = ['indices', 'vertices', 'normals', 'colors', 'texcoords1', 'texcoords2', 'texcoords3'];
    
    attributes.forEach(attr => {
      const bufferIdName = `idBuffer${attr.charAt(0).toUpperCase() + attr.slice(1)}`;
      if (this.parent[bufferIdName]) {
        this[bufferIdName] = this.parent[bufferIdName];
        this[attr] = this.parent[attr];
      }
    });
  }
  
  setColor(newColor) {
    this.color = newColor;
    console.log("Setting new color: ", newColor);
    console.log("Initial colors array: ", this.colors);
  
    for (let i = 0; i < this.colors.length; i += 4) {
      this.colors[i] = newColor[0];
      this.colors[i + 1] = newColor[1];
      this.colors[i + 2] = newColor[2];
      this.colors[i + 3] = newColor[3];
    }
  
    console.log("Updated colors array: ", this.colors);
  
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.idBufferColors);
    window.gl.bufferSubData(window.gl.ARRAY_BUFFER, 0, new Float32Array(this.colors));
    console.log("Buffer updated with new colors");
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

  drawInst(inInput)
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
          //this.totalTriCount += object.triCount;
          //this.drawCalls ++;
          object.drawInst(inInput);
      }
    }

}
  
