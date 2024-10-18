console.log("Loaded Basic Utilities library");

const pi = Math.PI;

function clamp(value, min, max) 
{
    return Math.min(Math.max(value, min), max);
}

function remapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function getCanvasRatio(canv)
{
    let currCanv = document.getElementById(canv);
    let aspectRatio = 1 / (currCanv.width / currCanv.height);
    return aspectRatio;
}
function randPoints(pNum, maxSize, minSize)
{
  //Spawn pNum points randomly in (-1,-1,-1)->(1,1,1) space
  //This function  depends on the remapRange() function

  let points = {
    "vertices" : [],
    "sizes" : [],
    "vCenter" : [],
    "t" : [],
  }
  
  for(let i = 0; i < pNum; i++)
  {
    let randX = remapRange(Math.random(), 0, 1, -1, 1);
    let randY = remapRange(Math.random(), 0, 1, -1, 1);
    let randZ = remapRange(Math.random(), 0, 1, -1, 1);
    let randSize = remapRange(Math.random(), 0, 1, minSize, maxSize);
    
    points.vertices.push(randX, randY, 0);
    points.sizes.push(randSize);
    points.t.push(0);
    points.vCenter.push(randX, randY, 0);
  }

  return points;
}

