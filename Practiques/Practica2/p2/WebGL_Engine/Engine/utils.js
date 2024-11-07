//Utility library script, handles miscelanious reusable functions

function hexToRgba(hexColor, alpha){
    //converts #000000 + float alpha to [r,g,b,a]
    hexColor = hexColor.replace('#','');
    
    let r = parseInt(hexColor.substring(0, 2), 16) / 255;
    let g = parseInt(hexColor.substring(2, 4), 16) / 255;
    let b = parseInt(hexColor.substring(4, 6), 16) / 255;
    
    return [r, g, b, alpha];
}

function clamp(value, min, max) 
{
    return Math.min(Math.max(value, min), max);
}

function remapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function remapRangeNormalized(value, low1, high1) {
    return (value - low1) / (high1 - low1);
}

function getCanvasRatio(inCanvas)
{
    return  1 / (inCanvas.height / inCanvas.width);
}

function degToRad(degrees)
{
  return degrees * (Math.PI/180);
}

function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

function parseJSON()
{
    //TODO?
    console.log("Parse JSON file");
}
