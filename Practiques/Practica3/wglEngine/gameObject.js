class MeshActor
{
    constructor(inMeshObject)
    {
        this.meshObject = inMeshObject;
        this.color = [0.7, 0.7, 0.7, 1.0];
        this.modelMatrixIndex = mat4.create();

        this.getBuffers();
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
        for (let i = 0; i < this.colors.length; i += 4) {
          this.colors[i] = newColor[0];
          this.colors[i + 1] = newColor[1];
          this.colors[i + 2] = newColor[2];
          this.colors[i + 3] = newColor[3];
        }
        window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.idBufferColors);
        window.gl.bufferSubData(window.gl.ARRAY_BUFFER, 0, new Float32Array(this.colors));
      }

      drawMeshActor()
      {
        this.meshObject.material.setModelMatrix(this.modelMatrixIndex);
        drawModel(this);
      }
}