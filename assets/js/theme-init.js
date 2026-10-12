/* Dimuat di <head> agar tema gelap langsung terpasang (tanpa kedipan). Logikanya sama dengan Lz.theme. */
(function () {
  try {
    var v = localStorage.getItem("lz.theme") || "light";
    if (v === "auto") v = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", v);
  } catch (e) { /* abaikan */ }
})();
