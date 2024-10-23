class Cube {
  constructor(){
    this.vertices = exampleCube.vertices;
    this.indices = exampleCube.indices;
    this.modelMatrix = mat4.create();
  }

  setMatrix(tx, ty, tz)
    {
      var M = mat4.create();
      var T1 = mat4.create();
      mat4.fromScaling (M, [0.5, 0.5, 0.5]);
      mat4.fromTranslation(T1,[tx,ty,tz]);
      mat4.multiply(M, M, T1);
      this.modelMatrix = M;
    }
   animate (s)
   {
        var R = mat4.create();
        mat4.fromRotation(R, s, [0,0,1]);
        mat4.multiply(this.modelMatrix, this.modelMatrix, R);
   }
}
