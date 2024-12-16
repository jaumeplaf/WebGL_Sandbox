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
            this.bindTexture(image);
            this.loaded = true;
        };

        image.onerror = () => {
            console.error(`Failed to load texture: ${this.imagePath}`);
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