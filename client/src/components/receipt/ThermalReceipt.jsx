import React from 'react'
import { Printer, MessageCircle, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatRupiah, formatDate } from '@/lib/utils'

export function ThermalReceipt({ order, onClose }) {
  if (!order) return null

  const handlePrint = () => {
    window.print()
  }

  // Format WhatsApp message
  const handleSendWhatsApp = () => {
    if (!order.customer?.phone) return
    let rawPhone = order.customer.phone.replace(/[^0-9]/g, '')
    if (rawPhone.startsWith('0')) {
      rawPhone = '62' + rawPhone.slice(1)
    }

    const trackUrl = `${window.location.origin}/track?invoice=${order.invoice_number}`
    const text = `Halo Kak *${order.customer.name}*,\n\nTerima kasih telah mencuci di *Laundry*! 🙏\n\n📄 *No. Nota:* ${order.invoice_number}\n💰 *Total:* ${formatRupiah(order.total_amount)}\n💳 *Status Bayar:* ${order.payment_status === 'paid' ? 'LUNAS (Terima Kasih)' : 'BELUM LUNAS'}\n🌸 *Parfum:* ${order.perfume || 'Reguler'}\n⏱️ *Estimasi Selesai:* ${formatDate(order.estimated_completion)}\n\nLacak status cucian Anda secara real-time di sini:\n👉 ${trackUrl}\n\n_Laundry - Bersih, Wangi, & Rapi._`

    window.open(`https://wa.me/${rawPhone}?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="flex flex-col items-center">
      {/* Action Buttons (Hidden when printing) */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 w-full print:hidden">
        <Button onClick={handlePrint} className="bg-slate-900 text-white hover:bg-slate-800">
          <Printer className="w-4 h-4 mr-2" />
          Cetak Struk Thermal
        </Button>
        <Button onClick={handleSendWhatsApp} variant="outline" className="text-emerald-700 border-emerald-300 hover:bg-emerald-50">
          <MessageCircle className="w-4 h-4 mr-2 text-emerald-600" />
          Kirim ke WhatsApp
        </Button>
        {onClose && (
          <Button onClick={onClose} variant="ghost">
            Tutup
          </Button>
        )}
      </div>

      {/* The Printable Area (Styled as standard 58mm / 80mm thermal receipt) */}
      <div
        id="printable-receipt"
        className="w-full max-w-[340px] bg-white text-black p-4 border border-dashed border-slate-300 rounded font-mono text-xs leading-tight shadow-sm"
      >
        {/* Header */}
        <div className="text-center pb-2 border-b border-dashed border-slate-400">
          <h2 className="text-base font-bold tracking-wider">LAUNDRY</h2>
          <p className="text-[10px] text-slate-600">Jl. Melati No. 12, Kota</p>
          <p className="text-[10px] text-slate-600">Telp/WA: 0812-3456-7890</p>
        </div>

        {/* Info */}
        <div className="py-2 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span>No. Nota:</span>
            <span className="font-bold">{order.invoice_number}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{formatDate(order.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span>Pelanggan:</span>
            <span className="font-bold">{order.customer?.name}</span>
          </div>
          <div className="flex justify-between">
            <span>No. HP:</span>
            <span>{order.customer?.phone}</span>
          </div>
          {order.perfume && (
            <div className="flex justify-between">
              <span>Aroma:</span>
              <span>{order.perfume}</span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="py-2 border-b border-dashed border-slate-400">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="py-1">Item</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={idx} className="border-b border-dotted border-slate-200">
                  <td className="py-1">
                    <div>{item.service?.name || item.service_name}</div>
                    {item.item_notes && (
                      <div className="text-[9px] text-slate-500 italic">{item.item_notes}</div>
                    )}
                  </td>
                  <td className="text-center py-1">
                    {item.quantity} {item.service?.unit || item.unit}
                  </td>
                  <td className="text-right py-1 font-medium">
                    {formatRupiah(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="py-2 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL:</span>
            <span>{formatRupiah(order.total_amount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Dibayar:</span>
            <span>{formatRupiah(order.paid_amount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Sisa Tagihan:</span>
            <span className={order.total_amount - order.paid_amount > 0 ? "text-rose-600 font-bold" : ""}>
              {formatRupiah(Math.max(0, order.total_amount - order.paid_amount))}
            </span>
          </div>
          <div className="flex justify-between pt-1">
            <span>Status Bayar:</span>
            <span className="font-bold uppercase">
              {order.payment_status === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}
            </span>
          </div>
        </div>

        {/* Est. Selesai */}
        <div className="py-2 border-b border-dashed border-slate-400 text-[10px] space-y-1">
          <div className="flex items-center justify-between text-slate-700">
            <span>Est. Selesai:</span>
            <span className="font-bold">{formatDate(order.estimated_completion)}</span>
          </div>
          {order.notes && (
            <div className="text-slate-600 italic">
              Catatan: {order.notes}
            </div>
          )}
        </div>

        {/* Footer Notes & QR Info */}
        <div className="pt-3 text-center text-[10px] text-slate-600 space-y-1">
          <p className="font-semibold">Simpan nota ini sebagai bukti pengambilan!</p>
          <p>Lacak status laundry Anda di website kami:</p>
          <p className="font-mono font-bold text-slate-800 text-[9px] break-all">
            {window.location.origin}/track
          </p>
          <p className="pt-2 text-[9px] text-slate-400">--- Terima Kasih ---</p>
        </div>
      </div>
    </div>
  )
}

