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
    if (e.key === 'pk_portfolio_database_v2' || e.key === 'pk_portfolio_database_v1') {
      window.PortfolioDB.init();
      renderAllPortfolioContent();
    }
  });

  // Intercept Contact Form Submissions and write to Database
  setupContactFormDatabaseLogging();
});

function renderAllPortfolioContent() {
  renderProfileAndHero();
  renderEducationSection();
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

/* 2. Education Section */
function renderEducationSection() {
  const education = window.PortfolioDB.getTable('education');
  const eduGrid = document.querySelector('.edu-grid');
  if (!education || !eduGrid || !Array.isArray(education)) return;

  const badgeColors = ['var(--gold-primary)', 'var(--emerald-primary)', 'var(--cyan-primary)'];

  eduGrid.innerHTML = education.map((edu, idx) => `
    <div class="glass-card edu-card">
      <div>
        <span class="edu-badge">${escapeHtml(edu.period || '')}</span>
        <h4 class="edu-degree">${escapeHtml(edu.degree)}</h4>
        <div style="color: ${badgeColors[idx % badgeColors.length]}; font-weight: 600; font-size: 0.92rem; margin-bottom: 0.3rem;">
          ${escapeHtml(edu.institution)}
        </div>
        ${edu.description ? `<p class="edu-school" style="font-size: 0.85rem; line-height: 1.5; margin-bottom: 0.8rem;">${escapeHtml(edu.description)}</p>` : ''}
      </div>
      <div class="edu-date"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(edu.location || 'Delhi, India')}</div>
    </div>
  `).join('');
}

/* 3. Experience Timeline */
function renderExperienceTimeline() {
  const experiences = window.PortfolioDB.getTable('experience');
  const timelineContainer = document.querySelector('.timeline-container');
  if (!experiences || !timelineContainer || !Array.isArray(experiences)) return;

  timelineContainer.innerHTML = experiences.map((exp) => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="glass-card timeline-card">
        <div class="timeline-header">
          <div>
            <h3 class="timeline-role">${escapeHtml(exp.role)}</h3>
            <div class="timeline-company"><i class="fa-solid fa-building"></i> ${escapeHtml(exp.company)} <span style="font-size: 0.82rem; color: var(--text-dim); font-weight: 400;">&bull; ${escapeHtml(exp.location || 'Delhi, India')}</span></div>
          </div>
          <span class="timeline-period"><i class="fa-regular fa-calendar" style="margin-right: 4px;"></i> ${escapeHtml(exp.period)}</span>
        </div>
        <div class="timeline-bullets">
          ${(exp.highlights || []).map(h => `
            <div class="timeline-bullet">
              <i class="fa-solid fa-circle-check"></i>
              <span>${escapeHtml(h)}</span>
            </div>
          `).join('')}
        </div>
        ${exp.softSkillsNote ? `
          <div style="font-size: 0.82rem; color: var(--text-dim); font-style: italic; margin-bottom: 0.9rem;">
            <i class="fa-solid fa-lightbulb" style="color: var(--gold-light); margin-right: 4px;"></i> ${escapeHtml(exp.softSkillsNote)}
          </div>
        ` : ''}
        <div class="impact-pills-row">
          ${(exp.technologies || []).map(t => `<span class="impact-pill">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* 4. Projects Grid */
function renderProjectsGrid() {
  const projects = window.PortfolioDB.getTable('projects');
  const projectsGrid = document.querySelector('.projects-grid');
  if (!projects || !projectsGrid || !Array.isArray(projects)) return;

  projectsGrid.innerHTML = projects.map(p => `
    <div class="glass-card project-card" data-category="${escapeHtml(p.category || 'all')}">
      <div class="project-image-wrap">
        <img src="${escapeHtml(p.image || 'assets/images/bikes4u.jpg')}" alt="${escapeHtml(p.title)}" loading="lazy">
        <span class="project-badge-tag">${escapeHtml(p.categoryName || p.category || 'Featured')}</span>
      </div>

      <div class="project-content">
        <div>
          <h3 class="project-title">${escapeHtml(p.title)}</h3>
          ${p.subtitle ? `<p style="font-size: 0.85rem; color: var(--gold-light); margin-bottom: 0.6rem; font-weight: 600;">${escapeHtml(p.subtitle)}</p>` : ''}
          <p class="project-desc">
            ${escapeHtml(p.description)}
          </p>

          <!-- Project Stat Badges -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.2rem;">
            ${(p.stats || []).map(s => `
              <div class="stat-pill" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.75rem; border-radius: 6px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); font-size: 0.78rem;">
                <span style="color: var(--text-dim);">${escapeHtml(s.label)}:</span>
                <strong style="color: var(--gold-light);">${escapeHtml(s.value)}</strong>
              </div>
            `).join('')}
          </div>

          <!-- Tech Chips -->
          <div class="project-tech-stack">
            ${(p.tags || []).map(t => `<span class="tech-chip">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>

        <!-- Action Links & Interactive Simulator Trigger -->
        <div class="project-actions">
          ${p.simulatorId ? `
            <button class="btn btn-primary btn-sm open-sim-btn" data-sim="${escapeHtml(p.id.replace('proj-', ''))}">
              <i class="fa-solid fa-calculator"></i> Launch Interactive Demo
            </button>
          ` : ''}
          ${p.githubUrl ? `
            <a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="View Source Code">
              <i class="fa-brands fa-github"></i> GitHub
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

/* 5. Research Section */
function renderResearchSection() {
  const researchList = window.PortfolioDB.getTable('research');
  if (!researchList || !Array.isArray(researchList) || researchList.length === 0) return;
  
  const res = researchList[0];
  const paperTitle = document.querySelector('.research-card .research-title');
  if (paperTitle && res.title) paperTitle.textContent = `"${res.title}"`;

  const paperAbstract = document.querySelector('.research-card .research-abstract');
  if (paperAbstract && res.abstract) {
    paperAbstract.innerHTML = `<strong>Abstract:</strong> ${escapeHtml(res.abstract)}`;
  }

  const paperHighlights = document.querySelector('.research-card .research-highlights-grid');
  if (paperHighlights && res.highlights && res.highlights.length > 0) {
    const titles = ['Predictive Modeling', 'Data Automation & Accuracy', 'Efficiency Gain'];
    const icons = ['fa-solid fa-brain', 'fa-solid fa-shield-halved', 'fa-solid fa-arrow-trend-up'];
    paperHighlights.innerHTML = res.highlights.map((h, i) => `
      <div class="research-mini-box">
        <div class="mini-box-title"><i class="${icons[i % icons.length]}"></i> ${titles[i % titles.length]}</div>
        <div class="mini-box-text">${escapeHtml(h)}</div>
      </div>
    `).join('');
  }
}

/* 6. Certifications Grid */
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
        <div>
          <div class="cert-card-top">
            <div class="cert-icon-wrap" style="color: ${theme.color};">
              <i class="${theme.icon}"></i>
            </div>
            <div>
              <span class="cert-issuer">${escapeHtml(c.issuer)}</span>
              <h4 class="cert-name">${escapeHtml(c.name)}</h4>
            </div>
          </div>
          <div class="cert-date"><i class="fa-solid fa-calendar-check"></i> ${escapeHtml(c.date)}</div>
          
          <div class="cert-skills-tags" style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.2rem;">
            ${(c.skills || []).map(s => `<span class="tech-chip" style="font-size: 0.74rem;">${escapeHtml(s)}</span>`).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.8rem; border-top: 1px solid var(--border-subtle);">
          <div class="cert-badge-pill">
            <i class="fa-solid fa-circle-check" style="color: ${theme.color};"></i> Verified
          </div>
          ${c.credentialUrl && c.credentialUrl !== '#' ? `
            <a href="${escapeHtml(c.credentialUrl)}" target="_blank" rel="noopener noreferrer" style="font-size: 0.8rem; color: var(--gold-light); display: inline-flex; align-items: center; gap: 0.3rem;">
              Credential <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.7rem;"></i>
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/* 7. Skills Matrices */
function renderSkillsMatrices() {
  const skills = window.PortfolioDB.getTable('skills');
  if (!skills) return;

  const renderList = (containerSelector, list) => {
    const container = document.querySelector(containerSelector);
    if (!container || !Array.isArray(list)) return;
    container.innerHTML = list.map(item => `
      <div class="skill-row" style="margin-bottom: 1rem;">
        <div class="skill-row-info" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; font-size: 0.88rem;">
          <span class="skill-name" style="font-weight: 600;"><i class="${item.icon || 'fa-solid fa-code'}" style="margin-right: 6px; color: var(--gold-light);"></i> ${escapeHtml(item.name)}</span>
          <span class="skill-percent" style="font-family: var(--font-code); color: var(--gold-primary); font-size: 0.82rem;">${item.level}%</span>
        </div>
        <div class="skill-progress-track" style="height: 6px; background: rgba(255,255,255,0.06); border-radius: var(--radius-full); overflow: hidden;">
          <div class="skill-progress-bar" style="height: 100%; width: ${item.level}%; background: var(--gold-gradient); border-radius: var(--radius-full);"></div>
        </div>
      </div>
    `).join('');
  };

  renderList('#skills-programming-list', skills.programming);
  renderList('#skills-aiml-list', skills.aiAndMl);
  renderList('#skills-web-list', skills.webTech);
  renderList('#skills-frameworks-list', skills.frameworksAndTools);
  renderList('#skills-networking-list', skills.networking);
  renderList('#skills-systems-list', skills.itSystems);
  renderList('#skills-database-list', skills.databases);
  renderList('#skills-concepts-list', skills.coreConcepts);
  renderList('#skills-softskills-list', skills.softSkills);
}

/* 8. Contact Form Logging to Database */
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
