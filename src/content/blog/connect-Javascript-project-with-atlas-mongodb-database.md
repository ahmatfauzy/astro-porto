---
title: "Cara Menghubungkan Projek JavaScript kita dengan Database MongoDB Atlas"
description: "Panduan langkah demi langkah untuk menghubungkan projek JavaScript dengan db MongoDB Atlas."
date: '2025-02-09'
draft: false
tags:
  - Backend
categories:
  - Backend
---

## MongoDB Atlas

MongoDB Atlas adalah layanan database cloud yang memungkinkan kita untuk menyimpan dan mengelola data secara efisien. Dalam panduan ini, kita akan belajar cara menghubungkan proyek JavaScript dengan MongoDB Atlas menggunakan Node.js dan Mongoose.

## Prasyarat

Sebelum mulai, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) dan npm (Node Package Manager)
- Akun [MongoDB Atlas](https://www.mongodb.com/atlas)
- Database MongoDB Atlas yang telah dikonfigurasi

## Instalasi paket

Buka terminal atau command prompt, lalu jalankan perintah berikut untuk menginstal dependensi yang dibutuhkan:

```bash title="Terminal"
npm init -y
npm install mongoose dotenv
```

- `mongoose`: Library untuk berinteraksi dengan MongoDB  
- `dotenv`: Untuk mengelola variabel lingkungan

## Konfigurasi MongoDB Atlas

1. Masuk ke [MongoDB Atlas](https://www.mongodb.com/atlas) dan buat cluster baru.  
2. Buat database dan koleksi baru.  
3. Dapatkan **MongoDB Connection String** dari tab **Database Access**.  
4. Buat file `.env` di root proyek dan tambahkan koneksi MongoDB seperti berikut:  

```env title=".env"
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabaseName?retryWrites=true&w=majority
```

Ganti `<username>`, `<password>`, dan `myDatabaseName` dengan informasi dari MongoDB Atlas Anda.

## Membuat koneksi ke MongoDB

Buat file `db.js` dan tambahkan kode berikut:

```javascript title="db.js"
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## Menjalankan koneksi dalam aplikasi

Buat file `server.js` dan tambahkan kode berikut:

```javascript title="server.js"
const express = require('express');
const connectDB = require('./db');

const app = express();

// Hubungkan ke database
connectDB();

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## Menjalankan aplikasi

Jalankan perintah berikut di terminal:

```bash title="Terminal"
node server.js
```

Jika koneksi berhasil, Anda akan melihat output seperti:

```bash title="Output"
MongoDB Connected
Server running on port 5000
```

##

Sekarang, proyek JavaScript Anda telah terhubung dengan MongoDB Atlas! Anda bisa mulai membuat model, menyimpan data, dan melakukan operasi database lainnya menggunakan Mongoose.

Selamat mencoba! 🚀
