/* ==========================================================================
   STUDY & WORK AUSTRALIA — 2026 MULTI-PAGE ROUTING & PRODUCTION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initModalHandlers();
  initRouter();
  if (window.initSpiderCanvases) {
    window.initSpiderCanvases();
  }
  if (window.initVortexBackgrounds) {
    window.initVortexBackgrounds();
  }
  if (window.initParticleDrift) {
    window.initParticleDrift();
  }
});

/* --------------------------------------------------------------------------
   1. NAVIGATION & SCROLL HANDLERS
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 35) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
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
function renderVideoPlayer(src, title, duration) {
  const cleanSrc = src.startsWith('/') ? src : '/' + src;
  const vidId = 'vid_' + Math.random().toString(36).substring(2, 9);
  return `
    <div class="video-player-box" style="position: relative; border-radius: 1.25rem; overflow: hidden; background: #000; box-shadow: var(--shadow-card); margin: 1.75rem 0;">
      ${duration ? `<div class="video-meta-badge" style="position: absolute; top: 1rem; right: 1rem; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); color: #fff; padding: 0.35rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; z-index: 5; pointer-events: none;">Duration: ${duration}</div>` : ''}
      <video id="${vidId}" controls preload="auto" playsinline class="custom-html5-player" style="width: 100%; border-radius: 1.25rem 1.25rem 0 0; background: #000; display: block;">
        <source src="${cleanSrc}" type="video/mp4">
        Your browser does not support HTML5 video playback. <a href="${cleanSrc}" target="_blank" style="color: var(--color-accent-blue); text-decoration: underline;">Download video file (${title})</a>
      </video>
      <div class="video-playback-toolbar" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem; background: rgba(15, 23, 42, 0.96); border-top: 1px solid rgba(255, 255, 255, 0.12); gap: 0.75rem;">
        <div style="font-size: 0.75rem; color: #94A3B8; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${title || 'Australian Career Video'}
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-shrink: 0;">
          <button type="button" onclick="(function(){ const v = document.getElementById('${vidId}'); if(v) { v.currentTime = Math.max(0, v.currentTime - 10); } })()" style="background: rgba(255, 255, 255, 0.12); color: #F8FAFC; border: 1px solid rgba(255, 255, 255, 0.2); padding: 0.3rem 0.65rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s;" title="Rewind 10 seconds">&#9194; -10s</button>
          <button type="button" onclick="(function(){ const v = document.getElementById('${vidId}'); if(v) { v.currentTime = Math.min(v.duration || 99999, v.currentTime + 10); } })()" style="background: rgba(255, 255, 255, 0.12); color: #F8FAFC; border: 1px solid rgba(255, 255, 255, 0.2); padding: 0.3rem 0.65rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s;" title="Forward 10 seconds">+10s &#9193;</button>
          <button type="button" onclick="(function(){ const v = document.getElementById('${vidId}'); if(v) { v.currentTime = Math.min(v.duration || 99999, v.currentTime + 30); } })()" style="background: rgba(255, 255, 255, 0.12); color: #F8FAFC; border: 1px solid rgba(255, 255, 255, 0.2); padding: 0.3rem 0.65rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s;" title="Forward 30 seconds">+30s &#9193;</button>
        </div>
      </div>
    </div>
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

function navigateTo(url, pushState = true) {
  if (pushState) {
    history.pushState(null, '', url);
  }
  renderCurrentRoute();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getRoutePath() {
  let path = window.location.pathname.toLowerCase();
  // Strip trailing slashes or .html
  path = path.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  // Check hash fallback if accessed via file:// or hash
  if (window.location.hash) {
    const hash = window.location.hash.replace(/^#\/?/, '/');
    if (hash && hash !== '/') {
      path = '/' + hash.replace(/^\/\//, '');
    }
  }
  return path || '/';
}

function updateActiveNavLinks(routePath) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const route = link.getAttribute('data-route') || link.getAttribute('href');
    if (!route) return;
    const normRoute = route.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    const normCurrent = routePath.replace(/\.html$/, '').replace(/\/$/, '') || '/';

    if (normRoute === normCurrent || (normRoute !== '/' && normCurrent.startsWith(normRoute))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function renderCurrentRoute() {
  const path = getRoutePath();
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) return;

  updateActiveNavLinks(path);

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
    renderInternshipView(mainContent);
  } else if (path === '/job-placement') {
    renderJobPlacementView(mainContent);
  } else if (path === '/staffing') {
    renderStaffingView(mainContent);
  } else if (path === '/casual-jobs') {
    renderCasualJobsView(mainContent);
  } else if (path === '/casual-staffing') {
    renderCasualStaffingView(mainContent);
  } else if (path === '/apprenticeship') {
    renderApprenticeshipView(mainContent);
  } else if (path === '/know-your-rights') {
    renderKnowYourRightsView(mainContent);
  } else if (path === '/alumni') {
    renderAlumniView(mainContent);
  } else if (path === '/resources/skilled-migrants-deserve-a-fair-go') {
    renderArticleView(mainContent, 'skilled-migrants');
  } else if (path === '/resources/invest-in-emerging-talent-for-the-maximum-roi') {
    renderArticleView(mainContent, 'employer-roi');
  } else {
    // Default fallback to home if unknown route
    renderHomeView(mainContent);
  }

  // Re-initialize dynamic widgets for rendered view
  initAlumniSearch();
  initCityTabs();
  initJourneyProgressStepper();
  if (window.initSpiderCanvases) {
    window.initSpiderCanvases();
  }
  if (window.initVortexBackgrounds) {
    window.initVortexBackgrounds();
  }
  if (window.initParticleDrift) {
    window.initParticleDrift();
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
      <video class="hero-bg-video" autoplay loop muted playsinline preload="auto" poster="Student-friendlyJobs.png">
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

    <!-- PATHWAYS OVERVIEW SECTION -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto;">
          <span class="badge-tag">Personalised Pathways</span>
          <h2 class="heading-1" style="margin-top: 0.75rem;">Where are you in your journey?</h2>
          <p class="lead-text">Explore dedicated entry points designed specifically for candidate aspirations and employer hiring demands.</p>
        </div>

        <div class="pathway-master-wrapper" style="margin-top: 2.5rem;">
          <!-- CANDIDATE OVERVIEW CARDS -->
          <div>
            <div class="journey-group-header">
              <span class="journey-group-title">Candidate Opportunities</span>
              <div style="flex: 1; height: 1px; background: var(--color-slate-200);"></div>
            </div>

            <div class="candidate-grid-3">
              <div class="path-card-candidate tint-azure">
                <span class="badge-tag" style="width: fit-content;">01 Internship</span>
                <div>
                  <h3 class="heading-3">Professional Internship</h3>
                  <p class="path-desc" style="margin-top: 0.5rem;">12-week structured placement in Australian host companies aligned with your university qualification.</p>
                </div>
                <a href="/internship" data-link class="path-link">Explore Internship &rarr;</a>
              </div>

              <div class="path-card-candidate tint-emerald">
                <span class="badge-tag" style="width: fit-content; background: rgba(5, 150, 105, 0.08); color: var(--color-accent-emerald); border-color: rgba(5, 150, 105, 0.2);">02 Job Placement</span>
                <div>
                  <h3 class="heading-3">Graduate Jobs</h3>
                  <p class="path-desc" style="margin-top: 0.5rem;">Direct recruitment and permanent career placement across IT, Accounting, Engineering, and Business.</p>
                </div>
                <a href="/job-placement" data-link class="path-link" style="color: var(--color-accent-emerald);">Graduate Opportunities &rarr;</a>
              </div>

              <div class="path-card-candidate tint-amber">
                <span class="badge-tag" style="width: fit-content; background: rgba(217, 119, 6, 0.08); color: var(--color-accent-amber); border-color: rgba(217, 119, 6, 0.2);">03 Casual Jobs</span>
                <div>
                  <h3 class="heading-3">Casual Student Jobs</h3>
                  <p class="path-desc" style="margin-top: 0.5rem;">Flexible employment opportunities designed to support international student living expenses.</p>
                </div>
                <a href="/casual-jobs" data-link class="path-link" style="color: var(--color-accent-amber);">Explore Student Jobs &rarr;</a>
              </div>
            </div>
          </div>

          <!-- EMPLOYER OVERVIEW CARDS -->
          <div style="margin-top: 2.5rem;">
            <div class="journey-group-header">
              <span class="journey-group-title" style="color: var(--color-accent-blue);">Employer Solutions</span>
              <div style="flex: 1; height: 1px; background: var(--color-slate-200);"></div>
            </div>

            <div class="employer-grid-2">
              <div class="path-card-employer tint-azure">
                <span class="badge-tag" style="width: fit-content; background: rgba(2, 132, 199, 0.1); color: var(--color-accent-blue);">Try Before You Hire</span>
                <div>
                  <h3 class="heading-3" style="color: var(--color-ink);">Host an Intern (12 Weeks Zero Cost)</h3>
                  <p class="path-desc" style="margin-top: 0.5rem;">Evaluate enthusiastic university graduates for 12 weeks at zero placement fee before extending a job offer.</p>
                </div>
                <a href="/employers" data-link class="path-link" style="color: var(--color-accent-blue);">Host an Intern &rarr;</a>
              </div>

              <div class="path-card-employer tint-violet">
                <span class="badge-tag" style="width: fit-content; background: rgba(124, 58, 237, 0.1); color: #7C3AED;">Direct Recruitment</span>
                <div>
                  <h3 class="heading-3" style="color: var(--color-ink);">Permanent & Casual Staffing</h3>
                  <p class="path-desc" style="margin-top: 0.5rem;">5%-10% permanent placement fee with 6-month replacement guarantee, or flexible 65% markup casual staffing.</p>
                </div>
                <a href="/staffing" data-link class="path-link" style="color: #7C3AED;">Explore Staffing &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SIGNATURE CAREER JOURNEY STEPPER — ORIGINKIT PARTICLE DRIFT 3 WEBGL -->
    <section id="journey" class="section section-particle-drift">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3.5rem;">
          <span class="badge-tag">End-to-End Progression</span>
          <h2 class="heading-1" style="margin-top: 0.75rem;">Your Australian Career Pathway</h2>
          <p class="lead-text">A structured 7-stage framework guiding candidates from education to long-term career growth.</p>
        </div>

        <div style="position: relative;">
          <!-- Stepper Track Connecting Center of Card 1 to Center of Card 7 -->
          <div style="position: absolute; top: 38px; left: calc(100% / 14); width: calc(100% * 6 / 7); height: 4px; background: rgba(255, 255, 255, 0.18); border-radius: 2px; z-index: 1;">
            <div id="journeyLineFill" style="height: 100%; background: var(--color-accent-blue); width: 0%; border-radius: 2px; transition: width 0.35s ease; box-shadow: 0 0 10px rgba(2, 132, 199, 0.7);"></div>
          </div>

          <div class="journey-cards-grid">
            <div class="journey-node-card active" data-step="1">
              <div class="journey-node-circle">1</div>
              <div class="journey-node-title">DISCOVER</div>
              <div class="journey-node-desc">Skills Audit</div>
            </div>

            <div class="journey-node-card" data-step="2">
              <div class="journey-node-circle">2</div>
              <div class="journey-node-title">STUDY</div>
              <div class="journey-node-desc">University Degree</div>
            </div>

            <div class="journey-node-card" data-step="3">
              <div class="journey-node-circle">3</div>
              <div class="journey-node-title">PREPARE</div>
              <div class="journey-node-desc">Resume & Coaching</div>
            </div>

            <div class="journey-node-card" data-step="4">
              <div class="journey-node-circle">4</div>
              <div class="journey-node-title">EXPERIENCE</div>
              <div class="journey-node-desc">12-Wk Internship</div>
            </div>

            <div class="journey-node-card" data-step="5">
              <div class="journey-node-circle">5</div>
              <div class="journey-node-title">CONNECT</div>
              <div class="journey-node-desc">3,000+ Employers</div>
            </div>

            <div class="journey-node-card" data-step="6">
              <div class="journey-node-circle">6</div>
              <div class="journey-node-title">GET HIRED</div>
              <div class="journey-node-desc">Paid Job Offer</div>
            </div>

            <div class="journey-node-card" data-step="7">
              <div class="journey-node-circle">7</div>
              <div class="journey-node-title">GROW</div>
              <div class="journey-node-desc">Visa & Leadership</div>
            </div>
          </div>
        </div>
      </div>
    </section>
        </div>
      </div>
    </section>

    <!-- VIDEO SPOTLIGHT SECTION (LEFT VIDEO + RIGHT TEXT - IMAGE 4 LAYOUT) -->
    <section class="section section-spider-light">
      <div class="container">
        <div class="media-spotlight-grid">
          <!-- LEFT SIDE VIDEO (CLEAN PLAYER WITH SLEEK SHAPE, NO DOUBLE BOX) -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('v1.mp4', 'Study & Work Australia Platform Overview', '2m 45s')}
          </div>
          <!-- RIGHT SIDE TEXT (CLEAN HIGH-CONTRAST TYPOGRAPHY & SHAPED CHECKLIST) -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="background: rgba(2, 132, 199, 0.1); color: var(--color-accent-blue); border: 1px solid rgba(2, 132, 199, 0.25); align-self: flex-start;">Featured Media</span>
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

    <!-- ALUMNI PREVIEW — ORIGINKIT PARTICLE DRIFT 3 & 3D CARDS (MATCHING SECTION 2) -->
    <section id="alumni" class="section section-particle-drift">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.75rem; flex-wrap: wrap; gap: 1.5rem;">
          <div>
            <span class="badge-tag">Audited Outcomes</span>
            <h2 class="heading-1" style="margin-top: 0.5rem;">8,000+ Alumni Placements</h2>
            <p class="lead-text" style="margin-top: 0.5rem; font-size: 1rem; color: #94A3B8;">Verified career outcomes from candidates placed into over 3,000 Australian host businesses.</p>
          </div>
          <a href="/alumni" data-link class="btn btn-secondary">View Complete Alumni Directory &rarr;</a>
        </div>
        <div id="alumniGridContainer" class="alumni-grid-3"></div>
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

// --- 4.2 CANDIDATES HUB VIEW ---
function renderCandidatesView(container) {
  container.innerHTML = `
    <!-- CANDIDATES HERO WITH RICH BACKGROUND PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="candidates_hero_bg.jpg" class="hero-bg-img" alt="Australian Candidates & Graduates">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(5, 150, 105, 0.25); color: #34d399; border-color: rgba(5, 150, 105, 0.4);">Candidates & Graduates</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Build Experience. Start Your Australian Career.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Australia's premier career entry platform connecting university students, graduates, and skilled migrants with 3,000+ host companies across Sydney, Melbourne, Brisbane, Perth, and Adelaide.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('work')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald);">Register Candidate Profile &rarr;</button>
            <button onclick="openModal('consultation')" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Book Career Consultation &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- CANDIDATE PROGRAMS GRID -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Program Suite</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Dedicated Candidate Pathways</h2>
          <p class="lead-text">Choose the pathway that matches your current qualification, visa status, and career ambitions.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem;">
          <!-- CARD 1: INTERNSHIP -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; justify-space-between; box-shadow: var(--shadow-card);">
            <div>
              <span class="badge-tag" style="margin-bottom: 1rem;">12-Week Program</span>
              <h3 class="heading-2">Professional Internship Program</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                12-week structured workplace placement in Australian corporate host companies. Gain hands-on local experience in IT, Accounting, Engineering, Marketing, and Business Management.
              </p>
            </div>
            <div style="margin-top: 2rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-slate-500);">Target: Students & Graduates</span>
              <a href="/internship" data-link class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">View Internship &rarr;</a>
            </div>
          </div>

          <!-- CARD 2: GRADUATE JOBS -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; justify-space-between; box-shadow: var(--shadow-card);">
            <div>
              <span class="badge-tag" style="background: rgba(5, 150, 105, 0.1); color: var(--color-accent-emerald); border-color: rgba(5, 150, 105, 0.2); margin-bottom: 1rem;">Direct Career Placement</span>
              <h3 class="heading-2">Graduate Job Placement</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Direct paid placement for graduates with Australian host employers. 5%-10% employer placement fee structure with a 6-month satisfaction replacement guarantee.
              </p>
            </div>
            <div style="margin-top: 2rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-slate-500);">Target: Recent Graduates</span>
              <a href="/job-placement" data-link class="btn btn-primary" style="background: var(--color-accent-emerald); border-color: var(--color-accent-emerald); padding: 0.5rem 1rem; font-size: 0.875rem;">Graduate Jobs &rarr;</a>
            </div>
          </div>

          <!-- CARD 3: APPRENTICESHIPS -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; justify-space-between; box-shadow: var(--shadow-card);">
            <div>
              <span class="badge-tag" style="background: rgba(217, 119, 6, 0.1); color: var(--color-accent-amber); border-color: rgba(217, 119, 6, 0.2); margin-bottom: 1rem;">Earn & Learn</span>
              <h3 class="heading-2">Apprenticeships & Traineeships</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Structured vocational training and paid workplace placements for trade, technical, and commercial operations supported by Australian government subsidies.
              </p>
            </div>
            <div style="margin-top: 2rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-slate-500);">Target: Vocational & Trade</span>
              <a href="/apprenticeship" data-link class="btn btn-primary" style="background: var(--color-accent-amber); border-color: var(--color-accent-amber); padding: 0.5rem 1rem; font-size: 0.875rem;">Explore Traineeships &rarr;</a>
            </div>
          </div>

          <!-- CARD 4: CASUAL JOBS -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; justify-space-between; box-shadow: var(--shadow-card);">
            <div>
              <span class="badge-tag" style="margin-bottom: 1rem;">Student Visa Friendly</span>
              <h3 class="heading-2">Casual Jobs for Students</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Flexible student jobs in hospitality, retail, customer service, and events matching Australian student visa work limitations (48 hours per fortnight during study terms).
              </p>
            </div>
            <div style="margin-top: 2rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-slate-500);">Target: International Students</span>
              <a href="/casual-jobs" data-link class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Casual Jobs &rarr;</a>
            </div>
          </div>

          <!-- CARD 5: KNOW YOUR RIGHTS -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; justify-space-between; box-shadow: var(--shadow-card);">
            <div>
              <span class="badge-tag" style="margin-bottom: 1rem;">Fair Work Compliance</span>
              <h3 class="heading-2">Know Your Rights</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Understand your legal protections under the Australian Fair Work Act 2009. Rules governing vocational placements, paid vs unpaid internships, and worker safety.
              </p>
            </div>
            <div style="margin-top: 2rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-slate-500);">Target: All Candidates</span>
              <a href="/know-your-rights" data-link class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Legal Rights &rarr;</a>
            </div>
          </div>

          <!-- CARD 6: ALUMNI -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; justify-space-between; box-shadow: var(--shadow-card);">
            <div>
              <span class="badge-tag" style="margin-bottom: 1rem;">Success Stories</span>
              <h3 class="heading-2">Alumni Directory</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Explore verified success stories of over 8,000 graduates placed into leading Australian enterprises across 145+ Australian and global universities.
              </p>
            </div>
            <div style="margin-top: 2rem; border-top: 1px solid var(--color-slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-slate-500);">Target: Prospective Candidates</span>
              <a href="/alumni" data-link class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Alumni Directory &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VIDEO SPOTLIGHT (LEFT TEXT + RIGHT VIDEO - IMAGE 3 LAYOUT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid" style="grid-template-columns: 0.9fr 1.1fr;">
          <!-- LEFT SIDE TEXT -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Candidate Experiences</span>
            <h2 class="heading-1">Hear From Real Interns & Graduates</h2>
            <p class="lead-text">
              Watch candidate testimonial journeys and workplace placement experiences across Australian host companies.
            </p>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
              <button onclick="openModal('work')" class="btn btn-primary">Register Candidate Profile &rarr;</button>
              <button onclick="openModal('consultation')" class="btn btn-secondary">Book Consultation</button>
            </div>
          </div>
          <!-- RIGHT SIDE VIDEO -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('interns1.mp4', 'Candidate & Graduate Placement Journeys', '3m 15s')}
          </div>
        </div>
      </div>
    </section>

    <!-- STEP-BY-STEP APPLICATION PATHWAY -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Application Workflow</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">How Candidate Placement Works</h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem;">
          <div class="tint-azure" style="padding: 1.5rem; border-radius: var(--radius-md);">
            <div style="font-weight: 800; font-size: 1.5rem; color: var(--color-accent-blue);">01</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0;">Register Profile</h4>
            <p style="font-size: 0.9rem; color: var(--color-slate-600);">Submit your resume, academic transcripts, and target placement sector.</p>
          </div>

          <div class="tint-emerald" style="padding: 1.5rem; border-radius: var(--radius-md);">
            <div style="font-weight: 800; font-size: 1.5rem; color: var(--color-accent-emerald);">02</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0;">Skills Assessment</h4>
            <p style="font-size: 0.9rem; color: var(--color-slate-600);">Undergo career consultation and Australian workplace cultural readiness coaching.</p>
          </div>

          <div class="tint-amber" style="padding: 1.5rem; border-radius: var(--radius-md);">
            <div style="font-weight: 800; font-size: 1.5rem; color: var(--color-accent-amber);">03</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0;">Host Matching</h4>
            <p style="font-size: 0.9rem; color: var(--color-slate-600);">Interview with vetted host companies matching your technical qualifications.</p>
          </div>

          <div class="tint-violet" style="padding: 1.5rem; border-radius: var(--radius-md);">
            <div style="font-weight: 800; font-size: 1.5rem; color: #7C3AED;">04</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0;">Workplace Placement</h4>
            <p style="font-size: 0.9rem; color: var(--color-slate-600);">Complete your 12-week structured internship or direct graduate placement.</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 3rem;">
          <button onclick="openModal('work')" class="btn btn-primary" style="padding: 0.85rem 2rem; font-size: 1rem;">Apply Now via JobAdder Candidate Portal &rarr;</button>
        </div>
      </div>
    </section>
  `;
}

// --- 4.3 EMPLOYERS HUB VIEW ---
function renderEmployersView(container) {
  container.innerHTML = `
    <!-- EMPLOYERS HERO WITH RICH BACKGROUND PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="employers_hero_bg.jpg" class="hero-bg-img" alt="Australian Employer Talent Solutions">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(2, 132, 199, 0.25); color: #7dd3fc; border-color: rgba(2, 132, 199, 0.4);">Employer Talent Solutions</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Find Talent That Moves Your Business Forward.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Flexible staffing and recruitment solutions for Australian enterprises since 2007. Evaluate interns over 12 weeks at zero cost, direct-hire with a 6-month satisfaction guarantee, or hire casual staff with 65% markup.
          </p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
            <button onclick="openModal('hire')" class="btn btn-primary btn-hero-primary" style="background: var(--color-accent-blue); border-color: var(--color-accent-blue);">Submit Talent Request &rarr;</button>
            <a href="tel:1300798069" class="btn btn-secondary btn-hero-secondary" style="background: rgba(255, 255, 255, 0.18); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(12px);">Call Hotline 1300 79 80 69 &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- EMPLOYER SERVICES BREAKDOWN -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Staffing Models</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Cost-Effective Talent Acquisition</h2>
          <p class="lead-text">Choose from zero-cost intern evaluations, direct permanent hires, or flexible temporary staffing models.</p>
        </div>

        <div class="employer-solutions-3col-grid">
          <!-- SERVICE 1: HOST AN INTERN -->
          <div class="employer-solution-card">
            <div>
              <span class="badge-tag" style="background: rgba(2, 132, 199, 0.1); color: var(--color-accent-blue); border-color: rgba(2, 132, 199, 0.25); margin-bottom: 1rem;">Flagship Program</span>
              <h3 class="heading-2">Host an Intern (Try Before You Hire)</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Evaluate enthusiastic university graduates for 12 weeks at <strong>zero placement fee</strong>. Assess candidate performance, technical skills, and culture fit in your business before making a permanent job offer.
              </p>
              <ul style="margin: 1.5rem 0; padding-left: 1.25rem; color: var(--color-slate-700); font-size: 0.9375rem; display: flex; flex-direction: column; gap: 0.5rem;">
                <li><strong>Zero Placement Fee:</strong> No upfront or ongoing cost during 12 weeks</li>
                <li><strong>Insurance Covered:</strong> Study & Work covers personal accident & liability</li>
                <li><strong>Fair Work Compliant:</strong> Structured vocational placement under Section 12</li>
                <li><strong>High Retention:</strong> 85%+ of host interns receive permanent job offers</li>
              </ul>
            </div>
            <button onclick="openModal('hire')" class="btn btn-primary" style="width: 100%; text-align: center; margin-top: 1.5rem;">Host an Intern at Zero Cost &rarr;</button>
          </div>

          <!-- SERVICE 2: DIRECT RECRUITMENT -->
          <div class="employer-solution-card">
            <div>
              <span class="badge-tag" style="background: rgba(5, 150, 105, 0.1); color: var(--color-accent-emerald); border-color: rgba(5, 150, 105, 0.25); margin-bottom: 1rem;">Permanent Placement</span>
              <h3 class="heading-2">Direct-Hire Permanent Recruitment</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Full end-to-end recruitment for junior to senior professionals across IT, Accounting, Engineering, and Business.
              </p>
              <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; padding: 1.15rem; border-radius: var(--radius-md); margin: 1.5rem 0; font-size: 0.9rem;">
                <div style="font-weight: 700; color: var(--color-ink); margin-bottom: 0.35rem;">Transparent Pricing:</div>
                <div style="margin-bottom: 0.25rem;">• <strong>5% Fee:</strong> Candidates with &lt;2 years experience</div>
                <div style="margin-bottom: 0.25rem;">• <strong>10% Fee:</strong> Candidates with &ge;2 years experience</div>
                <div>• <strong>6-Month Replacement Guarantee:</strong> Zero risk replacement</div>
              </div>
            </div>
            <button onclick="openModal('hire')" class="btn btn-primary" style="width: 100%; text-align: center; margin-top: 1.5rem;">Request Direct Recruitment &rarr;</button>
          </div>

          <!-- SERVICE 3: CASUAL & TEMP STAFFING -->
          <div class="employer-solution-card">
            <div>
              <span class="badge-tag" style="background: rgba(217, 119, 6, 0.1); color: var(--color-accent-amber); border-color: rgba(217, 119, 6, 0.25); margin-bottom: 1rem;">Flexible Workforce</span>
              <h3 class="heading-2">On-Hire Temporary & Casual Staffing</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Flexible casual workforce solutions for hospitality, retail, customer service, warehousing, and admin.
              </p>
              <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; padding: 1.15rem; border-radius: var(--radius-md); margin: 1.5rem 0; font-size: 0.9rem;">
                <div style="font-weight: 700; color: var(--color-ink); margin-bottom: 0.35rem;">65% On-Hire Markup Covers:</div>
                <div style="margin-bottom: 0.25rem;">• Base salary payment & superannuation</div>
                <div style="margin-bottom: 0.25rem;">• Payroll tax & Workers Compensation insurance</div>
                <div>• Full employer administrative burden</div>
              </div>
            </div>
            <a href="/staffing" data-link class="btn btn-primary" style="width: 100%; text-align: center; margin-top: 1.5rem;">Explore Staffing Solutions &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- EMPLOYER VIDEO SECTION (LEFT VIDEO + RIGHT TEXT - IMAGE 4 LAYOUT) -->
    <section class="section section-spider-dark">
      <div class="container">
        <div class="media-spotlight-grid">
          <!-- LEFT SIDE VIDEO -->
          <div class="media-spotlight-video">
            ${renderVideoPlayer('employerVideo.mp4', 'Recruitment Cost Optimization Video', '4m 10s')}
          </div>
          <!-- RIGHT SIDE TEXT -->
          <div class="media-spotlight-content">
            <span class="badge-tag" style="align-self: flex-start; margin-bottom: 0.75rem;">Employer Insights</span>
            <h2 class="heading-1">Recruitment Doesn't Have to Be Expensive</h2>
            <p class="lead-text">
              Learn how Australian SMEs and corporate enterprises save up to 70% in recruitment costs using Study & Work's host placement models.
            </p>
            <button onclick="openModal('hire')" class="btn btn-primary" style="align-self: flex-start; margin-top: 1rem;">Host an Intern Zero Cost &rarr;</button>
          </div>
        </div>
      </div>
    </section>
  `;
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

    <!-- WIL PARTNERSHIPS OVERVIEW -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">WIL Framework</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Work Integrated Learning Solutions</h2>
          <p class="lead-text">Study & Work bridges the gap between university academic theory and practical workplace performance.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          <div style="background: var(--color-surface); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--color-slate-200); box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">&#127891;</div>
            <h3 class="heading-3">Curriculum Placement Integration</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6;">
              We embed 12-week professional internships directly into university degree credit requirements, ensuring 100% compliance with Australian higher education standards.
            </p>
          </div>

          <div style="background: var(--color-surface); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--color-slate-200); box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">&#9878;</div>
            <h3 class="heading-3">Fair Work & Legal Compliance</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6;">
              All host company placements strictly comply with Section 12 of the Australian Fair Work Act 2009 regarding vocational placements and international student visa conditions.
            </p>
          </div>

          <div style="background: var(--color-surface); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--color-slate-200); box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">&#128200;</div>
            <h3 class="heading-3">Graduate Employability Uplift</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6;">
              Over 85% of placed interns receive permanent employment offers within 3 months of program completion, significantly boosting university QILT graduate outcome metrics.
            </p>
          </div>
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
    <!-- RESOURCES HERO WITH RICH BACKGROUND PHOTOGRAPHY -->
    <section class="hero-section" style="position: relative; overflow: hidden; background: #0f172a; color: #fff;">
      <img src="resources_hero_bg.jpg" class="hero-bg-img" alt="Knowledge and Insights Australia">
      <div class="hero-gradient-overlay"></div>
      <div class="container hero-container" style="position: relative; z-index: 4;">
        <div style="max-width: 800px;">
          <span class="badge-tag hero-badge" style="background: rgba(217, 119, 6, 0.25); color: #fbbf24; border-color: rgba(217, 119, 6, 0.4);">Knowledge & Insights</span>
          <h1 class="display-hero hero-title" style="margin-top: 0.75rem;">Knowledge for Your Next Career Move.</h1>
          <p class="lead-text hero-lead" style="margin-top: 1.25rem;">
            Articles, legal guides under the Fair Work Act 2009, employer ROI research, and career advocacy for students and skilled migrants in Australia.
          </p>
        </div>
      </div>
    </section>

    <!-- ARTICLES GRID -->
    <section class="section section-spider-light">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
          <span class="badge-tag">Featured Publications</span>
          <h2 class="heading-1" style="margin-top: 0.5rem;">Latest News & Insights</h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem;">
          <!-- ARTICLE 1 -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge-tag" style="margin-bottom: 0.75rem;">Advocacy & Diversity</span>
              <h3 class="heading-2">Skilled Migrants Deserve a Fair Go</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                How Australian businesses can unlock immense talent by providing fair employment opportunities to skilled migrants and overseas-qualified professionals.
              </p>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-slate-100);">
              <a href="/resources/skilled-migrants-deserve-a-fair-go" data-link class="btn btn-secondary" style="width: 100%; text-align: center;">Read Full Article &rarr;</a>
            </div>
          </div>

          <!-- ARTICLE 2 -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card); display: flex; flex-direction: column; justify-space-between;">
            <div>
              <span class="badge-tag" style="margin-bottom: 0.75rem;">Employer ROI</span>
              <h3 class="heading-2">Invest in Emerging Talent for Maximum ROI</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Why hiring university graduates and hosting interns yields superior productivity, long-term employee retention, and cultural vitality for Australian SMEs.
              </p>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-slate-100);">
              <a href="/resources/invest-in-emerging-talent-for-the-maximum-roi" data-link class="btn btn-secondary" style="width: 100%; text-align: center;">Read Full Article &rarr;</a>
            </div>
          </div>

          <!-- ARTICLE 3 -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card); display: flex; flex-direction: column; justify-space-between;">
            <div>
              <span class="badge-tag" style="margin-bottom: 0.75rem;">Fair Work Compliance</span>
              <h3 class="heading-2">Know Your Legal Rights Under Fair Work Act</h3>
              <p style="color: var(--color-slate-600); margin-top: 0.75rem; line-height: 1.6;">
                Essential guidelines for international students and interns covering minimum award wages, vocational placement exceptions, and workplace safety.
              </p>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-slate-100);">
              <a href="/know-your-rights" data-link class="btn btn-secondary" style="width: 100%; text-align: center;">Explore Rights Guide &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </section>
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
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
          <div>
            <span class="badge-tag">Our History</span>
            <h2 class="heading-1" style="margin-top: 0.5rem;">19+ Years of Career Excellence in Australia</h2>
            <p style="color: var(--color-slate-600); margin-top: 1rem; line-height: 1.7; font-size: 1.05rem;">
              Established in 2007, Study & Work Australia was founded with a singular mission: to eliminate the "no local experience, no job" barrier faced by thousands of qualified university graduates and skilled migrants across Australia.
            </p>
            <p style="color: var(--color-slate-600); margin-top: 1rem; line-height: 1.7; font-size: 1.05rem;">
              Over nearly two decades, we have successfully placed over <strong>8,000 candidates</strong> into structured internships, traineeships, and direct permanent roles across <strong>3,000+ host businesses</strong> nationwide.
            </p>
          </div>

          <div class="about-metrics-card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="border-bottom: 1.5px solid #E2E8F0; padding-bottom: 1.25rem;">
              <div style="font-size: 2.5rem; font-weight: 800; color: var(--color-accent-blue); font-family: var(--font-display); line-height: 1.1;">8,000+</div>
              <div style="font-weight: 600; color: #1E293B; margin-top: 0.35rem;">Candidates Placed Into Professional Careers</div>
            </div>

            <div style="border-bottom: 1.5px solid #E2E8F0; padding-bottom: 1.25rem;">
              <div style="font-size: 2.5rem; font-weight: 800; color: var(--color-accent-emerald); font-family: var(--font-display); line-height: 1.1;">3,000+</div>
              <div style="font-weight: 600; color: #1E293B; margin-top: 0.35rem;">Host Business Partners Across Australia</div>
            </div>

            <div>
              <div style="font-size: 2.5rem; font-weight: 800; color: var(--color-accent-amber); font-family: var(--font-display); line-height: 1.1;">2007</div>
              <div style="font-weight: 600; color: #1E293B; margin-top: 0.35rem;">Established & Continuously Operating (19+ Years)</div>
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
        <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3rem; align-items: start;">
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
                  <div style="font-weight: 700; color: var(--color-ink); font-size: 1.05rem; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--color-accent-blue);">📍</span> Parramatta Head Office</div>
                  <div style="color: #475569; font-size: 0.925rem;">Level 15, 60 Station Street East, Parramatta NSW 2150</div>
                </div>

                <div class="office-location-card">
                  <div style="font-weight: 700; color: var(--color-ink); font-size: 1.05rem; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--color-accent-blue);">📍</span> Sydney City Office</div>
                  <div style="color: #475569; font-size: 0.925rem;">Level 10, 66 Clarence Street, Sydney NSW 2000</div>
                </div>

                <div class="office-location-card">
                  <div style="font-weight: 700; color: var(--color-ink); font-size: 1.05rem; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--color-accent-blue);">📍</span> Melbourne City Office</div>
                  <div style="color: #475569; font-size: 0.925rem;">330 Collins Street, Melbourne VIC 3000 (By Appointment)</div>
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

          <!-- RIGHT COLUMN: CONTACT VIDEO -->
          <div>
            <div style="position: sticky; top: calc(var(--nav-height) + 2rem);">
              <span class="badge-tag">Virtual Office Tour</span>
              <h2 class="heading-2" style="margin-top: 0.5rem; margin-bottom: 1rem;">Experience Our Headquarters</h2>
              ${renderVideoPlayer('contact1.mp4', 'Contact & Office Tour Video', '2m 10s')}
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
          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">☕</div>
            <h3 class="heading-3">Hospitality & Barista</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6;">
              Specialty cafes, hotel dining, banquet catering, and licensed venues. Award wages with 25% casual loading and weekend penalty rates.
            </p>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">🛍️</div>
            <h3 class="heading-3">Retail & Customer Experience</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6;">
              Fashion boutiques, electronics stores, and supermarkets across Sydney, Melbourne, and Brisbane retail centres.
            </p>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">🎪</div>
            <h3 class="heading-3">Event Operations & Venues</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6;">
              Concerts, corporate conferences, sporting stadiums, and trade exhibitions. Highly flexible weekend shifts.
            </p>
          </div>

          <div style="background: var(--color-surface); border: 1px solid var(--color-slate-200); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card);">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">📦</div>
            <h3 class="heading-3">Warehousing & Logistics</h3>
            <p style="color: var(--color-slate-600); margin-top: 0.5rem; line-height: 1.6;">
              Inventory management, picking, packing, and dispatch operations in modern fulfillment centres.
            </p>
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
            <div style="font-size: 0.875rem; color: #E2E8F0; margin-bottom: 0.65rem; display: flex; align-items: flex-start; gap: 0.4rem;">
              <strong style="color: #38BDF8;">📍 Address:</strong>
              <span>${data.address}</span>
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
      modalBody.innerHTML = `
        <span class="badge-tag" style="margin-bottom: 0.75rem;">Global Search</span>
        <h3 class="heading-2">Search Study & Work Australia</h3>
        <input type="text" placeholder="Search internships, jobs, legal rights, or employers..." style="width: 100%; padding: 1rem; border-radius: var(--radius-full); border: 1px solid var(--color-slate-200); font-size: 1rem; outline: none; margin: 1.5rem 0;" oninput="this.nextElementSibling.style.display = this.value ? 'block' : 'none'">
        <div style="display: none; background: var(--color-slate-100); padding: 1rem; border-radius: var(--radius-md);">
          <div style="font-size: 0.875rem; color: var(--color-slate-600); margin-bottom: 0.5rem;">Quick Links:</div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9375rem;">
            <li><a href="/candidates" data-link onclick="closeModal()">Candidate Opportunities &rarr;</a></li>
            <li><a href="/employers" data-link onclick="closeModal()">Employer Staffing Solutions &rarr;</a></li>
            <li><a href="/alumni" data-link onclick="closeModal()">8,000+ Alumni Directory &rarr;</a></li>
            <li><a href="/know-your-rights" data-link onclick="closeModal()">Fair Work Act Legal Rights &rarr;</a></li>
          </ul>
        </div>
      `;
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
