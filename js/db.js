/* ==========================================================================
   PORTFOLIO DATABASE LAYER (PortfolioDB)
   Client-Side Reactive Storage Engine for Dynamic CMS & Visual Database
   ========================================================================== */

const PORTFOLIO_DB_KEY = 'pk_portfolio_database_v2';

// Default initial dataset representing the full portfolio content
const DEFAULT_DATABASE = {
  profile: {
    fullName: "Piyush Kumar",
    tagline: "Software Developer & IT Systems Specialist",
    roles: [
      "Full-Stack Web Developer",
      "AI & Machine Learning Engineer",
      "Computer Vision & Python Developer",
      "IT Infrastructure & Network Specialist",
      "REST API & Database Architect"
    ],
    bio: "Detail-oriented Information Technology student at <strong>GGSIPU (HMR Institute of Technology and Management)</strong> with strong foundations in software development, database management, and computer networking. Experienced in building full-stack web applications and developing interactive dashboards using HTML, CSS, JavaScript, Python, React, Node.js, and MySQL. Skilled in designing REST APIs, debugging, and problem-solving, with a solid understanding of SDLC and Agile methodology.",
    heroDescription: "Information Technology engineer specializing in building robust full-stack web applications, interactive real-time dashboards, computer vision AI pipelines, and resilient network infrastructures.",
    avatar: "assets/images/avatar.jpg",
    resumePdf: "assets/docs/Piyush_Kumar_Resume.pdf",
    email: "piyusjkumar763@gmail.com",
    phone: "+91-9868552272",
    location: "Delhi, India (Open to Remote & Onsite)",
    linkedin: "https://linkedin.com/in/piyush-kumar-2159b8215",
    github: "https://github.com",
    availabilityStatus: "Seeking Entry-Level Software Developer Roles",
    metrics: {
      keySystems: "4+",
      internships: "2",
      certifications: "8+",
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
        "Worked with the development team as an intern, gaining hands-on experience across both front-end and back-end technologies.",
        "Delivered consistent, professional contributions throughout the internship, earning recognition for dedication and willingness to learn.",
        "Collaborated with the team on software development tasks, applying and strengthening core web development skills."
      ],
      technologies: ["React", "Node.js", "JavaScript", "HTML/CSS", "MySQL", "REST APIs", "Git"]
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
      softSkillsNote: "Soft skills integrated: collaboration, communication, problem-solving",
      technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "UI/UX Optimization"]
    }
  ],

  projects: [
    {
      id: "proj-gst",
      title: "GST Cash Ledger and Expense Prediction System",
      subtitle: "Full-Stack Financial Tax Automation & ML Forecast Engine",
      category: "fullstack",
      categoryName: "Full Stack & ML",
      image: "assets/images/gst-ledger.jpg",
      description: "Developed a full-stack web application using HTML, CSS, JavaScript. Automated GST calculations, reducing manual effort by ~40% and improving data processing efficiency. Built interactive dashboards using Chart.js for financial insights and data visualization. Implemented a Machine Learning (ML) model to predict expenses and GST liability.",
      tags: ["HTML5", "CSS3", "JavaScript", "Chart.js", "Machine Learning", "Tax Engine"],
      stats: [
        { label: "Manual Effort Reduction", value: "~40%" },
        { label: "Data Visualization", value: "Chart.js Dashboards" },
        { label: "Expense & Tax Forecast", value: "ML Prediction Model" }
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
      description: "Implemented real-time video processing using OpenCV and NumPy for motion analysis. Applied Optical Flow for speed estimation and unsafe driving detection. Integrated SQLite database, Tkinter GUI, and Matplotlib for monitoring and visualization. Enhanced road safety insights through automated alerts and data logging.",
      tags: ["Python", "OpenCV", "NumPy", "Optical Flow", "Tkinter", "SQLite", "Matplotlib"],
      stats: [
        { label: "Motion Analysis", value: "OpenCV & NumPy" },
        { label: "Speed & Hazard Detection", value: "Optical Flow" },
        { label: "Monitoring & Logging", value: "SQLite & Matplotlib" }
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
      description: "Built a full-stack carbon footprint tracker using Flask, SQLAlchemy, and SQLite to log and visualize daily CO2 emissions. Developed a daily calculator with live CO2 preview and Chart.js line/doughnut charts for 30-day trends. Designed personalized tips, a leaderboard, and a badge system based on user emission data to drive engagement. Implemented secure authentication using Werkzeug password hashing and Flask sessions.",
      tags: ["Python", "Flask", "SQLAlchemy", "SQLite", "Chart.js", "Werkzeug Auth"],
      stats: [
        { label: "Emissions Analytics", value: "30-Day Chart.js" },
        { label: "Engagement", value: "Leaderboard & Badges" },
        { label: "Security", value: "Werkzeug Hashing" }
      ],
      liveUrl: "#",
      githubUrl: "https://github.com",
      simulatorId: "modal-sim-ecotrack"
    },
    {
      id: "proj-bikes4u",
      title: "Bikes4U – Online Rental System",
      subtitle: "Full-Stack Rental Booking & Real-Time Inventory Management",
      category: "systems",
      categoryName: "Web & Database",
      image: "assets/images/bikes4u.jpg",
      description: "Built an online bike rental booking system using JavaScript and PHP with backend functionality. Integrated MySQL for real-time inventory tracking, booking management, and database operations.",
      tags: ["JavaScript", "PHP", "MySQL", "CSS3", "Database Operations"],
      stats: [
        { label: "Inventory Tracking", value: "Real-time MySQL" },
        { label: "Booking Management", value: "Instant Reservation" },
        { label: "Architecture", value: "Full-Stack PHP/JS" }
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
      abstract: "Authored research focusing on the application of Machine Learning to improve financial transparency and tax compliance. Demonstrates algorithmic architectures integrating ML predictive models with automated GST ledger workflows to reduce manual effort by ~40% and forecast upcoming liabilities.",
      highlights: [
        "Authored research on applying Machine Learning to improve financial transparency and tax compliance",
        "Formulated ML predictive regression model for proactive tax liability and expense forecasting",
        "Demonstrated automated calculations reducing manual effort by ~40% and eliminating discrepancy errors"
      ],
      doi: "DOI: 10.1000/gst-ml-research-2026",
      link: "assets/docs/Piyush_Kumar_Resume.pdf"
    }
  ],

  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Technology in Information Technology",
      institution: "GGSIPU (HMR INSTITUTE OF TECHNOLOGY AND MANAGEMENT)",
      period: "Sept 2023 – June 2026",
      location: "Delhi, India",
      description: "Core specialization in Software Development, Database Management, Computer Networking, and Applied Machine Learning."
    },
    {
      id: "edu-2",
      degree: "Diploma in Information Technology",
      institution: "DSEU, Delhi",
      period: "November 2020 – June 2023",
      location: "Delhi, India",
      description: "Graduated with honors in fundamentals of programming (C/C++, Java), Web Technologies, Operating Systems, and Network Administration."
    },
    {
      id: "edu-3",
      degree: "CBSE, Class 10th",
      institution: "DMSSS, Delhi",
      period: "Completed June 2020",
      location: "Delhi, India",
      description: "Secondary School Examination with distinction in Science, Mathematics, and Computer Applications."
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
      issuer: "Google (via Coursera, 9 courses)",
      date: "August 2026",
      category: "security",
      badgeColor: "emerald",
      skills: ["Network Security", "Linux", "SQL", "SIEM", "Python Security", "Incident Response"],
      credentialUrl: "https://coursera.org"
    },
    {
      id: "cert-3",
      name: "Oracle Certified Foundations Associate – Agentic AI Certified Foundations Associate",
      issuer: "Oracle University",
      date: "August 2026",
      category: "ai",
      badgeColor: "cyan",
      skills: ["Agentic AI Systems", "Autonomous Workflows", "LLM Orchestration", "Goal Reasoning"],
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
      name: "Google AI Essentials",
      issuer: "Google (via Coursera)",
      date: "2025 – 2026",
      category: "ai",
      badgeColor: "cyan",
      skills: ["Generative AI", "AI Tools & Workflows", "Prompt Engineering", "Responsible AI"],
      credentialUrl: "https://coursera.org"
    },
    {
      id: "cert-6",
      name: "Data Structures and Algorithms",
      issuer: "Internshala",
      date: "2024",
      category: "core",
      badgeColor: "emerald",
      skills: ["C++", "Dynamic Programming", "Trees & Graphs", "Complexity Analysis"],
      credentialUrl: "#"
    },
    {
      id: "cert-7",
      name: "HackerRank Competency Badges (SQL, JS, Python, Go, Java)",
      issuer: "HackerRank",
      date: "2024 – 2026",
      category: "coding",
      badgeColor: "gold",
      skills: ["SQL (Advanced)", "JavaScript (Intermediate)", "Python", "Go (Basic)", "Java (Basic)"],
      credentialUrl: "https://hackerrank.com"
    },
    {
      id: "cert-8",
      name: "Cybersecurity and Applied Ethical Hacking",
      issuer: "Infosys SpringBoard",
      date: "2025",
      category: "security",
      badgeColor: "emerald",
      skills: ["Ethical Hacking", "Penetration Testing", "Threat Mitigation", "Cryptography"],
      credentialUrl: "#"
    }
  ],

  skills: {
    programming: [
      { name: "Go (Golang)", level: 88, icon: "fa-brands fa-golang" },
      { name: "Python", level: 94, icon: "fa-brands fa-python" },
      { name: "JavaScript (ES6+)", level: 92, icon: "fa-brands fa-js" },
      { name: "C / C++", level: 84, icon: "fa-solid fa-code" },
      { name: "Java", level: 82, icon: "fa-brands fa-java" }
    ],
    aiAndMl: [
      { name: "Generative AI & Diffusion Models", level: 90, icon: "fa-solid fa-wand-magic-sparkles" },
      { name: "Agentic AI & Large Language Models (LLMs)", level: 90, icon: "fa-solid fa-brain" },
      { name: "Prompt Engineering & AI-Assisted Coding", level: 95, icon: "fa-solid fa-terminal" },
      { name: "OpenCV (Computer Vision)", level: 88, icon: "fa-solid fa-camera" },
      { name: "ML Model Development & Predictive Analytics", level: 86, icon: "fa-solid fa-chart-line" },
      { name: "AI Tools (Claude, ChatGPT, Copilot, Gemini)", level: 96, icon: "fa-solid fa-robot" },
      { name: "AI Chatbots & AI-Powered Automation", level: 92, icon: "fa-solid fa-gears" }
    ],
    webTech: [
      { name: "React", level: 88, icon: "fa-brands fa-react" },
      { name: "Node.js & Express", level: 86, icon: "fa-brands fa-node-js" },
      { name: "HTML & CSS", level: 96, icon: "fa-brands fa-html5" },
      { name: "Bootstrap / Vanilla UI", level: 92, icon: "fa-brands fa-bootstrap" },
      { name: "REST APIs", level: 90, icon: "fa-solid fa-plug" }
    ],
    frameworksAndTools: [
      { name: "Gin Framework (Go)", level: 84, icon: "fa-solid fa-bolt" },
      { name: "Git & GitHub", level: 92, icon: "fa-brands fa-git-alt" },
      { name: "Docker Containerization", level: 82, icon: "fa-brands fa-docker" },
      { name: "Postman & API Testing", level: 90, icon: "fa-solid fa-vial" },
      { name: "Jupyter Notebook", level: 88, icon: "fa-solid fa-book-open" },
      { name: "Unit Testing & Debugging", level: 88, icon: "fa-solid fa-bug" }
    ],
    databases: [
      { name: "MySQL", level: 92, icon: "fa-solid fa-database" },
      { name: "SQL (Advanced)", level: 94, icon: "fa-solid fa-table" },
      { name: "MongoDB", level: 82, icon: "fa-solid fa-leaf" },
      { name: "SQLite", level: 90, icon: "fa-solid fa-hard-drive" }
    ],
    networking: [
      { name: "OSI & TCP/IP Protocol Models", level: 92, icon: "fa-solid fa-network-wired" },
      { name: "Subnetting & IP Addressing (IPv4/IPv6)", level: 92, icon: "fa-solid fa-sitemap" },
      { name: "Routing & Switching (LAN / WAN)", level: 86, icon: "fa-solid fa-route" },
      { name: "Protocols: HTTP/S, FTP, SSH, SMTP, DNS, DHCP", level: 92, icon: "fa-solid fa-globe" },
      { name: "Network Security & Firewalls", level: 88, icon: "fa-solid fa-shield-halved" },
      { name: "VPN Fundamentals & Network Tunnels", level: 86, icon: "fa-solid fa-lock" }
    ],
    itSystems: [
      { name: "Operating Systems (Windows, Linux, macOS)", level: 92, icon: "fa-brands fa-linux" },
      { name: "System Administration & Maintenance", level: 88, icon: "fa-solid fa-sliders" },
      { name: "Hardware & Software Troubleshooting", level: 92, icon: "fa-solid fa-wrench" },
      { name: "Active Directory & Remote Desktop Support", level: 88, icon: "fa-solid fa-desktop" },
      { name: "Backup, Recovery & IT Asset Management", level: 86, icon: "fa-solid fa-floppy-disk" },
      { name: "IT Documentation & Ticketing Systems", level: 90, icon: "fa-solid fa-ticket" }
    ],
    coreConcepts: [
      { name: "Data Structures & Algorithms (DSA)", level: 90, icon: "fa-solid fa-code-branch" },
      { name: "Object-Oriented Programming (OOP)", level: 92, icon: "fa-solid fa-cubes" },
      { name: "Database Management Systems (DBMS)", level: 92, icon: "fa-solid fa-database" },
      { name: "Computer Networks Architecture", level: 92, icon: "fa-solid fa-network-wired" },
      { name: "SDLC & Agile Methodology", level: 90, icon: "fa-solid fa-arrows-spin" }
    ],
    softSkills: [
      { name: "Critical Problem Solving", level: 95, icon: "fa-solid fa-puzzle-piece" },
      { name: "Communication & Articulation", level: 92, icon: "fa-solid fa-comments" },
      { name: "Team Collaboration & Cross-Functional Work", level: 95, icon: "fa-solid fa-people-group" },
      { name: "Adaptability & Fast Technology Adoption", level: 96, icon: "fa-solid fa-bolt" },
      { name: "Time Management & Technical Leadership", level: 90, icon: "fa-solid fa-user-tie" }
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
    version: "2.0.0"
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
