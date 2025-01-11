const rtDisplay = document.getElementById('rtDisplay');
const rtCanvas = document.getElementById('rtCanvas');
const rtButton = document.getElementById('rtButton');
const keyRender = 'Enter';
const rtWidth = rtCanvas.width;
const rtHeight = rtCanvas.height;

function initHandlers()
{
    rtButton.addEventListener('click', function() {
        console.log("Initializing rendering...");
        const startTime = performance.now();
        render();
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        updateRtDisplay(renderTime);
        console.log("Rendering complete in " + renderTime.toFixed(2) + " ms");
    });

    document.addEventListener('keydown', function(event) {
        if(event.key === keyRender) {
            console.log("Initializing rendering...");
            const startTime = performance.now();
            render();
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            updateRtDisplay(renderTime);
            console.log("Rendering complete in " + renderTime.toFixed(2) + " ms");
        }
    });

}

function updateRtDisplay(time) //Update render time display
{ 
    rtDisplay.textContent = "Last render took " + time.toFixed(2) + " ms";
}

function render() //Start rendering
{ 
    //Render scene
}

//Run code
initHandlers();