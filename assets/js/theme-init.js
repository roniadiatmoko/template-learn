/* Dimuat di <head>:
   1) menerapkan tema tanpa kedipan (logika sama dengan Lz.theme),
   2) menyiapkan efek fade-in saat halaman dimuat. Area konten (.app-content dan .app-right, bukan sidebar) disembunyikan
      sampai skrip halaman dan font siap, lalu muncul perlahan. Dilewati jika pengguna memilih reduced motion;
      ada batas waktu agar halaman tidak pernah tertahan. */
(function () {
  var root = document.documentElement;
  try {
    var v = localStorage.getItem("lz.theme") || "light";
    if (v === "auto") v = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.setAttribute("data-bs-theme", v);
  } catch (e) { /* abaikan */ }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  root.classList.add("lz-loading");

  function reveal() { root.classList.remove("lz-loading"); }
  document.addEventListener("DOMContentLoaded", function () {
    var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    var cap = new Promise(function (r) { setTimeout(r, 700); });
    Promise.race([fonts, cap]).then(function () { requestAnimationFrame(reveal); });
  });
  setTimeout(reveal, 2500);                                           // batas aman
  window.addEventListener("pageshow", function (e) { if (e.persisted) reveal(); });  // tombol back/forward
})();
