/**
 * STUDY & WORK AUSTRALIA — AI CAREER & RECRUITMENT ASSISTANT
 * Interactive floating chatbot engine with natural knowledge responses,
 * quick suggestion chips, typing indicator, and direct application modal triggers.
 */

(function () {
  'use strict';

  // Knowledge base and intent matcher
  const KNOWLEDGE_RESPONSES = [
    {
      keywords: ['intern', 'internship', 'training', 'placement', 'graduate program', 'work experience'],
      response: `<strong>🎓 Professional Internship Program:</strong><br><br>
• <strong>12-Week Vocational Placement</strong> tailored for university graduates and international students.<br>
• <strong>Zero Cost to Employers:</strong> Host employers can evaluate your practical skills with zero upfront placement fee.<br>
• <strong>Fair Work Compliant:</strong> Fully structured vocational placement under Section 12 of the Fair Work Act.<br>
• <strong>High Retention:</strong> Over <strong>85%</strong> of host interns receive permanent job offers upon completion!<br><br>
Would you like to apply now?`,
      action: { text: "Apply for Internship 🚀", modalType: "work" }
    },
    {
      keywords: ['employer', 'hire', 'staffing', 'talent', 'host an intern', 'recruitment', 'pricing', 'cost'],
      response: `<strong>🏢 Employer Talent & Staffing Solutions:</strong><br><br>
We offer 3 flexible, cost-effective hiring models:<br>
1. <strong>Host an Intern (Free Trial):</strong> Evaluate graduates for 12 weeks with zero placement fee.<br>
2. <strong>Direct-Hire Permanent:</strong> 5% fee (&lt;2 yrs exp) or 10% fee (&ge;2 yrs exp) with our <strong>6-Month Free Replacement Guarantee</strong>.<br>
3. <strong>Casual / Temp Staffing:</strong> 65% markup covering payroll, superannuation, workers comp, and administration.<br><br>
Would you like to request candidate profiles?`,
      action: { text: "Request Talent Profiles 📋", modalType: "hire" }
    },
    {
      keywords: ['job', 'jobs', 'graduate', 'work', 'career', 'employment', 'permanent', 'it job', 'accounting'],
      response: `<strong>💼 Job Placements for Candidates:</strong><br><br>
We connect students, graduates, and permanent skilled migrants with verified Australian employers in:<br>
• Information Technology & Software<br>
• Accounting, Finance & Banking<br>
• Engineering & Construction<br>
• Business, Marketing & Operations<br>
• Flexible Casual Roles (Retail, Hospitality, Admin)<br><br>
Submit your resume today to be matched with active job openings!`,
      action: { text: "Submit Your Resume 📄", modalType: "work" }
    },
    {
      keywords: ['contact', 'phone', 'call', 'email', 'office', 'address', 'location', 'parramatta', 'sydney'],
      response: `<strong>📞 Contact Study & Work Australia:</strong><br><br>
• <strong>Hotline:</strong> <a href="tel:1300798069" style="color:#0284c7;font-weight:700;">1300 79 80 69</a> | 02 8233 6138<br>
• <strong>Email:</strong> <a href="mailto:service@studyandwork.com.au" style="color:#0284c7;font-weight:700;">service@studyandwork.com.au</a><br>
• <strong>Parramatta Head Office:</strong> Level 15, 60 Station Street East, Parramatta NSW 2150<br>
• <strong>Sydney CBD Office:</strong> Level 10, 66 Clarence Street, Sydney NSW 2000<br><br>
Office hours: Mon - Fri, 9:00 AM - 5:30 PM AEST.`
    },
    {
      keywords: ['visa', 'migration', 'migrant', 'skilled', '485', 'sponsor', 'rights', 'fair work'],
      response: `<strong>🛡️ Fair Work Compliance & Skilled Migrant Support:</strong><br><br>
Study & Work Australia was founded in 2007 to protect international students and skilled migrants from underpayment and exploitation.<br>
• All internships comply strictly with <strong>Fair Work Act Section 12</strong>.<br>
• Comprehensive personal accident & liability insurance covered.<br>
• Employer Visa Sponsorship talent matching for eligible skilled migrants.`
    },
    {
      keywords: ['hello', 'hi', 'hey', 'gday', 'namaste', 'hola', 'hlo', 'start'],
      response: `G'day! 👋 I'm your <strong>Study & Work Career Assistant</strong>.<br><br>
Whether you're looking for an internship in Australia, exploring graduate jobs, or an employer looking to host an intern, I'm here to help!<br><br>
What would you like to explore?`
    }
  ];

  const DEFAULT_RESPONSE = `Thank you for your message! Our team specializes in Australian <strong>internships, graduate placements, and employer staffing</strong>.<br><br>
You can ask me about:<br>
• <em>"How does the 12-week internship work?"</em><br>
• <em>"What are the fees for employers?"</em><br>
• <em>"How can I apply for graduate jobs?"</em><br>
• <em>"What is your phone number & office address?"</em><br><br>
Or click below to speak directly with an advisor:`;

  class ChatbotApp {
    constructor() {
      this.isOpen = false;
      this.messages = [];
      this.init();
    }

    init() {
      // Create DOM elements
      this.renderWidget();
      this.cacheElements();
      this.bindEvents();
      
      // Initial greeting after slight delay
      setTimeout(() => {
        this.addBotMessage(
          `G'day! 👋 Welcome to <strong>Study & Work Australia</strong>.<br><br>How can I assist your Australian career or staffing needs today?`,
          [
            { label: "🎓 Internships", query: "Tell me about the internship program" },
            { label: "💼 Graduate Jobs", query: "How to get graduate jobs?" },
            { label: "🏢 Employer Staffing", query: "Employer staffing options and pricing" },
            { label: "📞 Contact Us", query: "Office address and phone number" }
          ]
        );
      }, 500);
    }

    renderWidget() {
      const existing = document.getElementById('chatbotContainer');
      if (existing) existing.remove();

      const container = document.createElement('div');
      container.id = 'chatbotContainer';
      container.innerHTML = `
        <!-- FLOATING CHATBOT TOGGLE BUTTON -->
        <button id="chatbotToggleBtn" class="chatbot-toggle-btn" aria-label="Open Chat Assistant" title="Chat with Study & Work Assistant">
          <!-- Unread Indicator Dot -->
          <span class="chatbot-unread-dot"></span>
          
          <!-- Chat Icon (Matching user reference) -->
          <svg class="chat-icon-svg" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 7C21.0899 7 24 9.91015 24 13.5C24 15.346 23.2327 17.0135 22 18.2L22.5 21.5L19.2 20.3C18.4 20.75 17.5 21 16.5 21C12.9101 21 10 18.0899 10 14.5" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 12.5C12.4853 12.5 14.5 14.5147 14.5 17C14.5 18.3 13.95 19.45 13.1 20.25L13.5 22.5L11.2 21.7C10.6 22 10 22.1 9.4 22.1C6.91472 22.1 4.9 20.0853 4.9 17.6C4.9 15.1147 6.91472 12.5 10 12.5Z" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <!-- Close Icon (Hidden by default) -->
          <svg class="close-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- CHATBOT WINDOW DIALOG -->
        <div id="chatbotWindow" class="chatbot-window" role="dialog" aria-modal="true" aria-label="Study & Work Chat Assistant">
          <!-- Header -->
          <div class="chatbot-header">
            <div class="chatbot-header-info">
              <div class="chatbot-avatar-wrap">
                <div class="chatbot-avatar">SW</div>
                <span class="chatbot-online-indicator"></span>
              </div>
              <div>
                <h3 class="chatbot-title">Study & Work Assistant</h3>
                <p class="chatbot-subtitle">Online • Career & Staffing Advisor</p>
              </div>
            </div>
            <div class="chatbot-header-actions">
              <button id="chatbotResetBtn" class="chatbot-icon-btn" title="Reset Conversation" aria-label="Reset Conversation">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M3 21v-5h5"></path>
                </svg>
              </button>
              <button id="chatbotCloseBtn" class="chatbot-icon-btn" title="Close Chat" aria-label="Close Chat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- Message History Body -->
          <div id="chatbotBody" class="chatbot-body">
            <!-- Messages injected dynamically -->
          </div>

          <!-- Typing Indicator (Hidden by default) -->
          <div id="chatbotTyping" class="chatbot-typing-bar" style="display: none;">
            <div class="typing-bubble">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <span class="typing-text">Assistant is typing...</span>
          </div>

          <!-- Input Footer -->
          <form id="chatbotForm" class="chatbot-footer" onsubmit="return false;">
            <input 
              id="chatbotInput" 
              type="text" 
              class="chatbot-input" 
              placeholder="Type your question here..." 
              autocomplete="off" 
              aria-label="Your message"
            />
            <button id="chatbotSendBtn" type="submit" class="chatbot-send-btn" aria-label="Send message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      `;

      document.body.appendChild(container);
    }

    cacheElements() {
      this.toggleBtn = document.getElementById('chatbotToggleBtn');
      this.window = document.getElementById('chatbotWindow');
      this.body = document.getElementById('chatbotBody');
      this.typing = document.getElementById('chatbotTyping');
      this.input = document.getElementById('chatbotInput');
      this.form = document.getElementById('chatbotForm');
      this.closeBtn = document.getElementById('chatbotCloseBtn');
      this.resetBtn = document.getElementById('chatbotResetBtn');
    }

    bindEvents() {
      this.toggleBtn.addEventListener('click', () => this.toggle());
      this.closeBtn.addEventListener('click', () => this.close());
      this.resetBtn.addEventListener('click', () => this.reset());

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleUserSubmit();
      });

      // Close on Esc key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.isOpen = true;
      this.window.classList.add('active');
      this.toggleBtn.classList.add('active');
      // Hide unread dot
      const dot = this.toggleBtn.querySelector('.chatbot-unread-dot');
      if (dot) dot.style.display = 'none';
      
      setTimeout(() => {
        this.input.focus();
        this.scrollToBottom();
      }, 200);
    }

    close() {
      this.isOpen = false;
      this.window.classList.remove('active');
      this.toggleBtn.classList.remove('active');
    }

    reset() {
      this.body.innerHTML = '';
      this.addBotMessage(
        `Conversation reset! 🔄 How else can I assist you with Study & Work Australia?`,
        [
          { label: "🎓 Internships", query: "Tell me about the internship program" },
          { label: "💼 Graduate Jobs", query: "How to get graduate jobs?" },
          { label: "🏢 Employer Staffing", query: "Employer staffing options and pricing" },
          { label: "📞 Contact Us", query: "Office address and phone number" }
        ]
      );
    }

    handleUserSubmit() {
      const text = this.input.value.trim();
      if (!text) return;

      this.addUserMessage(text);
      this.input.value = '';

      // Simulate typing indicator
      this.showTyping(true);

      const delay = Math.min(1200, Math.max(500, text.length * 20));
      setTimeout(() => {
        this.showTyping(false);
        this.processResponse(text);
      }, delay);
    }

    addUserMessage(text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-message chat-message-user';
      msgDiv.innerHTML = `
        <div class="chat-bubble chat-bubble-user">
          ${this.escapeHTML(text)}
        </div>
      `;
      this.body.appendChild(msgDiv);
      this.scrollToBottom();
    }

    addBotMessage(htmlContent, quickChips = [], actionBtn = null) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-message chat-message-bot';

      let chipsHTML = '';
      if (quickChips && quickChips.length > 0) {
        chipsHTML = `
          <div class="chat-quick-chips">
            ${quickChips.map(c => `
              <button type="button" class="chat-chip-btn" data-query="${this.escapeHTML(c.query)}">
                ${c.label}
              </button>
            `).join('')}
          </div>
        `;
      }

      let actionHTML = '';
      if (actionBtn) {
        actionHTML = `
          <div style="margin-top: 0.75rem;">
            <button type="button" class="btn btn-primary chat-action-btn" data-modal="${actionBtn.modalType}">
              ${actionBtn.text}
            </button>
          </div>
        `;
      }

      msgDiv.innerHTML = `
        <div class="chat-bot-avatar">SW</div>
        <div class="chat-bot-content">
          <div class="chat-bubble chat-bubble-bot">
            ${htmlContent}
            ${actionHTML}
          </div>
          ${chipsHTML}
        </div>
      `;

      this.body.appendChild(msgDiv);

      // Bind chips
      msgDiv.querySelectorAll('.chat-chip-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const query = e.target.getAttribute('data-query');
          if (query) {
            this.input.value = query;
            this.handleUserSubmit();
          }
        });
      });

      // Bind action buttons (e.g. open application modal)
      msgDiv.querySelectorAll('.chat-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const modalType = e.target.getAttribute('data-modal');
          if (modalType && typeof window.openModal === 'function') {
            window.openModal(modalType);
            this.close();
          }
        });
      });

      this.scrollToBottom();
    }

    processResponse(query) {
      const lower = query.toLowerCase();

      // Check knowledge base
      let matched = null;
      for (const item of KNOWLEDGE_RESPONSES) {
        if (item.keywords.some(k => lower.includes(k))) {
          matched = item;
          break;
        }
      }

      if (matched) {
        this.addBotMessage(matched.response, [
          { label: "📞 Speak to Advisor", query: "How to call or email the office?" },
          { label: "🎓 Internship Info", query: "Tell me about internships" }
        ], matched.action || null);
      } else {
        this.addBotMessage(DEFAULT_RESPONSE, [
          { label: "🎓 12-Week Internships", query: "Tell me about internships" },
          { label: "🏢 Employer Staffing", query: "Employer staffing solutions" },
          { label: "💼 Graduate Placements", query: "Graduate jobs placement" },
          { label: "📞 Contact Us", query: "Office contact details" }
        ], { text: "Contact an Advisor 📞", modalType: "work" });
      }
    }

    showTyping(show) {
      if (show) {
        this.typing.style.display = 'flex';
        this.scrollToBottom();
      } else {
        this.typing.style.display = 'none';
      }
    }

    scrollToBottom() {
      this.body.scrollTop = this.body.scrollHeight;
    }

    escapeHTML(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ChatbotApp());
  } else {
    new ChatbotApp();
  }
})();
