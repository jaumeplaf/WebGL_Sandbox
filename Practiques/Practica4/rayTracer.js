//Global objects
let Screen = {
    width 	: 0,
    height 	: 0,
    ratio   : 0,
    canvas 	: null,
    context : null,
    buffer 	: null
}
let rt = {
    display : document.getElementById('rtDisplay'),
    renderButton : document.getElementById('rtButton'),
    renderKey : 'Enter',
    theta : Math.PI,
    phi : -Math.PI/2.0,
    scene : null,
    camera : null,
    P0 : null,
    incX : null,
    incY : null,
    objects : [],
    lights : []
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
    Screen.ratio = Screen.height / Screen.width; //?
    Screen.buffer = Screen.context.createImageData(Screen.width, Screen.height);

    rt.renderButton.addEventListener('click', function() {
        console.log("Initializing rendering...");
        const startTime = performance.now();
        render();
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        updateRtDisplay(renderTime);
        console.log("Rendering complete in " + renderTime.toFixed(2) + " ms");
    });

    document.addEventListener('keydown', function(event) {
        if(event.key === rt.renderKey) {
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

function getScene()
{
    rt.scene = ACTIVE_SCENE; //Get scene from wglEngine
    rt.camera = rt.scene.camera; //Can access .fov, .position, .forwardVec, .upVec, .rightVec    
    rt.objects = rt.scene.meshActors; //Can access rt.objects[i].meshObject.material, .getPosition(), .getScale()
    rt.objects = rt.objects.filter(object => { //Remove objects that are not spheres, planes or triangles from the intersectable objects list
        const tags = object.meshObject.tags;
        return tags.includes("sphere") || tags.includes("plane") || tags.includes("triangle");
    });
    rt.lights = rt.scene.lights;
}

function updateRtDisplay(time) //Update render time display
{ 
    rt.display.textContent = "Last render took " + time.toFixed(2) + " ms";
}

function render() //Start rendering
{ 
    rt.incX = calcIncrement(rt.camera, Screen, "x");
    rt.incY = calcIncrement(rt.camera, Screen, "y");
    rt.P0 = calcP0(rt.incX, rt.incY, rt.camera, Screen);

    rayTracing(rt.scene, Screen);

    Screen.context.putImageData(Screen.buffer, 0, 0);
}

function calcIncrement(cam, scr, n)
{
    let t = (rt.camera.fov * Math.PI / 180);
    let w = 2*Math.tan(t/2);
    let h = w*scr.ratio;
    let aux = w / scr.width;
    switch(n)
    {
        case "x":
            return vec3.scale(cam.rightVec, aux);
        case "y":
            return vec3.scale(cam.upVec, aux);
        default:
            throw new Error("Invalid axis, should be 'x' or 'y'");
    }
}

function calcP0(incX, incY, cam, scr)
{
    let P = vec3.subtract(cam.position, cam.forwardVec); //screen center
    let hX = vec3.scale(incX, ((scr.width - 1) / 2)); //half width
    let hY = vec3.scale(incY, ((scr.height - 1) / 2)); //half height
    let aux = vec3.subtract(P, hX); //middle left
    return vec3.add(aux, hY); //top left
}

function rayTracing(scene, screen)
{
    for(let x = 0; x < screen.width; x++){
        for(let y = 0; y < screen.height; y++){
            let rayDir = computeRay(x, y);
        }
    }
}

function computeRay(x, y)
{
    let scX = vec3.scale(rt.incX, x);
    let scY = vec3.scale(rt.incY, y);
    let pX = vec3.add(rt.P0, scX);
    let pY = vec3.subtract(pX, scY);
    let ray = vec3.subtract(pY, rt.camera.position);
    return vec3.normalize(ray);
}

function main()
{
    //Initialize handlers
    initHandlers();
}

//Run code
main();