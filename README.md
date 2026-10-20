# Laundry - Fullstack Management & POS Web Application

Aplikasi sistem manajemen laundry modern fullstack yang mencakup **Portal Publik Pelanggan** (katalog layanan & cek resi/nota real-time), **Sistem Kasir (Point of Sale / POS)** kilat dengan cetak struk thermal 58mm/80mm & kirim WhatsApp, serta **Dashboard Manajemen Admin/Owner**.

Dibangun dengan arsitektur modern:
- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, shadcn/ui, Radix UI.
- **Backend**: Laravel 11 REST API, Laravel Sanctum, PHP 8.3 / 8.5.
- **Database**: MariaDB / MySQL.
- **Deployment**: Frontend di Vercel, Backend di Server Mandiri (Docker atau Native Linux/Armbian via Cloudflare Tunnel).

---

## 🔑 Akun Bawaan (Default Credentials)

Setelah menjalankan seeder database, akun berikut siap digunakan:

| Role | Email | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Admin / Owner** | `admin@laundry.com` | `password` | Akses penuh dashboard omset, keuangan, master layanan & tarif, data pelanggan |
| **Kasir Outlet** | `kasir@laundry.com` | `password` | Input transaksi POS, pilih parfum, cetak struk thermal, WhatsApp, kelola papan antrian cucian |

---

## 🚀 Menjalankan di Lingkungan Development (Lokal)

### 1. Backend (Docker Container)

Pastikan Docker Desktop / Docker Engine aktif di komputer Anda:

```bash
# 1. Salin environment jika belum ada
cp server/.env.example server/.env

# 2. Jalankan container (Laravel PHP-FPM, Nginx, MariaDB, phpMyAdmin)
docker compose up -d --build

# 3. PENTING: Install dependensi Composer di dalam container
docker compose exec server composer install

# 4. Generate Application Key Laravel
docker compose exec server php artisan key:generate

# 5. Atur permission folder storage & cache
docker compose exec server chmod -R 775 storage bootstrap/cache

# 6. Jalankan migrasi tabel dan pengisian data demo (seeder)
docker compose exec server php artisan migrate --seed

# 7. Buat symlink storage
docker compose exec server php artisan storage:link
```

- **Laravel API**: `http://localhost:8000/api`
- **phpMyAdmin**: `http://localhost:8080` (User: `laundry_user`, Password: `laundry_pass` atau User: `root`, Password: `root_pass`)

---

### 2. Frontend (React Client)

Buka terminal baru di folder `client`:

```bash
cd client

# 1. Install dependensi
npm install

# 2. Jalankan development server
npm run dev
```

- **Web App**: `http://localhost:5173`

---

## 🌐 Fitur Utama Aplikasi

1. **Portal Publik (Pelanggan)**:
   - **Katalog Layanan & Tarif**: Menampilkan paket cucian kiloan dan satuan secara transparan.
   - **Pelacakan Nota Real-Time (`/track`)**: Pelanggan cukup memasukkan nomor nota (misal `TRX-20261007-0001`) atau nomor WhatsApp untuk melihat progres cucian (*Baru Masuk* $\rightarrow$ *Dicuci* $\rightarrow$ *Pengeringan* $\rightarrow$ *Disetrika* $\rightarrow$ *Siap Diambil* $\rightarrow$ *Selesai*).
   - **Desain Modern Borderless**: UI bersih, responsif mobile-first, dan transisi halus dengan Framer Motion.

2. **Kasir / Point of Sale (`/admin/pos`)**:
   - Pencarian cerdas pelanggan (auto-complete via No. HP/Nama) atau tambah pelanggan baru seketika.
   - Input multi-layanan (kiloan dengan berat desimal misal `3.5 kg`, bed cover, sepatu, dll).
   - Pilihan aroma parfum (Lavender, Ocean Fresh, Akasia, Sakura, dll) dan catatan khusus pakaian.
   - Kalkulator pembayaran tunai (hitung kembalian otomatis), QRIS, Transfer, atau opsi *Bayar Nanti*.
   - **Cetak Struk Thermal (58mm & 80mm)**: Menggunakan *isolated iframe print engine* bebas dari artefak popup modal, pas di kertas thermal roll.
   - **Kirim Nota Otomatis ke WhatsApp**: Mengirim rincian nota & tautan pelacakan online ke WhatsApp pelanggan dengan 1 klik.

3. **Papan Antrian Cucian Kanban (`/admin/orders`)**:
   - Alur visual status pengerjaan cucian per tahap operasional.
   - Tombol 1-klik untuk memajukan status cucian.
   - Modal pelunasan pembayaran instan saat pelanggan datang mengambil pakaian.

4. **Dashboard & Analisis Bisnis (`/admin/dashboard`)**:
   - Metrik omset hari ini, omset bulan ini, total pesanan aktif, dan jumlah pelanggan.
   - Ringkasan pipa status antrian cucian aktif dan tabel riwayat transaksi terbaru.

5. **Master Data (`/admin/customers` & `/admin/services`)**:
   - Pengelolaan daftar harga, tarif per unit, durasi estimasi jam, dan database pelanggan.

---

## 📦 Panduan Deployment ke Server Produksi

### 1. Frontend ke Vercel

1. Hubungkan repository GitHub Anda ke [Vercel](https://vercel.com).
2. Konfigurasi proyek di Vercel:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
3. Tambahkan **Environment Variable**:
   - `VITE_API_BASE_URL` = `https://api.domain-anda.com/api` (misal: `https://api.meongganas.my.id/api`)
4. Deploy. File `client/vercel.json` sudah menyediakan konfigurasi *SPA rewrite* otomatis.

---

### 2. Backend ke Server Mandiri (Pilihan A: Docker Compose)

Jika server Anda memiliki Docker & Docker Compose:

```bash
git clone <URL_REPO_ANDA>
cd laundy_jerry

cp server/.env.example server/.env
# Sesuaikan APP_URL dan database di server/.env

docker compose up -d --build
docker compose exec server composer install
docker compose exec server php artisan key:generate
docker compose exec server chmod -R 775 storage bootstrap/cache
docker compose exec server php artisan migrate --seed
docker compose exec server php artisan storage:link
```

---

### 3. Backend ke Server Mandiri (Pilihan B: Native Linux/Armbian + Cloudflare Tunnel)

Jika server Anda tidak menggunakan Docker (misal Armbian dengan Nginx, PHP 8.5-FPM, dan MariaDB):

1. **Letakkan Proyek**:
   ```bash
   cd /var/www
   git clone <URL_REPO_ANDA> website-laundry
   cd website-laundry/server
   ```

2. **Setup File `.env`**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   Pastikan pengaturan berikut:
   ```env
   APP_NAME=Laundry
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://api.meongganas.my.id

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=laundry_db
   DB_USERNAME=laundry_user
   DB_PASSWORD=laundry_pass
   ```

3. **Install Dependensi & Migrasi**:
   ```bash
   composer install --no-dev --optimize-autoloader
   php artisan key:generate
   php artisan migrate --seed
   php artisan storage:link
   ```

4. **Atur Izin Folder untuk Web Server (`www-data`)**:
   ```bash
   sudo chown -R $USER:www-data storage bootstrap/cache
   sudo chmod -R 775 storage bootstrap/cache
   ```

5. **Konfigurasi Nginx (`/etc/nginx/sites-available/api.meongganas.my.id`)**:
   Gunakan file template dari `server/armbian-nginx.conf.example` atau gunakan konfigurasi berikut:
   ```nginx
   server {
       listen 80;
       server_name api.meongganas.my.id;

       root /var/www/website-laundry/server/public;
       index index.php index.html;
       charset utf-8;

       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }

       location /api/ {
           limit_req zone=api_limit burst=20 nodelay;
           try_files $uri $uri/ /index.php?$query_string;
       }

       location = /api/login {
           limit_req zone=login_limit burst=3 nodelay;
           try_files $uri $uri/ /index.php?$query_string;
       }

       location = /favicon.ico { access_log off; log_not_found off; }
       location = /robots.txt  { access_log off; log_not_found off; }
       error_page 404 /index.php;

       location ~ \.php$ {
           include snippets/fastcgi-php.conf;
           fastcgi_pass unix:/var/run/php/php8.5-fpm.sock;
           fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
           include fastcgi_params;
           fastcgi_hide_header X-Powered-By;
       }

       location ~ /\.(?!well-known).* {
           deny all;
       }
   }
   ```

6. **Aktifkan Virtual Host & Restart Nginx**:
   ```bash
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo ln -sf /etc/nginx/sites-available/api.meongganas.my.id /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## 🛠️ Panduan Troubleshooting Sering Terjadi

### 1. `Warning: require(/var/www/server/vendor/autoload.php): Failed to open stream`
- **Penyebab**: Dependensi Composer belum di-install di dalam container/server.
- **Solusi**: Jalankan perintah `composer install` terlebih dahulu:
  - Di Docker: `docker compose exec server composer install`
  - Di Native Linux: `cd /var/www/website-laundry/server && composer install`

### 2. `SQLSTATE[HY000] [1698] Access denied for user 'laundry_user'@'localhost'`
- **Penyebab**: User database atau database `laundry_db` belum dibuat di MySQL/MariaDB.
- **Solusi**: Masuk ke database sebagai root (`sudo mysql` atau `sudo mariadb`) dan jalankan:
  ```sql
  CREATE DATABASE IF NOT EXISTS laundry_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER IF NOT EXISTS 'laundry_user'@'localhost' IDENTIFIED BY 'laundry_pass';
  CREATE USER IF NOT EXISTS 'laundry_user'@'127.0.0.1' IDENTIFIED BY 'laundry_pass';
  GRANT ALL PRIVILEGES ON laundry_db.* TO 'laundry_user'@'localhost';
  GRANT ALL PRIVILEGES ON laundry_db.* TO 'laundry_user'@'127.0.0.1';
  FLUSH PRIVILEGES;
  EXIT;
  ```

### 3. `502 Bad Gateway` pada Nginx
- **Penyebab**: Nginx tidak dapat menghubungi socket PHP-FPM (misal di Nginx tertulis `php8.3-fpm.sock` padahal server menggunakan `php8.5-fpm.sock`).
- **Solusi**:
  1. Cek socket aktif: `ls -la /var/run/php/`
  2. Samakan baris `fastcgi_pass unix:/var/run/php/php8.5-fpm.sock;` pada konfigurasi Nginx.
  3. Restart Nginx: `sudo systemctl restart nginx`.

### 4. `404 Not Found` Nginx
- **Penyebab**: Path `root` di Nginx salah atau file `public/index.php` tidak ditemukan di direktori tersebut.
- **Solusi**:
  1. Cek path asli dengan `pwd` di folder server Anda.
  2. Pastikan baris `root` di Nginx mengarah ke folder `.../server/public` yang valid.
  3. Matikan default site: `sudo rm -f /etc/nginx/sites-enabled/default`.

---

## 🛡️ Praktik Keamanan & Ketahanan Server

1. **Cloudflare Tunnel (Zero-Trust Inbound)**:
   Karena semua lalu lintas diarahkan via tunnel `cloudflared`, Anda **tidak perlu membuka port 80/443 publik** di router/firewall.
2. **UFW Firewall**:
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```
3. **Nginx Real-IP & Rate Limiting**:
   Tambahkan di `/etc/nginx/nginx.conf` bagian `http { ... }`:
   ```nginx
   server_tokens off;
   set_real_ip_from 127.0.0.1;
   real_ip_header CF-Connecting-IP;
   limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;
   limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;
   ```
4. **Cloudflare Dashboard WAF**:
   - Aktifkan **Bot Fight Mode** di menu *Security* $\rightarrow$ *Bots*.
   - Pasang WAF Rate Limiting untuk `/api/login` (maks 5 request per 10 detik).
   - Aktifkan *Under Attack Mode* bila ada lonjakan traffic tidak wajar.

## 🛠️ Panduan Troubleshooting Sering Terjadi

### 1. `Warning: require(/var/www/server/vendor/autoload.php): Failed to open stream`
- **Penyebab**: Dependensi Composer belum di-install di dalam container/server.
- **Solusi**: Jalankan perintah `composer install` terlebih dahulu:
  - Di Docker: `docker compose exec server composer install`
  - Di Native Linux: `cd /var/www/website-laundry/server && composer install`

### 2. `SQLSTATE[HY000] [1698] Access denied for user 'laundry_user'@'localhost'`
- **Penyebab**: User database atau database `laundry_db` belum dibuat di MySQL/MariaDB.
- **Solusi**: Masuk ke database sebagai root (`sudo mysql` atau `sudo mariadb`) dan jalankan:
  ```sql
  CREATE DATABASE IF NOT EXISTS laundry_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER IF NOT EXISTS 'laundry_user'@'localhost' IDENTIFIED BY 'laundry_pass';
  CREATE USER IF NOT EXISTS 'laundry_user'@'127.0.0.1' IDENTIFIED BY 'laundry_pass';
  GRANT ALL PRIVILEGES ON laundry_db.* TO 'laundry_user'@'localhost';
  GRANT ALL PRIVILEGES ON laundry_db.* TO 'laundry_user'@'127.0.0.1';
  FLUSH PRIVILEGES;
  EXIT;
  ```

### 3. `502 Bad Gateway` pada Nginx
- **Penyebab**: Nginx tidak dapat menghubungi socket PHP-FPM (misal di Nginx tertulis `php8.3-fpm.sock` padahal server menggunakan `php8.5-fpm.sock`).
- **Solusi**:
  1. Cek socket aktif: `ls -la /var/run/php/`
  2. Samakan baris `fastcgi_pass unix:/var/run/php/php8.5-fpm.sock;` pada konfigurasi Nginx.
  3. Restart Nginx: `sudo systemctl restart nginx`.

### 4. `404 Not Found` Nginx
- **Penyebab**: Path `root` di Nginx salah atau file `public/index.php` tidak ditemukan di direktori tersebut.
- **Solusi**:
  1. Cek path asli dengan `pwd` di folder server Anda.
  2. Pastikan baris `root` di Nginx mengarah ke folder `.../server/public` yang valid.
  3. Matikan default site: `sudo rm -f /etc/nginx/sites-enabled/default`.

---

## 🛡️ Praktik Keamanan & Ketahanan Server

1. **Cloudflare Tunnel (Zero-Trust Inbound)**:
   Karena semua lalu lintas diarahkan via tunnel `cloudflared`, Anda **tidak perlu membuka port 80/443 publik** di router/firewall.
2. **UFW Firewall**:
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```
3. **Nginx Real-IP & Rate Limiting**:
   Tambahkan di `/etc/nginx/nginx.conf` bagian `http { ... }`:
   ```nginx
   server_tokens off;
   set_real_ip_from 127.0.0.1;
   real_ip_header CF-Connecting-IP;
   limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;
   limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;
   ```
4. **Cloudflare Dashboard WAF**:
   - Aktifkan **Bot Fight Mode** di menu *Security* $\rightarrow$ *Bots*.
   - Pasang WAF Rate Limiting untuk `/api/login` (maks 5 request per 10 detik).
   - Aktifkan *Under Attack Mode* bila ada lonjakan traffic tidak wajar.

