/** Izanami-like atmosphere: fog drift, grain, vignette, mild ink-line hatch on fantasy stills. */
export const ATMOSPHERE_FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uImage;
uniform float uTime;
uniform float uFade;
uniform float uInkAmt;
uniform vec2 uResolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
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

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  // subtle breath / drift
  vec2 drift = vec2(
    fbm(uv * 1.5 + uTime * 0.03) - 0.5,
    fbm(uv * 1.7 - uTime * 0.025) - 0.5
  ) * 0.012;
  vec3 col = texture(uImage, uv + drift).rgb;

  // luminance for ink-line feel
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  float edge = abs(dFdx(lum)) + abs(dFdy(lum));
  float hatch = step(0.55, fract((uv.x + uv.y) * uResolution.y * 0.08 + noise(uv * 40.0)));
  vec3 inked = mix(col, vec3(0.06, 0.05, 0.04), smoothstep(0.02, 0.12, edge) * hatch * uInkAmt);
  col = mix(col, inked, uInkAmt * 0.85);

  // drifting fog / mist veil
  float fog = fbm(uv * 2.4 + vec2(uTime * 0.04, -uTime * 0.03));
  fog = smoothstep(0.35, 0.85, fog);
  col = mix(col, col * 0.55 + vec3(0.12, 0.11, 0.1), fog * 0.45);

  // film grain
  float g = hash(uv * uResolution + fract(uTime * 17.0));
  col += (g - 0.5) * 0.07;

  // vignette
  vec2 vc = uv * 2.0 - 1.0;
  float vign = 1.0 - dot(vc * 0.55, vc * 0.55);
  col *= vign;

  // desaturate slightly toward parchment/ink world
  float gray = dot(col, vec3(0.3, 0.5, 0.2));
  col = mix(col, vec3(gray), 0.18);

  fragColor = vec4(col * uFade, 1.0);
}`;
