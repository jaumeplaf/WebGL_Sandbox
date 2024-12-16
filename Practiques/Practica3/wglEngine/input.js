//Initialize key inputs
const keyForward = 'w';
const keyLeft = 'a';
const keyBackward = 's';
const keyRight = 'd';
const keyUp = ' ';
const keyDown = 'q';
const keySprint = 'shift';

//Initialize HTML inputs
const inShadingMode = document.getElementById('shadingMode');
const inWireframeIgnoreFog = document.getElementById('wireframeIgnoreFog');
const inWireframeOpacity = document.getElementById('wireframeOpacity');
const inFogColor = document.getElementById('fogColor');
const inFogAmount = document.getElementById('fogAmount');
const inFogPower = document.getElementById('fogPower');
const inFov = document.getElementById('fov');
const inSavePOI = document.getElementById('savePOI');
const inLoadPOI = document.getElementById('loadPOI');

class InputParameters
{ 
  constructor(inCamera)
  {
    this.mouseLock = false;

    this.fogColor = hexToRgba(inFogColor.value, 1.0);
    this.fogAmount = inFogAmount.value;
    this.fogPower = inFogPower.value;
    
    this.fov = degToRad(inFov.value);
    this.nearPlane = inCamera.nearPlane;
    this.farPlane = inCamera.farPlane;
  }

  setUniforms(inProgram)
  {
    window.gl.uniform4f(inProgram.progFogColor, this.fogColor[0], this.fogColor[1],this.fogColor[2],this.fogColor[3]);
    window.gl.uniform1f(inProgram.progFogAmount, this.fogAmount);
    window.gl.uniform1f(inProgram.progFogPower, this.fogPower);  
  
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

    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement === canvas) {
          console.log('Pointer lock active');
      } else {
          console.log('Pointer lock released');
      }
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

    document.addEventListener('pointerlockchange', () => {
      this.mouseLock = (document.pointerLockElement === canvas);
    });

    document.addEventListener('mousemove', (event) => {
      if (document.pointerLockElement === canvas) { //Mouse look
          let sensitivity =  0.002;
          let deltaX = event.movementX;
          let deltaY = event.movementY;

          inScene.player.camera.rotateView(deltaX * sensitivity, deltaY * sensitivity);
      }
  });

    //UI
    inFogColor.addEventListener('input', (event) =>{
      this.fogColor = hexToRgba(event.target.value, 1.0) ;
    });
    
    inFogAmount.addEventListener('input', (event) =>{
      this.fogAmount = event.target.value;
    });
    
    inFogPower.addEventListener('input', (event) =>{
      this.fogPower = event.target.value;
    });

    //Camera controls
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