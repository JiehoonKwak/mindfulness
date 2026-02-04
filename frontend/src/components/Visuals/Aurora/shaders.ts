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

    // Create multiple aurora bands with zen aesthetic
    float aurora = 0.0;

    // Band 1 - main flowing wave
    float band1 = snoise(vec2(uv.x * 2.5 + u_time * 0.08, uv.y * 0.4 + u_time * 0.04));
    band1 = smoothstep(0.25, 0.65, uv.y + band1 * 0.25);
    band1 *= smoothstep(0.95, 0.5, uv.y + band1 * 0.12);
    aurora += band1 * 0.5;

    // Band 2 - secondary gentle wave
    float band2 = snoise(vec2(uv.x * 4.0 - u_time * 0.06, uv.y * 0.6 + u_time * 0.025));
    band2 = smoothstep(0.35, 0.55, uv.y + band2 * 0.18);
    band2 *= smoothstep(0.88, 0.5, uv.y + band2 * 0.1);
    aurora += band2 * 0.35;

    // Band 3 - subtle accent
    float band3 = snoise(vec2(uv.x * 6.0 + u_time * 0.1, uv.y * 0.9 - u_time * 0.035));
    band3 = smoothstep(0.42, 0.52, uv.y + band3 * 0.12);
    band3 *= smoothstep(0.82, 0.55, uv.y + band3 * 0.08);
    aurora += band3 * 0.25;

    // Monochrome gradient - white to gray
    vec3 color1 = vec3(1.0, 1.0, 1.0);     // White
    vec3 color2 = vec3(0.7, 0.7, 0.7);     // Light gray
    vec3 color3 = vec3(0.5, 0.5, 0.5);     // Mid gray

    float colorMix = snoise(vec2(uv.x * 1.5 + u_time * 0.04, u_time * 0.015)) * 0.5 + 0.5;
    vec3 auroraColor = mix(color1, color2, colorMix);
    auroraColor = mix(auroraColor, color3, pow(colorMix, 3.0) * 0.3);

    // Apply aurora intensity with soft glow
    vec3 finalColor = auroraColor * aurora;

    // Add soft bloom effect
    float bloom = aurora * aurora * 0.3;
    finalColor += auroraColor * bloom;

    // Subtle ambient particles
    float stars = snoise(uv * 80.0 + u_time * 0.02) * 0.5 + 0.5;
    stars = pow(stars, 25.0) * 0.15;
    finalColor += vec3(stars) * (1.0 - aurora * 1.5);

    // Pure black background gradient
    vec3 skyTop = vec3(0.05, 0.05, 0.05);
    vec3 skyBottom = vec3(0.0, 0.0, 0.0);
    vec3 sky = mix(skyBottom, skyTop, uv.y * 0.8);

    finalColor = max(finalColor, sky);

    // Subtle vignette for depth
    float vignette = 1.0 - smoothstep(0.4, 1.0, length((uv - 0.5) * 1.2));
    finalColor *= 0.85 + vignette * 0.15;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
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
  fragmentShaderObj: WebGLShader,
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
