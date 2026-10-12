/* Class: daftar kelas (tanpa parameter) dan ruang kelas (?course=<id>). */
(function () {
  const D = window.LzData;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ICON = { video: "bi-play-circle", reading: "bi-file-earmark-text", quiz: "bi-patch-question" };
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* abaikan */ } },
  };

  const params = new URLSearchParams(location.search);
  const cid = Number(params.get("course"));
  const c = D.courses.find((x) => x.id === cid);

  /* ---------- Daftar kelas ---------- */
  if (!c) {
    const enrolled = new Set(store.get("lz.enrolled", []));
    const mine = D.courses.filter((x) => x.progress !== null || enrolled.has(x.id));
    $("#classRoot").innerHTML = mine.length
      ? `<div class="row g-3">${mine.map((x) => {
          const done = store.get("lz.done." + x.id, null);
          const pct = done ? Math.round((done.length / x.lessons) * 100) : x.progress || 0;
          return `<div class="col-md-6 col-xl-4"><article class="course-card">
            <div class="course-cover ${x.tone}"><i class="bi ${x.icon}"></i><span class="badge">${esc(x.cat)}</span></div>
            <div class="course-body">
              <h3 class="course-title"><a href="class.html?course=${x.id}">${esc(x.title)}</a></h3>
              <div class="course-by">${esc(x.instructor)}</div>
              <div class="course-foot flex-column align-items-stretch">
                <div class="course-progress"><span>${pct}%</span><div class="progress"><div class="progress-bar ${pct === 100 ? "bg-success" : ""}" style="width:${pct}%"></div></div></div>
                <a class="btn btn-primary btn-sm" href="class.html?course=${x.id}">${pct === 100 ? "Review class" : pct ? "Continue" : "Start"}</a>
              </div></div></article></div>`;
        }).join("")}</div>`
      : `<div class="lz-empty"><i class="bi bi-play-circle"></i>You have not joined a class yet.<div class="mt-3"><a class="btn btn-primary btn-sm" href="explore.html">Find a course</a></div></div>`;
    return;
  }

  /* ---------- Ruang kelas ---------- */
  document.title = `${c.title} — Learnzie`;
  $("#pageTitle") && ($("#pageTitle").textContent = c.title);
  const mods = D.curriculum(c);
  const lessons = mods.flatMap((m) => m.lessons);
  const kDone = "lz.done." + c.id;
  let done = new Set(store.get(kDone, null) || lessons.slice(0, Math.round(((c.progress || 0) / 100) * lessons.length)).map((l) => l.id));
  let cur = Number(params.get("lesson")) || (lessons.find((l) => !done.has(l.id)) || lessons[0]).id;

  const save = () => store.set(kDone, [...done]);
  const lesson = () => lessons.find((l) => l.id === cur);

  function drawList() {
    const pct = Math.round((done.size / lessons.length) * 100);
    $("#lessonList").innerHTML = `
      <div class="lz-card p-3 mb-3">
        <div class="d-flex justify-content-between small fw-bold mb-1"><span>Your progress</span><span>${pct}%</span></div>
        <div class="progress"><div class="progress-bar ${pct === 100 ? "bg-success" : ""}" style="width:${pct}%"></div></div>
        <div class="small text-muted mt-2">${done.size} of ${lessons.length} lessons completed</div>
      </div>
      <div class="accordion" id="classAcc">${mods.map((m, i) => {
        const open = m.lessons.some((l) => l.id === cur);
        return `<div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button ${open ? "" : "collapsed"}" type="button" data-bs-toggle="collapse" data-bs-target="#cm${i}" aria-expanded="${open}">
          ${esc(m.title)}<span class="ms-auto me-3 small text-muted fw-semibold">${m.lessons.filter((l) => done.has(l.id)).length}/${m.lessons.length}</span></button></h3>
          <div id="cm${i}" class="accordion-collapse collapse ${open ? "show" : ""}"><div class="accordion-body p-0"><ul class="lesson-list">${m.lessons.map((l) =>
            `<li><button type="button" class="lesson-btn ${l.id === cur ? "current" : ""}" data-lesson="${l.id}" ${l.id === cur ? 'aria-current="true"' : ""}>
              <i class="bi ${done.has(l.id) ? "bi-check-circle-fill done" : ICON[l.type]}"></i><span>${esc(l.title)}</span><small>${l.min} min</small></button></li>`).join("")}</ul></div></div></div>`;
      }).join("")}</div>`;
  }

  /* Tandai selesai / batal; tampilkan toast bila course tuntas */
  function setDone(id, on) {
    if (on) done.add(id); else done.delete(id);
    save();
    if (on) {
      if (done.size === lessons.length) Lz.toast("You finished the course. Your certificate is ready.", "success", { title: "Course completed" });
      else Lz.toast("Lesson completed.", "success", { delay: 1800 });
    }
  }

  const TAG = { video: "Video", reading: "Reading", quiz: "Quiz" };
  function media(l) {
    if (l.type === "video") {
      return `<div class="player ${c.tone}" id="player">
        <button class="play" type="button" aria-label="Play ${esc(l.title)}"><i class="bi bi-play-fill"></i></button>
        <span class="player-tag">${TAG[l.type]} · ${l.min} min</span></div>`;
    }
    const content = D.lessonContent(c, l);
    if (l.type === "reading") {
      return `<article class="lz-card reading h-auto"><span class="badge badge-soft-blue mb-2">${TAG[l.type]} · ${l.min} min</span>
        <h3 class="h5">${esc(l.title)}</h3>${content.reading.map((p) => `<p>${esc(p)}</p>`).join("")}</article>`;
    }
    return `<form class="lz-card quiz h-auto" id="quizForm" novalidate><span class="badge badge-soft-pink mb-2">${TAG[l.type]} · ${content.quiz.length} questions</span>
      <h3 class="h5 mb-3">Check what you learned</h3>
      ${content.quiz.map((q, i) => `<fieldset class="mb-3"><legend class="fs-6 fw-bold">${i + 1}. ${esc(q.q)}</legend>
        ${q.o.map((o, j) => `<div class="form-check"><input class="form-check-input" type="radio" name="q${i}" id="q${i}-${j}" value="${j}" required><label class="form-check-label" for="q${i}-${j}">${esc(o)}</label></div>`).join("")}</fieldset>`).join("")}
      <div id="quizResult" class="small fw-bold mb-2" role="status" aria-live="polite"></div>
      <button class="btn btn-primary" type="submit">Check answers</button></form>`;
  }

  function drawStage() {
    const l = lesson();
    const idx = lessons.indexOf(l);
    const isDone = done.has(l.id);
    $("#stage").innerHTML = `${media(l)}
      <div class="d-flex flex-wrap align-items-start justify-content-between gap-2 mt-3">
        <div><div class="text-muted small">Lesson ${idx + 1} of ${lessons.length}</div><h2 class="h4 mb-0">${esc(l.title)}</h2></div>
        <button class="btn ${isDone ? "btn-secondary" : "btn-primary"}" id="toggleDone" type="button" aria-pressed="${isDone}">
          <i class="bi ${isDone ? "bi-check-circle-fill text-success" : "bi-check-circle"} me-1"></i>${isDone ? "Completed" : "Mark as complete"}</button>
      </div>
      <div class="d-flex gap-2 mt-3">
        <button class="btn btn-secondary" id="prev" type="button" ${idx === 0 ? "disabled" : ""}><i class="bi bi-chevron-left me-1"></i>Previous</button>
        <button class="btn btn-secondary" id="next" type="button" ${idx === lessons.length - 1 ? "disabled" : ""}>Next<i class="bi bi-chevron-right ms-1"></i></button>
      </div>`;
  }

  /* Putar video: ganti tombol play dengan elemen <video>; selesai ditonton = materi ditandai selesai */
  function playVideo() {
    const l = lesson();
    const box = $("#player");
    if (!box || !l.video) return;
    box.classList.add("playing");
    box.innerHTML = `<video controls autoplay playsinline preload="auto" aria-label="${esc(l.title)}"><source src="${esc(l.video)}"></video>`;
    const v = box.querySelector("video");
    v.addEventListener("ended", () => {
      if (!done.has(l.id)) { setDone(l.id, true); drawStage(); drawList(); }
    });
    v.querySelector("source").addEventListener("error", () => {
      Lz.toast("This video could not be loaded. Check your connection, or set a video URL in curriculum.js.", "danger", { title: "Video unavailable" });
      drawStage();
    });
  }

  /* Catatan dan diskusi per course */
  const kNote = "lz.note." + c.id, kCom = "lz.comments." + c.id;
  function drawComments() {
    const list = store.get(kCom, [{ name: "Dewi Lestari", text: "Does anyone have a good example for this lesson?", when: "Yesterday" }]);
    $("#commentList").innerHTML = list.map((m) => `<div class="review"><span class="lz-avatar sm">${esc(m.name.split(" ").map((w) => w[0]).join("").slice(0, 2))}</span>
      <div><div class="d-flex gap-2 align-items-center"><strong>${esc(m.name)}</strong><small class="text-muted">${esc(m.when)}</small></div><p class="mb-0">${esc(m.text)}</p></div></div>`).join("");
  }

  $("#classRoot").innerHTML = `
    <nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="class.html">Class</a></li><li class="breadcrumb-item active" aria-current="page">${esc(c.title)}</li></ol></nav>
    <div class="row g-3">
      <div class="col-xl-8">
        <div id="stage"></div>
        <div class="lz-card mt-3">
          <ul class="nav nav-tabs mb-3" role="tablist">
            <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#t-over" type="button" role="tab">Overview</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#t-notes" type="button" role="tab">Notes</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#t-talk" type="button" role="tab">Discussion</button></li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane fade show active" id="t-over" role="tabpanel"><p class="mb-1"><strong>${esc(c.title)}</strong></p><p class="text-muted mb-0">By ${esc(c.instructor)} · ${c.level} · ${c.hours} hours. Finish every lesson to unlock your certificate.</p></div>
            <div class="tab-pane fade" id="t-notes" role="tabpanel">
              <label class="form-label" for="note">Your notes for this course</label>
              <textarea id="note" class="form-control" rows="5" placeholder="Write what you want to remember"></textarea>
              <div class="form-text" id="noteState">Saved on this device.</div>
            </div>
            <div class="tab-pane fade" id="t-talk" role="tabpanel">
              <form id="commentForm" class="d-flex gap-2 mb-3"><input id="commentText" class="form-control" placeholder="Ask a question or share a tip" aria-label="Comment" required><button class="btn btn-primary" type="submit">Post</button></form>
              <div id="commentList"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-4"><div id="lessonList"></div></div>
    </div>`;

  function go(id) {
    cur = id;
    drawStage(); drawList();
    history.replaceState(null, "", `?course=${c.id}&lesson=${id}`);
  }
  $("#classRoot").addEventListener("click", (e) => {
    const lb = e.target.closest("[data-lesson]");
    if (lb) return go(Number(lb.dataset.lesson));
    const idx = lessons.indexOf(lesson());
    if (e.target.closest("#prev") && idx > 0) return go(lessons[idx - 1].id);
    if (e.target.closest("#next") && idx < lessons.length - 1) return go(lessons[idx + 1].id);
    if (e.target.closest("#toggleDone")) {
      const l = lesson();
      setDone(l.id, !done.has(l.id));
      drawStage(); drawList();
    }
    if (e.target.closest(".play")) playVideo();
  });

  $("#classRoot").addEventListener("submit", (e) => {
    if (e.target.id !== "quizForm") return;
    e.preventDefault();
    const l = lesson();
    const qs = D.lessonContent(c, l).quiz;
    const form = e.target;
    const picked = (i) => form.querySelector(`input[name=q${i}]:checked`);
    const out = $("#quizResult");
    if (!qs.every((_, i) => picked(i))) { out.className = "small fw-bold mb-2 text-danger"; out.textContent = "Answer every question, then check again."; return; }
    const score = qs.filter((q, i) => Number(picked(i).value) === q.a).length;
    const pass = score >= 2;
    out.className = "small fw-bold mb-2 " + (pass ? "text-success" : "text-danger");
    out.textContent = pass ? `You got ${score} of ${qs.length}. Lesson completed.` : `You got ${score} of ${qs.length}. You need at least 2 correct. Review the lesson and try again.`;
    if (pass && !done.has(l.id)) { setDone(l.id, true); drawList(); }
  });

  const note = $("#note");
  note.value = store.get(kNote, "");
  note.addEventListener("input", () => { store.set(kNote, note.value); });
  $("#commentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const t = $("#commentText").value.trim();
    if (!t) return;
    const list = store.get(kCom, [{ name: "Dewi Lestari", text: "Does anyone have a good example for this lesson?", when: "Yesterday" }]);
    list.push({ name: D.user.name, text: t, when: "Just now" });
    store.set(kCom, list);
    $("#commentText").value = "";
    drawComments();
  });

  drawStage(); drawList(); drawComments();
})();
