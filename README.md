# Learnzie Admin Theme

Tema admin dashboard e-learning berbasis **HTML, CSS, JavaScript, dan Bootstrap 5.3**.
Seluruh komponen Bootstrap di-restyle mengikuti desain referensi (brand *Learnzie*), ditambah komponen baru untuk
hal yang tidak ada di Bootstrap. Tanpa build step. Rencana dan status pengerjaan ada di [SPRINT.md](SPRINT.md).

## Cara pakai

1. Buka `index.html` di browser (atau jalankan server statis, mis. `npx serve .`).
2. Butuh internet karena Bootstrap, Bootstrap Icons, Chart.js, dan font Urbanist dimuat dari CDN.
   Untuk mode offline, unduh file-file itu dan ganti URL `<link>`/`<script>` di tiap halaman.

## Halaman

| Halaman | File |
|---|---|
| Halaman publik (sebelum login): landing, login, register, lupa password | `landing.html`, `login.html`, `register.html`, `forgot-password.html` |
| Dashboard | `index.html` |
| Explore, Courses, Detail course | `pages/explore.html`, `pages/courses.html`, `pages/course-detail.html?id=1` |
| Class (daftar + ruang kelas) | `pages/class.html`, `pages/class.html?course=1` |
| Schedule, Analytics, Certificate, Settings | `pages/schedule.html`, `pages/analytics.html`, `pages/certificate.html`, `pages/settings.html` |
| Dokumentasi komponen (menu **Components**) | `pages/components.html` |

## Struktur

```
assets/
├─ css/
│  ├─ theme.css           Design tokens (--lz-*), layout shell, widget dashboard, mode gelap
│  ├─ bootstrap-skin.css  Re-style SEMUA komponen Bootstrap + komponen tambahan (btn-icon, badge-soft, lz-chip, ...)
│  ├─ courses.css         Kartu course, detail course, ruang kelas
│  ├─ pages.css           Schedule, Analytics, Certificate, Settings
│  └─ public.css          Layout publik: navbar, hero, section landing, halaman auth
└─ js/
   ├─ theme-init.js       Dipasang di <head>: menerapkan tema tanpa kedipan
   ├─ lz.js               Helper: Lz.toast, Lz.table, Lz.charts, Lz.theme, Lz.palette
   ├─ layout.js           Merender sidebar, header, footer, skip link
   ├─ data/mock.js        Data dummy (user, statistik, assignment, jadwal, katalog course)
   ├─ data/curriculum.js  Kurikulum, ulasan, profil pengajar (dihasilkan dari data course)
   ├─ public.js           Navbar dan footer layout publik
   ├─ auth.js, landing.js Login/register/lupa password dan landing page
   └─ dashboard.js, courses.js, course-detail.js, class.js, schedule.js, analytics.js, certificate.js, settings.js
```

Urutan muat CSS: Bootstrap, lalu `theme.css`, `bootstrap-skin.css`, dan css halaman. Urutan ini penting karena
file kita menimpa variabel Bootstrap.

## Layout publik (tanpa menu)

Halaman untuk pengunjung yang belum login memakai layout penuh tanpa sidebar. Salin `landing.html` atau `login.html` sebagai dasar:

```html
<body class="public" data-layout="public" data-page="landing" data-root="">
  <header data-slot="public-header"></header>
  <main> ... isi halaman ... </main>
  <footer data-slot="public-footer"></footer>
  <script src="assets/js/lz.js"></script>
  <script src="assets/js/public.js"></script>
</body>
```

Tautan navbar diatur di array `LINKS` pada `assets/js/public.js`. Login memakai sesi demo (`lz.auth`) tanpa backend; ganti isi `startSession` dan
penanganan submit di `assets/js/auth.js` dengan pemanggilan API Anda. Parameter `?next=` hanya menerima path relatif di situs ini.

Tombol **Log in** di navbar berupa dropdown jalur masuk (SSO, Dosen, Operator (Non SSO), Orangtua, dan Registrasi Maru). Jalurnya didefinisikan di objek `ROLES` pada `assets/js/public.js` (diekspos sebagai `window.LzRoles`); `login.html?role=dosen` menandai jalur terpilih dan menyimpannya pada sesi (`role`).

## Dokumentasi komponen

Menu **Components** berisi preview dan kode setiap komponen. Kode HTML pada tab HTML diambil otomatis dari markup preview,
jadi cukup menulis contohnya sekali. Untuk menambah contoh baru:

```html
<div class="doc-example"><div class="doc-preview">
  <button class="btn btn-primary" type="button">Contoh</button>
</div></div>
```

Contoh yang kodenya berbeda dari preview (JavaScript, CSS, atau modal) memakai blok kode eksplisit di dalam `.doc-preview`:

```html
<script type="text/plain" class="doc-code" data-lang="js">
Lz.toast("Tersimpan.", "success");
<\/script>
```

Tulis `<\/script>` untuk menutup tag script di dalam contoh; `docs.js` mengubahnya kembali menjadi `</script>` saat ditampilkan.
Bagian baru otomatis masuk daftar isi jika diberi `<section class="doc-section" id="..."><h2>Judul</h2>`.

## Membuat halaman baru

1. Salin `pages/explore.html` sebagai dasar.
2. Atur atribut `<body>`: `data-page` (menandai menu aktif), `data-title` (judul header), `data-root="../"` (untuk halaman di `pages/`).
3. Tulis isi di dalam `<div class="app-content">`. Sidebar, header, dan footer terisi otomatis dari `data-slot`.
4. Muat `lz.js`, `layout.js`, lalu skrip halaman Anda (urutannya: Bootstrap JS, data, `lz.js`, `layout.js`, skrip halaman).
5. Hapus kelas `no-right` dari `.app-shell` jika ingin panel kanan seperti dashboard.

## Menambah menu (sampai 3 level)

Edit array `MENU` di `assets/js/layout.js`. Level 1 memakai `key` yang sama dengan `data-page` halaman tujuan; item dengan `children`
menjadi dropdown dan boleh bersarang sampai level 3:

```js
{ key: "explore", label: "Explore", icon: "bi-compass", children: [          // level 1
  { label: "All courses", href: "pages/explore.html" },                      // level 2
  { label: "By category", children: [                                        // level 2 (induk)
    { label: "UX Design", href: "pages/explore.html?cat=UX%20Design" },      // level 3
  ] },
] },
```

Item level 2 dan 3 dicocokkan dengan URL (path, `?cat`, `?level`, `?tab`, dan `#hash`); `default: true` menandai item yang aktif saat URL tanpa hash.
Daftar parameter yang dicocokkan ada di `URL_KEYS`. Jika halaman Anda mengganti filter tanpa memuat ulang, panggil
`Lz.url.set({ cat: "Finance" })` atau `Lz.url.hash("account")` agar penanda aktif di sidebar ikut berubah.

## Design tokens

Semua warna, radius, dan jarak ada di `:root` pada `theme.css`.

| Token | Fungsi |
|---|---|
| `--lz-primary`, `--lz-primary-soft` | Warna brand dan latar lembutnya |
| `--lz-pink`, `--lz-yellow`, `--lz-green`, `--lz-red` | Aksen kategori dan status (+ varian `-soft` dan `-ink` untuk teks) |
| `--lz-bg`, `--lz-surface`, `--lz-border` | Latar halaman, kartu, garis |
| `--lz-text`, `--lz-muted` | Teks utama dan sekunder (`--lz-muted` dibuat sedikit lebih gelap dari referensi agar kontras AA) |
| `--lz-radius`, `--lz-radius-sm` | 16px untuk kartu, 8px untuk kontrol |

Mengganti warna brand cukup dengan mengubah `--lz-primary` (dan `--bs-primary` / `--bs-primary-rgb` di blok yang sama).

## Mode gelap

Atribut `data-bs-theme="dark"` pada `<html>` menimpa token di blok `[data-bs-theme="dark"]` (`theme.css`).
Pengguna memilih Light / Dark / System di Settings, pilihan tersimpan di `localStorage` (`lz.theme`).
Dari kode: `Lz.theme.set("dark")`.

## Helper JavaScript

```js
Lz.toast("Tugas terkirim", "success", { title: "Terkirim" });   // success | danger | warning | info
Lz.charts.donut(canvas, [43, 32, 25], ["#0f6fde", "#fbb6e6", "#ffc93c"]);
Lz.charts.bar(canvas, labels, [{ data, backgroundColor }], { stacked: false, max: 10 });
Lz.charts.line(canvas, labels, [{ data, borderColor }]);
Lz.charts.ring(canvas, 72);
```

Tabel dengan sort, pencarian, dan pagination: beri atribut `data-lz-table` (opsional `data-page-size`) pada pembungkus,
`data-sort` pada `<th>` yang bisa diurutkan, `data-lz-search` pada input, dan `data-lz-pager` pada penampung pagination.
Nilai urut khusus bisa diberikan lewat `data-value` pada `<td>`. Contoh ada di menu Components dan `pages/analytics.html`.

## Notifikasi dan pesan di header

Dropdown di header membaca `D.notifications` dan `D.messages` (`assets/js/data/mock.js`). Notifikasi: `{ id, tone, icon, title, text, time, href, read? }`
(`tone`: blue, yellow, green, pink; `read: true` = sudah dibaca secara bawaan). Pesan: `{ id, name, role, text, time, read? }`.
Status baca disimpan di `localStorage` (`lz.read.notif`, `lz.read.msg`). Template ini tidak menyertakan halaman kotak masuk atau backend pesan:
menu pesan hanya menandai sudah dibaca, sambungkan ke API Anda untuk membuka percakapan.

## Fade-in saat halaman dimuat

`assets/js/theme-init.js` (wajib di `<head>`) menyembunyikan area konten (`.app-content` dan `.app-right`) sampai siap, lalu menampilkannya
dengan fade-in 0,45 detik. Sidebar, header, dan footer tidak ikut memudar. Ubah durasinya di `theme.css`
(`.app-content, .app-right { transition: opacity .45s ease; }`). Dimatikan otomatis untuk reduced motion.

## Hover, tautan, dan ripple

- Warna hover memakai token `--lz-hover` (latar) dan `--lz-primary-ink` (teks); untuk komponen baru cukup memakai keduanya.
- Tautan tidak pernah bergaris bawah; pembeda hover hanya warna.
- Efek ripple otomatis untuk tombol, menu, tab, chip, dll. (daftar selektor `RIPPLE` di `lz.js`). Tambahkan selektor baru ke daftar itu,
  atau beri atribut `data-no-ripple` pada elemen yang tidak ingin diberi efek. Dimatikan saat `prefers-reduced-motion`.

## Data dan penyimpanan lokal

Semua data masih dummy (`assets/js/data/`). Status yang diubah pengguna disimpan di `localStorage`:

| Kunci | Isi |
|---|---|
| `lz.theme` | light / dark / auto |
| `lz.saved`, `lz.enrolled` | Bookmark dan pendaftaran course |
| `lz.done.<id>`, `lz.note.<id>`, `lz.comments.<id>` | Materi selesai, catatan, diskusi per course |
| `lz.events` | Event di Schedule |
| `lz.profile`, `lz.notif` | Profil dan preferensi notifikasi |

Untuk integrasi backend, ganti pembacaan `window.LzData` dan fungsi baca/tulis `localStorage` di tiap skrip halaman dengan pemanggilan API.

## Video di ruang kelas

Materi bertipe video memakai elemen `<video>`. Sumber contoh ada di `D.sampleVideo` (`assets/js/data/curriculum.js`).
Untuk video sendiri, isi `lesson.video` dengan URL MP4/WebM; materi ditandai selesai otomatis saat video habis ditonton.
Materi Reading dan Quiz juga tersedia (isinya dummy).

## Yang belum ada

- Ilustrasi banner dashboard masih SVG sederhana; ganti dengan aset Anda sendiri.
- Pengujian dengan pembaca layar, Firefox, dan perangkat fisik belum dilakukan (audit otomatis axe-core WCAG A/AA sudah bersih).
