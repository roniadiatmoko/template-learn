/* Login, register, dan lupa password (demo: tanpa backend). Sesi disimpan di localStorage (ingat saya) atau sessionStorage. */
(function () {
  const $ = (s) => document.querySelector(s);

  /* Tujuan setelah login: hanya path relatif di situs ini (cegah open redirect) */
  function nextUrl() {
    const n = new URLSearchParams(location.search).get("next") || "";
    return /^(?!\/\/)[\w./-]+(\?[\w=&%.-]*)?(#[\w-]*)?$/.test(n) && !n.includes(":") ? n : "index.html";
  }
  function startSession(user, remember) {
    const data = JSON.stringify(user);
    try {
      localStorage.removeItem("lz.auth"); sessionStorage.removeItem("lz.auth");
      (remember ? localStorage : sessionStorage).setItem("lz.auth", data);
      const prof = JSON.parse(localStorage.getItem("lz.profile") || "{}");
      localStorage.setItem("lz.profile", JSON.stringify(Object.assign(prof, { name: user.name, email: user.email })));
    } catch (e) { /* penyimpanan tidak tersedia: lanjutkan tanpa sesi tersimpan */ }
  }
  const nameFromEmail = (e) => e.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  /* Tombol tampilkan/sembunyikan password */
  document.querySelectorAll(".pw-toggle").forEach((b) => b.addEventListener("click", () => {
    const input = b.parentElement.querySelector("input");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    b.setAttribute("aria-pressed", show);
    b.setAttribute("aria-label", show ? "Hide password" : "Show password");
    b.firstElementChild.className = "bi " + (show ? "bi-eye-slash" : "bi-eye");
  }));

  function guard(form, fn) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.classList.add("was-validated");
      if (!form.checkValidity()) { const bad = form.querySelector(":invalid"); if (bad) bad.focus(); return; }
      fn(form);
    });
  }

  /* ---------- Login ---------- */
  const login = $("#loginForm");
  let role = "sso";
  if (login) {
    const ROLES = window.LzRoles || {};
    const q = new URLSearchParams(location.search).get("role");
    role = ROLES[q] ? q : "sso";
    $("#roleChips").innerHTML = Object.entries(ROLES).map(([k, r]) =>
      `<a class="lz-chip ${k === role ? "active" : ""}" href="login.html?role=${k}${location.search.includes("next=") ? "&next=" + encodeURIComponent(new URLSearchParams(location.search).get("next")) : ""}" ${k === role ? 'aria-current="true"' : ""}><i class="bi ${r.icon}"></i>${r.label}</a>`).join("");
    $("#roleHint").textContent = ROLES[role] ? ROLES[role].hint : $("#roleHint").textContent;
    document.title = `Log in as ${ROLES[role] ? ROLES[role].label : "user"}: Learnzie`;
  }
  if (login) guard(login, () => {
    const email = $("#email").value.trim();
    startSession({ email, name: nameFromEmail(email), role }, $("#remember").checked);
    Lz.toast("Welcome back. Taking you to your dashboard.", "success", { title: "Logged in", delay: 1500 });
    setTimeout(() => { location.href = nextUrl(); }, 700);
  });

  /* ---------- Register ---------- */
  const reg = $("#registerForm");
  if (reg) {
    const pw = $("#password");
    const HINTS = ["Weak. Add more characters.", "Weak. Add more characters.", "Fair. Add numbers or symbols.", "Good.", "Strong."];
    pw.addEventListener("input", () => {
      const v = pw.value;
      let s = 0;
      if (v.length >= 8) s++;
      if (v.length >= 12) s++;
      if (/[A-Za-z]/.test(v) && /\d/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      const m = $("#pwMeter");
      m.style.width = (v ? Math.max(1, s) * 25 : 0) + "%";
      m.className = "progress-bar " + (s <= 1 ? "bg-danger" : s === 2 ? "bg-warning" : "bg-success");
      $("#pwHint").textContent = v ? HINTS[s] : "Use 8 or more characters with letters and numbers.";
    });
    guard(reg, () => {
      const email = $("#email").value.trim();
      startSession({ email, name: $("#name").value.trim() }, true);
      Lz.toast("Your account is ready. Taking you to your dashboard.", "success", { title: "Welcome to Learnzie", delay: 1500 });
      setTimeout(() => { location.href = "index.html"; }, 800);
    });
  }

  /* ---------- Lupa password ---------- */
  const forgot = $("#forgotForm");
  if (forgot) guard(forgot, () => {
    $("#sentTo").textContent = $("#email").value.trim();
    forgot.hidden = true;
    $("#forgotDone").hidden = false;
    $("#forgotDone").focus();
  });
})();
