var gl = null;
var program;

//Set canvas and shaders
const myCanvas = 'myCanvas';
const starVertexShader = 'solidColorVS';
const starFragmentShader = 'solidColorFS';

//Set color variables
var colorBackground = [0.6,0.8,1.0,1.0];
var idMyColor, idMySize;

function drawScene() {

    gl.clear(gl.COLOR_BUFFER_BIT);
    //drawPoints(pointBuffer);
    drawLineStrip(pointBuffer);
    //drawTriangleFan(star01, true);
    
}
  
function initWebGL() {
      
    gl = getWebGLContext(myCanvas);

    if (!gl) {
        alert("WebGL 2.0 is not aviable");
        return;
    }

    initShader(starVertexShader, starFragmentShader);

    //initBuffers(star01);
    initBuffersPoints(pointBuffer);
    initRendering(colorBackground);
    initHandlers();

    requestAnimationFrame(drawScene);

}

let originStar01 = [0, 0];
let star01 = polyStar(5, 0.2, 0.5, originStar01);

var pointBuffer = {
    "vertices" : [],
    "pointnum" : 0
};

function initBuffersPoints(model) {
  
    model.idBufferVertices = gl.createBuffer ();
}

function initHandlers() {
    var canvas2     = document.getElementById("myCanvas");
    canvas2.addEventListener("mousedown", function(event){
        let tx = 2*event.clientX/canvas2.width-1;
        let ty = 2*(canvas2.height-event.clientY)/canvas2.height-1;
		pointBuffer.vertices.push(tx);
        pointBuffer.vertices.push(ty);
        pointBuffer.vertices.push(0.0);
        pointBuffer.pointnum++;
        updateBuffer(pointBuffer);
        //console.log(event);
        //console.log(pointBuffer);
        console.log("tx: ", tx, "ty: ", ty)
        drawScene();
	} );
}

function updateBuffer(model) {
    gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
  }

initWebGL();

