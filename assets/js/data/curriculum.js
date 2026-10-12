/* Kurikulum, ulasan, dan profil pengajar (dummy). Dihasilkan deterministik dari data course. */
(function () {
  const D = window.LzData;

  const TOPICS = {
    "UX Design": ["Welcome and course goals", "Framing the problem", "Planning your research", "Interview techniques", "Surveys that work", "Affinity mapping", "Personas and journeys", "Sketching ideas", "Prototype basics", "Testing with real users", "Reading the results", "Presenting findings"],
    "Front-End": ["Setting up your editor", "Structure with semantic tags", "Styling with selectors", "Box model and spacing", "Flexbox layouts", "Grid layouts", "Responsive breakpoints", "Forms and inputs", "Working with the DOM", "Events and state", "Fetching data", "Shipping your project"],
    Copywriting: ["Know your reader", "Headlines that get read", "Writing with clarity", "Tone and voice", "Calls to action", "Story structure", "Editing your draft", "Email and landing pages", "Testing your copy", "Building a swipe file"],
    Business: ["Strategy in one page", "Reading your market", "Competitor analysis", "Value propositions", "Setting goals", "Building a team", "Running meetings", "Making decisions", "Measuring results", "Presenting a plan"],
    Finance: ["Money and time value", "Reading financial statements", "Budgeting basics", "Cash flow", "Risk and return", "Valuation methods", "Funding options", "Forecasting", "Case study walkthrough", "Final review"],
  };

  const MODULES = ["Foundations", "Core skills", "Going deeper", "Real-world practice", "Final project"];

  /* Kembalikan [{title, lessons:[{id,title,min,type}]}] dengan total lesson = c.lessons */
  D.curriculum = function (c) {
    const topics = TOPICS[c.cat] || TOPICS.Business;
    const per = Math.ceil(c.lessons / Math.min(5, Math.ceil(c.lessons / 5)));
    const mods = [];
    for (let i = 0; i < c.lessons; i++) {
      const m = Math.floor(i / per);
      if (!mods[m]) mods[m] = { title: MODULES[m] || `Module ${m + 1}`, lessons: [] };
      const n = i + 1;
      const type = n % 6 === 0 ? "quiz" : n % 5 === 0 ? "reading" : "video";
      mods[m].lessons.push({
        id: n,
        title: `${topics[i % topics.length]}${i >= topics.length ? " (part 2)" : ""}`,
        min: type === "quiz" ? 10 : 6 + ((n * 7 + c.id * 3) % 13),
        type,
        video: type === "video" ? D.sampleVideo : null,
      });
    }
    return mods;
  };

  /* Sumber video contoh (CC0). Ganti dengan URL video Anda, atau isi lesson.video per materi. */
  D.sampleVideo = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm";

  /* Isi materi bacaan dan soal kuis (dummy, dihasilkan dari judul materi) */
  const rotate = (arr, n) => arr.map((_, i) => arr[(i + n) % arr.length]);
  D.lessonContent = function (c, l) {
    const t = l.title.replace(/ \(part 2\)$/, "");
    const reading = [
      `${t} is the next step in ${c.title}. Read this page once, then try the idea on a small piece of your own work.`,
      "Start with the goal: what should be true when you finish? Write it in one sentence before you begin, and check it again at the end.",
      "Keep notes as you go. Short notes you can find later are worth more than long notes you never reopen.",
    ];
    const bank = [
      { q: `What is the main goal of "${t}"?`, o: ["Apply it to a real task", "Memorize every definition", "Skip planning and start directly", "Replace the whole workflow"] },
      { q: `Which habit helps most when practicing ${c.cat.toLowerCase()}?`, o: ["Review your work with a checklist", "Avoid all feedback", "Work without a goal", "Copy without reading"] },
      { q: "When should you share your result?", o: ["After checking it against the brief", "Never", "Before you start", "Only after the course ends"] },
    ];
    const quiz = bank.map((b, i) => {
      const shift = (l.id + i) % 4;
      return { q: b.q, o: rotate(b.o, shift), a: (4 - shift) % 4 };
    });
    return { reading, quiz };
  };

  D.instructors = {
    "Maya Putri": { role: "Senior UX Researcher", bio: "Ten years of research for fintech and education products. Teaches research as a daily habit, not a one-off project.", courses: 6, students: 8400 },
    "Daniel Wijaya": { role: "Design Systems Lead", bio: "Builds and maintains design systems used by dozens of product teams.", courses: 3, students: 3900 },
    "Rina Kartika": { role: "Front-End Engineer", bio: "Writes clean, accessible interfaces and enjoys explaining CSS to people who find it confusing.", courses: 8, students: 12400 },
    "Fajar Nugroho": { role: "Staff Engineer", bio: "Works on large JavaScript applications and mentors junior developers.", courses: 4, students: 6100 },
    "Sarah Amelia": { role: "Content Strategist", bio: "Has written for brands across Southeast Asia and edits for clarity first.", courses: 5, students: 4700 },
    "Prof. Hendra Lim": { role: "Professor of Management", bio: "Teaches strategy and leadership with real company cases.", courses: 7, students: 9800 },
    "Dr. Lisa Santoso": { role: "Finance Lecturer", bio: "Former analyst who now teaches finance in plain language.", courses: 5, students: 5200 },
  };

  D.reviews = [
    { name: "Andi Pratama", rating: 5, when: "2 weeks ago", text: "Clear explanations and good exercises. I finished the project in a weekend." },
    { name: "Dewi Lestari", rating: 5, when: "1 month ago", text: "The lessons are short enough to fit into my commute. Worth it." },
    { name: "Budi Hartono", rating: 4, when: "1 month ago", text: "Good pace overall. I would like a few more practice quizzes." },
    { name: "Citra Maharani", rating: 5, when: "2 months ago", text: "Helped me change how I approach my daily work." },
  ];

  D.outcomes = (c) => [
    `Apply ${c.cat.toLowerCase()} methods to a real project`,
    "Follow a clear workflow from start to finish",
    "Review your own work with a practical checklist",
    "Share results with teammates and clients",
  ];
})();
