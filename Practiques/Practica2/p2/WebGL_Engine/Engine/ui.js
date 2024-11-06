const outFps = document.getElementById('fpsCounter');
const outFrameTime = document.getElementById('frameTime');
let counter = 0;
let accumDeltaTime = 0.0;
let fps = 0.0;

function updateFpsCounter(deltaTime, precision)
{
    deltaTime = deltaTime * 1000;
    let frameFps = 1000/deltaTime;
    
    outFps.textContent = frameFps.toFixed(precision) + " fps";
    outFrameTime.textContent = deltaTime.toFixed(precision) + " ms";
}