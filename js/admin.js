/* ==========================================================================
   PORTFOLIO LUXURY ADMIN DASHBOARD ENGINE (js/admin.js)
   Visual Database Explorer, Content Management & JSON Sync
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initSidebarNav();
  initDashboardStats();
  initVisualDatabaseExplorer();
  initProfileEditor();
  initExperienceManager();
  initProjectsManager();
  initResearchEditor();
  initCertificationsManager();
  initSkillsManager();
  initInboxManager();
  initSettingsManager();
});

/* --------------------------------------------------------------------------
   1. AUTHENTICATION & SESSION GATEWAY
   -------------------------------------------------------------------------- */
function initAdminAuth() {
  const loginGateway = document.getElementById('login-gateway');
  const adminApp = document.getElementById('admin-app');
  const loginForm = document.getElementById('admin-login-form');
  const passInput = document.getElementById('admin-passcode-input');
  const errorMsg = document.getElementById('login-error-msg');
  const togglePassBtn = document.getElementById('toggle-pass-visibility');
  const eyeIcon = document.getElementById('pass-eye-icon');

  // Check existing session
  if (sessionStorage.getItem('pk_admin_authenticated') === 'true') {
    grantAccess();
  }

  // Toggle eye icon
  if (togglePassBtn) {
    togglePassBtn.addEventListener('click', () => {
      if (passInput.type === 'password') {
        passInput.type = 'text';
        eyeIcon.className = 'fa-regular fa-eye-slash';
      } else {
        passInput.type = 'password';
        eyeIcon.className = 'fa-regular fa-eye';
      }
    });
  }

  // Submit Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPass = passInput.value.trim();
      
      if (window.PortfolioDB.verifyPasscode(enteredPass)) {
        sessionStorage.setItem('pk_admin_authenticated', 'true');
        grantAccess();
        showAdminToast('Welcome back, Piyush! Admin portal unlocked.', 'success');
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
        passInput.classList.add('error');
        setTimeout(() => passInput.classList.remove('error'), 1000);
      }
    });
  }

  function grantAccess() {
    if (loginGateway) loginGateway.style.display = 'none';
    if (adminApp) adminApp.style.display = 'flex';
    refreshAllAdminData();
  }

  // Logout Handlers
  const logoutBtns = [document.getElementById('header-logout-btn'), document.getElementById('sidebar-logout-btn')];
  logoutBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        sessionStorage.removeItem('pk_admin_authenticated');
        window.location.reload();
      });
    }
  });
}

/* --------------------------------------------------------------------------
   2. SIDEBAR NAVIGATION & ROUTING
   -------------------------------------------------------------------------- */
function initSidebarNav() {
  const navItems = document.querySelectorAll('.admin-nav-item');
  const pageTitle = document.getElementById('admin-current-page-title');

  const titleMap = {
    dashboard: 'Dashboard Overview',
    database: 'Visual Database Explorer & Schema Engine',
    profile: 'Hero & Profile Content Configuration',
    experience: 'Work Experience & Timeline Manager',
    projects: 'Showcase Projects & Interactive Simulators',
    research: 'Research & Scientific Publications',
    certifications: 'Accredited Certifications & Credentials',
    skills: 'Technical Skills Matrix & Proficiencies',
    messages: 'Client Inquiries & Contact Transmissions',
    settings: 'Security, Passcode & Database Sync'
  };

  const sidebar = document.getElementById('admin-sidebar');
  const mobileToggle = document.getElementById('mobile-sidebar-toggle');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 900 && !sidebar.contains(e.target) && e.target !== mobileToggle) {
        sidebar.classList.remove('open');
      }
    });
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewId = item.getAttribute('data-view');
      switchAdminView(viewId);
    });
  });

  window.switchAdminView = function(viewId) {
    // Close sidebar on mobile
    if (sidebar && window.innerWidth <= 900) {
      sidebar.classList.remove('open');
    }

    // Update nav classes
    navItems.forEach(n => {
      if (n.getAttribute('data-view') === viewId) {
        n.classList.add('active');
      } else {
        n.classList.remove('active');
      }
    });

    // Update active view
    document.querySelectorAll('.admin-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Update header title
    if (pageTitle && titleMap[viewId]) {
      pageTitle.textContent = titleMap[viewId];
    }

    // Trigger section re-render if needed
    if (viewId === 'database') renderVisualDBTable(currentSelectedDBTable);
    if (viewId === 'dashboard') initDashboardStats();
  };

  // Quick Save Header button
  const quickSaveBtn = document.getElementById('header-quick-save-btn');
  if (quickSaveBtn) {
    quickSaveBtn.addEventListener('click', () => {
      showAdminToast('All database changes saved and synced live!', 'success');
    });
  }
}

/* --------------------------------------------------------------------------
   3. DASHBOARD METRICS & RECENT MESSAGES
   -------------------------------------------------------------------------- */
function initDashboardStats() {
  const projects = window.PortfolioDB.getTable('projects') || [];
  const certs = window.PortfolioDB.getTable('certifications') || [];
  const exp = window.PortfolioDB.getTable('experience') || [];
  const msgs = window.PortfolioDB.getTable('messages') || [];

  const unreadCount = msgs.filter(m => !m.read).length;

  const projEl = document.getElementById('dash-projects-count');
  const certEl = document.getElementById('dash-certs-count');
  const expEl = document.getElementById('dash-exp-count');
  const msgsEl = document.getElementById('dash-msgs-count');
  const unreadSubtext = document.getElementById('dash-unread-subtext');
  const sidebarBadge = document.getElementById('sidebar-inbox-badge');

  if (projEl) projEl.textContent = projects.length;
  if (certEl) certEl.textContent = certs.length;
  if (expEl) expEl.textContent = exp.length;
  if (msgsEl) msgsEl.textContent = msgs.length;
  if (unreadSubtext) unreadSubtext.textContent = `${unreadCount} unread inquiries`;
  if (sidebarBadge) {
    sidebarBadge.textContent = unreadCount;
    sidebarBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
  }

  // Storage estimation
  const rawJSON = window.PortfolioDB.exportJSON();
  const dbSizeEl = document.getElementById('dash-db-size');
  if (dbSizeEl) {
    const bytes = new Blob([rawJSON]).size;
    dbSizeEl.textContent = `~${(bytes / 1024).toFixed(1)} KB`;
  }

  // Populate recent messages preview table on dashboard
  const dashTableBody = document.querySelector('#dash-recent-messages-table tbody');
  if (dashTableBody) {
    if (msgs.length === 0) {
      dashTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-dim); padding: 2rem;">No messages recorded yet.</td></tr>`;
    } else {
      dashTableBody.innerHTML = msgs.slice(0, 5).map(m => `
        <tr>
          <td><strong style="color: #fff;">${escapeHtml(m.name)}</strong></td>
          <td><code>${escapeHtml(m.email)}</code></td>
          <td>${escapeHtml(m.subject || 'Inquiry')}</td>
          <td>${new Date(m.date).toLocaleDateString()}</td>
          <td>
            <span class="cell-badge" style="${m.read ? 'background: rgba(255,255,255,0.08); color: var(--text-dim);' : 'background: rgba(212,175,55,0.2); color: var(--gold-light);'}">
              ${m.read ? 'Read' : 'New'}
            </span>
          </td>
        </tr>
      `).join('');
    }
  }
}

/* --------------------------------------------------------------------------
   4. VISUAL DATABASE EXPLORER & SCHEMA ENGINE
   -------------------------------------------------------------------------- */
let currentSelectedDBTable = 'projects';

function initVisualDatabaseExplorer() {
  const dbTableTabs = document.querySelectorAll('.db-tab-btn');
  const tableViewSection = document.getElementById('db-table-view-section');
  const rawJsonSection = document.getElementById('db-raw-json-section');
  const rawJsonTextarea = document.getElementById('raw-json-textarea');
  const jsonFormatBtn = document.getElementById('json-format-btn');
  const jsonSaveBtn = document.getElementById('json-save-btn');
  const searchInput = document.getElementById('db-search-input');
  const addRecordBtn = document.getElementById('db-add-record-btn');

  // Table Tabs click handler
  dbTableTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tableName = tab.getAttribute('data-dbtable');
      dbTableTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (tableName === 'raw_json') {
        tableViewSection.style.display = 'none';
        rawJsonSection.style.display = 'block';
        rawJsonTextarea.value = window.PortfolioDB.exportJSON();
      } else {
        rawJsonSection.style.display = 'none';
        tableViewSection.style.display = 'block';
        currentSelectedDBTable = tableName;
        renderVisualDBTable(tableName);
      }
    });
  });

  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderVisualDBTable(currentSelectedDBTable, e.target.value.toLowerCase());
    });
  }

  // Insert Record Button
  if (addRecordBtn) {
    addRecordBtn.addEventListener('click', () => {
      openUniversalRecordModal(currentSelectedDBTable);
    });
  }

  // JSON Format Button
  if (jsonFormatBtn) {
    jsonFormatBtn.addEventListener('click', () => {
      try {
        const parsed = JSON.parse(rawJsonTextarea.value);
        rawJsonTextarea.value = JSON.stringify(parsed, null, 2);
        showAdminToast('JSON formatted and cleaned!', 'success');
      } catch (e) {
        showAdminToast(`JSON Syntax Error: ${e.message}`, 'danger');
      }
    });
  }

  // JSON Validate & Commit Button
  if (jsonSaveBtn) {
    jsonSaveBtn.addEventListener('click', () => {
      const res = window.PortfolioDB.importJSON(rawJsonTextarea.value);
      if (res.success) {
        showAdminToast('Raw JSON schema successfully committed to Database!', 'success');
        refreshAllAdminData();
      } else {
        showAdminToast(`Failed to commit: ${res.error}`, 'danger');
      }
    });
  }

  // Export DB
  const exportBtn = document.getElementById('db-export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(window.PortfolioDB.exportJSON());
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `portfolio_database_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showAdminToast('Database exported successfully as JSON file.', 'success');
    });
  }

  // Import JSON File Picker
  const importFile = document.getElementById('db-import-file');
  if (importFile) {
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = window.PortfolioDB.importJSON(event.target.result);
        if (res.success) {
          showAdminToast('Database imported & synchronized from file!', 'success');
          refreshAllAdminData();
        } else {
          showAdminToast(`Import failed: ${res.error}`, 'danger');
        }
      };
      reader.readAsText(file);
    });
  }

  // Factory Reset
  const resetBtn = document.getElementById('db-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset the database to factory default? All customizations will be reset.')) {
        window.PortfolioDB.resetToDefault();
        showAdminToast('Database reset to initial factory default state.', 'success');
        refreshAllAdminData();
      }
    });
  }
}

function renderVisualDBTable(tableName, searchFilter = '') {
  const tableBadge = document.getElementById('current-dbtable-badge');
  const tableCount = document.getElementById('current-dbtable-count');
  const tableHead = document.querySelector('#visual-db-table thead');
  const tableBody = document.querySelector('#visual-db-table tbody');

  if (tableBadge) tableBadge.textContent = tableName;

  const data = window.PortfolioDB.getTable(tableName);

  if (!data) return;

  if (Array.isArray(data)) {
    let rows = data;
    if (searchFilter) {
      rows = rows.filter(r => JSON.stringify(r).toLowerCase().includes(searchFilter));
    }

    if (tableCount) tableCount.textContent = `(${rows.length} records)`;

    if (rows.length === 0) {
      tableHead.innerHTML = `<tr><th>Record</th></tr>`;
      tableBody.innerHTML = `<tr><td style="text-align: center; color: var(--text-dim); padding: 2rem;">No matching records found.</td></tr>`;
      return;
    }

    // Infer column headers from first row
    const keys = Object.keys(rows[0]).slice(0, 5); // display top 5 keys in table

    tableHead.innerHTML = `
      <tr>
        ${keys.map(k => `<th>${escapeHtml(k)}</th>`).join('')}
        <th>Actions</th>
      </tr>
    `;

    tableBody.innerHTML = rows.map(r => `
      <tr>
        ${keys.map(k => {
          let val = r[k];
          if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
          return `<td>${escapeHtml(String(val || ''))}</td>`;
        }).join('')}
        <td>
          <div class="table-actions">
            <button class="btn-table-action" onclick="openRecordEditModal('${tableName}', '${r.id || ''}')" title="Edit Record">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-table-action delete" onclick="deleteDBRecord('${tableName}', '${r.id || ''}')" title="Delete Record">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

  } else if (typeof data === 'object') {
    // Single object view (e.g. profile or settings)
    const keys = Object.keys(data);
    if (tableCount) tableCount.textContent = `(${keys.length} fields)`;

    tableHead.innerHTML = `
      <tr>
        <th>Key</th>
        <th>Value Type</th>
        <th>Current Value</th>
      </tr>
    `;

    tableBody.innerHTML = keys.map(k => {
      const val = data[k];
      return `
        <tr>
          <td><strong style="color: var(--gold-light); font-family: var(--font-code);">${escapeHtml(k)}</strong></td>
          <td><span class="cell-badge" style="background: rgba(255,255,255,0.05);">${typeof val}</span></td>
          <td><code>${escapeHtml(typeof val === 'object' ? JSON.stringify(val) : String(val))}</code></td>
        </tr>
      `;
    }).join('');
  }
}

window.deleteDBRecord = function(tableName, id) {
  if (confirm(`Are you sure you want to delete record ID "${id}" from ${tableName}?`)) {
    window.PortfolioDB.delete(tableName, id);
    showAdminToast(`Record ${id} removed.`, 'success');
    renderVisualDBTable(tableName);
    refreshAllAdminData();
  }
};

/* --------------------------------------------------------------------------
   5. PROFILE & HERO EDITOR
   -------------------------------------------------------------------------- */
function initProfileEditor() {
  const profile = window.PortfolioDB.getTable('profile') || {};
  
  // Populate inputs
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  };

  setVal('prof-fullName', profile.fullName);
  setVal('prof-tagline', profile.tagline);
  setVal('prof-availabilityStatus', profile.availabilityStatus);
  setVal('prof-avatar', profile.avatar);
  setVal('prof-resumePdf', profile.resumePdf);
  setVal('prof-email', profile.email);
  setVal('prof-phone', profile.phone);
  setVal('prof-location', profile.location);
  setVal('prof-linkedin', profile.linkedin);
  setVal('prof-github', profile.github);
  setVal('prof-heroDescription', profile.heroDescription);
  setVal('prof-bio', profile.bio);
  if (profile.roles && Array.isArray(profile.roles)) {
    setVal('prof-roles', profile.roles.join('\n'));
  }

  if (profile.metrics) {
    setVal('metric-keySystems', profile.metrics.keySystems);
    setVal('metric-internships', profile.metrics.internships);
    setVal('metric-certifications', profile.metrics.certifications);
    setVal('metric-researchPapers', profile.metrics.researchPapers);
  }

  // Update sidebar info
  const sidebarAvatar = document.getElementById('sidebar-avatar-img');
  const sidebarName = document.getElementById('sidebar-admin-name');
  if (sidebarAvatar && profile.avatar) sidebarAvatar.src = profile.avatar;
  if (sidebarName && profile.fullName) sidebarName.textContent = profile.fullName;

  // Save profile button
  const saveBtn = document.getElementById('save-profile-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const rolesText = document.getElementById('prof-roles').value;
      const rolesArray = rolesText.split('\n').map(r => r.trim()).filter(r => r.length > 0);

      const updatedProfile = {
        fullName: document.getElementById('prof-fullName').value.trim(),
        tagline: document.getElementById('prof-tagline').value.trim(),
        availabilityStatus: document.getElementById('prof-availabilityStatus').value.trim(),
        avatar: document.getElementById('prof-avatar').value.trim(),
        resumePdf: document.getElementById('prof-resumePdf').value.trim(),
        email: document.getElementById('prof-email').value.trim(),
        phone: document.getElementById('prof-phone').value.trim(),
        location: document.getElementById('prof-location').value.trim(),
        linkedin: document.getElementById('prof-linkedin').value.trim(),
        github: document.getElementById('prof-github').value.trim(),
        heroDescription: document.getElementById('prof-heroDescription').value.trim(),
        bio: document.getElementById('prof-bio').value.trim(),
        roles: rolesArray,
        metrics: {
          keySystems: document.getElementById('metric-keySystems').value.trim(),
          internships: document.getElementById('metric-internships').value.trim(),
          certifications: document.getElementById('metric-certifications').value.trim(),
          researchPapers: document.getElementById('metric-researchPapers').value.trim()
        }
      };

      window.PortfolioDB.saveTable('profile', updatedProfile);
      showAdminToast('Profile & Hero details saved to Database!', 'success');
      refreshAllAdminData();
    });
  }
}

/* --------------------------------------------------------------------------
   6. EXPERIENCE MANAGER
   -------------------------------------------------------------------------- */
function initExperienceManager() {
  const container = document.getElementById('experience-cards-container');
  const addBtn = document.getElementById('add-exp-modal-btn');
  const experiences = window.PortfolioDB.getTable('experience') || [];

  if (container) {
    container.innerHTML = experiences.map(exp => `
      <div class="admin-card" style="margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem;">
          <div>
            <h3 style="font-size: 1.1rem; color: #fff;">${escapeHtml(exp.role)}</h3>
            <div style="color: var(--gold-light); font-size: 0.88rem; font-weight: 600;">${escapeHtml(exp.company)}</div>
            <div style="color: var(--text-dim); font-size: 0.78rem; margin-top: 0.2rem;"><i class="fa-regular fa-calendar"></i> ${escapeHtml(exp.period)}</div>
          </div>
          <div class="table-actions">
            <button class="btn-table-action" onclick="openRecordEditModal('experience', '${exp.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-table-action delete" onclick="deleteDBRecord('experience', '${exp.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <ul style="font-size: 0.84rem; color: var(--text-muted); padding-left: 1.2rem; margin-bottom: 1rem;">
          ${(exp.highlights || []).map(h => `<li>${escapeHtml(h)}</li>`).join('')}
        </ul>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          ${(exp.technologies || []).map(t => `<span class="cell-badge" style="background: rgba(255,255,255,0.06); color: var(--gold-light);">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => openUniversalRecordModal('experience'));
  }
}

/* --------------------------------------------------------------------------
   7. PROJECTS MANAGER
   -------------------------------------------------------------------------- */
function initProjectsManager() {
  const container = document.getElementById('projects-admin-grid');
  const addBtn = document.getElementById('add-proj-modal-btn');
  const projects = window.PortfolioDB.getTable('projects') || [];

  if (container) {
    container.innerHTML = projects.map(p => `
      <div class="admin-card" style="margin-bottom: 0; display: flex; flex-direction: column;">
        <div style="position: relative; border-radius: var(--radius-sm); overflow: hidden; height: 160px; margin-bottom: 1rem; background: #0c1018;">
          <img src="${escapeHtml(p.image || 'assets/images/bikes4u.jpg')}" alt="${escapeHtml(p.title)}" style="width: 100%; height: 100%; object-fit: cover;">
          <span class="cell-badge" style="position: absolute; top: 10px; right: 10px; background: rgba(6,7,10,0.85); color: var(--gold-light); border: 1px solid var(--border-gold);">
            ${escapeHtml(p.categoryName || p.category)}
          </span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <h3 style="font-size: 1.15rem; color: #fff; line-height: 1.3;">${escapeHtml(p.title)}</h3>
          <div class="table-actions">
            <button class="btn-table-action" onclick="openRecordEditModal('projects', '${p.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-table-action delete" onclick="deleteDBRecord('projects', '${p.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; flex: 1;">
          ${escapeHtml(p.description.length > 140 ? p.description.slice(0, 140) + '...' : p.description)}
        </p>

        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem;">
          ${(p.tags || []).map(t => `<span class="cell-badge" style="background: rgba(56,189,248,0.12); color: var(--cyan-light);">${escapeHtml(t)}</span>`).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-dim); border-top: 1px solid var(--border-admin); padding-top: 0.8rem;">
          <span>Simulator ID: <code>${p.simulatorId || 'None'}</code></span>
          <span><a href="${p.githubUrl}" target="_blank" style="color: var(--gold-primary); text-decoration: none;"><i class="fa-brands fa-github"></i> Repo</a></span>
        </div>
      </div>
    `).join('');
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => openUniversalRecordModal('projects'));
  }
}

/* --------------------------------------------------------------------------
   8. RESEARCH EDITOR
   -------------------------------------------------------------------------- */
function initResearchEditor() {
  const researchList = window.PortfolioDB.getTable('research') || [];
  if (researchList.length === 0) return;
  const res = researchList[0];

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  };

  setVal('res-title', res.title);
  setVal('res-authors', res.authors);
  setVal('res-field', res.field);
  setVal('res-status', res.status);
  setVal('res-doi', res.doi);
  setVal('res-abstract', res.abstract);
  if (res.highlights && Array.isArray(res.highlights)) {
    setVal('res-highlights', res.highlights.join('\n'));
  }

  const saveBtn = document.getElementById('save-research-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const hlText = document.getElementById('res-highlights').value;
      const hlArray = hlText.split('\n').map(h => h.trim()).filter(h => h.length > 0);

      const updatedRes = [{
        id: res.id || 'res-1',
        title: document.getElementById('res-title').value.trim(),
        authors: document.getElementById('res-authors').value.trim(),
        field: document.getElementById('res-field').value.trim(),
        status: document.getElementById('res-status').value.trim(),
        doi: document.getElementById('res-doi').value.trim(),
        abstract: document.getElementById('res-abstract').value.trim(),
        highlights: hlArray,
        link: res.link || 'assets/docs/Piyush_Kumar_Resume.pdf'
      }];

      window.PortfolioDB.saveTable('research', updatedRes);
      showAdminToast('Research paper details saved to Database!', 'success');
      refreshAllAdminData();
    });
  }
}

/* --------------------------------------------------------------------------
   9. CERTIFICATIONS MANAGER
   -------------------------------------------------------------------------- */
function initCertificationsManager() {
  const container = document.getElementById('certs-admin-grid');
  const addBtn = document.getElementById('add-cert-modal-btn');
  const certs = window.PortfolioDB.getTable('certifications') || [];

  if (container) {
    container.innerHTML = certs.map(c => `
      <div class="admin-card" style="margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem;">
          <div>
            <h3 style="font-size: 1.05rem; color: #fff;">${escapeHtml(c.name)}</h3>
            <div style="color: var(--gold-light); font-size: 0.84rem; font-weight: 600;">${escapeHtml(c.issuer)}</div>
            <div style="color: var(--text-dim); font-size: 0.78rem;"><i class="fa-regular fa-calendar"></i> ${escapeHtml(c.date)}</div>
          </div>
          <div class="table-actions">
            <button class="btn-table-action" onclick="openRecordEditModal('certifications', '${c.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-table-action delete" onclick="deleteDBRecord('certifications', '${c.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          ${(c.skills || []).map(s => `<span class="cell-badge" style="background: rgba(16,185,129,0.12); color: var(--emerald-light);">${escapeHtml(s)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => openUniversalRecordModal('certifications'));
  }
}

/* --------------------------------------------------------------------------
   10. SKILLS MATRIX MANAGER
   -------------------------------------------------------------------------- */
function initSkillsManager() {
  const wrapper = document.getElementById('skills-editor-wrapper');
  const saveBtn = document.getElementById('save-skills-btn');
  const skills = window.PortfolioDB.getTable('skills') || {};

  if (!wrapper) return;

  const categories = [
    { key: 'programming', title: 'Programming Languages' },
    { key: 'aiAndMl', title: 'AI & Machine Learning' },
    { key: 'webTech', title: 'Web Technologies' },
    { key: 'frameworksAndTools', title: 'Frameworks & Tools' },
    { key: 'databases', title: 'Databases & SQL' },
    { key: 'networking', title: 'Computer Networking & Security' },
    { key: 'itSystems', title: 'IT Support & Operating Systems' },
    { key: 'coreConcepts', title: 'Core Computer Science Concepts' },
    { key: 'softSkills', title: 'Soft Skills & Leadership' }
  ];

  wrapper.innerHTML = categories.map(cat => {
    const list = skills[cat.key] || [];
    return `
      <div class="admin-card" style="margin-bottom: 1.5rem;">
        <div class="card-title-heading" style="margin-bottom: 1rem;">
          <i class="fa-solid fa-layer-group"></i> ${cat.title}
        </div>
        <div class="form-grid" id="skills-group-${cat.key}">
          ${list.map((item, idx) => `
            <div class="form-group" style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-admin);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label class="form-label" style="font-weight: 700; color: #fff;">${escapeHtml(item.name)}</label>
                <span class="cell-badge" style="background: rgba(212,175,55,0.15); color: var(--gold-light);" id="val-badge-${cat.key}-${idx}">${item.level}%</span>
              </div>
              <input type="range" class="skill-range-slider" min="50" max="100" value="${item.level}" 
                     data-cat="${cat.key}" data-idx="${idx}" style="width: 100%;"
                     oninput="document.getElementById('val-badge-${cat.key}-${idx}').textContent = this.value + '%'">
              <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                <input type="text" value="${escapeHtml(item.name)}" class="form-input skill-name-input" data-cat="${cat.key}" data-idx="${idx}" style="padding: 0.35rem 0.6rem; font-size: 0.8rem;">
                <input type="text" value="${escapeHtml(item.icon || 'fa-solid fa-code')}" class="form-input skill-icon-input" data-cat="${cat.key}" data-idx="${idx}" style="padding: 0.35rem 0.6rem; font-size: 0.8rem; width: 130px;" title="FontAwesome Icon Class">
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const updatedSkills = JSON.parse(JSON.stringify(skills));
      
      categories.forEach(cat => {
        const groupEl = document.getElementById(`skills-group-${cat.key}`);
        if (groupEl) {
          const sliders = groupEl.querySelectorAll('.skill-range-slider');
          const nameInputs = groupEl.querySelectorAll('.skill-name-input');
          const iconInputs = groupEl.querySelectorAll('.skill-icon-input');

          updatedSkills[cat.key] = Array.from(sliders).map((slider, idx) => ({
            name: nameInputs[idx].value.trim(),
            level: parseInt(slider.value, 10),
            icon: iconInputs[idx].value.trim()
          }));
        }
      });

      window.PortfolioDB.saveTable('skills', updatedSkills);
      showAdminToast('Skills matrix proficiencies saved to Database!', 'success');
      refreshAllAdminData();
    });
  }
}

/* --------------------------------------------------------------------------
   11. INBOX & INQUIRIES
   -------------------------------------------------------------------------- */
function initInboxManager() {
  const tableBody = document.querySelector('#inbox-data-table tbody');
  const markAllBtn = document.getElementById('inbox-mark-all-read');
  const clearAllBtn = document.getElementById('inbox-clear-all');
  const msgs = window.PortfolioDB.getTable('messages') || [];

  if (tableBody) {
    if (msgs.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 2.5rem;">No client transmissions in inbox.</td></tr>`;
    } else {
      tableBody.innerHTML = msgs.map(m => `
        <tr style="${!m.read ? 'background: rgba(212,175,55,0.04);' : ''}">
          <td>
            <span class="cell-badge" style="${m.read ? 'background: rgba(255,255,255,0.06); color: var(--text-dim);' : 'background: rgba(212,175,55,0.25); color: var(--gold-light);'}">
              ${m.read ? 'Read' : 'New'}
            </span>
          </td>
          <td><strong style="color: #fff;">${escapeHtml(m.name)}</strong></td>
          <td><code>${escapeHtml(m.email)}</code></td>
          <td>${escapeHtml(m.subject || 'Inquiry')}</td>
          <td>${new Date(m.date).toLocaleString()}</td>
          <td>
            <div class="table-actions">
              <button class="btn-table-action" onclick="viewMessageDetail('${m.id}')" title="Read Full Message"><i class="fa-solid fa-eye"></i></button>
              <button class="btn-table-action delete" onclick="deleteDBRecord('messages', '${m.id}')" title="Delete Inquiry"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      const updated = msgs.map(m => ({ ...m, read: true }));
      window.PortfolioDB.saveTable('messages', updated);
      showAdminToast('All messages marked as read.', 'success');
      refreshAllAdminData();
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to permanently clear all inbox messages?')) {
        window.PortfolioDB.saveTable('messages', []);
        showAdminToast('Inbox cleared.', 'success');
        refreshAllAdminData();
      }
    });
  }
}

window.viewMessageDetail = function(msgId) {
  const msg = window.PortfolioDB.getById('messages', msgId);
  if (!msg) return;

  // Mark as read
  window.PortfolioDB.update('messages', msgId, { read: true });

  const modal = document.getElementById('admin-msg-modal');
  const modalBody = document.getElementById('msg-modal-content');
  const replyLink = document.getElementById('msg-reply-link');

  if (modalBody) {
    modalBody.innerHTML = `
      <div style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-admin); padding-bottom: 0.8rem;">
        <div style="color: var(--gold-light); font-size: 0.8rem; text-transform: uppercase;">From:</div>
        <div style="font-size: 1.1rem; font-weight: 700; color: #fff;">${escapeHtml(msg.name)} &lt;${escapeHtml(msg.email)}&gt;</div>
        <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 0.2rem;">Received: ${new Date(msg.date).toLocaleString()}</div>
      </div>
      <div style="margin-bottom: 1rem;">
        <div style="color: var(--cyan-light); font-size: 0.8rem; text-transform: uppercase;">Subject:</div>
        <div style="font-weight: 600; color: #fff;">${escapeHtml(msg.subject || 'Portfolio Transmission')}</div>
      </div>
      <div style="background: rgba(0,0,0,0.3); padding: 1.2rem; border-radius: var(--radius-sm); border: 1px solid var(--border-admin);">
        <div style="color: var(--text-dim); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.4rem;">Message:</div>
        <p style="white-space: pre-wrap; color: var(--text-main); font-size: 0.92rem;">${escapeHtml(msg.message)}</p>
      </div>
    `;
  }

  if (replyLink) {
    replyLink.href = `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}&body=Hi ${encodeURIComponent(msg.name)},%0D%0A%0D%0AThank you for reaching out through my portfolio website.%0D%0A%0D%0ABest regards,%0D%0APiyush Kumar`;
  }

  if (modal) modal.classList.add('active');
  refreshAllAdminData();
};

const closeMsgModalBtn = document.getElementById('close-msg-modal-btn');
if (closeMsgModalBtn) {
  closeMsgModalBtn.addEventListener('click', () => {
    document.getElementById('admin-msg-modal').classList.remove('active');
  });
}

/* --------------------------------------------------------------------------
   12. SETTINGS & PASSCODE MANAGER
   -------------------------------------------------------------------------- */
function initSettingsManager() {
  const form = document.getElementById('change-passcode-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const curr = document.getElementById('curr-passcode').value;
      const newP = document.getElementById('new-passcode').value;
      const conf = document.getElementById('confirm-passcode').value;

      if (!window.PortfolioDB.verifyPasscode(curr)) {
        showAdminToast('Current passcode is incorrect!', 'danger');
        return;
      }
      if (newP !== conf) {
        showAdminToast('New passcodes do not match!', 'danger');
        return;
      }

      window.PortfolioDB.setPasscode(newP);
      showAdminToast('Admin passcode updated successfully!', 'success');
      form.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   13. UNIVERSAL CRUD RECORD MODAL (Dynamic Form Generator)
   -------------------------------------------------------------------------- */
window.openUniversalRecordModal = function(tableName, recordId = null) {
  const modal = document.getElementById('admin-crud-modal');
  const modalTitle = document.getElementById('crud-modal-title');
  const modalBody = document.getElementById('crud-modal-body');

  const isEdit = recordId !== null;
  let record = isEdit ? window.PortfolioDB.getById(tableName, recordId) : {};

  if (modalTitle) {
    modalTitle.textContent = `${isEdit ? 'Edit' : 'Add New'} Record (${tableName})`;
  }

  // Schema definition templates for array collections
  const schemas = {
    experience: [
      { key: 'role', label: 'Job Role / Title', type: 'text', required: true },
      { key: 'company', label: 'Company Name', type: 'text', required: true },
      { key: 'period', label: 'Duration / Period', type: 'text', placeholder: 'e.g. February 2026 – May 2026', required: true },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Delhi, India' },
      { key: 'highlights', label: 'Key Highlights (One per line)', type: 'textarea', isArray: true },
      { key: 'technologies', label: 'Tech Stack (Comma-separated)', type: 'text', isArrayComma: true }
    ],
    projects: [
      { key: 'title', label: 'Project Title', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtitle / Headline', type: 'text' },
      { key: 'category', label: 'Category Filter Key', type: 'select', options: ['fullstack', 'ai', 'systems'] },
      { key: 'categoryName', label: 'Display Category Badge', type: 'text', placeholder: 'e.g. Full Stack & ML' },
      { key: 'image', label: 'Project Banner Image URL/Path', type: 'text', placeholder: 'assets/images/bikes4u.jpg' },
      { key: 'description', label: 'Detailed Description', type: 'textarea', required: true },
      { key: 'tags', label: 'Tech Stack Tags (Comma-separated)', type: 'text', isArrayComma: true },
      { key: 'githubUrl', label: 'GitHub Repository URL', type: 'text' },
      { key: 'liveUrl', label: 'Live Demo URL', type: 'text' },
      { key: 'simulatorId', label: 'Simulator Modal ID (Optional)', type: 'text', placeholder: 'e.g. modal-sim-gst' }
    ],
    certifications: [
      { key: 'name', label: 'Certification Name', type: 'text', required: true },
      { key: 'issuer', label: 'Issuing Organization', type: 'text', required: true },
      { key: 'date', label: 'Date Issued', type: 'text', placeholder: 'e.g. August 2026' },
      { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. ai, security, cloud' },
      { key: 'badgeColor', label: 'Badge Glow Color', type: 'select', options: ['gold', 'emerald', 'cyan'] },
      { key: 'credentialUrl', label: 'Verification URL', type: 'text' },
      { key: 'skills', label: 'Covered Skills (Comma-separated)', type: 'text', isArrayComma: true }
    ],
    education: [
      { key: 'degree', label: 'Degree / Certificate', type: 'text', required: true },
      { key: 'institution', label: 'Institution / University', type: 'text', required: true },
      { key: 'period', label: 'Duration / Year', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'description', label: 'Description & Focus', type: 'textarea' }
    ]
  };

  const schema = schemas[tableName] || [
    { key: 'id', label: 'Record ID', type: 'text' }
  ];

  modalBody.innerHTML = `
    <form id="universal-crud-form">
      ${schema.map(field => {
        let val = record[field.key];
        if (field.isArray && Array.isArray(val)) val = val.join('\n');
        if (field.isArrayComma && Array.isArray(val)) val = val.join(', ');
        if (val === undefined) val = '';

        if (field.type === 'textarea') {
          return `
            <div class="form-group">
              <label class="form-label">${field.label}</label>
              <textarea class="form-textarea" name="${field.key}" rows="3" ${field.required ? 'required' : ''}>${escapeHtml(String(val))}</textarea>
            </div>
          `;
        } else if (field.type === 'select') {
          return `
            <div class="form-group">
              <label class="form-label">${field.label}</label>
              <select class="form-select" name="${field.key}">
                ${field.options.map(opt => `<option value="${opt}" ${val === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
          `;
        } else {
          return `
            <div class="form-group">
              <label class="form-label">${field.label}</label>
              <input type="text" class="form-input" name="${field.key}" value="${escapeHtml(String(val))}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
            </div>
          `;
        }
      }).join('')}

      <div style="display: flex; justify-content: flex-end; gap: 0.8rem; margin-top: 1.5rem; border-top: 1px solid var(--border-admin); padding-top: 1rem;">
        <button type="button" class="btn-admin btn-admin-secondary" onclick="document.getElementById('admin-crud-modal').classList.remove('active')">Cancel</button>
        <button type="submit" class="btn-admin btn-admin-primary">
          <i class="fa-solid fa-floppy-disk"></i> ${isEdit ? 'Update Record' : 'Create Record'}
        </button>
      </div>
    </form>
  `;

  // Handle submit
  const form = document.getElementById('universal-crud-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const resultObj = { ...record };

    schema.forEach(field => {
      const rawVal = formData.get(field.key);
      if (field.isArray) {
        resultObj[field.key] = rawVal.split('\n').map(s => s.trim()).filter(s => s.length > 0);
      } else if (field.isArrayComma) {
        resultObj[field.key] = rawVal.split(',').map(s => s.trim()).filter(s => s.length > 0);
      } else {
        resultObj[field.key] = rawVal ? rawVal.trim() : '';
      }
    });

    if (isEdit) {
      window.PortfolioDB.update(tableName, recordId, resultObj);
      showAdminToast(`Record updated successfully in ${tableName}.`, 'success');
    } else {
      window.PortfolioDB.insert(tableName, resultObj);
      showAdminToast(`New record inserted into ${tableName}.`, 'success');
    }

    modal.classList.remove('active');
    refreshAllAdminData();
  });

  modal.classList.add('active');
};

window.openRecordEditModal = function(tableName, recordId) {
  openUniversalRecordModal(tableName, recordId);
};

const closeCrudModalBtn = document.getElementById('close-crud-modal-btn');
if (closeCrudModalBtn) {
  closeCrudModalBtn.addEventListener('click', () => {
    document.getElementById('admin-crud-modal').classList.remove('active');
  });
}

/* --------------------------------------------------------------------------
   14. HELPER REFRESH & TOAST ENGINE
   -------------------------------------------------------------------------- */
function refreshAllAdminData() {
  initDashboardStats();
  initProfileEditor();
  initExperienceManager();
  initProjectsManager();
  initResearchEditor();
  initCertificationsManager();
  initSkillsManager();
  initInboxManager();
  renderVisualDBTable(currentSelectedDBTable);
}

function showAdminToast(msg, type = 'info') {
  const container = document.getElementById('admin-toasts');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  
  const icon = type === 'success' ? 'fa-solid fa-circle-check' :
               type === 'danger' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-info';
  const color = type === 'success' ? 'var(--emerald-primary)' :
                type === 'danger' ? 'var(--danger-primary)' : 'var(--gold-primary)';

  toast.innerHTML = `<i class="${icon}" style="color: ${color}; font-size: 1.1rem;"></i> <span>${escapeHtml(msg)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}
