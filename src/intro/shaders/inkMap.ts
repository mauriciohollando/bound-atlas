/** Fantasy map + interactive ink with brush-fiber bleed (Shadertoy brush stroke spirit). */
export const INK_MAP_FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uMap;
uniform sampler2D uInk;
uniform float uTime;
uniform float uReveal;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerDown;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float magicBox(vec3 p) {
  p = 1.0 - abs(1.0 - mod(p, 2.0));
  float lastLength = length(p);
  float tot = 0.0;
  for (int i = 0; i < 8; i++) {
    p = abs(p) / (lastLength * lastLength) - 0.55;
    float newLength = length(p);
    tot += abs(newLength - lastLength);
    lastLength = newLength;
  }
  return tot;
}

void main() {
  vec2 uv = vUv;
  vec3 paper = texture(uMap, uv).rgb;

  // under-drawing hatch on map (pencil atlas feel)
  float lum = dot(paper, vec3(0.3, 0.5, 0.2));
  float edge = abs(dFdx(lum)) + abs(dFdy(lum));
  float lines = step(0.5, fract((uv.x * 1.2 + uv.y) * 220.0 + noise(uv * 30.0)));
  paper = mix(paper, paper * 0.72, smoothstep(0.01, 0.08, edge) * lines * 0.55);

  // ink buffer (R = ink amount)
  float ink = texture(uInk, uv).r;

  // brush fiber modulation along ink
  float fibers =
      noise(uv * vec2(uResolution.y * 0.35, 18.0)) * 0.45 +
      noise(uv * vec2(70.0, 9.0)) * 0.35 +
      noise(uv * 14.0) * 0.2;
  fibers = max(0.05, fibers);
  float inkEdge = smoothstep(0.02, 0.55, ink) * pow(fibers, 0.55);

  // paper bleed
  float bleed = 0.7 + hash(uv.yx) * 0.3;
  inkEdge = smoothstep(0.0, bleed, inkEdge);

  // blotches from magic box when heavily inked
  float blotch = smoothstep(18.0, 42.0, magicBox(vec3((uv + 9.0) * 2.2, ink)));
  blotch = pow(blotch, 3.0) * ink * 0.35;

  vec3 inkColor = vec3(0.12, 0.05, 0.02); // bound iron-gall
  vec3 goldVein = vec3(0.72, 0.55, 0.18);
  float goldMix = smoothstep(0.4, 0.9, ink) * 0.15;
  inkColor = mix(inkColor, goldVein, goldMix);

  vec3 col = mix(paper, inkColor, clamp(inkEdge + blotch, 0.0, 1.0));

  // soft cursor preview when pointer down
  if (uPointerDown > 0.5) {
    float d = distance(uv, uPointer);
    float ring = smoothstep(0.028, 0.01, d) * 0.25;
    col = mix(col, inkColor, ring);
  }

  // grain + vignette
  col += (hash(uv * uResolution + uTime) - 0.5) * 0.06;
  vec2 vc = uv * 2.0 - 1.0;
  col *= 1.0 - dot(vc * 0.45, vc * 0.45) * 0.55;

  fragColor = vec4(col * uReveal, 1.0);
}`;
