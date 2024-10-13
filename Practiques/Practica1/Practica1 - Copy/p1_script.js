//Initialize program
var gl = null;
var program;

//Set canvas and shaders
const myCanvas = 'myCanvas';
const starVertexShader = 'solidColorVS';
const starFragmentShader = 'solidColorFS';

//Set color variables
var colorBackground = [0.6,0.8,1.0,1.0];
var idMyColor, idMySize;

//Initialize stars and lines arrays
var starArray = [];
var lineArray = [];

//Store all clicked points
var pointBuffer = {
    "vertices" : [],
    "pointnum" : 0
};
//Store current line to allow new lines
var currentLine = {
    "vertices" : [],
    "np" : 0,
    "idBufferVertices": null
};


//Initialize WebGL & required components
function initWebGL() {
    
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
function initBuffersPoints(model) {
    
    model.idBufferVertices = gl.createBuffer ();
}

//Update star buffer
function updateBuffer(model) {
    gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
}

//Main draw function
function drawScene() {
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    //Draw stars
    for(let i = 0; i < starArray.length; i++){    
        drawTriangleFan(starArray[i], true);
    }
    
}
//Event listeners
function initHandlers()
{
    var canvas2     = document.getElementById("myCanvas");
    
    canvas2.addEventListener("mousedown", 
        function(event){ 
            let tx = 2*event.clientX/canvas2.width-1;
            let ty = 2*(canvas2.height-event.clientY)/canvas2.height-1;
            let clickPos = [tx, ty];
            
            pointBuffer.vertices.push(tx);
            pointBuffer.vertices.push(ty);
            pointBuffer.vertices.push(0.0);
            pointBuffer.pointnum++;
            
            let sidesOffset = Math.trunc(Math.random(tx-ty)*10-1);
            let newStar = polyStar(5 + sidesOffset, 0.025, 0.05, clickPos);
            initBuffers(newStar);
            starArray.push(newStar);
            drawScene();
	    } 
    );
}

//Program execution
initWebGL();


