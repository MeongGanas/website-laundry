<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusLog;
use App\Models\Payment;
use App\Models\Service;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['customer', 'user', 'items.service'])
            ->orderBy('created_at', 'desc');

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($paymentStatus = $request->input('payment_status')) {
            $query->where('payment_status', $paymentStatus);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%")
                         ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        if ($startDate = $request->input('start_date')) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate = $request->input('end_date')) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        // Jika request minta all untuk board
        if ($request->boolean('all')) {
            return response()->json($query->get());
        }

        return response()->json($query->paginate($request->input('per_page', 15)));
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'customer_name' => 'required_without:customer_id|string',
            'customer_phone' => 'required_without:customer_id|string',
            'customer_address' => 'nullable|string',
            'perfume' => 'nullable|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'required|exists:services,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.item_notes' => 'nullable|string',
            'payment_status' => 'required|in:unpaid,paid',
            'payment_method' => 'nullable|required_if:payment_status,paid|string',
            'paid_amount' => 'nullable|numeric|min:0',
        ]);

        return DB::transaction(function () use ($request) {
            // 1. Tentukan atau buat Pelanggan
            if ($request->filled('customer_id')) {
                $customerId = $request->customer_id;
            } else {
                $customer = Customer::firstOrCreate(
                    ['phone' => $request->customer_phone],
                    [
                        'name' => $request->customer_name,
                        'address' => $request->customer_address,
                    ]
                );
                $customerId = $customer->id;
            }

            // 2. Generate Nomor Invoice Unik: TRX-YYYYMMDD-XXXX
            $datePrefix = date('Ymd');
            $latestOrder = Order::where('invoice_number', 'like', "TRX-{$datePrefix}-%")
                ->lockForUpdate()
                ->orderBy('id', 'desc')
                ->first();

            $nextNumber = 1;
            if ($latestOrder) {
                $parts = explode('-', $latestOrder->invoice_number);
                $nextNumber = intval(end($parts)) + 1;
            }
            $invoiceNumber = sprintf('TRX-%s-%04d', $datePrefix, $nextNumber);

            // 3. Hitung Item & Estimasi Waktu Selesai
            $totalAmount = 0;
            $maxHours = 24; // default
            $preparedItems = [];

            foreach ($request->items as $itemData) {
                $service = Service::findOrFail($itemData['service_id']);
                $subtotal = round($service->price * $itemData['quantity'], 2);
                $totalAmount += $subtotal;

                if ($service->estimated_hours > $maxHours) {
                    $maxHours = $service->estimated_hours;
                }

                $preparedItems[] = [
                    'service_id' => $service->id,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $service->price,
                    'subtotal' => $subtotal,
                    'item_notes' => $itemData['item_notes'] ?? null,
                ];
            }

            $estimatedCompletion = Carbon::now()->addHours($maxHours);
            $paidAmount = $request->payment_status === 'paid' ? ($request->paid_amount ?: $totalAmount) : 0;

            // 4. Buat Order
            $order = Order::create([
                'invoice_number' => $invoiceNumber,
                'customer_id' => $customerId,
                'user_id' => $request->user() ? $request->user()->id : null,
                'status' => 'pending',
                'payment_status' => $request->payment_status,
                'total_amount' => $totalAmount,
                'discount_amount' => 0,
                'paid_amount' => $paidAmount,
                'payment_method' => $request->payment_method,
                'perfume' => $request->perfume ?: 'Reguler',
                'estimated_completion' => $estimatedCompletion,
                'notes' => $request->notes,
            ]);

            // 5. Simpan Order Items
            foreach ($preparedItems as $pItem) {
                $order->items()->create($pItem);
            }

            // 6. Buat Log Status Awal
            OrderStatusLog::create([
                'order_id' => $order->id,
                'user_id' => $request->user() ? $request->user()->id : null,
                'previous_status' => null,
                'new_status' => 'pending',
                'note' => 'Pesanan baru diterima di kasir',
            ]);

            // 7. Jika Dibayar di Kasir, Catat Payment
            if ($request->payment_status === 'paid' && $paidAmount > 0) {
                Payment::create([
                    'order_id' => $order->id,
                    'user_id' => $request->user() ? $request->user()->id : null,
                    'amount' => $paidAmount,
                    'payment_method' => $request->payment_method ?: 'cash',
                    'notes' => 'Pembayaran saat order dibuat',
                    'paid_at' => Carbon::now(),
                ]);
            }

            $order->load(['customer', 'items.service', 'statusLogs', 'payments']);

            return response()->json([
                'message' => 'Pesanan berhasil dibuat',
                'order' => $order,
            ], 201);
        });
    }

    public function show($id)
    {
        $order = Order::with(['customer', 'user', 'items.service', 'statusLogs.user', 'payments.user'])
            ->findOrFail($id);

        return response()->json($order);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,washing,drying,ironing,ready,completed,cancelled',
            'note' => 'nullable|string',
        ]);

        $prevStatus = $order->status;
        $newStatus = $request->status;

        $order->status = $newStatus;
        if ($newStatus === 'completed' && ! $order->completed_at) {
            $order->completed_at = Carbon::now();
        }
        $order->save();

        OrderStatusLog::create([
            'order_id' => $order->id,
            'user_id' => $request->user() ? $request->user()->id : null,
            'previous_status' => $prevStatus,
            'new_status' => $newStatus,
            'note' => $request->note ?: "Status diubah menjadi: {$newStatus}",
        ]);

        $order->load(['statusLogs.user']);

        return response()->json([
            'message' => 'Status pesanan berhasil diperbarui',
            'order' => $order,
        ]);
    }

    public function addPayment(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:cash,transfer,qris',
            'reference_no' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request, $order) {
            $payment = Payment::create([
                'order_id' => $order->id,
                'user_id' => $request->user() ? $request->user()->id : null,
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'reference_no' => $request->reference_no,
                'notes' => $request->notes,
                'paid_at' => Carbon::now(),
            ]);

            $newPaidAmount = $order->paid_amount + $request->amount;
            $order->paid_amount = $newPaidAmount;
            $order->payment_method = $request->payment_method;

            if ($newPaidAmount >= $order->total_amount) {
                $order->payment_status = 'paid';
            }

            $order->save();
            $order->load(['payments', 'customer']);

            return response()->json([
                'message' => 'Pembayaran berhasil dicatat',
                'order' => $order,
            ]);
        });
    }
}

