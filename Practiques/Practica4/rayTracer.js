//Input/Output
const rtButton = document.getElementById('rtButton');
const rtDisplay = document.getElementById('rtDisplay');
const keyRender = 'Enter';
//Global objects
let rtScene = null;
let rtCamera = null;
let Screen = {
    width 	: 0,
    height 	: 0,
    canvas 	: null,
    context : null,
    buffer 	: null
}
let rtObjects = [];
let rtLights = [];

const theta = Math.PI;
const phi = -Math.PI/2.0;

function getScene()
{
    rtScene = ACTIVE_SCENE; //Get scene from wglEngine
    rtCamera = rtScene.camera; //Can access .fov, .position, .forwardVec, .upVec, .rightVec    
    //For this exercise we will be using only spheres, planes and triangles
    rtObjects = rtScene.meshActors; //Can access rtObjects[i].meshObject.material, .getPosition(), .getScale()
    rtLights = rtScene.lights;
}

function initHandlers()
{
    getScene();

    Screen.canvas = document.getElementById('rtCanvas');
    if(Screen.canvas === null){
        alert("Canvas not found");
        return;
    }
    Screen.context = Screen.canvas.getContext('2d');
    if(Screen.context === null){
        alert("Couldn't get context");
        return;
    }
    Screen.height = Screen.canvas.height;
    Screen.width = Screen.canvas.width;
    Screen.buffer = Screen.context.createImageData(Screen.width, Screen.height);

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

function main()
{
    //Initialize handlers
    initHandlers();
}

//Run code
main();