/* Schedule: kalender bulan/minggu, daftar hari terpilih, tambah/ubah/hapus event (tersimpan di localStorage). */
(function () {
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const key = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const TONES = { blue: "Blue", pink: "Pink", yellow: "Yellow", green: "Green" };
  const KEY = "lz.events";

  const today = new Date();
  const seed = () => {
    const e = (off, title, start, end, tone, note) => ({ id: Math.random().toString(36).slice(2, 9), title, date: key(addDays(today, off)), start, end, tone, note: note || "" });
    return [
      e(0, "Business Strategy Development Test", "09:00", "09:30", "blue", "Bring your notes."),
      e(2, "Financial Analysis Presentation", "14:00", "16:00", "pink"),
      e(2, "UX Research Study Group", "19:00", "20:00", "blue"),
      e(5, "Organizational Behavior Quiz", "11:00", "12:30", "yellow"),
      e(9, "Front-End Code Review", "10:00", "11:00", "green"),
      e(14, "Copywriting Workshop", "13:00", "15:00", "yellow"),
      e(-3, "Leadership Essay Deadline", "17:00", "17:30", "pink"),
    ];
  };
  let events;
  try { events = JSON.parse(localStorage.getItem(KEY)); } catch (e) { events = null; }
  if (!Array.isArray(events)) events = seed();
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(events)); } catch (e) { /* abaikan */ } };

  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  let sel = key(today);
  let mode = "month";
  const byDay = (k) => events.filter((e) => e.date === k).sort((a, b) => a.start.localeCompare(b.start));
  const time = (e) => `${e.start} - ${e.end}`;

  /* ---------- Kalender ---------- */
  function weekStart(k) { const d = parse(k); return addDays(d, -d.getDay()); }

  function draw() {
    let cells = [], title;
    if (mode === "month") {
      const y = view.getFullYear(), m = view.getMonth();
      title = view.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const first = new Date(y, m, 1);
      const start = addDays(first, -first.getDay());
      const rows = Math.ceil((first.getDay() + new Date(y, m + 1, 0).getDate()) / 7);
      for (let i = 0; i < rows * 7; i++) cells.push({ d: addDays(start, i), out: addDays(start, i).getMonth() !== m });
    } else {
      const s = weekStart(sel);
      const e = addDays(s, 6);
      title = `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
      for (let i = 0; i < 7; i++) cells.push({ d: addDays(s, i), out: false });
    }
    $("#calTitle").textContent = title;
    const max = mode === "month" ? 2 : 6;
    $("#calGrid").className = "cal-full " + mode;
    $("#calGrid").innerHTML =
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<div class="cal-dow">${d}</div>`).join("") +
      cells.map(({ d, out }) => {
        const k = key(d), list = byDay(k);
        return `<div class="cal-cell ${out ? "out" : ""} ${k === key(today) ? "today" : ""} ${k === sel ? "sel" : ""}" data-day="${k}" role="button" tabindex="0" aria-label="${d.toDateString()}, ${list.length} events">
          <span class="cal-num">${d.getDate()}</span>
          ${list.slice(0, max).map((e) => `<span class="cal-pill ${e.tone}" data-ev="${e.id}" title="${esc(e.title)}"><b>${e.start}</b> ${esc(e.title)}</span>`).join("")}
          ${list.length > max ? `<span class="cal-more">+${list.length - max} more</span>` : ""}</div>`;
      }).join("");
    drawSide();
  }

  function drawSide() {
    const d = parse(sel);
    $("#dayTitle").textContent = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const list = byDay(sel);
    $("#dayList").innerHTML = list.length
      ? list.map((e) => `<button type="button" class="ev-item ${e.tone}" data-ev="${e.id}"><span class="ev-bar"></span><span><b>${esc(e.title)}</b><small>${time(e)}${e.note ? " · " + esc(e.note) : ""}</small></span><i class="bi bi-pencil ms-auto"></i></button>`).join("")
      : `<div class="lz-empty py-4"><i class="bi bi-calendar-plus"></i>Nothing planned for this day.<div class="mt-2"><button class="btn btn-soft btn-sm" data-add>Add event</button></div></div>`;
    const upcoming = events.filter((e) => e.date >= key(today)).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start)).slice(0, 5);
    $("#upcoming").innerHTML = upcoming.length
      ? upcoming.map((e) => `<button type="button" class="ev-item ${e.tone}" data-ev="${e.id}"><span class="ev-bar"></span><span><b>${esc(e.title)}</b><small>${parse(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${time(e)}</small></span></button>`).join("")
      : `<div class="text-muted small">No upcoming events.</div>`;
  }

  /* ---------- Navigasi & mode ---------- */
  function move(n) {
    if (mode === "month") { view = new Date(view.getFullYear(), view.getMonth() + n, 1); sel = key(view.getMonth() === today.getMonth() && view.getFullYear() === today.getFullYear() ? today : view); }
    else { sel = key(addDays(parse(sel), n * 7)); view = new Date(parse(sel).getFullYear(), parse(sel).getMonth(), 1); }
    draw();
  }
  $("#prev").addEventListener("click", () => move(-1));
  $("#next").addEventListener("click", () => move(1));
  $("#todayBtn").addEventListener("click", () => { sel = key(today); view = new Date(today.getFullYear(), today.getMonth(), 1); draw(); });
  document.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach((x) => { const on = x === b; x.classList.toggle("active", on); x.setAttribute("aria-pressed", on); });
    draw();
  }));

  /* ---------- Modal event ---------- */
  const modalEl = $("#evModal");
  const modal = new bootstrap.Modal(modalEl);
  const f = $("#evForm");
  const F = f.elements; // hindari konflik form.title (atribut HTML)
  let editing = null;

  function openModal(ev, dateKey) {
    editing = ev || null;
    f.classList.remove("was-validated");
    $("#evModalTitle").textContent = ev ? "Edit event" : "Add event";
    $("#evDelete").classList.toggle("d-none", !ev);
    F.title.value = ev ? ev.title : "";
    F.date.value = ev ? ev.date : dateKey || sel;
    F.start.value = ev ? ev.start : "09:00";
    F.end.value = ev ? ev.end : "10:00";
    F.note.value = ev ? ev.note : "";
    (f.querySelector(`input[name=tone][value=${ev ? ev.tone : "blue"}]`) || F.tone[0]).checked = true;
    F.end.setCustomValidity("");
    modal.show();
  }
  modalEl.addEventListener("shown.bs.modal", () => F.title.focus());

  f.addEventListener("submit", (e) => {
    e.preventDefault();
    F.end.setCustomValidity(F.end.value <= F.start.value ? "End time must be after start time." : "");
    $("#endError").textContent = F.end.validationMessage || "Choose an end time.";
    f.classList.add("was-validated");
    if (!f.checkValidity()) return;
    const data = { title: F.title.value.trim(), date: F.date.value, start: F.start.value, end: F.end.value, tone: F.tone.value, note: F.note.value.trim() };
    if (editing) Object.assign(editing, data);
    else events.push({ id: Math.random().toString(36).slice(2, 9), ...data });
    persist();
    sel = data.date;
    view = new Date(parse(sel).getFullYear(), parse(sel).getMonth(), 1);
    modal.hide();
    draw();
    Lz.toast(editing ? "Event updated." : "Event added.", "success", { delay: 2000 });
  });
  F.end.addEventListener("input", () => F.end.setCustomValidity(""));
  $("#evDelete").addEventListener("click", () => {
    events = events.filter((e) => e !== editing);
    persist(); modal.hide(); draw();
    Lz.toast("Event deleted.", "info", { delay: 2000 });
  });

  /* ---------- Klik ---------- */
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-add]")) return openModal(null, sel);
    const ev = e.target.closest("[data-ev]");
    if (ev) { const obj = events.find((x) => x.id === ev.dataset.ev); if (obj) return openModal(obj); }
    const cell = e.target.closest("[data-day]");
    if (cell) { sel = cell.dataset.day; const d = parse(sel); if (d.getMonth() !== view.getMonth()) view = new Date(d.getFullYear(), d.getMonth(), 1); draw(); }
  });
  $("#calGrid").addEventListener("keydown", (e) => {
    const cell = e.target.closest("[data-day]");
    if (cell && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); sel = cell.dataset.day; draw(); $("#calGrid").querySelector(".sel")?.focus(); }
  });
  $("#calGrid").addEventListener("dblclick", (e) => { const c = e.target.closest("[data-day]"); if (c && !e.target.closest("[data-ev]")) openModal(null, c.dataset.day); });

  draw();
})();
