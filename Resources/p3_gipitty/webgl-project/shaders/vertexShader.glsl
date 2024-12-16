# FILE: /webgl-project/webgl-project/shaders/vertexShader.glsl

#version 300 es

// Attributes
in vec3 VertexPosition;
in vec4 VertexColor;
in vec3 VertexNormal;
in vec2 TexCoords1;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

// Outputs to the fragment shader
out vec4 vCol;
out vec4 vNorm;
out vec2 uv;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(VertexPosition, 1.0);
    vCol = VertexColor;

    // Normal matrix calculation
    mat3 normalMatrix = mat3(transpose(inverse(modelMatrix)));
    vNorm = vec4(normalize(normalMatrix * VertexNormal), 1.0);

    uv = TexCoords1;
}