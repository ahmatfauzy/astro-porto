---
title: "Membuat Database Migrations pada Laravel untuk E-commerce"
description: "Panduan langkah demi langkah pembuatan migrasi database untuk sistem e-commerce dengan Laravel."
date: '2025-05-10'
draft: false
tags:
  - Laravel
categories:
  - Laravel
  - Backend
---

## Pendahuluan

Pada artikel sebelumnya di [https://www.ahmatfauzi.my.id/blog/install-laravel-with-composer](https://www.ahmatfauzi.my.id/blog/install-laravel-with-composer), kita telah membahas cara menginstal Laravel dengan Composer. Kali ini, kita akan melanjutkan dengan membuat migrasi database untuk sistem e-commerce sederhana menggunakan **Laravel Migrations**.

## Apa itu Laravel Migrations?

Laravel Migrations adalah fitur yang memungkinkan kita untuk mengelola struktur database dengan mudah dan konsisten. Dengan menggunakan migrations, kita dapat:

- Membuat dan memodifikasi tabel database
- Melacak perubahan struktur database dalam sistem kontrol versi
- Menerapkan dan membatalkan perubahan database dengan mudah

## Langkah 1: Membuat migrasi untuk tabel Product Categories

Jalankan perintah artisan berikut:

```bash title="Terminal"
php artisan make:migration create_product_categories
```

Isi file migrasi dengan kode berikut:

```php title="database/migrations/xxxx_xx_xx_create_product_categories.php"
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up(): void
{
Schema::create('product_category', function (Blueprint $table) {
$table->id();
$table->string('name');
$table->text('description')->nullable();
$table->string('image')->nullable();
$table->timestamps();
});
}

    public function down(): void
    {
        Schema::dropIfExists('product_category');
    }

};
```

## Langkah 2: Membuat migrasi untuk tabel Products

```bash title="Terminal"
php artisan make:migration create_product_table
```

Isi file migrasi dengan kode berikut:

```php title="database/migrations/xxxx_xx_xx_create_product_table.php"
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up(): void
{
Schema::create('product', function (Blueprint $table) {
$table->id();
$table->string('name');
$table->string('slug')->unique();
$table->text('description')->nullable();
$table->decimal('price', 10, 2);
$table->integer('stock')->default(0);
$table->string('image')->nullable();
$table->foreignId('category_id')->constrained('product_categories')->onDelete('cascade');
$table->timestamps();
});
}

    public function down(): void
    {
        Schema::dropIfExists('products');
    }

};
```

## Langkah 3: Membuat migrasi untuk tabel Customers

```bash title="Terminal"
php artisan make:migration create_customers_table
```

Isi file migrasi dengan kode berikut:

```php title="database/migrations/xxxx_xx_xx_create_customers_table.php"
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up(): void
{
Schema::create('customers', function (Blueprint $table) {
$table->id();
$table->string('name');
$table->string('email')->unique();
$table->text('address')->nullable();
$table->timestamps();
});
}

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }

};
```

## Langkah 4: Membuat migrasi untuk tabel Orders

```bash title="Terminal"
php artisan make:migration create_orders_table
```

Isi file migrasi dengan kode berikut:

```php title="database/migrations/xxxx_xx_xx_create_orders_table.php"
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up(): void
{
Schema::create('orders', function (Blueprint $table) {
$table->id();
$table->unsignedBigInteger('customer_id');
$table->date('order_date');
$table->decimal('total_amount', 10, 2)->default(0.00);
$table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
$table->timestamps();

            $table->foreign('customer_id')->references('id')->on('customers');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }

};
```

## Langkah 5: Membuat migrasi untuk tabel Order Details

```bash title="Terminal"
php artisan make:migration create_order_details_table
```

Isi file migrasi dengan kode berikut:

```php title="database/migrations/xxxx_xx_xx_create_order_details_table.php"
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up(): void
{
Schema::create('order_details', function (Blueprint $table) {
$table->id();
$table->unsignedBigInteger('order_id');
$table->unsignedBigInteger('product_id');
$table->unsignedInteger('quantity')->default(1);
$table->decimal('unit_price', 10, 2);
$table->decimal('subtotal', 10, 2);
$table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders');
            $table->foreign('product_id')->references('id')->on('product_category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }

};
```

## Langkah 6: Menjalankan migrasi

Setelah membuat semua file migrasi, jalankan perintah berikut:

```bash title="Terminal"
php artisan migrate
```

## Kesimpulan

Dalam panduan ini, kita telah berhasil membuat migrasi database untuk sistem e-commerce sederhana menggunakan Laravel Migrations. Struktur database mencakup tabel **customers**, **orders**, **order_details**, dan **products** dengan relasi yang sesuai.

Laravel Migrations sangat membantu dalam mengelola struktur database dengan cara yang terstruktur dan dapat diikuti oleh seluruh tim pengembangan.