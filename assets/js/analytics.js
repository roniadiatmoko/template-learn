/* Analytics: KPI, tren belajar, komposisi kategori, tugas per minggu, tabel top course. Data dummy deterministik. */
(function () {
  const D = window.LzData;
  const $ = (s) => document.querySelector(s);
  const P = Lz.palette;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* pseudo-random deterministik agar angka stabil antar muat ulang */
  const rnd = (i) => { const x = Math.sin(i * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const DAYS = 90;
  const series = Array.from({ length: DAYS }, (_, i) => {
    const dow = new Date(Date.now() - (DAYS - 1 - i) * 864e5).getDay();
    const base = dow === 0 || dow === 6 ? 1.2 : 2.4;
    return Math.round((base + rnd(i) * 2.2) * 10) / 10;
  });

  const trend = Lz.charts.line($("#trend"), [], [{ data: [], borderColor: P.primary, backgroundColor: "rgba(15,111,222,.10)", fill: true }]);
  trend.options.scales.y.ticks.callback = (v) => v + "h";
  trend.options.plugins.tooltip = { callbacks: { label: (c) => ` ${c.parsed.y} hours` } };

  const mix = Lz.charts.donut($("#mix"), D.progress.parts, D.categories.map((c) => c.color));
  mix.options.plugins.tooltip = { enabled: true };
  $("#mixLegend").innerHTML = D.categories.map((c, i) => `<span><i style="background:${c.color}"></i>${c.label} ${D.progress.parts[i]}%</span>`).join("");

  const wk = Array.from({ length: 8 }, (_, i) => Math.round(3 + rnd(i + 200) * 9));
  Lz.charts.bar($("#weeks"), wk.map((_, i) => `W${i + 1}`), [{ data: wk, backgroundColor: P.primary }], { max: 14 });

  const sum = (a) => a.reduce((x, y) => x + y, 0);
  function draw() {
    const n = Number($("#range").value);
    const data = series.slice(-n);
    const prev = series.slice(-2 * n, -n);
    const total = sum(data);
    const delta = prev.length === n ? Math.round(((total - sum(prev)) / sum(prev)) * 100) : 0;
    let streak = 0;
    for (let i = data.length - 1; i >= 0 && data[i] > 1; i--) streak++;
    const cards = [
      { label: "Study time", value: total.toFixed(1) + " h", icon: "bi-clock-history", delta },
      { label: "Lessons completed", value: Math.round(total * 1.8), icon: "bi-play-circle" },
      { label: "Daily average", value: (total / n).toFixed(1) + " h", icon: "bi-bar-chart" },
      { label: "Current streak", value: streak + " days", icon: "bi-fire" },
    ];
    $("#kpis").innerHTML = cards.map((k) => `<div class="col-sm-6 col-xl-3"><div class="lz-card kpi"><div class="stat-icon"><i class="bi ${k.icon}"></i></div>
      <div><small>${k.label}</small><strong>${k.value}</strong>${k.delta === undefined ? "" : `<span class="lz-stat-delta ${k.delta >= 0 ? "up" : "down"} ms-1"><i class="bi ${k.delta >= 0 ? "bi-arrow-up-short" : "bi-arrow-down-short"}"></i>${Math.abs(k.delta)}%</span>`}</div></div></div>`).join("");
    trend.data.labels = data.map((_, i) => new Date(Date.now() - (n - 1 - i) * 864e5).toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    trend.data.datasets[0].data = data;
    trend.options.scales.x.ticks.maxTicksLimit = 7;
    trend.update();
  }
  $("#range").addEventListener("change", draw);
  draw();

  $("#topBody").innerHTML = D.courses.filter((c) => c.progress !== null).map((c) => {
    const h = (c.hours * c.progress / 100).toFixed(1);
    return `<tr><td class="fw-bold">${esc(c.title)}</td><td>${esc(c.cat)}</td><td data-value="${h}">${h} h</td>
      <td data-value="${c.progress}"><div class="d-flex align-items-center gap-2"><div class="progress flex-grow-1" style="min-width:60px"><div class="progress-bar" style="width:${c.progress}%"></div></div><span class="small fw-bold">${c.progress}%</span></div></td></tr>`;
  }).join("");
  Lz.initTables();
})();
