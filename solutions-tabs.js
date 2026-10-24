/* ==========================================================================
   FILE 2: solutions-tabs.js (Study & Work Australia - Complete Solutions Suite)
   Full implementation supporting both Employers and Candidates Tab Systems
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. DATA DEFINITIONS
     card = [icon, small title, title, text, note label, note text, colour, extra]
     extra (optional) = { badge:'..', link:'..', href:'..', list:[['Bold:','text'], ...] }
     -------------------------------------------------------------------------- */

  // EMPLOYERS SOLUTIONS DATA (from PDF Pages 4-5)
  var EMPLOYERS_DATA = [
    {
      id: 'host-an-intern',
      tab: 'Host an Intern',
      h: 'Host an Intern at Zero Placement Fee',
      p: 'Test high-achieving university graduates on live company projects for 12 weeks with zero recruitment placement fees under Australian Fair Work Act Section 12.',
      c: [
        ['💰', '', 'Zero Placement Fee', 'Evaluate candidates over 12 weeks with no upfront placement fees or ongoing recruitment costs.', '', '', '#10B981'],
        ['🛡️', '', 'Full Insurance Covered', 'Study & Work covers all personal accident and public liability insurance policies during the placement.', '', '', '#0284C7'],
        ['⚖️', '', '100% Fair Work Compliant', 'Full compliance with Section 12 vocational placement guidelines and university WIL accreditation.', '', '', '#06B6D4'],
        ['🎯', '', '85%+ Retention Rate', 'The majority of host companies extend permanent job offers to their interns upon placement completion.', '', '', '#8B5CF6']
      ]
    },
    {
      id: 'professional-staffing',
      tab: 'Professional Staffing',
      h: 'Professional &amp; Permanent Staffing Solutions',
      p: 'End-to-end recruitment, payroll, superannuation, and candidate management for Australian enterprises since 2007.',
      c: [
        ['', 'Junior roles (<2 years)', '5% Direct Placement Fee', 'Save up to 70% compared to traditional 15-25% recruitment agency charges. Ideal for junior software engineers, accountants, and marketing coordinators.', 'Included:', 'Full VEVO work rights check &amp; 6-month replacement guarantee.', '#0284C7'],
        ['', 'Experienced roles (≥2 years)', '10% Direct Placement Fee', 'Mid-to-senior talent sourcing across IT cloud architecture, chartered accountants, engineering project managers, and operations leaders.', 'Included:', 'Technical assessment, background reference audit, and 6-month replacement guarantee.', '#10B981'],
        ['', 'Industry leading', '6-Month Free Replacement', 'Standard recruitment agencies only offer 3 months. Study &amp; Work provides a full 6-month candidate satisfaction replacement guarantee.', 'Peace of Mind:', 'If a hire leaves within 6 months, we replace them at zero additional charge.', '#8B5CF6']
      ]
    },
    {
      id: 'casual-staffing',
      tab: 'Casual Staffing',
      h: 'On-Demand Casual Workforce Solutions',
      p: 'Rapid response casual staffing for hospitality, retail, customer service, and events with a transparent 65% markup covering salary, super, tax, and insurance.',
      c: [
        ['💵', '', 'Base Casual Award Pay', 'Full compliance with Australian Modern Award wage rates including the statutory 25% casual loading for all worked hours.', '', '', '#10B981'],
        ['📄', '', 'Superannuation &amp; Tax', '11.5% compulsory superannuation guarantee, state payroll tax, and PAYG withholding handled completely by Study &amp; Work.', '', '', '#0284C7'],
        ['🛡️', '', 'Insurance &amp; Compliance', 'Full Workers Compensation insurance policy coverage and public liability indemnity for all on-site casual employees.', '', '', '#8B5CF6']
      ]
    },
    {
      id: 'hire-an-apprentice',
      tab: 'Hire an Apprentice',
      h: 'Apprenticeship &amp; Traineeship Host Management',
      p: 'Build your future trade and technical workforce with government-subsidized apprenticeship host arrangements.',
      c: [
        ['⚡', '', 'Electrical &amp; Renewable Energy', 'Access wage subsidies for Cert III apprentice electricians, solar technicians, and industrial automation apprentices.', '', '', '#F59E0B'],
        ['🔧', '', 'Mechanical Engineering Fitting', 'Toolmakers, boilermakers, CNC machinists, and heavy plant equipment apprentice technicians.', '', '', '#06B6D4'],
        ['👨‍🍳', '', 'Commercial Cookery', 'Apprentice chefs and hospitality supervisors trained under modern commercial kitchen hygiene and service standards.', '', '', '#EF4444'],
        ['💼', '', 'Business Administration Trainees', 'Certificate IV business trainees handling office admin, customer service, bookkeeping assist, and logistics.', '', '', '#0284C7']
      ]
    }
  ];

  // CANDIDATES DATA (from PDF Pages 10-11)
  var CANDIDATES_DATA = [
    {
      id: 'apprenticeships',
      tab: 'Apprenticeships',
      h: 'Apprenticeship &amp; Traineeship Programs',
      p: 'Earn while learning in trade, technical, and commercial operations supported by Australian government subsidies.',
      c: [
        ['⚡', '', 'Electrotechnology &amp; Renewables', 'Commercial electrical wiring, solar PV installation, industrial automation, and high-voltage maintenance.', '', '', '#F59E0B'],
        ['🔧', '', 'Engineering &amp; Mechanical Fitting', 'CNC precision machining, metal fabrication, heavy plant equipment mechanics, and robotics assembly.', '', '', '#0284C7'],
        ['👨‍🍳', '', 'Commercial Cookery &amp; Hospitality', 'Certificate III in Commercial Cookery, pastry production, food safety management, and banquet operations.', '', '', '#EF4444'],
        ['💼', '', 'Business &amp; Logistics Traineeships', 'Certificate IV in Business Administration, supply chain coordination, project office assist, and customer care.', '', '', '#8B5CF6']
      ]
    },
    {
      id: 'casual-student-jobs',
      tab: 'Casual Student Jobs',
      h: 'Casual Jobs for Students in Australia',
      p: 'Flexible casual work opportunities matching Australian student visa work limits (48 hours per fortnight during semester terms).',
      c: [
        ['☕', '', 'Hospitality &amp; Barista', 'Specialty cafes, hotel dining, banquet catering, and licensed venues. Award wages with 25% casual loading and weekend penalty rates.', '', '', '#F59E0B', { badge: 'Award Wages + 25% Loading', link: 'Explore Cafe &amp; Dining Shifts', href: '/casual-jobs' }],
        ['🛍️', '', 'Retail &amp; Customer Experience', 'Fashion boutiques, electronics stores, and supermarkets across Sydney, Melbourne, and Brisbane retail centres.', '', '', '#0284C7', { badge: 'Flexible Shopping Centres', link: 'Explore Store &amp; Sales Roles', href: '/casual-jobs' }],
        ['🎪', '', 'Event Operations &amp; Venues', 'Concerts, corporate conferences, sporting stadiums, and trade exhibitions. Highly flexible weekend shifts.', '', '', '#8B5CF6', { badge: 'Stadiums &amp; Concerts', link: 'Explore Weekend Shifts', href: '/casual-jobs' }],
        ['📦', '', 'Warehousing &amp; Logistics', 'Inventory management, picking, packing, and dispatch operations in modern fulfillment centres.', '', '', '#10B981', { badge: 'High Hourly Rates', link: 'Explore Logistics Shifts', href: '/casual-jobs' }]
      ]
    },
    {
      id: 'know-your-rights',
      tab: 'Know Your Rights',
      h: 'Know Your Rights Under the Fair Work Act 2009',
      p: 'Essential legal protections for international students, university interns, and Australian workers under the Fair Work Act 2009.',
      c: [
        ['', 'Section 12 exemption', 'Lawful Vocational Placement (Unpaid)', 'Under Section 12 of the Australian Fair Work Act 2009, an internship is legally exempt from minimum wage requirements ONLY when all three criteria are met:', '', 'All Study &amp; Work internships satisfy 100% of Fair Work Section 12 statutory provisions.', '#0284C7', {
          list: [
            ['Course Requirement:', 'Must be a mandatory component of an authorized Australian higher education or vocational course.'],
            ['Educational Focus:', 'The primary beneficiary must be the student acquiring practical learning, not the host extracting commercial labor.'],
            ['Authorized Arrangement:', 'Formal agreement entered between the university, host employer, and candidate.']
          ]
        }],
        ['', 'Standard employment', 'Employment Relationship (Paid)', 'If an internship does NOT satisfy Section 12, the individual is classified as an employee under Australian workplace law and is entitled to:', '', 'We ensure our candidates are never subjected to sham contracting or illegal unpaid labor.', '#10B981', {
          list: [
            ['Minimum Award Wage:', 'Statutory minimum hourly rate under the applicable Modern Award ($24.97+/hr).'],
            ['Casual Loading:', '25% additional hourly loading if engaged as a casual worker.'],
            ['Superannuation:', '11.5% super paid into your nominated superannuation fund.'],
            ['National Employment Standards (NES):', 'Protections regarding maximum hours, paid breaks, and public holiday rates.']
          ]
        }]
      ]
    }
  ];

  var uid = 0;

  /* --------------------------------------------------------------------------
     2. CARD GENERATOR (PDF Page 11 Specification)
     -------------------------------------------------------------------------- */
  function card(c, i) {
    var x = c[7] || {};
    return '<article class="sw-card" style="--c:' + c[6] + ';--i:' + i + '">' +
      (c[0] || x.badge ? '<div class="sw-top">' + (c[0] ? '<div class="sw-ic">' + c[0] + '</div>' : '') +
        (x.badge ? '<span class="sw-badge">' + x.badge + '</span>' : '') + '</div>' : '') +
      (c[1] ? '<small>' + c[1] + '</small>' : '') +
      '<h3>' + c[2] + '</h3><p>' + c[3] + '</p>' +
      (x.list ? '<ul class="sw-list">' + x.list.map(function (l) { return '<li><b>' + l[0] + '</b> ' + l[1] + '</li>'; }).join('') + '</ul>' : '') +
      (c[5] ? '<div class="sw-note"><b>' + c[4] + '</b> ' + c[5] + '</div>' : '') +
      (x.link ? '<a class="sw-link" href="' + (x.href || '#') + '">' + x.link + ' &rarr;</a>' : '') +
      '</article>';
  }

  /* --------------------------------------------------------------------------
     3. INITIALIZATION CONTROLLER (Handles Single or Multiple Instances)
     -------------------------------------------------------------------------- */
  function initSingleSolutions(root) {
    if (!root) return;
    var tabs = root.querySelector('.sw-tabs'), stage = root.querySelector('.sw-stage');
    if (!tabs || !stage) return;

    var n = ++uid;
    stage.id = stage.id || ('sw-stage' + n);

    // Auto-detect whether this instance represents Candidates or Employers
    var label = (tabs.getAttribute('aria-label') || '').toLowerCase();
    var datasetType = (root.getAttribute('data-solutions-type') || '').toLowerCase();
    var D = (label.indexOf('candidate') !== -1 || datasetType === 'candidates') ? CANDIDATES_DATA : EMPLOYERS_DATA;

    tabs.setAttribute('role', 'tablist');
    tabs.innerHTML = D.map(function (d, i) {
      return '<button class="sw-tab" role="tab" id="sw' + n + '-t' + i + '" aria-controls="' + stage.id + '">' +
        '<span class="sw-face"><b>0' + (i + 1) + '</b><span>' + d.tab + '</span><i aria-hidden="true">&rarr;</i></span></button>';
    }).join('');

    stage.setAttribute('role', 'tabpanel');
    var btns = [].slice.call(tabs.children);

    function show(i, save) {
      i = Math.max(0, Math.min(D.length - 1, i));
      var d = D[i];
      btns.forEach(function (b, k) {
        b.classList.toggle('sw-on', k === i);
        b.setAttribute('aria-selected', k === i);
        b.tabIndex = k === i ? 0 : -1;
      });
      stage.setAttribute('aria-labelledby', 'sw' + n + '-t' + i);
      stage.innerHTML = '<div class="sw-panel"><h2>' + d.h + '</h2><p class="sw-lead">' + d.p +
        '</p><div class="sw-grid sw-n' + d.c.length + '">' + d.c.map(card).join('') + '</div></div>';
      if (save && history.replaceState) {
        history.replaceState(null, '', '#' + d.id);
      }
    }

    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { show(i, true); });
      b.addEventListener('keydown', function (e) {
        var k = e.key, m = (k === 'ArrowDown' || k === 'ArrowRight') ? i + 1 : (k === 'ArrowUp' || k === 'ArrowLeft') ? i - 1 : null;
        if (m === null) return;
        e.preventDefault();
        m = (m + D.length) % D.length;
        show(m, true);
        btns[m].focus();
      });
    });

    var start = D.findIndex(function (d) { return '#' + d.id === location.hash; });
    show(start < 0 ? 0 : start, false);
  }

  window.initSolutions = function (root) {
    if (root) {
      initSingleSolutions(root);
    } else {
      var allRoots = document.querySelectorAll('.sw');
      allRoots.forEach(function (r) {
        initSingleSolutions(r);
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.initSolutions(); });
  } else {
    window.initSolutions();
  }
})();
