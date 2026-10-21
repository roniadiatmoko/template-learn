/* Halaman contoh (menu Pages): FAQ, Pricing, Invoice, Profile. Setiap blok hanya berjalan jika elemennya ada di halaman. */
(function () {
  const D = window.LzData || {};
  const $ = (s) => document.querySelector(s);
  const read = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  const fmt = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const profile = Object.assign({ name: (D.user || {}).name || "Gareth Christopher", username: ((D.user || {}).username || "@christopher").replace("@", ""), email: "gareth@example.com", bio: "" }, read("lz.profile", {}));
  const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  /* ---------- FAQ: cari + filter kategori ---------- */
  if ($("[data-faq]")) {
    const items = Array.from(document.querySelectorAll("[data-faq] .accordion-item"));
    const search = $("#faqSearch"), empty = $("#faqEmpty"), status = $("#faqCount");
    let cat = "all";
    function draw() {
      const q = search.value.trim().toLowerCase();
      let n = 0;
      items.forEach((it) => {
        const ok = (cat === "all" || it.dataset.cat === cat) && it.textContent.toLowerCase().includes(q);
        it.hidden = !ok;
        if (ok) n++;
      });
      empty.hidden = n > 0;
      status.textContent = `${n} question${n === 1 ? "" : "s"} shown`;
    }
    search.addEventListener("input", draw);
    document.querySelectorAll("[data-faq-cat]").forEach((b) => b.addEventListener("click", () => {
      cat = b.dataset.faqCat;
      document.querySelectorAll("[data-faq-cat]").forEach((x) => { const on = x === b; x.classList.toggle("active", on); x.setAttribute("aria-pressed", on); });
      draw();
    }));
    draw();
  }

  /* ---------- Pricing: tagihan bulanan / tahunan ---------- */
  const billing = $("#billing");
  if (billing) {
    const draw = () => {
      const yearly = billing.checked;
      document.querySelectorAll(".price-amt").forEach((el) => { el.textContent = fmt(Number(el.dataset[yearly ? "year" : "month"])); });
      document.querySelectorAll(".price-per").forEach((el) => { el.textContent = yearly ? "per year" : "per month"; });
      $("#billMonthly").classList.toggle("fw-bold", !yearly);
      $("#billYearly").classList.toggle("fw-bold", yearly);
    };
    billing.addEventListener("change", draw);
    draw();
    document.querySelectorAll("[data-choose-plan]").forEach((b) => b.addEventListener("click", () => Lz.toast(`You chose the ${b.dataset.choosePlan} plan. Connect this button to your checkout.`, "success", { title: "Plan selected" })));
  }

  /* ---------- Invoice ---------- */
  if ($("#invoice")) {
    const day = (off) => new Date(Date.now() + off * 864e5).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    $("#invIssue").textContent = day(0);
    $("#invDue").textContent = day(14);
    $("#invTo").textContent = profile.name;
    $("#invToMail").textContent = profile.email;
    let sub = 0;
    document.querySelectorAll("#invItems tr").forEach((tr) => {
      const t = Number(tr.dataset.qty) * Number(tr.dataset.price);
      sub += t;
      tr.querySelector(".inv-line").textContent = fmt(t);
      tr.querySelector(".inv-price").textContent = fmt(Number(tr.dataset.price));
    });
    const tax = sub * 0.11;
    $("#invSub").textContent = fmt(sub);
    $("#invTax").textContent = fmt(tax);
    $("#invTotal").textContent = fmt(sub + tax);
    $("#invPrint").addEventListener("click", () => window.print());
    $("#invSend").addEventListener("click", () => Lz.toast(`A copy of the invoice was sent to ${profile.email}.`, "success", { title: "Invoice sent" }));
  }

  /* ---------- Profil pengguna ---------- */
  if ($("#profName")) {
    $("#profAvatar").textContent = initials(profile.name);
    if (profile.avatar) { $("#profAvatar").style.backgroundImage = `url(${profile.avatar})`; $("#profAvatar").textContent = ""; }
    $("#profName").textContent = profile.name;
    $("#profHandle").textContent = "@" + profile.username;
    $("#profEmail").textContent = profile.email;
    $("#profBio").textContent = profile.bio || "Learning something new every day. Interested in design, front-end development, and writing clearly.";
    const courses = (D.courses || []).filter((c) => c.progress !== null);
    const doneIds = (c) => read("lz.done." + c.id, null);
    const isDone = (c) => { const d = doneIds(c); return d ? d.length >= c.lessons : c.progress === 100; };
    const hours = courses.reduce((a, c) => a + c.hours * (isDone(c) ? 1 : c.progress / 100), 0);
    $("#profStats").innerHTML = [
      ["Courses", courses.length], ["Certificates", courses.filter(isDone).length], ["Hours learned", Math.round(hours)], ["Rank", (D.user || {}).rank || "4th"],
    ].map(([k, v]) => `<div><b>${v}</b><span>${k}</span></div>`).join("");
    $("#profSkills").innerHTML = (D.categories || []).map((c) => `<span class="lz-chip"><i class="bi bi-circle-fill" style="color:${c.color};font-size:.55rem"></i>${esc(c.label)}</span>`).join("");
    $("#profCourses").innerHTML = courses.map((c) => {
      const pct = isDone(c) ? 100 : c.progress;
      return `<a class="prof-course" href="class.html?course=${c.id}"><span class="lz-icon-box ${c.tone === "blue" ? "" : c.tone}"><i class="bi ${c.icon}"></i></span>
        <span class="flex-grow-1"><b>${esc(c.title)}</b><small>${esc(c.instructor)}</small><span class="progress mt-2"><span class="progress-bar ${pct === 100 ? "bg-success" : ""}" style="width:${pct}%"></span></span></span><span class="fw-bold small">${pct}%</span></a>`;
    }).join("");
    $("#profActivity").innerHTML = (D.activities || []).map((a) => `<div class="tl-item"><div class="tl-dot ${a.tone}"><i class="bi ${a.icon}"></i></div><div>${a.html}<small>${a.time}</small></div></div>`).join("");
    const edit = $("#profEdit");
    if (edit) edit.addEventListener("click", () => { location.href = "settings.html"; });
  }
})();
