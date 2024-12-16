# FILE: /webgl-project/webgl-project/shaders/fragmentShader.glsl

#version 300 es

precision mediump float;

in vec4 vCol;
in vec4 vNorm;
in vec2 uv;

uniform sampler2D textureSampler;
uniform vec4 fogColor;
uniform float nPlane;
uniform float fPlane;
uniform float fogAmount;
uniform float fogPower;

out vec4 fragmentColor;

float saturate(float value) {
    return clamp(value, 0.0, 1.0);
}

float linearDepth(float inDepth) {
    float z = inDepth * 2.0 - 1.0;
    return (2.0 * nPlane * fPlane) / (fPlane + nPlane - z * (fPlane - nPlane));
}

void main() {
    float depth = linearDepth(gl_FragCoord.z) / fPlane;
    float correctedDepth = saturate(pow(depth * fogAmount, fogPower));
    vec4 vDepth = vec4(vec3(correctedDepth), 1.0);

    vec4 textureColor = texture(textureSampler, uv);
    vec4 fogFlatColor = mix(textureColor * vCol + vNorm * 0.001, fogColor, correctedDepth);

    fragmentColor = fogFlatColor;
}