import React, { useEffect, useRef } from 'react';

const ShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Vertex shader source code
  const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
      gl_Position = aVertexPosition;
    }
  `;

  // Simplified fragment shader with purple/pink plasma effect
  const fsSource = `
    precision mediump float;
    uniform vec2 iResolution;
    uniform float iTime;

    void main() {
      vec2 uv = gl_FragCoord.xy / iResolution.xy;
      vec2 center = uv - 0.5;

      // Create MUCH more dramatic flowing waves
      float wave1 = sin(uv.x * 5.0 + iTime * 1.0);
      float wave2 = cos(uv.y * 4.0 - iTime * 0.7);
      float wave3 = sin((uv.x + uv.y) * 3.0 + iTime * 0.5);

      // Diagonal wave for more movement
      float wave4 = sin(uv.x * 2.0 - uv.y * 2.0 + iTime * 0.8);

      // Combine waves with higher amplitude
      float pattern = (wave1 + wave2 + wave3 + wave4) * 0.25;

      // Create radial gradient from center
      float dist = length(center);
      float radial = 1.0 - smoothstep(0.0, 1.0, dist);

      // More vibrant colors
      vec3 color1 = vec3(0.6, 0.3, 1.0); // Bright Purple
      vec3 color2 = vec3(1.0, 0.3, 0.8); // Hot Pink
      vec3 color3 = vec3(0.3, 0.1, 0.5); // Dark Purple
      vec3 color4 = vec3(0.8, 0.1, 0.9); // Magenta

      // Mix colors based on waves - more dramatic transitions
      vec3 finalColor = mix(color3, color1, pattern * 0.8 + 0.5);
      finalColor = mix(finalColor, color2, wave1 * 0.5 + 0.5);
      finalColor = mix(finalColor, color4, wave4 * 0.3 + 0.3);

      // Less vignette, more brightness
      finalColor *= radial * 0.8 + 0.4;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  // Helper function to compile shader
  const loadShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error: ', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  // Initialize shader program
  const initShaderProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return null;

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) return null;

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Shader program link error: ', gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('ShaderBackground: Canvas ref not found');
      return;
    }

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn('ShaderBackground: WebGL not supported');
      return;
    }

    console.log('ShaderBackground: Initializing shader program');
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram) {
      console.error('ShaderBackground: Failed to initialize shader program');
      return;
    }
    console.log('ShaderBackground: Shader program initialized successfully');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      },
      uniformLocations: {
        resolution: gl.getUniformLocation(shaderProgram, 'iResolution'),
        time: gl.getUniformLocation(shaderProgram, 'iTime'),
      },
    };

    const resizeCanvas = () => {
      // Make canvas match its parent container size
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Also resize on first render with a slight delay
    setTimeout(resizeCanvas, 100);

    let startTime = Date.now();
    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(programInfo.program);

      gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);
      gl.uniform1f(programInfo.uniformLocations.time, currentTime);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default ShaderBackground;
