---
title: "Cara Menginstal Laravel dengan Composer"
description: "Panduan langkah demi langkah untuk menginstal Laravel menggunakan Composer."
date: '2025-03-15'
draft: false
tags:
  - Laravel
categories:
  - Laravel
---

## Pendahuluan

Laravel adalah salah satu framework PHP paling populer yang digunakan untuk membangun aplikasi web. Dengan bantuan Composer, kita dapat dengan mudah menginstal dan mengatur dependensi Laravel.  

Dalam panduan ini, kita akan membahas langkah-langkah untuk menginstal Laravel menggunakan Composer, mulai dari persiapan hingga pembuatan proyek baru.

## Prasyarat

Sebelum memulai instalasi Laravel, pastikan Anda telah menginstal beberapa komponen berikut di sistem Anda:

- PHP (minimal versi 8.1)  
- Composer  
- Database server (opsional, seperti MySQL atau PostgreSQL)  

## Langkah 1: Menginstal Composer

Composer adalah manajer dependensi PHP yang digunakan untuk mengelola pustaka dalam proyek Laravel. Jika belum menginstalnya, unduh dan pasang Composer dari situs resminya:  

👉 [Download Composer](https://getcomposer.org/download/)  

Setelah menginstal Composer, pastikan ia sudah dapat digunakan dengan menjalankan perintah berikut:

```bash title="Terminal"
composer --version
```

Jika Composer telah terinstal dengan benar, Anda akan melihat versi yang terpasang.

## Langkah 2: Menginstal Laravel

Setelah Composer terinstal, Anda dapat menginstal Laravel secara global di sistem Anda dengan menjalankan perintah berikut:

```bash title="Terminal"
composer global require laravel/installer
```

## Langkah 3: Membuat proyek Laravel baru

Setelah Laravel terinstal, buat proyek baru dengan perintah:

```bash title="Terminal"
laravel new nama_proyek
```

Tunggu hingga proses instalasi selesai, lalu masuk ke direktori proyek:

```bash title="Terminal"
cd nama_proyek
```

## Langkah 4: Menjalankan aplikasi Laravel

Untuk menjalankan aplikasi Laravel secara lokal, gunakan perintah berikut:

```bash title="Terminal"
php artisan serve
```

Aplikasi akan berjalan di `http://127.0.0.1:8000`.  
Anda dapat mengaksesnya melalui browser untuk memastikan Laravel telah berhasil diinstal.

## Kesimpulan

Dalam panduan ini, kita telah membahas cara menginstal Laravel menggunakan Composer, mulai dari instalasi Composer, pemasangan Laravel, hingga menjalankan proyek Laravel pertama Anda.  

Dengan mengikuti langkah-langkah ini, Anda siap untuk mulai membangun aplikasi web menggunakan Laravel!
