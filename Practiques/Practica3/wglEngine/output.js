//Initialize HTML outputs
const outFps = document.getElementById('fpsCounter');
const outFrameTime = document.getElementById('frameTime');
const outFov = document.getElementById('displayFov');
const outLightIntensity = document.getElementById('displayLightIntensity');
const outLightRadius = document.getElementById('displayLightRadius');
const outLightPosX = document.getElementById('displaylightPositionX');
const outLightPosY = document.getElementById('displaylightPositionY');
const outLightPosZ = document.getElementById('displaylightPositionZ');

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

function updateLightIntensityDisplay(intensity)
{
    inLightIntensity.value = intensity;
    outLightIntensity.textContent = intensity;
}

function updateLightRadiusDisplay(radius)
{
    inLightRadius.value = radius;
    outLightRadius.textContent = radius;
}

function updateLightPositions(inX, inY, inZ)
{
    inLightPosX.value = inX;
    outLightPosX.textContent = inLightPosX.value;
    inLightPosY.value = inY;
    outLightPosY.textContent = inLightPosY.value;
    inLightPosZ.value = inZ;
    outLightPosZ.textContent = inLightPosZ.value;
}

function updateLightUI(light) {
    // Convert the light color arrays to hex here if needed
    inLa.value = rgbToHex(light.La[0], light.La[1], light.La[2]);
    inLd.value = rgbToHex(light.Ld[0], light.Ld[1], light.Ld[2]);
    inLs.value = rgbToHex(light.Ls[0], light.Ls[1], light.Ls[2]);
  }
