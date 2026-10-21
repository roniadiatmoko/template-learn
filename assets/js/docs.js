/* Dokumentasi komponen: setiap .doc-example otomatis mendapat tab Preview/Code dan tombol Copy.
   Kode diambil dari markup preview itu sendiri; untuk contoh JS gunakan <script type="text/plain" class="doc-code" data-lang="js">. */
(function () {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function dedent(str, fixFirst) {
    const lines = str.replace(/\t/g, "  ").split("\n");
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    /* innerHTML dimulai tepat setelah tag pembungkus, jadi baris pertama tidak menjorok:
       samakan dengan indentasi baris penutup agar blok kode rata kiri */
    const lead = (l) => l.match(/^ */)[0].length;
    if (fixFirst && lines.length > 1 && lead(lines[0]) === 0) {
      const last = lines[lines.length - 1];
      const rest = Math.min(...lines.slice(1).filter((l) => l.trim()).map(lead));
      lines[0] = " ".repeat(/^\s*<\//.test(last) ? lead(last) : rest) + lines[0];
    }
    const ind = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
    return lines.map((l) => l.slice(ind)).join("\n");
  }

  /* Highlighter kecil (cukup untuk dokumentasi ini) */
  function hlHtml(code) {
    return esc(code)
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="c">$1</span>')
      .replace(/(&lt;\/?)([a-zA-Z][\w-]*)([\s\S]*?)(\/?&gt;)/g, (m, a, tag, attrs, b) => {
        attrs = attrs.replace(/([\w:@.-]+)(=)("[^"]*")/g, '<span class="a">$1</span>$2<span class="s">$3</span>');
        return `<span class="p">${a}</span><span class="t">${tag}</span>${attrs}<span class="p">${b}</span>`;
      });
  }
  function hlCode(code, lang) {
    const re = lang === "css"
      ? /(\/\*[\s\S]*?\*\/)|("[^"\n]*"|'[^'\n]*')|(--[\w-]+)/g
      : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("[^"\n]*"|'[^'\n]*'|`[^`]*`)|\b(const|let|function|return|new|await|async|if|else)\b/g;
    let out = "", last = 0, m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      const cls = m[1] ? "c" : m[2] ? "s" : lang === "css" ? "v" : "k";
      out += `<span class="${cls}">${esc(m[0])}</span>`;
      last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
  }

  let uid = 0;
  document.querySelectorAll(".doc-example").forEach((ex) => {
    const preview = ex.querySelector(".doc-preview");
    const explicit = ex.querySelector("script.doc-code");
    const lang = (explicit && explicit.dataset.lang) || "html";
    const code = dedent(explicit ? explicit.textContent.split("<\\/script>").join("</script>") : preview.innerHTML, !explicit);
    if (explicit) explicit.remove();

    const id = "doc-code-" + ++uid;
    const bar = document.createElement("div");
    bar.className = "doc-bar";
    bar.innerHTML = `<button type="button" class="doc-tab active" data-t="preview" aria-pressed="true">Preview</button>
      <button type="button" class="doc-tab" data-t="code" aria-pressed="false" aria-controls="${id}">${lang === "html" ? "HTML" : lang.toUpperCase()}</button>
      <button type="button" class="doc-copy" aria-label="Copy code"><i class="bi bi-clipboard"></i><span>Copy</span></button>`;
    const panel = document.createElement("div");
    panel.className = "doc-code-panel";
    panel.id = id;
    panel.hidden = true;
    panel.innerHTML = `<pre><code>${lang === "html" ? hlHtml(code) : hlCode(code, lang)}</code></pre>`;
    ex.insertBefore(bar, preview);
    ex.appendChild(panel);

    bar.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-t]");
      if (tab) {
        const showCode = tab.dataset.t === "code";
        preview.hidden = showCode;
        panel.hidden = !showCode;
        bar.querySelectorAll("[data-t]").forEach((b) => { const on = b === tab; b.classList.toggle("active", on); b.setAttribute("aria-pressed", on); });
        return;
      }
      const copy = e.target.closest(".doc-copy");
      if (!copy) return;
      const done = () => {
        copy.classList.add("done");
        copy.querySelector("span").textContent = "Copied";
        copy.querySelector("i").className = "bi bi-check2";
        setTimeout(() => { copy.classList.remove("done"); copy.querySelector("span").textContent = "Copy"; copy.querySelector("i").className = "bi bi-clipboard"; }, 1600);
      };
      const fallback = () => {
        const t = document.createElement("textarea");
        t.value = code; t.style.position = "fixed"; t.style.opacity = "0";
        document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); done(); } catch (err) { Lz.toast("Could not copy. Select the code and copy it manually.", "danger"); }
        t.remove();
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(code).then(done, fallback); else fallback();
    });
  });

  /* ---------- Setelah kode diambil: aktifkan widget pada preview ---------- */
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el));
  document.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => new bootstrap.Popover(el));

  document.querySelectorAll("[data-demo-toast]").forEach((b) => b.addEventListener("click", () => {
    const t = b.dataset.demoToast;
    const msg = { success: "Tugas berhasil dikirim.", danger: "Gagal menyimpan. Periksa koneksi, lalu coba lagi.", warning: "Tenggat tugas tinggal 2 hari.", info: "Kelas baru tersedia untuk Anda." }[t];
    Lz.toast(msg, t, { title: t === "success" ? "Terkirim" : undefined });
  }));

  const chartEls = document.querySelectorAll("[data-demo-chart]");
  if (window.Chart) chartEls.forEach((c) => {
    const kind = c.dataset.demoChart, P = Lz.palette;
    if (kind === "donut") Lz.charts.donut(c, [43, 32, 25], [P.primary, P.pink, P.yellow]);
    if (kind === "ring") Lz.charts.ring(c, 72);
    if (kind === "bar") Lz.charts.bar(c, ["Mon", "Tue", "Wed", "Thu", "Fri"], [{ data: [3, 5, 4, 6, 2], backgroundColor: P.primary }], { max: 8 });
    if (kind === "line") Lz.charts.line(c, ["Mon", "Tue", "Wed", "Thu", "Fri"], [{ data: [2, 4, 3, 5, 4], borderColor: P.primary }]);
  });

  /* Demo formulir: tampil/sembunyi password, indikator kekuatan, validasi, reset */
  const pwInput = document.getElementById("df-pw");
  if (pwInput) {
    const tg = pwInput.parentElement.querySelector(".pw-toggle");
    tg.addEventListener("click", () => {
      const show = pwInput.type === "password";
      pwInput.type = show ? "text" : "password";
      tg.setAttribute("aria-pressed", show);
      tg.setAttribute("aria-label", show ? "Hide password" : "Show password");
      tg.firstElementChild.className = "bi " + (show ? "bi-eye-slash" : "bi-eye");
    });
    pwInput.addEventListener("input", () => {
      const v = pwInput.value;
      let s = 0;
      if (v.length >= 8) s++;
      if (v.length >= 12) s++;
      if (/[A-Za-z]/.test(v) && /\d/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      const m = document.getElementById("df-meter");
      m.style.width = (v ? Math.max(1, s) * 25 : 0) + "%";
      m.className = "progress-bar " + (s <= 1 ? "bg-danger" : s === 2 ? "bg-warning" : "bg-success");
      document.getElementById("df-hint").textContent = v ? ["Weak. Add more characters.", "Weak. Add more characters.", "Fair. Add numbers or symbols.", "Good.", "Strong."][s] : "Use 8 or more characters with letters and numbers.";
    });
  }
  const demoForm = document.getElementById("df-form");
  if (demoForm) {
    demoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      demoForm.classList.add("was-validated");
      const bad = demoForm.querySelector(":invalid");
      if (bad) { bad.focus(); return; }
      Lz.toast("Profile saved.", "success", { title: "Saved" });
    });
    demoForm.addEventListener("reset", () => demoForm.classList.remove("was-validated"));
  }

  /* Pemilih tema untuk melihat preview terang/gelap */
  document.querySelectorAll("[data-set-theme]").forEach((b) => b.addEventListener("click", () => {
    Lz.theme.set(b.dataset.setTheme);
    document.querySelectorAll("[data-set-theme]").forEach((x) => x.setAttribute("aria-pressed", x === b));
  }));

  /* ---------- Daftar isi + penanda bagian aktif ---------- */
  const sections = [...document.querySelectorAll(".doc-section[id]")];
  const toc = document.getElementById("toc");
  if (toc) {
    toc.innerHTML = sections.map((s) => `<a href="#${s.id}">${s.querySelector("h2").textContent}</a>`).join("");
    const links = [...toc.querySelectorAll("a")];
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
        });
      }, { rootMargin: "-10% 0px -80% 0px" });
      sections.forEach((s) => io.observe(s));
    }
  }
})();
