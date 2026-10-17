/**
 * PARTICLE DRIFT 3 — ORIGINKIT (WebGL Particle & Line Drift Field)
 * Specifically assigned to Section 2 (Your Australian Career Pathway)
 */

(function () {
  'use strict';

  const MAX_DPR = 2;
  const MAX_LINES = 8000;
  const EDGE = 20;

  const LINE_VERT = `
    precision highp float;
    attribute vec2 a_p0;
    attribute vec2 a_p1;
    attribute vec2 a_corner;
    attribute vec3 a_shade;
    uniform vec2 uSize;
    varying float v_alpha;
    varying float v_mix;
    varying float v_off;
    varying float v_half;

    void main(){
      vec2 d = a_p1 - a_p0;
      float len = max(length(d), 1e-5);
      vec2 nrm = vec2(-d.y, d.x) / len;

      float half_ = max(a_shade.z * 0.5, 0.35);
      float ext = half_ + 0.75;
      vec2 p = mix(a_p0, a_p1, a_corner.x);
      p += nrm * a_corner.y * ext;

      v_alpha = a_shade.x;
      v_mix = a_shade.y;
      v_off = a_corner.y * ext;
      v_half = half_;
      gl_Position = vec4(p.x / uSize.x * 2.0 - 1.0, 1.0 - p.y / uSize.y * 2.0, 0.0, 1.0);
    }
  `;

  const LINE_FRAG = `
    precision mediump float;
    uniform vec3 uBase, uAccent;
    varying float v_alpha;
    varying float v_mix;
    varying float v_off;
    varying float v_half;

    void main(){
      float cov = clamp((v_half - abs(v_off)) / 0.75 + 0.5, 0.0, 1.0);
      float a = v_alpha * cov;
      vec3 col = mix(uBase, uAccent, v_mix);
      gl_FragColor = vec4(col * a, a);
    }
  `;

  const DOT_VERT = `
    precision highp float;
    attribute vec2 a_pos;
    attribute float a_lit;
    uniform vec2 uSize;
    uniform float uDpr, uDot;
    varying float v_lit;

    void main(){
      gl_PointSize = max(1.0, uDot * uDpr);
      v_lit = a_lit;
      gl_Position = vec4(a_pos.x / uSize.x * 2.0 - 1.0, 1.0 - a_pos.y / uSize.y * 2.0, 0.0, 1.0);
    }
  `;

  const DOT_FRAG = `
    precision mediump float;
    uniform vec3 uBase, uAccent;
    uniform float uRestAlpha;
    varying float v_lit;

    void main(){
      float d = length(gl_PointCoord - 0.5) * 2.0;
      float disc = 1.0 - smoothstep(0.72, 1.0, d);
      vec3 col = mix(uBase, uAccent, v_lit);
      float a = disc * mix(uRestAlpha, 1.0, v_lit);
      if (a <= 0.004) discard;
      gl_FragColor = vec4(col * a, a);
    }
  `;

  function compile(gl, type, src) {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error("ParticleDrift shader error:", gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function link(gl, vsSrc, fsSrc) {
    const vs = compile(gl, gl.VERTEX_SHADER, vsSrc);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    if (!prog) return null;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("ParticleDrift link error:", gl.getProgramInfoLog(prog));
      return null;
    }
    return prog;
  }

  function parseColor(input, fb) {
    if (!input) return fb;
    const str = String(input).trim();
    if (str.charAt(0) === "#") {
      let hex = str.slice(1);
      if (hex.length === 3 || hex.length === 4) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length >= 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r / 255, g / 255, b / 255];
      }
      return fb;
    }
    const m = str.match(/[\d.]+/g);
    if (m && m.length >= 3) {
      return [
        Math.min(255, parseFloat(m[0])) / 255,
        Math.min(255, parseFloat(m[1])) / 255,
        Math.min(255, parseFloat(m[2])) / 255,
      ];
    }
    return fb;
  }

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a += 0x6d2b79f5;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const CORNERS = [
    [0, -1], [1, -1], [1, 1],
    [0, -1], [1, 1], [0, 1],
  ];

  class ParticleDriftInstance {
    constructor(section, options = {}) {
      this.section = section;
      this.options = Object.assign({
        background: "#000000",
        baseColor: "#FFFFFF",
        accentColor: "#38BDF8", // Clean celestial cyan/blue accent matching brand
        density: 288,
        dotSize: 2.5,
        speed: 56,
        direction: 0,
        hover: 16,
        linkDistance: 0,
        linkThickness: 2
      }, options);

      this.isVisible = false;
      this.animId = null;
      this.ptr = { x: -10000, y: -10000 };
      this.init();
    }

    init() {
      this.section.style.position = 'relative';
      this.section.style.overflow = 'visible';
      this.section.style.backgroundColor = this.options.background;

      // Create container
      const wrapper = document.createElement('div');
      wrapper.className = 'particle-drift-wrapper';
      wrapper.style.cssText = 'position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:0; overflow:hidden;';

      this.canvas = document.createElement('canvas');
      this.canvas.className = 'particle-drift-canvas';
      this.canvas.style.cssText = 'display:block; width:100%; height:100%; pointer-events:none;';
      wrapper.appendChild(this.canvas);

      // Prepend behind content
      const existing = this.section.querySelector('.particle-drift-wrapper');
      if (existing) existing.remove();
      this.section.prepend(wrapper);

      // Content above canvas
      Array.from(this.section.children).forEach(c => {
        if (c !== wrapper) {
          c.style.position = 'relative';
          c.style.zIndex = '2';
        }
      });

      const gl = this.canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        depth: false,
        premultipliedAlpha: true
      });

      if (!gl) {
        console.warn('ParticleDrift: WebGL unavailable');
        return;
      }
      this.gl = gl;

      this.lineProg = link(gl, LINE_VERT, LINE_FRAG);
      this.dotProg = link(gl, DOT_VERT, DOT_FRAG);
      if (!this.lineProg || !this.dotProg) return;

      this.locs = new Map();
      this.u = (prog, name) => {
        const key = (prog === this.lineProg ? "L:" : "D:") + name;
        if (!this.locs.has(key)) this.locs.set(key, gl.getUniformLocation(prog, name));
        return this.locs.get(key);
      };

      // Geometry buffers
      this.lP0 = new Float32Array(MAX_LINES * 6 * 2);
      this.lP1 = new Float32Array(MAX_LINES * 6 * 2);
      this.lCorner = new Float32Array(MAX_LINES * 6 * 2);
      this.lShade = new Float32Array(MAX_LINES * 6 * 3);
      for (let e = 0; e < MAX_LINES; e++) {
        for (let c = 0; c < 6; c++) {
          const k = (e * 6 + c) * 2;
          this.lCorner[k] = CORNERS[c][0];
          this.lCorner[k + 1] = CORNERS[c][1];
        }
      }

      this.bP0 = gl.createBuffer();
      this.bP1 = gl.createBuffer();
      this.bCorner = gl.createBuffer();
      this.bShade = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bP0);
      gl.bufferData(gl.ARRAY_BUFFER, this.lP0.byteLength, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bP1);
      gl.bufferData(gl.ARRAY_BUFFER, this.lP1.byteLength, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bCorner);
      gl.bufferData(gl.ARRAY_BUFFER, this.lCorner, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bShade);
      gl.bufferData(gl.ARRAY_BUFFER, this.lShade.byteLength, gl.DYNAMIC_DRAW);

      this.R = rng(20260824);
      this.bGPos = gl.createBuffer();
      this.bGLit = gl.createBuffer();

      this.nCount = 0;
      this.nx = new Float32Array(0);
      this.ny = new Float32Array(0);
      this.nSpd = new Float32Array(0);
      this.gPos = new Float32Array(0);
      this.gLit = new Float32Array(0);

      this.builtN = -1;
      this.builtW = 0;
      this.builtH = 0;
      this.last = performance.now();

      this.bindEvents();
      this.setupObserver();
    }

    buildNodes(n, w, h) {
      const gl = this.gl;
      this.nCount = n;
      this.nx = new Float32Array(n);
      this.ny = new Float32Array(n);
      this.nSpd = new Float32Array(n);
      this.gPos = new Float32Array(n * 2);
      this.gLit = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        this.nx[i] = this.R() * w;
        this.ny[i] = this.R() * h;
        this.nSpd[i] = (this.R() * 0.4 + 0.1) * 60;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bGPos);
      gl.bufferData(gl.ARRAY_BUFFER, this.gPos.byteLength, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bGLit);
      gl.bufferData(gl.ARRAY_BUFFER, this.gLit.byteLength, gl.DYNAMIC_DRAW);
    }

    bindEvents() {
      this.onPointerMove = (e) => {
        const r = this.canvas.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) return;
        const cw = this.canvas.clientWidth || 1200;
        const ch = this.canvas.clientHeight || 800;
        if (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom
        ) {
          this.ptr.x = ((e.clientX - r.left) / r.width) * cw;
          this.ptr.y = ((e.clientY - r.top) / r.height) * ch;
        } else {
          this.ptr.x = -10000;
          this.ptr.y = -10000;
        }
      };

      this.onPointerLeave = () => {
        this.ptr.x = -10000;
        this.ptr.y = -10000;
      };

      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
      this.section.addEventListener('pointerleave', this.onPointerLeave);
      window.addEventListener('resize', () => {
        this.builtW = 0;
        this.builtH = 0;
      });
    }

    setupObserver() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            this.last = performance.now();
            if (!this.animId) {
              this.animId = requestAnimationFrame((now) => this.render(now));
            }
          } else {
            this.isVisible = false;
            if (this.animId) {
              cancelAnimationFrame(this.animId);
              this.animId = null;
            }
          }
        });
      }, { threshold: 0.05 });

      observer.observe(this.section);
    }

    render(now) {
      if (!this.isVisible) return;

      const gl = this.gl;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;

      const v = this.options;
      const sp = Math.max(0, Math.min(100, v.speed)) / 50;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const cw = this.canvas.clientWidth || 1200;
      const ch = this.canvas.clientHeight || 800;
      const bw = Math.max(1, Math.round(cw * dpr));
      const bh = Math.max(1, Math.round(ch * dpr));

      if (this.canvas.width !== bw || this.canvas.height !== bh) {
        this.canvas.width = bw;
        this.canvas.height = bh;
      }
      gl.viewport(0, 0, bw, bh);

      const targetDensity = Math.round(Math.max(10, Math.min(400, v.density)));
      if (targetDensity !== this.builtN) {
        this.buildNodes(targetDensity, cw, ch);
        this.builtN = targetDensity;
      }

      if (cw !== this.builtW || ch !== this.builtH) {
        const sx = cw / Math.max(this.builtW || cw, 1);
        const sy = ch / Math.max(this.builtH || ch, 1);
        for (let i = 0; i < this.nCount; i++) {
          this.nx[i] *= sx;
          this.ny[i] *= sy;
        }
        this.builtW = cw;
        this.builtH = ch;
      }

      const ptr = this.ptr;
      const hv = Math.max(0, Math.min(200, v.hover)) / 100;
      const reach = 180 * (hv > 0 ? 1 : 0);
      const LINKD = Math.max(0, Math.min(400, v.linkDistance));
      const LINKW = Math.max(0.5, Math.min(8, v.linkThickness));

      const th = (Math.max(0, Math.min(360, v.direction)) * Math.PI) / 180;
      const dirX = Math.sin(th);
      const dirY = Math.cos(th);

      let lines = 0;
      const pushLine = (x0, y0, x1, y1, a0, a1, mix, wpx) => {
        if (lines >= MAX_LINES) return;
        for (let c = 0; c < 6; c++) {
          const k = (lines * 6 + c) * 2;
          const s3 = (lines * 6 + c) * 3;
          this.lP0[k] = x0;
          this.lP0[k + 1] = y0;
          this.lP1[k] = x1;
          this.lP1[k + 1] = y1;

          this.lShade[s3] = CORNERS[c][0] === 0 ? a0 : a1;
          this.lShade[s3 + 1] = mix;
          this.lShade[s3 + 2] = wpx;
        }
        lines++;
      };

      for (let i = 0; i < this.nCount; i++) {
        this.nx[i] += this.nSpd[i] * dirX * dt * sp;
        this.ny[i] += this.nSpd[i] * dirY * dt * sp;

        if (this.nx[i] < -EDGE) {
          this.nx[i] = cw + EDGE;
          this.ny[i] = this.R() * ch;
        } else if (this.nx[i] > cw + EDGE) {
          this.nx[i] = -EDGE;
          this.ny[i] = this.R() * ch;
        }
        if (this.ny[i] < -EDGE) {
          this.ny[i] = ch + EDGE;
          this.nx[i] = this.R() * cw;
        } else if (this.ny[i] > ch + EDGE) {
          this.ny[i] = -EDGE;
          this.nx[i] = this.R() * cw;
        }

        const dx = ptr.x - this.nx[i];
        const dy = ptr.y - this.ny[i];
        const d = Math.sqrt(dx * dx + dy * dy);
        const lit = reach > 0 && d < reach ? 1 : 0;
        if (lit === 1) {
          const a = 0.5 * (1 - d / reach) * hv;
          pushLine(this.nx[i], this.ny[i], ptr.x, ptr.y, a, a, 1, LINKW);
        }
        this.gPos[i * 2] = this.nx[i];
        this.gPos[i * 2 + 1] = this.ny[i];
        this.gLit[i] = lit;
      }

      if (LINKD > 0) {
        const l2 = LINKD * LINKD;
        for (let i = 0; i < this.nCount && lines < MAX_LINES; i++) {
          for (let j = i + 1; j < this.nCount && lines < MAX_LINES; j++) {
            const dx = this.nx[i] - this.nx[j];
            const dy = this.ny[i] - this.ny[j];
            const dd = dx * dx + dy * dy;
            if (dd >= l2) continue;
            const a = 0.15 * (1 - Math.sqrt(dd) / LINKD);
            pushLine(this.nx[i], this.ny[i], this.nx[j], this.ny[j], a, a, 0, LINKW);
          }
        }
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      const cb = parseColor(v.baseColor, [1.0, 1.0, 1.0]);
      const ca = parseColor(v.accentColor, [0.22, 0.74, 0.97]);

      if (lines > 0) {
        gl.useProgram(this.lineProg);
        const verts = lines * 6;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bP0);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.lP0.subarray(0, verts * 2));
        const aP0 = gl.getAttribLocation(this.lineProg, "a_p0");
        gl.enableVertexAttribArray(aP0);
        gl.vertexAttribPointer(aP0, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bP1);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.lP1.subarray(0, verts * 2));
        const aP1 = gl.getAttribLocation(this.lineProg, "a_p1");
        gl.enableVertexAttribArray(aP1);
        gl.vertexAttribPointer(aP1, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bCorner);
        const aCorner = gl.getAttribLocation(this.lineProg, "a_corner");
        gl.enableVertexAttribArray(aCorner);
        gl.vertexAttribPointer(aCorner, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bShade);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.lShade.subarray(0, verts * 3));
        const aShade = gl.getAttribLocation(this.lineProg, "a_shade");
        gl.enableVertexAttribArray(aShade);
        gl.vertexAttribPointer(aShade, 3, gl.FLOAT, false, 0, 0);

        gl.uniform2f(this.u(this.lineProg, "uSize"), cw, ch);
        gl.uniform3f(this.u(this.lineProg, "uBase"), cb[0], cb[1], cb[2]);
        gl.uniform3f(this.u(this.lineProg, "uAccent"), ca[0], ca[1], ca[2]);
        gl.drawArrays(gl.TRIANGLES, 0, verts);

        gl.disableVertexAttribArray(aP0);
        gl.disableVertexAttribArray(aP1);
        gl.disableVertexAttribArray(aCorner);
        gl.disableVertexAttribArray(aShade);
      }

      if (this.nCount > 0) {
        gl.useProgram(this.dotProg);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bGPos);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.gPos);
        const aPos = gl.getAttribLocation(this.dotProg, "a_pos");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bGLit);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.gLit);
        const aLit = gl.getAttribLocation(this.dotProg, "a_lit");
        gl.enableVertexAttribArray(aLit);
        gl.vertexAttribPointer(aLit, 1, gl.FLOAT, false, 0, 0);

        gl.uniform2f(this.u(this.dotProg, "uSize"), cw, ch);
        gl.uniform1f(this.u(this.dotProg, "uDpr"), dpr);
        gl.uniform1f(this.u(this.dotProg, "uDot"), Math.max(1, Math.min(24, v.dotSize)));
        gl.uniform1f(this.u(this.dotProg, "uRestAlpha"), 0.4);
        gl.uniform3f(this.u(this.dotProg, "uBase"), cb[0], cb[1], cb[2]);
        gl.uniform3f(this.u(this.dotProg, "uAccent"), ca[0], ca[1], ca[2]);
        gl.drawArrays(gl.POINTS, 0, this.nCount);

        gl.disableVertexAttribArray(aPos);
        gl.disableVertexAttribArray(aLit);
      }

      this.animId = requestAnimationFrame((n) => this.render(n));
    }

    dispose() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      window.removeEventListener('pointermove', this.onPointerMove);
      this.section.removeEventListener('pointerleave', this.onPointerLeave);
      const wrapper = this.section.querySelector('.particle-drift-wrapper');
      if (wrapper) wrapper.remove();
    }
  }

  const activeInstances = new Map();

  window.initParticleDrift = function () {
    // 1. Clean up stale instances
    activeInstances.forEach((inst, el) => {
      if (!document.body.contains(el)) {
        inst.dispose();
        activeInstances.delete(el);
      }
    });

    // 2. Query target section: ONLY .section-particle-drift (Section 2 - Career Pathway)
    const targets = document.querySelectorAll('.section-particle-drift');
    targets.forEach((sec) => {
      if (activeInstances.has(sec)) return;
      const inst = new ParticleDriftInstance(sec, {
        background: "#000000",
        baseColor: "#FFFFFF",
        accentColor: "#38BDF8", // Vibrant Sky Blue
        density: 288,
        dotSize: 2.2,
        speed: 56,
        hover: 16,
        linkDistance: 0,
        linkThickness: 2
      });
      activeInstances.set(sec, inst);
    });
  };

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initParticleDrift);
  } else {
    window.initParticleDrift();
  }
})();
