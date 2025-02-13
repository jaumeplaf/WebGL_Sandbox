class MeshActor
{
    constructor(inMeshObject)
    {
        this.meshObject = inMeshObject;
        this.scene = ACTIVE_SCENE;
        this.color = [0.7, 0.7, 0.7, 1.0];
        this.modelMatrixIndex = mat4.create();

        this.getBuffers();
        this.initColors();
        this.scene.addMeshActor(this);

        this.id = this.scene.meshActors.length - 1;
    }

    initColors()
    {      
      if (this.colors) {
        this.colors = [...this.colors];
        this.idBufferColors = window.gl.createBuffer();
        window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.idBufferColors);
        window.gl.bufferData(window.gl.ARRAY_BUFFER, new Float32Array(this.colors), window.gl.STATIC_DRAW);
      }
      else{
        this.colors = new Array(this.vertices.length).fill(1);
        this.idBufferColors = window.gl.createBuffer();
        window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.idBufferColors);
        window.gl.bufferData(window.gl.ARRAY_BUFFER, new Float32Array(this.colors), window.gl.STATIC_DRAW);
      }
    }

    getBuffers() //Copy buffer IDs and data from meshObject if they exist
    {
        const attributes = ['indices', 'vertices', 'normals', 'colors', 'texcoords1'];
        
        attributes.forEach(attr => {
          const bufferIdName = `idBuffer${attr.charAt(0).toUpperCase() + attr.slice(1)}`;
          if (this.meshObject[bufferIdName]) {
            this[bufferIdName] = this.meshObject[bufferIdName];
            this[attr] = this.meshObject[attr];
          }
        });
    }

    getPosition() 
    {
        return [
            this.modelMatrixIndex[12],
            this.modelMatrixIndex[13],
            this.modelMatrixIndex[14]
        ];
    }
    
    getScale() 
    {
        return [
            this.modelMatrixIndex[0],
            this.modelMatrixIndex[5],
            this.modelMatrixIndex[10]
        ];
  }

  getUniformScale()
  {
    let vScale = this.getScale();
    return Math.max(vScale[0], vScale[1], vScale[2]);
  }

  getPlaneNormal()
  {
    let vNormal = vec3.fromValues(0, 1, 0); // Assuming the plane's normal is initially (0, 1, 0)
    vec3.transformMat4(vNormal, vNormal, this.modelMatrixIndex);
    return vec3.normalize(vNormal, vNormal);
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

  setTranslation(tx, ty, tz)
  {
    let M = mat4.create();
    let T = mat4.create();

    mat4.fromTranslation(T, [tx, ty, tz]);
    mat4.multiply(M, this.modelMatrixIndex, T);

    this.modelMatrixIndex = M;
  }

  setScale(sx, sy, sz)
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

  setColor(newColor) 
  {
    this.color = newColor;
    if (this.colors) {
      for (let i = 0; i < this.colors.length; i += 4) {
          this.colors[i] = newColor[0];
          this.colors[i + 1] = newColor[1];
          this.colors[i + 2] = newColor[2];
          this.colors[i + 3] = newColor[3];
      }
      window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.idBufferColors);
      window.gl.bufferData(window.gl.ARRAY_BUFFER, new Float32Array(this.colors), window.gl.STATIC_DRAW);
    }
  }

  drawMeshActor()
  {
    this.meshObject.material.setModelMatrix(this.modelMatrixIndex);
    this.meshObject.material.setCelShading();
    drawModel(this, this.scene.drawMode);
  }
}