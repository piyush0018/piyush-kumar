/* ==========================================================================
   PORTFOLIO DYNAMIC RENDERER (js/render.js)
   Synchronizes PortfolioDB Data with DOM Elements in Real-Time
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.PortfolioDB) return;
  
  // Initial render
  renderAllPortfolioContent();

  // Listen for database changes from Admin Panel or tabs
  window.PortfolioDB.subscribe('all', () => {
    renderAllPortfolioContent();
  });

  // Cross-tab synchronization via storage event
  window.addEventListener('storage', (e) => {
    if (e.key === 'pk_portfolio_database_v1') {
      window.PortfolioDB.init();
      renderAllPortfolioContent();
    }
  });

  // Intercept Contact Form Submissions and write to Database
  setupContactFormDatabaseLogging();
});

function renderAllPortfolioContent() {
  renderProfileAndHero();
  renderExperienceTimeline();
  renderProjectsGrid();
  renderResearchSection();
  renderCertificationsGrid();
  renderSkillsMatrices();
}

/* 1. Hero & Profile Details */
function renderProfileAndHero() {
  const profile = window.PortfolioDB.getTable('profile');
  if (!profile) return;

  // Title / Name
  const heroTitleName = document.querySelector('.hero-title .gradient-text');
  if (heroTitleName && profile.fullName) {
    heroTitleName.textContent = profile.fullName;
  }

  // Hero Description
  const heroDesc = document.querySelector('.hero-description');
  if (heroDesc && profile.heroDescription) {
    heroDesc.textContent = profile.heroDescription;
  }

  // Status Badge
  const statusBadge = document.querySelector('.hero-badge span:last-child');
  if (statusBadge && profile.availabilityStatus) {
    statusBadge.textContent = profile.availabilityStatus;
  }

  // Metrics Counters
  if (profile.metrics) {
    const metricNums = document.querySelectorAll('.hero-metrics-row .metric-item .metric-number');
    if (metricNums.length >= 4) {
      if (profile.metrics.keySystems) metricNums[0].textContent = profile.metrics.keySystems;
      if (profile.metrics.internships) metricNums[1].textContent = profile.metrics.internships;
      if (profile.metrics.certifications) metricNums[2].textContent = profile.metrics.certifications;
      if (profile.metrics.researchPapers) metricNums[3].textContent = profile.metrics.researchPapers;
    }
  }

  // Avatar Image
  const avatarImg = document.querySelector('.hero-image-inner img');
  if (avatarImg && profile.avatar) {
    avatarImg.src = profile.avatar;
    avatarImg.alt = `${profile.fullName} — Software Developer`;
  }

  // About Story Lead
  const aboutLead = document.querySelector('.about-lead');
  if (aboutLead && profile.bio) {
    aboutLead.innerHTML = profile.bio;
  }

  // Contact quick items
  const contactBadges = document.querySelectorAll('.about-contact-badges .contact-quick-item');
  if (contactBadges.length >= 3) {
    // Email
    if (profile.email) {
      const emailStrong = contactBadges[0].querySelector('strong');
      const emailBtn = contactBadges[0].querySelector('.copy-btn');
      if (emailStrong) emailStrong.textContent = profile.email;
      if (emailBtn) emailBtn.setAttribute('data-copy', profile.email);
    }
    // Phone
    if (profile.phone) {
      const phoneStrong = contactBadges[1].querySelector('strong');
      const phoneBtn = contactBadges[1].querySelector('.copy-btn');
      if (phoneStrong) phoneStrong.textContent = profile.phone;
      if (phoneBtn) phoneBtn.setAttribute('data-copy', profile.phone.replace(/[^0-9+]/g, ''));
    }
    // Location
    if (profile.location) {
      const locStrong = contactBadges[2].querySelector('strong');
      if (locStrong) locStrong.textContent = profile.location;
    }
  }
}

/* 2. Experience Timeline */
function renderExperienceTimeline() {
  const experiences = window.PortfolioDB.getTable('experience');
  const timelineContainer = document.querySelector('.timeline-container');
  if (!experiences || !timelineContainer || !Array.isArray(experiences)) return;

  timelineContainer.innerHTML = experiences.map((exp, index) => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="glass-card timeline-card">
        <div class="timeline-header">
          <div>
            <h3 class="timeline-role">${escapeHtml(exp.role)}</h3>
            <div class="timeline-company">${escapeHtml(exp.company)} <span style="font-size: 0.82rem; color: var(--text-dim); font-weight: 400;">&bull; ${escapeHtml(exp.location || 'Delhi, India')}</span></div>
          </div>
          <span class="timeline-date"><i class="fa-regular fa-calendar" style="margin-right: 4px;"></i> ${escapeHtml(exp.period)}</span>
        </div>
        <ul class="timeline-bullets">
          ${(exp.highlights || []).map(h => `<li>${escapeHtml(h)}</li>`).join('')}
        </ul>
        <div class="timeline-tech-stack">
          ${(exp.technologies || []).map(t => `<span class="tech-chip">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* 3. Projects Grid */
function renderProjectsGrid() {
  const projects = window.PortfolioDB.getTable('projects');
  const projectsGrid = document.querySelector('.projects-grid');
  if (!projects || !projectsGrid || !Array.isArray(projects)) return;

  projectsGrid.innerHTML = projects.map(p => `
    <div class="project-card glass-card" data-category="${escapeHtml(p.category || 'all')}">
      <div class="project-card-banner">
        <img src="${escapeHtml(p.image || 'assets/images/bikes4u.jpg')}" alt="${escapeHtml(p.title)}" loading="lazy">
        <span class="project-category-badge">${escapeHtml(p.categoryName || p.category || 'Featured')}</span>
      </div>

      <div class="project-card-body">
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-subtitle">${escapeHtml(p.subtitle || '')}</p>
        <p class="project-description">
          ${escapeHtml(p.description)}
        </p>

        <!-- Project Stat Badges -->
        <div class="project-stats-row">
          ${(p.stats || []).map(s => `
            <div class="stat-pill">
              <span class="stat-pill-label">${escapeHtml(s.label)}</span>
              <span class="stat-pill-val">${escapeHtml(s.value)}</span>
            </div>
          `).join('')}
        </div>

        <!-- Tech Chips -->
        <div class="project-tech-chips">
          ${(p.tags || []).map(t => `<span class="tech-chip">${escapeHtml(t)}</span>`).join('')}
        </div>

        <!-- Action Links & Interactive Simulator Trigger -->
        <div class="project-card-actions">
          ${p.simulatorId ? `
            <button class="btn btn-primary btn-sm btn-sim-trigger" data-sim="${escapeHtml(p.id.replace('proj-', ''))}">
              <i class="fa-solid fa-play"></i> Interactive Demo
            </button>
          ` : ''}
          ${p.githubUrl ? `
            <a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="View Source Code">
              <i class="fa-brands fa-github"></i> GitHub
            </a>
          ` : ''}
          ${p.liveUrl && p.liveUrl !== '#' ? `
            <a href="${escapeHtml(p.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Live Preview">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');

  // Rebind filter buttons and simulator triggers
  if (typeof initProjectFilters === 'function') initProjectFilters();
  if (typeof initModals === 'function') initModals();
}

/* 4. Research Section */
function renderResearchSection() {
  const researchList = window.PortfolioDB.getTable('research');
  if (!researchList || !Array.isArray(researchList) || researchList.length === 0) return;
  
  const res = researchList[0];
  const paperTitle = document.querySelector('.research-paper-card .research-title');
  if (paperTitle && res.title) paperTitle.textContent = res.title;

  const paperAbstract = document.querySelector('.research-paper-card .research-abstract');
  if (paperAbstract && res.abstract) paperAbstract.textContent = res.abstract;

  const paperHighlights = document.querySelector('.research-paper-card .research-keypoints');
  if (paperHighlights && res.highlights) {
    paperHighlights.innerHTML = res.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('');
  }
}

/* 5. Certifications Grid */
function renderCertificationsGrid() {
  const certs = window.PortfolioDB.getTable('certifications');
  const certsGrid = document.querySelector('.certifications-grid');
  if (!certs || !certsGrid || !Array.isArray(certs)) return;

  const colorClasses = {
    gold: { badge: 'badge-gold', icon: 'fa-solid fa-award', color: 'var(--gold-primary)' },
    emerald: { badge: 'badge-emerald', icon: 'fa-solid fa-shield-halved', color: 'var(--emerald-primary)' },
    cyan: { badge: 'badge-cyan', icon: 'fa-solid fa-brain', color: 'var(--cyan-primary)' }
  };

  certsGrid.innerHTML = certs.map(c => {
    const theme = colorClasses[c.badgeColor] || colorClasses.gold;
    return `
      <div class="glass-card cert-card" data-category="${escapeHtml(c.category || 'all')}">
        <div class="cert-header">
          <div class="cert-icon-wrap" style="color: ${theme.color};">
            <i class="${theme.icon}"></i>
          </div>
          <span class="cert-date"><i class="fa-regular fa-calendar-check" style="margin-right: 4px;"></i> ${escapeHtml(c.date)}</span>
        </div>

        <h3 class="cert-title">${escapeHtml(c.name)}</h3>
        <div class="cert-issuer">${escapeHtml(c.issuer)}</div>

        <div class="cert-skills-tags">
          ${(c.skills || []).map(s => `<span class="tech-chip">${escapeHtml(s)}</span>`).join('')}
        </div>

        ${c.credentialUrl && c.credentialUrl !== '#' ? `
          <div class="cert-footer">
            <a href="${escapeHtml(c.credentialUrl)}" target="_blank" rel="noopener noreferrer" class="cert-link">
              Verify Credential <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

/* 6. Skills Matrices */
function renderSkillsMatrices() {
  const skills = window.PortfolioDB.getTable('skills');
  if (!skills) return;

  // Render individual skill matrices if containers exist
  const renderList = (containerSelector, list) => {
    const container = document.querySelector(containerSelector);
    if (!container || !Array.isArray(list)) return;
    container.innerHTML = list.map(item => `
      <div class="skill-row">
        <div class="skill-row-info">
          <span class="skill-name"><i class="${item.icon || 'fa-solid fa-code'}" style="margin-right: 6px; color: var(--gold-light);"></i> ${escapeHtml(item.name)}</span>
          <span class="skill-percent">${item.level}%</span>
        </div>
        <div class="skill-progress-track">
          <div class="skill-progress-bar" style="width: ${item.level}%;"></div>
        </div>
      </div>
    `).join('');
  };

  renderList('#skills-programming-list', skills.programming);
  renderList('#skills-web-list', skills.webTech);
  renderList('#skills-networking-list', skills.networkingAndSecurity);
  renderList('#skills-systems-list', skills.itSystems);
  renderList('#skills-database-list', skills.databases);
}

/* 7. Contact Form Logging to Database */
function setupContactFormDatabaseLogging() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    if (!nameInput || !emailInput || !messageInput) return;

    const newMsg = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry',
      message: messageInput.value.trim(),
      date: new Date().toISOString(),
      read: false
    };

    // Insert into Database
    window.PortfolioDB.insert('messages', newMsg);

    // Provide luxury audio feedback & toast
    if (typeof playAudioClick === 'function') playAudioClick(600);
    if (typeof showToast === 'function') {
      showToast('Transmission recorded into Database. Piyush will respond shortly!');
    }

    contactForm.reset();
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

window.renderAllPortfolioContent = renderAllPortfolioContent;
