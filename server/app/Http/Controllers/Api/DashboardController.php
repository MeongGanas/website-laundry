<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Customer;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        // 1. Pemasukan
        $incomeToday = Payment::whereDate('paid_at', $today)->sum('amount');
        $incomeThisMonth = Payment::where('paid_at', '>=', $thisMonth)->sum('amount');

        // 2. Order counts
        $ordersToday = Order::whereDate('created_at', $today)->count();
        $activeOrders = Order::whereNotIn('status', ['completed', 'cancelled'])->count();
        $readyOrders = Order::where('status', 'ready')->count();
        $totalCustomers = Customer::count();

        // 3. Breakdown status for Kanban / Charts
        $statusBreakdown = [
            'pending' => Order::where('status', 'pending')->count(),
            'washing' => Order::where('status', 'washing')->count(),
            'drying' => Order::where('status', 'drying')->count(),
            'ironing' => Order::where('status', 'ironing')->count(),
            'ready' => Order::where('status', 'ready')->count(),
            'completed' => Order::where('status', 'completed')->count(),
        ];

        // 4. Recent Orders
        $recentOrders = Order::with(['customer', 'items.service'])
            ->orderBy('created_at', 'desc')
            ->take(7)
            ->get();

        return response()->json([
            'income_today' => floatval($incomeToday),
            'income_this_month' => floatval($incomeThisMonth),
            'orders_today' => $ordersToday,
            'active_orders' => $activeOrders,
            'ready_orders' => $readyOrders,
            'total_customers' => $totalCustomers,
            'status_breakdown' => $statusBreakdown,
            'recent_orders' => $recentOrders,
        ]);
    }
}

