#version 300 es

      in vec3 VertexPosition;

      uniform mat4 modelMatrix;
      uniform mat4 viewMatrix;
      uniform mat4 projectionMatrix;
      
      out vec4 vPos;
      
      void main()
      {
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(VertexPosition, 1.0);
          vPos =  vec4(VertexPosition, 1.0);
      }