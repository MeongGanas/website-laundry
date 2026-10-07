<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['kiloan', 'satuan'])->default('kiloan');
            $table->string('unit')->default('kg'); // kg, pcs, meter, pasang
            $table->decimal('price', 12, 2);
            $table->integer('estimated_hours')->default(48); // estimasi pengerjaan dalam jam
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};

