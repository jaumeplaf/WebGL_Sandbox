//Set canvas and shaders
const myCanvas = 'myCanvas';
const mainCanvas = document.getElementById(myCanvas);
const starVertexShader = 'solidColorVS';
const starFragmentShader = 'solidColorFS';

//Initialize buttons (foreground)
var newLineButton = document.getElementById("newLineButton");
var clearSceneButton = document.getElementById("clearSceneButton");

//Sliders (background)
let sliderPointNum = document.getElementById("PointNumber");
let sliderMaxSize = document.getElementById("MaxSizeStar");
let sliderStarScale = document.getElementById("StarScale");
let pointNumDisp = document.getElementById("PointNumberDisplay");
let maxSizeDisp = document.getElementById("MaxSizeDisplay");
let StarScaleDisp = document.getElementById("StarScaleDisplay");

let scaleValue = 1.0;

var pointNumber = parseFloat(sliderPointNum.value);
var minSizeStar = 0;
var maxSizeStar = parseFloat(sliderMaxSize.value);
var sScale = parseFloat(sliderStarScale.value);

var rPoints = randPoints(pointNumber, minSizeStar, maxSizeStar);
//Set background variables
const colorBackground = [0.0,0.0,0.0,1.0];
//Set foreground variables
let maxSides = 10;
//Correction to make sure maxSides is actually the right number
maxSides -= 3;

//Initialize stars and lines arrays
var starArray = [];
var lineArray = [];

//Store current line to allow new lines
var currentLine = {
    "vertices" : [],
    "np" : 0,
    "idBufferVertices": 0,
    "vCenter" : [],
    "t" : [],
    "sizes" : []
};

//Initialize WebGL & required components
function initWebGL() 
{
    gl = getWebGLContext(myCanvas);
    
    if (!gl) {
        alert("WebGL 2.0 is not aviable");
        return;
    }
    
    initShader(starVertexShader, starFragmentShader);
    initBuffers(rPoints);
    initRendering(colorBackground);
    initHandlers();
    
    requestAnimationFrame(drawScene);

    pointNumDisp.textContent = "Background stars number: " + sliderPointNum.value;
    maxSizeDisp.textContent = "Background star max size: " + sliderMaxSize.value;
    StarScaleDisp.textContent = "Star scaling: " + sliderStarScale.value;
}

function startNewLine() 
{
    // Add the current line to the lineArray
    if (currentLine.np > 0) {
        lineArray.push(currentLine);
    }

    // Start a new line
    currentLine = {
        "vertices": [],
        "np": 0,
        "idBufferVertices": gl.createBuffer(),
        "vCenter" : [],
        "t" : [],
        "sizes" : []
    };
    initBuffers(currentLine);
}


//Asyncronous function to be able to animate multiple stars at once
async function timeline(model, steps) {
    for (let i = 0; i < steps; i++) {
        for (let j = 0; j < model.t.length; j++) {
            model.t[j] += 1;
        }
        updateBuffers(model);
        // Wait for the next animation frame
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
}

//Main draw function
function drawScene() 
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    drawPoints(rPoints);

    //Draw completed lines
    for (let i = 0; i < lineArray.length; i++) {
        drawLineStrip(lineArray[i]);
    }
     // Draw current line
     if (currentLine.np > 0) {
        drawLineStrip(currentLine);
    }
    //Draw stars
    for(let i = 0; i < starArray.length; i++){    
        drawTriangleFan(starArray[i], true);
    }

    requestAnimationFrame(drawScene);

}

function updateCanvas(updatePoints) {
    //Reinitialize buffers with updated points
    if(updatePoints) rPoints = randPoints(pointNumber, minSizeStar, maxSizeStar);
    if(updatePoints) initBuffers(rPoints);

    if(updatePoints) clearScene();

    drawScene();

    //Update slider text
    pointNumDisp.textContent = "Background stars number: " + sliderPointNum.value;
    maxSizeDisp.textContent = "Background star max size: " + sliderMaxSize.value;
    StarScaleDisp.textContent = "Star scaling: " + sliderStarScale.value;
}
  
//Updates scale uniform
function updateScale(newScale)
{
        scaleValue = newScale;
        let scaleLocation = gl.getUniformLocation(program, "sScale");
        gl.uniform1f(scaleLocation, scaleValue);
}

//Clears foreground
function clearScene() 
{
    starArray = [];
    lineArray = [];
    currentLine = {
        "vertices": [],
        "np": 0,
        "idBufferVertices": gl.createBuffer(),
        "vCenter" : [],
        "t" : [],
        "sizes" : []
    };

    initBuffers(currentLine);

    drawScene();
}

//Event listeners
function initHandlers()
{
    initBuffers(currentLine);
    //On mouse click
    mainCanvas.addEventListener("mousedown", 
        function(event){ 
            //Left click behaviour: add star
            if(event.button === 0)
            {
                let rect = mainCanvas.getBoundingClientRect();
                let tx = 2 * (event.clientX - rect.left) / mainCanvas.width - 1;
                let ty = 2 * (rect.height - (event.clientY - rect.top)) / mainCanvas.height - 1;
                let clickPos = [tx, ty];

                //Randomize star sides
                let sidesOffset = Math.trunc(Math.random(tx - ty) * maxSides - 1);

                //Add new star
                let newStar = polyStar(5 + sidesOffset, 0.015, 0.03, clickPos);
                initBuffers(newStar);
                starArray.push(newStar);
                //Animate t from 0 to N
                timeline(newStar, 100);

                //Add line
                currentLine.vertices.push(tx, ty, 0.0);
                currentLine.np++;
                currentLine.vCenter.push(5.0, 0.0, 0.0);
                currentLine.t.push(0.0);
                currentLine.sizes.push(0.0);
                updateBuffers(currentLine);

                drawScene();
	        }
            //Middle click behaviour: start new line
            else if(event.button === 1){
                event.preventDefault();
                startNewLine();
            }
    } 
    ); 
    // New line keymap 
    document.addEventListener("keydown", function(event) {
        if (event.code === "Space") {
            event.preventDefault();
            startNewLine();
        }
    });

    //New line button
    newLineButton.addEventListener("click", function() {
        startNewLine();
    });
    // Clear scene button
    clearSceneButton.addEventListener("click", function() {
        clearScene();
    });

   

}

//Program execution
initWebGL();

// Update the current slider value (each time you drag the slider handle)
sliderPointNum.oninput = function() {
    pointNumber = parseFloat(this.value);
    updateCanvas(true);
  } 
sliderMaxSize.oninput = function() {
    maxSizeStar = parseFloat(this.value);
    updateCanvas(true);
} 
sliderStarScale.oninput = function() {
    sScale = parseFloat(this.value);
    updateScale(sScale);
    updateCanvas(false);
} 
