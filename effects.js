/* ===== Study & Work: 3 scroll effects (effects.js) =====
   Load AFTER app.js. Call window.initFx() after every page/route render. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var cleanups = [];
  function on(t, e, f, o) {
    t.addEventListener(e, f, o);
    cleanups.push(function () { t.removeEventListener(e, f, o); });
  }
  function watch(io) { cleanups.push(function () { io.disconnect(); }); }

  /* ---- Headline: words slide in from the right ---- */
  function heading(el) {
    if (!el.dataset.fxDone) {
      el.dataset.fxDone = '1';
      el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w, i) {
        return '<span class="fx-rw" style="transition-delay:' + i * 70 + 'ms">' + w + '</span>';
      }).join(' ');
    }
    if (el.classList.contains('fx-in')) return;
    var io = new IntersectionObserver(function (e, o) {
      if (e[0].isIntersecting) { el.classList.add('fx-in'); o.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el); watch(io);
  }

  /* ---- Smooth Scroll Reveal Engine (Pages scrolling animation) ---- */
  function initScrollReveals() {
    var targets = document.querySelectorAll(
      '.reveal-on-scroll, .section, .service-photo-card, .employer-primary-card, ' +
      '.editorial-knowledge-grid > div, .stats-dominant-wrapper > div, .city-display-card, ' +
      '.internship-editorial-grid > div, .media-spotlight-grid > div, .services-col, ' +
      '.resource-featured-card, .resource-small-card, .stat-box-dominant, .stat-box-secondary'
    );

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(function (el, index) {
      if (!el.classList.contains('reveal-on-scroll')) {
        el.classList.add('reveal-on-scroll');
      }
      var delay = (index % 4) * 0.08;
      el.style.setProperty('--reveal-delay', delay + 's');
      observer.observe(el);
    });

    cleanups.push(function () { observer.disconnect(); });
  }

  /* ---- EFFECT 1: journey cards with Dynamic Left Topic Showcase ---- */
  function journey(sec) {
    var cards = [].slice.call(sec.querySelectorAll('.fx-j-card'));
    if (!cards.length) return;
    var box = sec.querySelector('.fx-dots');
    if (box && !box.children.length) box.innerHTML = cards.map(function () { return '<i></i>'; }).join('');
    var dots = box ? [].slice.call(box.children) : [];

    var stickySide = sec.querySelector('.fx-j-left') || sec.querySelector('.fx-j-right');

    // Topic Showcase Media Presets (Images & highlights)
    var topicPresets = [
      {
        img: "www.studyandwork.com.au/images/home/5.png",
        num: "01",
        tag: "Internship",
        chips: ["12-Week Placement", "Industry Mentors", "85%+ Retention"]
      },
      {
        img: "www.studyandwork.com.au/images/home/7.png",
        num: "02",
        tag: "Job Placement",
        chips: ["Direct Placement", "IT & Business", "VEVO Verified"]
      },
      {
        img: "www.studyandwork.com.au/images/home/8.png",
        num: "03",
        tag: "Casual Jobs",
        chips: ["Flexible Hours", "Student Friendly", "Fair Work Pay"]
      },
      {
        img: "www.studyandwork.com.au/images/home/2.png",
        num: "04",
        tag: "Employer Solutions",
        chips: ["Zero Placement Fee", "12-Week Evaluation", "Full Insurance"]
      },
      {
        img: "www.studyandwork.com.au/images/home/3.png",
        num: "05",
        tag: "Recruitment",
        chips: ["5%-10% Direct Fee", "6-Mo Guarantee", "Fast Matching"]
      }
    ];

    // Ensure .fx-topic-showcase exists on sticky side (image & pictures in topic name area)
    var showcase = stickySide ? stickySide.querySelector('.fx-topic-showcase') : null;
    if (stickySide && !showcase) {
      showcase = document.createElement('div');
      showcase.className = 'fx-topic-showcase';
      showcase.innerHTML = `
        <div class="fx-topic-preview-img-wrap">
          <img class="fx-topic-img" src="${topicPresets[0].img}" alt="Active Topic" loading="lazy">
          <div class="fx-topic-badge-overlay">
            <span class="fx-topic-num-pill">${topicPresets[0].num}</span>
            <span class="fx-topic-status-pill">${topicPresets[0].tag}</span>
          </div>
        </div>
        <div class="fx-topic-details">
          <div class="fx-topic-header-row">
            <span class="fx-topic-category">Active Topic</span>
            <span class="fx-topic-indicator-dot"></span>
          </div>
          <h4 class="fx-topic-display-title"></h4>
          <p class="fx-topic-display-desc"></p>
          <div class="fx-topic-chips"></div>
        </div>
      `;
      stickySide.appendChild(showcase);
    }

    function act(i) {
      var targetIdx = i >= 0 ? i : 0;
      cards.forEach(function (c, k) { c.classList.toggle('fx-on', k === targetIdx); });
      dots.forEach(function (d, k) { d.classList.toggle('fx-on', k === targetIdx); });

      var activeCard = cards[targetIdx];
      if (!activeCard) return;

      var titleEl = activeCard.querySelector('h3, h4');
      var descEl = activeCard.querySelector('p');
      var color = activeCard.style.getPropertyValue('--c') || 'var(--fx-acc)';

      // 1. Update basic topic pill if present
      var topicNameEl = sec.querySelector('.fx-topic-name') || sec.querySelector('#fxActiveTopicName');
      var topicBox = sec.querySelector('.fx-active-topic') || sec.querySelector('#fxActiveTopic');
      if (topicNameEl && titleEl) {
        topicNameEl.textContent = titleEl.textContent.trim();
      }
      if (topicBox) {
        topicBox.style.setProperty('--c', color);
        topicBox.style.borderColor = color;
        topicBox.style.boxShadow = '0 8px 24px -4px ' + color + '40';
      }

      // 2. Update Rich Topic Showcase on Left Side with photos and details
      if (showcase) {
        showcase.style.setProperty('--c', color);
        showcase.style.borderColor = color;
        showcase.style.boxShadow = '0 16px 36px -8px ' + color + '40';

        var preset = topicPresets[targetIdx % topicPresets.length];
        var imgEl = showcase.querySelector('.fx-topic-img');
        var numEl = showcase.querySelector('.fx-topic-num-pill');
        var tagEl = showcase.querySelector('.fx-topic-status-pill');
        var dTitleEl = showcase.querySelector('.fx-topic-display-title');
        var dDescEl = showcase.querySelector('.fx-topic-display-desc');
        var chipsEl = showcase.querySelector('.fx-topic-chips');

        if (imgEl) {
          var targetImg = activeCard.dataset.img || preset.img;
          if (imgEl.src !== targetImg && !imgEl.src.endsWith(targetImg)) {
            imgEl.style.opacity = '0.3';
            setTimeout(function () {
              imgEl.src = targetImg;
              imgEl.style.opacity = '1';
            }, 120);
          }
        }
        if (numEl) numEl.textContent = (targetIdx + 1 < 10 ? '0' : '') + (targetIdx + 1);
        if (tagEl) {
          var smallTag = activeCard.querySelector('small');
          tagEl.textContent = smallTag ? smallTag.textContent.trim() : preset.tag;
          tagEl.style.backgroundColor = color;
        }
        if (dTitleEl && titleEl) dTitleEl.textContent = titleEl.textContent.trim();
        if (dDescEl && descEl) dDescEl.textContent = descEl.textContent.trim();
        if (chipsEl) {
          chipsEl.innerHTML = preset.chips.map(function (c) {
            return '<span class="fx-chip">' + c + '</span>';
          }).join('');
        }
      }
    }

    act(0); // Activate first card initially
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          act(cards.indexOf(e.target));
        }
      });
    }, { rootMargin: '-35% 0px -35% 0px' });
    cards.forEach(function (c) { io.observe(c); });
    watch(io);
  }

  /* ---- EFFECT 2: one auto-moving row, the CENTRE card zooms + glows ----
     Optional attributes on .fx-row: data-fx-speed="40" (px per second) data-fx-dir="right" | "left" */
  function reviews(row) {
    var track = row.querySelector('.fx-track');
    if (!track) return;
    var src = track._fxSrc || (track._fxSrc = track.innerHTML); /* original list, written once */
    var cards = [], setW = 0, x = 0, hov = null, hold = false, raf = 0, last = 0;
    var speed = +(row.dataset.fxSpeed || 40), dir = row.dataset.fxDir === 'left' ? -1 : 1;
    if (reduce) { track.innerHTML = src; return; } /* CSS lets the row scroll by hand */
    function rebuild() {
      track.innerHTML = src;
      var n = track.children.length;
      if (!n) return;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 26;
      setW = track.scrollWidth + gap; /* width of ONE full set of reviews */
      var copies = Math.max(2, Math.ceil((row.clientWidth + setW * 2) / setW));
      var html = ''; for (var i = 0; i < copies; i++) html += src;
      track.innerHTML = html;
      cards = [].slice.call(track.children);
      cards.forEach(function (c, i) { if (i >= n) c.setAttribute('aria-hidden', 'true'); });
      hov = null; x = x % setW; apply();
    }
    function apply() {
      if (!cards.length) return;
      var half = row.clientWidth / 2, tx = -setW + x;
      track.style.transform = 'translate3d(' + tx + 'px,0,0)';
      cards.forEach(function (c) {
        var cx = c.offsetLeft + c.offsetWidth / 2 + tx;
        var d = Math.min(1, Math.abs(cx - half) / (c.offsetWidth * 1.1));
        if (hov) d = c === hov ? 0 : Math.max(d, 0.75);
        var e = d * d * (3 - 2 * d); /* smooth curve: centre = 0, far = 1 */
        c.style.transform = 'scale(' + (1.12 - 0.24 * e).toFixed(3) + ')';
        c.style.opacity = (1 - 0.55 * e).toFixed(3);
        c.classList.toggle('fx-focus', d < 0.3);
      });
    }
    function tick(t) {
      var paused = hold || !!hov;
      if (!paused) {
        var dt = Math.min(0.05, (t - last) / 1000);
        x = (x + dir * speed * dt) % setW; if (x < 0) x += setW;
      }
      last = t; apply();
      raf = requestAnimationFrame(tick);
    }
    /* hover: pause and zoom the hovered card; leaving: continue */
    on(track, 'pointerover', function (e) {
      var c = e.target.closest && e.target.closest('.fx-rcard');
      if (c) hov = c;
    });
    on(row, 'pointerleave', function () { hov = null; });
    on(row, 'click', function () { hold = !hold; }); /* tap = pause / play on touch screens */
    on(window, 'resize', rebuild);
    var io = new IntersectionObserver(function (es) { /* only animate while visible */
      if (es[0].isIntersecting) {
        if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
      } else {
        cancelAnimationFrame(raf); raf = 0;
      }
    });
    io.observe(row);
    cleanups.push(function () { io.disconnect(); cancelAnimationFrame(raf); raf = 0; });
    rebuild();
  }

  /* ---- EFFECT 3: winding line path ---- */
  function path(sec) {
    var map = sec.querySelector('.fx-map');
    if (!map) return;
    var steps = [].slice.call(map.querySelectorAll('.fx-step'));
    if (steps.length < 2) return;
    var old = map.querySelector('svg.fx-svg'); if (old) old.remove();
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'fx-svg');
    var base = document.createElementNS(NS, 'path'); base.setAttribute('class', 'fx-base');
    var line = document.createElementNS(NS, 'path'); line.setAttribute('class', 'fx-line');
    var dot = document.createElementNS(NS, 'circle'); dot.setAttribute('class', 'fx-dot');
    dot.setAttribute('r', 8);
    svg.appendChild(base); svg.appendChild(line); svg.appendChild(dot); map.insertBefore(svg, map.firstChild);
    var pts = [], lens = [], total = 0;
    function build() {
      var W = map.clientWidth;
      if (!W || W < 50) {
        setTimeout(build, 50);
        return;
      }
      var gap = innerWidth < 700 ? 220 : 260, top = 110;
      map.style.height = (top * 2 + gap * (steps.length - 1)) + 'px';
      pts = steps.map(function (_, i) { return [W * (i % 2 ? 0.74 : 0.26), top + i * gap]; });
      var d = 'M' + pts[0][0] + ' ' + pts[0][1]; lens = [0];
      for (var k = 1; k < pts.length; k++) {
        var a = pts[k - 1], b = pts[k], m = a[1] + (b[1] - a[1]) / 2;
        d += ' C' + a[0] + ' ' + m + ' ' + b[0] + ' ' + m + ' ' + b[0] + ' ' + b[1];
        line.setAttribute('d', d); lens.push(line.getTotalLength());
      }
      base.setAttribute('d', d);
      total = lens[lens.length - 1];
      line.style.strokeDasharray = total;
      steps.forEach(function (s, i) { s.style.left = pts[i][0] + 'px'; s.style.top = pts[i][1] + 'px'; });
      update();
    }
    function update() {
      if (!total) return;
      if (reduce) {
        line.style.strokeDashoffset = 0; dot.style.opacity = 0;
        steps.forEach(function (s) { s.classList.add('fx-on'); });
        return;
      }
      var y = innerHeight * 0.62 - map.getBoundingClientRect().top, L = 0;
      if (y > pts[0][1]) {
        var k = 0;
        while (k < pts.length - 1 && pts[k + 1][1] <= y) k++;
        L = k >= pts.length - 1 ? total
          : lens[k] + (y - pts[k][1]) / (pts[k + 1][1] - pts[k][1]) * (lens[k + 1] - lens[k]);
      }
      L = Math.max(0, Math.min(total, L));
      line.style.strokeDashoffset = total - L;
      try {
        var q = line.getPointAtLength(L || 0);
        dot.setAttribute('cx', q.x); dot.setAttribute('cy', q.y);
        dot.style.opacity = L > 1 ? 1 : 0;
      } catch (err) {}
      steps.forEach(function (s, i) {
        s.classList.toggle('fx-on', i ? L >= lens[i] - 40 : y >= pts[0][1] - 120);
      });
    }
    on(window, 'scroll', update, { passive: true });
    on(window, 'resize', build);
    build();
  }
  function destroy() { cleanups.forEach(function (f) { f(); }); cleanups = []; }
  function init() {
    destroy();
    initScrollReveals();
    document.querySelectorAll('[data-fx-heading]').forEach(heading);
    document.querySelectorAll('.fx-journey').forEach(journey);
    document.querySelectorAll('.fx-row').forEach(reviews);
    document.querySelectorAll('.fx-path').forEach(path);
  }
  window.initFx = init;
  window.destroyFx = destroy;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
