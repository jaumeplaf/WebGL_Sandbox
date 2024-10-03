console.log("Loaded Shapes library");

const exampleTriangle = {

    "vertices" : [-0.7, -0.7, 0.0,
                   0.7, -0.7, 0.0,
                   0.0,  0.7, 0.0,
                   0.0, -0.9, 0.0],
  
    "indices" : [ 0, 1, 2, 3]
  
  };

function polyCircle(segments, radius, center, fill)
{
    //Creates the points to display a circle, to display with TRIANGLE_FAN

    //Make sure center is set as a vector3
    if(center.length == 2) center.push(0);
    else if(center.length == 0) center.push(0, 0, 0);
    
    segments = clamp(segments, 2, 4096);
    let polyPoints = {
        "vertices" : [center[0], center[1], center[2]],
        "indices" : [0]
    }
    let angleStep = 2 * pi / segments
    let ratio = getCanvasRatio(myCanvas);
    for(i = 0; i<segments; i++)
    {
        let angle = i * angleStep;
        let x = center[0] + radius * Math.cos(angle) * ratio;
        let y = center[1] + radius * Math.sin(angle);
        polyPoints.indices.push(i+1);
        polyPoints.vertices.push(x, y, 0);
    }
    //Duplicates first point to fill last triangle
    if(fill)
    {
        let angle = 0 * angleStep;
        let x = center[0] + radius * Math.cos(angle) * ratio;
        let y = center[1] + radius * Math.sin(angle);
        polyPoints.indices.push(segments+1);
        polyPoints.vertices.push(x, y, 0);
    }
    //console.log("Circle points: ", polyPoints);
    return polyPoints;
}

function polyStar(sides, r1, r2, center) 
{
    //Creates the points to display a star, to display with TRIANGLE_FAN
    //This shape function depends on the polyCircle() function
    
    //Make sure center is set as a vector3
    if(center.length == 2) center.push(0);
    else if(center.length == 0) center.push(0, 0, 0);

    
    sides = clamp(sides, 4, 4096);
    let segments = sides * 2;
    let starPoints = {
        "vertices" : [],
        "indices" : []
    }

    //Generates origin + outer ring points
    let outerCircle = polyCircle(segments, r2, center, false);
    //Generates inner ring points
    let innerCircle = polyCircle(segments, r1, center, false);

    //Remove origin point
    outerCircle.indices.splice(0,1);
    outerCircle.vertices.splice(0,3);
    innerCircle.indices.splice(0,1);
    innerCircle.vertices.splice(0,3);

    //Manipulate indices array to avoid duplicate indices
    for(let i = 0; i < segments; i++)
    {
        innerCircle.indices[i] += segments;
    }
    
    for(let i = 0; i < segments; i++) //Merge both arrays in a criss-cross
    {
        let j = 3 * i;
        if(i % 2 == 0) //if even, save outer position
        {
            starPoints.indices.push(outerCircle.indices[i]);
            starPoints.vertices.push(outerCircle.vertices[j], outerCircle.vertices[j+1], outerCircle.vertices[j+2]);
        }
        else //if odd, save inner position
        {
            starPoints.indices.push(innerCircle.indices[i]);
            starPoints.vertices.push(innerCircle.vertices[j], innerCircle.vertices[j+1], innerCircle.vertices[j+2]);
        }
    }
    
    //Re-add origin
    starPoints.indices.unshift(0);
    starPoints.vertices.unshift(center[0], center[1], center[2]);
    //Re-add first point to close shape
    starPoints.indices.push(outerCircle.indices[0]);
    starPoints.vertices.push(outerCircle.vertices[0], outerCircle.vertices[1], outerCircle.vertices[2]);

    //console.log("Star points: ", starPoints);
    
   return starPoints;

}
