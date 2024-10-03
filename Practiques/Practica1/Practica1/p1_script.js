var gl = null;
var program;

//Set canvas and shaders
const myCanvas = 'myCanvas';
const starVertexShader = 'solidColorVS';
const starFragmentShader = 'solidColorFS';

//Set color variables
var colorBackground = [0.6,0.8,1.0,1.0];

function drawScene() {

    gl.clear(gl.COLOR_BUFFER_BIT);

    drawTriangleFan(star01, true);
    
}
  
function initWebGL() {
      
    gl = getWebGLContext(myCanvas);

    if (!gl) {
        alert("WebGL 2.0 is not aviable");
        return;
    }

    initShader(starVertexShader, starFragmentShader);

    initBuffers(star01);
    initRendering(colorBackground);

    requestAnimationFrame(drawScene);

}

let originStar01 = [0, 0];
let star01 = polyStar(5, 0.2, 0.5, originStar01);

initWebGL();     
