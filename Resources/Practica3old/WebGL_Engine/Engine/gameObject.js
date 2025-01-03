//Convert to resource manager -> mesh object + actor? + just 1 shader? (or just remove obj collections, and render them in order of shader)
//Check P2 json values!

class MeshObject 
{
  constructor(inModel, inMaterial)
  {
    this.name = inModel.name;
    this.model = inModel;
    this.instances = [];

    this.modelMatrixIndex = mat4.create();
    this.color = [0.8,0.8,0.8];
    
    this.material = inMaterial;

    this.rotationSpeed = 0;
    this.rotationAxis = [0, 1, 0];
    
    this.initializeBuffers();
  }
  
  initializeBuffers()
  {
    this.initAttributeBuffer('indices', 'ELEMENT_ARRAY_BUFFER', Uint16Array);
    this.initAttributeBuffer('vertices', 'ARRAY_BUFFER', Float32Array);
    this.initAttributeBuffer('normals', 'ARRAY_BUFFER', Float32Array);
    this.initAttributeBuffer('colors', 'ARRAY_BUFFER', Float32Array); 
    this.initAttributeBuffer('texcoords1', 'ARRAY_BUFFER', Float32Array); 
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

class MeshActor extends MeshObject
{
  constructor(inMeshObject)
  {
    super(inMeshObject.model, inMeshObject.material);

    this.parent = inMeshObject;
    this.collection = this.material.collection;
    this.triCount = Math.round(this.parent.indices.length / 9);
    this.getBuffers();
    
    this.addInstance();
  } 

  getBuffers() {
    //Copy buffer IDs and data from parent if they exist
    const attributes = ['indices', 'vertices', 'normals', 'colors', 'texcoords1'];
    
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
    //console.log("Setting new color: ", newColor);
    //console.log("Initial colors array: ", this.colors);
  
    for (let i = 0; i < this.colors.length; i += 4) {
      this.colors[i] = newColor[0];
      this.colors[i + 1] = newColor[1];
      this.colors[i + 2] = newColor[2];
      this.colors[i + 3] = newColor[3];
    }
  
    //console.log("Updated colors array: ", this.colors);
  
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.idBufferColors);
    window.gl.bufferSubData(window.gl.ARRAY_BUFFER, 0, new Float32Array(this.colors));
    //console.log("Buffer updated with new colors");
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

  drawInst()
  {
    this.collection.material.setModelMatrix(this.modelMatrixIndex);
    drawModel(this);
  }
}

class SceneActorsCollection
{
    constructor(inMaterial)
    {
        this.sharedMaterialGroup = [];
        this.material = inMaterial;
    }

    add(model)
    {
        this.sharedMaterialGroup.push(model);
    }

    remove(model) 
    {
      const index = this.sharedMaterialGroup.indexOf(model);
      if (index !== -1) {
        this.sharedMaterialGroup.splice(index, 1);
      }
    }

    draw(inInput)
    {
      for(let object of this.sharedMaterialGroup){
          this.material.setModelMatrix(object.modelMatrixIndex);

          object.drawInst();
      }
    }

}

