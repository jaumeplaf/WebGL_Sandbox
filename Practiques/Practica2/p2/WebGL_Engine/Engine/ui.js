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

function updateFpsCounter(deltaTime, precision) {
    if (deltaTime > 0) {
        const fps = Math.min(1 / deltaTime, 999);
        const frameTimeMs = deltaTime * 1000;

        outFps.textContent = fps.toFixed(precision) + " fps";
        outFrameTime.textContent = frameTimeMs.toFixed(precision) + " ms";
    }
}

function updateFovDisplay(fov)
{
    outFov.textContent = fov + "º";
}

function updatePOI(inCamera)
{
    outPoi.textContent = inCamera.positionPOI[0].toFixed(2) + ", " + inCamera.positionPOI[1].toFixed(2) + ", " + inCamera.positionPOI[0].toFixed(2);
}

