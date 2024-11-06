//Initialize HTML inputs

const inShadingMode = document.getElementById('shadingMode');
const inWireframeIgnoreFog = document.getElementById('wireframeIgnoreFog');
const inWireframeOpacity = document.getElementById('wireframeOpacity');
const inFogColor = document.getElementById('fogColor');
const inFogAmount = document.getElementById('fogAmount');
const inFogPower = document.getElementById('fogPower');

function initializeEventListeners(inScene, inputParam)
{
  //Shading mode select
  inShadingMode.addEventListener('change', (event) => {
    inputParam.shadingMode = parseInt(event.target.value);
    requestAnimationFrame(() => inScene.drawScene());
  });
  
  inWireframeOpacity.addEventListener('change', (event) =>{
    inputParam.wireframeOpacity = event.target.value;
    requestAnimationFrame(() => inScene.drawScene());
  });
  
  inFogColor.addEventListener('change', (event) =>{
    inputParam.fogColor = hexToRgba(event.target.value, 1.0) ;
    requestAnimationFrame(() => inScene.drawScene());
  });

  inFogAmount.addEventListener('change', (event) =>{
    inputParam.fogAmount = event.target.value;
    requestAnimationFrame(() => inScene.drawScene());
  });
  
  inFogPower.addEventListener('change', (event) =>{
    inputParam.fogPower = event.target.value;
    requestAnimationFrame(() => inScene.drawScene());
  });

  //Wireframe ignore fog toggle
  inWireframeIgnoreFog.addEventListener('change', (event) => {
    if([0, 2, 4].includes(inputParam.shadingMode)){ //If shadingMode has to render wireframe
      inputParam.wireframeIgnoreFog = event.target.checked ? 1.0 : 0.0;
    }
    requestAnimationFrame(() => inScene.drawScene());
  });
}

function updateUniforms(inputParam, inProgram)
{
  window.gl.uniform1f(inProgram.progShadingMode, inputParam.shadingMode);
  window.gl.uniform1f(inProgram.progIsLine, 0.0);
  window.gl.uniform1f(inProgram.progWireframeOpacity, inputParam.wireframeOpacity);
  
  window.gl.uniform4f(inProgram.progFogColor, inputParam.fogColor[0], inputParam.fogColor[1],inputParam.fogColor[2],inputParam.fogColor[3]);
  window.gl.uniform1f(inProgram.progFogAmount, inputParam.fogAmount);
  window.gl.uniform1f(inProgram.progFogPower, inputParam.fogPower);  
  window.gl.uniform1f(inProgram.progWireframeIgnoreFog, inputParam.wireframeIgnoreFog);

  window.gl.uniform1f(inProgram.progNearPlane, inputParam.nearPlane);
  window.gl.uniform1f(inProgram.progFarPlane, inputParam.farPlane);  

}

class InputParameters
{ 
  constructor(inCamera)
  {
    this.shadingMode = parseInt(inShadingMode.value);
    this.wireframeOpacity = inWireframeOpacity.value;

    this.fogColor = hexToRgba(inFogColor.value, 1.0);
    this.fogAmount = inFogAmount.value;
    this.fogPower = inFogPower.value;
    this.wireframeIgnoreFog = inWireframeIgnoreFog.checked ? 1.0 : 0.0;

    this.nearPlane = inCamera.nearPlane;
    this.farPlane = inCamera.farPlane;

  }
}

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