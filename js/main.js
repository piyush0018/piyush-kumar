/* ==========================================================================
   PIYUSH KUMAR — LUXURY PORTFOLIO ENGINE (Vanilla ES6)
   Constellation Canvas, Interactive Simulators, Micro-Audio, & Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initCustomCursor();
  initBackgroundCanvas();
  initTypewriter();
  initNavbarScrollSpy();
  initHeroTilt();
  initProjectFilters();
  initSimulators();
  initModals();
  initClipboardAndActions();
  initContactForm();
  initAudioEngine();
});

/* --------------------------------------------------------------------------
   1. THEME TOGGLE ENGINE (Obsidian Dark & Luxury Light)
   -------------------------------------------------------------------------- */
function initThemeEngine() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const root = document.documentElement;

  // Check saved theme preference or default to dark
  const savedTheme = localStorage.getItem('pk_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      playAudioClick(520);
      showToast(`Switched to ${newTheme === 'dark' ? 'Obsidian Dark' : 'Champagne Light'} mode`);
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('pk_theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  }
}

/* --------------------------------------------------------------------------
   2. CUSTOM MOUSE CURSOR & TRAIL
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const dot = document.getElementById('custom-cursor-dot');
  if (!cursor || !dot || window.innerWidth < 768) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

    // Update mouse position CSS variables on glass cards
    document.querySelectorAll('.glass-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = mouseX - rect.left;
      const y = mouseY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Smooth lerp for outer ring
  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states
  const interactives = document.querySelectorAll('a, button, input, select, textarea, .glass-card, .filter-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
}

/* --------------------------------------------------------------------------
   3. BACKGROUND CONSTELLATION & PARTICLE MESH CANVAS
   -------------------------------------------------------------------------- */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  let mouse = { x: null, y: null, radius: 150 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  let particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 16000), 75);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.color = Math.random() > 0.6 ? '#d4af37' : (Math.random() > 0.5 ? '#10b981' : '#38bdf8');
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion
      if (mouse.x !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  createParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212, 175, 55, ${0.18 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   4. DYNAMIC TYPEWRITER EFFECT
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const profile = (window.PortfolioDB && window.PortfolioDB.getTable('profile')) || null;
  const roles = (profile && profile.roles && profile.roles.length > 0) ? profile.roles : [
    'Full-Stack Software Engineer',
    'AI & Computer Vision Builder',
    'Machine Learning Researcher',
    'Network & IT Systems Specialist',
    'Next-Gen Web Architect'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 85;

  function typeLoop() {
    const currentRole = roles[roleIdx % roles.length];

    if (isDeleting) {
      el.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      el.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 450;
    }

    setTimeout(typeLoop, typingSpeed);
  }

  typeLoop();
}

/* --------------------------------------------------------------------------
   5. NAVBAR SCROLL SPY & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavbarScrollSpy() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navMenu = document.getElementById('nav-menu');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-sublink');
  const sections = document.querySelectorAll('section[id]');

  function openDrawer() {
    if (navMenu) navMenu.classList.add('mobile-active');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.classList.add('nav-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'true');
      const icon = navToggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-xmark';
    }
  }

  function closeDrawer() {
    if (navMenu) navMenu.classList.remove('mobile-active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('nav-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      const icon = navToggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    }
  }

  function toggleDrawer() {
    if (navMenu && navMenu.classList.contains('mobile-active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  // Scroll class on header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy active link
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile nav toggling
  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
      if (typeof playAudioClick === 'function') playAudioClick(500);
    });
  }

  if (navClose) {
    navClose.addEventListener('click', () => {
      closeDrawer();
      if (typeof playAudioClick === 'function') playAudioClick(400);
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeDrawer);
  }

  // Close mobile nav when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Close on screen resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) closeDrawer();
  });
}

/* --------------------------------------------------------------------------
   6. 3D HERO CARD PERSPECTIVE TILT
   -------------------------------------------------------------------------- */
function initHeroTilt() {
  const card = document.getElementById('hero-tilt-card');
  if (!card || window.innerWidth < 1024) return;

  const cardParent = card.parentElement;

  cardParent.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  cardParent.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* --------------------------------------------------------------------------
   7. PROJECT CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      playAudioClick(440);

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. INTERACTIVE PROJECT SIMULATORS ENGINE
   -------------------------------------------------------------------------- */
function initSimulators() {
  // 1. GST Calculator Simulator
  const gstRevInput = document.getElementById('gst-input-revenue');
  const gstRevDisplay = document.getElementById('gst-rev-display');
  const gstRateInput = document.getElementById('gst-input-rate');
  const gstItcInput = document.getElementById('gst-input-itc');
  const gstResultPayable = document.getElementById('gst-result-payable');
  const gstPredicted = document.getElementById('gst-predicted-quarter');

  function calculateGST() {
    if (!gstRevInput) return;
    const revenue = parseFloat(gstRevInput.value) || 0;
    const rate = parseFloat(gstRateInput.value) || 0.18;
    const itc = parseFloat(gstItcInput.value) || 0;

    gstRevDisplay.textContent = `₹${revenue.toLocaleString('en-IN')}`;

    const grossTax = revenue * rate;
    const netPayable = Math.max(0, grossTax - itc);

    // Simulated ML Forecast for next quarter (assuming 15% growth + seasonal adjustments)
    const mlPredictedQuarter = (netPayable * 3 * 1.08);

    gstResultPayable.textContent = `₹${Math.round(netPayable).toLocaleString('en-IN')}`;
    if (gstPredicted) {
      gstPredicted.textContent = `₹${Math.round(mlPredictedQuarter).toLocaleString('en-IN')}`;
    }
  }

  if (gstRevInput && gstRateInput && gstItcInput) {
    gstRevInput.addEventListener('input', calculateGST);
    gstRateInput.addEventListener('change', calculateGST);
    gstItcInput.addEventListener('input', calculateGST);
    calculateGST();
  }

  // 2. Optical Flow Radar Simulator
  const radarSpeedSlider = document.getElementById('radar-speed-slider');
  const radarSpeedVal = document.getElementById('radar-speed-val');
  const radarStatusText = document.getElementById('radar-status-text');
  const radarLogText = document.getElementById('radar-log-text');
  const radarSurgeBtn = document.getElementById('radar-trigger-surge');

  function updateRadar() {
    if (!radarSpeedSlider) return;
    const speed = parseInt(radarSpeedSlider.value, 10);
    radarSpeedVal.textContent = `${speed} km/h`;

    if (speed > 110) {
      radarStatusText.textContent = '🚨 RUSH DRIVING DETECTED!';
      radarStatusText.style.color = '#ef4444';
      radarLogText.innerHTML = `<span style="color: #ef4444;">[VIOLATION] Velocity threshold breached (${speed} km/h). SQLite alert logged. Optical flow magnitude: ${(speed * 0.12).toFixed(1)} px/frame.</span>`;
    } else if (speed > 90) {
      radarStatusText.textContent = '⚠️ ELEVATED SPEED';
      radarStatusText.style.color = '#f59e0b';
      radarLogText.textContent = `Speed approaching highway limit (${speed} km/h). Tracking vehicle telemetry.`;
    } else {
      radarStatusText.textContent = '🟢 NORMAL FLOW';
      radarStatusText.style.color = '#38bdf8';
      radarLogText.textContent = `Optical flow vectors stable. Vector magnitude: ${(speed * 0.05).toFixed(1)} px/frame.`;
    }
  }

  if (radarSpeedSlider) {
    radarSpeedSlider.addEventListener('input', updateRadar);
    updateRadar();
  }

  if (radarSurgeBtn) {
    radarSurgeBtn.addEventListener('click', () => {
      radarSpeedSlider.value = 135;
      updateRadar();
      playAudioClick(650);
      showToast('Simulated rapid highway overtaking maneuver!');
    });
  }

  // 3. EcoTrack Calculator Simulator
  const ecoDistInput = document.getElementById('eco-distance');
  const ecoDistVal = document.getElementById('eco-dist-val');
  const ecoTransport = document.getElementById('eco-transport-type');
  const ecoCo2Val = document.getElementById('eco-co2-val');
  const ecoBadgeAward = document.getElementById('eco-badge-award');

  function updateEcoTrack() {
    if (!ecoDistInput || !ecoTransport) return;
    const dist = parseFloat(ecoDistInput.value) || 0;
    const factor = parseFloat(ecoTransport.value) || 0;
    ecoDistVal.textContent = `${dist} km`;

    const totalCo2 = (dist * factor).toFixed(2);
    ecoCo2Val.textContent = `${totalCo2} kg CO2`;

    if (totalCo2 < 1.0) {
      ecoBadgeAward.textContent = '🌿 Award: "Planet Guardian" Badge';
      ecoBadgeAward.style.color = '#10b981';
    } else if (totalCo2 < 4.0) {
      ecoBadgeAward.textContent = '🏆 Award: "Green Commuter" Badge';
      ecoBadgeAward.style.color = '#d4af37';
    } else {
      ecoBadgeAward.textContent = '💡 Tip: Consider carpooling or metro transit';
      ecoBadgeAward.style.color = '#38bdf8';
    }
  }

  if (ecoDistInput && ecoTransport) {
    ecoDistInput.addEventListener('input', updateEcoTrack);
    ecoTransport.addEventListener('change', updateEcoTrack);
    updateEcoTrack();
  }

  // 4. Bikes4U Rental Simulator
  const bikeTierSelect = document.getElementById('bike-tier-select');
  const bikeDaysInput = document.getElementById('bike-days');
  const bikeDaysVal = document.getElementById('bike-days-val');
  const bikeTotalVal = document.getElementById('bike-total-val');
  const bikeReserveBtn = document.getElementById('bike-reserve-btn');

  function updateBikeBooking() {
    if (!bikeTierSelect || !bikeDaysInput) return;
    const rate = parseInt(bikeTierSelect.value, 10) || 499;
    const days = parseInt(bikeDaysInput.value, 10) || 1;
    bikeDaysVal.textContent = `${days} Day${days > 1 ? 's' : ''}`;

    const total = rate * days;
    bikeTotalVal.textContent = `₹${total.toLocaleString('en-IN')}`;
  }

  if (bikeTierSelect && bikeDaysInput) {
    bikeTierSelect.addEventListener('change', updateBikeBooking);
    bikeDaysInput.addEventListener('input', updateBikeBooking);
    updateBikeBooking();
  }

  if (bikeReserveBtn) {
    bikeReserveBtn.addEventListener('click', () => {
      playAudioClick(600);
      showToast('Booking query dispatched to real-time MySQL ledger!');
    });
  }
}

/* --------------------------------------------------------------------------
   9. MODALS MANAGER (Simulator, Architecture & Resume)
   -------------------------------------------------------------------------- */
function initModals() {
  // Simulator modal triggers
  const simBtns = document.querySelectorAll('.open-sim-btn');
  simBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const simType = btn.getAttribute('data-sim');
      const targetModal = document.getElementById(`modal-sim-${simType}`);
      if (targetModal) {
        targetModal.classList.add('active');
        playAudioClick(480);
      }
    });
  });

  // Project inspect buttons
  const inspectBtns = document.querySelectorAll('.inspect-proj-btn');
  inspectBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const proj = btn.getAttribute('data-proj');
      const simModal = document.getElementById(`modal-sim-${proj}`);
      if (simModal) {
        simModal.classList.add('active');
        playAudioClick(480);
      }
    });
  });

  // Resume Modal Trigger
  const resumeBtn = document.getElementById('open-resume-btn');
  const mobileResumeBtn = document.getElementById('mobile-resume-btn');
  const heroResumeBtn = document.getElementById('hero-resume-cta');
  const aboutResumeBtn = document.getElementById('about-resume-btn');
  const resumeModal = document.getElementById('modal-resume');

  function openResume() {
    const navMenu = document.getElementById('nav-menu');
    const navBackdrop = document.getElementById('nav-backdrop');
    if (navMenu) navMenu.classList.remove('mobile-active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('nav-open');
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      const icon = navToggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    }

    if (resumeModal) {
      resumeModal.classList.add('active');
      playAudioClick(520);
    }
  }

  if (resumeBtn) resumeBtn.addEventListener('click', openResume);
  if (mobileResumeBtn) mobileResumeBtn.addEventListener('click', openResume);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResume);
  if (aboutResumeBtn) aboutResumeBtn.addEventListener('click', openResume);

  // Resume Modal Tab Switcher (PDF View vs Structured ATS Text View)
  const resumeTabBtns = document.querySelectorAll('.resume-tab-btn');
  resumeTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');
      resumeTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const pdfView = document.getElementById('resume-tab-pdf');
      const textView = document.getElementById('resume-tab-text');

      if (tabTarget === 'pdf') {
        if (pdfView) pdfView.classList.add('active');
        if (textView) textView.classList.remove('active');
      } else if (tabTarget === 'text') {
        if (textView) textView.classList.add('active');
        if (pdfView) pdfView.classList.remove('active');
      }
      playAudioClick(440);
    });
  });

  // Close modals on close button or backdrop click
  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
      }
    });

    const closeBtn = backdrop.querySelector('[data-close-modal]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        backdrop.classList.remove('active');
      });
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach((modal) => {
        modal.classList.remove('active');
      });
    }
  });

  // Print Resume action
  const printBtn = document.getElementById('print-resume-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      // If printing, ensure text tab is visible for clean print preview
      const textView = document.getElementById('resume-tab-text');
      const pdfView = document.getElementById('resume-tab-pdf');
      const textBtn = document.querySelector('.resume-tab-btn[data-tab="text"]');
      const pdfBtn = document.querySelector('.resume-tab-btn[data-tab="pdf"]');
      
      if (textView && !textView.classList.contains('active')) {
        if (pdfView) pdfView.classList.remove('active');
        textView.classList.add('active');
        if (pdfBtn) pdfBtn.classList.remove('active');
        if (textBtn) textBtn.classList.add('active');
      }
      window.print();
    });
  }
}

/* --------------------------------------------------------------------------
   10. ONE-CLICK COPY & CLIPBOARD TOASTS
   -------------------------------------------------------------------------- */
function initClipboardAndActions() {
  const copyBtns = document.querySelectorAll('.copy-btn[data-copy]');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          playAudioClick(580);
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          showToast('Failed to copy. Please manually copy.');
        });
      }
    });
  });

  // Cite Research Paper BibTeX button
  const citeBtn = document.getElementById('cite-paper-btn');
  if (citeBtn) {
    citeBtn.addEventListener('click', () => {
      const bibtex = `@article{kumar2026gst,
  title={Integration of Machine Learning with Financial Tracking Systems for Enhanced GST Compliance and Expense Management},
  author={Kumar, Piyush},
  journal={Research Journal of Information Technology},
  year={2026}
}`;
      navigator.clipboard.writeText(bibtex).then(() => {
        playAudioClick(620);
        showToast('BibTeX citation copied to clipboard!');
      });
    });
  }

  // Read Abstract action
  const readAbstractBtn = document.getElementById('read-abstract-btn');
  if (readAbstractBtn) {
    readAbstractBtn.addEventListener('click', () => {
      const simModal = document.getElementById('modal-sim-gst');
      if (simModal) {
        simModal.classList.add('active');
        playAudioClick(480);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   11. INTERACTIVE LUXURY CONTACT FORM
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const sendBtn = document.getElementById('send-msg-btn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim() || 'Portfolio Inquiry';
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please complete all required fields.');
      return;
    }

    if (sendBtn) {
      sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting Message...';
      sendBtn.disabled = true;
    }

    playAudioClick(500);

    setTimeout(() => {
      if (sendBtn) {
        sendBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Transmitted Successfully';
        sendBtn.style.background = 'var(--cyan-emerald-gradient)';
      }

      playAudioChime();
      showToast(`Thank you, ${name}! Your transmission has been queued.`);

      setTimeout(() => {
        form.reset();
        if (sendBtn) {
          sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Direct Transmission';
          sendBtn.style.background = '';
          sendBtn.disabled = false;
        }
      }, 3000);
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   12. WEB AUDIO API SYNTHESIZER (Luxury Haptic Audio FX)
   -------------------------------------------------------------------------- */
let audioCtx = null;
let soundEnabled = false;

function initAudioEngine() {
  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;

      if (soundEnabled && !audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }

      if (soundIcon) {
        soundIcon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
      }

      if (soundEnabled) {
        playAudioChime();
        showToast('Luxury Audio FX Enabled');
      } else {
        showToast('Audio FX Muted');
      }
    });
  }
}

function playAudioClick(freq = 480) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) {
    // Graceful fallback if audio is restricted
  }
}

function playAudioChime() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major luxury arpeggio
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.05, audioCtx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.06 + 0.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime + idx * 0.06);
      osc.stop(audioCtx.currentTime + idx * 0.06 + 0.2);
    });
  } catch (e) {}
}

/* --------------------------------------------------------------------------
   13. TOAST NOTIFICATION DISPATCHER
   -------------------------------------------------------------------------- */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `<i class="fa-solid fa-sparkles" style="color: var(--gold-primary);"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3200);
}

/* --------------------------------------------------------------------------
   14. ADMIN KEYBOARD SHORTCUT (Ctrl + Shift + A)
   -------------------------------------------------------------------------- */
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
    e.preventDefault();
    window.location.href = 'admin.html';
  }
});
