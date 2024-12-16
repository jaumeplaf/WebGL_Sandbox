# WebGL Project

This project is a WebGL-based application that demonstrates 3D rendering using shaders and textures. It includes a camera system, user input handling, and a basic scene setup.

## Project Structure

```
webgl-project
├── src
│   ├── camera.js          # Defines the Camera class for managing camera properties and view matrices.
│   ├── input.js           # Handles user input for camera control and UI elements.
│   ├── materials.js       # Manages shader programs and their attributes/uniforms.
│   ├── renderer.js        # Initializes WebGL context and rendering configurations.
│   ├── resources.js       # Contains the MeshObject class for 3D model buffer initialization.
│   ├── texture.js         # Defines the TextureObject class for loading and managing textures.
│   └── main.js            # Entry point for the application, initializes components and rendering loop.
├── shaders
│   ├── vertexShader.glsl  # GLSL code for the vertex shader.
│   └── fragmentShader.glsl # GLSL code for the fragment shader.
├── assets
│   └── textures
│       ├── texture1.png   # Texture image used in the scene.
│       └── texture2.png   # Another texture image used in the scene.
├── index.html             # Main HTML document for the application.
├── styles.css             # CSS styles for the project.
└── README.md              # Documentation for the project.
```

## Setup Instructions

1. Clone the repository or download the project files.
2. Open `index.html` in a web browser. Ensure that you are running it in a local environment to avoid CORS issues.
3. Use the controls defined in the `input.js` file to navigate the scene.

## Usage Guidelines

- The camera can be controlled using the keyboard (WASD for movement, Space for up, Q for down).
- Textures are loaded from the `assets/textures` directory and applied to 3D models in the scene.
- Modify the shaders in the `shaders` folder to customize the rendering effects.

## Notes

- Ensure that your browser supports WebGL 2.0.
- This project is designed to run locally without a server. For best results, use a local server setup if needed.