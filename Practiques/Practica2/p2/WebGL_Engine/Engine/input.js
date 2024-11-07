
class InputParameters
{ 
  constructor(inCamera)
  {
    this.fov = degToRad(inFov.value);
    this.shadingMode = parseInt(inShadingMode.value);
    this.wireframeOpacity = inWireframeOpacity.value;
    
    this.fogColor = hexToRgba(inFogColor.value, 1.0);
    this.fogAmount = inFogAmount.value;
    this.fogPower = inFogPower.value;
    this.wireframeIgnoreFog = inWireframeIgnoreFog.checked ? 1.0 : 0.0;

    this.nearPlane = inCamera.nearPlane;
    this.farPlane = inCamera.farPlane;
  }

  updateUniforms(inProgram)
  {
    window.gl.uniform1f(inProgram.progShadingMode, this.shadingMode);
    window.gl.uniform1f(inProgram.progIsLine, 0.0);
    window.gl.uniform1f(inProgram.progWireframeOpacity, this.wireframeOpacity);
    
    window.gl.uniform4f(inProgram.progFogColor, this.fogColor[0], this.fogColor[1],this.fogColor[2],this.fogColor[3]);
    window.gl.uniform1f(inProgram.progFogAmount, this.fogAmount);
    window.gl.uniform1f(inProgram.progFogPower, this.fogPower);  
    window.gl.uniform1f(inProgram.progWireframeIgnoreFog, this.wireframeIgnoreFog);
  
    window.gl.uniform1f(inProgram.progNearPlane, this.nearPlane);
    window.gl.uniform1f(inProgram.progFarPlane, this.farPlane);  
  
  }

  initializeEventListeners(inScene)
  {
    //Keyboard
    window.addEventListener('keydown', (event) => {
      if(event.key === 'w' || event.key === 'W') inScene.camera.moveForward = true;
      if(event.key === 'a' || event.key === 'A') inScene.camera.moveLeft = true;
      if(event.key === 's' || event.key === 'S') inScene.camera.moveBack = true;
      if(event.key === 'd' || event.key === 'D') inScene.camera.moveRight = true;
    });

    window.addEventListener('keyup', (event) => {
      if(event.key === 'w' || event.key === 'W') inScene.camera.moveForward = false;
      if(event.key === 'a' || event.key === 'A') inScene.camera.moveLeft = false;
      if(event.key === 's' || event.key === 'S') inScene.camera.moveBack = false;
      if(event.key === 'd' || event.key === 'D') inScene.camera.moveRight = false;
    });


    //Mouse

    //UI
    inFov.addEventListener('input', (event) => {
      this.fov = event.target.value;
      inScene.updateFov(this.fov);
      requestAnimationFrame(() => inScene.drawScene());
    });
  
    //Shading mode select
    inShadingMode.addEventListener('change', (event) => {
      this.shadingMode = parseInt(event.target.value);
      requestAnimationFrame(() => inScene.drawScene());
    });
    
    inWireframeOpacity.addEventListener('input', (event) =>{
      this.wireframeOpacity = event.target.value;
      requestAnimationFrame(() => inScene.drawScene());
    });
    
    inFogColor.addEventListener('input', (event) =>{
      this.fogColor = hexToRgba(event.target.value, 1.0) ;
      requestAnimationFrame(() => inScene.drawScene());
    });
  
    inFogAmount.addEventListener('input', (event) =>{
      this.fogAmount = event.target.value;
      requestAnimationFrame(() => inScene.drawScene());
    });
    
    inFogPower.addEventListener('input', (event) =>{
      this.fogPower = event.target.value;
      requestAnimationFrame(() => inScene.drawScene());
    });
  
    //Wireframe ignore fog toggle
    inWireframeIgnoreFog.addEventListener('change', (event) => {
      if([0, 2, 4].includes(this.shadingMode)){ //If shadingMode has to render wireframe
        this.wireframeIgnoreFog = event.target.checked ? 1.0 : 0.0;
      }
      requestAnimationFrame(() => inScene.drawScene());
    });
  }
}


//External object load

function loadOBJ() 
{
  console.log("Load obj")
  //example objToJSON
}

function loadJSON()
{
  console.log("Load JSON")
  //python server? no need, see solution 2
  //objToJSON -> save JSON -> link in HTML 
  //Parse JSON
}

function loadGLTF()
{
  console.log("Load GLTF");
}