## Memulai dengan cepat

### Persyaratan lingkungan

Selain Bun dan Git, build produksi **sangat bergantung pada Python 3, FontTools, dan Brotli**. `bun run build` akan menghasilkan subset font WOFF2 berdasarkan karakter CJK pada UI situs dan konten; tanpa alat-alat tersebut build akan gagal.

Disarankan untuk menginstal dependensi Python di virtual environment proyek. Tidak perlu mengaktifkan virtual environment — skrip build otomatis memprioritaskan `.venv`:

macOS / Linux:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip fonttools brotli
```

Windows (PowerShell atau Command Prompt):

```powershell
py -3 -m venv .venv
.venv\Scripts\python.exe -m pip install --upgrade pip fonttools brotli
```

Verifikasi lingkungan subset font dengan perintah berikut:

```sh
bun run fonts:ui
```

Instal dependensi:

```sh
bun install
```

Jalankan server pengembangan:

```sh
bun run dev
```

Build versi produksi:

```sh
bun run build
```

Pratinjau build produksi:

```sh
bun run preview
```

## Mengganti konten untuk pertama kali

Sebagian besar konten personal tidak perlu mengubah komponen; prioritaskan mengedit file berikut:

```text
src/config/site.toml        judul situs, profil, navigasi, modul beranda, komentar, pencarian, tema
src/content/about.mdx       halaman tentang
src/content/blog/           artikel blog dan buku panduan modul
src/content/projects/       pintu masuk proyek dan dokumentasi proyek
src/content/vibe/           dinamika ringan dan serpihan kehidupan
public/images/              Logo, avatar, pratinjau situs, dan gambar statis
```

Membuat konten bisa menggunakan skrip bawaan:

```sh
bun run post:new my-first-post
bun run post:new my-interactive-post --mdx
bun run project:new my-project
bun run vibe:new today-cloud
bun run media:new my-favourite-book
bun run post:new private-draft src/content/drafts
```

Semua skrip konten halaman mengikuti pola
`bun run <singkatan-halaman>:new <nama-file> [direktori-output opsional]`. Nama file dibersihkan dengan aman dan digunakan sekaligus sebagai basename output dan `title` awal; jika direktori tidak ditentukan, direktori konten default dari template terkait yang digunakan.
`--md`, `--mdx`, atau ekstensi nama file dapat menimpa ekstensi default template. Frontmatter dan isi default berada di `templates/default.md` yang dirilis bersama setiap paket halaman; template blog berada di
`scripts/templates/post.md` dan dapat diedit langsung tanpa mengubah TypeScript.

## Rute

```text
/                  beranda dashboard personal
/blog             arsip tulisan dan buku panduan modul
/blog/[slug]      halaman artikel blog
/projects         pintu masuk dokumentasi proyek
/projects/[slug]  halaman detail proyek
/vibe             linimasa catatan pendek
/about            halaman tentang
/rss.xml          RSS feed
```

## Konfigurasi situs

Informasi tingkat situs terkumpul di `src/config/site.toml`:

- `[config.site]`: judul situs, deskripsi, alamat repositori, dan catatan footer.
- `[config.profile]`: nama penulis, akun, peran, avatar, website, GitHub, email, dan lainnya.
- `[[config.topNav.links]]`: tautan navigasi atas.
- `[config.theme]`: pemilihan palet bawaan.
- `[config.search]`: pintu masuk pencarian, pintasan, teks placeholder, dan jumlah hasil.
- `[config.comments]`: saklar komentar dan penyedia komentar.
- `[config.vibe]`: perilaku tampilan linimasa Vibe.
- `[config.home]`: kutipan beranda, intro, kartu navigasi, kontak, dan hal yang sedang difokuskan.

Struktur konfigurasi divalidasi oleh schema Zod di `src/content.config.ts`. Jika ada field yang hilang atau tipe tidak cocok, `bun run build` akan langsung melaporkan error sehingga masalah cepat terdeteksi.

## Model konten

Artikel blog, dokumentasi proyek, dan halaman About berbagi schema artikel yang sama:

```yaml
title: "Judul Artikel"
description: "Ringkasan singkat untuk halaman arsip dan metadata."
date: "2026-05-18"
draft: false
heroImage: "/src/assets/figure/example.png"
showHeroImage: true
tags:
  - Astro
comments: true
sidebar:
  enable: true
  toc: true
  relatedPosts: true
```

`sidebar` mengontrol area pendukung artikel:

- `enable`: apakah mengaktifkan blok sidebar.
- `toc`: apakah menampilkan navigasi daftar isi.
- `relatedPosts`: apakah menampilkan artikel terkait.

Artikel blog biasa secara default cocok menampilkan alat baca; `/about` dan sebagian halaman proyek dapat diatur tanpa sidebar, dengan tata letak membaca terpusat.

## Pencarian

Projek ini menggunakan Pagefind untuk menghasilkan indeks pencarian teks penuh statis. Tombol pencarian di navigasi atas bisa diklik untuk dibuka, dan juga mendukung pintasan `Ctrl+K` / `Cmd+K`.

```toml
[config.search]
enabled = true
shortcut = "mod+k"
placeholder = "Search notes..."
maxResults = 6
```

`bun run build` akan menjalankan build Astro terlebih dahulu, lalu menghasilkan indeks `dist/pagefind` untuk `dist`. Di lingkungan pengembangan, jika indeks produksi belum ada, panel pencarian akan menampilkan peringatan indeks tidak tersedia; setelah menjalankan satu build produksi, kamu bisa memakai `bun run preview` untuk memeriksa pengalaman pencarian secara lengkap.

## Komentar

Projek ini mendukung sistem komentar yang dapat dikonfigurasi:

- `giscus`
- `utterances`
- `waline`
- `none`

Konfigurasi terpusat di `src/config/site.toml`:

```toml
[config.comments]
enabled = true
provider = "giscus"
show_on_posts = true
```

Komentar juga bisa dimatikan per artikel di frontmatter:

```yaml
comments: false
```

## Struktur proyek

```text
public/
  images/                 Logo, gambar pratinjau, dan gambar statis
src/
  assets/                 gambar konten dan font lokal
  components/
    article/              komponen header artikel
    blog/                 navigasi atas, pencarian, daftar isi, dan artikel terkait
    cards/                komponen kartu beranda
    comments/             komponen penyedia komentar
    layout/               layout dashboard beranda
    mdx/                  komponen konten MDX
    widgets/              komponen aktivitas menulis dan alat
    Icon.astro            adapter ikon terpadu
  content/
    about.mdx             konten halaman tentang
    blog/                 Markdown / MDX blog dan buku panduan modul
    projects/             pintu masuk proyek dan dokumentasi proyek
    vibe/                 catatan pendek ringan
  config/site.toml        konfigurasi situs
  data/site.ts            helper pembaca konfigurasi TOML
  layouts/                layout dasar dan layout artikel
  pages/                  rute Astro
  styles/                 tema global, palet, tipografi, dan variabel layout
```

## Teknologi

- Astro 6
- Bun
- Tailwind CSS 4 melalui Vite
- Pagefind
- `@astrojs/mdx`
- `@astrojs/rss`
- `@astrojs/sitemap`
- `lucide-astro`
- `sharp`
