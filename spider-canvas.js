/**
 * STUDY & WORK AUSTRALIA — INTERACTIVE SPIDER PLEXUS CANVAS SYSTEM
 * Features:
 * - Geometric node network with delicate connecting spider-web lines
 * - Mouse attraction physics ("pointer pass me aaya tho kheche aas pass walo ko")
 * - Non-colorful, elegant aesthetic matching reference screenshot:
 *     * Dark sections: Subtle champagne gold & muted silver/white
 *     * Light sections: Clean white with subtle corporate deep blue
 * - IntersectionObserver to animate only sections currently visible (60fps performance)
 */

(function () {
  'use strict';

  class SpiderCanvas {
    constructor(section, isDark) {
      this.section = section;
      this.isDark = isDark;
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'spider-canvas';
      this.ctx = this.canvas.getContext('2d');

      // Theme configuration:
      // Dark sections: Soft Luminous Stardust (calm, non-distracting, celestial micro-dust)
      // Light sections: Clean corporate blue spider network
      if (this.isDark) {
        this.theme = 'stardust';
      } else {
        this.theme = 'spider';
        this.lineRgb = '2, 132, 199';   // #0284c7 blue
        this.dotColor = '#0284c7';
        this.ringColor = '#0284c7';
        this.mouseLineRgb = '2, 132, 199';
      }

      this.particles = [];
      this.mouse = { x: null, y: null, radius: 250 };
      this.isVisible = false;
      this.animId = null;

      this.init();
    }

    init() {
      this.section.style.position = 'relative';

      // Insert canvas behind content
      const existing = this.section.querySelector('.spider-canvas');
      if (existing) existing.remove();
      this.section.prepend(this.canvas);

      this.resize();
      this.createParticles();
      this.bindEvents();
      this.setupObserver();
    }

    resize() {
      this.width = this.canvas.width = this.section.offsetWidth;
      this.height = this.canvas.height = this.section.offsetHeight;
    }

    createParticles() {
      this.particles = [];

      if (this.theme === 'stardust') {
        // Soft Luminous Stardust: tiny, soft, floating micro-particles (no harsh lines, no rings)
        const count = Math.max(50, Math.min(90, Math.floor((this.width * this.height) / 16000)));
        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            radius: Math.random() * 0.9 + 0.6, // 0.6px - 1.5px micro dots
            baseAlpha: Math.random() * 0.22 + 0.12, // soft 0.12 - 0.34 opacity
            twinkleSpeed: Math.random() * 0.022 + 0.008,
            twinklePhase: Math.random() * Math.PI * 2,
            vx: (Math.random() - 0.5) * 0.16,
            vy: -(Math.random() * 0.26 + 0.1), // gentle upward floating
            color: i % 3 === 0 ? '224, 242, 254' : (i % 2 === 0 ? '186, 230, 253' : '241, 245, 249')
          });
        }
      } else {
        // Light section: dense and responsive corporate blue spider web network
        const count = Math.max(75, Math.min(130, Math.floor((this.width * this.height) / 10000)));
        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            vx: (Math.random() - 0.5) * 0.65,
            vy: (Math.random() - 0.5) * 0.65,
            radius: i % 7 === 0 ? 2.8 : (i % 3 === 0 ? 2.0 : 1.4),
            hasRing: i % 10 === 0
          });
        }
      }
    }

    bindEvents() {
      // Track mouse position over section and any child elements (videos, cards, buttons)
      this.onMouseMove = (e) => {
        if (!this.isVisible) return;
        const rect = this.canvas.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          this.mouse.x = e.clientX - rect.left;
          this.mouse.y = e.clientY - rect.top;
        } else {
          this.mouse.x = null;
          this.mouse.y = null;
        }
      };

      window.addEventListener('mousemove', this.onMouseMove, { passive: true });

      this.section.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });

      window.addEventListener('resize', () => {
        this.resize();
        this.createParticles();
      });
    }

    setupObserver() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            if (!this.animId) {
              this.animId = requestAnimationFrame(() => this.updateAndDraw());
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

    updateAndDraw() {
      if (!this.isVisible) return;

      const { ctx, width, height, mouse, particles, theme } = this;
      ctx.clearRect(0, 0, width, height);

      if (theme === 'stardust') {
        // --- 1. DARK SECTION: SOFT LUMINOUS STARDUST ---

        // Ambient spotlight glow following cursor
        if (mouse.x !== null && mouse.y !== null) {
          const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 170);
          glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.07)');
          glowGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.02)');
          glowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 170, 0, Math.PI * 2);
          ctx.fill();
        }

        // Render soft drifting micro-particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Slow organic floating drift
          p.x += p.vx;
          p.y += p.vy;
          p.twinklePhase += p.twinkleSpeed;

          // Seamless loop when particle floats off-screen
          if (p.y < -6) {
            p.y = height + 6;
            p.x = Math.random() * width;
          }
          if (p.x < -6) p.x = width + 6;
          if (p.x > width + 6) p.x = -6;

          // Gentle mouse gravity attraction (subtle, no lines)
          let alphaBoost = 0;
          if (mouse.x !== null && mouse.y !== null) {
            const mdx = mouse.x - p.x;
            const mdy = mouse.y - p.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 140 && mdist > 2) {
              const force = (140 - mdist) / 140;
              p.x += (mdx / mdist) * force * 0.4;
              p.y += (mdy / mdist) * force * 0.4;
              alphaBoost = force * 0.25;
            }
          }

          // Subtle twinkle calculation
          const alpha = Math.min(0.65, Math.max(0.06, p.baseAlpha + Math.sin(p.twinklePhase) * 0.08 + alphaBoost));

          ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // --- 2. LIGHT SECTION: CLEAN CORPORATE BLUE SPIDER NETWORK ---
        const maxConnDist = 140;

        // Draw web lines between neighboring particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxConnDist) {
              const alpha = (1 - dist / maxConnDist) * 0.22;
              ctx.strokeStyle = `rgba(${this.lineRgb}, ${alpha})`;
              ctx.lineWidth = 0.95;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw cursor magnetic center when mouse is active over section
        if (mouse.x !== null && mouse.y !== null) {
          ctx.strokeStyle = `rgba(${this.mouseLineRgb}, 0.35)`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = `rgba(${this.mouseLineRgb}, 0.25)`;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Update particle positions and apply Responsive Mouse Magnetic Attraction
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 5) { p.x = 5; p.vx *= -1; }
          if (p.x > width - 5) { p.x = width - 5; p.vx *= -1; }
          if (p.y < 5) { p.y = 5; p.vy *= -1; }
          if (p.y > height - 5) { p.y = height - 5; p.vy *= -1; }

          if (mouse.x !== null && mouse.y !== null) {
            const mdx = mouse.x - p.x;
            const mdy = mouse.y - p.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mdist < mouse.radius && mdist > 2) {
              const mAlpha = (1 - mdist / mouse.radius) * 0.7;
              ctx.strokeStyle = `rgba(${this.mouseLineRgb}, ${mAlpha})`;
              ctx.lineWidth = 1.35;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();

              // Clear visible magnetic pull towards cursor arrow position
              const force = (mouse.radius - mdist) / mouse.radius;
              p.x += (mdx / mdist) * force * 2.8;
              p.y += (mdy / mdist) * force * 2.8;
            }
          }

          ctx.fillStyle = this.dotColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          if (p.hasRing) {
            ctx.strokeStyle = this.ringColor;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius + 5.5, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      this.animId = requestAnimationFrame(() => this.updateAndDraw());
    }
  }

  // Global initializer called on page load and SPA view transitions
  window.initSpiderCanvases = function () {
    const lightSections = document.querySelectorAll('.section-spider-light');

    lightSections.forEach((sec) => {
      if (!sec._spiderCanvasAttached) {
        new SpiderCanvas(sec, false);
        sec._spiderCanvasAttached = true;
      }
    });

    // Dark sections are powered by 3D Tornado Originkit Vortex
    if (window.initVortexBackgrounds) {
      window.initVortexBackgrounds();
    }
  };

  // Run on initial DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initSpiderCanvases);
  } else {
    window.initSpiderCanvases();
  }
})();
