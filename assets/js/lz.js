/* Helper Learnzie: Lz.toast, Lz.table, Lz.charts. Butuh Bootstrap JS (dan Chart.js untuk Lz.charts). */
(function () {
  const Lz = (window.Lz = window.Lz || {});
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Toast ----------
     Lz.toast("Tugas terkirim", "success" | "danger" | "warning" | "info", { title, delay }) */
  const TOAST_ICON = { success: "bi-check-circle-fill text-success", danger: "bi-x-circle-fill text-danger", warning: "bi-exclamation-triangle-fill text-warning", info: "bi-info-circle-fill text-primary" };
  Lz.toast = function (message, type = "success", opts = {}) {
    let box = document.getElementById("lz-toasts");
    if (!box) {
      box = document.createElement("div");
      box.id = "lz-toasts";
      box.className = "toast-container position-fixed bottom-0 end-0 p-3";
      document.body.appendChild(box);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", type === "danger" ? "alert" : "status");
    el.innerHTML = `<div class="d-flex align-items-start gap-2 p-3">
      <i class="bi ${TOAST_ICON[type] || TOAST_ICON.info} fs-5"></i>
      <div class="flex-grow-1">${opts.title ? `<strong class="d-block">${esc(opts.title)}</strong>` : ""}${esc(message)}</div>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
    box.appendChild(el);
    const t = new bootstrap.Toast(el, { delay: opts.delay || 4000 });
    el.addEventListener("hidden.bs.toast", () => el.remove());
    t.show();
    return t;
  };

  /* ---------- Table: sorting, pencarian, pagination ----------
     <div data-lz-table data-page-size="5">
       <input data-lz-search> ... <table class="table"><thead><th data-sort>..</th>...</thead><tbody>...</tbody></table>
       <div data-lz-pager></div>
     </div>
     Panggil Lz.table(el) atau Lz.initTables() untuk semua. */
  Lz.table = function (root) {
    const table = root.querySelector("table");
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    const size = Number(root.dataset.pageSize) || 10;
    const search = root.querySelector("[data-lz-search]");
    const pager = root.querySelector("[data-lz-pager]");
    const heads = Array.from(table.tHead.rows[0].cells);
    let sort = { col: -1, dir: 1 }, page = 1, q = "";

    const val = (r, c) => r.cells[c].dataset.value ?? r.cells[c].textContent.trim();
    const cmp = (a, b) => (!isNaN(a) && !isNaN(b) && a !== "" && b !== "" ? a - b : String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" }));

    heads.forEach((th, i) => {
      if (!th.hasAttribute("data-sort")) return;
      th.style.cursor = "pointer";
      th.tabIndex = 0;
      th.setAttribute("role", "button");
      const go = () => { sort = { col: i, dir: sort.col === i ? -sort.dir : 1 }; page = 1; draw(); };
      th.addEventListener("click", go);
      th.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
    search?.addEventListener("input", () => { q = search.value.trim().toLowerCase(); page = 1; draw(); });

    function draw() {
      let list = rows.filter((r) => r.textContent.toLowerCase().includes(q));
      if (sort.col >= 0) list.sort((a, b) => sort.dir * cmp(val(a, sort.col), val(b, sort.col)));
      const pages = Math.max(1, Math.ceil(list.length / size));
      page = Math.min(page, pages);
      tbody.replaceChildren(...list.slice((page - 1) * size, page * size));
      if (!list.length) {
        const tr = tbody.insertRow();
        tr.innerHTML = `<td colspan="${heads.length}" class="text-center text-muted py-4">Tidak ada data yang cocok</td>`;
      }
      heads.forEach((th, i) => th.setAttribute("aria-sort", i === sort.col ? (sort.dir > 0 ? "ascending" : "descending") : "none"));
      heads.forEach((th, i) => {
        if (!th.hasAttribute("data-sort")) return;
        th.querySelector(".sort-i")?.remove();
        const ic = document.createElement("i");
        ic.className = `sort-i bi ms-1 ${i === sort.col ? (sort.dir > 0 ? "bi-arrow-up" : "bi-arrow-down") : "bi-arrow-down-up opacity-50"}`;
        th.appendChild(ic);
      });
      if (pager) {
        const btn = (p, html, dis, act, label) => `<li class="page-item ${dis ? "disabled" : ""} ${act ? "active" : ""}"><a class="page-link" href="#" data-p="${p}" aria-label="${label || p}">${html}</a></li>`;
        pager.innerHTML = list.length <= size ? "" :
          `<ul class="pagination mb-0 justify-content-end">${btn(page - 1, '<i class="bi bi-chevron-left"></i>', page === 1, false, "Previous")}${
            Array.from({ length: pages }, (_, i) => btn(i + 1, i + 1, false, i + 1 === page)).join("")
          }${btn(page + 1, '<i class="bi bi-chevron-right"></i>', page === pages, false, "Next")}</ul>`;
      }
    }
    pager?.addEventListener("click", (e) => {
      const a = e.target.closest("[data-p]");
      if (!a) return;
      e.preventDefault();
      if (a.parentElement.classList.contains("disabled")) return;
      page = Number(a.dataset.p);
      draw();
    });
    draw();
  };
  Lz.initTables = () => document.querySelectorAll("[data-lz-table]").forEach(Lz.table);

  /* ---------- Chart helper (Chart.js) ---------- */
  if (window.Chart) { Chart.defaults.font.family = '"Urbanist", system-ui, sans-serif'; Chart.defaults.font.weight = 500; }
  /* ---------- Tema (light / dark / auto) ---------- */
  const THEME_KEY = "lz.theme";
  const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  Lz.theme = {
    get() { try { return localStorage.getItem(THEME_KEY) || "light"; } catch (e) { return "light"; } },
    apply(v = Lz.theme.get()) { document.documentElement.setAttribute("data-bs-theme", v === "auto" ? (mq && mq.matches ? "dark" : "light") : v); },
    set(v) { try { localStorage.setItem(THEME_KEY, v); } catch (e) { /* abaikan */ } Lz.theme.apply(v); },
  };
  Lz.theme.apply();
  if (mq && mq.addEventListener) mq.addEventListener("change", () => { if (Lz.theme.get() === "auto") Lz.theme.apply(); });

  /* Warna chart dibaca dari CSS variables agar mengikuti tema */
  const css = (n, d) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || d;
  Lz.palette = { primary: "#0f6fde", pink: "#fbb6e6", yellow: "#ffc93c", green: "#2fbf71", red: "#e5484d",
    soft: css("--lz-primary-soft", "#e8f0fe"), grid: css("--lz-grid", "#eef1f6"), tick: css("--lz-tick", "#8590a3"), surface: css("--lz-surface", "#fff") };
  if (window.Chart) Chart.defaults.color = Lz.palette.tick;
  Lz.charts = {
    axis(extra = {}) {
      return { border: { display: false }, grid: { color: Lz.palette.grid, borderDash: [4, 4] }, ticks: { color: Lz.palette.tick, font: { size: 11 } }, ...extra };
    },
    /* Ring / donut dengan ujung membulat. parts: angka[]; colors: warna[] */
    donut(canvas, parts, colors, cutout = "72%") {
      return new Chart(canvas, { type: "doughnut", data: { datasets: [{ data: parts, backgroundColor: colors, borderWidth: 4, borderColor: Lz.palette.surface, borderRadius: 14 }] }, options: { cutout, plugins: { legend: { display: false }, tooltip: { enabled: false } } } });
    },
    ring(canvas, percent, color = Lz.palette.primary) {
      return new Chart(canvas, { type: "doughnut", data: { datasets: [{ data: [percent, 100 - percent], backgroundColor: [color, Lz.palette.soft], borderWidth: 0, borderRadius: 20 }] }, options: { cutout: "86%", rotation: -90, plugins: { legend: { display: false }, tooltip: { enabled: false } } } });
    },
    bar(canvas, labels, datasets, { stacked = false, max } = {}) {
      return new Chart(canvas, {
        type: "bar",
        data: { labels, datasets: datasets.map((d) => ({ borderRadius: 6, borderSkipped: false, barPercentage: 0.45, categoryPercentage: 0.9, ...d })) },
        options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ...Lz.charts.axis({ grid: { display: false } }), stacked }, y: { ...Lz.charts.axis({ max }), stacked } } },
      });
    },
    line(canvas, labels, datasets) {
      return new Chart(canvas, {
        type: "line",
        data: { labels, datasets: datasets.map((d) => ({ tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5, ...d })) },
        options: { maintainAspectRatio: false, interaction: { intersect: false, mode: "index" }, plugins: { legend: { display: false } }, scales: { x: { ...Lz.charts.axis({ grid: { display: false } }) }, y: Lz.charts.axis() } },
      });
    },
  };

  /* ---------- Ripple saat diklik ----------
     Satu listener untuk seluruh halaman. Tambahkan data-no-ripple pada elemen yang tidak ingin diberi efek. */
  const RIPPLE = ".btn, .btn-icon, .btn-close, .side-nav a, .nav-link, .page-link, .dropdown-item, .lz-chip, .list-group-item-action, .accordion-button, .lesson-btn, .ev-item, .cal-cell, .cal-nav, .course-save, .play, .sched-item, .assign-row, .theme-opt, .lz-more, .btn-add";
  const reduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  document.addEventListener("pointerdown", (e) => {
    if (reduce.matches || e.button > 0) return;
    const host = e.target.closest(RIPPLE);
    if (!host || host.disabled || host.hasAttribute("data-no-ripple") || host.classList.contains("disabled")) return;
    const cs = getComputedStyle(host);
    if (cs.position === "static") host.style.position = "relative";
    if (cs.overflow !== "hidden") host.style.overflow = "hidden";
    const r = host.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2.2;
    const dot = document.createElement("span");
    dot.className = "lz-ripple";
    dot.setAttribute("aria-hidden", "true");
    dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    host.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove(), { once: true });
    setTimeout(() => dot.remove(), 900); // cadangan jika animationend tidak terpicu
  }, { passive: true });

  document.addEventListener("DOMContentLoaded", Lz.initTables);
})();
