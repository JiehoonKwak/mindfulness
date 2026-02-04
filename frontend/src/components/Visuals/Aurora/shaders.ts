export const vertexShader = `
  attribute vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const fragmentShader = `
  precision mediump float;

  uniform float u_time;
  uniform vec2 u_resolution;

  // Simplex noise function for smooth randomness
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // Create multiple aurora bands
    float aurora = 0.0;

    // Band 1 - main green aurora
    float band1 = snoise(vec2(uv.x * 3.0 + u_time * 0.1, uv.y * 0.5 + u_time * 0.05));
    band1 = smoothstep(0.3, 0.7, uv.y + band1 * 0.2);
    band1 *= smoothstep(0.9, 0.5, uv.y + band1 * 0.1);
    aurora += band1 * 0.6;

    // Band 2 - secondary wave
    float band2 = snoise(vec2(uv.x * 5.0 - u_time * 0.08, uv.y * 0.8 + u_time * 0.03));
    band2 = smoothstep(0.4, 0.6, uv.y + band2 * 0.15);
    band2 *= smoothstep(0.85, 0.55, uv.y + band2 * 0.1);
    aurora += band2 * 0.4;

    // Band 3 - subtle accent
    float band3 = snoise(vec2(uv.x * 7.0 + u_time * 0.12, uv.y * 1.0 - u_time * 0.04));
    band3 = smoothstep(0.45, 0.55, uv.y + band3 * 0.1);
    band3 *= smoothstep(0.8, 0.6, uv.y + band3 * 0.08);
    aurora += band3 * 0.3;

    // Color gradient - green to cyan to purple
    vec3 color1 = vec3(0.0, 0.8, 0.4);  // Green
    vec3 color2 = vec3(0.0, 0.6, 0.8);  // Cyan
    vec3 color3 = vec3(0.5, 0.0, 0.8);  // Purple

    float colorMix = snoise(vec2(uv.x * 2.0 + u_time * 0.05, u_time * 0.02)) * 0.5 + 0.5;
    vec3 auroraColor = mix(mix(color1, color2, colorMix), color3, colorMix * colorMix);

    // Apply aurora intensity
    vec3 finalColor = auroraColor * aurora;

    // Add subtle stars in background
    float stars = snoise(uv * 100.0) * 0.5 + 0.5;
    stars = pow(stars, 20.0) * 0.3;
    finalColor += vec3(stars) * (1.0 - aurora * 2.0);

    // Dark sky gradient background
    vec3 skyTop = vec3(0.0, 0.02, 0.1);
    vec3 skyBottom = vec3(0.0, 0.0, 0.05);
    vec3 sky = mix(skyBottom, skyTop, uv.y);

    finalColor = max(finalColor, sky);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function createProgram(
  gl: WebGLRenderingContext,
  vertexShaderObj: WebGLShader,
  fragmentShaderObj: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShaderObj);
  gl.attachShader(program, fragmentShaderObj);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}
