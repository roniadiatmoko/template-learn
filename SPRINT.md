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
| 7 | Layout publik tanpa menu (landing, login, register) untuk pengguna sebelum login | DONE |

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
| 1.7 | Revisi 4: efek fade-in area konten saat halaman dimuat | DONE |
| 1.8 | Menu sidebar bertingkat sampai 3 level | DONE |
| 1.9 | Revisi 5: dropdown Notifikasi dan Pesan di header | DONE |

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

**1.7 Revisi 4: fade-in area konten saat halaman dimuat** — `DONE`
- [x] `theme-init.js` (di `<head>`) menambahkan kelas `lz-loading` pada `<html>`; CSS menyembunyikan **hanya area konten** (`.app-content` dan panel kanan `.app-right`, `opacity: 0`) sehingga widget yang dirender lewat JS tidak muncul setengah jadi
- [x] **Sidebar menu, header, dan footer tidak ikut memudar** (revisi: efek semula berlaku di seluruh halaman)
- [x] Konten muncul perlahan (`transition: opacity .45s` pada `.app-content` dan `.app-right`) setelah DOM, skrip halaman, dan font Urbanist siap (menunggu font maksimal 700 ms)
- [x] Aman: dilewati jika pengguna memilih reduced motion, ada batas waktu 2,5 detik agar halaman tidak pernah tertahan, dan tombol back/forward (cache browser) langsung tampil
- [x] Diukur di Chrome: opacity naik bertahap 0 ke 1 pada dashboard, explore, dan class (sekitar 20 frame perantara)

**1.8 Menu sidebar bertingkat (dropdown sampai 3 level)** — `DONE`
- [x] Struktur data `MENU` di `layout.js` mendukung `children` bersarang: level 1 (Explore, Courses, Settings), level 2 (mis. By category, By level), level 3 (mis. UX Design, Beginner)
- [x] Item induk berupa tombol dengan panah yang berputar; submenu membuka/menutup dengan animasi Bootstrap Collapse (tanpa animasi untuk reduced motion)
- [x] Level 2 dan 3 diberi garis pemandu di kiri dan teks lebih kecil; item aktif memakai penanda biru di garis
- [x] Item aktif dicocokkan dari URL (path, `?cat`, `?level`, `?tab`, `#hash`); cabang induk otomatis terbuka dan berwarna biru
- [x] Submenu yang dibuka/ditutup pengguna diingat (`localStorage`, kunci `lz.menu.open`)
- [x] Penanda aktif ikut berubah tanpa memuat ulang saat filter/tab diganti (`Lz.url.set`, event `lz:urlchange`), dan cabang aktif otomatis dibuka
- [x] Aksesibilitas: `aria-expanded`, `aria-controls`, `aria-current`; audit axe-core bersih; berfungsi di offcanvas mobile dan mode gelap
- [x] Diuji dengan klik sungguhan di Chrome: buka/tutup 3 level, ingat status setelah muat ulang, penanda aktif untuk filter, tab, dan hash

**1.9 Revisi 5: dropdown Notifikasi dan Pesan** — `DONE`
- [x] Tombol pesan dan lonceng di header kini membuka panel dropdown (sebelumnya tidak melakukan apa-apa): judul, tautan "Mark all as read", daftar item dengan ikon/avatar, judul, cuplikan, waktu, dan titik biru untuk yang belum dibaca
- [x] Notifikasi berupa tautan ke halaman terkait (tugas, jadwal, sertifikat, diskusi kelas, course baru); mengkliknya menandai sudah dibaca. Pesan berupa tombol yang menandai sudah dibaca (percakapan lengkap perlu backend)
- [x] Titik merah pada tombol hanya muncul bila ada yang belum dibaca; `aria-label` tombol menyebut jumlahnya (mis. "Notifications, 3 unread")
- [x] Status baca disimpan (`lz.read.notif`, `lz.read.msg` di `localStorage`); panel tetap terbuka saat klik di dalamnya dan menutup saat klik di luar atau membuka panel lain
- [x] Data di `D.notifications` dan `D.messages` pada `mock.js`; lebar panel menyesuaikan layar kecil (diuji di 390px), mode gelap didukung

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
| 2.11 | Revisi 5: tombol yang belum berfungsi di dashboard | DONE |

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

**2.11 Revisi 5: menu titik tiga dan tombol lain di dashboard** — `DONE`
- [x] Tombol titik tiga di kartu Performance, My Progress, dan Recent Activities membuka menu dropdown: View analytics, Go to my courses, Refresh (mengulang animasi grafik dan memunculkan toast), dan Clear list (dapat dikembalikan dengan Refresh)
- [x] Tombol "+" di My Schedule menuju Schedule dan langsung membuka form tambah event (`#add`)
- [x] Kartu jadwal di panel kanan membuka halaman Schedule; tombol filter di profil membuka Settings; tombol "Try Free Trial" menampilkan toast konfirmasi
- [x] Diuji dengan klik sungguhan di Chrome

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
- [x] Hover diuji dengan mouse sungguhan lewat Chrome DevTools Protocol (30 elemen: menu sidebar, tombol, chip, kartu course, tab, pills, pagination, accordion, list group, baris tabel, event kalender, dll.): semuanya berubah saat di-hover dan tidak ada yang bergaris bawah
- [x] Audit otomatis axe-core (WCAG 2 A/AA) pada 10 halaman, terang dan gelap: tidak ada pelanggaran tersisa (lihat 6.3)

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
| 4.7 | Revisi 3: Explore dan Courses terhubung ke menu bertingkat lewat URL | DONE |

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
- [x] Pemutar video sungguhan: tombol play memuat elemen `<video controls>`; selesai ditonton otomatis menandai materi selesai; jika gagal dimuat muncul pesan dan tampilan kembali ke placeholder
- [x] Sumber video contoh (CC0, MDN) ada di `D.sampleVideo` pada `assets/js/data/curriculum.js`; ganti dengan URL Anda atau isi `lesson.video` per materi
- [x] Materi bertipe Reading menampilkan artikel, bertipe Quiz menampilkan 3 soal pilihan ganda (lulus jika benar minimal 2, lalu materi otomatis selesai); isinya dummy dan dihasilkan dari judul materi

**4.5 Revisi 1: hover course & kelas** — `DONE`
- [x] Kartu course terangkat sedikit dengan bayangan lembut (dimatikan jika reduced motion), tombol bookmark, daftar materi di ruang kelas, tombol play

**4.6 Revisi 2: judul hero detail course** — `DONE`
- [x] Judul di hero detail course memakai `color: inherit` agar putih di hero biru/hijau dan gelap di hero pink/kuning (sebelumnya selalu hitam)

**4.7 Revisi 3: filter lewat URL untuk menu bertingkat** — `DONE`
- [x] Explore membaca `?cat=` dan `?level=` (chip dan pilihan level ikut terpilih) dan memperbarui URL saat filter diganti
- [x] Courses membaca `?tab=progress|done|saved` dan memperbarui URL saat tab diganti
- [x] Menu sidebar level 2 dan 3 (By category, By level, In Progress/Completed/Saved) memakai parameter ini

---

## SPRINT 5 — Schedule, Analytics, Certificate, Settings · `DONE`

| No | Task | Status |
|---|---|---|
| 5.1 | Schedule: kalender penuh (bulan/minggu) + daftar event | DONE |
| 5.2 | Analytics: KPI, tren belajar, perbandingan kategori, top course | DONE |
| 5.3 | Certificate: galeri sertifikat, preview, cetak/PDF | DONE |
| 5.4 | Settings: profil, akun, notifikasi, tampilan | DONE |
| 5.5 | Revisi 1: hover kalender, event, pengaturan | DONE |
| 5.6 | Revisi 3: tab Settings dapat dibuka lewat hash | DONE |
| 5.7 | Revisi 5: Schedule membuka form tambah event lewat #add | DONE |

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

**5.6 Revisi 3: tab Settings lewat hash** — `DONE`
- [x] `settings.html#account`, `#notifications`, `#appearance` membuka tab yang sesuai (tanpa hash = Profile); mengganti tab memperbarui hash, dan klik menu sidebar pada halaman yang sama berpindah tab tanpa muat ulang

**5.7 Revisi 5: `#add` pada Schedule** — `DONE`
- [x] `schedule.html#add` membuka modal Add event saat halaman dimuat maupun saat hash berubah

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
- [x] Chrome dan Edge (Chromium) diuji
- [ ] Firefox terpasang tetapi screenshot headless gagal (masalah grafis di mesin ini), jadi belum diuji; perangkat fisik juga belum

**6.2 Dark mode** — `DONE`
- [x] Warna dipindah ke token (`--lz-text-2`, `--lz-surface-2`, `--lz-*-ink`, dst.), tema gelap hanya menimpa token
- [x] `theme-init.js` di `<head>` mencegah kedipan; opsi System mengikuti `prefers-color-scheme`
- [x] Chart membaca warna grid/tick dari CSS variables
- [x] Dicek visual: dashboard, schedule, katalog komponen (gelap)
- [x] Seluruh halaman dicek dalam mode gelap (dashboard, explore, courses, detail, class, schedule, analytics, certificate, settings, components)
- [x] Perbaikan hasil pengecekan: ikon panah accordion di mode gelap, ikon tombol play

**6.3 Aksesibilitas** — `DONE` (sebagian diuji otomatis, sebagian belum)
- [x] Skip link, landmark `main`/`nav`, `aria-current`, `aria-pressed`, `aria-live` untuk hasil, label pada tombol ikon
- [x] Fokus keyboard terlihat di semua kontrol; `prefers-reduced-motion` dihormati
- [x] Kontras teks sekunder dinaikkan (`--lz-muted` #667085, sedikit lebih gelap dari referensi)
- [x] Audit otomatis axe-core (WCAG 2 A/AA) pada 10 halaman x 2 tema: temuan awal berupa kontras warna, `aria-sort` pada `role=button`, dan elemen interaktif bersarang; semuanya diperbaiki dan audit ulang bersih
- [x] Perbaikan kontras: teks biru (`--lz-primary-ink` jadi #0b5fc9), hijau (#157a43), merah (#b32f34), teks sekunder (#5f6b7f), tombol success/danger/info, banner hero, sertifikat terkunci, hari di luar bulan pada kalender
- [ ] Belum diuji dengan pembaca layar sungguhan (NVDA/VoiceOver); audit otomatis hanya mencakup sebagian aturan

**6.4 Performa** — `DONE`
- [x] Chart.js hanya dimuat di halaman yang memakai grafik; font memakai `display=swap`; tanpa framework
- [ ] Minify CSS/JS dan hosting lokal untuk CDN tidak dilakukan (opsional, dikerjakan saat siap produksi)

**6.5 Dokumentasi** — `DONE`
- [x] Halaman dokumentasi komponen interaktif di menu Components (lihat 3.15)
- [x] `README.md`: cara pakai, struktur, halaman baru, menu, token, mode gelap, helper JS, kunci `localStorage`

---

## SPRINT 7 — Layout Publik (Sebelum Login) · `DONE`

Layout penuh tanpa sidebar, bergaya landing page, untuk pengunjung yang belum login. Memakai token, komponen, mode gelap, ripple, dan fade-in yang sama dengan area aplikasi.

| No | Task | Status |
|---|---|---|
| 7.1 | Layout publik: navbar, footer, struktur halaman | DONE |
| 7.2 | Landing page | DONE |
| 7.3 | Halaman login, register, dan lupa password | DONE |
| 7.4 | Sesi demo dan alur masuk | DONE |
| 7.5 | QA responsif, mode gelap, aksesibilitas | DONE |
| 7.6 | Revisi 6: banner hero landing dipadatkan di ponsel | DONE |

**7.1 Layout publik** — `DONE` (`assets/css/public.css`, `assets/js/public.js`)
- [x] Halaman memakai `<body class="public" data-layout="public">` dengan slot `public-header` dan `public-footer`; tanpa sidebar, konten selebar penuh (maks 1180px)
- [x] Navbar sticky: logo, tautan (Courses, Features, How it works, FAQ), tombol ganti tema terang/gelap, tombol Log in dan Sign up free; menjadi menu lipat (hamburger) di layar kecil
- [x] Jika pengguna sudah punya sesi, tombol berubah menjadi "Go to dashboard"
- [x] Footer 4 kolom (merek, Learn, Account, Legal) dan baris hak cipta
- [x] Skip link, landmark `main`, dan fade-in hanya pada konten (navbar tetap terlihat)

**7.2 Landing page** — `DONE` (`landing.html`, `assets/js/landing.js`)
- [x] Hero biru dengan judul, ajakan (Create free account, Browse courses), angka kepercayaan, dan komposisi kartu pratinjau dashboard (murni CSS: grafik batang, ring progress, kartu sertifikat)
- [x] Popular courses: 6 course dari data dummy; tombol mengarah ke login dengan `?next=` ke halaman course tersebut
- [x] Fitur (4 kartu), How it works (3 langkah bernomor karena memang berurutan), testimoni (3), FAQ (accordion 4 pertanyaan), pita ajakan akhir

**7.3 Halaman autentikasi** — `DONE` (`login.html`, `register.html`, `forgot-password.html`, `assets/js/auth.js`)
- [x] Kartu dua kolom (panel biru berisi manfaat + formulir); panel biru disembunyikan di layar kecil
- [x] Login: email, password dengan tombol tampil/sembunyi, "Keep me logged in", tautan Forgot password; validasi dan pesan galat per kolom
- [x] Register: nama, email, password dengan indikator kekuatan, persetujuan syarat (wajib)
- [x] Forgot password: formulir email lalu layar konfirmasi "Check your email"

**7.4 Sesi demo** — `DONE`
- [x] Tanpa backend: email valid dan password minimal 8 karakter dianggap berhasil (dinyatakan di formulir); sesi disimpan di `localStorage` ("ingat saya") atau `sessionStorage` (kunci `lz.auth`)
- [x] Setelah login/daftar pengguna diarahkan ke `index.html` atau ke `?next=` bila ada; `next` hanya menerima path relatif di situs ini (alamat luar seperti `https://...` ditolak dan jatuh ke dashboard)
- [x] Nama dan email disimpan ke `lz.profile` sehingga muncul di Settings dan sertifikat
- [x] Catatan: area aplikasi belum memakai penjaga halaman (belum wajib login) dan belum ada tombol Log out; ini sengaja ditinggalkan agar template tetap mudah dicoba

**7.5 QA** — `DONE`
- [x] Audit axe-core (WCAG 2 A/AA) dengan waktu nyata pada seluruh 14 halaman (publik + aplikasi) x 2 tema: bersih (pengukuran dengan virtual time sempat menghasilkan temuan palsu karena transisi fade-in belum selesai)
- [x] Diuji dengan interaksi sungguhan di Chrome: validasi, tombol password, login valid, `?next=` aman dan berbahaya, ingat saya, daftar, lupa password, ganti tema, menu mobile, tanpa overflow horizontal di 390px
- [ ] Belum diuji di Firefox dan perangkat fisik

**7.6 Revisi 6: banner hero landing di ponsel** — `DONE`
- [x] Di layar <= 575px banner dipadatkan: padding dan radius lebih kecil, judul 1,65rem, paragraf 0,92rem, dua tombol ajakan berdampingan dengan ukuran normal (bukan besar), angka kepercayaan lebih kecil, kartu pratinjau diperkecil, jarak antarbagian dikurangi
- [x] Tinggi banner di 390px sekitar 459px (sebelumnya hampir satu layar penuh); tidak ada overflow horizontal di 390 dan 360px

---

## Catatan & keputusan


- Ilustrasi banner pada referensi adalah aset milik desainer; di sini memakai SVG placeholder buatan sendiri.
- Tanpa framework/build tool agar mudah dipakai sebagai template; layout dibagi lewat `layout.js`.
- Data masih dummy di `assets/js/data/mock.js`; integrasi API ditandai sebagai pekerjaan lanjutan.
