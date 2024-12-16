//Initialize HTML outputs
const outFps = document.getElementById('fpsCounter');
const outFrameTime = document.getElementById('frameTime');
const outFov = document.getElementById('displayFov');
const outPoi = document.getElementById('POIdisplay');

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

