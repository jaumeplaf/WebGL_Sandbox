//Initialize HTML parameters

//Get canvas
const canvas = document.getElementById("wglCanvas");

//Shading mode controls
const inShadingMode = document.getElementById('shadingMode');
var shadingMode = 2;

const inWireframeOpacity = document.getElementById('wireframeOpacity');
var wireframeOpacity = inWireframeOpacity.value;

//Fog controls
const inFogColor = document.getElementById('fogColor');
var fogColor = hexToRgba(inFogColor.value, 1.0);
const inFogAmount = document.getElementById('fogAmount');
var fogAmount = inFogAmount.value;
const inFogPower = document.getElementById('fogPower');
var fogPower = inFogPower.value;

const inWireframeIgnoreFog = document.getElementById('wireframeIgnoreFog');
var wireframeIgnoreFog = inWireframeIgnoreFog.checked ? 1 : 0;

//Link parameters
function linkParameters(glContext){
  //Shading mode select
  inShadingMode.addEventListener('change', (event) => {
    shadingMode = parseInt(event.target.value);
    // Show wireframe opacity only for values 0 and 2
    if (shadingMode === "0" || shadingMode === "2") {
        inWireframeOpacity.style.display = "block";
        console.log(inWireframeOpacity.style.display);
        } else {
            inWireframeOpacity.style.display = "none";
            console.log(inWireframeOpacity.style.display);
    }
   requestAnimationFrame(drawScene);

  });

  wireframeOpacity.addEventListener('change', (event) =>{
    wireOpacity = event.target.value;
    gl.uniform1f(program.progWireframeOpacity, wireOpacity);
    requestAnimationFrame(drawScene);
  });
  
  //Wireframe ignore fog toggle
  wireframeToggle.addEventListener('change', (event) => {
    if(shadingMode == 0 || shadingMode == 2){
      wireframeIgnoreFog = event.target.checked ? 1.0 : 0.0;
      gl.uniform1f(program.progWireframeAmount, wireframeIgnoreFog);
    }
    requestAnimationFrame(drawScene);
  });

  fogAmountSlider.addEventListener('change', (event) =>{
    fogAmount = event.target.value;
    gl.uniform1f(program.progFogAmount, fogAmount);
    requestAnimationFrame(drawScene);
    console.log(fogAmount);
  });

  fogPowerSlider.addEventListener('change', (event) =>{
    fogPower = event.target.value;
    gl.uniform1f(program.progFogPower, fogPower);
    requestAnimationFrame(drawScene);
    console.log(fogPower);
  });

  wireOpacity = wireframeOpacity.value;
  fogAmount = fogAmountSlider.value;
  fogPower = fogPowerSlider.value;
  gl.uniform1f(program.progWireframeOpacity, wireOpacity);
  gl.uniform1f(program.progFogAmount, fogAmount);
  gl.uniform1f(program.progFogPower, fogPower);

}