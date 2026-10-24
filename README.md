# JobGen.AI — Study & Work Australia
> **Turn Your Potential Into an Australian Career.**  
> Official web platform for Study & Work Australia connecting candidates, university graduates, and international students with premier Australian host companies and employers.

> 🌐 **Live Preview:** [https://study-and-work-australia.onrender.com](https://study-and-work-australia.onrender.com)

---

## 🌟 Overview

**Study & Work Australia** is an agency-grade web application built to guide candidates through their career journey in Australia. The platform features structured 12-week professional internships, graduate career placements, casual student jobs, and comprehensive employer recruitment solutions.

---

## 🚀 Key Features

- **Cinematic Brand Hero:**
  - Full-screen high-definition background video showcase with top-aligned framing (`object-position: center top`) ensuring optimal viewing across all screen ratios.
  - Dark readability gradient overlay with key career platform metrics (8,000+ candidates placed, 3,000+ host businesses, established 2007).

- **Full HTML5 Video Player with Unrestricted Seeking:**
  - Built-in video player supporting native scrubber seeking and timeline scrubbing without freezing.
  - Interactive quick-skip controls: **`⏪ -10s`**, **`+10s ⏩`**, and **`+30s ⏩`**.
  - Powered by a custom Python backend handling **HTTP 206 Partial Content** and `Range` byte requests.

- **Dynamic Interactive Spider Network Canvas:**
  - Interactive particle network that animates seamlessly across alternating light (`section-spider-light`) and dark (`section-spider-dark`) sections.
  - Physics-based mouse gravitation attracting nearby nodes within cursor proximity.

- **Refined Card & Box Aesthetics:**
  - Clean porcelain/ice-slate tinted cards (`linear-gradient(165deg, #F8FAFD, #EEF4F9)`) with crisp borders (`#D5E2EE`) and ambient elevation.
  - Interactive hover state: lifts cards (`translateY(-5px)`), highlights borders with brand cyan/blue (`#0284C7`), and transitions to pure white with soft blue glow.

- **Client-Side Single Page Application (SPA) Engine:**
  - Fast client-side routing with clean URLs and smooth transitions.
  - Dedicated pages and views:
    - **Home** (`/`)
    - **Candidates** (`/candidates`)
    - **Employers** (`/employers`)
    - **Internship** (`/internship`)
    - **Job Placement** (`/job-placement`)
    - **Casual Jobs** (`/casual-jobs`)
    - **Staffing** (`/staffing`)
    - **About Us** (`/about`)
    - **Contact Desk** (`/contact`)
    - **Resources & Insights** (`/resources`)
    - **Education Providers** (`/education-providers`)

- **Interactive Modal System:**
  - Dual modal workflows for candidate profile registration and employer talent consultation.

---

## 🛠️ Technology Stack

- **Frontend:** Semantic HTML5, Vanilla Modern CSS3, Vanilla ES6+ JavaScript.
- **Canvas Physics:** HTML5 2D Canvas API for particle network simulation.
- **Server:** Python HTTP Server with Byte-Range Seeking (`HTTP 206 Partial Content`) and SPA Route Fallback.
- **Typography:** Google Fonts (*Outfit* for bold display headings, *Inter* for legible body text).

---

## 📂 Project Structure

```text
├── index.html            # Main SPA HTML structure and container
├── app.js                # SPA routing engine, route views, video component, modals
├── styles.css            # Complete design system, responsive rules, spider styling
├── spider-canvas.js      # Interactive particle spider web animation engine
├── server.py             # HTTP server with byte-range video seeking and SPA fallback
├── *.mp4                 # Video assets (v1, interns1, employerVideo, apprentice, etc.)
├── *.jpg, *.png          # Brand assets, hero images, and client logos
└── README.md             # Project documentation
```

---

## 💻 Getting Started (Run Locally)

### Prerequisites
- Python 3.8 or higher installed on your system.

### Quick Start
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aryan132005/JobGen.AI-Study-and-Work-Website.git
   cd JobGen.AI-Study-and-Work-Website
   ```

2. **Launch the Range-Supported Development Server:**
   ```bash
   python server.py
   ```

3. **Open in your browser:**
   ```text
   http://localhost:8085/
   ```

---

## 👤 Author & Maintainer

- **Developer:** Aryan Saini
- **GitHub:** [@Aryan132005](https://github.com/Aryan132005)
- **Email:** [aryansaini132005@gmail.com](mailto:aryansaini132005@gmail.com)
- **Company:** [JobGen.ai](https://jobgen.ai/)
---

## 📄 License
This project is proprietary and developed for Study & Work Australia. All rights reserved.
