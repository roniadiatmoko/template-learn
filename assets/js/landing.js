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
})();
