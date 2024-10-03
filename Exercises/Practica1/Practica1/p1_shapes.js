//Shape functions file

function polyCircle(segments, radius, fill)
{
    segments = clamp(segments, 2, 4096);
    var polyPoints = {
        "vertices" : [0, 0, 0],
        "indices" : [0]
    }
    var angleStep = 2 * pi / segments
    for(i = 0; i<segments; i++)
    {
        let angle = i * angleStep;
        let x = radius * Math.cos(angle);
        let y = radius * Math.sin(angle);
        polyPoints.indices.push(i+1);
        polyPoints.vertices.push(x, y, 0);
    }
    if(fill)
    {
        //Needed to fill last triangle
        let angle = 0 * angleStep;
        let x = radius * Math.cos(angle);
        let y = radius * Math.sin(angle);
        polyPoints.indices.push(segments+1);
        polyPoints.vertices.push(x, y, 0);
    }
    //console.log("Circle points: ", polyPoints);
    return polyPoints;
}

function polyStar(sides, r1, r2) 
{
    //Depends on the polyCircle function
    sides = clamp(sides, 4, 4096);
    var segments = sides * 2;
    var starPoints = {
        "vertices" : [],
        "indices" : []
    }

    //Generates origin + outer ring points
    var outerCircle = polyCircle(segments, r2, false);
    //Generates inner ring points
    var innerCircle = polyCircle(segments, r1, false);

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
        var j = 3 * i;
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
    starPoints.indices.unshift(0); //IF I COMMENT THESE TWOL LINES OUT, IT SHOWS THE INNER POINTS ONLY, AND STILL SHOWS THE ORIGIN
    starPoints.vertices.unshift(0, 0, 0);
    //Re-add first point to close shape
    starPoints.indices.push(outerCircle.indices[0]);
    starPoints.vertices.push(outerCircle.vertices[0], outerCircle.vertices[1], outerCircle.vertices[2]);

    //console.log("Star points: ", starPoints);
    
   return starPoints;

}
