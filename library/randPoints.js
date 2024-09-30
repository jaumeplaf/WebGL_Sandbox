function randPoints(pNum)
{

  var points = {
    "vertices" : [],
    "indices" : []
  };

  for(var i = 0; i < pNum; i++)
  {
    let randPos = [Math.random(), Math.random(), Math.random()];
    points.vertices.push(randPos);
    points.indices.push(i);
  }

  //console.log(points);
  return points;
}