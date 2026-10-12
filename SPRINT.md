# SPRINT — Learnzie Admin Theme (Bootstrap 5)

Tema admin dashboard e-learning berbasis **HTML + CSS + JS + Bootstrap 5**, mengikuti referensi desain
Dribbble "E-Learning Admin Dashboard" (brand *Learnzie*). Tanpa build step: semua dependensi lewat CDN.

**Legenda status:** `DONE` selesai · `IN PROGRESS` sedang dikerjakan · `TODO` belum dimulai · `BLOCKED` tertahan

**Ringkasan progres**

| Sprint | Fokus | Status |
|---|---|---|
| 1 | Fondasi: struktur proyek, design tokens, layout shell | DONE |
| 2 | Halaman Dashboard (semua widget sesuai referensi) | DONE |
| 3 | Re-styling seluruh komponen Bootstrap 5 + komponen tambahan | DONE |
| 4 | Halaman Courses, Explore, Class | DONE |
| 5 | Halaman Schedule, Analytics, Certificate, Settings | DONE |
| 6 | Responsif, aksesibilitas, dark mode, QA, dokumentasi | DONE |

---

## Struktur proyek

```
frontend-university/
├─ index.html                  # Dashboard
├─ pages/components.html       # Katalog komponen
├─ pages/                      # Halaman lain (Sprint 4–5)
├─ assets/
│  ├─ css/theme.css            # Design tokens + layout shell + widget dashboard
│  ├─ css/bootstrap-skin.css   # Re-style SEMUA komponen Bootstrap 5 + komponen tambahan
│  ├─ js/layout.js             # Render sidebar, header, panel kanan (shared)
│  ├─ css/courses.css          # Kartu course, toolbar, chips
│  ├─ js/courses.js            # Explore + My Courses
│  ├─ js/lz.js                 # Helper: Lz.toast, Lz.table, Lz.charts
│  ├─ js/dashboard.js          # Chart + render widget dashboard
│  ├─ js/data/mock.js          # Data dummy
│  └─ img/
└─ SPRINT.md
```

## Design tokens (hasil analisis referensi)

| Token | Nilai | Pemakaian |
|---|---|---|
| `--lz-primary` | `#0F6FDE` | banner, tombol, menu aktif, series utama |
| `--lz-primary-soft` | `#E8F0FE` | latar ikon, menu aktif, kartu promo |
| `--lz-pink` | `#FBB6E6` | aksen kategori ke-2 |
| `--lz-yellow` | `#FFC93C` | aksen kategori ke-3 |
| `--lz-bg` | `#F5F7FA` | latar halaman |
| `--lz-surface` | `#FFFFFF` | kartu |
| `--lz-text` / `--lz-muted` | `#0B1220` / `#8A94A6` | teks utama / sekunder |
| Radius | kartu 16px, tombol/badge 8px | — |
| Font | Urbanist | seluruh UI |

---

## SPRINT 1 — Fondasi & Layout Shell · `DONE`

| No | Task | Status |
|---|---|---|
| 1.1 | Setup struktur folder & dependensi CDN | DONE |
| 1.2 | Design tokens & override Bootstrap | DONE |
| 1.3 | Layout shell 3 kolom (sidebar, konten, panel kanan) | DONE |
| 1.4 | Sidebar & header reusable via JS | DONE |
| 1.5 | Revisi 1: warna hover sidebar, header, footer | DONE |
| 1.6 | Menu "Components" di sidebar | DONE |

**1.1 Setup struktur folder & dependensi CDN** — `DONE`
- [x] Buat folder `assets/css`, `assets/js`, `assets/js/data`, `assets/img`, `pages`
- [x] Muat Bootstrap 5.3.3 (CSS + bundle JS) dari CDN
- [x] Muat Bootstrap Icons 1.11 (ikon outline sesuai referensi)
- [x] Muat font Urbanist (Google Fonts) dan Chart.js 4.4 untuk grafik

**1.2 Design tokens & override Bootstrap** — `DONE`
- [x] Definisikan CSS variables `--lz-*` di `:root` (warna, radius, spasi, font)
- [x] Override variabel Bootstrap (`--bs-primary`, `--bs-body-font-family`, `--bs-body-bg`, dst.)
- [x] Override `.btn-primary`, `.btn-light`, `.form-control`, `.form-select`, `.badge`, `.progress`
- [x] Pastikan kartu tanpa bayangan berat (pembeda lewat warna latar)

**1.3 Layout shell 3 kolom** — `DONE`
- [x] CSS Grid `sidebar | main | right-panel` (250px / 1fr / 320px)
- [x] Panel kanan disembunyikan di bawah breakpoint `xl`
- [x] Sidebar menjadi offcanvas di bawah breakpoint `lg` (tombol hamburger di header)

**1.4 Sidebar & header reusable via JS** — `DONE`
- [x] `layout.js` merender logo + 8 menu (Dashboard, Explore, Courses, Schedule, Analytics, Class, Certificate, Settings)
- [x] Menu aktif otomatis dari atribut `data-page` pada `<body>`
- [x] Kartu promo "Learnzie 4.0" di dasar sidebar
- [x] Header: judul + tanggal dinamis, tombol chat & notifikasi (dengan indikator)

**1.5 Revisi 1: hover layout** — `DONE`
- [x] Menu sidebar: hover berlatar biru muda (`--lz-hover`) dengan teks biru; item aktif memakai warna yang lebih pekat saat hover
- [x] Tombol ikon header, logo, tautan footer, dan tombol "Try Free Trial" punya state hover
- [x] Token baru `--lz-hover` (terang dan gelap)

**1.6 Menu Components** — `DONE`
- [x] Item ke-9 di sidebar (ikon puzzle) menuju `pages/components.html`, ditambahkan lewat array `MENU` di `layout.js`

---

## SPRINT 2 — Halaman Dashboard · `DONE`

| No | Task | Status |
|---|---|---|
| 2.1 | Banner sambutan | DONE |
| 2.2 | Kartu Performance (ring skill points) | DONE |
| 2.3 | Kartu statistik (3 kartu) | DONE |
| 2.4 | Learning Activity (stacked bar chart) | DONE |
| 2.5 | My Progress (donut chart + legenda) | DONE |
| 2.6 | Daftar Assignments | DONE |
| 2.7 | Panel kanan: profil, kalender, My Schedule, Recent Activities | DONE |
| 2.8 | Footer | DONE |
| 2.9 | Revisi 1: hover widget dashboard | DONE |
| 2.10 | Revisi 2: judul banner "Hello, Gareth!" berwarna putih | DONE |

**2.1 Banner sambutan** — `DONE`
- [x] Kartu biru, sapaan "Hello, {nama}!", teks, tombol putih "Explore More Courses"
- [x] Ilustrasi SVG inline (placeholder, dapat diganti aset ilustrasi asli)

**2.2 Kartu Performance** — `DONE`
- [x] Doughnut Chart.js sebagai ring progress, angka Skill Points di tengah
- [x] Teks "4th in leaderboard" dengan ikon medali

**2.3 Kartu statistik** — `DONE`
- [x] Active Tasks, Completed Tasks, Rank Score (ikon di lingkaran biru muda)
- [x] Data dari `mock.js`

**2.4 Learning Activity** — `DONE`
- [x] Stacked bar Sun–Sat, 3 series (UX Design, Front-End, Copywriting), sudut bar membulat
- [x] Dropdown periode (Last Week / This Week / Last Month) yang mengganti dataset
- [x] Legenda kustom di atas chart, gridline tipis putus-putus

**2.5 My Progress** — `DONE`
- [x] Doughnut 3 segmen dengan ujung membulat, total tasks di tengah
- [x] Legenda dengan persentase di sisi kanan

**2.6 Daftar Assignments** — `DONE`
- [x] Baris kartu: ikon, judul + course, due date, badge status, progress bar, jumlah lampiran/komentar
- [x] Pencarian teks dan filter status (All / In Progress / Not Started / Completed) berfungsi

**2.7 Panel kanan** — `DONE`
- [x] Profil (avatar inisial, nama, username, tombol filter)
- [x] Kalender bulanan dengan navigasi bulan, hari ini terpilih, penanda event
- [x] My Schedule: kartu dengan badge tanggal berwarna
- [x] Recent Activities: timeline vertikal dengan ikon bulat berwarna

**2.8 Footer** — `DONE`
- [x] Copyright + tautan Privacy Policy, Terms and conditions, Contact

**2.9 Revisi 1: hover widget dashboard** — `DONE`
- [x] Baris Assignments, kartu My Schedule, hari di kalender mini, tombol "..." dan "+", navigasi kalender, ikon kartu statistik

**2.10 Revisi 2: warna judul banner** — `DONE`
- [x] Judul `<h2>` di banner biru tadinya hitam karena mengikuti warna heading Bootstrap; sekarang `color: #fff` (`.hero h2`)

---

## SPRINT 3 — Re-styling Seluruh Komponen Bootstrap 5 · `DONE`

Tujuan: **semua** komponen Bootstrap 5 tampil dengan gaya Learnzie. Komponen yang tidak ada di Bootstrap dibuat
sebagai CSS baru. Seluruh skin ada di `assets/css/bootstrap-skin.css` (memakai CSS variables Bootstrap 5.3, tanpa mengubah file Bootstrap).
Arahan visual mengikuti referensi desain (skill `frontend-design`: keputusan visual dari brief, radius dan warna konsisten,
fokus keyboard terlihat, gerak hanya sebagai respons aksi, `prefers-reduced-motion` dihormati).

| No | Task | Status |
|---|---|---|
| 3.1 | Buttons (semua varian, ukuran, group, close) | DONE |
| 3.2 | Forms (input, select, check, switch, range, file, group, floating, validasi) | DONE |
| 3.3 | Tabel & list group | DONE |
| 3.4 | Badge, alert, progress, spinner, placeholder | DONE |
| 3.5 | Overlay: modal, offcanvas, dropdown, popover, tooltip, toast | DONE |
| 3.6 | Navigasi: nav/tabs/pills, navbar, breadcrumb, pagination | DONE |
| 3.7 | Card, accordion, carousel, tipografi | DONE |
| 3.8 | Komponen tambahan (bukan bawaan Bootstrap) | DONE |
| 3.9 | Halaman katalog `pages/components.html` | DONE |
| 3.10 | Helper JS: `Lz.toast()`, tabel sortable/searchable, chart helper | DONE |
| 3.11 | QA visual tiap komponen (hover/focus/disabled, mobile) | DONE |
| 3.12 | Revisi 1: warna hover seluruh komponen Bootstrap | DONE |
| 3.13 | Revisi 2: hapus underline saat hover | DONE |
| 3.14 | Revisi 3: efek ripple saat diklik | DONE |
| 3.15 | Dokumentasi komponen interaktif (menu Components) | DONE |

**3.1 Buttons** — `DONE`
- [x] primary, secondary, success, danger, warning, info, light, dark, link + varian outline
- [x] ukuran sm/lg, disabled, loading (spinner), button group, radio toggle group
- [x] `btn-soft`, `btn-icon` (+ indikator `dot`), `btn-close` (tambahan)

**3.2 Forms** — `DONE`
- [x] input, select, textarea, file, color, range, floating label, input group
- [x] checkbox, radio, switch; state focus (ring biru lembut), invalid/valid, disabled

**3.3 Tabel & list group** — `DONE`
- [x] header muted, hover biru muda, `table-light/dark`, wrapper `.lz-table`
- [x] list group aktif/action/badge

**3.4 Badge, alert, progress, spinner, placeholder** — `DONE`
- [x] badge solid + `badge-soft-*`; alert bergaris kiri 8 warna, dismissible
- [x] progress tipis (+ `progress-lg`), spinner, placeholder glow

**3.5 Overlay** — `DONE`
- [x] modal (radius 20, backdrop gelap), offcanvas, dropdown, popover, tooltip, toast

**3.6 Navigasi** — `DONE`
- [x] tabs bergaris bawah, pills soft, navbar, breadcrumb (separator ikon), pagination

**3.7 Card, accordion, carousel, tipografi** — `DONE`
- [x] card tanpa border, accordion berupa kartu terpisah, carousel indikator pil, blockquote/code/kbd/mark

**3.8 Komponen tambahan** — `DONE`
- [x] avatar (+group), chip, icon-box (4 warna), steps, empty state, indikator delta statistik

**3.9 Katalog komponen** — `DONE`
- [x] `pages/components.html` menampilkan seluruh komponen di atas, termasuk demo modal/offcanvas/toast/tooltip/popover

**3.10 Helper JS** — `DONE` (`assets/js/lz.js`)
- [x] `Lz.toast(pesan, tipe, {title, delay})` wrapper Bootstrap Toast (success/danger/warning/info)
- [x] `Lz.table()` / `[data-lz-table]`: sorting (klik/keyboard, `aria-sort`), pencarian, pagination; diuji di Chrome
- [x] `Lz.charts` (`ring`, `donut`, `bar`, `line`, `axis`) + `Lz.palette`; dashboard sudah memakainya

**3.11 QA visual** — `DONE`
- [x] Dashboard dicek di 390 / 768 / 1024 / 1600px; katalog di 390 dan 1400px
- [x] Sidebar offcanvas, modal, dropdown, tooltip, popover, dan focus input dicek di 390px
- [x] Perbaikan: dropdown kecil dashboard; layout katalog di mobile (`.app-shell.no-right`);
      hero/performance dan grafik pindah ke breakpoint `lg` (kartu Performance tidak lagi melebar di 1024px);
      font grafik memakai Urbanist; latar modal/offcanvas/dropdown/popover putih; spinner di dalam tombol terlihat;
      latar input saat focus putih
- [ ] Belum diuji: hover tiap komponen secara interaktif dan pembaca layar (masuk Sprint 6.3)

**3.12 Revisi 1: warna hover** — `DONE`
- [x] Tombol (bayangan lembut pada primary/success/danger, link berlatar hover), input/select/check (border biru saat hover)
- [x] Pills, tabs, navbar, accordion, list group, dropdown, pagination, chip, tabel, tombol close, breadcrumb
- [x] Semua memakai token `--lz-hover` / `--lz-primary-ink` sehingga ikut berubah di mode gelap

**3.13 Revisi 2: tanpa underline** — `DONE`
- [x] Tautan tidak pernah bergaris bawah (normal, hover, fokus); pembeda hover lewat warna. `--bs-link-decoration` dan `--bs-link-hover-decoration` juga dinolkan

**3.14 Revisi 3: ripple** — `DONE`
- [x] Satu listener `pointerdown` di `lz.js` untuk tombol, menu sidebar, tabs/pills, pagination, dropdown, chip, accordion, daftar materi, event kalender, tombol ikon, dll. Titik ripple mengikuti posisi klik, warnanya `currentColor` (cocok terang/gelap)
- [x] Dilewati jika `prefers-reduced-motion`, elemen disabled, atau atribut `data-no-ripple`
- [x] Elemen yang belum posisi `relative` otomatis diberi `position: relative` dan `overflow: hidden`

**3.15 Dokumentasi komponen** — `DONE` (`pages/components.html`, `assets/js/docs.js`, `assets/css/docs.css`)
- [x] Menggantikan katalog lama: 15 bagian (Getting started, Design tokens, Typography, Buttons, Forms, Badges & alerts, Progress, Cards & widgets, Navigation, Accordion & list group, Tables, Overlays, Learnzie additions, Charts, Theme/ripple/hover) dengan daftar isi "On this page" yang menandai bagian aktif
- [x] Setiap contoh punya tab **Preview** dan **HTML/JS/CSS** serta tombol **Copy**; kode HTML diambil otomatis dari markup preview (selalu sinkron), contoh JS/CSS memakai `<script type="text/plain" class="doc-code" data-lang="js">`
- [x] Penjelasan cara pakai di tiap bagian: kelas yang ditambahkan, atribut `data-*`, API `Lz.toast`, `Lz.charts`, `Lz.table`, `Lz.theme`, dan cara menambah menu
- [x] Pemilih Light/Dark di atas halaman untuk melihat preview di kedua tema
- [x] Diuji di Chrome: 43 contoh, kode ter-dedent rapi, tab dan daftar isi berfungsi tanpa error JS

---

## SPRINT 4 — Courses, Explore, Class · `DONE`

| No | Task | Status |
|---|---|---|
| 4.1 | Explore: grid katalog course + filter kategori | DONE |
| 4.2 | Courses: daftar course milik user (progress, lanjutkan belajar) | DONE |
| 4.3 | Detail course: kurikulum (accordion), instruktur, ulasan | DONE |
| 4.4 | Class: daftar kelas + ruang kelas (video player, daftar materi) | DONE |
| 4.5 | Revisi 1: hover kartu course dan ruang kelas | DONE |
| 4.6 | Revisi 2: judul hero detail course mengikuti warna hero | DONE |

**4.1 Explore** — `DONE` (`pages/explore.html`)
- [x] Kartu course: cover berwarna per kategori, badge kategori, bookmark, rating, jumlah materi, durasi, peserta, harga/Free
- [x] Filter kategori (chips), level, pencarian (judul/pengajar/kategori), urutan (populer, rating, terbaru, harga)
- [x] Pagination 9 per halaman, jumlah hasil (`aria-live`), empty state
- [x] Bookmark tersimpan di `localStorage` (kunci `lz.saved`) dan dipakai halaman Courses
**4.2 Courses** — `DONE` (`pages/courses.html`)
- [x] Tab In Progress / Completed / Saved dengan jumlah di badge, pencarian
- [x] Kartu dengan progress bar dan tombol "Continue learning" / "Review course"
- [x] Tab Saved ikut berubah saat bookmark dilepas
- Catatan: tautan "View course" menuju `pages/course-detail.html` dan "Continue learning" menuju `pages/class.html`; keduanya baru ada di 4.3 dan 4.4.
**4.3 Detail course** — `DONE` (`pages/course-detail.html?id=<n>`)
- [x] Hero course berwarna, breadcrumb, rating, peserta, pengajar
- [x] Tab Overview (deskripsi, hasil belajar, profil pengajar) / Curriculum (accordion modul + daftar materi bertipe video/reading/quiz) / Reviews
- [x] Kartu pendaftaran sticky: harga, "Enroll now" memunculkan toast lalu berubah jadi "Start learning"; status tersimpan di `localStorage` (`lz.enrolled`)
- [x] Course tidak ditemukan menampilkan empty state
- Data kurikulum/ulasan/pengajar dihasilkan dari `assets/js/data/curriculum.js`

**4.4 Class** — `DONE` (`pages/class.html`, `pages/class.html?course=<id>`)
- [x] Tanpa parameter: daftar kelas yang diikuti dengan progress dan tombol lanjut
- [x] Ruang kelas: area video placeholder 16:9, daftar materi per modul (accordion), materi aktif ditandai
- [x] Tandai selesai (toggle), Previous/Next, progress bar, toast saat course selesai; progres per course di `localStorage`
- [x] Tab Overview / Notes (catatan tersimpan lokal) / Discussion (komentar tersimpan lokal)
- [ ] Belum ada pemutar video sungguhan: tombol play hanya placeholder, ganti dengan `<video>` atau embed

**4.5 Revisi 1: hover course & kelas** — `DONE`
- [x] Kartu course terangkat sedikit dengan bayangan lembut (dimatikan jika reduced motion), tombol bookmark, daftar materi di ruang kelas, tombol play

**4.6 Revisi 2: judul hero detail course** — `DONE`
- [x] Judul di hero detail course memakai `color: inherit` agar putih di hero biru/hijau dan gelap di hero pink/kuning (sebelumnya selalu hitam)

---

## SPRINT 5 — Schedule, Analytics, Certificate, Settings · `DONE`

| No | Task | Status |
|---|---|---|
| 5.1 | Schedule: kalender penuh (bulan/minggu) + daftar event | DONE |
| 5.2 | Analytics: KPI, tren belajar, perbandingan kategori, top course | DONE |
| 5.3 | Certificate: galeri sertifikat, preview, cetak/PDF | DONE |
| 5.4 | Settings: profil, akun, notifikasi, tampilan | DONE |
| 5.5 | Revisi 1: hover kalender, event, pengaturan | DONE |

**5.1 Schedule** — `DONE` (`pages/schedule.html`, `assets/js/schedule.js`)
- [x] Kalender bulan dan minggu, navigasi, tombol Today, event berwarna (4 warna), "+n more"
- [x] Panel hari terpilih dan daftar Upcoming
- [x] Modal tambah / ubah / hapus event dengan validasi (judul, tanggal, jam selesai harus setelah jam mulai), disimpan di `localStorage`
- [x] Akses keyboard: sel hari bisa difokus dan dipilih dengan Enter/Space; double-click untuk menambah event
- [x] Tampilan mobile memadatkan event menjadi garis penanda; detail di panel di bawah kalender

**5.2 Analytics** — `DONE` (`pages/analytics.html`, `assets/js/analytics.js`)
- [x] Pilihan periode 7 / 30 / 90 hari; 4 KPI (waktu belajar + perubahan vs periode sebelumnya, materi selesai, rata-rata harian, streak)
- [x] Line chart tren, donut kategori, bar tugas per minggu, tabel Top courses (sort, pagination)
- [x] Data dummy deterministik (angka tidak berubah saat muat ulang)

**5.3 Certificate** — `DONE` (`pages/certificate.html`, `assets/js/certificate.js`)
- [x] Galeri: sertifikat terbuka untuk course yang selesai, terkunci (dengan progress) untuk yang belum
- [x] Status ikut berubah saat semua materi ditandai selesai di ruang kelas
- [x] Modal preview dengan nama dari profil; tombol cetak/simpan PDF memakai `window.print()` dengan gaya cetak khusus

**5.4 Settings** — `DONE` (`pages/settings.html`, `assets/js/settings.js`)
- [x] Profil: validasi form, upload foto dengan preview (cek tipe dan ukuran 2 MB), tersimpan lokal
- [x] Akun: ganti password dengan indikator kekuatan dan pengecekan konfirmasi (belum terhubung ke backend)
- [x] Notifikasi: 4 pengaturan dengan switch, tersimpan lokal
- [x] Tampilan: pilihan Light / Dark / System

**5.5 Revisi 1: hover Sprint 5** — `DONE`
- [x] Sel kalender, item event, menu Settings, opsi tema, label switch, pemilih warna event

---

## SPRINT 6 — Polishing & QA · `DONE`

| No | Task | Status |
|---|---|---|
| 6.1 | Responsif penuh (mobile, tablet, desktop lebar) | DONE |
| 6.2 | Dark mode (`data-bs-theme`) | DONE |
| 6.3 | Aksesibilitas | DONE |
| 6.4 | Performa | DONE |
| 6.5 | Dokumentasi penggunaan tema | DONE |

**6.1 Responsif** — `DONE`
- [x] Semua halaman dicek di 390px (satu kolom, sidebar jadi offcanvas); dashboard juga di 768 dan 1024px
- [ ] Belum diuji di perangkat fisik atau browser selain Chrome

**6.2 Dark mode** — `DONE`
- [x] Warna dipindah ke token (`--lz-text-2`, `--lz-surface-2`, `--lz-*-ink`, dst.), tema gelap hanya menimpa token
- [x] `theme-init.js` di `<head>` mencegah kedipan; opsi System mengikuti `prefers-color-scheme`
- [x] Chart membaca warna grid/tick dari CSS variables
- [x] Dicek visual: dashboard, schedule, katalog komponen (gelap)
- [ ] Halaman lain dalam mode gelap belum dicek satu per satu

**6.3 Aksesibilitas** — `DONE` (sebagian diuji otomatis, sebagian belum)
- [x] Skip link, landmark `main`/`nav`, `aria-current`, `aria-pressed`, `aria-live` untuk hasil, label pada tombol ikon
- [x] Fokus keyboard terlihat di semua kontrol; `prefers-reduced-motion` dihormati
- [x] Kontras teks sekunder dinaikkan (`--lz-muted` #667085, sedikit lebih gelap dari referensi)
- [ ] Belum diuji dengan pembaca layar

**6.4 Performa** — `DONE`
- [x] Chart.js hanya dimuat di halaman yang memakai grafik; font memakai `display=swap`; tanpa framework
- [ ] Minify CSS/JS dan hosting lokal untuk CDN tidak dilakukan (opsional untuk produksi)

**6.5 Dokumentasi** — `DONE`
- [x] Halaman dokumentasi komponen interaktif di menu Components (lihat 3.15)
- [x] `README.md`: cara pakai, struktur, halaman baru, menu, token, mode gelap, helper JS, kunci `localStorage`

---

## Catatan & keputusan


- Ilustrasi banner pada referensi adalah aset milik desainer; di sini memakai SVG placeholder buatan sendiri.
- Tanpa framework/build tool agar mudah dipakai sebagai template; layout dibagi lewat `layout.js`.
- Data masih dummy di `assets/js/data/mock.js`; integrasi API ditandai sebagai pekerjaan lanjutan.
