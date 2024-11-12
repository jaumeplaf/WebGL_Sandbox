#version 300 es
    
    precision mediump float;
    
    in vec4 vPos;
    out vec4 fragmentColor;
    uniform float shadingMode;
    uniform float isLine;
    uniform vec4 baseColor;
    uniform vec4 fogColor;
    uniform float wireframeIgnoreFog;
    uniform float wireframeOpacity;
    uniform float nPlane;
    uniform float fPlane;
    uniform float fogAmount;
    uniform float fogPower;
    
    float saturate(float value)
    {
        return clamp(value, 0.0, 1.0);
    }
    
    float linearDepth(float inDepth)
    {
        float z = inDepth * 2.0 - 1.0;
        return (2.0 * nPlane * fPlane) / (fPlane + nPlane - z * (fPlane - nPlane));
    }
    
    void main() 
    {
        float depth = linearDepth(gl_FragCoord.z) / fPlane;
        float correctedDepth = saturate(pow(depth * fogAmount, fogPower));
        vec4 vDepth = vec4(vec3(correctedDepth), 1.0);
    
        //vec4 fogFinalColorAdd = baseColor + vDepth * fogColor;
        vec4 fogFlatColor = mix(baseColor, fogColor, correctedDepth);
        vec4 fogWorldNormal = mix(vPos, fogColor, correctedDepth);
        vec4 wireframeBaseColor = vec4(0.0, 0.0, 0.0, 1.0);
        vec4 wireframeFogColor = mix(wireframeBaseColor, fogFlatColor, correctedDepth);
        vec4 undefinedError = vec4(1.0, 0.0, 1.0, 1.0);
    
        if(shadingMode == 0.0) //Wireframe
        {
            if(isLine == 1.0){
                if(wireframeIgnoreFog == 1.0){
                    fragmentColor = mix(fogColor, wireframeBaseColor, wireframeOpacity);
                }
                else{
                    fragmentColor = mix(fogColor, mix(wireframeBaseColor, fogColor, correctedDepth), wireframeOpacity);
                }
            }
            else fragmentColor = undefinedError;
        }
        else if(shadingMode == 1.0) //Color
        {
            fragmentColor = fogFlatColor;
        }
        else if(shadingMode == 2.0) //Color+Wireframe
        {
            if(isLine == 1.0){
                if(wireframeIgnoreFog == 1.0){
                    fragmentColor = mix(fogFlatColor, wireframeBaseColor, wireframeOpacity);
                }
                else{
                    fragmentColor = mix(fogFlatColor, wireframeFogColor, wireframeOpacity);
                }
            }
            else{
                fragmentColor = fogFlatColor;
            }
        }
        else if(shadingMode == 3.0) //World normal (PLACEHOLDER)
        {
            fragmentColor = fogWorldNormal;
        }
        else if(shadingMode == 4.0) //World normal+Wireframe (PLACEHOLDER)
        {
            if(isLine == 1.0){
                if(wireframeIgnoreFog == 1.0){
                    fragmentColor = mix(fogWorldNormal, wireframeBaseColor, wireframeOpacity);
                }
                else{
                    fragmentColor = mix(fogWorldNormal, mix(wireframeBaseColor, fogWorldNormal, correctedDepth), wireframeOpacity);
                }
            }
            else{
                fragmentColor = fogWorldNormal;
            }
        }
        else //Undefined
        {
            fragmentColor = undefinedError;
        }
    }