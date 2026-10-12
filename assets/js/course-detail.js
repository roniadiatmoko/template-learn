/* Detail course. URL: course-detail.html?id=<n> */
(function () {
  const D = window.LzData;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rupiah = (n) => (n === 0 ? "Free" : "Rp " + n.toLocaleString("id-ID"));
  const ICON = { video: "bi-play-circle", reading: "bi-file-earmark-text", quiz: "bi-patch-question" };

  const id = Number(new URLSearchParams(location.search).get("id")) || 1;
  const c = D.courses.find((x) => x.id === id);
  if (!c) {
    $("#detail").innerHTML = `<div class="lz-empty"><i class="bi bi-journal-x"></i>We could not find this course.<div class="mt-3"><a class="btn btn-primary btn-sm" href="explore.html">Back to Explore</a></div></div>`;
    return;
  }
  document.title = `${c.title} — Learnzie`;

  const mods = D.curriculum(c);
  const inst = D.instructors[c.instructor] || { role: "Instructor", bio: "", courses: 1, students: c.students };
  const totalMin = mods.reduce((a, m) => a + m.lessons.reduce((b, l) => b + l.min, 0), 0);

  /* Status pendaftaran disimpan lokal */
  const KEY = "lz.enrolled";
  const getEnrolled = () => { try { return new Set(JSON.parse(localStorage.getItem(KEY)) || []); } catch (e) { return new Set(); } };
  const setEnrolled = (set) => { try { localStorage.setItem(KEY, JSON.stringify([...set])); } catch (e) { /* abaikan */ } };
  const isIn = () => c.progress !== null || getEnrolled().has(c.id);

  const stars = (n) => Array.from({ length: 5 }, (_, i) => `<i class="bi ${i < Math.round(n) ? "bi-star-fill" : "bi-star"} star"></i>`).join("");

  function buyCard() {
    const inn = isIn();
    return `<div class="lz-card buy-card">
      <div class="course-price fs-3 ${c.price === 0 ? "free" : ""}">${rupiah(c.price)}</div>
      ${inn
        ? `<a class="btn btn-primary w-100 mt-3" href="class.html?course=${c.id}">${c.progress ? "Continue learning" : "Start learning"}</a>`
        : `<button class="btn btn-primary w-100 mt-3" id="enroll" type="button">${c.price === 0 ? "Enroll for free" : "Enroll now"}</button>`}
      <ul class="buy-list">
        <li><i class="bi bi-play-circle"></i>${c.lessons} lessons</li>
        <li><i class="bi bi-clock"></i>${c.hours} hours of content</li>
        <li><i class="bi bi-bar-chart"></i>${c.level} level</li>
        <li><i class="bi bi-infinity"></i>Lifetime access</li>
        <li><i class="bi bi-award"></i>Certificate on completion</li>
      </ul></div>`;
  }

  $("#detail").innerHTML = `
    <nav aria-label="breadcrumb"><ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="explore.html">Explore</a></li>
      <li class="breadcrumb-item"><a href="explore.html">${esc(c.cat)}</a></li>
      <li class="breadcrumb-item active" aria-current="page">${esc(c.title)}</li></ol></nav>

    <div class="row g-3">
      <div class="col-xl-8">
        <section class="detail-hero ${c.tone}">
          <i class="bi ${c.icon} detail-art"></i>
          <span class="badge">${esc(c.cat)}</span>
          <h2>${esc(c.title)}</h2>
          <div class="detail-meta">
            <span>${stars(c.rating)} <b>${c.rating}</b> (${D.reviews.length * 120} ratings)</span>
            <span><i class="bi bi-people"></i> ${c.students.toLocaleString("id-ID")} students</span>
            <span><i class="bi bi-person"></i> ${esc(c.instructor)}</span>
          </div>
        </section>

        <div class="lz-card mt-3">
          <ul class="nav nav-tabs mb-3" role="tablist">
            <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-overview" type="button" role="tab">Overview</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-curriculum" type="button" role="tab">Curriculum</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-reviews" type="button" role="tab">Reviews</button></li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane fade show active" id="tab-overview" role="tabpanel">
              <h3 class="h6">About this course</h3>
              <p>This ${c.level.toLowerCase()} course walks you through ${esc(c.title.toLowerCase())} step by step. Each lesson is short, practical, and ends with something you can apply the same day.</p>
              <h3 class="h6 mt-4">What you will learn</h3>
              <ul class="outcomes">${D.outcomes(c).map((o) => `<li><i class="bi bi-check-circle-fill"></i>${esc(o)}</li>`).join("")}</ul>
              <h3 class="h6 mt-4">Your instructor</h3>
              <div class="d-flex gap-3 align-items-start">
                <span class="lz-avatar lg">${esc(c.instructor.split(" ").filter((w) => !/^(Dr\.|Prof\.)$/.test(w)).map((w) => w[0]).join("").slice(0, 2))}</span>
                <div><strong>${esc(c.instructor)}</strong><div class="text-muted small mb-1">${esc(inst.role)} · ${inst.courses} courses · ${inst.students.toLocaleString("id-ID")} students</div><p class="mb-0">${esc(inst.bio)}</p></div>
              </div>
            </div>

            <div class="tab-pane fade" id="tab-curriculum" role="tabpanel">
              <p class="text-muted small">${mods.length} modules · ${c.lessons} lessons · ${Math.floor(totalMin / 60)}h ${totalMin % 60}m</p>
              <div class="accordion" id="acc">
                ${mods.map((m, i) => `<div class="accordion-item">
                  <h3 class="accordion-header"><button class="accordion-button ${i ? "collapsed" : ""}" type="button" data-bs-toggle="collapse" data-bs-target="#m${i}" aria-expanded="${i === 0}">
                    ${esc(m.title)}<span class="ms-auto me-3 small text-muted fw-semibold">${m.lessons.length} lessons</span></button></h3>
                  <div id="m${i}" class="accordion-collapse collapse ${i ? "" : "show"}" data-bs-parent="#acc"><div class="accordion-body p-0">
                    <ul class="lesson-list">${m.lessons.map((l) => `<li><i class="bi ${ICON[l.type]}"></i><span>${esc(l.title)}</span><small>${l.min} min</small></li>`).join("")}</ul>
                  </div></div></div>`).join("")}
              </div>
            </div>

            <div class="tab-pane fade" id="tab-reviews" role="tabpanel">
              <div class="d-flex align-items-center gap-3 mb-3"><div class="display-6 fw-bold">${c.rating}</div><div><div>${stars(c.rating)}</div><small class="text-muted">Course rating</small></div></div>
              ${D.reviews.map((r) => `<div class="review"><span class="lz-avatar sm">${esc(r.name.split(" ").map((w) => w[0]).join("").slice(0, 2))}</span>
                <div><div class="d-flex gap-2 align-items-center"><strong>${esc(r.name)}</strong><small class="text-muted">${r.when}</small></div><div class="small">${stars(r.rating)}</div><p class="mb-0 mt-1">${esc(r.text)}</p></div></div>`).join("")}
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-4"><div class="buy-wrap" id="buy">${buyCard()}</div></div>
    </div>`;

  $("#detail").addEventListener("click", (e) => {
    if (!e.target.closest("#enroll")) return;
    const set = getEnrolled();
    set.add(c.id);
    setEnrolled(set);
    $("#buy").innerHTML = buyCard();
    Lz.toast(`You are enrolled in ${c.title}.`, "success", { title: "Enrolled" });
  });
})();
