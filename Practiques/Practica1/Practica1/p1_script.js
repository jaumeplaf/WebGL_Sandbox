//Set canvas and shaders
const myCanvas = 'myCanvas';
const mainCanvas = document.getElementById(myCanvas);
const starVertexShader = 'solidColorVS';
const starFragmentShader = 'solidColorFS';

//Initialize buttons
var newLineButton = document.getElementById("newLineButton");
var clearSceneButton = document.getElementById("clearSceneButton");

//Set color variables
var colorBackground = [0.0,0.0,0.0,1.0];
var maxSides = 10;
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
    "t" : []
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
    initRendering(colorBackground);
    initHandlers();
    
    requestAnimationFrame(drawScene);
}

//Initialize points buffer
function initBuffersPoints(model) 
{
    model.idBufferVertices = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.DYNAMIC_DRAW);

    model.idBufferCenter = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferCenter);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vCenter), gl.STATIC_DRAW);

    model.idBufferT = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferT);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.t), gl.STATIC_DRAW);
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
        "t" : []
    };
    initBuffersPoints(currentLine);
}

//Update star buffer
function updateBuffer(model) 
{
    gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
}

function updateBufferLines(model) 
{
    if (model.idBufferVertices) {
        gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferCenter);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vCenter), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferT);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.t), gl.STATIC_DRAW);
    }
}

//Asyncronous function to be able to animate multiple stars at once
async function timeline(model, steps) {
    for (let i = 0; i < steps; i++) {
        for (let j = 0; j < model.t.length; j++) {
            model.t[j] += 1;
        }
        updateBufferLines(model);
        // Wait for the next animation frame
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
}

//Main draw function
function drawScene() 
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    
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

function clearScene() 
{
    starArray = [];
    lineArray = [];
    currentLine = {
        "vertices": [],
        "np": 0,
        "idBufferVertices": gl.createBuffer(),
        "vCenter" : [],
        "t" : []
    };

    initBuffersPoints(currentLine);

    drawScene();
}

//Event listeners
function initHandlers()
{
    initBuffersPoints(currentLine);
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
                initBuffersCenter(newStar);
                starArray.push(newStar);
                //Animate t from 0 to N
                timeline(newStar, 150);

                //Add line
                currentLine.vertices.push(tx, ty, 0.0);
                currentLine.np++;
                currentLine.vCenter.push(5.0, 0.0, 0.0);
                currentLine.t.push(0.0);
                updateBufferLines(currentLine);

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