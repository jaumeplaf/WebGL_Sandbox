class MeshObject 
{
  constructor(inModel, inMaterial)
  {
    this.model = inModel;
    this.material = inMaterial;

    this.initializeBuffers();
  }
  
  initializeBuffers()
  {
    this.initAttributeBuffer('indices', 'ELEMENT_ARRAY_BUFFER', Uint16Array);
    this.initAttributeBuffer('vertices', 'ARRAY_BUFFER', Float32Array);
    this.initAttributeBuffer('normals', 'ARRAY_BUFFER', Float32Array);
    this.initAttributeBuffer('colors', 'ARRAY_BUFFER', Float32Array); 
    this.initAttributeBuffer('texcoords1', 'ARRAY_BUFFER', Float32Array); 
  }

  initAttributeBuffer(attributeName, bufferType, arrayType) {
    const data = this.model[attributeName];
    this[attributeName] = data;
    const bufferIdName = `idBuffer${attributeName.charAt(0).toUpperCase() + attributeName.slice(1)}`;
    this[bufferIdName] = window.gl.createBuffer();
    window.gl.bindBuffer(window.gl[bufferType], this[bufferIdName]);
    window.gl.bufferData(window.gl[bufferType], new arrayType(data), window.gl.STATIC_DRAW);
  }
}

class TextureObject {
  constructor(imagePath) {
      this.texture = window.gl.createTexture();
      this.loaded = false;
      this.imagePath = imagePath;
      this.loadTexture();
  }

  loadTexture() {
      const image = new Image();
      image.crossOrigin = 'anonymous'; // Avoid CORS issues
      image.src = this.imagePath;

      image.onload = () => {
          console.log(`Successfully loaded texture: ${this.imagePath}`);
          this.bindTexture(image);
          this.loaded = true;
      };

      image.onerror = (error) => {
          console.error(`Failed to load texture: ${this.imagePath}`, error);
      };
  }

  bindTexture(image) {
      window.gl.bindTexture(window.gl.TEXTURE_2D, this.texture);
      window.gl.texImage2D(window.gl.TEXTURE_2D, 0, window.gl.RGBA, window.gl.RGBA, window.gl.UNSIGNED_BYTE, image);

      window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_MIN_FILTER, window.gl.LINEAR_MIPMAP_LINEAR);
      window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_MAG_FILTER, window.gl.LINEAR);

      window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_WRAP_S, window.gl.REPEAT);
      window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_WRAP_T, window.gl.REPEAT);

      window.gl.generateMipmap(window.gl.TEXTURE_2D);
  }

  use() {
      window.gl.bindTexture(window.gl.TEXTURE_2D, this.texture);
  }
}

/* Imported functions from class example
function allTexturesLoaded () {

  for (var i = 0; i < texturesId.length; i++)
    if (! texturesId[i].loaded)
      return false;
  
  return true;
  
}

function setTexture (image, texturePos) {

  // se indica el objeto textura
  gl.bindTexture(gl.TEXTURE_2D, texturesId[texturePos]);

  // Descomentar si es necesario voltear la textura
  //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    
  // datos de la textura
  gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
    
  // parámetros de filtrado
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
  // parámetros de repetición (ccordenadas de textura mayores a uno)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    
  // creación del mipmap
  gl.generateMipmap(gl.TEXTURE_2D);

  texturesId[texturePos].loaded = true; // textura ya disponible

  if (allTexturesLoaded()) {
    
    initHandlers();
    requestAnimationFrame(drawScene);
    
  }

}

function changeTextureHandler(texturePos) {
  return function(){
    if (this.files[0]!= undefined) {
      texturesId[texturePos].loaded = false;
      loadTextureFromFile(this.files[0], texturePos);
    }
  };
}

function loadTextureFromFile(filename, texturePos) {

  var reader = new FileReader(); // Evita que Chrome se queje de SecurityError al cargar la imagen elegida por el usuario
  
  reader.addEventListener("load",
                          function() {
                            var image = new Image();
                            image.addEventListener("load",
                                                   function() {
                                                     setTexture(image, texturePos);
                                                  },
                                                   false);
                            image.src = reader.result;
                          },
                          false);
  
  reader.readAsDataURL(filename);

}

function loadTextureFromServer (filename, texturePos) {
    
  var image = new Image();
    
  image.addEventListener("load",
                         function() {
                           setTexture(image, texturePos);
                        },
                         false);
  image.addEventListener("error",
                         function(err) {
                           console.log("MALA SUERTE: no esta disponible " + this.src);
                        },
                         false);
  image.crossOrigin = 'anonymous'; // Esto evita que Chrome se queje de SecurityError al cargar la imagen de otro dominio
  image.src         = filename;

}

function initTextures() {

  var serverUrl    = "http://cphoto.uji.es/vj1221/assets/textures/";
  var texFilenames = ["dots.png","bee.png"];

  for (var texturePos = 0; texturePos < texFilenames.length; texturePos++) {
  
    // creo el objeto textura
    texturesId[texturePos] = gl.createTexture();
    texturesId[texturePos].loaded = false;
    
    // solicito la carga de la textura
    loadTextureFromServer(serverUrl+texFilenames[texturePos], texturePos);
    
  }

}
  */