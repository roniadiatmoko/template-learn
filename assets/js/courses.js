/* Explore & My Courses. Bergantung pada LzData (mock.js) dan Lz (lz.js). Kartu course dirender bersama. */
(function () {
  const D = window.LzData;
  const $ = (s) => document.querySelector(s);
  const root = document.body.dataset.root || "";
  const rupiah = (n) => (n === 0 ? "Free" : "Rp " + n.toLocaleString("id-ID"));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Course yang disimpan (bookmark), dipakai bersama Explore dan Courses */
  const KEY = "lz.saved";
  const DEFAULT_SAVED = [2, 9];
  function loadSaved() {
    try { return new Set(JSON.parse(localStorage.getItem(KEY)) || DEFAULT_SAVED); } catch (e) { return new Set(DEFAULT_SAVED); }
  }
  const saved = loadSaved();
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify([...saved])); } catch (e) { /* storage tidak tersedia */ }
  }

  function card(c, mode) {
    const on = saved.has(c.id);
    const href = `${root}pages/course-detail.html?id=${c.id}`;
    const classHref = `${root}pages/class.html?course=${c.id}`;
    const foot = mode === "mine"
      ? `<div class="course-foot flex-column align-items-stretch">
           <div class="course-progress"><span>${c.progress}%</span><div class="progress"><div class="progress-bar ${c.progress === 100 ? "bg-success" : ""}" style="width:${c.progress}%"></div></div></div>
           <a class="btn ${c.progress === 100 ? "btn-secondary" : "btn-primary"} btn-sm" href="${classHref}">${c.progress === 100 ? "Review course" : "Continue learning"}</a>
         </div>`
      : `<div class="course-foot">
           <span class="course-price ${c.price === 0 ? "free" : ""}">${rupiah(c.price)}</span>
           <a class="btn btn-soft btn-sm" href="${href}">View course</a>
         </div>`;
    return `<div class="col-md-6 col-xl-4"><article class="course-card">
      <div class="course-cover ${c.tone}"><i class="bi ${c.icon}"></i>
        <span class="badge">${esc(c.cat)}</span>
        <button class="course-save ${on ? "on" : ""}" data-save="${c.id}" aria-pressed="${on}" aria-label="${on ? "Remove from saved" : "Save course"}"><i class="bi ${on ? "bi-bookmark-fill" : "bi-bookmark"}"></i></button>
      </div>
      <div class="course-body">
        <h3 class="course-title"><a href="${mode === "mine" ? classHref : href}">${esc(c.title)}</a></h3>
        <div class="course-by">${esc(c.instructor)} · ${c.level}</div>
        <div class="course-meta">
          <span><i class="bi bi-star-fill star"></i>${c.rating}</span>
          <span><i class="bi bi-play-circle"></i>${c.lessons} lessons</span>
          <span><i class="bi bi-clock"></i>${c.hours} h</span>
          ${mode === "mine" ? "" : `<span><i class="bi bi-people"></i>${c.students.toLocaleString("id-ID")}</span>`}
        </div>
        ${foot}
      </div></article></div>`;
  }

  /* Klik bookmark (delegasi): ubah ikon langsung tanpa render ulang seluruh grid */
  function bindSave(onChange) {
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-save]");
      if (!b) return;
      const id = Number(b.dataset.save);
      saved.has(id) ? saved.delete(id) : saved.add(id);
      persist();
      const on = saved.has(id);
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on);
      b.setAttribute("aria-label", on ? "Remove from saved" : "Save course");
      b.firstElementChild.className = "bi " + (on ? "bi-bookmark-fill" : "bi-bookmark");
      Lz.toast(on ? "Course saved." : "Course removed from saved.", on ? "success" : "info", { delay: 2000 });
      if (onChange) onChange();
    });
  }

  const empty = (msg) => `<div class="col-12"><div class="lz-empty"><i class="bi bi-journal-x"></i>${msg}</div></div>`;

  /* ---------- Explore ---------- */
  if ($("#exploreGrid")) {
    const PAGE = 9;
    const cats = ["All", ...new Set(D.courses.map((c) => c.cat))];
    const qp = new URLSearchParams(location.search);
    const st = { cat: cats.includes(qp.get("cat")) ? qp.get("cat") : "All", q: "", sort: "popular", level: ["Beginner", "Intermediate", "Advanced"].includes(qp.get("level")) ? qp.get("level") : "all", page: 1 };
    $("#level").value = st.level;

    $("#chips").innerHTML = cats.map((c) => `<button type="button" class="lz-chip ${c === st.cat ? "active" : ""}" data-cat="${c}" aria-pressed="${c === st.cat}">${c}</button>`).join("");

    const sorters = {
      popular: (a, b) => b.students - a.students,
      rating: (a, b) => b.rating - a.rating,
      newest: (a, b) => b.added - a.added,
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
    };

    function draw() {
      const list = D.courses
        .filter((c) => (st.cat === "All" || c.cat === st.cat) && (st.level === "all" || c.level === st.level) && (c.title + c.instructor + c.cat).toLowerCase().includes(st.q))
        .sort(sorters[st.sort]);
      const pages = Math.max(1, Math.ceil(list.length / PAGE));
      st.page = Math.min(st.page, pages);
      const slice = list.slice((st.page - 1) * PAGE, st.page * PAGE);
      $("#resultCount").textContent = `${list.length} course${list.length === 1 ? "" : "s"} found`;
      $("#exploreGrid").innerHTML = slice.length ? slice.map((c) => card(c, "explore")).join("") : empty("No course matches your search. Try another keyword or category.");
      $("#pager").innerHTML = pages <= 1 ? "" :
        `<ul class="pagination justify-content-center mt-4">${Array.from({ length: pages }, (_, i) =>
          `<li class="page-item ${i + 1 === st.page ? "active" : ""}"><a class="page-link" href="#" data-p="${i + 1}">${i + 1}</a></li>`).join("")}</ul>`;
    }
    $("#chips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (!b) return;
      st.cat = b.dataset.cat; st.page = 1;
      document.querySelectorAll("#chips .lz-chip").forEach((x) => { const a = x === b; x.classList.toggle("active", a); x.setAttribute("aria-pressed", a); });
      Lz.url.set({ cat: st.cat });
      draw();
    });
    $("#q").addEventListener("input", (e) => { st.q = e.target.value.trim().toLowerCase(); st.page = 1; draw(); });
    $("#sort").addEventListener("change", (e) => { st.sort = e.target.value; draw(); });
    $("#level").addEventListener("change", (e) => { st.level = e.target.value; st.page = 1; Lz.url.set({ level: st.level }); draw(); });
    $("#pager").addEventListener("click", (e) => {
      const a = e.target.closest("[data-p]");
      if (!a) return;
      e.preventDefault();
      st.page = Number(a.dataset.p);
      draw();
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    bindSave();
    draw();
  }

  /* ---------- My Courses ---------- */
  if ($("#myGrid")) {
    const qt = new URLSearchParams(location.search).get("tab");
    let tab = ["progress", "done", "saved"].includes(qt) ? qt : "progress";
    document.querySelectorAll("#myTabs .nav-link").forEach((x) => x.classList.toggle("active", x.dataset.tab === tab));
    const sets = () => {
      const mine = D.courses.filter((c) => c.progress !== null);
      return {
        progress: mine.filter((c) => c.progress < 100),
        done: mine.filter((c) => c.progress === 100),
        saved: D.courses.filter((c) => saved.has(c.id)),
      };
    };
    const MSG = {
      progress: "You have no course in progress.",
      done: "No completed course yet. Keep going, you are on your way.",
      saved: "Nothing saved yet. Use the bookmark on any course to find it here later.",
    };
    function draw() {
      const s = sets();
      document.querySelectorAll("[data-count]").forEach((el) => { el.textContent = s[el.dataset.count].length; });
      const q = $("#myQ").value.trim().toLowerCase();
      const list = s[tab].filter((c) => (c.title + c.instructor).toLowerCase().includes(q));
      $("#myGrid").innerHTML = list.length
        ? list.map((c) => card(c, c.progress === null ? "explore" : "mine")).join("")
        : empty(q ? "No course matches your search." : `${MSG[tab]}<div class="mt-3"><a class="btn btn-primary btn-sm" href="explore.html">Explore courses</a></div>`);
    }
    document.querySelectorAll("#myTabs [data-tab]").forEach((b) => b.addEventListener("click", () => {
      tab = b.dataset.tab;
      document.querySelectorAll("#myTabs .nav-link").forEach((x) => x.classList.toggle("active", x === b));
      Lz.url.set({ tab: tab === "progress" ? null : tab });
      draw();
    }));
    $("#myQ").addEventListener("input", draw);
    bindSave(draw);
    draw();
  }
})();
