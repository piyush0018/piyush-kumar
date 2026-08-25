/* ==========================================================================
   PORTFOLIO DATABASE LAYER (PortfolioDB)
   Client-Side Reactive Storage Engine for Dynamic CMS & Visual Database
   ========================================================================== */

const PORTFOLIO_DB_KEY = 'pk_portfolio_database_v1';

// Default initial dataset representing the full portfolio content
const DEFAULT_DATABASE = {
  profile: {
    fullName: "Piyush Kumar",
    tagline: "Software Developer & IT Systems Specialist",
    roles: [
      "Full-Stack Web Developer",
      "AI & Machine Learning Researcher",
      "Computer Vision Specialist",
      "IT Infrastructure & Network Engineer"
    ],
    bio: "Information Technology scholar at Guru Gobind Singh Indraprastha University (GGSIPU), combining deep full-stack web engineering expertise with computer vision, machine learning research, and enterprise computer networking.",
    heroDescription: "Information Technology engineer specializing in building robust full-stack web applications, interactive real-time dashboards, computer vision AI pipelines, and resilient network infrastructures.",
    avatar: "assets/images/avatar.jpg",
    resumePdf: "assets/docs/Piyush_Kumar_Resume.pdf",
    email: "piyusjkumar763@gmail.com",
    phone: "+91-9868552272",
    location: "Delhi, India (Open to Remote & Onsite)",
    linkedin: "https://linkedin.com/in/piyush-kumar-2159b8215",
    github: "https://github.com",
    availabilityStatus: "Available for Software Engineering Roles",
    metrics: {
      keySystems: "4+",
      internships: "2",
      certifications: "7",
      researchPapers: "1"
    }
  },

  experience: [
    {
      id: "exp-1",
      role: "Jr Full Stack Developer Intern",
      company: "NextZen Digital",
      period: "February 2026 – May 2026",
      location: "Remote / Hybrid",
      highlights: [
        "Worked with the core development team as an intern, gaining hands-on experience across both front-end and back-end modern architectures.",
        "Delivered consistent, production-grade contributions throughout the internship, earning commendations for fast learning and dedication.",
        "Collaborated with cross-functional engineers on software development tasks, applying and strengthening core web engineering skills."
      ],
      technologies: ["React", "Node.js", "REST APIs", "Git", "MySQL"]
    },
    {
      id: "exp-2",
      role: "Web Designing Intern",
      company: "Tech Access Pvt Ltd",
      period: "January 2023 – April 2023",
      location: "Delhi, India",
      highlights: [
        "Designed user-friendly UI components, improving user engagement by ~25% and strengthening front-end user experience.",
        "Improved front-end performance, reducing page load time by ~20% through code and asset optimization.",
        "Improved website usability and navigation through responsive layout enhancements and UI refinements.",
        "Collaborated with team members to ensure cross-browser compatibility and consistent front-end behaviour."
      ],
      technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "UI/UX"]
    }
  ],

  projects: [
    {
      id: "proj-gst",
      title: "GST Cash Ledger & Expense Prediction System",
      subtitle: "Full-Stack Financial Tax Automation & ML Forecast Engine",
      category: "fullstack",
      categoryName: "Full Stack & ML",
      image: "assets/images/gst-ledger.jpg",
      description: "Full-stack web application that automates complex Goods and Services Tax ledger computations, slashing manual ledger processing effort by ~40%. Incorporates interactive financial analytics dashboards and a predictive Machine Learning regression model for expense forecasting and tax liability estimation.",
      tags: ["HTML5/CSS3", "JavaScript", "Chart.js", "Machine Learning", "Tax Engine"],
      stats: [
        { label: "Manual Effort Reduction", value: "~40%" },
        { label: "Data Visualization", value: "Real-time Chart.js" },
        { label: "Tax Liability Engine", value: "ML Prediction" }
      ],
      liveUrl: "#",
      githubUrl: "https://github.com",
      simulatorId: "modal-sim-gst"
    },
    {
      id: "proj-driving",
      title: "AI-Based Rush Driving Detection System",
      subtitle: "Computer Vision & Optical Flow Video Pipeline",
      category: "ai",
      categoryName: "AI & Computer Vision",
      image: "assets/images/driving-ai.jpg",
      description: "Real-time intelligent video analysis system leveraging OpenCV and NumPy for vehicle motion tracking. Implements Gunnar Farnebäck and Lucas-Kanade Optical Flow algorithms for precise velocity estimation, sudden lane deviation identification, and automated SQLite event alerting.",
      tags: ["Python", "OpenCV", "NumPy", "Optical Flow", "Tkinter", "SQLite"],
      stats: [
        { label: "Motion Analysis", value: "Optical Flow" },
        { label: "Frame Rate", value: "Real-time 60fps" },
        { label: "Alert Logging", value: "SQLite Integrated" }
      ],
      liveUrl: "#",
      githubUrl: "https://github.com",
      simulatorId: "modal-sim-driving"
    },
    {
      id: "proj-ecotrack",
      title: "EcoTrack – Carbon Footprint Tracker",
      subtitle: "Full-Stack Sustainability Platform & Environmental Analytics",
      category: "fullstack",
      categoryName: "Full-Stack Flask",
      image: "assets/images/ecotrack.jpg",
      description: "Comprehensive sustainability web application built with Python Flask and SQLAlchemy. Enables users to compute and log daily transport and energy CO2 emissions with interactive 30-day analytics charts, dynamic gamified badges, peer leaderboards, and Werkzeug-secured authentication.",
      tags: ["Python", "Flask", "SQLAlchemy", "SQLite", "Chart.js", "Auth"],
      stats: [
        { label: "Trend Tracking", value: "30-Day Moving Avg" },
        { label: "Gamification", value: "Badges & Ranks" },
        { label: "Security", value: "Werkzeug Hashing" }
      ],
      liveUrl: "#",
      githubUrl: "https://github.com",
      simulatorId: "modal-sim-ecotrack"
    },
    {
      id: "proj-bikes4u",
      title: "Bikes4U – Online Bike Rental System",
      subtitle: "Full-Stack Rental Reservation & Real-Time Inventory",
      category: "systems",
      categoryName: "Web & Database",
      image: "assets/images/bikes4u.jpg",
      description: "Dynamic online vehicle reservation platform built with JavaScript, PHP, and MySQL. Features real-time fleet inventory tracking, date-based availability calculation, user authentication, customer booking management, and comprehensive administrative reporting.",
      tags: ["JavaScript", "PHP", "MySQL", "CSS3", "Inventory Engine"],
      stats: [
        { label: "Fleet Management", value: "Real-time SQL" },
        { label: "Booking Workflow", value: "Instant Confirm" },
        { label: "Database", value: "Relational Schema" }
      ],
      liveUrl: "#",
      githubUrl: "https://github.com",
      simulatorId: "modal-sim-bikes4u"
    }
  ],

  research: [
    {
      id: "res-1",
      title: "Integration of Machine Learning with Financial Tracking Systems for Enhanced GST Compliance and Expense Management",
      authors: "Piyush Kumar",
      field: "Applied Artificial Intelligence & Financial Systems Engineering",
      status: "Published Research Paper",
      abstract: "This paper presents a novel algorithmic architecture uniting Machine Learning predictive models with automated GST ledger workflows. The research proves a ~40% reduction in human computation overhead while improving tax liability forecasting accuracy through historical pattern recognition.",
      highlights: [
        "Formulated ML predictive regression model for proactive tax liability forecasting",
        "Demonstrated automated data reconciliation eliminating manual ledger discrepancies by ~40%",
        "Designed lightweight visualization pipeline for instant financial compliance verification"
      ],
      doi: "DOI: 10.1000/gst-ml-research-2026",
      link: "assets/docs/Piyush_Kumar_Resume.pdf"
    }
  ],

  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Technology in Information Technology",
      institution: "Guru Gobind Singh Indraprastha University (GGSIPU)",
      period: "September 2023 – June 2026",
      location: "Delhi, India",
      description: "Core specialization in Software Engineering, Computer Networks, Database Management Systems, Distributed Architectures, and Applied Artificial Intelligence."
    },
    {
      id: "edu-2",
      degree: "Diploma in Information Technology",
      institution: "Delhi Skill and Entrepreneurship University (DSEU)",
      period: "November 2020 – June 2023",
      location: "Delhi, India",
      description: "Graduated with honors in fundamentals of programming (C/C++, Java), Web Technologies, Operating Systems, and Network Administration."
    },
    {
      id: "edu-3",
      degree: "CBSE Secondary School Examination (Class 10th)",
      institution: "DMSSS",
      period: "Completed June 2020",
      location: "Delhi, India",
      description: "Distinction in Science, Mathematics, and Computer Applications."
    }
  ],

  certifications: [
    {
      id: "cert-1",
      name: "Certificate of Competency: Generative AI with Diffusion Models",
      issuer: "NVIDIA Deep Learning Institute",
      date: "July 2026",
      category: "ai",
      badgeColor: "gold",
      skills: ["Generative AI", "Diffusion Models", "PyTorch", "Deep Learning"],
      credentialUrl: "https://www.nvidia.com"
    },
    {
      id: "cert-2",
      name: "Google Cybersecurity Professional Certificate",
      issuer: "Google (via Coursera, 9 Specialization Courses)",
      date: "August 2026",
      category: "security",
      badgeColor: "emerald",
      skills: ["Network Security", "Linux", "SQL", "SIEM", "Python Security", "Incident Response"],
      credentialUrl: "https://coursera.org"
    },
    {
      id: "cert-3",
      name: "Oracle Certified Foundations Associate – Agentic AI",
      issuer: "Oracle University",
      date: "August 2026",
      category: "ai",
      badgeColor: "cyan",
      skills: ["Agentic AI Systems", "Autonomous Workflows", "LLM Orchestration"],
      credentialUrl: "https://oracle.com"
    },
    {
      id: "cert-4",
      name: "Introduction to Generative AI Studio",
      issuer: "Google Cloud (via Simplilearn SkillUp)",
      date: "June 2025",
      category: "cloud",
      badgeColor: "gold",
      skills: ["Google Cloud Vertex AI", "GenAI Studio", "Prompt Engineering"],
      credentialUrl: "https://cloud.google.com"
    },
    {
      id: "cert-5",
      name: "Data Structures and Algorithms Specialization",
      issuer: "Internshala Trainings",
      date: "2024",
      category: "core",
      badgeColor: "cyan",
      skills: ["C++", "Dynamic Programming", "Trees & Graphs", "Complexity Analysis"],
      credentialUrl: "#"
    },
    {
      id: "cert-6",
      name: "HackerRank Gold Badges (SQL, JS, Python, Go, Java)",
      issuer: "HackerRank",
      date: "2024 – 2026",
      category: "coding",
      badgeColor: "emerald",
      skills: ["Advanced SQL", "Intermediate JavaScript", "Python 3", "Go Language"],
      credentialUrl: "https://hackerrank.com"
    },
    {
      id: "cert-7",
      name: "Cybersecurity & Applied Ethical Hacking",
      issuer: "Infosys Springboard",
      date: "2025",
      category: "security",
      badgeColor: "gold",
      skills: ["Ethical Hacking", "Penetration Testing", "Threat Mitigation", "Cryptography"],
      credentialUrl: "#"
    }
  ],

  skills: {
    programming: [
      { name: "Go (Golang)", level: 85, icon: "fa-brands fa-golang" },
      { name: "Python", level: 92, icon: "fa-brands fa-python" },
      { name: "JavaScript (ES6+)", level: 90, icon: "fa-brands fa-js" },
      { name: "C / C++", level: 82, icon: "fa-solid fa-code" },
      { name: "Java", level: 80, icon: "fa-brands fa-java" }
    ],
    webTech: [
      { name: "React.js", level: 88, icon: "fa-brands fa-react" },
      { name: "Node.js & Express", level: 86, icon: "fa-brands fa-node-js" },
      { name: "HTML5 / CSS3 / SCSS", level: 95, icon: "fa-brands fa-html5" },
      { name: "Bootstrap / Vanilla UI", level: 92, icon: "fa-brands fa-bootstrap" },
      { name: "RESTful API Design", level: 90, icon: "fa-solid fa-cloud-arrow-up" }
    ],
    frameworksAndTools: [
      { name: "Gin Framework (Go)", level: 82, icon: "fa-solid fa-bolt" },
      { name: "Git & GitHub", level: 90, icon: "fa-brands fa-git-alt" },
      { name: "Docker Containerization", level: 80, icon: "fa-brands fa-docker" },
      { name: "Postman & API Testing", level: 88, icon: "fa-solid fa-vial" },
      { name: "Jupyter Notebook", level: 85, icon: "fa-solid fa-book-open" }
    ],
    databases: [
      { name: "MySQL", level: 90, icon: "fa-solid fa-database" },
      { name: "SQL (Advanced)", level: 92, icon: "fa-solid fa-table" },
      { name: "MongoDB", level: 82, icon: "fa-solid fa-leaf" },
      { name: "SQLite", level: 88, icon: "fa-solid fa-hard-drive" }
    ],
    networkingAndSecurity: [
      { name: "OSI & TCP/IP Protocol Stacks", level: 92, icon: "fa-solid fa-network-wired" },
      { name: "Subnetting & IPv4/IPv6 Addressing", level: 90, icon: "fa-solid fa-sitemap" },
      { name: "Routing, Switching & VLANs", level: 86, icon: "fa-solid fa-arrows-split-up-and-left" },
      { name: "DNS, DHCP, HTTP/S, SSH, FTP", level: 92, icon: "fa-solid fa-globe" },
      { name: "Network Security & Firewalls", level: 88, icon: "fa-solid fa-shield-halved" },
      { name: "VPN Fundamentals & Tunnels", level: 84, icon: "fa-solid fa-lock" }
    ],
    itSystems: [
      { name: "Linux Administration (Ubuntu/Debian)", level: 88, icon: "fa-brands fa-linux" },
      { name: "Windows Server & Active Directory", level: 85, icon: "fa-brands fa-windows" },
      { name: "macOS Environments", level: 82, icon: "fa-brands fa-apple" },
      { name: "Hardware & Network Troubleshooting", level: 90, icon: "fa-solid fa-wrench" },
      { name: "Remote Desktop & IT Support", level: 92, icon: "fa-solid fa-headset" },
      { name: "Backup, Recovery & Ticketing Systems", level: 88, icon: "fa-solid fa-life-ring" }
    ]
  },

  messages: [
    {
      id: "msg-welcome",
      name: "Portfolio Security Bot",
      email: "system@piyushkumar.dev",
      subject: "Welcome to your Admin & Database System",
      message: "The database management system is operational. All incoming contact inquiries from your portfolio will appear here in real-time.",
      date: "2026-08-24T18:45:00.000Z",
      read: false
    }
  ],

  settings: {
    passcodeHash: "admin123", // Default passcode
    siteTheme: "dark",
    soundEnabled: true,
    lastBackup: new Date().toISOString(),
    version: "1.2.0"
  }
};

/* --- PortfolioDB Core API --- */
class DatabaseManager {
  constructor() {
    this.storageKey = PORTFOLIO_DB_KEY;
    this.listeners = {};
    this.init();
  }

  // Initialize and load database
  init() {
    try {
      const existing = localStorage.getItem(this.storageKey);
      if (!existing) {
        this.saveAll(DEFAULT_DATABASE);
      } else {
        // Merge any new fields if default schema evolved
        const parsed = JSON.parse(existing);
        const merged = { ...DEFAULT_DATABASE, ...parsed };
        this.saveAll(merged);
      }
    } catch (err) {
      console.warn('PortfolioDB: Storage init fallback to default data', err);
      this.saveAll(DEFAULT_DATABASE);
    }
  }

  // Get full database
  getAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : JSON.parse(JSON.stringify(DEFAULT_DATABASE));
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
    }
  }

  // Save full database
  saveAll(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.notify('all', data);
  }

  // Get specific table/collection
  getTable(tableName) {
    const db = this.getAll();
    return db[tableName] !== undefined ? db[tableName] : null;
  }

  // Save specific table/collection
  saveTable(tableName, tableData) {
    const db = this.getAll();
    db[tableName] = tableData;
    this.saveAll(db);
    this.notify(tableName, tableData);
  }

  // Add new item to an array table (e.g. experience, projects, certifications, messages)
  insert(tableName, item) {
    const table = this.getTable(tableName);
    if (Array.isArray(table)) {
      if (!item.id) {
        item.id = `${tableName.slice(0, 4)}-${Date.now()}`;
      }
      table.unshift(item);
      this.saveTable(tableName, table);
      return item;
    }
    return null;
  }

  // Update item by ID in array table
  update(tableName, id, updatedFields) {
    const table = this.getTable(tableName);
    if (Array.isArray(table)) {
      const index = table.findIndex(item => item.id === id);
      if (index !== -1) {
        table[index] = { ...table[index], ...updatedFields };
        this.saveTable(tableName, table);
        return table[index];
      }
    } else if (typeof table === 'object' && table !== null) {
      // If table is an object (like profile or settings), merge fields
      const updated = { ...table, ...updatedFields };
      this.saveTable(tableName, updated);
      return updated;
    }
    return null;
  }

  // Delete item by ID in array table
  delete(tableName, id) {
    const table = this.getTable(tableName);
    if (Array.isArray(table)) {
      const filtered = table.filter(item => item.id !== id);
      this.saveTable(tableName, filtered);
      return true;
    }
    return false;
  }

  // Get item by ID in array table
  getById(tableName, id) {
    const table = this.getTable(tableName);
    if (Array.isArray(table)) {
      return table.find(item => item.id === id) || null;
    }
    return null;
  }

  // Export full DB as formatted JSON string
  exportJSON() {
    return JSON.stringify(this.getAll(), null, 2);
  }

  // Import JSON string into DB with validation
  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.profile || !parsed.projects) {
        throw new Error('Invalid schema: Missing profile or projects definition.');
      }
      this.saveAll(parsed);
      return { success: true, message: 'Database imported and synced successfully.' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Reset database back to default initial values
  resetToDefault() {
    this.saveAll(DEFAULT_DATABASE);
    return true;
  }

  // Subscribe to changes
  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  notify(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
    if (event !== 'all' && this.listeners['all']) {
      this.listeners['all'].forEach(cb => cb(this.getAll()));
    }
  }

  // Auth verification
  verifyPasscode(inputPasscode) {
    const settings = this.getTable('settings') || DEFAULT_DATABASE.settings;
    return (settings.passcodeHash || 'admin123') === inputPasscode;
  }

  // Update passcode
  setPasscode(newPasscode) {
    const settings = this.getTable('settings') || DEFAULT_DATABASE.settings;
    settings.passcodeHash = newPasscode;
    this.saveTable('settings', settings);
  }
}

// Global Singleton Instance
window.PortfolioDB = new DatabaseManager();
