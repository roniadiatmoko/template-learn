/* Settings: profil (tersimpan lokal), upload avatar (preview), ganti password, notifikasi, tema. */
(function () {
  const D = window.LzData;
  const $ = (s) => document.querySelector(s);
  const read = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  /* ---------- Profil ---------- */
  const prof = Object.assign({ name: D.user.name, username: D.user.username.replace("@", ""), email: "gareth@example.com", phone: "", bio: "", avatar: "" }, read("lz.profile", {}));
  const map = { name: "#pName", username: "#pUser", email: "#pEmail", phone: "#pPhone", bio: "#pBio" };
  Object.entries(map).forEach(([k, s]) => { $(s).value = prof[k]; });
  function paintAvatar() {
    const a = $("#avatarPreview");
    a.style.backgroundImage = prof.avatar ? `url(${prof.avatar})` : "";
    a.textContent = prof.avatar ? "" : initials($("#pName").value || prof.name);
  }
  paintAvatar();
  $("#pName").addEventListener("input", paintAvatar);

  $("#avatarFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    const err = $("#avatarErr");
    err.textContent = "";
    if (!file) return;
    if (!/^image\//.test(file.type)) { err.textContent = "Choose an image file (PNG or JPG)."; return; }
    if (file.size > 2 * 1024 * 1024) { err.textContent = "This image is larger than 2 MB. Choose a smaller one."; return; }
    const r = new FileReader();
    r.onload = () => { prof.avatar = r.result; paintAvatar(); };
    r.readAsDataURL(file);
  });

  $("#profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    f.classList.add("was-validated");
    if (!f.checkValidity()) return;
    Object.entries(map).forEach(([k, s]) => { prof[k] = $(s).value.trim(); });
    const ok = write("lz.profile", prof);
    Lz.toast(ok ? "Profile saved." : "Could not save on this device. Free some browser storage and try again.", ok ? "success" : "danger", { title: ok ? "Saved" : "Not saved" });
  });

  /* ---------- Password ---------- */
  const pw = $("#pwNew"), pw2 = $("#pwNew2");
  function score(v) {
    let s = 0;
    if (v.length >= 8) s++;
    if (v.length >= 12) s++;
    if (/[A-Za-z]/.test(v) && /\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return s;
  }
  const HINTS = ["Weak. Add more characters.", "Weak. Add more characters.", "Fair. Add numbers or symbols.", "Good.", "Strong."];
  const syncMatch = () => pw2.setCustomValidity(pw2.value !== pw.value ? "Passwords do not match." : "");
  pw.addEventListener("input", () => {
    const s = score(pw.value), m = $("#pwMeter");
    m.style.width = (pw.value ? Math.max(1, s) * 25 : 0) + "%";
    m.className = "progress-bar " + (s <= 1 ? "bg-danger" : s === 2 ? "bg-warning" : "bg-success");
    $("#pwHint").textContent = pw.value ? HINTS[s] : "Use 8 or more characters with letters and numbers.";
    if (pw2.value) syncMatch();
  });
  pw2.addEventListener("input", syncMatch);
  $("#pwForm").addEventListener("submit", (e) => {
    e.preventDefault();
    syncMatch();
    e.target.classList.add("was-validated");
    if (!e.target.checkValidity()) return;
    e.target.reset();
    e.target.classList.remove("was-validated");
    $("#pwMeter").style.width = "0";
    Lz.toast("Your password has been updated.", "success", { title: "Password updated" });
  });

  /* ---------- Notifikasi ---------- */
  const NOTIFS = [
    ["deadline", "Assignment deadlines", "A reminder one day before each due date.", true],
    ["class", "Class reminders", "A reminder 30 minutes before a scheduled class.", true],
    ["news", "New courses", "Weekly picks based on what you study.", false],
    ["email", "Email summary", "A short weekly report of your progress.", true],
  ];
  const ns = Object.assign(Object.fromEntries(NOTIFS.map((n) => [n[0], n[3]])), read("lz.notif", {}));
  $("#notifList").innerHTML = NOTIFS.map(([k, t, d]) => `<div class="switch-row"><div><label for="n-${k}" class="fw-bold">${t}</label><small>${d}</small></div>
    <div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" role="switch" id="n-${k}" data-n="${k}" ${ns[k] ? "checked" : ""}></div></div>`).join("");
  $("#notifList").addEventListener("change", (e) => {
    const k = e.target.dataset.n;
    if (!k) return;
    ns[k] = e.target.checked;
    write("lz.notif", ns);
    Lz.toast(`${e.target.checked ? "Turned on" : "Turned off"}: ${NOTIFS.find((n) => n[0] === k)[1]}`, "info", { delay: 1800 });
  });

  /* ---------- Tab lewat hash (#account, #notifications, #appearance) ---------- */
  const TABS = { profile: "#s-profile", account: "#s-account", notifications: "#s-notif", appearance: "#s-look" };
  const showFromHash = () => {
    const target = TABS[location.hash.slice(1)] || TABS.profile;
    const btn = document.querySelector(`[data-bs-target="${target}"]`);
    if (btn) bootstrap.Tab.getOrCreateInstance(btn).show();
  };
  showFromHash();
  window.addEventListener("hashchange", showFromHash);
  document.querySelectorAll(".set-nav [data-bs-target]").forEach((b) => b.addEventListener("shown.bs.tab", () => {
    const key = Object.keys(TABS).find((k) => TABS[k] === b.dataset.bsTarget);
    Lz.url.hash(key === "profile" ? "" : key);
  }));

  /* ---------- Tema ---------- */
  const cur = Lz.theme ? Lz.theme.get() : "light";
  const radio = document.querySelector(`input[name=theme][value=${cur}]`);
  if (radio) radio.checked = true;
  document.querySelectorAll("input[name=theme]").forEach((r) => r.addEventListener("change", () => { if (Lz.theme) Lz.theme.set(r.value); }));
})();
