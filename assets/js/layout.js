/* Layout shared: sidebar, header, footer. Halaman cukup menyediakan slot [data-slot]. */
(function () {
  const MENU = [
    { key: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill", href: "index.html" },
    { key: "explore", label: "Explore", icon: "bi-compass", href: "pages/explore.html" },
    { key: "courses", label: "Courses", icon: "bi-columns-gap", href: "pages/courses.html" },
    { key: "schedule", label: "Schedule", icon: "bi-calendar3", href: "pages/schedule.html" },
    { key: "analytics", label: "Analytics", icon: "bi-easel", href: "pages/analytics.html" },
    { key: "class", label: "Class", icon: "bi-play-circle", href: "pages/class.html" },
    { key: "certificate", label: "Certificate", icon: "bi-award", href: "pages/certificate.html" },
    { key: "settings", label: "Settings", icon: "bi-gear", href: "pages/settings.html" },
    { key: "components", label: "Components", icon: "bi-puzzle", href: "pages/components.html" },
  ];

  const body = document.body;
  const page = body.dataset.page || "dashboard";
  // Halaman di dalam /pages memakai prefix ../
  const root = body.dataset.root || "";

  const slot = (name) => document.querySelector(`[data-slot="${name}"]`);

  function renderSidebar() {
    const el = slot("sidebar");
    if (!el) return;
    el.className = "app-sidebar offcanvas-lg offcanvas-start";
    el.id = "sidebar";
    el.setAttribute("aria-label", "Sidebar");
    el.innerHTML = `
      <a class="brand" href="${root}index.html"><span class="brand-mark"></span>Learnzie</a>
      <nav aria-label="Main"><ul class="side-nav">
        ${MENU.map(
          (m) => `<li><a href="${root}${m.href}" class="${m.key === page ? "active" : ""}"
            ${m.key === page ? 'aria-current="page"' : ""}><i class="bi ${m.icon}"></i>${m.label}</a></li>`
        ).join("")}
      </ul></nav>
      <div class="promo">
        <div class="promo-art"><i class="bi bi-mortarboard-fill"></i></div>
        <h6>Learnzie 4.0<br>is Available Now</h6>
        <ul><li>Advanced Analytics</li><li>Tailored Learning Paths</li><li>Improved Collaboration</li></ul>
        <button class="btn btn-primary w-100" type="button">Try Free Trial</button>
      </div>`;
  }

  function renderHeader() {
    const el = slot("header");
    if (!el) return;
    const title = body.dataset.title || "Dashboard";
    const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    el.className = "page-head";
    el.innerHTML = `
      <div class="d-flex align-items-start gap-2">
        <button class="btn-icon d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebar" aria-label="Open menu"><i class="bi bi-list"></i></button>
        <div><h1>${title}</h1><div class="sub">${date}</div></div>
      </div>
      <div class="page-actions">
        <button class="btn-icon" type="button" aria-label="Messages"><i class="bi bi-chat-dots"></i></button>
        <button class="btn-icon" type="button" aria-label="Notifications"><i class="bi bi-bell"></i><span class="dot"></span></button>
      </div>`;
  }

  function renderFooter() {
    const el = slot("footer");
    if (!el) return;
    el.className = "app-footer";
    el.innerHTML = `
      <span>Copyright © ${new Date().getFullYear()} Learnzie</span>
      <span><a href="#">Privacy Policy</a><a href="#">Terms and conditions</a><a href="#">Contact</a></span>`;
  }

  /* Skip link + target untuk pembaca layar dan pengguna keyboard */
  const main = document.querySelector("main");
  if (main) {
    main.id = "main";
    main.tabIndex = -1;
    const skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#main";
    skip.textContent = "Skip to content";
    body.prepend(skip);
  }

  renderSidebar();
  renderHeader();
  renderFooter();
})();
