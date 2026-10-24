/* ==========================================================================
   STUDY & WORK AUSTRALIA — 2026 MULTI-PAGE ROUTING & PRODUCTION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initModalHandlers();
  initRouter();
  initVideoPlayers();
  if (window.initCursorRingFields) {
    window.initCursorRingFields();
  }
  if (window.initSpiderCanvases) {
    window.initSpiderCanvases();
  }
  if (window.initVortexBackgrounds) {
    window.initVortexBackgrounds();
  }
  if (window.initParticleDrift) {
    window.initParticleDrift();
  }
  if (window.initFx) {
    window.initFx();
  }
  if (window.initSolutions) {
    window.initSolutions();
  }
});

/* --------------------------------------------------------------------------
   1. NAVIGATION & SCROLL HANDLERS
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const floatingLogo = document.querySelector('.site-floating-logo');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 35) {
      if (header) header.classList.add('scrolled');
      if (floatingLogo) floatingLogo.classList.add('scrolled');
    } else {
      if (header) header.classList.remove('scrolled');
      if (floatingLogo) floatingLogo.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. VIDEO PLAYER BUILDER (HTML5 CONTROLS, UNRESTRICTED SEEKING)
   -------------------------------------------------------------------------- */
function renderVideoPlayer(src, title, duration, isContactStretched = false, poster = '') {
  const cleanSrc = src.startsWith('/') ? src : '/' + src;
  const rawSrc = src.replace(/^\//, '');
  const vidId = 'vid_' + Math.random().toString(36).substring(2, 9);
  const posterAttr = poster ? `poster="${poster}"` : '';
  return `
    <div class="video-player-box ${isContactStretched ? 'contact-video-stretched' : ''}" style="position: relative; border-radius: 1.25rem; overflow: hidden; background: #000; box-shadow: var(--shadow-card); ${isContactStretched ? 'margin: 0; flex: 1; display: flex; flex-direction: column; height: 100%;' : 'margin: 1.75rem 0;'}">
      ${duration ? `<div class="video-meta-badge" style="position: absolute; top: 1rem; right: 1rem; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); color: #fff; padding: 0.35rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; z-index: 5; pointer-events: none;">Duration: ${duration}</div>` : ''}
      <video id="${vidId}" src="${cleanSrc}#t=0.001" ${posterAttr} controls preload="metadata" playsinline class="custom-html5-player" style="width: 100%; border-radius: 1.25rem 1.25rem 0 0; background: #000; display: block; ${isContactStretched ? 'flex: 1; min-height: 680px; max-height: none; object-fit: contain;' : ''}">
        <source src="${cleanSrc}" type="video/mp4">
        <source src="${rawSrc}" type="video/mp4">
        <source src="/our_alumni.mp4" type="video/mp4">
        <source src="/www.studyandwork.com.au/video/${rawSrc}" type="video/mp4">
        Your browser does not support HTML5 video playback. <a href="${cleanSrc}" target="_blank" style="color: var(--color-accent-blue); text-decoration: underline;">Download video file (${title})</a>
      </video>
      <div class="video-playback-toolbar" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem; background: rgba(15, 23, 42, 0.96); border-top: 1px solid rgba(255, 255, 255, 0.12); gap: 0.75rem; flex-shrink: 0;">
        <div style="font-size: 0.75rem; color: #94A3B8; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${title || 'Australian Career Video'}
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-shrink: 0;">
          <button type="button" onclick="(function(){ const v = document.getElementById('${vidId}'); if(v) { if(v.paused) v.play(); else v.pause(); } })()" style="background: rgba(56, 189, 248, 0.2); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.4); padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s;" title="Play / Pause Video">&#9654; Play / Pause</button>
          <button type="button" onclick="(function(){ const v = document.getElementById('${vidId}'); if(v) { v.currentTime = Math.max(0, v.currentTime - 10); } })()" style="background: rgba(255, 255, 255, 0.12); color: #F8FAFC; border: 1px solid rgba(255, 255, 255, 0.2); padding: 0.3rem 0.65rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s;" title="Rewind 10 seconds">&#9194; -10s</button>
          <button type="button" onclick="(function(){ const v = document.getElementById('${vidId}'); if(v) { v.currentTime = Math.min(v.duration || 99999, v.currentTime + 10); } })()" style="background: rgba(255, 255, 255, 0.12); color: #F8FAFC; border: 1px solid rgba(255, 255, 255, 0.2); padding: 0.3rem 0.65rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s;" title="Forward 10 seconds">+10s &#9193;</button>
        </div>
      </div>
    </div>
  `;
}

function initVideoPlayers() {
  document.querySelectorAll('video.custom-html5-player').forEach(v => {
    if (!v.getAttribute('poster')) {
      v.addEventListener('loadedmetadata', function () {
        if (this.currentTime === 0) {
          try { this.currentTime = 0.001; } catch (e) { }
        }
      }, { once: true });
    }
    try {
      if (v.readyState < 1) {
        v.load();
      }
    } catch (e) { }
  });
}

/* --------------------------------------------------------------------------
   2.1 SOME OF OUR SERVICES BUILDER (MATCHING IMAGE 3 PHOTO SHOWCASE)
   -------------------------------------------------------------------------- */
function renderServicesShowcaseSection() {
  return `
    <!-- SOME OF OUR SERVICES — SHOWCASE WITH PHOTO ZOOM (MATCHING IMAGE 3) -->
    <section id="services" class="section section-spider-light services-showcase-section">
      <div class="container">
        <div class="services-header-wrap">
          <span class="badge-tag services-badge">Comprehensive Solutions</span>
          <h2 class="services-main-title">SOME OF OUR SERVICES</h2>
          <p class="lead-text services-sublead">Dedicated recruitment, placement, and training pathways tailored for student career success and corporate hiring demand.</p>
        </div>

        <div class="services-columns-grid">
          <!-- COLUMN 1: JOBSEEKERS -->
          <div class="services-col services-col-jobseekers">
            <div class="services-col-header">
              <h3 class="services-col-title jobseekers-title">JOBSEEKERS</h3>
              <div class="services-col-line jobseekers-line"></div>
            </div>

            <div class="services-cards-grid">
              <!-- Card 1: Internships -->
              <a href="/internship" data-link class="service-photo-card">
                <div class="service-photo-media">
                  <img src="/www.studyandwork.com.au/images/home/5.png" alt="Internships" loading="lazy" onerror="this.onerror=null; this.src='www.studyandwork.com.au/images/home/5.png'">
                  <div class="service-photo-overlay"></div>
                </div>
                <div class="service-photo-info">
                  <h4 class="service-photo-title">Internships</h4>
                  <p class="service-photo-desc">Gain study-related work experience and prove your worth to secure a job</p>
                </div>
              </a>

              <!-- Card 2: Casual Jobs -->
              <a href="/casual-jobs" data-link class="service-photo-card">
                <div class="service-photo-media">
                  <img src="/www.studyandwork.com.au/images/home/8.png" alt="Casual Jobs" loading="lazy" onerror="this.onerror=null; this.src='www.studyandwork.com.au/images/home/8.png'">
                  <div class="service-photo-overlay"></div>
                </div>
                <div class="service-photo-info">
                  <h4 class="service-photo-title">Casual Jobs</h4>
                  <p class="service-photo-desc">Student-friendly jobs for survival and extra pocket money</p>
                </div>
              </a>

              <!-- Card 3: Professional Jobs -->
              <a href="/job-placement" data-link class="service-photo-card">
                <div class="service-photo-media">
                  <img src="/www.studyandwork.com.au/images/home/7.png" alt="Professional Jobs" loading="lazy" onerror="this.onerror=null; this.src='www.studyandwork.com.au/images/home/7.png'">
                  <div class="service-photo-overlay"></div>
                </div>
                <div class="service-photo-info">
                  <h4 class="service-photo-title">Professional Jobs</h4>
                  <p class="service-photo-desc">Entry-level jobs, graduate placement programs, and jobs in your field of study</p>
                </div>
              </a>

              <!-- Card 4: Apprenticeships -->
              <a href="/apprenticeship" data-link class="service-photo-card">
                <div class="service-photo-media">
                  <img src="/www.studyandwork.com.au/images/home/6.png" alt="Apprenticeships" loading="lazy" onerror="this.onerror=null; this.src='www.studyandwork.com.au/images/home/6.png'">
                  <div class="service-photo-overlay"></div>
                </div>
                <div class="service-photo-info">
                  <h4 class="service-photo-title">Apprenticeships</h4>
                  <p class="service-photo-desc">Earn while you learn and benefit from the government incentives</p>
                </div>
              </a>
            </div>
          </div>

          <!-- COLUMN 2: EMPLOYERS -->
          <div class="services-col services-col-employers">
            <div class="services-col-header">
              <h3 class="services-col-title employers-title">EMPLOYERS</h3>
              <div class="services-col-line employers-line"></div>
            </div>

            <div class="services-cards-grid">
              <!-- Card 1: Hire a Casual Staff -->
              <a href="/casual-staffing" data-link class="service-photo-card">
                <div class="service-photo-media">
                  <img src="/www.studyandwork.com.au/images/home/4.png" alt="Hire a Casual Staff" loading="lazy" onerror="this.onerror=null; this.src='www.studyandwork.com.au/images/home/4.png'">
                  <div class="service-photo-overlay"></div>
                </div>
                <div class="service-photo-info">
                  <h4 class="service-photo-title">Hire a Casual Staff</h4>
                  <p class="service-photo-desc">Hardworking and flexible staff for urgent requirements - fast &amp; affordable</p>
                </div>
              </a>

              <!-- Card 2: Hire a Professional -->
              <a href="/staffing" data-link class="service-photo-card">
                <div class="service-photo-media">
                  <img src="/www.studyandwork.com.au/images/home/3.png" alt="Hire a Professional" loading="lazy" onerror="this.onerror=null; this.src='www.studyandwork.com.au/images/home/3.png'">
                  <div class="service-photo-overlay"></div>
                </div>
                <div class="service-photo-info">
                  <h4 class="service-photo-title">Hire a Professional</h4>
                  <p class="service-photo-desc">Benefit from the lowest recruitment fee and the highest replacement guarantee in the industry</p>
                </div>
              </a>

              <!-- Card 3: Hire an Apprentice -->
              <a href="/employers#apprentice" data-link class="service-photo-card">
                <div class="service-photo-media">
                  <img src="/www.studyandwork.com.au/images/home/1.png" alt="Hire an Apprentice" loading="lazy" onerror="this.onerror=null; this.src='www.studyandwork.com.au/images/home/1.png'">
                  <div class="service-photo-overlay"></div>
                </div>
                <div class="service-photo-info">
                  <h4 class="service-photo-title">Hire an Apprentice</h4>
                  <p class="service-photo-desc">Benefit from affordable wages and government incentives</p>
                </div>
              </a>

              <!-- Card 4: Host an Intern -->
              <a href="/employers#internship" data-link class="service-photo-card">
                <div class="service-photo-media">
                  <img src="/www.studyandwork.com.au/images/home/2.png" alt="Host an Intern" loading="lazy" onerror="this.onerror=null; this.src='www.studyandwork.com.au/images/home/2.png'">
                  <div class="service-photo-overlay"></div>
                </div>
                <div class="service-photo-info">
                  <h4 class="service-photo-title">Host an Intern</h4>
                  <p class="service-photo-desc">Try before you hire and reduce your hiring risks while changing lives</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* --------------------------------------------------------------------------
   3. CLIENT-SIDE ROUTER ENGINE
   -------------------------------------------------------------------------- */
function initRouter() {
  // Global click delegator for links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (link) {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
        e.preventDefault();
        navigateTo(href);
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
      }
    }
  });

  window.addEventListener('popstate', () => {
    renderCurrentRoute();
  });

  // Initial Route Render
  renderCurrentRoute();
}

function parseUrlParts(url) {
  let raw = url || (window.location.pathname + window.location.hash);
  let [pathPart, hashPart] = raw.split('#');
  pathPart = (pathPart || window.location.pathname).toLowerCase().replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (pathPart.length > 1 && pathPart.endsWith('/')) {
    pathPart = pathPart.slice(0, -1);
  }
  return {
    path: pathPart || '/',
    hash: hashPart ? hashPart.trim() : ''
  };
}

function scrollToAnchor(hashId) {
  if (!hashId) return;
  const cleanId = hashId.replace(/^#/, '');
  const el = document.getElementById(cleanId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateActiveSubnavPill(cleanId);
  }
}

function updateActiveSubnavPill(activeId) {
  const pills = document.querySelectorAll('.subnav-pill-btn');
  pills.forEach(pill => {
    const href = pill.getAttribute('href') || '';
    if (href.endsWith('#' + activeId)) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
}

function initSubnavScrollSpy() {
  const subnav = document.querySelector('.subnav-sticky-bar');
  if (!subnav) return;

  const pillButtons = subnav.querySelectorAll('.subnav-pill-btn');
  const sections = [];

  pillButtons.forEach(btn => {
    const href = btn.getAttribute('href') || '';
    const hash = href.split('#')[1];
    if (hash) {
      const sectionEl = document.getElementById(hash);
      if (sectionEl) {
        sections.push({ id: hash, btn: btn, el: sectionEl });
      }
    }
  });

  if (!sections.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 200;
    let currentId = sections[0].id;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].el.offsetTop <= scrollPos) {
        currentId = sections[i].id;
      }
    }
    pillButtons.forEach(btn => {
      const href = btn.getAttribute('href') || '';
      if (href.endsWith('#' + currentId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  if (window._subnavScrollSpyHandler) {
    window.removeEventListener('scroll', window._subnavScrollSpyHandler);
  }
  window._subnavScrollSpyHandler = onScroll;
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function navigateTo(url, pushState = true) {
  const { path: targetPath, hash: targetHash } = parseUrlParts(url);
  const currentPath = window.location.pathname.toLowerCase().replace(/\/index\.html$/, '/').replace(/\.html$/, '') || '/';

  if (pushState) {
    history.pushState(null, '', url);
  }

  // Check if we are staying on the same unified view and only scrolling to an anchor
  const isCandidates = (currentPath === '/candidates' && (targetPath === '/candidates' || targetPath === ''));
  const isEmployers = (currentPath === '/employers' && (targetPath === '/employers' || targetPath === ''));
  const isResources = (currentPath === '/resources' && (targetPath === '/resources' || targetPath === ''));

  if ((isCandidates || isEmployers || isResources) && targetHash) {
    scrollToAnchor(targetHash);
    return;
  }

  renderCurrentRoute();

  if (targetHash) {
    setTimeout(() => {
      scrollToAnchor(targetHash);
    }, 60);
    setTimeout(() => {
      scrollToAnchor(targetHash);
    }, 180);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function updateActiveNavLinks(routePath) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const route = link.getAttribute('data-route') || link.getAttribute('href');
    if (!route) return;
    const normRoute = route.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    let normCurrent = routePath.replace(/\.html$/, '').replace(/\/$/, '') || '/';

    // Map all legacy subroutes to main navigation headers
    if (['/internship', '/job-placement', '/apprenticeship', '/casual-jobs', '/know-your-rights', '/alumni'].includes(normCurrent)) {
      normCurrent = '/candidates';
    } else if (['/staffing', '/casual-staffing'].includes(normCurrent)) {
      normCurrent = '/employers';
    } else if (normCurrent.startsWith('/resources')) {
      normCurrent = '/resources';
    }

    if (normRoute === normCurrent || (normRoute !== '/' && normCurrent.startsWith(normRoute))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function renderCurrentRoute() {
  const { path, hash } = parseUrlParts();
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) return;

  updateActiveNavLinks(path);

  let targetSectionHash = hash;

  if (path === '/' || path === '/explore') {
    renderHomeView(mainContent);
  } else if (path === '/candidates') {
    renderCandidatesView(mainContent);
  } else if (path === '/employers') {
    renderEmployersView(mainContent);
  } else if (path === '/education-providers') {
    renderEducationProvidersView(mainContent);
  } else if (path === '/resources') {
    renderResourcesView(mainContent);
  } else if (path === '/about') {
    renderAboutView(mainContent);
  } else if (path === '/contact') {
    renderContactView(mainContent);
  } else if (path === '/internship') {
    renderCandidatesView(mainContent);
    targetSectionHash = 'internship';
  } else if (path === '/job-placement') {
    renderCandidatesView(mainContent);
    targetSectionHash = 'job-placement';
  } else if (path === '/apprenticeship') {
    renderCandidatesView(mainContent);
    targetSectionHash = 'apprenticeship';
  } else if (path === '/casual-jobs') {
    renderCandidatesView(mainContent);
    targetSectionHash = 'casual-jobs';
  } else if (path === '/know-your-rights') {
    renderCandidatesView(mainContent);
    targetSectionHash = 'know-your-rights';
  } else if (path === '/our-alumni' || path === '/alumni' || path === '/alumni-directory') {
    renderAlumniView(mainContent);
  } else if (path === '/staffing') {
    renderEmployersView(mainContent);
    targetSectionHash = 'professional-staffing';
  } else if (path === '/casual-staffing') {
    renderEmployersView(mainContent);
    targetSectionHash = 'casual-staffing';
  } else if (path === '/resources/skilled-migrants-deserve-a-fair-go') {
    renderResourcesView(mainContent);
    targetSectionHash = 'skilled-migrants';
  } else if (path === '/resources/invest-in-emerging-talent-for-the-maximum-roi') {
    renderResourcesView(mainContent);
    targetSectionHash = 'employer-roi';
  } else {
    // Default fallback to home if unknown route
    renderHomeView(mainContent);
  }

  // Re-initialize dynamic widgets for rendered view
  initAlumniSearch();
  initVideoPlayers();
  initCityTabs();
  initJourneyProgressStepper();
  initSubnavScrollSpy();
  if (window.initCursorRingFields) {
    window.initCursorRingFields();
  }
  if (window.initSpiderCanvases) {
    window.initSpiderCanvases();
  }
  if (window.initVortexBackgrounds) {
    window.initVortexBackgrounds();
  }
  if (window.initParticleDrift) {
    window.initParticleDrift();
  }
  if (window.initFx) {
    window.initFx();
  }

  if (!targetSectionHash) {
    window.scrollTo(0, 0);
  }

  if (targetSectionHash) {
    setTimeout(() => {
      scrollToAnchor(targetSectionHash);
    }, 70);
  }
}

/* --------------------------------------------------------------------------
   4. DEDICATED ROUTE VIEW RENDERERS
   -------------------------------------------------------------------------- */

// --- 4.1 HOMEPAGE VIEW (OVERVIEW + ENTRY POINTS) ---
function renderHomeView(container) {
  container.innerHTML = `
    <!-- CINEMATIC BRAND HERO SECTION WITH BACKGROUND VIDEO -->
    <section id="explore" class="hero-section cinematic-hero">
      <!-- Background Video (Layer 1) -->
      <video class="hero-bg-video" autoplay loop muted playsinline preload="auto" poster="candidates_hero_bg.jpg">
        <source src="Creating_Australian_career_video.mp4" type="video/mp4">
        <source src="/Creating_Australian_career_video.mp4" type="video/mp4">
        <source src="www.studyandwork.com.au/video/Creating_Australian_career_video.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>

      <!-- Gradient Dark Readability Overlay (Layer 2) -->
      <div class="hero-gradient-overlay"></div>

      <!-- Hero Content Container (Layer 4) -->
      <div class="container hero-container">
        <div class="hero-grid">
          <!-- Left Side: Core Study & Work Hero Content + Stats Under CTAs -->
          <div class="hero-content">
            <span class="badge-tag hero-badge">AUSTRALIA'S PREMIER CAREER PLATFORM</span>
            <h1 class="display-hero hero-title">Turn Your Potential Into an Australian Career.</h1>
            <p class="lead-text hero-lead">
              Study. Gain experience. Connect with industry. Build a career that moves forward.
            </p>
            <div class="hero-cta-group">
              <a href="/candidates" data-link class="btn btn-primary btn-hero-primary">Explore Candidate Opportunities &rarr;</a>
              <a href="/employers" data-link class="btn btn-secondary btn-hero-secondary">I'm an Employer</a>
            </div>

            <!-- 3 STAT BADGES PLACED DIRECTLY UNDER THE 2 CTA BUTTONS -->
            <div class="hero-stats-under-cta">
              <div class="hero-stat-card">
                <div class="stat-icon">&#127891;</div>
                <div>
                  <div class="stat-number">8,000+</div>
                  <div class="stat-label">Candidates Placed</div>
                </div>
              </div>

              <div class="hero-stat-card">
                <div class="stat-icon">&#127970;</div>
                <div>
                  <div class="stat-number">3,000+</div>
                  <div class="stat-label">Host Businesses</div>
                </div>
              </div>

              <div class="hero-stat-card">
                <div class="stat-icon">&#128197;</div>
                <div>
                  <div class="stat-number">2007</div>
                  <div class="stat-label">Established in Australia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PATHWAYS OVERVIEW SECTION — SCROLL EFFECT 1 (HEADLINE LEFT STICKY, CARDS RIGHT SCROLL) -->
    <section class="fx-journey fx-light section-spider-light">
      <div class="fx-j-left">
        <span class="badge-tag" style="width: fit-content; margin-bottom: 1.25rem;">Personalised Pathways</span>
        <h2 data-fx-heading class="heading-1" style="font-size: clamp(2rem, 3.2vw, 3rem); line-height: 1.15; margin-bottom: 1rem; color: #0B192C;">Where are you in your journey?</h2>
        <p class="lead-text" style="font-size: 1.05rem; line-height: 1.6; color: #475569; max-width: 440px; margin-bottom: 0;">Explore dedicated entry points designed specifically for candidate aspirations and employer hiring demands.</p>
        <div class="fx-dots"></div>
        <div class="fx-active-topic" id="fxActiveTopic">
          <div class="fx-topic-name" id="fxActiveTopicName">Professional Internship</div>
        </div>

        <!-- DYNAMIC TOPIC SHOWCASE CARD (NO LONGER EMPTY ON LEFT) -->
        <div class="fx-topic-showcase" id="fxTopicShowcase">
          <div class="fx-topic-preview-img-wrap">
            <img id="fxTopicPreviewImg" class="fx-topic-img" src="www.studyandwork.com.au/images/home/5.png" alt="Topic Preview" loading="lazy">
            <div class="fx-topic-badge-overlay">
              <span class="fx-topic-num-pill" id="fxTopicNum">01</span>
              <span class="fx-topic-status-pill" id="fxTopicStatus">Internship</span>
            </div>
          </div>
          <div class="fx-topic-details">
            <div class="fx-topic-header-row">
              <span class="fx-topic-category">Active Pathway</span>
              <span class="fx-topic-indicator-dot"></span>
            </div>
            <h4 class="fx-topic-display-title" id="fxTopicTitle">Professional Internship</h4>
            <p class="fx-topic-display-desc" id="fxTopicDesc">12-week structured placement in Australian host companies aligned with your university qualification.</p>
            <div class="fx-topic-chips" id="fxTopicChips">
              <span class="fx-chip">12-Week Placement</span>
              <span class="fx-chip">Industry Mentors</span>
              <span class="fx-chip">85%+ Retention</span>
            </div>
          </div>
        </div>
      </div>

      <div class="fx-j-list">
        <div class="fx-j-card" style="--c:#0284C7" data-img="www.studyandwork.com.au/images/home/5.png">
          <small>01 Internship</small>
          <h3>Professional Internship</h3>
          <p>12-week structured placement in Australian host companies aligned with your university qualification.</p>
          <a href="/internship" data-link>Explore Internship &rarr;</a>
        </div>

        <div class="fx-j-card" style="--c:#10B981" data-img="www.studyandwork.com.au/images/home/7.png">
          <small>02 Job Placement</small>
          <h3>Graduate Jobs</h3>
          <p>Direct recruitment and permanent career placement across IT, Accounting, Engineering, and Business.</p>
          <a href="/job-placement" data-link>Graduate Opportunities &rarr;</a>
        </div>

        <div class="fx-j-card" style="--c:#F59E0B" data-img="www.studyandwork.com.au/images/home/8.png">
          <small>03 Casual Jobs</small>
          <h3>Casual Student Jobs</h3>
          <p>Flexible employment opportunities designed to support international student living expenses.</p>
          <a href="/casual-jobs" data-link>Explore Student Jobs &rarr;</a>
        </div>

        <div class="fx-j-card" style="--c:#0284C7" data-img="www.studyandwork.com.au/images/home/2.png">
          <small>04 Employer Solutions</small>
          <h3>Host an Intern (12 Weeks Zero Cost)</h3>
          <p>Evaluate enthusiastic university graduates for 12 weeks at zero placement fee before extending a job offer.</p>
          <a href="/employers" data-link>Host an Intern &rarr;</a>
        </div>

        <div class="fx-j-card" style="--c:#8B5CF6" data-img="www.studyandwork.com.au/images/home/3.png">
          <small>05 Direct Recruitment</small>
          <h3>Permanent &amp; Casual Staffing</h3>
          <p>5%-10% permanent placement fee with 6-month replacement guarantee, or flexible 65% markup casual staffing.</p>
          <a href="/staffing" data-link>Explore Staffing &rarr;</a>
        </div>
      </div>
    </section>

    ${renderServicesShowcaseSection()}

    <!-- SIGNATURE CAREER PATHWAY — SCROLL EFFECT 3 (PARTICLE DRIFT 3 ORIGINKIT BACKGROUND) -->
    <section id="journey" class="fx-path section section-particle-drift">
      <div class="fx-p-left">
        <span class="badge-tag" style="width: fit-content; margin-bottom: 1.25rem;">End-to-End Progression</span>
        <h2 data-fx-heading class="heading-1" style="font-size: clamp(2rem, 3.2vw, 3rem); line-height: 1.15; margin-bottom: 1rem; color: #FFFFFF;">Your Australian Career Pathway</h2>
        <p class="lead-text" style="font-size: 1.05rem; line-height: 1.6; color: #94A3B8; max-width: 440px; margin-bottom: 0;">A structured 7-stage framework guiding candidates from education to long-term career growth.</p>

        <!-- ANIMATED CAREER PROGRESSION SHOWCASE (FILLS EMPTY LEFT SPACE - IMAGE 3 USER DIRECTIVE) -->
        <div class="career-pathway-graphic-box">
          <div class="pathway-radar-badge">
            <span class="live-pulse-dot"></span>
            <span>AUSTRALIA ACCELERATOR ACTIVE</span>
          </div>
          
          <div class="pathway-visual-flow">
            <div class="path-node">
              <div class="node-ring"><div class="node-core">&#127891;</div></div>
              <div class="node-info">
                <strong>1. Degree &amp; Skills Audit</strong>
                <span>University Qualification Evaluation</span>
              </div>
            </div>
            <div class="path-connector-line"><div class="flow-light"></div></div>
            <div class="path-node">
              <div class="node-ring"><div class="node-core">&#128188;</div></div>
              <div class="node-info">
                <strong>2. 12-Wk Host Internship</strong>
                <span>Zero-Risk Placement &amp; Mentorship</span>
              </div>
            </div>
            <div class="path-connector-line"><div class="flow-light"></div></div>
            <div class="path-node">
              <div class="node-ring"><div class="node-core">&#128640;</div></div>
              <div class="node-info">
                <strong>3. Permanent Career Offer</strong>
                <span>85%+ Conversion Rate to Full-Time</span>
              </div>
            </div>
          </div>

          <div class="pathway-highlight-stats">
            <div class="stat-mini">
              <div class="num">8,000+</div>
              <div class="lbl">Placed Since 2007</div>
            </div>
            <div class="stat-mini">
              <div class="num">3,000+</div>
              <div class="lbl">Host Partners</div>
            </div>
            <div class="stat-mini">
              <div class="num">100%</div>
              <div class="lbl">Fair Work Safe</div>
            </div>
          </div>

          <div class="pathway-floating-pill">
            <span class="pill-icon">&#127462;&#127482;</span>
            <span>Sydney &bull; Melbourne &bull; Brisbane &bull; Perth &bull; Adelaide</span>
          </div>
        </div>
      </div>

      <div class="fx-map">
        <div class="fx-step"><div class="num">1</div><h3>Discover</h3><p>Skills Audit</p></div>
        <div class="fx-step"><div class="num">2</div><h3>Study</h3><p>University Degree</p></div>
        <div class="fx-step"><div class="num">3</div><h3>Prepare</h3><p>Resume &amp; Coaching</p></div>
        <div class="fx-step"><div class="num">4</div><h3>Experience</h3><p>12-Wk Internship</p></div>
        <div class="fx-step"><div class="num">5</div><h3>Connect</h3><p>3,000+ Employers</p></div>
        <div class="fx-step"><div class="num">6</div><h3>Get Hired</h3><p>Paid Job Offer</p></div>
        <div class="fx-step"><div class="num">7</div><h3>Grow</h3><p>Visa &amp; Leadership</p></div>
      </div>
    </section>

    <!-- VIDEO SPOTLIGHT SECTION (LEFT VIDEO + RIGHT TEXT - CYCLONE BACKGROUND) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <!-- LEFT SIDE VIDEO (CLEAN PLAYER WITH SLEEK SHAPE, NO DOUBLE BOX) -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('v1.mp4', 'Study & Work Australia Platform Overview', '2m 45s')}
          </div>
          <!-- RIGHT SIDE TEXT (CLEAN HIGH-CONTRAST TYPOGRAPHY & SHAPED CHECKLIST) -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Featured Media</span>
            <h2 class="heading-1">Turn Your Qualifications Into Workplace Success</h2>
            <p class="lead-text">
              Watch how Study & Work Australia connects university talent with top tier corporate host companies across Australia.
            </p>
            <ul class="media-feature-checklist">
              <li class="media-feature-item">
                <span class="media-check-icon">✓</span>
                <span>12-Week Structured Internships</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon">✓</span>
                <span>Direct Graduate Job Placements</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon">✓</span>
                <span>3,000+ Verified Australian Host Businesses</span>
              </li>
            </ul>
            <a href="/candidates" data-link class="btn btn-primary btn-hero-primary" style="align-self: flex-start;">Explore Candidate Pathways &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ALUMNI REVIEWS — SCROLL EFFECT 2 (PARTICLE DRIFT 3 ORIGINKIT BACKGROUND) -->
    <section id="alumni" class="section section-particle-drift">
      <div class="container" style="text-align: center; max-width: 720px; margin: 0 auto 2rem;">
        <span class="badge-tag">Audited Outcomes</span>
        <h2 data-fx-heading class="heading-1" style="margin-top: 0.75rem;">Real graduates. Real jobs.</h2>
        <p class="lead-text" style="color: #94A3B8; margin-top: 0.5rem;">Verified career outcomes from candidates placed into over 3,000 Australian host businesses.</p>
      </div>

      <div class="fx-row" data-fx-speed="40" data-fx-dir="right">
        <div class="fx-track">
          <div class="fx-rcard">
            <q>Within a short period of time Study &amp; Work lined up an interview. They gave me tips and guidance. My first interview was successful and I was offered the job!</q>
            <hr>
            <b>Ms Thyaga Keerthipala</b>
            <span>Bachelor of Science in Information Technology, Manchester Metropolitan University, UK</span>
            <em>Currently: Database Developer</em>
          </div>

          <div class="fx-rcard">
            <q>Study &amp; Work sets you up with interviews with prospective employers who have an open mind regarding hiring international students. Highly recommended!</q>
            <hr>
            <b>Mr Devesh Soni</b>
            <span>Master of Professional Accounting, University of Wollongong</span>
            <em>Currently: Senior Fund Accountant</em>
          </div>

          <div class="fx-rcard">
            <q>The structured 12-week internship bridged my academic background with real-world Australian engineering projects. I was offered a full-time role right after!</q>
            <hr>
            <b>Mr Rahul Sharma</b>
            <span>Master of Engineering (Civil), University of Melbourne</span>
            <em>Currently: Structural Project Engineer</em>
          </div>

          <div class="fx-rcard">
            <q>Securing an Australian corporate role felt impossible until Study &amp; Work guided my resume, technical interview prep, and connected me with an outstanding host company.</q>
            <hr>
            <b>Ms Linh Nguyen</b>
            <span>Master of Information Systems, UNSW Sydney</span>
            <em>Currently: Business Analyst</em>
          </div>

          <div class="fx-rcard">
            <q>The team provided direct access to hiring managers who valued my skills. I gained local experience and transitioned directly to permanent residency sponsorship.</q>
            <hr>
            <b>Mr Carlos Mendoza</b>
            <span>Bachelor of Commerce (Finance), Macquarie University</span>
            <em>Currently: Financial Analyst</em>
          </div>

          <div class="fx-rcard">
            <q>From student casual work to a professional marketing role, Study &amp; Work supported my entire journey in Australia. The guidance was genuinely invaluable.</q>
            <hr>
            <b>Ms Ananya Patel</b>
            <span>Master of Marketing &amp; Communications, Monash University</span>
            <em>Currently: Digital Marketing Specialist</em>
          </div>
        </div>
      </div>
    </section>

    <!-- OFFICE LOCATIONS TABS -->
    <section class="section section-spider-dark">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 2.5rem;">
          <span class="badge-tag">National Footprint</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Australian Offices & Operations</h2>
        </div>

        <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2rem;">
          <button class="city-chip-btn active" data-city="sydney">Sydney & Parramatta</button>
          <button class="city-chip-btn" data-city="melbourne">Melbourne</button>
          <button class="city-chip-btn" data-city="brisbane">Brisbane</button>
          <button class="city-chip-btn" data-city="perth">Perth</button>
          <button class="city-chip-btn" data-city="adelaide">Adelaide</button>
        </div>

        <div id="cityDetailContainer" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;"></div>
      </div>
    </section>
  `;
}

// --- 4.2 CANDIDATES HUB VIEW (UNIFIED CONTINUOUS PRESENTATION) ---
function renderCandidatesView(container) {
  container.innerHTML = `
    <!-- 1. CANDIDATES MAIN HERO -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="candidates_hero_bg.jpg" class="hero-bg-img" alt="Australian Candidates & Graduates">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 820px;">
          <span class="badge-tag hero-badge" style="background: rgba(255, 255, 255, 0.09); color: #F8FAFC; border: 1px solid rgba(255, 255, 255, 0.22);">Candidates & Graduates Suite</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Build Experience. Start Your Australian Career.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Australia's premier career entry platform connecting university students, graduates, and skilled migrants with 3,000+ host companies across Sydney, Melbourne, Brisbane, Perth, and Adelaide. Explore all candidate opportunities below in one unified guide.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('work')" class="btn btn-primary btn-hero-primary">Register Candidate Profile &rarr;</button>
            <button onclick="openModal('consultation')" class="btn btn-secondary btn-hero-secondary">Book Career Consultation &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. DEDICATED CANDIDATE PATHWAYS (SECTION 1 — WHITE) -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 760px; margin: 0 auto 3rem;">
          <h2 class="heading-1">Dedicated Candidate Pathways</h2>
          <p class="lead-text" style="margin-top: 0.5rem;">Choose the pathway that matches your current qualification, visa status, and career ambitions.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(330px, 1fr)); gap: 1.75rem;">
          <!-- CARD 1: INTERNSHIP -->
          <div class="card-3d-elevated card-3d-blue" style="padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge-tag" style="background: rgba(2, 132, 199, 0.12); color: #0284C7; border-color: rgba(2, 132, 199, 0.3); margin-bottom: 0.85rem; font-weight: 700;">12-Week Program</span>
              <h3 class="heading-2" style="color: #0F172A; margin: 0.5rem 0;">Professional Internship Program</h3>
              <p style="color: #475569; margin-top: 0.75rem; line-height: 1.6; font-size: 0.95rem;">
                12-week structured workplace placement in Australian corporate host companies. Gain hands-on local experience in IT, Accounting, Engineering, Marketing, and Business Management.
              </p>
            </div>
            <div style="margin-top: 1.75rem; border-top: 1px solid rgba(226, 232, 240, 0.8); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.85rem; font-weight: 600; color: #64748B;">Target: Students &amp; Grads</span>
              <button onclick="openModal('work')" class="btn btn-primary" style="padding: 0.55rem 1.15rem; font-size: 0.875rem;">View Internships &rarr;</button>
            </div>
          </div>

          <!-- CARD 2: GRADUATE JOBS -->
          <div class="card-3d-elevated card-3d-emerald" style="padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge-tag" style="background: rgba(5, 150, 105, 0.12); color: #059669; border-color: rgba(5, 150, 105, 0.3); margin-bottom: 0.85rem; font-weight: 700;">Direct Placement</span>
              <h3 class="heading-2" style="color: #0F172A; margin: 0.5rem 0;">Graduate Job Placement</h3>
              <p style="color: #475569; margin-top: 0.75rem; line-height: 1.6; font-size: 0.95rem;">
                Direct paid placement for graduates with Australian host employers. 5%-10% employer placement fee structure with a 6-month satisfaction replacement guarantee.
              </p>
            </div>
            <div style="margin-top: 1.75rem; border-top: 1px solid rgba(226, 232, 240, 0.8); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.85rem; font-weight: 600; color: #64748B;">Target: Recent Graduates</span>
              <button onclick="openModal('work')" class="btn btn-primary" style="background: #059669; border-color: #059669; padding: 0.55rem 1.15rem; font-size: 0.875rem;">Graduate Jobs &rarr;</button>
            </div>
          </div>

          <!-- CARD 3: APPRENTICESHIPS -->
          <div class="card-3d-elevated card-3d-amber" style="padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge-tag" style="background: rgba(217, 119, 6, 0.12); color: #D97706; border-color: rgba(217, 119, 6, 0.3); margin-bottom: 0.85rem; font-weight: 700;">Earn &amp; Learn</span>
              <h3 class="heading-2" style="color: #0F172A; margin: 0.5rem 0;">Apprenticeships &amp; Traineeships</h3>
              <p style="color: #475569; margin-top: 0.75rem; line-height: 1.6; font-size: 0.95rem;">
                Structured vocational training and paid workplace placements for trade, technical, and commercial operations supported by Australian government subsidies.
              </p>
            </div>
            <div style="margin-top: 1.75rem; border-top: 1px solid rgba(226, 232, 240, 0.8); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.85rem; font-weight: 600; color: #64748B;">Target: Vocational &amp; Trade</span>
              <a href="/candidates#apprenticeships" class="btn btn-primary" style="background: #D97706; border-color: #D97706; color: #FFF; padding: 0.55rem 1.15rem; font-size: 0.875rem;">Traineeships &rarr;</a>
            </div>
          </div>

          <!-- CARD 4: CASUAL JOBS -->
          <div class="card-3d-elevated card-3d-rose" style="padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge-tag" style="background: rgba(225, 29, 72, 0.12); color: #E11D48; border-color: rgba(225, 29, 72, 0.3); margin-bottom: 0.85rem; font-weight: 700;">Student Friendly</span>
              <h3 class="heading-2" style="color: #0F172A; margin: 0.5rem 0;">Casual Jobs for Students</h3>
              <p style="color: #475569; margin-top: 0.75rem; line-height: 1.6; font-size: 0.95rem;">
                Flexible student jobs in hospitality, retail, customer service, and events matching Australian student visa work limitations (48 hours per fortnight).
              </p>
            </div>
            <div style="margin-top: 1.75rem; border-top: 1px solid rgba(226, 232, 240, 0.8); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.85rem; font-weight: 600; color: #64748B;">Target: Student Visa Holders</span>
              <a href="/candidates#casual-student-jobs" class="btn btn-primary" style="background: #E11D48; border-color: #E11D48; color: #FFF; padding: 0.55rem 1.15rem; font-size: 0.875rem;">Casual Jobs &rarr;</a>
            </div>
          </div>

          <!-- CARD 5: KNOW YOUR RIGHTS -->
          <div class="card-3d-elevated card-3d-cyan" style="padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge-tag" style="background: rgba(8, 145, 178, 0.12); color: #0891B2; border-color: rgba(8, 145, 178, 0.3); margin-bottom: 0.85rem; font-weight: 700;">Fair Work Compliance</span>
              <h3 class="heading-2" style="color: #0F172A; margin: 0.5rem 0;">Know Your Rights</h3>
              <p style="color: #475569; margin-top: 0.75rem; line-height: 1.6; font-size: 0.95rem;">
                Understand your legal protections under the Australian Fair Work Act 2009. Rules governing vocational placements, paid vs unpaid internships, and worker safety.
              </p>
            </div>
            <div style="margin-top: 1.75rem; border-top: 1px solid rgba(226, 232, 240, 0.8); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.85rem; font-weight: 600; color: #64748B;">Target: All Candidates</span>
              <a href="/candidates#know-your-rights" class="btn btn-primary" style="background: #0891B2; border-color: #0891B2; color: #FFF; padding: 0.55rem 1.15rem; font-size: 0.875rem;">Legal Rights &rarr;</a>
            </div>
          </div>

          <!-- CARD 6: ALUMNI -->
          <div class="card-3d-elevated card-3d-purple" style="padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge-tag" style="background: rgba(124, 58, 237, 0.12); color: #7C3AED; border-color: rgba(124, 58, 237, 0.3); margin-bottom: 0.85rem; font-weight: 700;">Success Stories</span>
              <h3 class="heading-2" style="color: #0F172A; margin: 0.5rem 0;">Alumni Directory</h3>
              <p style="color: #475569; margin-top: 0.75rem; line-height: 1.6; font-size: 0.95rem;">
                Explore verified success stories of over 8,000 graduates placed into leading Australian enterprises across 145+ Australian and global universities.
              </p>
            </div>
            <div style="margin-top: 1.75rem; border-top: 1px solid rgba(226, 232, 240, 0.8); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.85rem; font-weight: 600; color: #64748B;">Target: Prospective Candidates</span>
              <a href="/our-alumni" data-link class="btn btn-primary" style="background: #7C3AED; border-color: #7C3AED; color: #FFF; padding: 0.55rem 1.15rem; font-size: 0.875rem;">Alumni Directory &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. CANDIDATE VIDEO SPOTLIGHT 1 (SECTION 2 — BLACK) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <div class="media-spotlight-video">
            ${renderVideoPlayer('interns1.mp4', 'Candidate Internship Placement Video', '3m 20s')}
          </div>
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem; color: #D9C690;">Graduate Success</span>
            <h2 class="heading-1">From Degree to Corporate Career</h2>
            <p class="lead-text">
              See how international students and Australian graduates transition into high-growth career roles with top Australian host companies.
            </p>
            <button onclick="openModal('work')" class="btn btn-primary btn-hero-primary" style="align-self: flex-start; margin-top: 1rem;">Register Candidate Profile &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. CANDIDATE SOLUTIONS SUITE (SECTION 3 — WHITE) -->
    <section class="sw section-spider-light" data-solutions-type="candidates">
      <nav class="sw-tabs" aria-label="Candidate options"></nav>
      <div class="sw-stage"></div>
    </section>

    <!-- 5. GOVERNMENT SUBSIDIZED APPRENTICESHIP HOST MANAGEMENT (PDF PAGE 2 IMAGE 2 BOTTOM) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <div class="media-spotlight-video">
            ${renderVideoPlayer('apprentice.mp4', 'Apprenticeship & Traineeship Video', '3m 30s')}
          </div>
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem; color: #D9C690;">Program Video</span>
            <h2 class="heading-1">Government Subsidized Apprenticeship Host Management</h2>
            <p class="lead-text">
              Study &amp; Work operates as an experienced host employer partner, handling apprentice training contract administration, RTO liaison, and claim processing.
            </p>
            <ul class="media-feature-checklist">
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(217, 119, 6, 0.2); color: #FBBF24;">✓</span>
                <span>Access to Australian Priority Wage Subsidies</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(217, 119, 6, 0.2); color: #FBBF24;">✓</span>
                <span>Comprehensive Workplace Health and Safety (WHS) Inductions</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(217, 119, 6, 0.2); color: #FBBF24;">✓</span>
                <span>Flexible Rotation Across Leading Host Companies</span>
              </li>
            </ul>
            <button onclick="openModal('work')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-amber); border-color: var(--color-accent-amber); align-self: flex-start; margin-top: 1rem;">Apply for Traineeship &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;

  if (window.initSolutions) {
    window.initSolutions();
  }
  if (window.initEffects) {
    window.initEffects();
  }
}

// --- 4.3 EMPLOYERS HUB VIEW (UNIFIED CONTINUOUS PRESENTATION) ---
function renderEmployersView(container) {
  container.innerHTML = `
    <!-- 1. EMPLOYERS MAIN HERO -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="employers_hero_bg.jpg" class="hero-bg-img" alt="Australian Employer Talent Solutions">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 820px;">
          <span class="badge-tag hero-badge" style="background: rgba(255, 255, 255, 0.09); color: #F8FAFC; border: 1px solid rgba(255, 255, 255, 0.22);">Employer Talent Solutions Suite</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Find Talent That Moves Your Business Forward.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Flexible staffing and recruitment solutions for Australian enterprises since 2007. Evaluate interns over 12 weeks at zero cost, direct-hire with a 6-month satisfaction guarantee, or hire casual staff with 65% markup. Explore all employer talent models below in one continuous presentation.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('hire')" class="btn btn-primary btn-hero-primary">Submit Talent Request &rarr;</button>
            <a href="tel:1300798069" class="btn btn-secondary btn-hero-secondary">Call Hotline 1300 79 80 69 &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. 4-STEP EMPLOYER WORKFLOW (SECTION 1 — WHITE) -->
    <section class="fx-journey fx-rev fx-light section-spider-light">
      <div class="fx-j-list">
        <div class="fx-j-card" style="--c:#0284C7" data-img="/contact_hero_bg.jpg">
          <small>01 Vacancy</small>
          <h3>Submit Vacancy</h3>
          <p>Detail your skill requirements, host duration, and supervisor mentor details in under 2 minutes.</p>
          <a href="javascript:void(0)" onclick="openModal('hire')">Submit Role Details &rarr;</a>
        </div>

        <div class="fx-j-card" style="--c:#10B981" data-img="/candidates_hero_bg.jpg">
          <small>02 Shortlist</small>
          <h3>Candidate Shortlist</h3>
          <p>Receive screened candidate profiles within 24-48 hours matching your specific tech stack and culture.</p>
          <a href="javascript:void(0)" onclick="openModal('hire')">Request Candidate Pool &rarr;</a>
        </div>

        <div class="fx-j-card" style="--c:#F59E0B" data-img="/www.studyandwork.com.au/images/home/2.png">
          <small>03 Trial</small>
          <h3>Interview &amp; Trial</h3>
          <p>Interview preferred candidates and begin the 12-week host placement evaluation with zero upfront fee.</p>
          <a href="javascript:void(0)" onclick="openModal('hire')">Schedule Interviews &rarr;</a>
        </div>

        <div class="fx-j-card" style="--c:#8B5CF6" data-img="/alumni_hero_bg.jpg">
          <small>04 Conversion</small>
          <h3>Direct Hire Option</h3>
          <p>Retain top performers directly as permanent full-time team members with zero risk after seeing live work output.</p>
          <a href="javascript:void(0)" onclick="openModal('hire')">Get Started Today &rarr;</a>
        </div>
      </div>

      <div class="fx-j-right">
        <span class="badge-tag">Employer Workflow</span>
        <h2 data-fx-heading class="heading-1" style="font-size: clamp(1.55rem, 2.1vw, 1.95rem); line-height: 1.25; margin: 0.85rem 0 0.65rem; color: #0B192C; max-width: 380px;">How Host Employer<br>Placement Operates</h2>
        <p class="lead-text" style="font-size: 1.05rem; line-height: 1.6; color: #475569; max-width: 440px; margin-bottom: 0;">A streamlined 4-step onboarding pipeline that delivers pre-screened graduate talent to your desk within 48 hours.</p>
        <div class="fx-dots"></div>
        <div class="fx-active-topic">
          <div class="fx-topic-name">Submit Vacancy</div>
        </div>

        <!-- DYNAMIC TOPIC SHOWCASE CARD -->
        <div class="fx-topic-showcase" id="fxEmployerTopicShowcase">
          <div class="fx-topic-preview-img-wrap">
            <img class="fx-topic-img" src="www.studyandwork.com.au/images/home/4.png" alt="Topic Preview" loading="lazy">
            <div class="fx-topic-badge-overlay">
              <span class="fx-topic-num-pill">01</span>
              <span class="fx-topic-status-pill">Vacancy</span>
            </div>
          </div>
          <div class="fx-topic-details">
            <div class="fx-topic-header-row">
              <span class="fx-topic-category">Employer Pipeline</span>
              <span class="fx-topic-indicator-dot"></span>
            </div>
            <h4 class="fx-topic-display-title">Submit Vacancy</h4>
            <p class="fx-topic-display-desc">Detail your skill requirements, host duration, and supervisor mentor details in under 2 minutes.</p>
            <div class="fx-topic-chips">
              <span class="fx-chip">48-Hr Match</span>
              <span class="fx-chip">Skill Audit</span>
              <span class="fx-chip">Zero Fee Trial</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. EMPLOYER VIDEO SPOTLIGHT 1 (SECTION 2 — BLACK) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <div class="media-spotlight-video">
            ${renderVideoPlayer('employerVideo.mp4', 'Recruitment Cost Optimization Video', '4m 10s')}
          </div>
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem; color: #D9C690;">Employer Insights</span>
            <h2 class="heading-1">Recruitment Doesn't Have to Be Expensive</h2>
            <p class="lead-text">
              Learn how Australian SMEs and corporate enterprises save up to 70% in recruitment costs using Study &amp; Work's host placement models.
            </p>
            <button onclick="openModal('hire')" class="btn btn-primary btn-hero-primary" style="align-self: flex-start; margin-top: 1rem;">Host an Intern Zero Cost &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. EMPLOYER SOLUTIONS SUITE (SECTION 3 — WHITE) -->
    <section class="sw section-spider-light" data-solutions-type="employers">
      <nav class="sw-tabs" aria-label="Employer solutions"></nav>
      <div class="sw-stage" id="sw-stage"></div>
    </section>

    <!-- 5. PRECISION TALENT MATCHING (PDF PAGE 3 IMAGE 2 BOTTOM) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <div class="media-spotlight-video">
            ${renderVideoPlayer('staffing.mp4', 'Professional Staffing Solution Video', '3m 50s')}
          </div>
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem; color: #D9C690;">Corporate Staffing</span>
            <h2 class="heading-1">Precision Talent Matching for Australian Industry</h2>
            <p class="lead-text">
              Over 3,000 Australian enterprises have partnered with Study &amp; Work since 2007. See how our bespoke sourcing saves time and recruitment expenditure.
            </p>
            <ul class="media-feature-checklist">
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(2, 132, 199, 0.2); color: #38BDF8;">✓</span>
                <span>24-48 Hour Candidate Shortlist Turnaround</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(2, 132, 199, 0.2); color: #38BDF8;">✓</span>
                <span>Complete VEVO Work Rights and Qualification Verification</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(2, 132, 199, 0.2); color: #38BDF8;">✓</span>
                <span>6-Month Candidate Satisfaction Replacement Guarantee</span>
              </li>
            </ul>
            <button onclick="openModal('hire')" class="btn btn-primary btn-hero-primary" style="align-self: flex-start; margin-top: 1rem;">Request Permanent Staffing &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;

  if (window.initSolutions) {
    window.initSolutions();
  }
  if (window.initEffects) {
    window.initEffects();
  }
}

// --- 4.4 EDUCATION PROVIDERS VIEW ---
function renderEducationProvidersView(container) {
  container.innerHTML = `
    <!-- EDUCATION HERO WITH RICH BACKGROUND PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="education_hero_bg.jpg" class="hero-bg-img" alt="Education Partnerships Australia">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(16, 185, 129, 0.25); color: #6ee7b7; border-color: rgba(16, 185, 129, 0.4);">Education Partnerships</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Turn Education Into Real Industry Experience.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Partnering with 145+ Australian and international universities to integrate Work Integrated Learning (WIL) and boost graduate employability outcomes.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('contact')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald);">Partner With Us &rarr;</button>
            <a href="tel:1300798069" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Call Education Desk 1300 79 80 69 &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- WIL PARTNERSHIPS OVERVIEW — SCROLL EFFECT (LEFT STICKY + RIGHT CARDS) -->
    <section class="fx-journey fx-light section-spider-light">
      <div class="fx-j-left">
        <span class="badge-tag">WIL Framework</span>
        <h2 data-fx-heading class="heading-1" style="font-size: clamp(2rem, 3vw, 2.75rem); line-height: 1.15; margin: 1rem 0 0.75rem; color: #0B192C;">Work Integrated Learning Solutions</h2>
        <p class="lead-text" style="font-size: 1.05rem; line-height: 1.6; color: #475569; max-width: 440px; margin-bottom: 0;">Study &amp; Work bridges the gap between university academic theory and practical workplace performance.</p>
        <div class="fx-dots"></div>
        <div class="fx-active-topic">
          <div class="fx-topic-name">Curriculum Integration</div>
        </div>
      </div>

      <div class="fx-j-list">
        <div class="fx-j-card" style="--c:#0284C7" data-img="/education_hero_bg.jpg">
          <small>🎓 Academic Credit</small>
          <h3>Curriculum Placement Integration</h3>
          <p>We embed 12-week professional internships directly into university degree credit requirements, ensuring 100% compliance with Australian higher education standards.</p>
          <a href="javascript:void(0)" onclick="openModal('contact')">Integrate Degrees &rarr;</a>
        </div>

        <div class="fx-j-card" style="--c:#10B981" data-img="/know_your_rights_hero_bg.jpg">
          <small>⚖️ Legal Assurance</small>
          <h3>Fair Work &amp; Legal Compliance</h3>
          <p>All host company placements strictly comply with Section 12 of the Australian Fair Work Act 2009 regarding vocational placements and international student visa conditions.</p>
          <a href="javascript:void(0)" onclick="openModal('contact')">Review Governance &rarr;</a>
        </div>

        <div class="fx-j-card" style="--c:#F59E0B" data-img="/www.studyandwork.com.au/images/home/1.png">
          <small>📈 Graduate Outcomes</small>
          <h3>Graduate Employability Uplift</h3>
          <p>Over 85% of placed interns receive permanent employment offers within 3 months of program completion, significantly boosting university QILT graduate outcome metrics.</p>
          <a href="javascript:void(0)" onclick="openModal('contact')">Partner With Us &rarr;</a>
        </div>
      </div>
    </section>

    <!-- VIDEO SPOTLIGHT (LEFT VIDEO + RIGHT TEXT - IMAGE 4 LAYOUT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <!-- LEFT SIDE VIDEO -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('PIPE.mp4', 'Work Integrated Learning Video', '5m 20s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">University Partnerships</span>
            <h2 class="heading-1">Work Integrated Learning (PIPE) Overview</h2>
            <p class="lead-text">
              Watch how Study & Work collaborates with university faculties to deliver hands-on industry placements for Australian and international students.
            </p>
            <button onclick="openModal('contact')" class="btn btn-primary" style="align-self: flex-start; margin-top: 1rem;">Request Faculty Proposal &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.5 RESOURCES HUB VIEW ---
function renderResourcesView(container) {
  container.innerHTML = `
    <!-- 1. RESOURCES MAIN HERO -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="resources_hero_bg.jpg" class="hero-bg-img" alt="Knowledge and Insights Australia">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 820px;">
          <span class="badge-tag hero-badge" style="background: rgba(217, 119, 6, 0.25); color: #fbbf24; border-color: rgba(217, 119, 6, 0.4);">Knowledge & Resources Suite</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Knowledge for Your Next Career Move.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Articles, legal guides under the Fair Work Act 2009, employer ROI research, and career advocacy for students, graduates, and businesses in Australia. Explore all resource sections below in one comprehensive, continuous presentation.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('consultation')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-amber); border-color: var(--color-accent-amber); color: #0F172A; font-weight: 700;">Book Expert Consultation &rarr;</button>
            <button onclick="openModal('work')" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Register Candidate Profile &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. STICKY IN-PAGE SUB-NAVIGATION PILLS -->
    <nav class="subnav-sticky-bar" aria-label="Resources In-Page Navigation">
      <div class="container subnav-pills-container">
        <a href="/resources#overview" data-link class="subnav-pill-btn active">📌 Hub Overview</a>
        <a href="/resources#know-your-rights" data-link class="subnav-pill-btn">⚖️ Fair Work Rights Guide</a>
        <a href="/resources#employer-roi" data-link class="subnav-pill-btn">📈 Employer ROI Insights</a>
        <a href="/resources#skilled-migrants" data-link class="subnav-pill-btn">🌏 Skilled Migrants Advocacy</a>
      </div>
    </nav>

    <!-- ======================================================================
         RESOURCES & ARTICLES HUB OVERVIEW
         ====================================================================== -->
    <div id="overview" class="target-anchor-section">
      <!-- ARTICLES SUMMARY TILES -->
      <section class="section section-spider-light">
        <div class="container">
          <div style="text-align: center; max-width: 760px; margin: 0 auto 3rem;">
            <h2 class="heading-1">Authoritative Industry Publications & Legal Guides</h2>
            <p class="lead-text" style="margin-top: 0.5rem;">Explore in-depth articles, Australian workplace laws, and economic data prepared by Study & Work Australia.</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem;">
            <!-- CARD 1 -->
            <div class="card-3d-elevated card-3d-emerald" style="padding: 2.25rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge-tag" style="background: rgba(5, 150, 105, 0.12); color: var(--color-accent-emerald); border-color: rgba(5, 150, 105, 0.3); margin-bottom: 0.85rem;">Fair Work Compliance</span>
                <h3 class="heading-2" style="color: #0F172A;">Fair Work Rights Guide</h3>
                <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                  Essential guidelines for university students and interns covering minimum award wages, vocational placement exceptions under Section 12, and workplace protections.
                </p>
              </div>
              <div style="margin-top: 1.75rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-slate-500);">Legal Framework</span>
                <a href="/resources#know-your-rights" data-link class="btn btn-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald); padding: 0.5rem 1rem; font-size: 0.85rem;">Read Guide &darr;</a>
              </div>
            </div>

            <!-- CARD 2 -->
            <div class="card-3d-elevated card-3d-blue" style="padding: 2.25rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge-tag" style="background: rgba(2, 132, 199, 0.12); color: var(--color-accent-blue); border-color: rgba(2, 132, 199, 0.3); margin-bottom: 0.85rem;">Employer ROI</span>
                <h3 class="heading-2" style="color: #0F172A;">Invest in Emerging Talent for Maximum ROI</h3>
                <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                  Why hiring university graduates and hosting interns yields superior productivity, long-term employee retention, and cuts recruitment costs by up to 70%.
                </p>
              </div>
              <div style="margin-top: 1.75rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-slate-500);">Economic Research</span>
                <a href="/resources#employer-roi" data-link class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">Explore ROI &darr;</a>
              </div>
            </div>

            <!-- CARD 3 -->
            <div class="card-3d-elevated card-3d-amber" style="padding: 2.25rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge-tag" style="background: rgba(217, 119, 6, 0.12); color: var(--color-accent-amber); border-color: rgba(217, 119, 6, 0.3); margin-bottom: 0.85rem;">Advocacy & Diversity</span>
                <h3 class="heading-2" style="color: #0F172A;">Skilled Migrants Deserve a Fair Go</h3>
                <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                  How Australian businesses can unlock immense talent by breaking down the "no local experience" barrier for overseas-qualified professionals.
                </p>
              </div>
              <div style="margin-top: 1.75rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-slate-500);">National Advocacy</span>
                <a href="/resources#skilled-migrants" data-link class="btn btn-primary" style="background: var(--color-accent-amber); border-color: var(--color-accent-amber); color: #0F172A; padding: 0.5rem 1rem; font-size: 0.85rem;">View Article &darr;</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CORPORATE VIDEO SPOTLIGHT (LEFT VIDEO + RIGHT TEXT) -->
      <section class="section section-spider-dark">
        <div class="container">
          <div class="media-spotlight-grid">
            <div class="media-spotlight-video">
              ${renderVideoPlayer('STUDYANDWORKABOUTUS.mp4', 'Study & Work Corporate Story', '6m 45s')}
            </div>
            <div class="media-spotlight-content">
              <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">19+ Years Career Leadership</span>
              <h2 class="heading-1">Connecting Knowledge, Talent & Enterprise</h2>
              <p class="lead-text">
                Since 2007, Study & Work Australia has published authoritative insights and practical guides helping over 8,000 candidates and 3,000+ Australian host companies navigate workforce laws and strategic talent acquisition.
              </p>
              <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                <button onclick="openModal('consultation')" class="btn btn-primary">Book Consultation &rarr;</button>
                <a href="#know-your-rights" class="btn btn-secondary">Review Fair Work Act &darr;</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ======================================================================
         FAIR WORK RIGHTS GUIDE
         ====================================================================== -->
    <div id="know-your-rights" class="target-anchor-section">
      <!-- LEGAL CRITERIA BREAKDOWN -->
      <section class="section section-spider-light">
        <div class="container">
          <div style="text-align: center; max-width: 760px; margin: 0 auto 3rem;">
            <h2 class="heading-1">Know Your Legal Rights Under Fair Work Act 2009</h2>
            <p class="lead-text" style="margin-top: 0.5rem;">Legal protections governing student vocational placements, paid vs unpaid internships, and worker rights in Australia.</p>
          </div>
          <div style="background: linear-gradient(145deg, #0B192C 0%, #15253F 55%, #1E293B 100%); padding: 3.25rem 2.85rem; border-radius: 24px; border: 1.5px solid rgba(217, 198, 144, 0.35); box-shadow: 0 24px 50px -10px rgba(11, 25, 44, 0.28), 0 0 35px -5px rgba(2, 132, 199, 0.15); margin-bottom: 2.5rem; color: #F8FAFC;">
            <div style="max-width: 820px;">
              <span class="badge-tag" style="margin-bottom: 0.95rem; background: rgba(217, 198, 144, 0.15); color: #D9C690; border-color: rgba(217, 198, 144, 0.38); font-weight: 700; letter-spacing: 0.05em;">Fair Work Act 2009 &bull; Section 12</span>
              <h3 class="heading-2" style="color: #FFFFFF; font-size: 1.95rem; font-weight: 800; line-height: 1.25;">When Is an Unpaid Internship Lawful in Australia?</h3>
              <p style="color: #CBD5E1; margin-top: 0.85rem; line-height: 1.75; font-size: 1.05rem;">
                Under Section 12 of the Australian <em style="color: #FFFFFF; font-style: normal; font-weight: 600;">Fair Work Act 2009</em>, a vocational placement is lawfully unpaid <strong style="color: #D9C690; background: rgba(217, 198, 144, 0.15); padding: 0.15rem 0.5rem; border-radius: 6px;">ONLY</strong> when all three of the following mandatory conditions are met:
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 2.25rem;">
              <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.14); padding: 1.85rem; box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2); transition: all 0.35s ease;">
                <div style="font-weight: 800; color: #34D399; font-size: 1.05rem; margin-bottom: 0.65rem; display: flex; align-items: center; gap: 0.6rem;">
                  <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background: rgba(52, 211, 153, 0.15); color: #34D399; font-size: 1rem;">✓</span>
                  1. Approved Course Requirement
                </div>
                <p style="color: #CBD5E1; font-size: 0.95rem; margin: 0; line-height: 1.65;">
                  The placement must be an integrated, accredited component of an authorised education or training course (Higher Education or VET accredited).
                </p>
              </div>

              <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.14); padding: 1.85rem; box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2); transition: all 0.35s ease;">
                <div style="font-weight: 800; color: #38BDF8; font-size: 1.05rem; margin-bottom: 0.65rem; display: flex; align-items: center; gap: 0.6rem;">
                  <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background: rgba(56, 189, 248, 0.15); color: #38BDF8; font-size: 1rem;">🏛️</span>
                  2. Institutional Authorisation
                </div>
                <p style="color: #CBD5E1; font-size: 0.95rem; margin: 0; line-height: 1.65;">
                  The university or college must officially authorise, document, and supervise the placement under an institutional learning agreement.
                </p>
              </div>

              <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.14); padding: 1.85rem; box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2); transition: all 0.35s ease;">
                <div style="font-weight: 800; color: #FBBF24; font-size: 1.05rem; margin-bottom: 0.65rem; display: flex; align-items: center; gap: 0.6rem;">
                  <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background: rgba(251, 191, 36, 0.15); color: #FBBF24; font-size: 1rem;">🎓</span>
                  3. Primary Learning Benefit
                </div>
                <p style="color: #CBD5E1; font-size: 0.95rem; margin: 0; line-height: 1.65;">
                  The primary beneficiary must be the candidate through skill development and mentoring, not commercial productivity for the host company.
                </p>
              </div>
            </div>
          </div>

          <!-- COMPARISON GRID: VOCATIONAL VS EMPLOYMENT -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
            <div style="background: #FFFFFF; padding: 2.5rem 2.25rem; border-radius: 22px; border: 1.5px solid rgba(16, 185, 129, 0.3); box-shadow: 0 16px 36px -6px rgba(16, 185, 129, 0.12), 0 0 0 1px rgba(16, 185, 129, 0.08); transition: transform 0.3s ease, box-shadow 0.3s ease;">
              <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(16, 185, 129, 0.15);">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 12px; background: rgba(16, 185, 129, 0.12); color: #059669; font-weight: 800; font-size: 1.25rem;">✓</span>
                <div>
                  <span style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #059669;">Unpaid Vocational Track</span>
                  <h4 style="font-size: 1.35rem; font-weight: 800; color: #0B192C; margin: 0.15rem 0 0;">Lawful Vocational Placement</h4>
                </div>
              </div>
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.95rem; color: #334155; font-size: 0.95rem; font-weight: 500;">
                <li style="display: flex; align-items: flex-start; gap: 0.75rem;"><span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;">✓</span><span>Covered by university/institution student insurance</span></li>
                <li style="display: flex; align-items: flex-start; gap: 0.75rem;"><span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;">✓</span><span>Maximum 12 weeks structured learning schedule</span></li>
                <li style="display: flex; align-items: flex-start; gap: 0.75rem;"><span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;">✓</span><span>Designated industry mentor assigned</span></li>
                <li style="display: flex; align-items: flex-start; gap: 0.75rem;"><span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;">✓</span><span>Focus on observation, shadowing &amp; practical projects</span></li>
                <li style="display: flex; align-items: flex-start; gap: 0.75rem;"><span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;">✓</span><span>Fully compliant with Fair Work Act Section 12</span></li>
              </ul>
            </div>

            <div style="background: #FFFFFF; padding: 2.5rem 2.25rem; border-radius: 22px; border: 1.5px solid rgba(2, 132, 199, 0.3); box-shadow: 0 16px 36px -6px rgba(2, 132, 199, 0.12), 0 0 0 1px rgba(2, 132, 199, 0.08); transition: transform 0.3s ease, box-shadow 0.3s ease;">
              <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(2, 132, 199, 0.15);">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 12px; background: rgba(2, 132, 199, 0.12); color: #0284C7; font-weight: 800; font-size: 1.25rem;">$</span>
                <div>
                  <span style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0284C7;">Award Wage Paid Track</span>
                  <h4 style="font-size: 1.35rem; font-weight: 800; color: #0B192C; margin: 0.15rem 0 0;">Paid Direct Employment</h4>
                </div>
              </div>
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.95rem; color: #334155; font-size: 0.95rem; font-weight: 500;">
                <li style="display: flex; align-items: flex-start; gap: 0.75rem;"><span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: rgba(2, 132, 199, 0.15); color: #0284C7; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;">✓</span><span>Covered by employer WorkCover insurance</span></li>
                <li style="display: flex; align-items: flex-start; gap: 0.75rem;"><span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: rgba(2, 132, 199, 0.15); color: #0284C7; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;">✓</span><span>Minimum modern award wage rates or above</span></li>
                <li style="display: flex; align-items: flex-start; gap: 0.75rem;"><span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: rgba(2, 132, 199, 0.15); color: #0284C7; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;">✓</span><span>Statutory 11.5% Superannuation guarantee paid</span></li>
                <li style="display: flex; align-items: flex-start; gap: 0.75rem;"><span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: rgba(2, 132, 199, 0.15); color: #0284C7; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;">✓</span><span>Productive commercial duties and deliverables</span></li>
                <li style="display: flex; align-items: flex-start; gap: 0.75rem;"><span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: rgba(2, 132, 199, 0.15); color: #0284C7; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;">✓</span><span>Casual loading (25%) or permanent leave entitlements</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- FAIR WORK VIDEO SPOTLIGHT (RIGHT VIDEO + LEFT TEXT) -->
      <section class="section section-spider-dark">
        <div class="container">
          <div class="media-spotlight-grid" style="grid-template-columns: 0.95fr 1.05fr;">
            <div class="media-spotlight-content">
              <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Rights Awareness</span>
              <h2 class="heading-1">Every Candidate Deserves a Protected Career Start</h2>
              <p class="lead-text">
                Watch our compliance briefing covering Fair Work standards, student visa 48-hour fortnight limits, and zero-tolerance policies against unlawful sham contracting or unpaid trial shifts.
              </p>
              <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                <button onclick="openModal('work')" class="btn btn-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald);">Register Candidate Profile &rarr;</button>
                <button onclick="openModal('consultation')" class="btn btn-secondary">Speak With an Advisor &rarr;</button>
              </div>
            </div>
            <div class="media-spotlight-video">
              ${renderVideoPlayer('v1.mp4', 'Fair Work Compliance & Candidate Rights Overview', '4m 12s')}
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ======================================================================
         EMPLOYER ROI INSIGHTS
         ====================================================================== -->
    <div id="employer-roi" class="target-anchor-section">
      <!-- ROI PILLARS & FINANCIAL ADVANTAGE -->
      <section class="section section-spider-light">
        <div class="container">
          <div style="text-align: center; max-width: 820px; margin: 0 auto 3rem;">
            <span class="badge-tag" style="background: rgba(2, 132, 199, 0.15); color: var(--color-accent-blue); border-color: rgba(2, 132, 199, 0.3); margin-bottom: 0.75rem;">Strategic Talent Value</span>
            <h2 class="heading-1">Invest in Emerging Talent for Maximum ROI</h2>
            <p class="lead-text" style="margin-top: 0.5rem;">Why hosting university interns and recruiting graduates yields superior retention, innovation, and cost savings for Australian businesses.</p>
          </div>

          <div class="employer-roi-split-layout" style="display: grid; grid-template-columns: 1fr 1.3fr; gap: 2rem; align-items: stretch;">
            <!-- LEFT COLUMN: 4 VALUE METRICS (2x2 GRID) -->
            <div class="roi-boxes-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem;">
              <div class="card-3d-elevated card-3d-blue" style="padding: 1.75rem 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="font-size: 2.25rem; font-weight: 800; color: var(--color-accent-blue); font-family: var(--font-display); line-height: 1;">70%</div>
                  <div style="font-weight: 700; color: #0F172A; margin-top: 0.5rem; font-size: 1rem;">Recruitment Cost Savings</div>
                  <p style="color: var(--color-slate-600); font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.45;">
                    Eliminate traditional agency fees of 15%-25% by evaluating talent during a 12-week zero-fee trial.
                  </p>
                </div>
                <div style="margin-top: 1rem; font-size: 0.75rem; font-weight: 700; color: var(--color-accent-blue);">Zero upfront fee &rarr;</div>
              </div>

              <div class="card-3d-elevated card-3d-emerald" style="padding: 1.75rem 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="font-size: 2.25rem; font-weight: 800; color: var(--color-accent-emerald); font-family: var(--font-display); line-height: 1;">85%+</div>
                  <div style="font-weight: 700; color: #0F172A; margin-top: 0.5rem; font-size: 1rem;">Permanent Hire Conversion</div>
                  <p style="color: var(--color-slate-600); font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.45;">
                    Over 85% of host employers offer ongoing employment to their interns following placement completion.
                  </p>
                </div>
                <div style="margin-top: 1rem; font-size: 0.75rem; font-weight: 700; color: var(--color-accent-emerald);">Proven retention &rarr;</div>
              </div>

              <div class="card-3d-elevated card-3d-amber" style="padding: 1.75rem 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="font-size: 2.25rem; font-weight: 800; color: var(--color-accent-amber); font-family: var(--font-display); line-height: 1;">6 Mos</div>
                  <div style="font-weight: 700; color: #0F172A; margin-top: 0.5rem; font-size: 1rem;">Replacement Guarantee</div>
                  <p style="color: var(--color-slate-600); font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.45;">
                    Double the industry standard: we provide a full 6-month free replacement guarantee on all permanent placements.
                  </p>
                </div>
                <div style="margin-top: 1rem; font-size: 0.75rem; font-weight: 700; color: var(--color-accent-amber);">Risk-free protection &rarr;</div>
              </div>

              <div class="card-3d-elevated card-3d-purple" style="padding: 1.75rem 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="font-size: 2.25rem; font-weight: 800; color: #8b5cf6; font-family: var(--font-display); line-height: 1;">3,000+</div>
                  <div style="font-weight: 700; color: #0F172A; margin-top: 0.5rem; font-size: 1rem;">Host Employers Since 2007</div>
                  <p style="color: var(--color-slate-600); font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.45;">
                    Trusted by Australian SMEs, ASX-listed corporations, accounting firms, and tech innovators nationwide.
                  </p>
                </div>
                <div style="margin-top: 1rem; font-size: 0.75rem; font-weight: 700; color: #8b5cf6;">National network &rarr;</div>
              </div>
            </div>

            <!-- RIGHT COLUMN: COMPARATIVE TABLE -->
            <div class="card-3d-elevated card-3d-blue" style="padding: 2.25rem; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(165deg, #F8FAFD 0%, #EFF6FF 100%) !important; border: 2px solid #93C5FD !important; box-shadow: 0 16px 36px -6px rgba(2, 132, 199, 0.16) !important;">
              <div>
                <span class="badge-tag" style="background: rgba(2, 132, 199, 0.15); color: var(--color-accent-blue); border-color: rgba(2, 132, 199, 0.3); margin-bottom: 0.75rem;">Agency Comparison</span>
                <h3 class="heading-2" style="margin-bottom: 1.25rem; color: #0F172A; font-size: 1.35rem;">Head-to-Head: Traditional Agency vs Study &amp; Work</h3>
                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
                    <thead>
                      <tr style="border-bottom: 2px solid var(--color-slate-200);">
                        <th style="padding: 0.85rem 0.5rem; color: var(--color-slate-500); font-weight: 600;">Metric</th>
                        <th style="padding: 0.85rem 0.5rem; color: var(--color-slate-500); font-weight: 600;">Traditional Agency</th>
                        <th style="padding: 0.85rem 0.5rem; color: var(--color-accent-blue); font-weight: 700;">Study &amp; Work Australia</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom: 1px solid var(--color-slate-100);">
                        <td style="padding: 0.85rem 0.5rem; font-weight: 600; color: #0F172A;">Upfront Placement Fee</td>
                        <td style="padding: 0.85rem 0.5rem; color: #dc2626; font-size: 0.85rem;">15% – 25% ($12k–$25k)</td>
                        <td style="padding: 0.85rem 0.5rem; color: #16a34a; font-weight: 700; font-size: 0.85rem;">5% – 10% ($3,500–$7,000) or $0 for 12-wk trial</td>
                      </tr>
                      <tr style="border-bottom: 1px solid var(--color-slate-100);">
                        <td style="padding: 0.85rem 0.5rem; font-weight: 600; color: #0F172A;">Trial Evaluation Period</td>
                        <td style="padding: 0.85rem 0.5rem; color: var(--color-slate-600); font-size: 0.85rem;">None (immediate commitment)</td>
                        <td style="padding: 0.85rem 0.5rem; color: #16a34a; font-weight: 700; font-size: 0.85rem;">12 Weeks Zero Cost Trial talent</td>
                      </tr>
                      <tr style="border-bottom: 1px solid var(--color-slate-100);">
                        <td style="padding: 0.85rem 0.5rem; font-weight: 600; color: #0F172A;">Satisfaction Guarantee</td>
                        <td style="padding: 0.85rem 0.5rem; color: var(--color-slate-600); font-size: 0.85rem;">3 Months standard</td>
                        <td style="padding: 0.85rem 0.5rem; color: #16a34a; font-weight: 700; font-size: 0.85rem;">6 Months Free Replacement Guarantee</td>
                      </tr>
                      <tr>
                        <td style="padding: 0.85rem 0.5rem; font-weight: 600; color: #0F172A;">Retention Tenure</td>
                        <td style="padding: 0.85rem 0.5rem; color: var(--color-slate-600); font-size: 0.85rem;">Average 14 months tenure</td>
                        <td style="padding: 0.85rem 0.5rem; color: #16a34a; font-weight: 700; font-size: 0.85rem;">3+ Years average host employer tenure</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button onclick="openModal('hire')" class="btn btn-primary" style="padding: 0.65rem 1.25rem; font-size: 0.85rem;">Host an Intern at Zero Cost &rarr;</button>
                <button onclick="openModal('consultation')" class="btn btn-secondary" style="padding: 0.65rem 1.25rem; font-size: 0.85rem;">Employer Cost Calculator &rarr;</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EMPLOYER ROI VIDEO SPOTLIGHT (LEFT VIDEO + RIGHT TEXT) -->
      <section class="section section-spider-dark">
        <div class="container">
          <div class="media-spotlight-grid">
            <div class="media-spotlight-video">
              ${renderVideoPlayer('employerVideo.mp4', 'Employer Talent Solutions & ROI Breakdown', '5m 18s')}
            </div>
            <div class="media-spotlight-content">
              <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Host Partner Success</span>
              <h2 class="heading-1">Experience The Power of Try Before You Hire</h2>
              <p class="lead-text">
                Watch how Australian employers scale high-performing teams, avoid costly recruitment mis-hires, and access motivated graduates through our structured talent framework.
              </p>
              <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                <button onclick="openModal('hire')" class="btn btn-primary">Host an Intern at Zero Cost &rarr;</button>
                <button onclick="openModal('consultation')" class="btn btn-secondary">Book Employer Consultation &rarr;</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ======================================================================
         SKILLED MIGRANTS ADVOCACY
         ====================================================================== -->
    <div id="skilled-migrants" class="target-anchor-section">
      <!-- ADVOCACY ARTICLE CONTENT -->
      <section class="section section-spider-light">
        <div class="container">
          <div style="text-align: center; max-width: 820px; margin: 0 auto 3rem;">
            <span class="badge-tag" style="background: rgba(217, 119, 6, 0.15); color: #B45309; border-color: rgba(217, 119, 6, 0.3); margin-bottom: 0.75rem;">National Advocacy &amp; Mobility</span>
            <h2 class="heading-1">Skilled Migrants Deserve a Fair Go</h2>
            <p class="lead-text" style="margin-top: 0.5rem;">Unlocking Australia's immense overseas-qualified talent pool by breaking down the "no local experience" barrier.</p>
          </div>

          <div class="skilled-migrants-grid" style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 2rem; align-items: start;">
            <!-- LEFT COLUMN: ADVOCACY ARTICLE -->
            <div class="card-3d-elevated card-3d-amber" style="padding: 2.75rem; line-height: 1.8; font-size: 1rem; color: var(--color-slate-700);">
              <span class="badge-tag" style="background: rgba(245, 158, 11, 0.15); color: #B45309; margin-bottom: 1rem; display: inline-block;">Industry Policy Briefing</span>
              <p style="margin-bottom: 1.5rem; font-size: 1.1rem; font-weight: 600; color: var(--color-ink); line-height: 1.6;">
                Australia has long benefited from the drive, intelligence, and ambition of overseas-qualified professionals. However, thousands of qualified accountants, software engineers, data analysts, and marketers face the classic catch-22: <strong>&ldquo;No local Australian experience, no job; no job, no local experience.&rdquo;</strong>
              </p>

              <h3 class="heading-2" style="margin: 1.75rem 0 0.85rem; color: var(--color-ink); font-size: 1.35rem;">Overcoming The &ldquo;Local Experience&rdquo; Barrier</h3>
              <p style="margin-bottom: 1.25rem;">
                When employers ask for Australian workplace experience, they are rarely questioning academic capability or technical competence. Instead, they are seeking assurance regarding cultural communication, collaborative team dynamics, and familiarity with Australian regulatory standards.
              </p>

              <div style="background: var(--color-paper); border-left: 4px solid var(--color-accent-amber); padding: 1.25rem 1.5rem; border-radius: var(--radius-sm); margin: 1.5rem 0;">
                <h4 style="font-weight: 700; color: var(--color-ink); margin-bottom: 0.4rem; font-size: 1rem;">Key Takeaway for Australian Employers:</h4>
                <p style="margin: 0; color: var(--color-slate-600); font-size: 0.92rem; line-height: 1.55;">
                  Overseas-qualified professionals bring global perspectives, multilingual communication skills, and proven resilience. By offering a structured 12-week host placement or direct graduate role, companies gain dedicated, high-performing talent at significant cost savings.
                </p>
              </div>

              <h3 class="heading-2" style="margin: 1.75rem 0 0.85rem; color: var(--color-ink); font-size: 1.35rem;">The Study &amp; Work Solution</h3>
              <p style="margin-bottom: 1.5rem;">
                Since 2007, Study &amp; Work Australia has broken down this barrier for over 8,000 candidates by connecting them with forward-thinking host companies across Sydney, Melbourne, Brisbane, and Perth. Our placements provide the verified Australian local reference and commercial portfolio needed to launch lasting professional careers.
              </p>

              <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                <button onclick="openModal('work')" class="btn btn-primary" style="background: var(--color-accent-amber); border-color: var(--color-accent-amber); color: #0F172A; font-weight: 700;">Apply as a Skilled Migrant &rarr;</button>
                <button onclick="openModal('hire')" class="btn btn-secondary">Hire Skilled Migrant Talent &rarr;</button>
              </div>
            </div>

            <!-- RIGHT COLUMN: SKILLED MIGRANT CAREER MOBILITY HUB (RICH FILLER) -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              <!-- PANEL 1: MIGRANT MOBILITY STATS -->
              <div class="card-3d-elevated card-3d-blue" style="padding: 2rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                  <h4 style="font-size: 1.15rem; font-weight: 800; color: #0C4A6E; margin: 0;">Migrant Mobility Benchmarks</h4>
                  <span style="background: rgba(2, 132, 199, 0.15); color: #0284C7; font-size: 0.72rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 999px;">Since 2007</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 1rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 1.75rem; font-weight: 800; color: #0284C7; font-family: var(--font-display);">8,000+</div>
                    <div style="font-size: 0.78rem; font-weight: 600; color: #475569; margin-top: 0.25rem;">Placed Migrants</div>
                  </div>
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 1rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 1.75rem; font-weight: 800; color: #10B981; font-family: var(--font-display);">85%+</div>
                    <div style="font-size: 0.78rem; font-weight: 600; color: #475569; margin-top: 0.25rem;">Permanent Conversion</div>
                  </div>
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 1rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 1.75rem; font-weight: 800; color: #F59E0B; font-family: var(--font-display);">100%</div>
                    <div style="font-size: 0.78rem; font-weight: 600; color: #475569; margin-top: 0.25rem;">VEVO Visa Verified</div>
                  </div>
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 1rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 1.75rem; font-weight: 800; color: #8B5CF6; font-family: var(--font-display);">19+ Yrs</div>
                    <div style="font-size: 0.78rem; font-weight: 600; color: #475569; margin-top: 0.25rem;">Industry Leadership</div>
                  </div>
                </div>
              </div>

              <!-- PANEL 2: 4-STAGE ACCELERATOR PATHWAY -->
              <div class="card-3d-elevated card-3d-emerald" style="padding: 2rem;">
                <h4 style="font-size: 1.15rem; font-weight: 800; color: #064E3B; margin: 0 0 1.25rem;">4-Step Migrant Career Accelerator</h4>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); color: #059669; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem;">1</div>
                    <div>
                      <div style="font-weight: 700; color: #0F172A; font-size: 0.95rem;">Degree &amp; VEVO Visa Verification</div>
                      <div style="font-size: 0.82rem; color: #64748B; margin-top: 0.2rem;">Free qualification assessment and legal Australian work rights audit (485, 482, 189, 190 visas).</div>
                    </div>
                  </div>
                  <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); color: #059669; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem;">2</div>
                    <div>
                      <div style="font-weight: 700; color: #0F172A; font-size: 0.95rem;">Australian Workplace CV &amp; Culture</div>
                      <div style="font-size: 0.82rem; color: #64748B; margin-top: 0.2rem;">Restructure overseas experience to highlight transferable competencies in local corporate formats.</div>
                    </div>
                  </div>
                  <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); color: #059669; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem;">3</div>
                    <div>
                      <div style="font-weight: 700; color: #0F172A; font-size: 0.95rem;">12-Week Vetted Host Placement</div>
                      <div style="font-size: 0.82rem; color: #64748B; margin-top: 0.2rem;">Hands-on commercial engagement with leading Australian companies with comprehensive insurance.</div>
                    </div>
                  </div>
                  <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); color: #059669; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem;">4</div>
                    <div>
                      <div style="font-weight: 700; color: #0F172A; font-size: 0.95rem;">Local Reference &amp; PR Pathway</div>
                      <div style="font-size: 0.82rem; color: #64748B; margin-top: 0.2rem;">Gain verified Australian managerial references and permanent employment contract offers.</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- PANEL 3: ALUMNI CASE TESTIMONIAL -->
              <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); border: 1px solid rgba(255, 255, 255, 0.12); padding: 1.75rem; border-radius: var(--radius-lg); color: #fff;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.85rem;">
                  <img src="/www.studyandwork.com.au/images/home/1.png" alt="Placed Skilled Migrant" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #38BDF8;">
                  <div>
                    <div style="font-weight: 700; font-size: 0.95rem; color: #F8FAFC;">Priya Sharma</div>
                    <div style="font-size: 0.75rem; color: #94A3B8;">Senior Tax Consultant &bull; Sydney ASX Firm</div>
                  </div>
                </div>
                <p style="font-size: 0.88rem; color: #CBD5E1; line-height: 1.55; margin: 0; font-style: italic;">
                  &ldquo;I had 4 years of overseas finance experience but got rejected for 6 months because I didn't have local Australian experience. Study &amp; Work placed me in a 12-week host role that converted into a full-time $85k package with visa nomination.&rdquo;
                </p>
                <div style="margin-top: 1rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: #38BDF8;">
                  <span>Verified Placement 2025</span>
                  <a href="/our-alumni" data-link style="color: #38BDF8; font-weight: 700; text-decoration: underline;">Read More Stories &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CANDIDATE JOURNEY VIDEO SPOTLIGHT (RIGHT VIDEO + LEFT TEXT) -->
      <section class="section section-spider-dark">
        <div class="container">
          <div class="media-spotlight-grid" style="grid-template-columns: 0.95fr 1.05fr;">
            <div class="media-spotlight-content">
              <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Real Candidate Journeys</span>
              <h2 class="heading-1">From International Student to Australian Professional</h2>
              <p class="lead-text">
                Watch our graduate alumni recount how breaking into Australian corporate environments transformed their careers, granted them local workplace references, and unlocked long-term permanent residency opportunities.
              </p>
              <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                <button onclick="openModal('work')" class="btn btn-primary">Register Candidate Profile &rarr;</button>
                <a href="/our-alumni" data-link class="btn btn-secondary">Explore Alumni Directory &rarr;</a>
              </div>
            </div>
            <div class="media-spotlight-video">
              ${renderVideoPlayer('pj.mp4', 'Candidate Career Journeys & Placement Highlights', '4m 50s')}
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

// --- 4.6 ABOUT US VIEW ---
function renderAboutView(container) {
  container.innerHTML = `
    <!-- ABOUT HERO WITH RICH BACKGROUND PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="about_hero_bg.jpg" class="hero-bg-img" alt="Study & Work Corporate Profile">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(2, 132, 199, 0.25); color: #38bdf8; border-color: rgba(2, 132, 199, 0.4);">Corporate Profile</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Connecting Potential With Opportunity Since 2007.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Budding Talents Recruitment Pty Ltd trading as <strong>STUDYANDWORK</strong> (ABN: 42 129 512 474). Operating for over 19 years as Australia's premier career bridge for university graduates, international students, and skilled migrants.
          </p>
        </div>
      </div>
    </section>

    <!-- COMPANY BACKGROUND & METRICS -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 3rem; align-items: stretch;">
          <div class="card-3d-elevated card-3d-blue" style="padding: 2.75rem;">
            <span class="badge-tag" style="background: rgba(2, 132, 199, 0.12); color: var(--color-accent-blue); border-color: rgba(2, 132, 199, 0.3); margin-bottom: 0.85rem;">Our History</span>
            <h2 class="heading-1" style="margin-top: 0.5rem; color: #0F172A;">19+ Years of Career Excellence in Australia</h2>
            <p style="color: var(--color-slate-600); margin-top: 1rem; line-height: 1.7; font-size: 1.05rem;">
              Established in 2007, Study & Work Australia was founded with a singular mission: to eliminate the "no local experience, no job" barrier faced by thousands of qualified university graduates and skilled migrants across Australia.
            </p>
            <p style="color: var(--color-slate-600); margin-top: 1rem; line-height: 1.7; font-size: 1.05rem;">
              Over nearly two decades, we have successfully placed over <strong style="color: #0284C7;">8,000 candidates</strong> into structured internships, traineeships, and direct permanent roles across <strong style="color: #0284C7;">3,000+ host businesses</strong> nationwide.
            </p>
          </div>

          <div class="card-3d-elevated card-3d-emerald about-metrics-card" style="padding: 2.75rem; display: flex; flex-direction: column; justify-content: space-around; gap: 1.75rem;">
            <div style="border-bottom: 1.5px solid rgba(5, 150, 105, 0.15); padding-bottom: 1.25rem;">
              <div style="font-size: 2.75rem; font-weight: 800; color: var(--color-accent-blue); font-family: var(--font-display); line-height: 1.1;">8,000+</div>
              <div style="font-weight: 700; color: #0F172A; margin-top: 0.35rem; font-size: 1.05rem;">Candidates Placed Into Professional Careers</div>
            </div>

            <div style="border-bottom: 1.5px solid rgba(5, 150, 105, 0.15); padding-bottom: 1.25rem;">
              <div style="font-size: 2.75rem; font-weight: 800; color: var(--color-accent-emerald); font-family: var(--font-display); line-height: 1.1;">3,000+</div>
              <div style="font-weight: 700; color: #0F172A; margin-top: 0.35rem; font-size: 1.05rem;">Host Business Partners Across Australia</div>
            </div>

            <div>
              <div style="font-size: 2.75rem; font-weight: 800; color: var(--color-accent-amber); font-family: var(--font-display); line-height: 1.1;">2007</div>
              <div style="font-weight: 700; color: #0F172A; margin-top: 0.35rem; font-size: 1.05rem;">Established & Continuously Operating (19+ Years)</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CORPORATE VIDEO PLAYER (LEFT VIDEO + RIGHT TEXT - IMAGE 3 LAYOUT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <!-- LEFT SIDE VIDEO -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('STUDYANDWORKABOUTUS.mp4', 'Study & Work Corporate Story', '6m 45s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Corporate Story</span>
            <h2 class="heading-1">Study & Work Corporate Story</h2>
            <p class="lead-text">
              Watch the corporate background and vision behind Budding Talents Recruitment trading as Study & Work Australia.
            </p>
            <button onclick="openModal('consultation')" class="btn btn-primary" style="align-self: flex-start; margin-top: 1rem;">Book Consultation &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.7 CONTACT US VIEW ---
function renderContactView(container) {
  container.innerHTML = `
    <!-- CONTACT HERO WITH RICH BACKGROUND PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="contact_hero_bg.jpg" class="hero-bg-img" alt="Study & Work Contact Desk">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(2, 132, 199, 0.25); color: #38bdf8; border-color: rgba(2, 132, 199, 0.4);">Contact Desk</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Get in Touch with Our Australian Teams.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Our national headquarters and regional offices are ready to assist candidates, host employers, and university partners across Sydney, Parramatta, and Melbourne.
          </p>
        </div>
      </div>
    </section>

    <!-- CONTACT DETAILS & FORM (LEFT: FORM + HOTLINES, RIGHT: VIDEO - IMAGE 5 LAYOUT) -->
    <section class="section section-spider-light">
      <div class="container">
        <div class="contact-page-layout-grid" style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3rem; align-items: stretch;">
          <!-- LEFT COLUMN: TOP FORM, BOTTOM HOTLINES -->
          <div style="display: flex; flex-direction: column; gap: 2rem;">
            <!-- TOP: SEND US A MESSAGE FORM -->
            <div class="contact-form-card">
              <span class="badge-tag" style="margin-bottom: 0.5rem;">Direct Messaging</span>
              <h3 class="heading-2" style="margin-bottom: 1rem;">Send Us a Message</h3>
              <form onsubmit="alert('Thank you for contacting Study & Work Australia. Our team will get back to you within 24 hours!'); return false;" style="display: flex; flex-direction: column; gap: 1rem;">
                <input type="text" placeholder="Your Full Name *" required style="padding: 0.95rem; border-radius: var(--radius-sm); outline: none;">
                <input type="email" placeholder="Your Email Address *" required style="padding: 0.95rem; border-radius: var(--radius-sm); outline: none;">
                <input type="tel" placeholder="Phone Number" style="padding: 0.95rem; border-radius: var(--radius-sm); outline: none;">
                <textarea rows="4" placeholder="How can we assist you?" required style="padding: 0.95rem; border-radius: var(--radius-sm); outline: none;"></textarea>
                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem;">Send Message &rarr;</button>
              </form>
            </div>

            <!-- BOTTOM: OFFICE LOCATIONS & HOTLINES -->
            <div>
              <span class="badge-tag">National Footprint</span>
              <h2 class="heading-2" style="margin-top: 0.5rem;">Office Locations & Hotlines</h2>

              <div style="margin-top: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem;">
                <div class="office-location-card">
                  <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                    <span style="color: var(--color-accent-blue); font-size: 1.15rem; line-height: 1.2;">📍</span>
                    <div>
                      <div style="font-weight: 700; color: var(--color-ink); font-size: 1.05rem; margin-bottom: 0.25rem;">Parramatta Head Office</div>
                      <div style="color: #475569; font-size: 0.925rem;">Level 15, 60 Station Street East, Parramatta NSW 2150</div>
                    </div>
                  </div>
                </div>

                <div class="office-location-card">
                  <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                    <span style="color: var(--color-accent-blue); font-size: 1.15rem; line-height: 1.2;">📍</span>
                    <div>
                      <div style="font-weight: 700; color: var(--color-ink); font-size: 1.05rem; margin-bottom: 0.25rem;">Sydney City Office</div>
                      <div style="color: #475569; font-size: 0.925rem;">Level 10, 66 Clarence Street, Sydney NSW 2000</div>
                    </div>
                  </div>
                </div>

                <div class="office-location-card">
                  <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                    <span style="color: var(--color-accent-blue); font-size: 1.15rem; line-height: 1.2;">📍</span>
                    <div>
                      <div style="font-weight: 700; color: var(--color-ink); font-size: 1.05rem; margin-bottom: 0.25rem;">Melbourne City Office</div>
                      <div style="color: #475569; font-size: 0.925rem;">330 Collins Street, Melbourne VIC 3000 (By Appointment)</div>
                    </div>
                  </div>
                </div>

                <div class="contact-hotlines-card">
                  <div style="font-weight: 700; color: var(--color-accent-blue); font-size: 1.05rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span>📞</span> Contact Hotlines</div>
                  <div style="font-size: 0.925rem; color: #1E293B; line-height: 1.7;">• Freecall Hotline: <strong>1300 79 80 69</strong></div>
                  <div style="font-size: 0.925rem; color: #1E293B; line-height: 1.7;">• Sydney Desk: <strong>02 8233 6138</strong></div>
                  <div style="font-size: 0.925rem; color: #1E293B; line-height: 1.7;">• Mobile: <strong>0421 338 592 | 0466 110 995</strong></div>
                  <div style="font-size: 0.925rem; color: #1E293B; line-height: 1.7;">• Email: <strong>service@studyandwork.com.au</strong></div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: CONTACT VIDEO STRETCHED TO MATCH HOTLINES -->
          <div class="contact-right-col" style="display: flex; flex-direction: column; height: 100%;">
            <div style="display: flex; flex-direction: column; height: 100%;">
              <span class="badge-tag" style="align-self: flex-start;">Virtual Office Tour</span>
              <h2 class="heading-2" style="margin-top: 0.5rem; margin-bottom: 1rem;">Experience Our Headquarters</h2>
              <div class="contact-video-stretched-wrapper" style="flex: 1; display: flex; flex-direction: column; height: 100%;">
                ${renderVideoPlayer('contact1.mp4', 'Contact & Office Tour Video', '2m 10s', true)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.8 INTERNSHIP PROGRAM VIEW ---
// --- 4.8 INTERNSHIP PROGRAM VIEW ---
function renderInternshipView(container) {
  container.innerHTML = `
    <!-- INTERNSHIP HERO WITH DEDICATED PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="internship_hero_bg.jpg" class="hero-bg-img" alt="12-Week Professional Internship Australia">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(2, 132, 199, 0.25); color: #38bdf8; border-color: rgba(2, 132, 199, 0.4);">Structured 12-Week Placement</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">12-Week Professional Internship Program.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Gain vital local Australian workplace experience with leading host companies across IT, Accounting, Engineering, Marketing, and Business Management.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('work')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-blue); border-color: var(--color-accent-blue);">Apply for Internship &rarr;</button>
            <button onclick="openModal('consultation')" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Book Free Consultation &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- DISCIPLINES & ELIGIBILITY SECTION -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Internship Disciplines</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Corporate Placements Built for Your Degree</h2>
          <p class="lead-text">Placements structured to meet Australian university Work Integrated Learning (WIL) academic credit guidelines.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">💻</div>
            <h3 class="heading-3">IT & Software Engineering</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              Full-stack web development, Python, mobile apps, DevOps cloud pipelines, cybersecurity auditing, and automated QA testing.
            </p>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">📊</div>
            <h3 class="heading-3">Professional Accounting & Tax</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              Financial reporting, MYOB & Xero reconciliation, BAS preparation, corporate audit assist, and management accounting.
            </p>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">⚙️</div>
            <h3 class="heading-3">Civil, Mech & Electrical Engineering</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              AutoCAD design, BIM modeling, site estimation, project scheduling, and quality assurance under Australian standards.
            </p>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">📈</div>
            <h3 class="heading-3">Digital Marketing & Business</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              SEO/SEM campaign management, Google Analytics 4, social media strategy, B2B lead generation, and market research.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- PROGRAM SPOTLIGHT VIDEO (LEFT VIDEO + RIGHT TEXT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <!-- LEFT SIDE VIDEO -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('v1.mp4', 'Professional Internship Program Video', '2m 45s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Program Video</span>
            <h2 class="heading-1">Australian Workplace Experience That Converts Into Paid Careers</h2>
            <p class="lead-text">
              Over 85% of interns placed through Study & Work receive direct permanent employment offers upon graduation. Watch how we bridge the gap between qualifications and job offers.
            </p>
            <ul class="media-feature-checklist">
              <li class="media-feature-item">
                <span class="media-check-icon">✓</span>
                <span>100% Fair Work Act Section 12 Compliant Vocational Placement</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon">✓</span>
                <span>Comprehensive Personal Accident & Public Liability Insurance Covered</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon">✓</span>
                <span>3,000+ Verified Australian Corporate Host Businesses</span>
              </li>
            </ul>
            <button onclick="openModal('work')" class="btn btn-primary btn-hero-primary" style="align-self: flex-start;">Apply for Internship Placement &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 4-STEP PLACEMENT PATHWAY -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Structured Process</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Your 4-Step Journey to Workplace Placement</h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem;">
          <div style="background: var(--color-surface); padding: 1.75rem; border-radius: var(--radius-md); border: 1px solid var(--color-slate-200);">
            <div style="font-weight: 800; font-size: 1.5rem; color: var(--color-accent-blue);">01</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0;">Skills Assessment</h4>
            <p style="font-size: 0.9rem; color: var(--color-slate-600);">Detailed evaluation of your degree transcripts, technical strengths, and Australian visa status.</p>
          </div>

          <div style="background: var(--color-surface); padding: 1.75rem; border-radius: var(--radius-md); border: 1px solid var(--color-slate-200);">
            <div style="font-weight: 800; font-size: 1.5rem; color: var(--color-accent-blue);">02</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0;">Resume & Coaching</h4>
            <p style="font-size: 0.9rem; color: var(--color-slate-600);">Tailored Australian workplace interview training and technical CV restructuring.</p>
          </div>

          <div style="background: var(--color-surface); padding: 1.75rem; border-radius: var(--radius-md); border: 1px solid var(--color-slate-200);">
            <div style="font-weight: 800; font-size: 1.5rem; color: var(--color-accent-blue);">03</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0;">Host Matching</h4>
            <p style="font-size: 0.9rem; color: var(--color-slate-600);">Direct placement interviews arranged with corporate hosts in Sydney, Melbourne, Brisbane or Perth.</p>
          </div>

          <div style="background: var(--color-surface); padding: 1.75rem; border-radius: var(--radius-md); border: 1px solid var(--color-slate-200);">
            <div style="font-weight: 800; font-size: 1.5rem; color: var(--color-accent-blue);">04</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0;">12-Week Placement</h4>
            <p style="font-size: 0.9rem; color: var(--color-slate-600);">Work alongside senior industry professionals with continuous Study & Work mentor support.</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 3rem;">
          <button onclick="openModal('work')" class="btn btn-primary" style="padding: 0.85rem 2rem; font-size: 1rem;">Apply for Internship via JobAdder &rarr;</button>
        </div>
      </div>
    </section>
  `;
}

// --- 4.9 GRADUATE JOB PLACEMENT VIEW ---
function renderJobPlacementView(container) {
  container.innerHTML = `
    <!-- GRADUATE PLACEMENT HERO WITH DEDICATED PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="job_placement_hero_bg.jpg" class="hero-bg-img" alt="Graduate Job Placement Services Australia">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(5, 150, 105, 0.25); color: #34d399; border-color: rgba(5, 150, 105, 0.4);">Direct Career Placement</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Graduate Job Placement Services.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Direct paid placement for university graduates with Australian host employers. 5%-10% employer placement fee structure backed by a 6-month satisfaction replacement guarantee.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('work')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald);">Register Graduate Profile &rarr;</button>
            <button onclick="openModal('hire')" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Hire Australian Graduates &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- GRADUATE ADVANTAGES SECTION -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Employer & Candidate Value</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Why Choose Direct Graduate Placement</h2>
          <p class="lead-text">Eliminating the friction between university completion and corporate employment.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">💰</div>
            <h3 class="heading-3">Transparent 5%-10% Fee Model</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6;">
              Australian employers pay only 5% of first-year salary for graduates with under 2 years experience, and 10% for experienced candidates. Zero upfront recruitment deposits.
            </p>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">🛡️</div>
            <h3 class="heading-3">6-Month Satisfaction Guarantee</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6;">
              Industry-leading 6-month free candidate replacement guarantee provides complete recruitment peace of mind for corporate HR directors and hiring managers.
            </p>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">🎓</div>
            <h3 class="heading-3">Zero Candidate Placement Fees</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6;">
              Candidates never pay recruitment fees. We guide you through CV presentation, technical interview preparation, and corporate salary negotiations at zero cost.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIAL VIDEO (LEFT VIDEO + RIGHT TEXT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <!-- LEFT SIDE VIDEO -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('interns1.mp4', 'Graduate Career Journeys', '3m 15s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Graduate Success</span>
            <h2 class="heading-1">Accelerating Graduates Into Full-Time Employment</h2>
            <p class="lead-text">
              Hear from graduates who secured direct career positions in Australian enterprises through Study & Work Australia.
            </p>
            <ul class="media-feature-checklist">
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(16, 185, 129, 0.2); color: #34D399;">✓</span>
                <span>Average Starting Salary Range: $65,000 - $95,000 + Super</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(16, 185, 129, 0.2); color: #34D399;">✓</span>
                <span>Direct Interviews with Corporate Decision Makers</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(16, 185, 129, 0.2); color: #34D399;">✓</span>
                <span>Opportunities for Temporary Graduate Visa (Subclass 485) Holders</span>
              </li>
            </ul>
            <button onclick="openModal('work')" class="btn btn-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald); align-self: flex-start;">Register Graduate Profile Now &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- HIGH-DEMAND SECTORS -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Active Roles</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Current Graduate Demand Sectors</h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
          <div style="background: var(--color-surface); padding: 1.75rem; border-radius: var(--radius-md); border: 1px solid var(--color-slate-200);">
            <div style="font-weight: 700; font-size: 1.15rem; color: var(--color-ink);">Software & Cloud</div>
            <div style="color: var(--color-accent-emerald); font-weight: 600; margin: 0.25rem 0;">$75,000 - $95,000</div>
            <p style="font-size: 0.875rem; color: var(--color-slate-600); margin-top: 0.5rem;">Full-stack development, cloud engineering, cybersecurity analysts, and data science.</p>
          </div>

          <div style="background: var(--color-surface); padding: 1.75rem; border-radius: var(--radius-md); border: 1px solid var(--color-slate-200);">
            <div style="font-weight: 700; font-size: 1.15rem; color: var(--color-ink);">Finance & Tax</div>
            <div style="color: var(--color-accent-emerald); font-weight: 600; margin: 0.25rem 0;">$70,000 - $88,000</div>
            <p style="font-size: 0.875rem; color: var(--color-slate-600); margin-top: 0.5rem;">Graduate auditors, commercial financial analysts, tax consultants, and payroll accountants.</p>
          </div>

          <div style="background: var(--color-surface); padding: 1.75rem; border-radius: var(--radius-md); border: 1px solid var(--color-slate-200);">
            <div style="font-weight: 700; font-size: 1.15rem; color: var(--color-ink);">Engineering</div>
            <div style="color: var(--color-accent-emerald); font-weight: 600; margin: 0.25rem 0;">$72,000 - $92,000</div>
            <p style="font-size: 0.875rem; color: var(--color-slate-600); margin-top: 0.5rem;">Civil infrastructure, mechanical systems, building services, and project management.</p>
          </div>

          <div style="background: var(--color-surface); padding: 1.75rem; border-radius: var(--radius-md); border: 1px solid var(--color-slate-200);">
            <div style="font-weight: 700; font-size: 1.15rem; color: var(--color-ink);">Business & Operations</div>
            <div style="color: var(--color-accent-emerald); font-weight: 600; margin: 0.25rem 0;">$68,000 - $85,000</div>
            <p style="font-size: 0.875rem; color: var(--color-slate-600); margin-top: 0.5rem;">Operations analysts, digital project coordinators, B2B account managers, and logistics.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.10 PROFESSIONAL STAFFING VIEW ---
function renderStaffingView(container) {
  container.innerHTML = `
    <!-- STAFFING HERO WITH DEDICATED PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="staffing_hero_bg.jpg" class="hero-bg-img" alt="Corporate Staffing Solutions Australia">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(2, 132, 199, 0.25); color: #38bdf8; border-color: rgba(2, 132, 199, 0.4);">Corporate Staffing</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Professional & Permanent Staffing Solutions.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            End-to-end recruitment, payroll, superannuation, and candidate management for Australian enterprises since 2007.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('hire')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-blue); border-color: var(--color-accent-blue);">Request Staffing &rarr;</button>
            <a href="tel:1300798069" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Call Hotline 1300 79 80 69 &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- STAFFING MODELS BREAKDOWN -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Recruitment Framework</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Engineered for Australian Business</h2>
          <p class="lead-text">Three flexible engagement models designed to lower recruitment costs and accelerate onboarding.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
          <div style="background: var(--color-surface); border: 2px solid var(--color-accent-blue); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <span class="badge-tag" style="background: var(--color-accent-blue); color: #fff; margin-bottom: 1rem;">Zero-Risk Trial</span>
            <h3 class="heading-2">12-Week Intern Evaluation</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
              Test candidates on actual workplace projects over 12 weeks with zero placement fee. 100% Fair Work compliant vocational placement with full insurance provided.
            </p>
            <button onclick="openModal('hire')" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; text-align: center;">Host an Intern &rarr;</button>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <span class="badge-tag" style="margin-bottom: 1rem;">Direct Recruitment</span>
            <h3 class="heading-2">Permanent Recruitment</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
              Only 5% placement fee for &lt;2 years experience, 10% for senior candidates. Includes a 6-month free candidate replacement guarantee.
            </p>
            <button onclick="openModal('hire')" class="btn btn-secondary" style="width: 100%; margin-top: 1.5rem; text-align: center;">Request Direct Hire &rarr;</button>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <span class="badge-tag" style="margin-bottom: 1rem;">On-Hire Temp</span>
            <h3 class="heading-2">On-Demand Casual Staffing</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
              Transparent 65% markup on modern award rates. We manage complete payroll, tax withholdings, superannuation, and workers compensation.
            </p>
            <a href="/casual-staffing" data-link class="btn btn-secondary" style="width: 100%; margin-top: 1.5rem; text-align: center;">Casual Staffing &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- VIDEO SPOTLIGHT (LEFT VIDEO + RIGHT TEXT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <!-- LEFT SIDE VIDEO -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('staffing.mp4', 'Professional Staffing Solution Video', '3m 50s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Corporate Video</span>
            <h2 class="heading-1">Corporate Staffing Overview & Client Outcomes</h2>
            <p class="lead-text">
              Over 3,000 Australian enterprises have partnered with Study & Work since 2007. See how our bespoke sourcing saves time and recruitment expenditure.
            </p>
            <ul class="media-feature-checklist">
              <li class="media-feature-item">
                <span class="media-check-icon">✓</span>
                <span>24-48 Hour Candidate Shortlist Turnaround</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon">✓</span>
                <span>Complete VEVO Work Rights and Qualification Verification</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon">✓</span>
                <span>6-Month Candidate Satisfaction Replacement Guarantee</span>
              </li>
            </ul>
            <button onclick="openModal('hire')" class="btn btn-primary btn-hero-primary" style="align-self: flex-start;">Submit Employer Staffing Request &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.11 CASUAL JOBS VIEW ---
function renderCasualJobsView(container) {
  container.innerHTML = `
    <!-- CASUAL JOBS HERO WITH DEDICATED PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="casual_jobs_hero_bg.jpg" class="hero-bg-img" alt="Casual Jobs for Students Australia">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(217, 119, 6, 0.25); color: #fcd34d; border-color: rgba(217, 119, 6, 0.4);">Student Jobs</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Casual Jobs for Students in Australia.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Flexible casual work opportunities matching Australian student visa work limits (48 hours per fortnight during semester terms).
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('work')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-amber); border-color: var(--color-accent-amber);">Explore Casual Jobs &rarr;</button>
            <button onclick="openModal('consultation')" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Visa Work Consultation &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- POPULAR CASUAL SECTORS -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Job Categories</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Flexible Student Work Across Australia</h2>
          <p class="lead-text">Earn while studying with vetted Australian employers who respect your academic timetable and visa regulations.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <!-- CARD 1: HOSPITALITY & BARISTA (WARM AMBER) -->
          <div class="card-3d-elevated card-3d-amber" style="background: linear-gradient(180deg, #FFFFFF 0%, #FFFBEB 100%); border-top: 5px solid #F59E0B; padding: 2.25rem 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-card);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
              <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(245, 158, 11, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; border: 1px solid rgba(245, 158, 11, 0.3);">☕</div>
              <span style="background: rgba(245, 158, 11, 0.15); color: #B45309; font-size: 0.75rem; font-weight: 700; padding: 0.3rem 0.75rem; border-radius: 999px; letter-spacing: 0.02em;">Award Wages + 25% Loading</span>
            </div>
            <h3 class="heading-3" style="color: #92400E; margin-bottom: 0.5rem; font-size: 1.25rem;">Hospitality &amp; Barista</h3>
            <p style="color: #475569; margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              Specialty cafes, hotel dining, banquet catering, and licensed venues. Award wages with 25% casual loading and weekend penalty rates.
            </p>
            <div style="margin-top: 1.25rem; font-size: 0.85rem; font-weight: 700; color: #D97706; display: flex; align-items: center; gap: 0.35rem;">
              Explore Cafe &amp; Dining Shifts &rarr;
            </div>
          </div>

          <!-- CARD 2: RETAIL & CUSTOMER EXPERIENCE (VIVID SKY BLUE) -->
          <div class="card-3d-elevated card-3d-blue" style="background: linear-gradient(180deg, #FFFFFF 0%, #F0F9FF 100%); border-top: 5px solid #0284C7; padding: 2.25rem 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-card);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
              <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(2, 132, 199, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; border: 1px solid rgba(2, 132, 199, 0.3);">🛍️</div>
              <span style="background: rgba(2, 132, 199, 0.15); color: #0369A1; font-size: 0.75rem; font-weight: 700; padding: 0.3rem 0.75rem; border-radius: 999px; letter-spacing: 0.02em;">Flexible Shopping Centres</span>
            </div>
            <h3 class="heading-3" style="color: #0369A1; margin-bottom: 0.5rem; font-size: 1.25rem;">Retail &amp; Customer Experience</h3>
            <p style="color: #475569; margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              Fashion boutiques, electronics stores, and supermarkets across Sydney, Melbourne, and Brisbane retail centres.
            </p>
            <div style="margin-top: 1.25rem; font-size: 0.85rem; font-weight: 700; color: #0284C7; display: flex; align-items: center; gap: 0.35rem;">
              Explore Store &amp; Sales Roles &rarr;
            </div>
          </div>

          <!-- CARD 3: EVENT OPERATIONS & VENUES (ROYAL PURPLE) -->
          <div class="card-3d-elevated card-3d-purple" style="background: linear-gradient(180deg, #FFFFFF 0%, #FAF5FF 100%); border-top: 5px solid #8B5CF6; padding: 2.25rem 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-card);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
              <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(139, 92, 246, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; border: 1px solid rgba(139, 92, 246, 0.3);">🎪</div>
              <span style="background: rgba(139, 92, 246, 0.15); color: #6D28D9; font-size: 0.75rem; font-weight: 700; padding: 0.3rem 0.75rem; border-radius: 999px; letter-spacing: 0.02em;">Stadiums &amp; Concerts</span>
            </div>
            <h3 class="heading-3" style="color: #6D28D9; margin-bottom: 0.5rem; font-size: 1.25rem;">Event Operations &amp; Venues</h3>
            <p style="color: #475569; margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              Concerts, corporate conferences, sporting stadiums, and trade exhibitions. Highly flexible weekend shifts.
            </p>
            <div style="margin-top: 1.25rem; font-size: 0.85rem; font-weight: 700; color: #8B5CF6; display: flex; align-items: center; gap: 0.35rem;">
              Explore Weekend Shifts &rarr;
            </div>
          </div>

          <!-- CARD 4: WAREHOUSING & LOGISTICS (EMERALD GREEN) -->
          <div class="card-3d-elevated card-3d-emerald" style="background: linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%); border-top: 5px solid #10B981; padding: 2.25rem 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-card);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
              <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(16, 185, 129, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; border: 1px solid rgba(16, 185, 129, 0.3);">📦</div>
              <span style="background: rgba(16, 185, 129, 0.15); color: #047857; font-size: 0.75rem; font-weight: 700; padding: 0.3rem 0.75rem; border-radius: 999px; letter-spacing: 0.02em;">High Hourly Rates</span>
            </div>
            <h3 class="heading-3" style="color: #065F46; margin-bottom: 0.5rem; font-size: 1.25rem;">Warehousing &amp; Logistics</h3>
            <p style="color: #475569; margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              Inventory management, picking, packing, and dispatch operations in modern fulfillment centres.
            </p>
            <div style="margin-top: 1.25rem; font-size: 0.85rem; font-weight: 700; color: #10B981; display: flex; align-items: center; gap: 0.35rem;">
              Explore Logistics Shifts &rarr;
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VISA COMPLIANCE SPOTLIGHT (LEFT VIDEO + RIGHT TEXT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <!-- LEFT SIDE VIDEO -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('v1.mp4', 'Student Casual Work & Visa Rights', '2m 45s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Visa Compliance</span>
            <h2 class="heading-1">Student Visa Work Rights & Pay Standards</h2>
            <p class="lead-text">
              Protecting your international student visa (Subclass 500) while maximizing your earning potential legally in Australia.
            </p>
            <ul class="media-feature-checklist">
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(217, 119, 6, 0.2); color: #FBBF24;">✓</span>
                <span>48 Hours Per Fortnight During Active Semester Terms</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(217, 119, 6, 0.2); color: #FBBF24;">✓</span>
                <span>Unlimited Work Hours During Scheduled University Breaks</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(217, 119, 6, 0.2); color: #FBBF24;">✓</span>
                <span>Minimum Legal Wage: $24.97/hr + 25% Casual Loading = $31.21+/hr</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(217, 119, 6, 0.2); color: #FBBF24;">✓</span>
                <span>11.5% Mandatory Superannuation Contribution by Employer</span>
              </li>
            </ul>
            <button onclick="openModal('work')" class="btn btn-primary" style="background: var(--color-accent-amber); border-color: var(--color-accent-amber); align-self: flex-start;">Register for Casual Student Jobs &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.12 CASUAL STAFFING VIEW ---
function renderCasualStaffingView(container) {
  container.innerHTML = `
    <!-- CASUAL STAFFING HERO WITH DEDICATED PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="staffing_hero_bg.jpg" class="hero-bg-img" alt="On-Demand Casual Staffing Solutions">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(2, 132, 199, 0.25); color: #38bdf8; border-color: rgba(2, 132, 199, 0.4);">Employer Casual Staffing</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">On-Demand Casual Workforce Solutions.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Rapid response casual staffing for hospitality, retail, customer service, and events with a 65% markup covering salary, super, tax, and insurance.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('hire')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-blue); border-color: var(--color-accent-blue);">Hire Casual Staff &rarr;</button>
            <a href="tel:1300798069" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Call 1300 79 80 69 &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- MARKUP BREAKDOWN SECTION -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Pricing Transparency</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">The 65% On-Hire Markup Model</h2>
          <p class="lead-text">No hidden fees, no payroll administration headaches. Everything is handled under one simple hourly rate.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">💵</div>
            <h3 class="heading-3">Base Casual Award Pay</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              Full compliance with Australian Modern Award wage rates including the statutory 25% casual loading for all worked hours.
            </p>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">📑</div>
            <h3 class="heading-3">Superannuation & Tax</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              11.5% compulsory superannuation guarantee, state payroll tax, and PAYG withholding handled completely by Study & Work.
            </p>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">🛡️</div>
            <h3 class="heading-3">Insurance & Compliance</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              Full Workers Compensation insurance policy coverage and public liability indemnity for all on-site casual employees.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- VIDEO SPOTLIGHT (LEFT VIDEO + RIGHT TEXT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <!-- LEFT SIDE VIDEO -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('staffing.mp4', 'Casual Staffing Workforce Solutions', '3m 50s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Workforce On-Demand</span>
            <h2 class="heading-1">Scalable Casual Teams Ready in 24 Hours</h2>
            <p class="lead-text">
              Solve unexpected staff shortages, seasonal peaks, and event requirements without the hassle of direct recruitment.
            </p>
            <ul class="media-feature-checklist">
              <li class="media-feature-item">
                <span class="media-check-icon">✓</span>
                <span>24-48 Hour Emergency Roster Replacements</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon">✓</span>
                <span>100% VEVO Verified Work Authorisation</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon">✓</span>
                <span>Consolidated Weekly Invoicing</span>
              </li>
            </ul>
            <button onclick="openModal('hire')" class="btn btn-primary btn-hero-primary" style="align-self: flex-start;">Request Casual Staffing Now &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.13 APPRENTICESHIP VIEW ---
function renderApprenticeshipView(container) {
  container.innerHTML = `
    <!-- APPRENTICESHIP HERO WITH DEDICATED PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="apprenticeship_hero_bg.jpg" class="hero-bg-img" alt="Apprenticeship & Traineeship Programs Australia">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(217, 119, 6, 0.25); color: #fcd34d; border-color: rgba(217, 119, 6, 0.4);">Trade & Vocational</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Apprenticeship & Traineeship Programs.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Earn while learning in trade, technical, and commercial operations supported by Australian government subsidies.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('work')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-amber); border-color: var(--color-accent-amber);">Apply for Traineeship &rarr;</button>
            <button onclick="openModal('hire')" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Host an Apprentice &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- VOCATIONAL SPECIALISATIONS -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Vocational Disciplines</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Nationally Recognized Qualification Pathways</h2>
          <p class="lead-text">Accredited Certificate III & IV qualifications delivered in partnership with leading Australian TAFEs and RTOs.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">⚡</div>
            <h3 class="heading-3">Electrotechnology & Renewables</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              Commercial electrical wiring, solar PV installation, industrial automation, and high-voltage maintenance.
            </p>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">🔧</div>
            <h3 class="heading-3">Engineering & Mechanical Fitting</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              CNC precision machining, metal fabrication, heavy plant equipment mechanics, and robotics assembly.
            </p>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">👨‍🍳</div>
            <h3 class="heading-3">Commercial Cookery & Hospitality</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              Certificate III in Commercial Cookery, pastry production, food safety management, and banquet operations.
            </p>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">💼</div>
            <h3 class="heading-3">Business & Logistics Traineeships</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6; font-size: 0.95rem;">
              Certificate IV in Business Administration, supply chain coordination, project office assist, and customer care.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- VIDEO SPOTLIGHT (LEFT VIDEO + RIGHT TEXT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <!-- LEFT SIDE VIDEO -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('apprentice.mp4', 'Apprenticeship & Traineeship Video', '3m 30s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Program Video</span>
            <h2 class="heading-1">Government Subsidized Apprenticeship Host Management</h2>
            <p class="lead-text">
              Study & Work operates as an experienced host employer partner, handling apprentice training contract administration, RTO liaison, and claim processing.
            </p>
            <ul class="media-feature-checklist">
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(217, 119, 6, 0.2); color: #FBBF24;">✓</span>
                <span>Access to Australian Priority Wage Subsidies</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(217, 119, 6, 0.2); color: #FBBF24;">✓</span>
                <span>Comprehensive Workplace Health and Safety (WHS) Inductions</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(217, 119, 6, 0.2); color: #FBBF24;">✓</span>
                <span>Flexible Rotation Across Leading Host Companies</span>
              </li>
            </ul>
            <button onclick="openModal('hire')" class="btn btn-primary" style="background: var(--color-accent-amber); border-color: var(--color-accent-amber); align-self: flex-start;">Host an Apprentice Now &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.14 KNOW YOUR RIGHTS VIEW ---
function renderKnowYourRightsView(container) {
  container.innerHTML = `
    <!-- KNOW YOUR RIGHTS HERO WITH DEDICATED PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="know_your_rights_hero_bg.jpg" class="hero-bg-img" alt="Know Your Rights Under Fair Work Act Australia">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(5, 150, 105, 0.25); color: #34d399; border-color: rgba(5, 150, 105, 0.4);">Fair Work Compliance</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Know Your Rights Under the Fair Work Act.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Essential legal protections for international students, university interns, and Australian workers under the Fair Work Act 2009.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('consultation')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald);">Free Rights Consultation &rarr;</button>
            <button onclick="openModal('work')" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Apply With Protected Host &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- LEGAL BOUNDARIES SECTION -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Statutory Framework</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Vocational Placement Legal Boundaries</h2>
          <p class="lead-text">Understanding the critical legal difference between an educational vocational placement and an employment relationship.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem;">
          <div style="background: var(--color-surface); border: 2px solid var(--color-accent-blue); border-radius: var(--radius-lg); padding: 2.25rem; box-shadow: var(--shadow-card);">
            <span class="badge-tag" style="background: var(--color-accent-blue); color: #fff; margin-bottom: 1rem;">Section 12 Exemption</span>
            <h3 class="heading-2">Lawful Vocational Placement (Unpaid)</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
              Under Section 12 of the Australian Fair Work Act 2009, an internship is legally exempt from minimum wage requirements ONLY when all three criteria are met:
            </p>
            <ul style="margin: 1.5rem 0; padding-left: 1.25rem; color: var(--color-slate-700); font-size: 0.9375rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><strong>Course Requirement:</strong> Must be a mandatory component of an authorized Australian higher education or vocational course.</li>
              <li><strong>Educational Focus:</strong> The primary beneficiary must be the student acquiring practical learning, not the host extracting commercial labor.</li>
              <li><strong>Authorized Arrangement:</strong> Formal agreement entered between the university, host employer, and candidate.</li>
            </ul>
            <div style="background: rgba(2, 132, 199, 0.08); border-left: 4px solid var(--color-accent-blue); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.875rem; color: var(--color-ink);">
              All Study & Work internships satisfy 100% of Fair Work Section 12 statutory provisions.
            </div>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2.25rem; box-shadow: var(--shadow-card);">
            <span class="badge-tag" style="background: rgba(5, 150, 105, 0.1); color: var(--color-accent-emerald); border-color: rgba(5, 150, 105, 0.2); margin-bottom: 1rem;">Standard Employment</span>
            <h3 class="heading-2">Employment Relationship (Paid)</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
              If an internship does NOT satisfy Section 12, the individual is classified as an employee under Australian workplace law and is entitled to:
            </p>
            <ul style="margin: 1.5rem 0; padding-left: 1.25rem; color: var(--color-slate-700); font-size: 0.9375rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><strong>Minimum Award Wage:</strong> Statutory minimum hourly rate under the applicable Modern Award ($24.97+/hr).</li>
              <li><strong>Casual Loading:</strong> 25% additional hourly loading if engaged as a casual worker.</li>
              <li><strong>Superannuation:</strong> 11.5% super paid into your nominated superannuation fund.</li>
              <li><strong>National Employment Standards (NES):</strong> Protections regarding maximum hours, paid breaks, and public holiday rates.</li>
            </ul>
            <div style="background: rgba(5, 150, 105, 0.08); border-left: 4px solid var(--color-accent-emerald); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.875rem; color: var(--color-ink);">
              We ensure our candidates are never subjected to sham contracting or illegal unpaid labor.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- OMBUDSMAN & WORKER ADVOCACY (LEFT VIDEO + RIGHT TEXT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <!-- LEFT SIDE VIDEO -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('v1.mp4', 'Fair Work Legal Safeguards Overview', '2m 45s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Ombudsman Standards</span>
            <h2 class="heading-1">Equal Protections for International Students</h2>
            <p class="lead-text">
              In Australia, international visa holders have the exact same rights as Australian citizens under the Fair Work Act. An employer cannot threaten your visa status to avoid paying lawful wages.
            </p>
            <ul class="media-feature-checklist">
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(16, 185, 129, 0.2); color: #34D399;">✓</span>
                <span>Protection Against Unlawful Pay Deductions & Cash Underpayment</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(16, 185, 129, 0.2); color: #34D399;">✓</span>
                <span>Assurance Protocol Between Fair Work Ombudsman and Home Affairs</span>
              </li>
              <li class="media-feature-item">
                <span class="media-check-icon" style="background: rgba(16, 185, 129, 0.2); color: #34D399;">✓</span>
                <span>Full Personal Accident & Public Liability Insurance Provided</span>
              </li>
            </ul>
            <button onclick="openModal('consultation')" class="btn btn-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald); align-self: flex-start;">Speak With a Fair Work Advisor &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.15 ALUMNI DIRECTORY VIEW ---
function renderAlumniView(container) {
  container.innerHTML = `
    <!-- ALUMNI HERO WITH DEDICATED PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="alumni_hero_bg.jpg" class="hero-bg-img" alt="8000+ Alumni Directory Australia">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(5, 150, 105, 0.25); color: #34d399; border-color: rgba(5, 150, 105, 0.4);">Audited Outcomes</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">8,000+ Graduate Success Stories.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Search and explore verified career outcomes from candidates placed into over 3,000 Australian host businesses since 2007.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('work')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald);">Join Our Alumni Network &rarr;</button>
            <button onclick="openModal('consultation')" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Explore Candidate Pathways &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- LIVE SEARCHABLE ALUMNI DIRECTORY — ORIGINKIT PARTICLE DRIFT 3 & 3D CARDS -->
    <section class="section section-particle-drift">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 2.5rem;">
          <span class="badge-tag">Verified Directory</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Search Verified Alumni Outcomes</h2>
          <p class="lead-text">Browse real placements across Australian corporate host firms.</p>
        </div>

        <div style="max-width: 600px; margin: 0 auto 2.5rem;">
          <input type="text" id="alumniSearchInput" placeholder="Search by candidate name, university, degree, or job role..." style="width: 100%; padding: 1rem 1.5rem; border-radius: var(--radius-full); font-size: 1rem; outline: none;">
        </div>

        <div id="alumniGridContainer" class="alumni-grid-3"></div>
      </div>
    </section>

    <!-- ALUMNI NETWORK VIDEO SPOTLIGHT (LEFT VIDEO + RIGHT TEXT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <!-- LEFT SIDE VIDEO -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('our_alumni.mp4', 'Alumni Placement Video', '3m 10s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Alumni Video</span>
            <h2 class="heading-1">19+ Years of Career Transformations</h2>
            <p class="lead-text">
              Watch our alumni share how their initial 12-week placement transformed into permanent roles and Australian permanent residency pathways.
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
              <div style="background: rgba(255, 255, 255, 0.08); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255, 255, 255, 0.12);">
                <div style="font-size: 2rem; font-weight: 800; color: var(--color-accent-emerald);">8,000+</div>
                <div style="color: var(--color-slate-300); font-size: 0.875rem;">Total Candidates Placed</div>
              </div>
              <div style="background: rgba(255, 255, 255, 0.08); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255, 255, 255, 0.12);">
                <div style="font-size: 2rem; font-weight: 800; color: var(--color-accent-blue);">85%+</div>
                <div style="color: var(--color-slate-300); font-size: 0.875rem;">Permanent Job Offers</div>
              </div>
            </div>
            <button onclick="openModal('work')" class="btn btn-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald); align-self: flex-start;">Register Candidate Profile &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- 4.16 ARTICLE VIEW ---
function renderArticleView(container, slug) {
  if (slug === 'skilled-migrants') {
    container.innerHTML = `
      <!-- ARTICLE HERO WITH DEDICATED PHOTOGRAPHY -->
      <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
        <img src="resources_hero_bg.jpg" class="hero-bg-img" alt="Skilled Migrants Deserve a Fair Go">
        <div class="hero-gradient-overlay"></div>
        <div class="container hero-container" style="position: relative; z-index: 4;">
          <div style="max-width: 800px;">
            <a href="/resources" data-link style="color: var(--color-accent-blue); font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">&larr; Back to Resources Hub</a>
            <span class="badge-tag hero-badge" style="background: rgba(217, 119, 6, 0.25); color: #fbbf24; border-color: rgba(217, 119, 6, 0.4); display: block; width: fit-content;">Advocacy & Insights</span>
            <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Skilled Migrants Deserve a Fair Go</h1>
            <p class="lead-text hero-lead" style="margin-top: 1rem;">Published by Study & Work Australia Research & Policy Division</p>
          </div>
        </div>
      </section>

      <!-- ARTICLE CONTENT SECTION -->
      <section class="section section-spider-light">
        <div class="container" style="max-width: 840px;">
          <div style="background: var(--color-surface); padding: 3rem; border-radius: var(--radius-lg); border: 1px solid var(--color-slate-200); box-shadow: var(--shadow-card); line-height: 1.8; font-size: 1.05rem; color: var(--color-slate-700);">
            <p style="margin-bottom: 1.5rem; font-size: 1.15rem; font-weight: 500; color: var(--color-ink);">
              Australia has long benefited from the drive, intelligence, and ambition of overseas-qualified professionals. However, thousands of qualified skilled migrants face the classic catch-22: "No local Australian experience, no job; no job, no local experience."
            </p>

            <h2 class="heading-2" style="margin: 2rem 0 1rem; color: var(--color-ink);">Overcoming the "Local Experience" Barrier</h2>
            <p style="margin-bottom: 1.5rem;">
              When employers ask for Australian workplace experience, they are frequently seeking assurance regarding cultural communication, team collaboration, and familiarity with Australian regulatory standards.
            </p>

            <div style="background: var(--color-paper); border-left: 4px solid var(--color-accent-blue); padding: 1.5rem; border-radius: var(--radius-sm); margin: 2rem 0;">
              <h4 style="font-weight: 700; color: var(--color-ink); margin-bottom: 0.5rem;">Key Takeaway for Employers:</h4>
              <p style="margin: 0; color: var(--color-slate-600); font-size: 0.95rem;">
                Overseas-qualified professionals bring global perspectives, bilingual capabilities, and proven resilience. By offering a structured 12-week host placement or direct graduate role, companies gain high-performing talent at significant cost savings.
              </p>
            </div>

            <h2 class="heading-2" style="margin: 2rem 0 1rem; color: var(--color-ink);">The Study & Work Solution</h2>
            <p style="margin-bottom: 1.5rem;">
              Since 2007, Study & Work has broken down this barrier for over 8,000 candidates by connecting them with forward-thinking host companies across Sydney, Melbourne, Brisbane, and Perth.
            </p>

            <div style="margin-top: 2.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
              <button onclick="openModal('work')" class="btn btn-primary">Apply as a Candidate &rarr;</button>
              <button onclick="openModal('hire')" class="btn btn-secondary">Hire Skilled Migrant Talent &rarr;</button>
            </div>
          </div>
        </div>
      </section>

      <!-- RELATED ARTICLES SECTION -->
      <section class="section section-spider-dark">
        <div class="container" style="max-width: 840px;">
          <div style="text-align: center; margin-bottom: 2rem;">
            <span class="badge-tag">Continue Reading</span>
            <h2 class="heading-2" style="color: #fff; margin-top: 0.5rem;">More Publications from Study & Work</h2>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.12); padding: 1.5rem; border-radius: var(--radius-md);">
              <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 0.5rem;">Invest in Emerging Talent for Maximum ROI</h4>
              <p style="color: var(--color-slate-400); font-size: 0.9rem; margin-bottom: 1rem;">Why hiring graduates yields superior long-term retention.</p>
              <a href="/resources/invest-in-emerging-talent-for-the-maximum-roi" data-link style="color: var(--color-accent-blue); font-weight: 600;">Read Article &rarr;</a>
            </div>
            <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.12); padding: 1.5rem; border-radius: var(--radius-md);">
              <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 0.5rem;">Know Your Legal Rights Under Fair Work Act</h4>
              <p style="color: var(--color-slate-400); font-size: 0.9rem; margin-bottom: 1rem;">Essential rules governing Australian internships and casual work.</p>
              <a href="/know-your-rights" data-link style="color: var(--color-accent-blue); font-weight: 600;">View Rights Guide &rarr;</a>
            </div>
          </div>
        </div>
      </section>
    `;
  } else {
    container.innerHTML = `
      <!-- ARTICLE HERO WITH DEDICATED PHOTOGRAPHY -->
      <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
        <img src="resources_hero_bg.jpg" class="hero-bg-img" alt="Invest in Emerging Talent for Maximum ROI">
        <div class="hero-gradient-overlay"></div>
        <div class="container hero-container" style="position: relative; z-index: 4;">
          <div style="max-width: 800px;">
            <a href="/resources" data-link style="color: var(--color-accent-blue); font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">&larr; Back to Resources Hub</a>
            <span class="badge-tag hero-badge" style="background: rgba(2, 132, 199, 0.25); color: #38bdf8; border-color: rgba(2, 132, 199, 0.4); display: block; width: fit-content;">Employer Research</span>
            <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Invest in Emerging Talent for Maximum ROI</h1>
            <p class="lead-text hero-lead" style="margin-top: 1rem;">Published by Study & Work Employer Research</p>
          </div>
        </div>
      </section>

      <!-- ARTICLE CONTENT SECTION -->
      <section class="section section-spider-light">
        <div class="container" style="max-width: 840px;">
          <div style="background: var(--color-surface); padding: 3rem; border-radius: var(--radius-lg); border: 1px solid var(--color-slate-200); box-shadow: var(--shadow-card); line-height: 1.8; font-size: 1.05rem; color: var(--color-slate-700);">
            <p style="margin-bottom: 1.5rem; font-size: 1.15rem; font-weight: 500; color: var(--color-ink);">
              For Australian small-to-medium enterprises and corporate departments, hiring senior talent is increasingly costly. Research demonstrates that investing in enthusiastic university graduates yields significantly higher long-term return on investment (ROI).
            </p>

            <h2 class="heading-2" style="margin: 2rem 0 1rem; color: var(--color-ink);">Why Internships Deliver Superior Results</h2>
            <p style="margin-bottom: 1.5rem;">
              Hosting an intern over a 12-week period allows managers to evaluate technical skills, adaptability, and cultural alignment with zero upfront financial risk.
            </p>

            <div style="background: var(--color-paper); border-left: 4px solid var(--color-accent-emerald); padding: 1.5rem; border-radius: var(--radius-sm); margin: 2rem 0;">
              <h4 style="font-weight: 700; color: var(--color-ink); margin-bottom: 0.5rem;">Key Research Metric:</h4>
              <p style="margin: 0; color: var(--color-slate-600); font-size: 0.95rem;">
                Australian SMEs that evaluate candidates through structured 12-week internships report an 85%+ permanent hiring conversion rate, cutting average recruitment agency costs by up to 70%.
              </p>
            </div>

            <h2 class="heading-2" style="margin: 2rem 0 1rem; color: var(--color-ink);">Cost Comparison: Traditional Agency vs Study & Work</h2>
            <p style="margin-bottom: 1.5rem;">
              Traditional recruitment agencies charge 15%-25% upfront placement fees with restrictive 3-month replacement terms. Study & Work delivers zero-cost 12-week trial talent, and direct placement fees of only 5%-10% backed by an unmatched 6-month replacement guarantee.
            </p>

            <div style="margin-top: 2.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
              <button onclick="openModal('hire')" class="btn btn-primary">Host an Intern at Zero Cost &rarr;</button>
              <button onclick="openModal('consultation')" class="btn btn-secondary">Book Employer Consultation &rarr;</button>
            </div>
          </div>
        </div>
      </section>

      <!-- RELATED ARTICLES SECTION -->
      <section class="section section-spider-dark">
        <div class="container" style="max-width: 840px;">
          <div style="text-align: center; margin-bottom: 2rem;">
            <span class="badge-tag">Continue Reading</span>
            <h2 class="heading-2" style="color: #fff; margin-top: 0.5rem;">More Publications from Study & Work</h2>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.12); padding: 1.5rem; border-radius: var(--radius-md);">
              <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 0.5rem;">Skilled Migrants Deserve a Fair Go</h4>
              <p style="color: var(--color-slate-400); font-size: 0.9rem; margin-bottom: 1rem;">Unlocking international talent for Australian businesses.</p>
              <a href="/resources/skilled-migrants-deserve-a-fair-go" data-link style="color: var(--color-accent-blue); font-weight: 600;">Read Article &rarr;</a>
            </div>
            <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.12); padding: 1.5rem; border-radius: var(--radius-md);">
              <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 0.5rem;">Corporate Staffing & Recruitment Suite</h4>
              <p style="color: var(--color-slate-400); font-size: 0.9rem; margin-bottom: 1rem;">Permanent and casual workforce options since 2007.</p>
              <a href="/staffing" data-link style="color: var(--color-accent-blue); font-weight: 600;">View Staffing Solutions &rarr;</a>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

/* --------------------------------------------------------------------------
   5. ALUMNI SEARCH & DIRECTORY ENGINE
   -------------------------------------------------------------------------- */
const ALUMNI_DATA = [
  {
    name: "Ms Thyaga Keerthipala",
    degree: "Bachelor of Science in Information Technology",
    uni: "Manchester Metropolitan University, UK",
    role: "Database Developer",
    quote: "Within a short period of time Study & Work lined up an interview. They gave me tips and guidance. My first interview was successful and I was offered the job!"
  },
  {
    name: "Mr Devesh Soni",
    degree: "Master of Professional Accounting",
    uni: "University of Wollongong",
    role: "Senior Fund Accountant",
    quote: "Study & Work sets you up with interviews with prospective employers who have an open mind regarding hiring international students. Highly recommended!"
  },
  {
    name: "Ms Rebecca Zeng",
    degree: "Bachelor of Accounting",
    uni: "University of Newcastle",
    role: "Company Accountant",
    quote: "After finishing university I sent out hundreds of resumes without response. Once I started with Study & Work, I had two interviews in two weeks and got my accounting job!"
  },
  {
    name: "Mr George Hong",
    degree: "Master of Accounting",
    uni: "Macquarie University",
    role: "Assistant Relationship Manager (Westpac)",
    quote: "Study & Work helped me get my first job in accounting. After 3 years I moved to banking at Westpac as Credit Analyst and was promoted within 4 months with 100% salary growth!"
  },
  {
    name: "Mr Jeffery Hong",
    degree: "Master of Commerce",
    uni: "The University of Sydney",
    role: "Finance Manager",
    quote: "Thanks to Study & Work, I started my first full-time job after graduation, which provided the growth foundation to achieve my current position as Finance Manager."
  },
  {
    name: "Ms Lili Dong",
    degree: "Master of Professional Accounting",
    uni: "The University of Sydney",
    role: "Company Accountant",
    quote: "As a new graduate I didn't expect to find my first job in such an easy, hassle-free manner! Great people, great business, great way of thinking!"
  },
  {
    name: "Mr Nirmaljeet Sandhu",
    degree: "Master of Professional Accounting",
    uni: "Central Queensland University",
    role: "Financial Controller",
    quote: "As an international student it was impossible to get an accounting job without local experience. Study & Work made it happen!"
  },
  {
    name: "Ms Julie Zhu",
    degree: "Master of Commerce in Accounting",
    uni: "The University of Sydney",
    role: "Company Accountant",
    quote: "Study & Work provided an interview opportunity in two weeks' time and I got the job soon after. Professional and warm-hearted staff members!"
  },
  {
    name: "Mr Prashant Arora",
    degree: "Master of Professional Accounting",
    uni: "University of Wollongong",
    role: "Financial Controller",
    quote: "Placed into an accounting role in construction. Within 3 months I received a 30%+ jump in salary with incentives. Perfect destination for graduates!"
  }
];

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #0284C7, #0369A1)",
  "linear-gradient(135deg, #0D9488, #0F766E)",
  "linear-gradient(135deg, #6366F1, #4338CA)",
  "linear-gradient(135deg, #EA580C, #C2410C)",
  "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  "linear-gradient(135deg, #059669, #047857)",
  "linear-gradient(135deg, #2563EB, #1D4ED8)",
  "linear-gradient(135deg, #DB2777, #BE185D)",
  "linear-gradient(135deg, #D97706, #B45309)"
];

function getAlumniInitials(name) {
  const clean = name.replace(/^(Mr|Ms|Mrs|Dr)\.?\s+/i, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

function initAlumniSearch() {
  const searchInput = document.getElementById('alumniSearchInput');
  const alumniGrid = document.getElementById('alumniGridContainer');

  if (!alumniGrid) return;

  function renderAlumni(list) {
    if (!list.length) {
      alumniGrid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--color-slate-500);">No verified alumni records match your query.</div>`;
      return;
    }

    alumniGrid.innerHTML = list.map((item, idx) => {
      const initials = getAlumniInitials(item.name);
      const gradient = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];
      return `
        <div class="alumni-card-editorial">
          <div class="alumni-card-header">
            <div class="alumni-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <span class="alumni-outcome-pill">Verified Outcome</span>
          </div>

          <div class="alumni-quote-body">
            <span class="alumni-quote-icon">&ldquo;</span>
            <p class="alumni-quote-text">${item.quote}</p>
          </div>

          <div class="alumni-meta-profile">
            <div class="alumni-avatar-circle" style="background: ${gradient};">
              ${initials}
            </div>
            <div class="alumni-profile-info">
              <div class="alumni-person-name">${item.name}</div>
              <div class="alumni-academic-degree">${item.degree}</div>
              <div class="alumni-academic-uni">${item.uni}</div>
              <div class="alumni-current-role">
                <span class="alumni-status-dot"></span>
                <span>Currently: <strong>${item.role}</strong></span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach interactive 3D parallax tilt matching Career Pathway cards
    alumniGrid.querySelectorAll('.alumni-card-editorial').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -8;
        const rotY = ((x - cx) / cx) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-8px) translateZ(12px)`;
        card.style.setProperty('--sheen-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--sheen-y', `${(y / rect.height) * 100}%`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Initial render
  renderAlumni(ALUMNI_DATA);

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = ALUMNI_DATA.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.degree.toLowerCase().includes(query) ||
        item.uni.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query)
      );
      renderAlumni(filtered);
    });
  }
}
/* --------------------------------------------------------------------------
   6. AUSTRALIAN LOCATIONS IMAGE TABS
   -------------------------------------------------------------------------- */
const CITY_DATA = {
  sydney: {
    title: "Sydney City & Parramatta Metropolitan Hub",
    address: "Level 10, 66 Clarence Street, Sydney NSW 2000 & Level 15, 60 Station St East, Parramatta NSW 2150",
    mapUrl: "https://maps.google.com/maps?q=66+Clarence+Street,+Sydney+NSW+2000&t=&z=15&ie=UTF8&iwloc=&output=embed",
    desc: "Our primary Australian headquarters connects candidates directly with Australia's largest corporate, tech, financial, and engineering hubs across Sydney and Parramatta.",
    study: "University of Sydney, UNSW, UTS, Macquarie University, Western Sydney University, ICMS",
    jobs: "Corporate Accounting, AI Integration, Software Engineering, Civil Engineering, Finance, Hospitality"
  },
  melbourne: {
    title: "Melbourne Financial & Tech District",
    address: "330 Collins Street, Melbourne VIC 3000 (By Appointment)",
    mapUrl: "https://maps.google.com/maps?q=330+Collins+Street,+Melbourne+VIC+3000&t=&z=15&ie=UTF8&iwloc=&output=embed",
    desc: "Connecting international students and university graduates with Melbourne's premier commerce, digital technology, healthcare, and retail enterprises.",
    study: "University of Melbourne, Monash University, RMIT, Swinburne, Deakin, La Trobe",
    jobs: "Database Development, Logistics & Supply Chain, IT Support, Business Analysis, Accounting"
  },
  brisbane: {
    title: "Brisbane & Queensland Growth Region",
    address: "Level 21, 345 Queen Street, Brisbane City QLD 4000",
    mapUrl: "https://maps.google.com/maps?q=345+Queen+Street,+Brisbane+City+QLD+4000&t=&z=15&ie=UTF8&iwloc=&output=embed",
    desc: "Facilitating engineering, IT automation, mining, and trade placements across Brisbane, Gold Coast, and regional Queensland.",
    study: "University of Queensland, QUT, Griffith University, James Cook University",
    jobs: "Project Engineering, Construction Management, Digital Marketing, Hotel Management"
  },
  perth: {
    title: "Perth & Western Australia",
    address: "Level 12, 108 St Georges Terrace, Perth WA 6000",
    mapUrl: "https://maps.google.com/maps?q=108+St+Georges+Terrace,+Perth+WA+6000&t=&z=15&ie=UTF8&iwloc=&output=embed",
    desc: "Specialized engineering, energy, resources, and IT staffing connections for skilled migrants and university graduates across Western Australia.",
    study: "University of Western Australia, Curtin University, Murdoch University, Edith Cowan",
    jobs: "Mechanical & Mining Engineering, Environmental Science, Accounting, Systems Admin"
  },
  adelaide: {
    title: "Adelaide & South Australia",
    address: "Level 5, 121 King William Street, Adelaide SA 5000",
    mapUrl: "https://maps.google.com/maps?q=121+King+William+Street,+Adelaide+SA+5000&t=&z=15&ie=UTF8&iwloc=&output=embed",
    desc: "Dedicated traineeship, professional internship, and casual staffing solutions across South Australia's defense, tech, and agricultural sectors.",
    study: "University of Adelaide, University of South Australia, Flinders University",
    jobs: "Cyber Security, Agriculture Management, NDIS & Social Work, Finance"
  }
};

function initCityTabs() {
  const cityChips = document.querySelectorAll('.city-chip-btn');
  const cityDisplay = document.getElementById('cityDetailContainer');

  if (!cityChips.length || !cityDisplay) return;

  cityChips.forEach(chip => {
    chip.addEventListener('click', () => {
      cityChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const key = chip.getAttribute('data-city');
      const data = CITY_DATA[key] || CITY_DATA.sydney;

      cityDisplay.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.25rem; align-items: flex-start;">
          <span class="badge-tag" style="width: fit-content; max-width: max-content; align-self: flex-start; white-space: nowrap;">Australian Operations</span>
          <h3 class="heading-2" style="color: #ffffff;">${data.title}</h3>
          <p class="lead-text" style="font-size: 1rem; color: #94A3B8;">${data.desc}</p>
          
          <div style="width: 100%; background: rgba(15, 23, 42, 0.88); border: 1px solid rgba(255, 255, 255, 0.18); backdrop-filter: blur(12px); padding: 1.35rem; border-radius: var(--radius-md); box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
            <div style="font-size: 0.875rem; color: #E2E8F0; margin-bottom: 0.65rem; display: flex; align-items: flex-start; gap: 0.35rem;">
              <strong style="color: #38BDF8; white-space: nowrap;">📍 Address:</strong><span>${data.address.trim()}</span>
            </div>
            <div style="font-size: 0.875rem; color: #CBD5E1; margin-bottom: 0.5rem;">
              <strong style="color: #ffffff;">Key Partner Universities:</strong> ${data.study}
            </div>
            <div style="font-size: 0.875rem; color: #CBD5E1;">
              <strong style="color: #ffffff;">Key Placement Sectors:</strong> ${data.jobs}
            </div>
          </div>

          <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <a href="tel:1300798069" class="btn btn-primary" style="padding: 0.65rem 1.35rem; font-size: 0.875rem;">Call 1300 79 80 69</a>
            <button onclick="openModal('contact')" class="btn btn-secondary" style="padding: 0.65rem 1.35rem; font-size: 0.875rem; background: rgba(255, 255, 255, 0.12); color: #fff; border-color: rgba(255,255,255,0.3);">Contact Office</button>
          </div>
        </div>

        <div style="border-radius: var(--radius-lg); overflow: hidden; height: 320px; background: #0F172A; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 14px 34px rgba(0, 0, 0, 0.5);">
          <iframe 
            src="${data.mapUrl}" 
            width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
      `;
    });
  });

  // Trigger initial city view render
  if (cityChips[0]) cityChips[0].click();
}

/* --------------------------------------------------------------------------
   8. SIGNATURE CAREER JOURNEY STEPPER — 3D PARALLAX & PROGRESS SYSTEM
   -------------------------------------------------------------------------- */
function initJourneyProgressStepper() {
  const nodeCards = document.querySelectorAll('.journey-node-card');
  const progressFill = document.getElementById('journeyLineFill');

  if (!nodeCards.length) return;

  function setActiveStage(index) {
    nodeCards.forEach((c, idx) => {
      if (idx <= index) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
    if (progressFill) {
      const percentage = (index / (nodeCards.length - 1)) * 100;
      progressFill.style.width = percentage + '%';
    }
  }

  nodeCards.forEach((card, idx) => {
    card.addEventListener('mouseenter', () => setActiveStage(idx));
    card.addEventListener('click', () => setActiveStage(idx));

    // Interactive 3D Parallax Tilt
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -12;
      const rotY = ((x - cx) / cx) * 12;
      card.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-8px) translateZ(16px)`;
      card.style.setProperty('--sheen-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--sheen-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  setActiveStage(0);
}

/* --------------------------------------------------------------------------
   9. MODAL MANAGER SYSTEM
   -------------------------------------------------------------------------- */
function initModalHandlers() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalCardBody');

  if (!overlay || !modalBody) return;

  window.openModal = function (type) {
    overlay.classList.add('active');

    if (type === 'hire') {
      modalBody.innerHTML = `
        <span class="badge-tag" style="margin-bottom: 0.75rem;">Employer Staffing Request</span>
        <h3 class="heading-2">Request Qualified Talent</h3>
        <p class="lead-text" style="font-size: 0.9375rem; margin-bottom: 1.5rem;">
          Tell us about your hiring requirements. Evaluate candidates over 12 weeks with zero cost through an internship, or direct-hire with a 6-month satisfaction guarantee.
        </p>
        <div style="background: var(--color-slate-100); padding: 1.75rem; border-radius: var(--radius-md); text-align: center;">
          <p style="font-weight: 600; margin-bottom: 1.25rem;">Redirecting to Official JobAdder Staff Portal...</p>
          <a href="https://v2.forms.jobadder.com/f/LMxoE9RDy6g86zblKY5VrJ7AQ" target="_blank" class="btn btn-accent" style="width: 100%;">
            Open JobAdder Hire Request Form &rarr;
          </a>
        </div>
      `;
    } else if (type === 'work') {
      modalBody.innerHTML = `
        <span class="badge-tag" style="margin-bottom: 0.75rem;">Candidate Registration</span>
        <h3 class="heading-2">Start Your Australian Career</h3>
        <p class="lead-text" style="font-size: 0.9375rem; margin-bottom: 1.5rem;">
          Register your profile to access 12-week professional internships, graduate jobs, traineeships, and employer visa sponsorship opportunities.
        </p>
        <div style="background: var(--color-slate-100); padding: 1.75rem; border-radius: var(--radius-md); text-align: center;">
          <p style="font-weight: 600; margin-bottom: 1.25rem;">Redirecting to Official JobAdder Candidate Portal...</p>
          <a href="https://v2.forms.jobadder.com/f/e8lxMELGRrgjrpgQV26WkPDnN" target="_blank" class="btn btn-accent" style="width: 100%;">
            Open JobAdder Candidate Application Form &rarr;
          </a>
        </div>
      `;
    } else if (type === 'consultation') {
      modalBody.innerHTML = `
        <span class="badge-tag" style="margin-bottom: 0.75rem;">Free Career Consultation</span>
        <h3 class="heading-2">Book a Session with Our Team</h3>
        <p class="lead-text" style="font-size: 0.9375rem; margin-bottom: 1.5rem;">
          Discuss your Australian career goals, internship options, and visa pathways with a senior career consultant.
        </p>
        <div style="background: var(--color-slate-100); padding: 1.75rem; border-radius: var(--radius-md); text-align: center;">
          <a href="https://calendly.com/ryanshrestha" target="_blank" class="btn btn-primary" style="width: 100%;">
            Schedule on Calendly &rarr;
          </a>
        </div>
      `;
    } else if (type === 'contact') {
      modalBody.innerHTML = `
        <span class="badge-tag" style="margin-bottom: 0.75rem;">Contact Us</span>
        <h3 class="heading-2">Get in Touch with Study & Work</h3>
        <p style="font-size: 0.9375rem; color: var(--color-slate-600); margin-bottom: 1.5rem;">
          Freecall Hotline: <strong>1300 79 80 69</strong> | Email: <strong>service@studyandwork.com.au</strong>
        </p>
        <form onsubmit="alert('Thank you for contacting Study & Work Australia. Our team will get back to you within 24 hours!'); closeModal(); return false;" style="display: flex; flex-direction: column; gap: 1rem;">
          <input type="text" placeholder="Your Full Name *" required style="padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--color-slate-200); outline: none;">
          <input type="email" placeholder="Your Email Address *" required style="padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--color-slate-200); outline: none;">
          <input type="tel" placeholder="Phone Number" style="padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--color-slate-200); outline: none;">
          <textarea rows="4" placeholder="How can we assist you?" required style="padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--color-slate-200); outline: none;"></textarea>
          <button type="submit" class="btn btn-primary">Send Message</button>
        </form>
      `;
    } else if (type === 'search') {
      const searchItems = [
        {
          title: 'Professional & Permanent Staffing Solutions',
          category: 'Employers',
          categoryColor: '#0284C7',
          badge: 'Staffing (5%–10% Fee)',
          description: 'Recruitment, payroll, superannuation, and candidate management backed by a 6-month free candidate replacement guarantee.',
          url: '/employers#staffing',
          keywords: 'professional permanent staffing solutions recruitment direct hire junior experienced talent 5% 10% fee replacement guarantee payroll hr'
        },
        {
          title: 'Host an Intern (12-Week Free Evaluation Trial)',
          category: 'Employers',
          categoryColor: '#0284C7',
          badge: 'Zero Cost Host Program',
          description: 'Evaluate university graduates on live company projects for 12 weeks with zero placement fee. 85%+ retention rate into permanent roles.',
          url: '/employers#internship',
          keywords: 'host an intern employer free trial zero fee try before hire university graduates evaluate talent placement internship corporate host'
        },
        {
          title: 'On-Demand Casual Workforce & Temporary Staffing',
          category: 'Employers',
          categoryColor: '#D97706',
          badge: 'Casual Staffing',
          description: 'Rapid response casual staffing for hospitality, retail, customer service, and events with a transparent 65% on-hire markup.',
          url: '/employers#casual-staffing',
          keywords: 'casual staffing temporary workforce on-demand labor hospitality retail warehouse on hire staffing solution markup superannuation'
        },
        {
          title: 'Hire an Apprentice or Trainee',
          category: 'Employers',
          categoryColor: '#7C3AED',
          badge: 'GTO Apprenticeships',
          description: 'Build your trade and technical workforce with government-subsidized apprenticeship host arrangements and complete RTO compliance.',
          url: '/employers#apprenticeship',
          keywords: 'hire an apprentice trainee group training gto trade government subsidies wage subsidies electrical mechanical cookery business'
        },
        {
          title: 'Professional Internship (12-Week Industry Placement)',
          category: 'Candidates',
          categoryColor: '#0284C7',
          badge: 'Candidates Placement',
          description: '12-week structured placement across 3,000+ corporate host employers in Australia. Accounting, IT, Engineering, Marketing & HR.',
          url: '/candidates#internship',
          keywords: 'internship professional intern vocational placement try before hire work experience accounting it engineering marketing student graduate'
        },
        {
          title: 'Graduate Job Placement (Direct Paid Career Roles)',
          category: 'Candidates',
          categoryColor: '#059669',
          badge: 'Graduate Salaries ($65k–$95k)',
          description: 'Direct recruitment into permanent and full-time career roles with verified Australian enterprises, supported by a 6-month replacement guarantee.',
          url: '/candidates#job-placement',
          keywords: 'graduate job placement paid roles permanent full-time junior software engineer accountant cloud salary direct career high paying'
        },
        {
          title: 'Student Casual Jobs & Fair Wages',
          category: 'Candidates',
          categoryColor: '#D97706',
          badge: 'Casual Roles (Subclass 500)',
          description: 'Casual employment compliant with Australian Student Visa limitations. Modern Award hourly wages plus 25% casual loading.',
          url: '/candidates#casual-jobs',
          keywords: 'casual jobs student visa 500 work hours award wage hospitality retail warehousing logistics shift flexible student friendly'
        },
        {
          title: 'Know Your Rights Under the Fair Work Act 2009',
          category: 'Legal & Rights',
          categoryColor: '#059669',
          badge: 'Fair Work Section 12',
          description: 'Essential statutory protections governing vocational placements, paid vs unpaid internships, and worker rights in Australia.',
          url: '/candidates#know-your-rights',
          keywords: 'know your rights fair work act 2009 section 12 unpaid internship legal vocational placement minimum award wage ombudsman entitlements legal protection'
        },
        {
          title: 'Australian Apprenticeship & Traineeship Programs',
          category: 'Candidates',
          categoryColor: '#7C3AED',
          badge: 'Trade & Vocational',
          description: 'Accredited trade pathways, vocational certifications (Cert III/IV), and hands-on skills development with government-subsidized employers.',
          url: '/candidates#apprenticeship',
          keywords: 'apprentice apprenticeship traineeship trade vocational cert iii cert iv electrical mechanical cookery business admin skills'
        },
        {
          title: '8,000+ Verified Alumni Career Directory',
          category: 'Candidates',
          categoryColor: '#0284C7',
          badge: 'Alumni Directory',
          description: 'Search verified career outcomes from candidates placed across 145+ Australian and global universities since 2007.',
          url: '/candidates#alumni',
          keywords: 'alumni directory search past candidates verified success reviews universities unsw usyd monash unimelb uts placements career stories'
        },
        {
          title: 'Invest in Emerging Talent for Maximum ROI',
          category: 'Resources',
          categoryColor: '#0284C7',
          badge: 'Employer Research',
          description: 'Economic insights and research demonstrating why hosting university interns yields superior ROI and up to 70% cost savings.',
          url: '/resources#employer-roi',
          keywords: 'employer roi invest in emerging talent research economics university graduates retention recruitment cost savings'
        },
        {
          title: 'Skilled Migrants Deserve a Fair Go',
          category: 'Resources',
          categoryColor: '#D97706',
          badge: 'Advocacy & Diversity',
          description: 'Breaking down the "no local experience" catch-22 for overseas-qualified accountants, software engineers, and professionals.',
          url: '/resources#skilled-migrants',
          keywords: 'skilled migrants deserve a fair go overseas qualified local experience permanent residents diversity inclusion career advocacy'
        },
        {
          title: 'Education Provider & University Partnerships',
          category: 'Education',
          categoryColor: '#059669',
          badge: 'WIL Framework',
          description: 'Partner with Study & Work to deliver accredited Work-Integrated Learning (WIL) internships for tertiary students across Australia.',
          url: '/education-providers',
          keywords: 'education providers universities tafe higher education wil work integrated learning internships institutional partnership'
        },
        {
          title: 'About Study & Work Australia (Since 2007)',
          category: 'About',
          categoryColor: '#0F172A',
          badge: '19+ Years Leadership',
          description: 'Budding Talents Recruitment Pty Ltd trading as STUDYANDWORK (ABN: 42 129 512 474). Founded by Ryan Shrestha in 2007.',
          url: '/about',
          keywords: 'about us history budding talents recruitment ryan shrestha 2007 established australia parramatta sydney'
        },
        {
          title: 'Contact Us & Head Office Locations',
          category: 'Contact',
          categoryColor: '#0284C7',
          badge: 'Offices & Hotline',
          description: 'Level 15, Parramatta & Level 10, Sydney City offices. Freecall hotline: 1300 79 80 69, email: service@studyandwork.com.au.',
          url: '/contact',
          keywords: 'contact office address phone hotline parramatta sydney level 15 email 1300 79 80 69 customer service'
        }
      ];

      modalBody.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <span class="badge-tag" style="margin: 0;">Global Search Engine</span>
          <span style="font-size: 0.78rem; color: var(--color-slate-500); font-weight: 500;">Press Enter to Jump</span>
        </div>
        <h3 class="heading-2" style="margin-top: 0.25rem; margin-bottom: 0.5rem;">Search Study & Work Australia</h3>
        <p style="font-size: 0.9rem; color: var(--color-slate-600); margin-bottom: 1.25rem;">
          Find any program, employer staffing model, salary band, legal right, or section instantly:
        </p>

        <div class="global-search-input-wrap">
          <input type="text" id="globalSearchInput" class="global-search-input" placeholder="Type to search (e.g. Staffing, Internship, Casual, Fair Work, Graduate...)" autocomplete="off">
          <button type="button" id="globalSearchClearBtn" class="global-search-clear-btn" title="Clear search">✕</button>
        </div>

        <div id="globalSearchResultsContainer">
          <!-- Live Results Rendered Here -->
        </div>
      `;

      const input = document.getElementById('globalSearchInput');
      const clearBtn = document.getElementById('globalSearchClearBtn');
      const container = document.getElementById('globalSearchResultsContainer');

      function escapeHtml(str) {
        return (str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
      }

      function highlightText(text, query) {
        if (!query) return escapeHtml(text);
        const escaped = escapeHtml(text);
        const terms = query.toLowerCase().trim().split(/\s+/).filter(t => t.length > 0);
        if (!terms.length) return escaped;
        const regex = new RegExp('(' + terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
        return escaped.replace(regex, '<span class="global-search-highlight">$1</span>');
      }

      function renderInitialQuickView() {
        container.innerHTML = `
          <div style="background: var(--color-slate-100); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-slate-200);">
            <div style="font-size: 0.825rem; font-weight: 700; color: var(--color-slate-600); margin-bottom: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">
              Popular Sections & Quick Jumps:
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
              <span class="global-search-tag-chip" data-search-term="Staffing">🏢 Professional Staffing</span>
              <span class="global-search-tag-chip" data-search-term="Internship">🎓 12-Week Internship</span>
              <span class="global-search-tag-chip" data-search-term="Graduate">💼 Graduate Jobs ($65k-$95k)</span>
              <span class="global-search-tag-chip" data-search-term="Fair Work">⚖️ Fair Work Legal Rights</span>
              <span class="global-search-tag-chip" data-search-term="Casual">☕ Student Casual Jobs</span>
              <span class="global-search-tag-chip" data-search-term="Alumni">🌟 Alumni Directory</span>
              <span class="global-search-tag-chip" data-search-term="Apprentice">🛠️ Apprenticeships</span>
            </div>
            <div style="font-size: 0.8rem; color: var(--color-slate-500); border-top: 1px solid var(--color-slate-200); padding-top: 0.75rem;">
              Direct Portals: 
              <a href="#" onclick="closeModal(); openModal('work'); return false;" style="color: var(--color-accent-blue); font-weight: 600; text-decoration: underline; margin-left: 0.35rem;">Candidate Registration</a> • 
              <a href="#" onclick="closeModal(); openModal('hire'); return false;" style="color: var(--color-accent-blue); font-weight: 600; text-decoration: underline; margin-left: 0.35rem;">Employer Request Form</a> • 
              <a href="/contact" data-link onclick="closeModal();" style="color: var(--color-accent-blue); font-weight: 600; text-decoration: underline; margin-left: 0.35rem;">Contact Office</a>
            </div>
          </div>
        `;

        container.querySelectorAll('.global-search-tag-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            const term = chip.getAttribute('data-search-term');
            input.value = term;
            performSearch(term);
          });
        });
      }

      function performSearch(query) {
        const trimmed = (query || '').trim().toLowerCase();
        if (!trimmed) {
          clearBtn.style.display = 'none';
          renderInitialQuickView();
          return;
        }

        clearBtn.style.display = 'flex';
        const queryTokens = trimmed.split(/\s+/).filter(Boolean);

        const results = searchItems.filter(item => {
          const haystack = (item.title + ' ' + item.category + ' ' + item.badge + ' ' + item.description + ' ' + item.keywords).toLowerCase();
          return queryTokens.every(token => haystack.includes(token));
        });

        if (!results.length) {
          container.innerHTML = `
            <div style="text-align: center; padding: 2.5rem 1.5rem; background: var(--color-slate-100); border-radius: var(--radius-md); border: 1px dashed var(--color-slate-300);">
              <div style="font-size: 2.25rem; margin-bottom: 0.75rem;">🔍</div>
              <h4 style="font-size: 1.1rem; color: var(--color-ink); margin-bottom: 0.35rem;">No exact sections found for "${escapeHtml(query)}"</h4>
              <p style="font-size: 0.875rem; color: var(--color-slate-600); margin-bottom: 1.25rem;">Try searching by job type, service, or click a popular section:</p>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                <span class="global-search-tag-chip" data-search-term="Staffing">Professional Staffing</span>
                <span class="global-search-tag-chip" data-search-term="Internship">12-Week Internship</span>
                <span class="global-search-tag-chip" data-search-term="Graduate Jobs">Graduate Roles</span>
                <span class="global-search-tag-chip" data-search-term="Fair Work">Legal Rights</span>
              </div>
            </div>
          `;
          container.querySelectorAll('.global-search-tag-chip').forEach(chip => {
            chip.addEventListener('click', () => {
              const term = chip.getAttribute('data-search-term');
              input.value = term;
              performSearch(term);
            });
          });
          return;
        }

        let html = `
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem; font-size: 0.825rem; color: var(--color-slate-600);">
            <span><strong>${results.length}</strong> section${results.length > 1 ? 's' : ''} found:</span>
            <span style="font-size: 0.75rem; color: var(--color-slate-400);">Click any result to jump directly</span>
          </div>
          <div class="global-search-results-list">
        `;

        results.forEach((res, index) => {
          html += `
            <div class="global-search-result-card ${index === 0 ? 'selected' : ''}" data-url="${res.url}">
              <div class="global-search-card-header">
                <span class="badge-tag" style="background: rgba(2, 132, 199, 0.1); color: ${res.categoryColor || '#0284C7'}; border-color: rgba(2, 132, 199, 0.25); font-size: 0.7rem; padding: 0.2rem 0.55rem; margin: 0;">
                  ${escapeHtml(res.category)} &bull; ${escapeHtml(res.badge)}
                </span>
                <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent-blue);">Jump &rarr;</span>
              </div>
              <div class="global-search-result-title">${highlightText(res.title, query)}</div>
              <p class="global-search-result-desc">${highlightText(res.description, query)}</p>
            </div>
          `;
        });

        html += `</div>`;
        container.innerHTML = html;

        container.querySelectorAll('.global-search-result-card').forEach(card => {
          card.addEventListener('click', () => {
            const targetUrl = card.getAttribute('data-url');
            closeModal();
            navigateTo(targetUrl);
          });
        });
      }

      renderInitialQuickView();

      input.addEventListener('input', (e) => {
        performSearch(e.target.value);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const firstCard = container.querySelector('.global-search-result-card');
          if (firstCard) {
            const targetUrl = firstCard.getAttribute('data-url');
            closeModal();
            navigateTo(targetUrl);
          }
        }
      });

      clearBtn.addEventListener('click', () => {
        input.value = '';
        input.focus();
        performSearch('');
      });

      setTimeout(() => {
        input.focus();
      }, 70);
    }
  };

  window.closeModal = function () {
    overlay.classList.remove('active');
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}
