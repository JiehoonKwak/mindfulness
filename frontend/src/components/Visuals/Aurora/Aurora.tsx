import { useRef, useEffect, useState } from "react";
import type { VisualProps } from "../types";
import AuroraFallback from "./AuroraFallback";
import {
  vertexShader,
  fragmentShader,
  createShader,
  createProgram,
} from "./shaders";

function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function Aurora({ isActive, speed = 1 }: VisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useWebGL, setUseWebGL] = useState(true);
  const glRef = useRef<{
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    timeLocation: WebGLUniformLocation | null;
    resolutionLocation: WebGLUniformLocation | null;
  } | null>(null);

  useEffect(() => {
    if (!isWebGLSupported()) {
      setUseWebGL(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext;
    if (!gl) {
      setUseWebGL(false);
      return;
    }

    // Create shaders
    const vShader = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);

    if (!vShader || !fShader) {
      setUseWebGL(false);
      return;
    }

    const program = createProgram(gl, vShader, fShader);
    if (!program) {
      setUseWebGL(false);
      return;
    }

    gl.useProgram(program);

    // Create vertex buffer for fullscreen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    // Set up position attribute
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    glRef.current = { gl, program, timeLocation, resolutionLocation };

    return () => {
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!glRef.current || !isActive) return;

    const { gl, timeLocation, resolutionLocation } = glRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startTime = Date.now();
    let animationId: number;

    const render = () => {
      if (!isActive) return;

      const time = ((Date.now() - startTime) / 1000) * speed;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, speed]);

  if (!useWebGL) {
    return <AuroraFallback isActive={isActive} speed={speed} />;
  }

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
  );
}
