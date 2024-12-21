//Initialize HTML outputs
const outFps = document.getElementById('fpsCounter');
const outFrameTime = document.getElementById('frameTime');
const outFov = document.getElementById('displayFov');

function updateFpsCounter(deltaTime, precision) 
{
    if (deltaTime > 0) {
        const fps = 1 / deltaTime;
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

function updateLightUI(light) {
    // Convert the light color arrays to hex here if needed
    inLa.value = rgbToHex(light.La[0], light.La[1], light.La[2]);
    inLd.value = rgbToHex(light.Ld[0], light.Ld[1], light.Ld[2]);
    inLs.value = rgbToHex(light.Ls[0], light.Ls[1], light.Ls[2]);
  }
