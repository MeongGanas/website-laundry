<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Customer;
use App\Models\Service;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusLog;
use App\Models\Payment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users (Admin & Kasir)
        $admin = User::create([
            'name' => 'Owner Laundry',
            'email' => 'admin@laundry.com',
            'phone' => '081234567890',
            'role' => 'admin',
            'is_active' => true,
            'password' => Hash::make('password'),
        ]);

        $kasir = User::create([
            'name' => 'Rina (Kasir Outlet)',
            'email' => 'kasir@laundry.com',
            'phone' => '089876543210',
            'role' => 'kasir',
            'is_active' => true,
            'password' => Hash::make('password'),
        ]);

        // 2. Layanan (Services)
        $services = [
            [
                'name' => 'Cuci Kering Setrika Reguler',
                'category' => 'kiloan',
                'unit' => 'kg',
                'price' => 8000,
                'estimated_hours' => 48,
                'description' => 'Cuci bersih, wangi, kering maksimal, dan disetrika rapi (2 Hari)',
                'is_active' => true,
            ],
            [
                'name' => 'Cuci Kering Setrika Express',
                'category' => 'kiloan',
                'unit' => 'kg',
                'price' => 12000,
                'estimated_hours' => 24,
                'description' => 'Layanan selesai dalam 24 jam',
                'is_active' => true,
            ],
            [
                'name' => 'Cuci Kering Setrika Kilat',
                'category' => 'kiloan',
                'unit' => 'kg',
                'price' => 16000,
                'estimated_hours' => 6,
                'description' => 'Selesai dalam 6 jam di hari yang sama',
                'is_active' => true,
            ],
            [
                'name' => 'Setrika Saja Reguler',
                'category' => 'kiloan',
                'unit' => 'kg',
                'price' => 5000,
                'estimated_hours' => 24,
                'description' => 'Pakaian sudah dicuci sendiri, kami setrika rapi dan wangi',
                'is_active' => true,
            ],
            [
                'name' => 'Cuci Kering Lipat (Tanpa Setrika)',
                'category' => 'kiloan',
                'unit' => 'kg',
                'price' => 6000,
                'estimated_hours' => 24,
                'description' => 'Cuci bersih kering dan dilipat rapi',
                'is_active' => true,
            ],
            [
                'name' => 'Cuci Bed Cover Besar (King/Queen)',
                'category' => 'satuan',
                'unit' => 'pcs',
                'price' => 25000,
                'estimated_hours' => 48,
                'description' => 'Bed cover ukuran besar dicuci bersih & higienis',
                'is_active' => true,
            ],
            [
                'name' => 'Cuci Bed Cover Kecil (Single)',
                'category' => 'satuan',
                'unit' => 'pcs',
                'price' => 20000,
                'estimated_hours' => 48,
                'description' => 'Bed cover ukuran single',
                'is_active' => true,
            ],
            [
                'name' => 'Cuci Sepatu Sneaker',
                'category' => 'satuan',
                'unit' => 'pasang',
                'price' => 25000,
                'estimated_hours' => 48,
                'description' => 'Deep cleaning sepatu luar dan dalam',
                'is_active' => true,
            ],
            [
                'name' => 'Cuci Jas / Blazer',
                'category' => 'satuan',
                'unit' => 'pcs',
                'price' => 25000,
                'estimated_hours' => 48,
                'description' => 'Perawatan khusus pakaian formal',
                'is_active' => true,
            ],
            [
                'name' => 'Cuci Boneka Besar',
                'category' => 'satuan',
                'unit' => 'pcs',
                'price' => 20000,
                'estimated_hours' => 48,
                'description' => 'Pencucian lembut boneka ukuran sedang-besar',
                'is_active' => true,
            ],
        ];

        $createdServices = [];
        foreach ($services as $svc) {
            $createdServices[] = Service::create($svc);
        }

        // 3. Customers
        $cust1 = Customer::create([
            'name' => 'Budi Santoso',
            'phone' => '081234567891',
            'address' => 'Jl. Melati No. 12, RT 02/05',
            'notes' => 'Pelanggan langganan setiap minggu',
        ]);

        $cust2 = Customer::create([
            'name' => 'Siti Nurhaliza',
            'phone' => '085678901234',
            'address' => 'Jl. Anggrek No. 88B',
            'notes' => 'Suka wangi Lavender',
        ]);

        $cust3 = Customer::create([
            'name' => 'Ahmad Dani',
            'phone' => '087789012345',
            'address' => 'Komp. Permata Regency Blok C4',
            'notes' => null,
        ]);

        // 4. Sample Order 1 (Sedang Dicuci)
        $order1 = Order::create([
            'invoice_number' => 'TRX-' . date('Ymd') . '-0001',
            'customer_id' => $cust1->id,
            'user_id' => $kasir->id,
            'status' => 'washing',
            'payment_status' => 'paid',
            'total_amount' => 36000,
            'discount_amount' => 0,
            'paid_amount' => 36000,
            'payment_method' => 'cash',
            'perfume' => 'Lavender',
            'estimated_completion' => Carbon::now()->addDays(2),
            'notes' => 'Baju kemeja putih jangan disatukan dengan baju luntur',
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'service_id' => $createdServices[0]->id, // Cuci Komplit Reguler
            'quantity' => 4.5,
            'unit_price' => 8000,
            'subtotal' => 36000,
            'item_notes' => '4.5 kg pakaian harian',
        ]);

        Payment::create([
            'order_id' => $order1->id,
            'user_id' => $kasir->id,
            'amount' => 36000,
            'payment_method' => 'cash',
            'reference_no' => null,
            'notes' => 'Uang pas',
            'paid_at' => Carbon::now(),
        ]);

        OrderStatusLog::create([
            'order_id' => $order1->id,
            'user_id' => $kasir->id,
            'previous_status' => null,
            'new_status' => 'pending',
            'note' => 'Pesanan diterima di kasir',
        ]);

        OrderStatusLog::create([
            'order_id' => $order1->id,
            'user_id' => $kasir->id,
            'previous_status' => 'pending',
            'new_status' => 'washing',
            'note' => 'Pakaian masuk mesin cuci #1',
        ]);

        // 5. Sample Order 2 (Siap Diambil - Belum Lunas)
        $order2 = Order::create([
            'invoice_number' => 'TRX-' . date('Ymd') . '-0002',
            'customer_id' => $cust2->id,
            'user_id' => $kasir->id,
            'status' => 'ready',
            'payment_status' => 'unpaid',
            'total_amount' => 45000,
            'discount_amount' => 0,
            'paid_amount' => 0,
            'payment_method' => null,
            'perfume' => 'Akasia',
            'estimated_completion' => Carbon::now()->addDay(),
            'notes' => 'Bed cover + 1 kemeja kantor',
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'service_id' => $createdServices[5]->id, // Bed Cover Besar
            'quantity' => 1,
            'unit_price' => 25000,
            'subtotal' => 25000,
            'item_notes' => '1 Bed Cover King Size',
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'service_id' => $createdServices[1]->id, // Express
            'quantity' => 1.67,
            'unit_price' => 12000,
            'subtotal' => 20000,
            'item_notes' => 'Baju express',
        ]);

        OrderStatusLog::create([
            'order_id' => $order2->id,
            'user_id' => $kasir->id,
            'previous_status' => null,
            'new_status' => 'pending',
            'note' => 'Pesanan masuk',
        ]);

        OrderStatusLog::create([
            'order_id' => $order2->id,
            'user_id' => $kasir->id,
            'previous_status' => 'pending',
            'new_status' => 'washing',
            'note' => 'Sedang dicuci',
        ]);

        OrderStatusLog::create([
            'order_id' => $order2->id,
            'user_id' => $kasir->id,
            'previous_status' => 'washing',
            'new_status' => 'ironing',
            'note' => 'Sedang disetrika & packing',
        ]);

        OrderStatusLog::create([
            'order_id' => $order2->id,
            'user_id' => $kasir->id,
            'previous_status' => 'ironing',
            'new_status' => 'ready',
            'note' => 'Siap diambil di rak B-02',
        ]);

        // 6. Sample Order 3 (Selesai kemarin)
        $order3 = Order::create([
            'invoice_number' => 'TRX-' . Carbon::yesterday()->format('Ymd') . '-0001',
            'customer_id' => $cust3->id,
            'user_id' => $admin->id,
            'status' => 'completed',
            'payment_status' => 'paid',
            'total_amount' => 50000,
            'discount_amount' => 0,
            'paid_amount' => 50000,
            'payment_method' => 'qris',
            'perfume' => 'Ocean Fresh',
            'estimated_completion' => Carbon::yesterday(),
            'completed_at' => Carbon::yesterday()->addHours(6),
            'notes' => 'Cuci 2 pasang sepatu',
        ]);

        OrderItem::create([
            'order_id' => $order3->id,
            'service_id' => $createdServices[7]->id, // Sepatu
            'quantity' => 2,
            'unit_price' => 25000,
            'subtotal' => 50000,
            'item_notes' => '2 pasang sneaker putih & hitam',
        ]);

        Payment::create([
            'order_id' => $order3->id,
            'user_id' => $admin->id,
            'amount' => 50000,
            'payment_method' => 'qris',
            'reference_no' => 'QRIS-REF-99881',
            'notes' => 'Pembayaran via QRIS ShopeePay',
            'paid_at' => Carbon::yesterday(),
        ]);
    }
}
