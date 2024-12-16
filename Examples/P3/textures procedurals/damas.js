
var selectedPrimitive = exampleCone;

function initShaders() { 
  
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, document.getElementById("myVertexShader").text);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vertexShader));
    return null;
  }
 
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById("myFragmentShader").text);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(fragmentShader));
    return null;
  }
  
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  gl.linkProgram(program);
  
  gl.useProgram(program);
  
  program.vertexPositionAttribute = gl.getAttribLocation( program, "VertexPosition");
  gl.enableVertexAttribArray(program.vertexPositionAttribute);
  
  program.modelViewMatrixIndex  = gl.getUniformLocation( program, "modelViewMatrix");
  program.projectionMatrixIndex = gl.getUniformLocation( program, "projectionMatrix");
  
  // normales
  program.vertexNormalAttribute = gl.getAttribLocation ( program, "VertexNormal");
  program.normalMatrixIndex     = gl.getUniformLocation( program, "normalMatrix");
  gl.enableVertexAttribArray(program.vertexNormalAttribute);
  
  // coordenadas de textura
  program.vertexTexcoordsAttribute = gl.getAttribLocation ( program, "VertexTexcoords");
  gl.enableVertexAttribArray(program.vertexTexcoordsAttribute);

  // material
  program.KaIndex               = gl.getUniformLocation( program, "Material.Ka");
  program.KdIndex               = gl.getUniformLocation( program, "Material.Kd");
  program.KsIndex               = gl.getUniformLocation( program, "Material.Ks");
  program.alphaIndex            = gl.getUniformLocation( program, "Material.alpha");
  
  // fuente de luz
  program.LaIndex               = gl.getUniformLocation( program, "Light.La");
  program.LdIndex               = gl.getUniformLocation( program, "Light.Ld");
  program.LsIndex               = gl.getUniformLocation( program, "Light.Ls");
  program.PositionIndex         = gl.getUniformLocation( program, "Light.Position");

  // propia del shader
  program.ScaleIndex      = gl.getUniformLocation( program, "Scale");
  
  gl.uniform1f(program.ScaleIndex, 1.0);
}

function initRendering() {
  
  gl.clearColor(0.95,0.95,0.95,1.0);
  gl.enable(gl.DEPTH_TEST);
  
  setShaderLight();
  setShaderMaterial(White_plastic);
  
}

function drawScene() {
  
  // se inicializan los buffers de color y de profundidad
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // se obtiene la matriz de transformacion de la proyeccion y se envia al shader
  setShaderProjectionMatrix(getProjectionMatrix());
  
  // calcula la matriz de transformación del modelo-vista y la de la normal
  var modelMatrix = mat4.create();
  var modelViewMatrix = mat4.create();

  mat4.fromScaling (modelMatrix, [0.5, 0.5, 0.5]);
  mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);

  setShaderModelViewMatrix(modelViewMatrix);
  setShaderNormalMatrix(getNormalMatrix(modelViewMatrix));
  
  // se dibuja la primitiva seleccionada
  drawSolid(selectedPrimitive);

}

function initMyHandlers() {
  
  var botones = document.getElementsByTagName("button");

  for (var i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click",
    function(){
      switch (this.innerHTML) {
        case "Plano":    selectedPrimitive = examplePlane;    break;
        case "Cubo":     selectedPrimitive = exampleCube;     break;
        case "Tapa":     selectedPrimitive = exampleCover;    break;
        case "Cono":     selectedPrimitive = exampleCone;     break;
        case "Cilindro": selectedPrimitive = exampleCylinder; break;
        case "Esfera":   selectedPrimitive = exampleSphere;   break;
        case "Toro":     selectedPrimitive = myTorus;         break;
      }
      requestAnimationFrame(drawScene);
    },
    false);
  }
      
  var color = document.getElementById("Kd");

  color.addEventListener("change",
    function(){
      setColor (program.KdIndex, color.value);
      requestAnimationFrame(drawScene);
    },
    false);

  var range = document.getElementById("Scale");

  range.addEventListener("mousemove",
    function(){
      gl.uniform1f(program.ScaleIndex, range.value);
      requestAnimationFrame(drawScene);
    },
    false);
  
}

function setColor (index, value) {
  
  var myColor = value.substr(1); // para eliminar el # del #FCA34D
  
  var r = myColor.charAt(0) + '' + myColor.charAt(1);
  var g = myColor.charAt(2) + '' + myColor.charAt(3);
  var b = myColor.charAt(4) + '' + myColor.charAt(5);
  
  r = parseInt(r, 16) / 255.0;
  g = parseInt(g, 16) / 255.0;
  b = parseInt(b ,16) / 255.0;
  
  gl.uniform3f(index, r, g, b);
  
}

function initMyWebGL() {
  
  initWebGL();
  initMyHandlers();
  
  requestAnimationFrame(drawScene);
  
}

initMyWebGL();
