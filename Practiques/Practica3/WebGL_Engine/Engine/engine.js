window.canvas = null;
window.gl = null;

function getWebGLContext()
{
    window.canvas = document.getElementById("wglCanvas");

    try {
        return window.canvas.getContext('webgl2');
    } 

    catch (e) {
    }

    return null;
}

function initWebGL()
{
    window.gl = getWebGLContext();

    if (!window.gl) {
        alert("WebGL 2.0 is not available");
        return;
    }
    
    initRendering();
}

// Initiate WebGL 2.0 API
initWebGL();
