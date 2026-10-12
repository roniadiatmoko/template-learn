/* Dashboard: render widget + chart. Bergantung pada LzData (mock.js) dan Chart.js. */
(function () {
  const D = window.LzData;
  const $ = (s) => document.querySelector(s);
  const cats = D.categories;

  /* ---------- Stats ---------- */
  $("#stats").innerHTML = D.stats
    .map(
      (s) => `<div class="col-md-4"><div class="lz-card stat">
        <div class="stat-icon"><i class="bi ${s.icon}"></i></div>
        <div><small>${s.label}</small><strong>${s.value}</strong></div></div></div>`
    )
    .join("");

  /* ---------- Performance ring ---------- */
  Lz.charts.ring($("#performanceChart"), 72);
  $("#skillPoints").textContent = D.user.skillPoints.toLocaleString("id-ID");
  $("#rank").textContent = D.user.rank;

  /* ---------- Learning Activity ---------- */
  $("#activityLegend").innerHTML = cats.map((c) => `<span><i style="background:${c.color}"></i>${c.label}</span>`).join("");
  const periodSel = $("#activityPeriod");
  periodSel.innerHTML = Object.keys(D.activity.periods).map((p) => `<option>${p}</option>`).join("");

  const activityChart = Lz.charts.bar($("#activityChart"), D.activity.labels, [], { stacked: true, max: 8 });
  activityChart.options.scales.y.ticks.stepSize = 2;
  activityChart.options.scales.y.ticks.callback = (v) => v + "h";
  function setPeriod(name) {
    const p = D.activity.periods[name];
    activityChart.data.datasets = cats.map((c, i) => ({
      label: c.label, data: p[c.key], backgroundColor: c.color,
      borderRadius: 6, borderSkipped: false, barPercentage: 0.45, categoryPercentage: 0.9,
      order: cats.length - i,
    }));
    activityChart.update();
  }
  periodSel.addEventListener("change", (e) => setPeriod(e.target.value));
  setPeriod(periodSel.value);

  /* ---------- My Progress ---------- */
  Lz.charts.donut($("#progressChart"), D.progress.parts, cats.map((c) => c.color));
  $("#progressTotal").textContent = D.progress.total;
  $("#progressLegend").innerHTML = cats
    .map((c, i) => `<div><small><i style="background:${c.color}"></i>${c.label}</small><strong>${D.progress.parts[i]}%</strong></div>`)
    .join("");

  /* ---------- Assignments ---------- */
  const badge = { "In Progress": "badge-soft-yellow", "Not Started": "badge-soft-red", Completed: "badge-soft-green" };
  const searchEl = $("#assignSearch");
  const statusEl = $("#assignStatus");
  function renderAssignments() {
    const q = searchEl.value.trim().toLowerCase();
    const st = statusEl.value;
    const rows = D.assignments.filter(
      (a) => (st === "all" || a.status === st) && (a.title + a.course).toLowerCase().includes(q)
    );
    $("#assignList").innerHTML = rows.length
      ? rows.map((a) => `
        <div class="assign-row">
          <div class="assign-main">
            <div class="assign-icon"><i class="bi ${a.icon}"></i></div>
            <div class="text-truncate"><div class="assign-title">${a.title}</div><div class="assign-sub">${a.course}</div></div>
          </div>
          <div><span class="assign-label">Due Date</span><b>${a.due}</b></div>
          <div><span class="badge ${badge[a.status]}">${a.status}</span></div>
          <div class="assign-prog"><span>${a.pct}%</span><div class="progress"><div class="progress-bar" style="width:${a.pct}%"></div></div></div>
          <div class="assign-meta"><span><i class="bi bi-paperclip"></i> ${a.files}</span><span><i class="bi bi-chat"></i> ${a.comments}</span></div>
        </div>`).join("")
      : `<div class="empty"><i class="bi bi-inbox fs-3 d-block"></i>Tidak ada tugas yang cocok</div>`;
  }
  searchEl.addEventListener("input", renderAssignments);
  statusEl.addEventListener("change", renderAssignments);
  renderAssignments();

  /* ---------- Right panel: profile ---------- */
  $("#profile").innerHTML = `
    <div class="avatar">${D.user.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>
    <div><strong>${D.user.name}</strong><small>${D.user.username}</small></div>
    <button class="btn-icon" type="button" aria-label="Filter"><i class="bi bi-sliders"></i></button>`;

  /* ---------- Calendar ---------- */
  const eventSet = new Set(D.events);
  const today = new Date();
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  function renderCalendar() {
    const y = view.getFullYear(), m = view.getMonth();
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const prevDays = new Date(y, m, 0).getDate();
    let cells = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<span class="dow">${d}</span>`);
    for (let i = first - 1; i >= 0; i--) cells.push(`<span class="day out">${prevDays - i}</span>`);
    for (let d = 1; d <= days; d++) {
      const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
      const cls = isToday ? "today" : eventSet.has(`${y}-${m + 1}-${d}`) ? "event" : "";
      cells.push(`<span class="day ${cls}">${d}</span>`);
    }
    const rest = (7 - ((first + days) % 7)) % 7;
    for (let d = 1; d <= rest; d++) cells.push(`<span class="day out">${d}</span>`);
    $("#calendar").innerHTML = `
      <div class="cal-head">
        <button class="cal-nav" data-dir="-1" aria-label="Previous month"><i class="bi bi-chevron-left"></i></button>
        <span>${view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
        <button class="cal-nav" data-dir="1" aria-label="Next month"><i class="bi bi-chevron-right"></i></button>
      </div>
      <div class="cal-grid">${cells.join("")}</div>`;
  }
  $("#calendar").addEventListener("click", (e) => {
    const b = e.target.closest(".cal-nav");
    if (!b) return;
    view = new Date(view.getFullYear(), view.getMonth() + Number(b.dataset.dir), 1);
    renderCalendar();
  });
  renderCalendar();

  /* ---------- Schedule & Activities ---------- */
  $("#scheduleList").innerHTML = D.schedule
    .map((s) => `
      <div class="sched-item">
        <div>
          <span class="sched-date ${s.tone}">${s.date}</span>
          <div class="sched-title">${s.title}</div>
          <div class="sched-meta"><b>${s.cat}</b> · ${s.time}</div>
        </div>
        <i class="bi bi-chevron-right text-muted"></i>
      </div>`)
    .join("");

  $("#activityList").innerHTML = D.activities
    .map((a) => `
      <div class="tl-item">
        <div class="tl-dot ${a.tone}"><i class="bi ${a.icon}"></i></div>
        <div>${a.html}<small>${a.time}</small></div>
      </div>`)
    .join("");

  $("#heroName").textContent = D.user.first;
})();
