import React, { useState, useEffect } from 'react'
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Shirt,
  Sparkles,
  ArrowRight,
  Printer,
  DollarSign,
  AlertCircle
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ThermalReceipt } from '@/components/receipt/ThermalReceipt'
import { formatRupiah, formatDate } from '@/lib/utils'
import api from '@/services/api'

const COLUMNS = [
  { key: 'pending', label: '📥 Baru Masuk', color: 'bg-amber-100/70 text-amber-900', next: 'washing', nextLabel: 'Mulai Cuci' },
  { key: 'washing', label: '🧼 Sedang Dicuci', color: 'bg-blue-100/70 text-blue-900', next: 'drying', nextLabel: 'Keringkan' },
  { key: 'drying', label: '☀️ Pengeringan', color: 'bg-orange-100/70 text-orange-900', next: 'ironing', nextLabel: 'Setrika & Pack' },
  { key: 'ironing', label: '♨️ Disetrika', color: 'bg-purple-100/70 text-purple-900', next: 'ready', nextLabel: 'Siap Diambil' },
  { key: 'ready', label: '📦 Siap Diambil', color: 'bg-emerald-100/70 text-emerald-900', next: 'completed', nextLabel: 'Ambil & Selesai' },
  { key: 'completed', label: '✅ Selesai / Diambil', color: 'bg-slate-200/80 text-slate-800', next: null, nextLabel: null },
]

export function OrderBoardPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [receiptOpen, setReceiptOpen] = useState(false)

  // Payment settle dialog
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState(null)
  const [settleMethod, setSettleMethod] = useState('cash')

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders?all=true')
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to load orders', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Advance status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus })
      fetchOrders()
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  // Handle pickup with payment check
  const handlePickup = (order) => {
    if (order.payment_status === 'unpaid') {
      setPendingPaymentOrder(order)
      setPaymentDialogOpen(true)
    } else {
      handleUpdateStatus(order.id, 'completed')
    }
  }

  // Settle payment and complete
  const handleSettleAndComplete = async () => {
    if (!pendingPaymentOrder) return
    try {
      // 1. Catat pembayaran
      await api.post(`/orders/${pendingPaymentOrder.id}/payments`, {
        amount: pendingPaymentOrder.total_amount - pendingPaymentOrder.paid_amount,
        payment_method: settleMethod,
        notes: 'Pelunasan saat pengambilan pakaian',
      })
      // 2. Ubah status ke completed
      await api.patch(`/orders/${pendingPaymentOrder.id}/status`, { status: 'completed' })
      setPaymentDialogOpen(false)
      fetchOrders()
    } catch (err) {
      console.error('Payment error', err)
    }
  }

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (!search.trim()) return true
    const s = search.toLowerCase()
    return (
      o.invoice_number?.toLowerCase().includes(s) ||
      o.customer?.name?.toLowerCase().includes(s) ||
      o.customer?.phone?.includes(s)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center">
              <Layers className="w-6 h-6 mr-2 text-primary" />
              Papan Antrian & Status Cucian
            </h1>
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 tabular-nums">
              {filteredOrders.length} antrian
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Alur pengerjaan cucian 6 tahapan secara berurutan. Geser ke kanan untuk melihat status tahapan cucian berikutnya.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <label htmlFor="board-search" className="sr-only">Filter invoice atau pelanggan</label>
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              id="board-search"
              placeholder="Filter invoice / pelanggan…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Kanban Board Columns Horizontal Pipeline */}
      {loading ? (
        <div className="text-center py-16 text-xs text-slate-400">Memuat antrian laundry…</div>
      ) : (
        <div className="flex gap-4 items-start overflow-x-auto pb-6 pt-1 px-1 -mx-1 custom-scrollbar">
          {COLUMNS.map((col) => {
            const colOrders = filteredOrders.filter((o) => o.status === col.key)

            return (
              <div
                key={col.key}
                className="flex flex-col w-[290px] sm:w-[310px] shrink-0 bg-slate-100/70 p-3.5 rounded-2xl min-h-[550px] shadow-2xs"
              >
                {/* Column Header */}
                <div className={`flex justify-between items-center mb-3 ${col.color} px-3 py-2 rounded-xl font-bold text-xs shadow-2xs`}>
                  <span>{col.label}</span>
                  <span className="bg-white/90 px-2 py-0.5 rounded-full text-[11px] shadow-2xs tabular-nums font-semibold text-slate-800">
                    {colOrders.length}
                  </span>
                </div>

                {/* Cards in Column */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-0.5 custom-scrollbar">
                  {colOrders.length === 0 ? (
                    <div className="text-center py-12 text-[11px] text-slate-400 italic bg-white/50 rounded-2xl">
                      Tidak ada antrian
                    </div>
                  ) : (
                    colOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white p-3.5 rounded-2xl shadow-xs hover:shadow-md transition-shadow space-y-2.5"
                      >
                        {/* Card Header: Invoice & Payment */}
                        <div className="flex justify-between items-start gap-1">
                          <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                            {order.invoice_number}
                          </span>
                          <Badge variant={order.payment_status === 'paid' ? 'paid' : 'unpaid'} className="text-[9px] py-0 font-bold uppercase">
                            {order.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                          </Badge>
                        </div>

                        {/* Customer Info */}
                        <div>
                          <div className="font-semibold text-xs text-slate-800">
                            {order.customer?.name}
                          </div>
                          <div className="text-[10px] text-slate-400 tabular-nums">
                            {order.customer?.phone}
                          </div>
                        </div>

                        {/* Items preview */}
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg space-y-1">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="truncate pr-1">{item.service?.name}</span>
                              <span className="font-medium"><span className="tabular-nums font-semibold">{item.quantity}</span> {item.service?.unit}</span>
                            </div>
                          ))}
                          {order.perfume && (
                            <div className="text-[10px] text-primary pt-1.5">
                              🌸 Parfum: {order.perfume}
                            </div>
                          )}
                        </div>

                        {/* Price & Est */}
                        <div className="flex justify-between items-center text-xs pt-1">
                          <span className="font-bold text-slate-900 tabular-nums">
                            {formatRupiah(order.total_amount)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order)
                              setReceiptOpen(true)
                            }}
                            className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center"
                          >
                            <Printer className="w-3 h-3 mr-1" /> Nota
                          </button>
                        </div>

                        {/* Next Action Button */}
                        {col.next && (
                          <div className="pt-1">
                            {col.key === 'ready' ? (
                              <Button
                                size="sm"
                                onClick={() => handlePickup(order)}
                                className="w-full h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                {order.payment_status === 'unpaid' ? 'Pelunasan & Ambil' : 'Serahkan Cucian'}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(order.id, col.next)}
                                variant="ghost"
                                className="w-full h-8 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800"
                              >
                                {col.nextLabel}
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Settle Payment Modal Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-sm border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-slate-900">Pelunasan Pembayaran</DialogTitle>
          </DialogHeader>
          {pendingPaymentOrder && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-amber-50/80 rounded-xl text-amber-900 space-y-1">
                <div className="font-bold">Nota #{pendingPaymentOrder.invoice_number}</div>
                <div>Pelanggan: {pendingPaymentOrder.customer?.name}</div>
                <div className="text-sm font-extrabold pt-1 tabular-nums">
                  Tagihan Belum Lunas: {formatRupiah(pendingPaymentOrder.total_amount - pendingPaymentOrder.paid_amount)}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Metode Pelunasan</label>
                <div className="grid grid-cols-3 gap-2">
                  {['cash', 'transfer', 'qris'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSettleMethod(m)}
                      className={`p-2.5 rounded-xl font-bold uppercase text-center transition-colors ${
                        settleMethod === m
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSettleAndComplete}
                className="w-full font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Terima Pembayaran & Selesaikan Order
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Thermal Receipt Dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-bold">Struk Laundry</DialogTitle>
          </DialogHeader>
          <ThermalReceipt order={selectedOrder} onClose={() => setReceiptOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

