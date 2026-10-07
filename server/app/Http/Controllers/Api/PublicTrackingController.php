<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class PublicTrackingController extends Controller
{
    public function track($query)
    {
        // Bisa lacak pakai Nomor Invoice (TRX-...) atau Nomor HP Pelanggan
        $order = Order::with(['customer:id,name,phone', 'items.service:id,name,category,unit', 'statusLogs'])
            ->where('invoice_number', $query)
            ->orWhereHas('customer', function ($q) use ($query) {
                $q->where('phone', $query);
            })
            ->orderBy('created_at', 'desc')
            ->first();

        if (! $order) {
            return response()->json([
                'message' => 'Pesanan dengan nomor nota / no HP tersebut tidak ditemukan.',
            ], 404);
        }

        // Mask phone number for privacy: 081234567891 -> 0812****7891
        $phone = $order->customer->phone;
        $maskedPhone = strlen($phone) > 6 
            ? substr($phone, 0, 4) . '****' . substr($phone, -4) 
            : $phone;

        return response()->json([
            'invoice_number' => $order->invoice_number,
            'customer_name' => $order->customer->name,
            'customer_phone' => $maskedPhone,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'total_amount' => $order->total_amount,
            'paid_amount' => $order->paid_amount,
            'perfume' => $order->perfume,
            'created_at' => $order->created_at,
            'estimated_completion' => $order->estimated_completion,
            'completed_at' => $order->completed_at,
            'items' => $order->items->map(function ($item) {
                return [
                    'service_name' => $item->service->name,
                    'quantity' => $item->quantity,
                    'unit' => $item->service->unit,
                    'subtotal' => $item->subtotal,
                ];
            }),
            'timeline' => $order->statusLogs->map(function ($log) {
                return [
                    'status' => $log->new_status,
                    'note' => $log->note,
                    'time' => $log->created_at,
                ];
            }),
        ]);
    }
}

