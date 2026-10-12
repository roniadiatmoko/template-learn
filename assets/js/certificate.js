/* Certificate: galeri course, preview, cetak/PDF lewat window.print. */
(function () {
  const D = window.LzData;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const read = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  const name = read("lz.profile", {}).name || D.user.name;

  /* Selesai: semua materi ditandai selesai di ruang kelas, atau (tanpa data kelas) progress 100% */
  const doneIds = (c) => read("lz.done." + c.id, null);
  const isDone = (c) => { const d = doneIds(c); return d ? d.length >= c.lessons : c.progress === 100; };
  const pctOf = (c) => { const d = doneIds(c); return d ? Math.round((d.length / c.lessons) * 100) : c.progress; };
  const issued = (c) => new Date(2027, 8, 1 + c.id * 3).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const code = (c) => `LZ-2027-${String(c.id).padStart(4, "0")}`;

  const list = D.courses.filter((c) => c.progress !== null);
  $("#certGrid").innerHTML = list.map((c) => {
    const ok = isDone(c), pct = pctOf(c);
    return `<div class="col-md-6 col-xl-4"><article class="course-card">
      <div class="p-3 pb-0"><div class="cert-thumb ${ok ? "" : "cert-locked"}"><div class="cert-mini"><i class="bi ${ok ? "bi-patch-check-fill" : "bi-lock"}"></i><b>${esc(c.title)}</b><small>${ok ? "Issued " + issued(c) : "Locked"}</small></div></div></div>
      <div class="course-body">
        <h3 class="course-title">${esc(c.title)}</h3>
        <div class="course-by">${esc(c.instructor)} · ${esc(c.cat)}</div>
        ${ok
          ? `<div class="course-foot"><span class="badge badge-soft-green">Completed</span><button class="btn btn-primary btn-sm" data-cert="${c.id}" type="button">View certificate</button></div>`
          : `<div class="course-foot flex-column align-items-stretch"><div class="course-progress"><span>${pct}%</span><div class="progress"><div class="progress-bar" style="width:${pct}%"></div></div></div><a class="btn btn-secondary btn-sm" href="class.html?course=${c.id}">Finish course to unlock</a></div>`}
      </div></article></div>`;
  }).join("") || `<div class="col-12"><div class="lz-empty"><i class="bi bi-award"></i>Complete a course to earn your first certificate.</div></div>`;

  const modal = new bootstrap.Modal($("#certModal"));
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-cert]");
    if (!b) return;
    const c = D.courses.find((x) => x.id === Number(b.dataset.cert));
    $("#certModalTitle").textContent = c.title;
    $("#certPrint").innerHTML = `
      <div class="brand"><span class="brand-mark"></span>Learnzie</div>
      <div class="small-cap">CERTIFICATE OF COMPLETION</div>
      <div class="small-cap">This certifies that</div>
      <div class="who">${esc(name)}</div>
      <div class="small-cap">has successfully completed the course</div>
      <div class="course">${esc(c.title)}</div>
      <div class="small-cap">${c.lessons} lessons · ${c.hours} hours · ${esc(c.level)}</div>
      <div class="cert-foot"><div>${issued(c)}<br><b>Date issued</b></div><div>${esc(c.instructor)}<br><b>Instructor</b></div><div>${code(c)}<br><b>Certificate ID</b></div></div>`;
    modal.show();
  });
  $("#certPrintBtn").addEventListener("click", () => window.print());
})();
