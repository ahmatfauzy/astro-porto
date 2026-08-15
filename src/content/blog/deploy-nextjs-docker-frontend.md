---
title: "Deploy Next.js Frontend dengan Docker"
description: "Panduan praktis membungkus aplikasi Next.js ke dalam container Docker, hanya untuk sisi frontend."
date: '2025-09-01'
draft: false
tags:
  - DevOps
categories:
  - DevOps
---

## Mengapa Docker?

Next.js adalah framework React yang banyak dipakai untuk membangun frontend modern.  
Masalah sering muncul ketika aplikasi dijalankan di environment berbeda: dependency tidak cocok, versi Node tidak sama, atau konfigurasi server berantakan.

**Docker** menyelesaikan masalah ini dengan mengemas aplikasi ke dalam _container_ yang konsisten, portabel, dan bisa dijalankan di mana saja.  
Artikel ini membahas langkah sederhana membungkus project Next.js (frontend only) ke Docker.

## File yang Dibutuhkan

Untuk deploy sederhana, cukup siapkan 3 file di root project:

- `Dockerfile`
- `.dockerignore`
- `docker-compose.yml`

## 1. Dockerfile

Gunakan pendekatan **multi-stage build** agar image akhir tetap ringan.

```dockerfile title="Dockerfile"
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy manifest

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install deps

RUN npm install -g npm@latest && npm install || true

# Copy source & build

COPY . .
RUN npm run build

# Stage 2: Production

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy deps & hasil build

COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

EXPOSE 3000
CMD ["npm", "start"]
```

Penjelasan singkat:

- Stage pertama (`builder`): install dependency + build Next.js.
- Stage kedua (`runner`): hanya ambil hasil build, lebih ramping untuk produksi.

## 2. .dockerignore

Agar build lebih cepat dan image lebih kecil, abaikan file yang tidak perlu:

```dockerignore title=".dockerignore"
node_modules
.docker
.git
Dockerfile
.dockerignore
*.log
```

## 3. docker-compose.yml

Dengan docker-compose, jalankan project cukup satu perintah:

```yaml title="docker-compose.yml"
services:
  frontend:
    build: .
    container_name: nextjs-frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: always
```

## Menjalankan Aplikasi

Buka terminal di root project lalu jalankan:

```bash title="Terminal"
docker compose up -d --build

# cek container

docker compose ps

# lihat log

docker compose logs -f frontend
```

Setelah itu, buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## Kesimpulan

Dengan konfigurasi sederhana ini, kamu sudah bisa:

- Membuat **Dockerfile** untuk membangun dan menjalankan Next.js di container.
- Menggunakan **.dockerignore** supaya image tetap kecil.
- Menjalankan aplikasi hanya dengan **docker-compose**.

Hasil akhirnya: aplikasi Next.js bisa berjalan di environment apa pun dengan konsisten, ringan, dan mudah dikelola. Untuk produksi, tinggal tambahkan reverse proxy seperti **Nginx**, **Caddy**, atau **Traefik** untuk domain dan SSL.
