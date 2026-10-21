/* Landing page: kartu course populer (data dummy). Tombol mengarah ke login lebih dulu karena pengguna belum masuk. */
(function () {
  const D = window.LzData;
  const grid = document.getElementById("popularGrid");
  if (!grid || !D) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const price = (n) => (n === 0 ? "Free" : "Rp " + n.toLocaleString("id-ID"));

  const top = [...D.courses].sort((a, b) => b.students - a.students).slice(0, 6);
  grid.innerHTML = top.map((c) => {
    const next = encodeURIComponent(`pages/course-detail.html?id=${c.id}`);
    return `<div class="col-md-6 col-lg-4"><article class="course-card">
      <div class="course-cover ${c.tone}"><i class="bi ${c.icon}"></i><span class="badge">${esc(c.cat)}</span></div>
      <div class="course-body">
        <h3 class="course-title"><a href="login.html?next=${next}">${esc(c.title)}</a></h3>
        <div class="course-by">${esc(c.instructor)} · ${c.level}</div>
        <div class="course-meta"><span><i class="bi bi-star-fill star"></i>${c.rating}</span><span><i class="bi bi-play-circle"></i>${c.lessons} lessons</span><span><i class="bi bi-people"></i>${c.students.toLocaleString("id-ID")}</span></div>
        <div class="course-foot"><span class="course-price ${c.price === 0 ? "free" : ""}">${price(c.price)}</span><a class="btn btn-soft btn-sm" href="login.html?next=${next}">View course</a></div>
      </div></article></div>`;
  }).join("");

  /* ---------- Learning paths (card stack): dikelompokkan dari kategori course ---------- */
  const track = document.getElementById("pathTrack");
  if (track) {
    const TEXT = {
      "UX Design": "From user research to usability testing: learn to understand people before you design for them.",
      "Front-End": "Build interfaces that work on every screen, from HTML and CSS to JavaScript and Bootstrap.",
      Copywriting: "Write clear, persuasive words for pages, emails, and brands, and test what works.",
      Business: "Strategy, leadership, and decisions: the habits that help teams reach their goals.",
      Finance: "Read the numbers, plan the money, and explain your results with confidence.",
    };
    const groups = {};
    D.courses.forEach((c) => { (groups[c.cat] = groups[c.cat] || []).push(c); });
    const cats = Object.keys(groups);
    track.innerHTML = cats.map((cat) => {
      const list = groups[cat], first = list[0];
      const hours = list.reduce((a, c) => a + c.hours, 0);
      const rating = (list.reduce((a, c) => a + c.rating, 0) / list.length).toFixed(1);
      const next = encodeURIComponent("pages/explore.html?cat=" + encodeURIComponent(cat));
      return `<article class="stack-card" role="group" aria-roledescription="slide" data-title="${esc(cat)} path">
        <div class="stack-cover ${first.tone}"><i class="bi ${first.icon}"></i><span class="badge">${list.length} courses</span></div>
        <div class="stack-body">
          <h3>${esc(cat)} path</h3>
          <p>${esc(TEXT[cat] || "")}</p>
          <ul class="stack-list">${list.slice(0, 3).map((c) => `<li><i class="bi bi-check-circle-fill"></i>${esc(c.title)}</li>`).join("")}</ul>
          <div class="stack-meta"><span><i class="bi bi-clock"></i>${hours} hours</span><span><i class="bi bi-star-fill" style="color:#f5b800"></i>${rating} average</span></div>
          <a class="btn btn-primary" href="login.html?next=${next}">Start this path</a>
        </div></article>`;
    }).join("");
    document.getElementById("pathDots").innerHTML = cats.map((c, i) => `<button class="stack-dot" type="button" data-stack-dot aria-label="Show ${esc(c)} path"></button>`).join("");
  }
})();
