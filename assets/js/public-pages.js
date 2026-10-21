/* Halaman contoh publik: coming soon, lock screen, maintenance, halaman error. Tiap blok hanya berjalan jika elemennya ada. */
(function () {
  const $ = (s) => document.querySelector(s);
  const pad = (n) => String(n).padStart(2, "0");
  function session() {
    try { return JSON.parse(localStorage.getItem("lz.auth") || sessionStorage.getItem("lz.auth") || "null"); } catch (e) { return null; }
  }

  /* ---------- Coming soon: hitung mundur + daftar notifikasi ---------- */
  const cd = $("#countdown");
  if (cd) {
    let target = 0;
    try { target = Number(localStorage.getItem("lz.launch")); } catch (e) { /* abaikan */ }
    if (!target || target < Date.now()) {
      target = Date.now() + 14 * 864e5 + 3 * 36e5;
      try { localStorage.setItem("lz.launch", String(target)); } catch (e) { /* abaikan */ }
    }
    const set = (id, v) => { $(id).textContent = pad(v); };
    const tick = () => {
      const left = Math.max(0, target - Date.now());
      set("#cdD", Math.floor(left / 864e5));
      set("#cdH", Math.floor(left / 36e5) % 24);
      set("#cdM", Math.floor(left / 6e4) % 60);
      set("#cdS", Math.floor(left / 1e3) % 60);
    };
    tick();
    setInterval(tick, 1000);
    const form = $("#notifyForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.classList.add("was-validated");
      if (!form.checkValidity()) { $("#email").focus(); return; }
      $("#notifyDone").textContent = `Thank you. We will email ${$("#email").value.trim()} on launch day.`;
      form.hidden = true;
      $("#notifyDone").hidden = false;
      Lz.toast("You are on the list.", "success", { title: "Subscribed", delay: 2500 });
    });
  }

  /* ---------- Lock screen ---------- */
  const lock = $("#lockForm");
  if (lock) {
    let name = "Gareth Christopher";
    try { name = (session() || {}).name || (JSON.parse(localStorage.getItem("lz.profile") || "{}")).name || name; } catch (e) { /* abaikan */ }
    $("#lockName").textContent = name;
    $("#lockAvatar").textContent = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    lock.addEventListener("submit", (e) => {
      e.preventDefault();
      lock.classList.add("was-validated");
      if (!lock.checkValidity()) { $("#password").focus(); return; }
      Lz.toast("Welcome back. Unlocking your session.", "success", { delay: 1200 });
      setTimeout(() => { location.href = "index.html"; }, 600);
    });
  }

  /* ---------- Maintenance ---------- */
  const again = $("#checkAgain");
  if (again) again.addEventListener("click", () => Lz.toast("We are still working on it. Please check again in a few minutes.", "info", { title: "Still under maintenance" }));

  /* ---------- Error 500 ---------- */
  const ref = $("#refId");
  if (ref) ref.textContent = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("").toUpperCase();
  const retry = $("#retry");
  if (retry) retry.addEventListener("click", () => location.reload());
  const back = $("#goBack");
  if (back) back.addEventListener("click", () => { if (history.length > 1) history.back(); else location.href = "landing.html"; });
})();
