
var myFbo, texture, programFBO;

var OFFSCREEN_WIDTH = 1024, OFFSCREEN_HEIGHT = 1024;

var Floor = {
  "modelViewMatrix"                : mat4.create(),
  "normalMatrix"                   : mat3.create(),
  "modelViewMatrixLight"           : mat4.create(),
  "projectionModelViewMatrixLight" : mat4.create()
};

var Box = {
  "modelViewMatrix"                : mat4.create(),
  "normalMatrix"                   : mat3.create(),
  "modelViewMatrixLight"           : mat4.create(),
  "projectionModelViewMatrixLight" : mat4.create()
};

var YellowSphere = {
  "modelViewMatrix"                : mat4.create(),
  "normalMatrix"                   : mat3.create(),
  "modelViewMatrixLight"           : mat4.create(),
  "projectionModelViewMatrixLight" : mat4.create()
};

var WhiteSphere = {
  "modelViewMatrix"                : mat4.create(),
  "normalMatrix"                   : mat3.create(),
  "modelViewMatrixLight"           : mat4.create(),
  "projectionModelViewMatrixLight" : mat4.create()
};

// camara en la fuente de luz
var cameraOnLight = {
  "lookAt" : mat4.create(),
  "view"   : mat4.create()
};

function initShaders() {

  // Shader para pintar en el FBO ---------------------------------------------------
  var vertexShaderFBO = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShaderFBO, document.getElementById("myVertexShaderToFBO").text);
  gl.compileShader(vertexShaderFBO);
  if (!gl.getShaderParameter(vertexShaderFBO, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vertexShaderFBO));
    return null;
  }

  var fragmentShaderFBO = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShaderFBO, document.getElementById("myFragmentShaderToFBO").text);
  gl.compileShader(fragmentShaderFBO);
  if (!gl.getShaderParameter(fragmentShaderFBO, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(fragmentShaderFBO));
    return null;
  }

  programFBO = gl.createProgram();
  gl.attachShader(programFBO, vertexShaderFBO);
  gl.attachShader(programFBO, fragmentShaderFBO);
  
  gl.linkProgram(programFBO);
  
  programFBO.vertexPositionAttribute = gl.getAttribLocation( programFBO, "VertexPosition");

  programFBO.modelViewMatrixIndex          = gl.getUniformLocation( programFBO, "modelViewMatrix");
  programFBO.projectionMatrixIndex         = gl.getUniformLocation( programFBO, "projectionMatrix");

  // Shader para pintar la escena ---------------------------------------------------
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
  
  program.vertexPositionAttribute = gl.getAttribLocation( program, "VertexPosition");
  
  program.modelViewMatrixIndex          = gl.getUniformLocation( program, "modelViewMatrix");
  program.projectionMatrixIndex         = gl.getUniformLocation( program, "projectionMatrix");
  program.projectionModelViewMatrixLightIndex  = gl.getUniformLocation( program, "projectionModelViewMatrixLight");
  
  // normales
  program.vertexNormalAttribute = gl.getAttribLocation ( program, "VertexNormal");
  program.normalMatrixIndex     = gl.getUniformLocation( program, "normalMatrix");
  
  // coordenadas de textura
  program.vertexTexcoordsAttribute = gl.getAttribLocation ( program, "VertexTexcoords");
  
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
  
  // variables propias de esta demo
  program.textureIndex          = gl.getUniformLocation( program, "shadowMap");
  program.tableroIndex          = gl.getUniformLocation( program, "tablero");
  program.isFirstPassIndex      = gl.getUniformLocation( program, "isFirstPass");

  gl.useProgram(program);
  gl.uniform1i(program.textureIndex, 3);
  
}

function initRendering() {
  
  gl.enable(gl.DEPTH_TEST);
  setShaderLight();
  setShaderLightPosition(5.0,5.0,-15.0);

}

function drawSolidWithMatrices(model,objName) {
  
  gl.uniformMatrix3fv(program.normalMatrixIndex, false, objName.normalMatrix);
  gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, objName.modelViewMatrix);
  gl.uniformMatrix4fv(program.projectionModelViewMatrixLightIndex, false, objName.projectionModelViewMatrixLight);
  
  drawSolid(model);

}

function setFloorObject () {
  
  var modelMatrix          = mat4.create();
  var modelViewMatrixLight = mat4.create();
  
  mat4.translate (modelMatrix, modelMatrix, [0.0, -0.8, 0.0]);
  mat4.scale     (modelMatrix, modelMatrix, [5.0, 0.1, 5.0]);
  mat4.multiply  (Floor.modelViewMatrix, getCameraMatrix(), modelMatrix);
  
  Floor.normalMatrix = getNormalMatrix(Floor.modelViewMatrix);
  
  mat4.multiply  (Floor.modelViewMatrixLight, cameraOnLight.lookAt, Floor.modelViewMatrix);
  mat4.multiply  (Floor.projectionModelViewMatrixLight, cameraOnLight.view, Floor.modelViewMatrixLight);
  
}

function setBoxObject () {
  
  var modelMatrix          = mat4.create();
  var modelViewMatrixLight = mat4.create();
  
  mat4.scale     (modelMatrix, modelMatrix, [1.0,1.0,2.0]);
  mat4.multiply  (Box.modelViewMatrix, getCameraMatrix(), modelMatrix);
  
  Box.normalMatrix = getNormalMatrix(Box.modelViewMatrix);
  
  mat4.multiply  (Box.modelViewMatrixLight, cameraOnLight.lookAt, Box.modelViewMatrix);
  mat4.multiply  (Box.projectionModelViewMatrixLight, cameraOnLight.view, Box.modelViewMatrixLight);
  
}

function setYellowSphereObject () {
  
  var modelMatrix          = mat4.create();
  var modelViewMatrixLight = mat4.create();
  
  mat4.translate (modelMatrix, modelMatrix, [1.5, 0.8, 0.0]);
  mat4.scale     (modelMatrix, modelMatrix, [0.8, 0.8, 0.8]);
  mat4.multiply  (YellowSphere.modelViewMatrix, getCameraMatrix(), modelMatrix);
  
  YellowSphere.normalMatrix = getNormalMatrix(YellowSphere.modelViewMatrix);
  
  mat4.multiply  (YellowSphere.modelViewMatrixLight, cameraOnLight.lookAt, YellowSphere.modelViewMatrix);
  mat4.multiply  (YellowSphere.projectionModelViewMatrixLight, cameraOnLight.view, YellowSphere.modelViewMatrixLight);
  
}

function setWhiteSphereObject () {
  
  var modelMatrix          = mat4.create();
  var modelViewMatrixLight = mat4.create();
  
  mat4.identity  (modelMatrix);
  mat4.translate (modelMatrix, modelMatrix, [-1.3, 0.0, 0.0]);
  mat4.scale     (modelMatrix, modelMatrix, [0.5, 0.5, 0.5]);
  mat4.multiply  (WhiteSphere.modelViewMatrix, getCameraMatrix(), modelMatrix);
  
  WhiteSphere.normalMatrix = getNormalMatrix(WhiteSphere.modelViewMatrix);
  
  mat4.multiply  (WhiteSphere.modelViewMatrixLight, cameraOnLight.lookAt, WhiteSphere.modelViewMatrix);
  mat4.multiply  (WhiteSphere.projectionModelViewMatrixLight, cameraOnLight.view, WhiteSphere.modelViewMatrixLight);
  
}

function drawFloorObject () {
  
  var modelMatrix          = mat4.create();
  var modelViewMatrixLight = mat4.create();
  
  mat4.translate (modelMatrix, modelMatrix, [0.0, -0.8, 0.0]);
  mat4.scale     (modelMatrix, modelMatrix, [5.0, 0.1, 5.0]);
  mat4.multiply  (Floor.modelViewMatrix, getCameraMatrix(), modelMatrix);
  
  Floor.normalMatrix = getNormalMatrix(Floor.modelViewMatrix);
  
  mat4.multiply  (Floor.modelViewMatrixLight, cameraOnLight.lookAt, Floor.modelViewMatrix);
  mat4.multiply  (Floor.projectionModelViewMatrixLight, cameraOnLight.view, Floor.modelViewMatrixLight);

}

function drawSolidFBO(model) {
  
  gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer (programFBO.vertexPositionAttribute,  3, gl.FLOAT, false, 8*4,   0);
  
  gl.bindBuffer   (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.drawElements (gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
  
}

function drawObjectsFBO () {

  mat4.lookAt        (cameraOnLight.lookAt, [5,5,-15], [0,-0.5,-radius], [0,1,0]);
  mat4.perspective   (cameraOnLight.view,   Math.PI/4.0, OFFSCREEN_WIDTH/OFFSCREEN_HEIGHT, 1.0, 100.0);
  
  gl.uniformMatrix4fv(programFBO.projectionMatrixIndex, false, cameraOnLight.view);

  gl.enableVertexAttribArray(programFBO.vertexPositionAttribute);

  // El suelo
  setFloorObject();
  gl.uniformMatrix4fv(programFBO.modelViewMatrixIndex, false, Floor.modelViewMatrixLight);
  drawSolidFBO(exampleCube);
  
  // La caja
  setBoxObject();
  gl.uniformMatrix4fv(programFBO.modelViewMatrixIndex, false, Box.modelViewMatrixLight);
  drawSolidFBO(exampleCube);

  // Esfera amarilla
  setYellowSphereObject();
  gl.uniformMatrix4fv(programFBO.modelViewMatrixIndex, false, YellowSphere.modelViewMatrixLight);
  drawSolidFBO(exampleSphere);

  // Esfera blanca
  setWhiteSphereObject();
  gl.uniformMatrix4fv(programFBO.modelViewMatrixIndex, false, WhiteSphere.modelViewMatrixLight);
  drawSolidFBO(exampleSphere);

  gl.disableVertexAttribArray(programFBO.vertexPositionAttribute);

}

function drawObjects() {

  gl.enableVertexAttribArray(program.vertexPositionAttribute);
  gl.enableVertexAttribArray(program.vertexNormalAttribute);
  gl.enableVertexAttribArray(program.vertexTexcoordsAttribute);
  
  setShaderProjectionMatrix(getProjectionMatrix());
  
  setShaderMaterial(White_plastic);
  gl.uniform1i (program.tableroIndex, true);
  drawSolidWithMatrices(exampleCube,Floor);
  gl.uniform1i (program.tableroIndex, false);
  
  setShaderMaterial(Green_plastic);
  drawSolidWithMatrices(exampleCube,Box);
  
  setShaderMaterial(Yellow_plastic);
  drawSolidWithMatrices(exampleSphere,YellowSphere);
  
  setShaderMaterial(White_plastic);
  drawSolidWithMatrices(exampleSphere,WhiteSphere);

  gl.disableVertexAttribArray(program.vertexPositionAttribute);
  gl.disableVertexAttribArray(program.vertexNormalAttribute);
  gl.disableVertexAttribArray(program.vertexTexcoordsAttribute);
  
}

function drawScene() {

  // Primero la escena desde la fuente de luz
  gl.useProgram      (programFBO);
  gl.bindFramebuffer (gl.FRAMEBUFFER, myFbo);  // Change the drawing destination to FBO
  gl.viewport        (0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);   // Set viewport for FBO
  gl.clear           (gl.DEPTH_BUFFER_BIT);                       // Clear FBO
  gl.enable          (gl.CULL_FACE);
  gl.cullFace        (gl.FRONT);
  gl.enable          (gl.POLYGON_OFFSET_FILL);
  gl.polygonOffset   (2.5,20.0);
  drawObjectsFBO     ();

  // Ahora la escena desde la cámara del usuario
  gl.useProgram      (program);
  gl.bindFramebuffer (gl.FRAMEBUFFER, null);                      // Change the drawing destination to color buffer
  gl.viewport        (0, 0, 600, 600);
  gl.clearColor      (0.95,0.95,0.95,1.0);
  gl.clear           (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffer
  gl.cullFace        (gl.BACK);
  gl.disable         (gl.POLYGON_OFFSET_FILL);
  drawObjects        ();

}

// crea un FBO para dibujar contra una textura de profunidad
function initFramebufferObject() {
  
  // Create a texture object and set its size and parameters
  texture = gl.createTexture();
  gl.bindTexture  (gl.TEXTURE_2D, texture);
  gl.texImage2D   (gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
  
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
  
  // Create a framebuffer object (FBO)
  myFbo = gl.createFramebuffer();
  gl.bindFramebuffer      (gl.FRAMEBUFFER, myFbo);
  gl.framebufferTexture2D (gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
  gl.framebufferTexture2D (gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT,  gl.TEXTURE_2D, texture, 0);
  
  // check FBO status
  var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if(status != gl.FRAMEBUFFER_COMPLETE){
    console.log(status);
  }
    
  // Set a texture object to the texture unit
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture  (gl.TEXTURE_2D, texture);
    
}

function initMyWebGL() {
  
  fovy   =  0.4;
  radius = 20.0;
  
  initWebGL();
  
  initFramebufferObject();
  
  requestAnimationFrame(drawScene);
  
}

initMyWebGL();
