(function () {
  var REST = 60, SHRINK = 0.08, DIM = 0.45, RADIUS = 28, LIFT = 4; /* tune these */
  var state = null;
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };

  function destroy() {
    if (!state) return;
    removeEventListener('scroll', state.update);
    removeEventListener('resize', state.layout);
    if (state.ro) state.ro.disconnect();
    state.gaps.forEach(function (g) { g.remove(); });
    state.slides.forEach(function (s) {
      s.classList.remove('slide');
      s.style.cssText = s.dataset.stackStyle || '';
    });
    state.root.classList.remove('stack');
    state = null;
  }

  function opaque(s) { /* a see-through section would show the one behind it */
    var cs = getComputedStyle(s), c = cs.backgroundColor.match(/[\d.]+/g) || [];
    var clear = cs.backgroundColor === 'transparent' || (c.length === 4 && +c[3] === 0);
    if (clear && cs.backgroundImage === 'none') s.style.backgroundColor = getComputedStyle(document.body).backgroundColor;
  }

  window.initStack = function (root) {
    destroy();
    if (!root || reduce) return;
    var slides = [].filter.call(root.children, function (el) {
      return !el.matches('script,style,link,.stack-gap,.subnav-sticky-bar') && el.offsetHeight > 0;
    });
    if (slides.length < 2) return;
    root.classList.add('stack');
    var gaps = [];
    slides.forEach(function (s, i) {
      s.dataset.stackStyle = s.getAttribute('style') || '';
      s.classList.add('slide');
      s.style.zIndex = i + 1;
      opaque(s);
      if (i < slides.length - 1) {
        var g = document.createElement('div');
        g.className = 'stack-gap';
        s.after(g);
        gaps.push(g);
      }
    });

    function layout() {
      var vh = innerHeight;
      slides.forEach(function (s, i) {
        s.style.top = Math.min(0, vh - s.offsetHeight) + 'px';
        if (gaps[i]) gaps[i].style.height = (s.offsetHeight <= vh + 2 ? vh * REST / 100 : 0) + 'px';
      });
      update();
    }

    function update() {
      var vh = innerHeight, y = scrollY, m = innerWidth < 768 ? 0.5 : 1;
      slides.forEach(function (s, i) {
        var g = gaps[i];
        if (!g) return;
        var p = clamp((y + vh - (g.offsetTop + g.offsetHeight)) / vh);
        s.style.transform = 'scale(' + (1 - SHRINK * m * p) + ') translateY(' + (-LIFT * p) + 'vh)';
        s.style.filter = p ? 'brightness(' + (1 - DIM * p) + ')' : '';
        s.style.borderRadius = (i === 0 && !p) ? '0' : RADIUS + 'px ' + RADIUS + 'px ' + (RADIUS * p) + 'px ' + (RADIUS * p) + 'px';
      });
    }

    var ro = window.ResizeObserver ? new ResizeObserver(layout) : null;
    if (ro) slides.forEach(function (s) { ro.observe(s); });
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', layout);
    state = { root: root, slides: slides, gaps: gaps, update: update, layout: layout, ro: ro };
    layout();
  };
  window.destroyStack = destroy;
})();
