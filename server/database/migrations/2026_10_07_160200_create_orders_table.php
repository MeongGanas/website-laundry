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
            $table->string('invoice_number')->unique(); // e.g. TRX-20261007-0001
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // Kasir / Staff
            $table->enum('status', [
                'pending',    // Baru Diterima
                'washing',    // Sedang Dicuci
                'drying',     // Sedang Dikeringkan
                'ironing',    // Sedang Disetrika
                'ready',      // Siap Diambil
                'completed',  // Selesai / Diambil
                'cancelled'   // Dibatalkan
            ])->default('pending');
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid');
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->string('payment_method')->nullable(); // cash, transfer, qris
            $table->string('perfume')->nullable(); // Lavender, Akasia, dll.
            $table->dateTime('estimated_completion')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

