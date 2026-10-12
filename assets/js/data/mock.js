/* Data dummy — ganti dengan response API saat integrasi backend. */
window.LzData = {
  user: { name: "Gareth Christopher", first: "Gareth", username: "@christopher", skillPoints: 1274, rank: "4th" },

  stats: [
    { label: "Active Tasks", value: "18 Tasks", icon: "bi-list-check" },
    { label: "Completed Tasks", value: "8 Tasks", icon: "bi-check2-square" },
    { label: "Rank Score", value: "132", icon: "bi-award" },
  ],

  categories: [
    { key: "ux", label: "UX Design", color: "#0f6fde" },
    { key: "fe", label: "Front-End", color: "#fbb6e6" },
    { key: "cw", label: "Copywriting", color: "#ffc93c" },
  ],

  activity: {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    periods: {
      "Last Week": { ux: [3.1, 3.4, 2.8, 2.4, 2.1, 3.1, 2.7], fe: [1.6, 1.4, 1.6, 1.0, 1.2, 1.7, 1.4], cw: [1.2, 1.6, 1.3, 0.9, 1.5, 1.4, 1.5] },
      "This Week": { ux: [2.2, 3.0, 2.5, 1.9, 0, 0, 0], fe: [1.1, 1.8, 1.0, 1.4, 0, 0, 0], cw: [0.9, 1.1, 1.2, 0.7, 0, 0, 0] },
      "Last Month": { ux: [2.6, 2.9, 3.2, 2.8, 2.4, 2.7, 3.0], fe: [1.3, 1.5, 1.2, 1.6, 1.4, 1.1, 1.3], cw: [1.0, 1.2, 1.4, 1.1, 1.3, 1.0, 1.2] },
    },
  },

  progress: { total: 124, parts: [43, 32, 25] },

  assignments: [
    { title: "Market Analysis Report", course: "Business Strategy", due: "Oct 20, 2027", status: "In Progress", pct: 30, files: 2, comments: 24, icon: "bi-graph-up-arrow" },
    { title: "Corporate Finance Case Study", course: "Finance", due: "Nov 5, 2027", status: "Not Started", pct: 0, files: 0, comments: 0, icon: "bi-currency-dollar" },
    { title: "Leadership Styles Essay", course: "Organizational Management", due: "Nov 15, 2027", status: "In Progress", pct: 50, files: 5, comments: 46, icon: "bi-people" },
    { title: "Business Ethics Presentation", course: "Business Ethics", due: "Dec 10, 2027", status: "In Progress", pct: 20, files: 2, comments: 17, icon: "bi-briefcase" },
    { title: "Entrepreneurship Project", course: "Innovation Management", due: "Dec 15, 2027", status: "In Progress", pct: 10, files: 1, comments: 13, icon: "bi-lightbulb" },
  ],

  schedule: [
    { date: "October 15, 2027", tone: "blue", title: "Business Strategy Development Test", cat: "Business Strategy", time: "9:00 AM - 9:30 AM" },
    { date: "November 1, 2027", tone: "pink", title: "Financial Analysis Presentation", cat: "Finance", time: "2:00 PM - 4:00 PM" },
    { date: "November 20, 2027", tone: "yellow", title: "Organizational Behavior Quiz", cat: "Management", time: "11:00 AM - 12:30 PM" },
  ],

  activities: [
    { tone: "blue", icon: "bi-play-fill", html: "<b>Watched</b> a lecture video on Business Ethics", time: "1:00 PM" },
    { tone: "pink", icon: "bi-file-earmark-text", html: "<b>Submitted</b> Leadership Styles Essay on Innovation Management", time: "10:30 AM" },
    { tone: "yellow", icon: "bi-eye", html: "<b>Viewed</b> the Market Analysis Report assignment", time: "9:15 AM" },
    { tone: "blue", icon: "bi-box-arrow-in-right", html: "<b>Logged</b> into the dashboard", time: "8:00 AM" },
  ],

  // Hari yang punya event di kalender: "YYYY-M-D" (bulan 1-12)
  events: ["2027-10-15", "2027-11-1", "2027-11-20", "2027-11-15"],
};

/* Katalog course. progress: null = belum diambil. tone menentukan warna cover. */
window.LzData.courses = [
  { id: 1, title: "User Research Fundamentals", cat: "UX Design", instructor: "Maya Putri", rating: 4.8, students: 1240, lessons: 24, hours: 8, level: "Beginner", price: 0, tone: "blue", icon: "bi-search", progress: 62, added: 5 },
  { id: 2, title: "Design Systems with Figma", cat: "UX Design", instructor: "Daniel Wijaya", rating: 4.9, students: 980, lessons: 32, hours: 12, level: "Intermediate", price: 249000, tone: "blue", icon: "bi-bezier2", progress: 100, added: 9 },
  { id: 3, title: "HTML & CSS from Scratch", cat: "Front-End", instructor: "Rina Kartika", rating: 4.7, students: 3120, lessons: 40, hours: 14, level: "Beginner", price: 0, tone: "pink", icon: "bi-code-slash", progress: 35, added: 3 },
  { id: 4, title: "JavaScript for Interfaces", cat: "Front-End", instructor: "Fajar Nugroho", rating: 4.8, students: 2710, lessons: 48, hours: 18, level: "Intermediate", price: 299000, tone: "pink", icon: "bi-braces", progress: null, added: 11 },
  { id: 5, title: "Persuasive Copywriting", cat: "Copywriting", instructor: "Sarah Amelia", rating: 4.6, students: 860, lessons: 18, hours: 6, level: "Beginner", price: 149000, tone: "yellow", icon: "bi-pencil-square", progress: 100, added: 2 },
  { id: 6, title: "Brand Voice & Storytelling", cat: "Copywriting", instructor: "Sarah Amelia", rating: 4.5, students: 540, lessons: 14, hours: 5, level: "Intermediate", price: 129000, tone: "yellow", icon: "bi-megaphone", progress: null, added: 8 },
  { id: 7, title: "Business Strategy Essentials", cat: "Business", instructor: "Prof. Hendra Lim", rating: 4.7, students: 1890, lessons: 28, hours: 10, level: "Beginner", price: 199000, tone: "green", icon: "bi-graph-up-arrow", progress: 48, added: 6 },
  { id: 8, title: "Corporate Finance Basics", cat: "Finance", instructor: "Dr. Lisa Santoso", rating: 4.6, students: 1320, lessons: 26, hours: 9, level: "Intermediate", price: 229000, tone: "green", icon: "bi-currency-dollar", progress: null, added: 4 },
  { id: 9, title: "Responsive Layouts with Bootstrap 5", cat: "Front-End", instructor: "Rina Kartika", rating: 4.8, students: 2050, lessons: 22, hours: 7, level: "Beginner", price: 0, tone: "pink", icon: "bi-layout-wtf", progress: 80, added: 1 },
  { id: 10, title: "Usability Testing in Practice", cat: "UX Design", instructor: "Maya Putri", rating: 4.7, students: 720, lessons: 16, hours: 5, level: "Advanced", price: 179000, tone: "blue", icon: "bi-clipboard-check", progress: null, added: 10 },
  { id: 11, title: "Leadership & Team Management", cat: "Business", instructor: "Prof. Hendra Lim", rating: 4.5, students: 1480, lessons: 20, hours: 7, level: "Intermediate", price: 169000, tone: "green", icon: "bi-people", progress: 15, added: 7 },
  { id: 12, title: "Financial Analysis for Startups", cat: "Finance", instructor: "Dr. Lisa Santoso", rating: 4.4, students: 610, lessons: 18, hours: 6, level: "Advanced", price: 259000, tone: "green", icon: "bi-bar-chart-line", progress: null, added: 12 },
];
