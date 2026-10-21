/* Layout publik: navbar dan footer untuk halaman tanpa sidebar (landing, login, register, lupa password).
   Halaman menyediakan <header data-slot="public-header"> dan <footer data-slot="public-footer">. */
(function () {
  const body = document.body;
  const root = body.dataset.root || "";
  const slot = (n) => document.querySelector(`[data-slot="${n}"]`);

  const LINKS = [
    { label: "Courses", href: "landing.html#courses" },
    { label: "Features", href: "landing.html#features" },
    { label: "How it works", href: "landing.html#how" },
    { label: "FAQ", href: "landing.html#faq" },
  ];

  /* Jalur masuk (sama seperti bilah atas pada situs lama). Dipakai dropdown Log in dan halaman login. */
  const ROLES = {
    sso: { label: "SSO", icon: "bi-shield-lock", hint: "Log in with your university single sign-on account." },
    dosen: { label: "Dosen", icon: "bi-person-workspace", hint: "For lecturers. Use your lecturer email and password." },
    operator: { label: "Operator (Non SSO)", icon: "bi-gear", hint: "For operators with a separate account that does not use SSO." },
    orangtua: { label: "Orangtua", icon: "bi-people", hint: "For parents and guardians. Use the email you registered with." },
  };
  window.LzRoles = ROLES;

  function session() {
    try { return JSON.parse(localStorage.getItem("lz.auth") || sessionStorage.getItem("lz.auth") || "null"); } catch (e) { return null; }
  }
  const themeNow = () => document.documentElement.getAttribute("data-bs-theme") === "dark" ? "dark" : "light";

  function renderHeader() {
    const el = slot("public-header");
    if (!el) return;
    const user = session();
    el.className = "pub-nav navbar navbar-expand-lg";
    el.innerHTML = `<div class="pub-container">
      <a class="brand" href="${root}landing.html"><span class="brand-mark"></span>Learnzie</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#pubMenu" aria-controls="pubMenu" aria-expanded="false" aria-label="Toggle menu"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" id="pubMenu">
        <ul class="navbar-nav mx-lg-auto">${LINKS.map((l) => `<li class="nav-item"><a class="nav-link pub-link" href="${root}${l.href}">${l.label}</a></li>`).join("")}</ul>
        <div class="pub-actions">
          <button class="btn-icon" type="button" id="pubTheme" aria-label="Switch between light and dark theme"><i class="bi ${themeNow() === "dark" ? "bi-sun" : "bi-moon"}"></i></button>
          ${user
            ? `<a class="btn btn-primary" href="${root}index.html">Go to dashboard</a>`
            : `<div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-box-arrow-in-right me-1"></i>Log in</button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><h6 class="dropdown-header">Log in as</h6></li>
                  ${Object.entries(ROLES).map(([k, r]) => `<li><a class="dropdown-item" href="${root}login.html?role=${k}"><i class="bi ${r.icon} me-2"></i>${r.label}</a></li>`).join("")}
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="${root}register.html"><i class="bi bi-person-plus me-2"></i>Registrasi Maru</a></li>
                </ul></div>
               <a class="btn btn-primary" href="${root}register.html">Sign up free</a>`}
        </div>
      </div></div>`;
    const btn = document.getElementById("pubTheme");
    btn.addEventListener("click", () => {
      const next = themeNow() === "dark" ? "light" : "dark";
      Lz.theme.set(next);
      btn.firstElementChild.className = "bi " + (next === "dark" ? "bi-sun" : "bi-moon");
    });
  }

  function renderFooter() {
    const el = slot("public-footer");
    if (!el) return;
    el.className = "pub-footer";
    el.innerHTML = `<div class="pub-container">
      <div class="row g-4">
        <div class="col-lg-5"><a class="brand" href="${root}landing.html"><span class="brand-mark"></span>Learnzie</a>
          <p class="text-muted mb-0" style="max-width:26rem">Short lessons, real projects, and a clear view of your progress. Learn at your own pace.</p></div>
        <div class="col-6 col-lg-2 ms-lg-auto"><h2>Learn</h2><ul>
          <li><a href="${root}landing.html#courses">Courses</a></li><li><a href="${root}landing.html#features">Features</a></li><li><a href="${root}landing.html#faq">FAQ</a></li></ul></div>
        <div class="col-6 col-lg-2"><h2>Account</h2><ul>
          <li><a href="${root}login.html">Log in</a></li><li><a href="${root}register.html">Sign up</a></li><li><a href="${root}forgot-password.html">Reset password</a></li></ul></div>
        <div class="col-6 col-lg-2"><h2>Legal</h2><ul><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms and conditions</a></li><li><a href="#">Contact</a></li></ul></div>
      </div>
      <div class="copy"><span>Copyright © ${new Date().getFullYear()} Learnzie</span><span>Made with Bootstrap 5</span></div></div>`;
  }

  const main = document.querySelector("main");
  if (main) {
    main.id = "main";
    main.tabIndex = -1;
    main.classList.add("public-main");
    const skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#main";
    skip.textContent = "Skip to content";
    body.prepend(skip);
  }
  renderHeader();
  renderFooter();
})();
