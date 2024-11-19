let keyForward = 'w';
let keyLeft = 'a';
let keyBackward = 's';
let keyRight = 'd';
let keyUp = ' ';
let keyDown = 'q';
let keyWireframe = '1';
let keyBaseColor = '2';
let keyColorWireframe = '3';
let keyNormal = '4';
let keyNormalWireframe = '5';
let keySprint = 'shift';

class InputParameters
{ 
  constructor(inCamera)
  {
    this.mouseLock = false;

    this.shadingMode = parseInt(inShadingMode.value);
    this.wireframeOpacity = inWireframeOpacity.value;
    this.fogColor = hexToRgba(inFogColor.value, 1.0);
    this.fogAmount = inFogAmount.value;
    this.fogPower = inFogPower.value;
    this.wireframeIgnoreFog = inWireframeIgnoreFog.checked ? 1.0 : 0.0;
    
    this.fov = degToRad(inFov.value);
    this.nearPlane = inCamera.nearPlane;
    this.farPlane = inCamera.farPlane;

    //this.mouseLock = false;
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

      let key = event.key.toLowerCase();

      if(key === keyForward) inScene.player.moveForward = true;
      if(key === keyLeft) inScene.player.moveLeft = true;
      if(key === keyBackward) inScene.player.moveBack = true;
      if(key === keyRight) inScene.player.moveRight = true;
      if(key === keyUp) inScene.player.moveUp = true;
      if(key === keyDown) inScene.player.moveDown = true;
      if(key === keySprint) inScene.player.sprint = true;

      if(key === keyWireframe || key === keyBaseColor || key === keyColorWireframe || key === keyNormal || key === keyNormalWireframe)
      {
        this.shadingMode = parseInt(key) - 1;
        requestAni//mationFrame(() => inScene.drawScene());
      }
    });

    window.addEventListener('keyup', (event) => {

      let key = event.key.toLowerCase();

      if(key === keyForward) inScene.player.moveForward = false;
      if(key === keyLeft) inScene.player.moveLeft = false;
      if(key === keyBackward) inScene.player.moveBack = false;
      if(key === keyRight) inScene.player.moveRight = false;
      if(key === keyUp) inScene.player.moveUp = false;
      if(key === keyDown) inScene.player.moveDown = false;
      if(key === keySprint) inScene.player.sprint = false;
    });

    //Mouse
    canvas.addEventListener('click', () => {
      canvas.requestPointerLock();
      this.mouseLock = true;
    });

    canvas.addEventListener('wheel', (event) => {
      if(this.mouseLock){
        if(event.deltaY < 0){ //SpeedUp
          inScene.player.updateSpeed(true);
        }
        else if(event.deltaY > 0){ //SpeedDown
          inScene.player.updateSpeed(false);
        }
      }
    });


    //TODO: not working with trackpad, when you move it loses input?
    document.addEventListener('mousemove', (event) => {
      if (document.pointerLockElement === canvas) {
          let sensitivity =  0.002;
          let deltaX = event.movementX;
          let deltaY = event.movementY;
          // Modify camera's target position to "look" left/right and up/down
          inScene.player.camera.rotateView(deltaX * sensitivity, deltaY * sensitivity);
      }
  });

    //UI
    
    //Shading mode select
    inShadingMode.addEventListener('change', (event) => {
      this.shadingMode = parseInt(event.target.value);
    });
    
    inWireframeOpacity.addEventListener('input', (event) =>{
      this.wireframeOpacity = event.target.value;
    });
    
    inFogColor.addEventListener('input', (event) =>{
      this.fogColor = hexToRgba(event.target.value, 1.0) ;
    });
    
    inFogAmount.addEventListener('input', (event) =>{
      this.fogAmount = event.target.value;
    });
    
    inFogPower.addEventListener('input', (event) =>{
      this.fogPower = event.target.value;
    });
  
    //Wireframe ignore fog toggle
    inWireframeIgnoreFog.addEventListener('change', (event) => {
      if([0, 2, 4].includes(this.shadingMode)){ //If shadingMode has to render wireframe
        this.wireframeIgnoreFog = event.target.checked ? 1.0 : 0.0;
      }
    });

    inFov.addEventListener('input', (event) => {
    this.fov = event.target.value;
    inScene.player.updateFov(this.fov);
    });

    inSavePOI.addEventListener('click', (event) => {
      inScene.camera.savePOI(inScene.camera.position, inScene.camera.target);
    });

    inLoadPOI.addEventListener('click', (event) => {
      inScene.camera.loadPOI();
    });
  }
}