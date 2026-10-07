import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Printer,
  Sparkles,
  Layers,
  Shirt
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ThermalReceipt } from '@/components/receipt/ThermalReceipt'
import { formatRupiah, formatDate } from '@/lib/utils'
import api from '@/services/api'

export function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [receiptOpen, setReceiptOpen] = useState(false)

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard')
      setStats(res.data)
    } catch (err) {
      console.error('Failed to load dashboard stats', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const handleOpenReceipt = (order) => {
    setSelectedOrder(order)
    setReceiptOpen(true)
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Memuat data dashboard...</div>
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Ringkasan Operasional Outlet
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau arus kas masuk dan antrian proses laundry hari ini secara *real-time*.
          </p>
        </div>
        <Link to="/admin/pos">
          <Button className="font-semibold shadow-sm">
            <ShoppingCart className="w-4 h-4 mr-2" />
            + Buat Order Kasir Baru
          </Button>
        </Link>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Pendapatan Hari Ini
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {formatRupiah(stats?.income_today)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Kas masuk dari transaksi lunas hari ini</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Pendapatan Bulan Ini
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {formatRupiah(stats?.income_this_month)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Akumulasi pendapatan bulan berjalan</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Cucian Dalam Proses
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {stats?.active_orders} <span className="text-xs font-normal text-slate-500">Nota</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Sedang dicuci, dikeringkan, atau disetrika</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Siap Diambil
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-purple-700 tabular-nums">
              {stats?.ready_orders} <span className="text-xs font-normal text-slate-500">Nota</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Sudah rapi & menunggu pelanggan datang</p>
          </CardContent>
        </Card>
      </div>

      {/* Laundry Status Pipeline Breakdown */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-bold text-slate-900">
              Status Pipa Alur Cucian Aktif
            </CardTitle>
            <Link to="/admin/orders" className="text-xs text-primary font-semibold hover:underline flex items-center">
              Buka Papan Antrian <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-center">
              <div className="text-xs text-amber-700 font-semibold mb-1">Baru Masuk</div>
              <div className="text-2xl font-extrabold text-amber-900 tabular-nums">{stats?.status_breakdown?.pending || 0}</div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-center">
              <div className="text-xs text-blue-700 font-semibold mb-1">Sedang Dicuci</div>
              <div className="text-2xl font-extrabold text-blue-900 tabular-nums">{stats?.status_breakdown?.washing || 0}</div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/80 text-center">
              <div className="text-xs text-orange-700 font-semibold mb-1">Pengeringan</div>
              <div className="text-2xl font-extrabold text-orange-900 tabular-nums">{stats?.status_breakdown?.drying || 0}</div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/80 text-center">
              <div className="text-xs text-purple-700 font-semibold mb-1">Disetrika</div>
              <div className="text-2xl font-extrabold text-purple-900 tabular-nums">{stats?.status_breakdown?.ironing || 0}</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-center">
              <div className="text-xs text-emerald-700 font-semibold mb-1">Siap Diambil</div>
              <div className="text-2xl font-extrabold text-emerald-900 tabular-nums">{stats?.status_breakdown?.ready || 0}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-center">
              <div className="text-xs text-slate-600 font-semibold mb-1">Selesai</div>
              <div className="text-2xl font-extrabold text-slate-800 tabular-nums">{stats?.status_breakdown?.completed || 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders List */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-900">
            Transaksi Pesanan Terbaru
          </CardTitle>
          <Link to="/admin/orders">
            <Button variant="outline" size="sm" className="text-xs">
              Lihat Semua Transaksi
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                <tr>
                  <th className="p-4">No. Invoice</th>
                  <th className="p-4">Pelanggan</th>
                  <th className="p-4">Status Cucian</th>
                  <th className="p-4">Status Bayar</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Tanggal Masuk</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recent_orders?.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900 tabular-nums">
                      {ord.invoice_number}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{ord.customer?.name}</div>
                      <div className="text-[10px] text-slate-400 tabular-nums">{ord.customer?.phone}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant={ord.status} className="uppercase text-[10px] font-bold">
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={ord.payment_status === 'paid' ? 'paid' : 'unpaid'} className="uppercase text-[10px] font-bold">
                        {ord.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-slate-900 tabular-nums">
                      {formatRupiah(ord.total_amount)}
                    </td>
                    <td className="p-4 text-slate-500 tabular-nums">
                      {formatDate(ord.created_at)}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenReceipt(ord)}
                        className="text-xs text-slate-600 hover:text-slate-900 h-8 px-2"
                      >
                        <Printer className="w-3.5 h-3.5 mr-1" />
                        Cetak Nota
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Thermal Receipt Modal Dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-bold">Struk Transaksi</DialogTitle>
          </DialogHeader>
          <ThermalReceipt order={selectedOrder} onClose={() => setReceiptOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

