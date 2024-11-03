const CANVAS = document.getElementById("wglCanvas");

function getWebGLContext() {
    try {
        return CANVAS.getContext("webgl2");
    } catch (e) {
        console.error("Failed to get WebGL2 context:", e);
    }
    return null;
}

async function initWebGL() {
    const gl = getWebGLContext();
    if (!gl) {
        alert("WebGL 2.0 is not available");
        return;
    }

    // Clear the canvas using the specified background color
    gl.clearColor(0.2, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// Call the main WebGL initialization function
initWebGL().catch(console.error);
