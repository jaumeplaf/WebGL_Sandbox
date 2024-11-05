const outFps = document.getElementById('fpsCounter');
const outFrameTime = document.getElementById('frameTime');
let counter = 0;
let accumDeltaTime = 0.0;
let fps = 0.0;

function updateFpsCounter(deltaTime)
{
    let frameTime =  accumulateFps(deltaTime).toFixed(2);
    let frameFps = 1000/accumulateFps(deltaTime);
    
    outFps.textContent = frameFps.toFixed(2) + " fps";
    outFrameTime.textContent = frameTime + " ms";
}

function accumulateFps(deltaTime)
{
    if(counter<=60){
        counter++;
        accumDeltaTime += deltaTime;
    }
    else{
        fps = 1000 / accumDeltaTime / 60;
        accumDeltaTime = 0.0;
        counter = 0;
    }
    console.log(fps);
    return fps;
}