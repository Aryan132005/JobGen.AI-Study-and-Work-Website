/**
 * Cursor Ring Field — Originkit (WebGL Dynamic Shader Field)
 * Pure Vanilla JavaScript implementation
 * Features:
 * - Poisson-disk sampled particle grid with GPGPU simulation / analytic fallback
 * - Elastic mouse-following cursor ring with push, turbulence, and wander physics
 * - Dynamic rotated capsule/pill point rendering with multi-color palette
 * - Auto-pauses off-screen via IntersectionObserver for 60fps performance
 */

(function () {
  'use strict';

  const FIELD = 500;
  const HALF = FIELD / 2;
  const WORLD = 5;
  const CURSOR_REACH = 0.175;

  const CURSOR_LERP = 0.12;
  const WANDER_LERP = 0.01;
  const HANDOVER_LERP = 0.08;

  const CURSOR_JITTER = 0.01;
  const FOV = 40;
  const DPR_CAP = 2;
  const MAX_POINTS = 65536;
  const TAU = Math.PI * 2;
  const MAX_COLORS = 5;
  const DEFAULT_COLORS = ["#1A2279", "#407387"];

  const RING_EDGE = 4;

  const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
    + i.y+vec4(0.0,i1.y,i2.y,1.0))
    + i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

  const FIELD_TERMS = `
void fieldTerms(
    vec2 ref, vec2 ringPos, float time,
    float ringRadius, float w1, float w2, float turb,
    out vec2 disp, out float bandT, out float bandHot
){
    float dist = distance(ref, ringPos);

    float n0 = snoise(vec3(ref * 0.2 + vec2(18.4924, 72.9744), time * 0.5));
    float dist1 = distance(ref + (n0 * 0.005), ringPos);

    float t  = smoothstep(ringRadius - (w1 * 2.0), ringRadius, dist)
             - smoothstep(ringRadius, ringRadius + w1, dist1);
    float t2 = smoothstep(ringRadius - (w2 * 2.0), ringRadius, dist)
             - smoothstep(ringRadius, ringRadius + w2, dist1);
    float t3 = smoothstep(ringRadius + w2, ringRadius, dist);

    t  = pow(max(t, 0.0), 2.0);
    t2 = pow(max(t2, 0.0), 3.0);

    t += t2 * 3.0;
    t += t3 * 0.4;
    t += snoise(vec3(ref * 30.0 + vec2(11.4924, 12.9744), time * 0.5)) * t3 * 0.5;

    float nS = snoise(vec3(ref * 2.0 + vec2(18.4924, 72.9744), time * 0.5));
    t += pow((nS + 1.5) * 0.5, 2.0) * 0.6;

    float n1 = snoise(vec3(ref * 4.0 + vec2(88.494, 32.4397), time * 0.35));
    float n2 = snoise(vec3(ref * 4.0 + vec2(50.904, 120.947), time * 0.35));
    float n3 = snoise(vec3(ref * 20.0 + vec2(18.4924, 72.9744), time * 0.5));
    float n4 = snoise(vec3(ref * 20.0 + vec2(50.904, 120.947), time * 0.5));

    vec2 d = vec2(n1, n2) * 0.03 + vec2(n3, n4) * 0.005;
    d.x += sin((ref.x * 20.0) + (time * 4.0)) * 0.02 * clamp(dist, 0.0, 1.0);
    d.y += cos((ref.y * 20.0) + (time * 3.0)) * 0.02 * clamp(dist, 0.0, 1.0);

    disp = d * turb;
    bandT = t;
    bandHot = t2;
}
`;

  const SIM_VERT = `
precision highp float;
attribute vec2 aPos;
varying vec2 vUV;
void main(){
    vUV = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

  const SIM_FRAG = `
precision highp float;

uniform sampler2D uState;
uniform sampler2D uRefs;
uniform vec2  uRingPos;
uniform float uRingRadius;
uniform float uRingWidth;
uniform float uRingWidth2;
uniform float uPush;
uniform float uTurb;
uniform float uTime;

varying vec2 vUV;

${NOISE}
${FIELD_TERMS}

void main(){
    vec4 frame = texture2D(uState, vUV);
    vec2 ref   = texture2D(uRefs, vUV).xy;

    float scale  = frame.z;
    float energy = frame.w;
    float time   = uTime * 0.5;

    vec2 disp; float t; float t2;
    fieldTerms(ref, uRingPos, time, uRingRadius, uRingWidth, uRingWidth2, uTurb, disp, t, t2);

    vec2 mem = frame.xy * 0.8;
    mem -= (uRingPos - (ref + disp)) * pow(max(t2, 0.0), 0.75) * uPush;

    scale += (t - scale) * 0.2;
    vec2 finalPos = ref + disp + (mem * 0.25);
    energy = energy * 0.5 + scale * 0.25;

    gl_FragColor = vec4(finalPos, scale, energy);
}
`;

  const RENDER_VERT = (isStatic) => `
precision highp float;

attribute vec2 aUV;
attribute vec2 aRef;

uniform sampler2D uState;
uniform float uProjF;
uniform float uAspect;
uniform float uCamDist;
uniform float uPointScale;
${
  isStatic
    ? `uniform vec2  uRingPos;
uniform float uRingRadius;
uniform float uRingWidth;
uniform float uRingWidth2;
uniform float uTurb;
uniform float uTime;`
    : ``
}

varying vec2  vLocalPos;
varying float vScale;
varying float vEnergy;

${isStatic ? NOISE : ``}
${isStatic ? FIELD_TERMS : ``}

void main(){
${
  isStatic
    ? `    vec2 disp; float t; float t2;
    fieldTerms(aRef, uRingPos, uTime * 0.5, uRingRadius, uRingWidth, uRingWidth2, uTurb, disp, t, t2);
    vec4 state = vec4(aRef + disp, t, t * 0.5);`
    : `    vec4 state = texture2D(uState, aUV);`
}

    vLocalPos = state.xy;
    vScale    = state.z;
    vEnergy   = state.w;

    vec2 world = state.xy * ${WORLD.toFixed(1)};
    gl_Position = vec4(world.x * uProjF / uAspect, world.y * uProjF, 0.0, uCamDist);
    gl_PointSize = max(vScale, 0.0) * 7.0 * uPointScale;
}
`;

  const RENDER_FRAG = `
precision highp float;

varying vec2  vLocalPos;
varying float vScale;
varying float vEnergy;

uniform vec3  uColors[${MAX_COLORS}];
uniform int   uColorCount;
uniform vec2  uRingPos;
uniform float uTime;

${NOISE}

float sdRoundBox(in vec2 p, in vec2 b, in float r){
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

vec2 rotate(vec2 v, float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, s, -s, c) * v;
}

void main(){
    float noiseAngle = snoise(vec3(vLocalPos * 10.0 + vec2(18.4924, 72.9744), uTime * 0.85));
    float noiseColor = snoise(vec3(vLocalPos * 2.0  + vec2(74.664,  91.556),  uTime * 0.5));
    noiseColor = (noiseColor + 1.0) * 0.5;

    float angle = atan(vLocalPos.y - uRingPos.y, vLocalPos.x - uRingPos.x);

    vec2 uv = gl_PointCoord.xy - vec2(0.5);
    uv.y *= -1.0;
    uv = rotate(uv, -angle + (noiseAngle * 0.5));

    float p = smoothstep(0.0, 0.75, pow(noiseColor, 2.0));
    vec3 color = uColors[0];
    for (int i = 0; i < ${MAX_COLORS - 1}; i++) {
        if (i < uColorCount - 1) {
            float span = 1.0 / float(uColorCount - 1);
            float t = clamp((p - float(i) * span) / span, 0.0, 1.0);
            color = mix(color, uColors[i + 1], t);
        }
    }

    float d = sdRoundBox(uv, vec2(0.5, 0.2), 0.25);
    float mask = smoothstep(0.1, 0.0, d);

    float a = mask * smoothstep(0.1, 0.2, vScale);
    if (a < 0.01) discard;

    color = clamp(color, 0.0, 1.0);
    color *= clamp(vEnergy, 0.0, 1.0);

    gl_FragColor = vec4(color, clamp(a, 0.0, 1.0));
}
`;

  function compile(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      throw new Error(log || "shader compile failed");
    }
    return sh;
  }

  function program(gl, vs, fs, names) {
    const prog = gl.createProgram();
    const v = compile(gl, gl.VERTEX_SHADER, vs);
    const f = compile(gl, gl.FRAGMENT_SHADER, fs);
    gl.attachShader(prog, v);
    gl.attachShader(prog, f);
    gl.linkProgram(prog);
    gl.deleteShader(v);
    gl.deleteShader(f);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(prog);
      gl.deleteProgram(prog);
      throw new Error(log || "program link failed");
    }
    const u = {};
    const nulls = [];
    for (let i = 0; i < names.length; i++) {
      const n = names[i];
      const loc = gl.getUniformLocation(prog, n);
      if (loc === null) nulls.push(n);
      u[n] = loc;
    }
    return { prog, u, nulls };
  }

  function makeContext(canvas) {
    const opts = {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    };
    let gl = canvas.getContext("webgl2", opts);
    let fmt = null;
    if (gl) {
      fmt = gl.getExtension("EXT_color_buffer_float")
        ? { internal: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT }
        : { internal: gl.RGBA16F, format: gl.RGBA, type: gl.HALF_FLOAT };
    } else {
      gl = canvas.getContext("webgl", opts) || canvas.getContext("experimental-webgl", opts);
      if (!gl) return null;
      const ok = gl.getExtension("OES_texture_float") && gl.getExtension("WEBGL_color_buffer_float");
      fmt = ok ? { internal: gl.RGBA, format: gl.RGBA, type: gl.FLOAT } : null;
    }

    if (gl && gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) < 2) fmt = null;
    return { gl, fmt };
  }

  function stateTexture(gl, fmt, size, pixels) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      fmt.internal,
      size,
      size,
      0,
      fmt.format,
      fmt.type,
      pixels || null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  }

  function renderTarget(gl, fmt, size) {
    const tex = stateTexture(gl, fmt, size, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0
    );
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { tex, fbo, ok };
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const linMap = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;

  function poissonDisk(size, minD, maxD, tries, rand) {
    const cell = minD / Math.SQRT2;
    const gw = Math.ceil(size / cell);
    const gh = Math.ceil(size / cell);
    const grid = new Int32Array(gw * gh).fill(-1);
    const px = [];
    const py = [];
    const active = [];
    const minD2 = minD * minD;

    const add = (x, y) => {
      const i = px.length;
      px.push(x);
      py.push(y);
      grid[((y / cell) | 0) * gw + ((x / cell) | 0)] = i;
      active.push(i);
    };

    add(rand() * size, rand() * size);

    while (active.length > 0 && px.length < MAX_POINTS) {
      const ai = (rand() * active.length) | 0;
      const idx = active[ai];
      let placed = false;
      for (let t = 0; t < tries; t++) {
        const ang = rand() * TAU;
        const r = minD + (maxD - minD) * rand();
        const nx = px[idx] + Math.cos(ang) * r;
        const ny = py[idx] + Math.sin(ang) * r;
        if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
        const cx = (nx / cell) | 0;
        const cy = (ny / cell) | 0;
        let ok = true;
        for (let j = Math.max(0, cy - 2); j <= Math.min(gh - 1, cy + 2) && ok; j++) {
          for (let i = Math.max(0, cx - 2); i <= Math.min(gw - 1, cx + 2); i++) {
            const q = grid[j * gw + i];
            if (q < 0) continue;
            const dx = px[q] - nx;
            const dy = py[q] - ny;
            if (dx * dx + dy * dy < minD2) {
              ok = false;
              break;
            }
          }
        }
        if (ok) {
          add(nx, ny);
          placed = true;
          break;
        }
      }
      if (!placed) {
        active[ai] = active[active.length - 1];
        active.pop();
      }
    }
    return { px, py, count: px.length };
  }

  function buildField(density) {
    const rand = mulberry32(0x9e3779b9);
    const minD = linMap(density, 0, 300, 10, 2);
    const maxD = linMap(density, 0, 300, 11, 3);
    const { px, py, count } = poissonDisk(FIELD, minD, maxD, 20, rand);

    let texSize = 8;
    while (texSize * texSize < count) texSize *= 2;

    const refs = new Float32Array(texSize * texSize * 4);
    const aUV = new Float32Array(count * 2);
    const aRef = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const x = (px[i] - HALF) / HALF;
      const y = (py[i] - HALF) / HALF;
      refs[i * 4 + 0] = x;
      refs[i * 4 + 1] = y;
      aRef[i * 2 + 0] = x;
      aRef[i * 2 + 1] = y;

      aUV[i * 2 + 0] = ((i % texSize) + 0.5) / texSize;
      aUV[i * 2 + 1] = (Math.floor(i / texSize) + 0.5) / texSize;
    }
    return { count, texSize, refs, aUV, aRef };
  }

  function valueNoise1(x, seed) {
    const i = Math.floor(x);
    const f = x - i;
    const h = (n) => {
      const s = Math.sin((n + seed) * 127.1) * 43758.5453;
      return s - Math.floor(s);
    };
    const u = f * f * (3 - 2 * f);
    return h(i) * (1 - u) + h(i + 1) * u;
  }

  function hexToRgb(hex) {
    if (typeof hex !== "string") return [1, 1, 1];
    let s = hex.trim();
    const m = s.match(/^rgba?\(([^)]+)\)$/i);
    if (m) {
      const p = m[1].split(",").map((v) => parseFloat(v));
      return [(p[0] || 0) / 255, (p[1] || 0) / 255, (p[2] || 0) / 255];
    }
    s = s.replace("#", "");
    if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    if (s.length === 8) s = s.slice(0, 6);
    if (s.length !== 6) return [1, 1, 1];
    const n = parseInt(s, 16);
    if (!isFinite(n)) return [1, 1, 1];
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  const DEFAULT_PRESET = {
    background: "#B3B7CD",
    colors: ["#1A2279", "#407387"],
    density: 230,
    dotSize: 65,
    speed: 6,
    cameraDistance: 290,
    ring: {
      push: 18,
      width: 15,
      radius: 13,
      turbulence: 55
    }
  };

  class CursorRingField {
    constructor(hostElement, options = {}) {
      this.host = hostElement;
      this.options = Object.assign({}, DEFAULT_PRESET, options);
      if (options.ring) {
        this.options.ring = Object.assign({}, DEFAULT_PRESET.ring, options.ring);
      }

      this.canvas = document.createElement("canvas");
      this.canvas.className = "cursor-ring-canvas";

      this.animId = null;
      this.isVisible = false;
      this.disposed = false;

      this.init();
    }

    init() {
      // Ensure host is relatively positioned
      this.host.style.position = "relative";
      this.host.style.backgroundColor = this.options.background;

      // Remove any existing canvas
      const existing = this.host.querySelector(".cursor-ring-canvas");
      if (existing) existing.remove();

      this.canvas.style.position = "absolute";
      this.canvas.style.top = "0";
      this.canvas.style.left = "0";
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
      this.canvas.style.display = "block";
      this.canvas.style.pointerEvents = "none";
      this.canvas.style.zIndex = "0";

      this.host.prepend(this.canvas);

      const ctx = makeContext(this.canvas);
      if (!ctx) {
        console.warn("CursorRingField: WebGL context creation failed");
        return;
      }

      this.gl = ctx.gl;
      this.fmt = ctx.fmt;
      this.useSim = !!this.fmt;

      try {
        if (this.useSim) {
          this.simProg = program(this.gl, SIM_VERT, SIM_FRAG, [
            "uState",
            "uRefs",
            "uRingPos",
            "uRingRadius",
            "uRingWidth",
            "uRingWidth2",
            "uPush",
            "uTurb",
            "uTime",
          ]);
        }
        const renderNames = [
          "uProjF",
          "uAspect",
          "uCamDist",
          "uPointScale",
          "uColors[0]",
          "uColorCount",
          "uRingPos",
          "uTime",
        ];
        if (this.useSim) renderNames.push("uState");
        else renderNames.push("uRingRadius", "uRingWidth", "uRingWidth2", "uTurb");

        this.renderProg = program(
          this.gl,
          RENDER_VERT(!this.useSim),
          RENDER_FRAG,
          renderNames
        );
      } catch (e) {
        console.warn("CursorRingField shader error:", e.message);
        return;
      }

      this.setupBuffers();
      this.setupPalette();
      this.setupEvents();
      this.setupObserver();
    }

    setupBuffers() {
      const gl = this.gl;
      this.quad = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );

      this.uvBuf = gl.createBuffer();
      this.refBuf = gl.createBuffer();
      this.refsTex = null;
      this.rt1 = null;
      this.rt2 = null;

      this.rebuildField(this.options.density);
    }

    rebuildField(density) {
      const gl = this.gl;
      if (this.refsTex) gl.deleteTexture(this.refsTex);
      if (this.rt1) {
        gl.deleteTexture(this.rt1.tex);
        gl.deleteFramebuffer(this.rt1.fbo);
      }
      if (this.rt2) {
        gl.deleteTexture(this.rt2.tex);
        gl.deleteFramebuffer(this.rt2.fbo);
      }

      const f = buildField(density);
      this.count = f.count;
      this.texSize = f.texSize;

      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuf);
      gl.bufferData(gl.ARRAY_BUFFER, f.aUV, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.refBuf);
      gl.bufferData(gl.ARRAY_BUFFER, f.aRef, gl.STATIC_DRAW);

      if (!this.useSim) return;

      const src = { internal: this.fmt.internal, format: gl.RGBA, type: gl.FLOAT };
      this.refsTex = stateTexture(gl, src, this.texSize, f.refs);
      this.rt1 = renderTarget(gl, this.fmt, this.texSize);
      this.rt2 = renderTarget(gl, this.fmt, this.texSize);

      gl.bindTexture(gl.TEXTURE_2D, this.rt1.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, this.fmt.internal, this.texSize, this.texSize, 0, gl.RGBA, gl.FLOAT, f.refs);
      gl.bindTexture(gl.TEXTURE_2D, this.rt2.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, this.fmt.internal, this.texSize, this.texSize, 0, gl.RGBA, gl.FLOAT, f.refs);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }

    setupPalette() {
      const colors = this.options.colors || DEFAULT_COLORS;
      const swatches = colors.slice(0, MAX_COLORS).map(hexToRgb);
      if (swatches.length === 0) swatches.push(hexToRgb(DEFAULT_COLORS[0]));

      this.flatColors = new Float32Array(MAX_COLORS * 3);
      for (let i = 0; i < MAX_COLORS; i++) {
        const c = swatches[Math.min(i, swatches.length - 1)];
        this.flatColors[i * 3 + 0] = c[0];
        this.flatColors[i * 3 + 1] = c[1];
        this.flatColors[i * 3 + 2] = c[2];
      }
      this.colorCount = swatches.length;
    }

    setupEvents() {
      this.pointer = { x: 0, y: 0, over: false };
      this.ringPos = { x: 0, y: 0 };
      this.follow = 0;

      this.onMove = (e) => {
        if (!this.isVisible) return;
        const r = this.canvas.getBoundingClientRect();
        this.pointer.x = ((e.clientX - r.left) / Math.max(r.width, 1)) * 2 - 1;
        this.pointer.y = -(((e.clientY - r.top) / Math.max(r.height, 1)) * 2 - 1);
        this.pointer.over =
          this.pointer.x >= -1.05 && this.pointer.x <= 1.05 &&
          this.pointer.y >= -1.05 && this.pointer.y <= 1.05;
      };

      this.onLeave = () => {
        this.pointer.over = false;
      };

      window.addEventListener("pointermove", this.onMove, { passive: true });
      this.canvas.addEventListener("pointerleave", this.onLeave);

      this.resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
        const cssW = Math.max(this.canvas.clientWidth || this.host.clientWidth || 1, 1);
        const cssH = Math.max(this.canvas.clientHeight || this.host.clientHeight || 1, 1);
        const w = Math.max(1, Math.round(cssW * dpr));
        const h = Math.max(1, Math.round(cssH * dpr));
        if (this.canvas.width !== w || this.canvas.height !== h) {
          this.canvas.width = w;
          this.canvas.height = h;
        }
        this.cssW = cssW;
        this.cssH = cssH;
        this.dpr = dpr;
      };

      this.resize();
      this.ro = new ResizeObserver(this.resize);
      this.ro.observe(this.host);
    }

    setupObserver() {
      this.io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.isVisible = entry.isIntersecting;
            if (this.isVisible && !this.animId) {
              this.start();
            } else if (!this.isVisible && this.animId) {
              this.stop();
            }
          });
        },
        { threshold: 0.05 }
      );
      this.io.observe(this.host);
    }

    start() {
      if (this.disposed) return;
      let last = 0;
      let simTime = 0;
      let wander = 0;
      let ping = true;

      const gl = this.gl;
      const posLocSim = this.simProg ? gl.getAttribLocation(this.simProg.prog, "aPos") : -1;
      const uvLoc = gl.getAttribLocation(this.renderProg.prog, "aUV");
      const refLoc = gl.getAttribLocation(this.renderProg.prog, "aRef");

      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA,
        gl.ONE,
        gl.ONE_MINUS_SRC_ALPHA
      );

      const loop = (now) => {
        if (!this.isVisible || this.disposed) {
          this.animId = null;
          return;
        }
        this.animId = requestAnimationFrame(loop);

        if (!this.count) return;

        const dtRaw = last ? (now - last) / 1000 : 1 / 60;
        last = now;
        const dt = Math.min(dtRaw, 1 / 20);

        const speedNorm = this.options.speed / 50;
        simTime = (simTime + dt * speedNorm) % 3600;
        wander += dt * speedNorm;

        const cssW = this.cssW || 1;
        const cssH = this.cssH || 1;
        const aspect = Math.max(cssW / Math.max(cssH, 1), 0.0001);
        const projF = 1 / Math.tan(((FOV * Math.PI) / 180) / 2);
        const camDist = this.options.cameraDistance / 100;

        const wx = (valueNoise1(wander * 0.66, 94.234) - 0.5) * 2;
        const wy = (valueNoise1(wander * 0.75, 21.028) - 0.5) * 2;

        this.follow +=
          ((this.pointer.over ? 1 : 0) - this.follow) *
          (1 - Math.pow(1 - HANDOVER_LERP, dt * 60));

        const wanderX = wx * 0.2;
        const wanderY = wy * 0.1;
        let tx = wanderX;
        let ty = wanderY;
        if (this.follow > 0.0001) {
          const worldX = (this.pointer.x * aspect * camDist) / projF;
          const worldY = (this.pointer.y * camDist) / projF;
          const cx = worldX * CURSOR_REACH + wx * CURSOR_JITTER;
          const cy = worldY * CURSOR_REACH + wy * CURSOR_JITTER;
          tx = wanderX + (cx - wanderX) * this.follow;
          ty = wanderY + (cy - wanderY) * this.follow;
        }

        const lerp = WANDER_LERP + (CURSOR_LERP - WANDER_LERP) * this.follow;
        const rk = 1 - Math.pow(1 - lerp, dt * 60);
        this.ringPos.x += (tx - this.ringPos.x) * rk;
        this.ringPos.y += (ty - this.ringPos.y) * rk;

        const ringRadius = this.options.ring.radius / 100;
        const ringWidth = Math.max(this.options.ring.width, 1) / 100;
        const ringEdge = RING_EDGE / 100;
        const push = this.options.ring.push / 100;
        const turb = this.options.ring.turbulence / 100;

        const radius =
          ringRadius +
          Math.sin(simTime) * 0.03 +
          Math.cos(simTime * 3) * 0.02;

        if (this.useSim) {
          const src = ping ? this.rt1 : this.rt2;
          const dst = ping ? this.rt2 : this.rt1;
          gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
          gl.viewport(0, 0, this.texSize, this.texSize);
          gl.disable(gl.BLEND);
          gl.useProgram(this.simProg.prog);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
          gl.enableVertexAttribArray(posLocSim);
          gl.vertexAttribPointer(posLocSim, 2, gl.FLOAT, false, 0, 0);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, src.tex);
          gl.uniform1i(this.simProg.u.uState, 0);
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, this.refsTex);
          gl.uniform1i(this.simProg.u.uRefs, 1);
          gl.uniform2f(this.simProg.u.uRingPos, this.ringPos.x, this.ringPos.y);
          gl.uniform1f(this.simProg.u.uRingRadius, radius);
          gl.uniform1f(this.simProg.u.uRingWidth, ringWidth);
          gl.uniform1f(this.simProg.u.uRingWidth2, ringEdge);
          gl.uniform1f(this.simProg.u.uPush, push);
          gl.uniform1f(this.simProg.u.uTurb, turb);
          gl.uniform1f(this.simProg.u.uTime, simTime);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.enable(gl.BLEND);
          ping = !ping;
        }

        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.renderProg.prog);

        if (uvLoc >= 0) {
          gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuf);
          gl.enableVertexAttribArray(uvLoc);
          gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);
        }
        if (refLoc >= 0) {
          gl.bindBuffer(gl.ARRAY_BUFFER, this.refBuf);
          gl.enableVertexAttribArray(refLoc);
          gl.vertexAttribPointer(refLoc, 2, gl.FLOAT, false, 0, 0);
        }

        if (this.useSim) {
          const shown = ping ? this.rt1 : this.rt2;
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, shown.tex);
          gl.uniform1i(this.renderProg.u.uState, 0);
        } else {
          gl.uniform1f(this.renderProg.u.uRingRadius, radius);
          gl.uniform1f(this.renderProg.u.uRingWidth, ringWidth);
          gl.uniform1f(this.renderProg.u.uRingWidth2, ringEdge);
          gl.uniform1f(this.renderProg.u.uTurb, turb);
        }

        gl.uniform1f(this.renderProg.u.uProjF, projF);
        gl.uniform1f(this.renderProg.u.uAspect, aspect);
        gl.uniform1f(this.renderProg.u.uCamDist, camDist);

        const dotSize = this.options.dotSize / 100;
        gl.uniform1f(
          this.renderProg.u.uPointScale,
          (cssW / 2000) * dotSize * this.dpr * 0.5
        );
        gl.uniform3fv(this.renderProg.u["uColors[0]"], this.flatColors);
        gl.uniform1i(this.renderProg.u.uColorCount, this.colorCount);
        gl.uniform2f(this.renderProg.u.uRingPos, this.ringPos.x, this.ringPos.y);
        gl.uniform1f(this.renderProg.u.uTime, simTime);

        gl.drawArrays(gl.POINTS, 0, this.count);
      };

      this.animId = requestAnimationFrame(loop);
    }

    stop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    dispose() {
      this.disposed = true;
      this.stop();
      if (this.ro) this.ro.disconnect();
      if (this.io) this.io.disconnect();
      window.removeEventListener("pointermove", this.onMove);
      if (this.canvas) this.canvas.removeEventListener("pointerleave", this.onLeave);

      const gl = this.gl;
      if (gl) {
        if (this.refsTex) gl.deleteTexture(this.refsTex);
        if (this.rt1) {
          gl.deleteTexture(this.rt1.tex);
          gl.deleteFramebuffer(this.rt1.fbo);
        }
        if (this.rt2) {
          gl.deleteTexture(this.rt2.tex);
          gl.deleteFramebuffer(this.rt2.fbo);
        }
        if (this.quad) gl.deleteBuffer(this.quad);
        if (this.uvBuf) gl.deleteBuffer(this.uvBuf);
        if (this.refBuf) gl.deleteBuffer(this.refBuf);
        if (this.simProg) gl.deleteProgram(this.simProg.prog);
        if (this.renderProg) gl.deleteProgram(this.renderProg.prog);
      }
      if (this.canvas && this.canvas.parentElement) {
        this.canvas.remove();
      }
    }
  }

  // Global Initializer
  window._cursorRingInstances = window._cursorRingInstances || [];

  window.initCursorRingFields = function () {
    // 1. Clean up instances whose host is disconnected from DOM
    window._cursorRingInstances = (window._cursorRingInstances || []).filter((inst) => {
      if (!inst.host || !document.contains(inst.host) || inst.disposed) {
        try { inst.dispose(); } catch (e) {}
        return false;
      }
      return true;
    });

    // 2. Query all light/white sections across all views
    const lightSections = document.querySelectorAll('.section-spider-light, .section-cursor-ring, .section-light, .fx-light, .services-showcase-section');
    lightSections.forEach((sec) => {
      const hasActiveCanvas = sec.querySelector('.cursor-ring-canvas');
      if (!hasActiveCanvas || !sec._cursorRingAttached) {
        try {
          const inst = new CursorRingField(sec, DEFAULT_PRESET);
          sec._cursorRingAttached = true;
          window._cursorRingInstances.push(inst);
        } catch (err) {
          console.warn("CursorRingField init error:", err);
        }
      }
    });
  };

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initCursorRingFields);
  } else {
    window.initCursorRingFields();
  }

  window.CursorRingField = CursorRingField;
})();
