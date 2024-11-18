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

//Initialize HTML outputs
const outFps = document.getElementById('fpsCounter');
const outFrameTime = document.getElementById('frameTime');
const outFov = document.getElementById('displayFov');
const outPoi = document.getElementById('POIdisplay');

let counter = 0;
let accumDeltaTime = 0.0;
let fps = 0.0;

function updateFpsCounter(deltaTime, precision)
{
    //TODO: this works before interacting with any input. When interacting, increases until
    //"fps: infinity fps" and "frame time: 0.00 ms"
    deltaTime = deltaTime * 1000;
    let frameFps = 1000/deltaTime;
    
    outFps.textContent = frameFps.toFixed(precision) + " fps";
    outFrameTime.textContent = deltaTime.toFixed(precision) + " ms";
}

function updateFovDisplay(fov)
{
    outFov.textContent = fov + "º";
}

//https://tweakpane.github.io/docs/getting-started/
//https://github.com/dataarts/dat.gui
//https://openrndr.org/
//https://github.com/jnmaloney/WebGui -> CORS??