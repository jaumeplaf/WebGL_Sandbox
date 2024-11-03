//Utility library script, handles miscelanious reusable functions

function clamp(value, min, max) 
{
    return Math.min(Math.max(value, min), max);
}

function remapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function remapRangeNormalized(value, low1, high1, low2, high2) {
    return (value - low1) / (high1 - low1);
}

function getCanvasRatio(canv)
{
    let currCanv = document.getElementById(canv);
    let aspectRatio = 1 / (currCanv.width / currCanv.height);
    return aspectRatio;
}