/* Layout shared: sidebar, header, footer. Halaman cukup menyediakan slot [data-slot]. */
(function () {
  /* Menu bertingkat sampai 3 level: item dengan `children` menjadi tombol buka/tutup.
     Level 1 memakai `key` (cocok dengan data-page); level 2 dan 3 dicocokkan lewat URL (path, ?cat, ?level, ?tab, #hash).
     `default: true` = item yang aktif saat URL tidak punya hash. */
  const CATS = ["UX Design", "Front-End", "Copywriting", "Business", "Finance"];
  const MENU = [
    { key: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill", href: "index.html" },
    { key: "explore", label: "Explore", icon: "bi-compass", children: [
      { label: "All courses", href: "pages/explore.html" },
      { label: "By category", children: CATS.map((c) => ({ label: c, href: "pages/explore.html?cat=" + encodeURIComponent(c) })) },
      { label: "By level", children: ["Beginner", "Intermediate", "Advanced"].map((l) => ({ label: l, href: "pages/explore.html?level=" + l })) },
    ] },
    { key: "courses", label: "Courses", icon: "bi-columns-gap", children: [
      { label: "In Progress", href: "pages/courses.html" },
      { label: "Completed", href: "pages/courses.html?tab=done" },
      { label: "Saved", href: "pages/courses.html?tab=saved" },
    ] },
    { key: "schedule", label: "Schedule", icon: "bi-calendar3", href: "pages/schedule.html" },
    { key: "analytics", label: "Analytics", icon: "bi-easel", href: "pages/analytics.html" },
    { key: "class", label: "Class", icon: "bi-play-circle", href: "pages/class.html" },
    { key: "certificate", label: "Certificate", icon: "bi-award", href: "pages/certificate.html" },
    { key: "settings", label: "Settings", icon: "bi-gear", children: [
      { label: "Profile", href: "pages/settings.html", default: true },
      { label: "Account", href: "pages/settings.html#account" },
      { label: "Notifications", href: "pages/settings.html#notifications" },
      { label: "Appearance", href: "pages/settings.html#appearance" },
    ] },
    { key: "components", label: "Components", icon: "bi-puzzle", href: "pages/components.html" },
  ];
  const URL_KEYS = ["cat", "level", "tab"];

  const body = document.body;
  const page = body.dataset.page || "dashboard";
  // Halaman di dalam /pages memakai prefix ../
  const root = body.dataset.root || "";

  const slot = (name) => document.querySelector(`[data-slot="${name}"]`);

  /* ---------- Menu bertingkat ---------- */
  const OPEN_KEY = "lz.menu.open";
  let openSet;
  try { openSet = new Set(JSON.parse(localStorage.getItem(OPEN_KEY)) || []); } catch (e) { openSet = new Set(); }
  const saveOpen = () => { try { localStorage.setItem(OPEN_KEY, JSON.stringify([...openSet])); } catch (e) { /* abaikan */ } };

  function urlMatch(href, isDefault) {
    const u = new URL(root + href, location.href);
    const here = new URL(location.href);
    if (u.pathname !== here.pathname) return false;
    if (!URL_KEYS.every((k) => u.searchParams.get(k) === here.searchParams.get(k))) return false;
    return (u.hash || "") === (here.hash || "") || (!here.hash && isDefault);
  }
  const leafActive = (m, level) => (level === 1 ? m.key === page : urlMatch(m.href, m.default));
  const branchActive = (m, level) => (level === 1 && m.key === page) || (m.children || []).some((c) => (c.children ? branchActive(c, level + 1) : leafActive(c, level + 1)));

  function renderMenu(items, level, prefix) {
    return `<ul class="${level === 1 ? "side-nav" : "side-sub"}" data-level="${level}">${items.map((m, i) => {
      const id = `${prefix}-${i}`;
      if (m.children) {
        const active = branchActive(m, level);
        const open = active || openSet.has(id);
        return `<li class="has-sub ${active ? "has-active" : ""}" ${level === 1 ? `data-key="${m.key}"` : ""}>
          <button type="button" class="side-toggle ${open ? "" : "collapsed"}" data-bs-toggle="collapse" data-bs-target="#sm-${id}" aria-expanded="${open}" aria-controls="sm-${id}">
            ${m.icon ? `<i class="bi ${m.icon}"></i>` : ""}<span>${m.label}</span><i class="bi bi-chevron-down chev" aria-hidden="true"></i></button>
          <div class="collapse ${open ? "show" : ""}" id="sm-${id}" data-menu-id="${id}">${renderMenu(m.children, level + 1, id)}</div></li>`;
      }
      const act = leafActive(m, level);
      return `<li><a href="${root}${m.href}" ${level === 1 ? `data-key="${m.key}"` : `data-sub${m.default ? " data-default" : ""}`} class="${act ? "active" : ""}" ${act ? 'aria-current="page"' : ""}>
        ${m.icon ? `<i class="bi ${m.icon}"></i>` : ""}<span>${m.label}</span></a></li>`;
    }).join("")}</ul>`;
  }

  /* Perbarui penanda aktif tanpa merender ulang (dipanggil saat hash/URL berubah tanpa memuat ulang halaman) */
  function markActive() {
    document.querySelectorAll(".app-sidebar a[href]").forEach((a) => {
      const sub = a.hasAttribute("data-sub");
      const href = a.getAttribute("href");
      const on = sub ? urlMatch(href.startsWith(root) ? href.slice(root.length) : href, a.hasAttribute("data-default")) : a.dataset.key === page;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    document.querySelectorAll(".app-sidebar li.has-sub").forEach((li) => {
      li.classList.toggle("has-active", !!li.querySelector("a.active") || li.dataset.key === page);
    });
    /* Buka cabang yang berisi item aktif agar penanda selalu terlihat */
    document.querySelectorAll(".app-sidebar a.active").forEach((a) => {
      for (let c = a.closest(".collapse"); c; c = c.parentElement && c.parentElement.closest(".collapse")) {
        if (!c.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(c, { toggle: false }).show();
      }
    });
  }
  window.addEventListener("hashchange", markActive);
  window.addEventListener("lz:urlchange", markActive);

  function renderSidebar() {
    const el = slot("sidebar");
    if (!el) return;
    el.className = "app-sidebar offcanvas-lg offcanvas-start";
    el.id = "sidebar";
    el.setAttribute("aria-label", "Sidebar");
    el.innerHTML = `
      <a class="brand" href="${root}index.html"><span class="brand-mark"></span>Learnzie</a>
      <nav aria-label="Main">${renderMenu(MENU, 1, "m")}</nav>
      <div class="promo">
        <div class="promo-art"><i class="bi bi-mortarboard-fill"></i></div>
        <h6>Learnzie 4.0<br>is Available Now</h6>
        <ul><li>Advanced Analytics</li><li>Tailored Learning Paths</li><li>Improved Collaboration</li></ul>
        <button class="btn btn-primary w-100" type="button" data-trial>Try Free Trial</button>
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
        ${["msg", "notif"].map((k) => `<div class="dropdown">
          <button class="btn-icon" id="${k}Btn" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"><i class="bi ${k === "msg" ? "bi-chat-dots" : "bi-bell"}"></i><span class="dot" hidden></span></button>
          <div class="dropdown-menu dropdown-menu-end lz-panel" aria-labelledby="${k}Btn">
            <div class="panel-head"><h2>${k === "msg" ? "Messages" : "Notifications"}</h2><button class="panel-link" type="button" data-read-all="${k}">Mark all as read</button></div>
            <div class="panel-list" id="${k}List"></div>
          </div></div>`).join("")}
      </div>`;
    initPanels();
  }

  /* ---------- Dropdown notifikasi dan pesan ---------- */
  function initPanels() {
    const D = window.LzData;
    if (!D || !D.notifications) return;
    const KEY = { notif: "lz.read.notif", msg: "lz.read.msg" };
    const store = {};
    const load = (k) => { try { const v = JSON.parse(localStorage.getItem(KEY[k])); return Array.isArray(v) ? new Set(v) : null; } catch (e) { return null; } };
    const save = (k) => { try { localStorage.setItem(KEY[k], JSON.stringify([...store[k]])); } catch (e) { /* abaikan */ } };
    const items = { notif: D.notifications, msg: D.messages };
    Object.keys(items).forEach((k) => { store[k] = load(k) || new Set(items[k].filter((i) => i.read).map((i) => i.id)); });
    const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const initials = (n) => n.split(/[\s:]+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

    function draw(k) {
      const list = document.getElementById(k + "List");
      const btn = document.getElementById(k + "Btn");
      if (!list || !btn) return;
      const unread = items[k].filter((i) => !store[k].has(i.id)).length;
      list.innerHTML = items[k].map((i) => {
        const un = !store[k].has(i.id) ? " unread" : "";
        const dot = un ? '<span class="unread-dot" aria-label="Unread"></span>' : "";
        if (k === "notif") {
          return `<a class="panel-item${un}" href="${root}${i.href}" data-id="${i.id}"><span class="panel-ico ${i.tone}"><i class="bi ${i.icon}"></i></span>
            <span class="panel-body"><b>${esc(i.title)}</b><span>${esc(i.text)}</span><small>${esc(i.time)}</small></span>${dot}</a>`;
        }
        return `<button type="button" class="panel-item${un}" data-id="${i.id}"><span class="lz-avatar">${esc(initials(i.name))}</span>
          <span class="panel-body"><b>${esc(i.name)} <em>${esc(i.role)}</em></b><span>${esc(i.text)}</span><small>${esc(i.time)}</small></span>${dot}</button>`;
      }).join("");
      btn.querySelector(".dot").hidden = unread === 0;
      btn.setAttribute("aria-label", `${k === "msg" ? "Messages" : "Notifications"}${unread ? `, ${unread} unread` : ""}`);
      const all = document.querySelector(`[data-read-all="${k}"]`);
      if (all) all.disabled = unread === 0;
    }
    ["notif", "msg"].forEach(draw);

    document.querySelectorAll("[data-read-all]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.readAll;
      items[k].forEach((i) => store[k].add(i.id));
      save(k); draw(k);
    }));
    ["notif", "msg"].forEach((k) => {
      const list = document.getElementById(k + "List");
      list.addEventListener("click", (e) => {
        const it = e.target.closest(".panel-item");
        if (!it) return;
        store[k].add(Number(it.dataset.id));
        save(k);
        if (k === "msg") { draw(k); if (window.Lz) Lz.toast("Marked as read.", "info", { delay: 1500 }); }
      });
    });
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
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-trial]") && window.Lz) Lz.toast("Your 14-day free trial of Learnzie 4.0 has started.", "success", { title: "Trial started" });
  });
  /* Simpan submenu yang dibuka/ditutup pengguna */
  const sidebarEl = slot("sidebar");
  if (sidebarEl) {
    sidebarEl.addEventListener("shown.bs.collapse", (e) => { if (e.target.dataset.menuId) { openSet.add(e.target.dataset.menuId); saveOpen(); } });
    sidebarEl.addEventListener("hidden.bs.collapse", (e) => { if (e.target.dataset.menuId) { openSet.delete(e.target.dataset.menuId); saveOpen(); } });
  }
  renderHeader();
  renderFooter();
})();
