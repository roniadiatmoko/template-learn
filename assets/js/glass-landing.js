/* Landing glass: status navbar saat digulir, ganti tema, dropdown jalur masuk, dan tahun footer. */
(function () {
  const nav = document.getElementById("glNav");
  if (nav) {
    const sync = () => nav.classList.toggle("scrolled", window.scrollY > 8);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
  }

  /* Dropdown Log in: jalur masuk dari window.LzRoles (public.js), sama seperti navbar landing pertama */
  const menu = document.getElementById("glLogin");
  const ROLES = window.LzRoles || {};
  if (menu) {
    menu.innerHTML = '<li><h2 class="dropdown-header">Log in as</h2></li>'
      + Object.entries(ROLES).map(([k, r]) => `<li><a class="dropdown-item" href="login.html?role=${k}"><span class="gm-ico"><i class="bi ${r.icon}"></i></span><span><b>${r.label}</b></span></a></li>`).join("")
      + '<li><hr class="dropdown-divider"></li><li><a class="dropdown-item" href="register.html"><span class="gm-ico green"><i class="bi bi-person-plus"></i></span><span><b>Registrasi Maru</b></span></a></li>';
  }

  /* Pengguna yang sudah login melihat tombol dashboard */
  try {
    const user = JSON.parse(localStorage.getItem("lz.auth") || sessionStorage.getItem("lz.auth") || "null");
    if (user) {
      const dd = menu && menu.closest(".dropdown");
      if (dd) dd.replaceWith(Object.assign(document.createElement("a"), { className: "btn btn-secondary", href: "index.html", innerHTML: '<i class="bi bi-speedometer2 me-1"></i>Dashboard' }));
    }
  } catch (e) { /* abaikan */ }

  const theme = document.getElementById("glTheme");
  if (theme) {
    const now = () => (document.documentElement.getAttribute("data-bs-theme") === "dark" ? "dark" : "light");
    const paint = () => { theme.firstElementChild.className = "bi " + (now() === "dark" ? "bi-sun" : "bi-moon"); };
    paint();
    theme.addEventListener("click", () => { Lz.theme.set(now() === "dark" ? "light" : "dark"); paint(); });
  }

  const y = document.getElementById("glYear");
  if (y) y.textContent = new Date().getFullYear();

  /* Tandai tautan anchor navbar sesuai bagian yang sedang terlihat */
  const spy = Array.from(document.querySelectorAll('.gl-link[href^="#"]'));
  if (spy.length && "IntersectionObserver" in window) {
    const map = new Map(spy.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const a = map.get(en.target.id);
        if (a) a.classList.toggle("active", en.isIntersecting);
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }
})();
