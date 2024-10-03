//Shape functions file

function polyCircle(segments, radius, fill)
{
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
    //console.log(polyPoints);
    return polyPoints;
}

function polyStar(sides, r1, r2)
{
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

    //Manipulate arrays to avoid duplicates
    for(let i = 0; i < segments; i++)
    {
        innerCircle.indices[i] += segments;
    }
    
    for(let i = 0; i < segments; i++) //Merge both arrays in a criss-cross
    {
        var j = 3 * i;
        if(i % 2 == 0) //if odd, save outer position
        {
            console.log("outer point: [", outerCircle.indices[i], "]: ", outerCircle.vertices[j], outerCircle.vertices[j+1], outerCircle.vertices[j+2]);
            starPoints.indices.push(outerCircle.indices[i]);
            starPoints.vertices.push(outerCircle.vertices[j], outerCircle.vertices[j+1], outerCircle.vertices[j+2]);
        }
        else //if even, save inner position
        {
            console.log("inner point: [", innerCircle.indices[i], "]: ", innerCircle.vertices[j], innerCircle.vertices[j+1], innerCircle.vertices[j+2]);
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
    
    console.log("outerCircle: ");
    console.log(outerCircle);
    console.log("innerCircle: ");
    console.log(innerCircle);
    console.log("starPoints: ");
    console.log(starPoints);
    
   return starPoints;

}

function polyLine(sides, r1, r2, depth) {
    var faces = 2*sides;
    var angleStep = 2 * pi / sides
    var polyPoints = {
        "vertices" : [0, 0, 0],
        "indices" : [0]
    }
    for(i = 1; i < faces; i++)
    {
        let angle = i * angleStep;
        if (i%2 == 0) 
        {
            let x1 = r1 * Math.cos(angle);
            let y1 = r1 * Math.sin(angle);
            polyPoints.indices.push(i);
            polyPoints.vertices.push(x1,y1, depth);
        }
        else
        {
            let x2 = r2 * Math.cos(angle);
            let y2 = r2 * Math.sin(angle);
            polyPoints.indices.push(i);
            polyPoints.vertices.push(x2,y2, depth);
        }
        
    }
   
    return polyPoints;

}