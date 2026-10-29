# Ryce site (HTML + CSS + JavaScript, tanpa Node.js)
Tes: double click `index.html`. Deploy: upload semua isi folder ke GitHub, lalu Settings → Pages → Deploy from a branch → `main` / `(root)`.

## File
- `js/layout.js` + `css/layout.css` — Header, Navigation, Footer
- `js/main.js` + `css/components.css` — isi halaman (urutan di `SECTIONS`)
- `js/data-games.js`, `js/data-socials.js`, `js/data-profile.js` — data yang diedit

## Game
Tambah objek = tambah game · `visible:false` = sembunyikan · hapus objek = hapus · `order` = urutan · `featured:true` = tampil duluan.
Gambar ada di folder `images/`. Isi `background` (wallpaper landscape di belakang), `cover` (gambar tile kecil), `gallery` (daftar gambar di popup), `video` (ID video YouTube atau file `.mp4`). Game tanpa gambar tampil gradient placeholder.

## Sosmed
Edit `url`, `username`, `thumb` (gambar kecil), `category` (judul grup), `visible`, `order`.

## Info di popup detail (v4)
Di `js/data-games.js`, tiap game punya `info` (baris seperti Nickname / UID / Joined). Isi `value` untuk menampilkan, kosongkan untuk menyembunyikan, `copy: true` untuk tombol Copy. Tambah baris baru dengan menyalin satu baris `{ label: ..., value: ..., copy: ... }`.
`description` tampil di bawah info. Gambar `gallery` bisa diklik untuk preview besar.
Icon sosmed bawaan ada di `js/icons.js`; mau logo sendiri, tambah `icon: './assets/Logo/youtube.png'` di `js/data-socials.js`.

## Gambar fleksibel (v5)
Salah tulis format (`.jpg` padahal `.webp`) atau huruf besar/kecil nama folder? Tidak masalah, file asli dicari otomatis oleh `js/assets.js`.
Wallpaper terpotong? Tambah `focus: 'center top'` (atau `'center 30%'`) di game itu di `js/data-games.js` untuk mengatur bagian gambar yang ditampilkan.
Ukuran wallpaper yang disarankan: 1920 x 1080 (16:9), objek utama di tengah, format .webp, di bawah 500 KB.

## Popup detail versi baru (v6)
Tiap game di `js/data-games.js` punya blok `profile`: `avatar`, `name`, `bio`, `joined`, `stats` (baris seperti UID / AR; `copy: true` = icon salin, `progress: 90` = bar 0-100).
Kosongkan nilai untuk menyembunyikan baris itu. Format `info` yang lama tetap terbaca.
Tombol share membuat gambar kartu profil + link (`.../#genshin` langsung membuka popup game itu). Teks popup bisa diedit di `LABELS` bagian atas `js/details.js`.

## Support & Donate (v8)
Section baru di `js/data-support.js`: `visible`, `title`, `text`, `buttons` (bisa lebih dari satu), dan `qr` (gambar QR, format apa saja: png, jpg, webp, svg).
Gambar QR bisa diketuk untuk diperbesar dan ada tombol "Save image".
Discord: tambahkan satu entri di `js/data-socials.js` (lihat contoh di chat), kategori `Community`.

## Icon, background sosmed, Support (v9)
- `js/data-look.js`: warna icon (`'white'`, `'black'`, `'original'`), folder icon (`assets/Icon/`), dan gambar background tiap kartu sosmed (`assets/Social/`, contoh sementara, ganti kapan saja).
- Icon dicari otomatis dari folder `assets/Icon/` lewat namanya (youtube, tiktok, instagram, facebook, hoyolab, discord, saweria, qr). Tidak ketemu = icon bawaan.
- `js/data-support.js`: kartu Support & Donate (jumlah kartu bebas, ukuran selalu sama).

## Border profil, kilauan, badge, optimasi gambar (v10)
- `profile.frame` di `js/data-games.js`: `image` (file border), `show` (ON/OFF), `sparkle` (kilauan ON/OFF). Saklar global ada di `look.frames` (`js/data-look.js`).
- Border dipasang otomatis: website mencari lubang di tengah gambar border lalu menyesuaikan ukuran foto profil.
- `profile.badges: ['verified']` menampilkan icon di samping nama (gambar `assets/Icon/Verified.png`).
- `tools/optimize-images.html`: alat untuk mengecilkan gambar (buka di Chrome, tidak perlu install apa pun).
