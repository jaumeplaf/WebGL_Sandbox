// ---------------------------------------------------------------------------
// Primitivas geometricas basicas de revolucio
// ---------------------------------------------------------------------------


function makeCylinder (nSides) {
        
  var cylinder = {
      "vertices" : [],
      "indices"  : []
  };
  
  if (nSides < 3 ) nSides = 3;

  // los vértices del circulo de las bases
  for  (var i = 0; i < nSides; i++) {
    
    var phi  = i / nSides * 2.0 * Math.PI;
    var cphi = Math.cos(phi);
    var sphi = Math.sin(phi);
    
    // coordinates
    cylinder.vertices.push(cphi, sphi, 0.0);

    // normal
    //cylinder.vertices.push(cphi, sphi, 0.0);
    
    // coordinates
    cylinder.vertices.push(cphi, sphi, 1.0);

    // normal
    //cylinder.vertices.push(cphi, sphi, 0.0);
    
  }
   
  // se crea el vector de índices
  var n = nSides * 2;
  for (var i = 0; i < n; i += 2){
      
    cylinder.indices.push (i,           (i + 2) % n, i + 1); 
    cylinder.indices.push ((i + 2) % n, (i + 3) % n, i + 1); 

  }

  return cylinder; 
  
}

function makeCone (nSides) {
        
  var cone = {
      "vertices" : [],
      "indices"  : []
  };
  
  if (nSides < 3 ) nSides = 3;
  
  // los vértices
  for  (var i = 0; i < nSides; i++) {
    
    var phi  = i / nSides * 2.0 * Math.PI;
    var cphi = Math.cos(phi);
    var sphi = Math.sin(phi);
    
    // coordinates
    cone.vertices.push(cphi, sphi, 0.0);

    // normal
    //cone.vertices.push.apply(cone.vertices, vec3.normalize(vec3.create(), vec3.fromValues(cphi, sphi, 1.0)));
    
    // coordinates
    cone.vertices.push(0.0, 0.0, 1.0);

    // normal
    //phi  = (i + 0.5) / nSides * 2.0 * Math.PI;
    //cone.vertices.push.apply(cone.vertices, vec3.normalize(vec3.create(), vec3.fromValues( Math.cos(phi), Math.sin(phi), 1.0)));
    
  }

  var n = nSides * 2;
  for (var i = 0; i < n; i += 2)
    cone.indices.push (i, (i + 2) % n, i + 1); 

  return cone; 
  
}

function makeSphere (nSides, nRings) {
        
  var sphere = {
      "vertices" : [],
      "indices"  : []
  };
  
  if (nSides < 3 ) nSides = 3;
  if (nRings < 2 ) nRings = 2;
        
  var dphi  =       Math.PI / nRings ;
  var dzeta = 2.0 * Math.PI / nSides ;

  var myPhi = 0.0;

  for (var j = 0; j <= nRings; j++) {

    var myZeta = 0.0;
    
    for (var i = 0; i <= nSides; i++) {

      var x = Math.sin(myPhi) * Math.sin(myZeta);
      var y = Math.cos(myPhi);
      var z = Math.sin(myPhi) * Math.cos(myZeta);

      // coordinates
      sphere.vertices.push( x, y, z );
      
      // normal
      //sphere.vertices.push( x, y, z );
       
      myZeta += dzeta;
      
    }

    myPhi += dphi;
    
  }

  for (var j = 0; j < nRings; j++) {
    
    var desp = j * (nSides + 1);

    for (var i = 0; i < nSides; i++){
      
      sphere.indices.push (desp + i,     desp + i + (nSides+1), desp + i + 1); 
      sphere.indices.push (desp + i + 1, desp + i + (nSides+1), desp + i + (nSides+1) + 1);       
    }
    
  }
  
  return sphere; 
  
}