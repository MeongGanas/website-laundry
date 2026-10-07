# Laundry - Fullstack Web Application

Aplikasi sistem manajemen laundry modern fullstack menggunakan **React (Vite + Tailwind CSS + shadcn/ui)**, **Laravel 11 REST API**, dan **MariaDB**.

---

## 🚀 Menjalankan di Lingkungan Development (Lokal)

### 1. Backend (Docker Container)
Pastikan Docker Desktop aktif di komputer Anda:
```powershell
# Menjalankan container Laravel, Nginx, MariaDB, phpMyAdmin
docker compose up -d

# Menjalankan migration & seed (jika belum dijalankan)
docker compose exec server php artisan migrate --seed
```
- **Laravel API**: `http://localhost:8000`
- **phpMyAdmin**: `http://localhost:8080` (User: `laundry_user`, Pass: `laundry_pass` atau User: `root`, Pass: `root_pass`)

### 2. Frontend (React Dev Server)
Buka terminal baru di folder `client`:
```powershell
cd client
npm run dev
```
- **Web App**: `http://localhost:5173`

---

## 🔑 Akun Bawaan (Default Credentials)

| Role | Email | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Admin / Owner** | `admin@laundry.com` | `password` | Akses penuh dashboard, layanan, pelanggan |
| **Kasir Outlet** | `kasir@laundry.com` | `password` | Akses POS, antrian cucian, buat order |

---

## 🌐 Alur Aplikasi & Fitur

1. **Portal Publik (Pelanggan)**:
   - **Katalog Layanan & Tarif**: Menampilkan daftar harga kiloan & satuan.
   - **Pelacakan Resi (`/track`)**: Masukkan nomor nota (misal `TRX-20261007-0001`) atau nomor HP untuk melihat timeline progres pencucian secara real-time (*Baru* $\rightarrow$ *Cuci* $\rightarrow$ *Kering* $\rightarrow$ *Setrika* $\rightarrow$ *Siap* $\rightarrow$ *Selesai*).
2. **POS Kasir (`/admin/pos`)**:
   - Pencarian otomatis pelanggan lama atau daftar pelanggan baru langsung.
   - Tambah multi-layanan (kiloan dengan desimal berat misal 4.5 kg, bed cover satuan).
   - Pilihan parfum (Lavender, Akasia, Ocean Fresh, dll).
   - Pembayaran: Lunas (kalkulator kembalian) atau Bayar Saat Ambil.
   - Simpan langsung memunculkan **Cetak Struk Thermal (58mm/80mm)** dan tombol **Kirim WhatsApp**.
3. **Papan Antrian Cucian (`/admin/orders`)**:
   - Kanban board status cucian dengan tombol 1-klik untuk memajukan status.
   - Fitur pelunasan instan saat cucian diambil.

---

## 📦 Panduan Deployment Produksi

### 1. Deploy Frontend ke Vercel
1. Upload folder `client` ke repository GitHub Anda (atau import langsung di dashboard Vercel).
2. Di pengaturan proyek Vercel:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Environment Variables**:
     - `VITE_API_BASE_URL` = `https://api.domain-anda.com/api` (URL API server Armbian Anda).
3. Klik **Deploy**.

### 2. Deploy Backend ke Server Armbian (Tanpa Docker)
Karena server Anda menggunakan Armbian (PHP 8.5, MariaDB 11.8, Nginx 1.28):
1. Clone folder `server` ke `/var/www/laundry/server`.
2. Salin environment dan atur database lokal MariaDB Anda:
   ```bash
   cp .env.example .env
   # Edit .env dengan DB_HOST=127.0.0.1, DB_DATABASE, DB_USERNAME, DB_PASSWORD
   ```
3. Install dependencies & optimize:
   ```bash
   composer install --no-dev --optimize-autoloader
   php artisan key:generate
   php artisan migrate --seed
   php artisan config:cache
   php artisan route:cache
   ```
4. Salin konfigurasi Nginx dari `server/armbian-nginx.conf.example` ke `/etc/nginx/sites-available/laundry-api` lalu aktifkan dan reload Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/laundry-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

