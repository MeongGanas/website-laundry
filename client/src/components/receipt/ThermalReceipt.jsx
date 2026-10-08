import React from 'react'
import { Printer, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatRupiah, formatDate, formatWhatsAppPhone } from '@/lib/utils'

export function ThermalReceipt({ order, onClose }) {
  if (!order) return null

  const handlePrint = () => {
    // Isolated thermal print engine: prints clean receipt without modal background or UI artifacts
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)

    const itemsRows = (order.items || []).map((item) => `
      <tr>
        <td style="padding: 3px 0; border-bottom: 1px dotted #ccc; vertical-align: top;">
          <div style="font-weight: 600;">${item.service?.name || item.service_name || 'Layanan'}</div>
          ${item.item_notes ? `<div style="font-size: 9px; color: #555; font-style: italic;">${item.item_notes}</div>` : ''}
        </td>
        <td style="padding: 3px 0; border-bottom: 1px dotted #ccc; text-align: center; vertical-align: top;">
          ${item.quantity} ${item.service?.unit || item.unit || ''}
        </td>
        <td style="padding: 3px 0; border-bottom: 1px dotted #ccc; text-align: right; font-weight: 600; vertical-align: top;">
          ${formatRupiah(item.subtotal)}
        </td>
      </tr>
    `).join('')

    const sisaTagihan = Math.max(0, (order.total_amount || 0) - (order.paid_amount || 0))

    const doc = iframe.contentWindow.document
    doc.open()
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Struk_${order.invoice_number}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            @media print {
              html, body {
                width: 100%;
                margin: 0;
                padding: 0;
              }
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              color: #000 !important;
            }
            body {
              font-family: 'Courier New', Courier, monospace, sans-serif;
              font-size: 11px;
              line-height: 1.35;
              background: #fff;
              width: 100%;
              max-width: 76mm;
              margin: 0 auto;
              padding: 4mm 3mm;
            }
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .uppercase { text-transform: uppercase; }
            .dashed { border-bottom: 1px dashed #000; margin: 6px 0; }
            .row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px; }
            table { width: 100%; border-collapse: collapse; margin: 4px 0; font-size: 11px; }
            th { text-align: left; padding: 3px 0; font-size: 10px; border-bottom: 1px dashed #000; }
          </style>
        </head>
        <body>
          <div class="center">
            <div style="font-size: 16px; font-weight: bold; letter-spacing: 1px;">LAUNDRY</div>
            <div style="font-size: 10px;">Jl. Melati No. 12, Kota</div>
            <div style="font-size: 10px;">Telp/WA: 0812-3456-7890</div>
          </div>

          <div class="dashed"></div>

          <div class="row"><span>No. Nota:</span><span class="bold">${order.invoice_number}</span></div>
          <div class="row"><span>Tanggal:</span><span>${formatDate(order.created_at)}</span></div>
          <div class="row"><span>Pelanggan:</span><span class="bold">${order.customer?.name || '-'}</span></div>
          <div class="row"><span>No. HP:</span><span>${order.customer?.phone || '-'}</span></div>
          ${order.perfume ? `<div class="row"><span>Aroma:</span><span>${order.perfume}</span></div>` : ''}

          <div class="dashed"></div>

          <table>
            <thead>
              <tr>
                <th>Layanan</th>
                <th style="text-align: center;">Qty</th>
                <th class="right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="dashed"></div>

          <div class="row" style="font-size: 13px; font-weight: bold;">
            <span>TOTAL:</span>
            <span>${formatRupiah(order.total_amount)}</span>
          </div>
          <div class="row">
            <span>Dibayar:</span>
            <span>${formatRupiah(order.paid_amount || 0)}</span>
          </div>
          <div class="row">
            <span>Sisa Tagihan:</span>
            <span class="bold">${formatRupiah(sisaTagihan)}</span>
          </div>
          <div class="row" style="padding-top: 2px;">
            <span>Status:</span>
            <span class="bold uppercase">${order.payment_status === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}</span>
          </div>
          ${order.payment_method ? `<div class="row"><span>Metode Bayar:</span><span class="uppercase">${order.payment_method}</span></div>` : ''}

          <div class="dashed"></div>

          ${order.estimated_completion ? `<div class="row"><span>Est. Selesai:</span><span class="bold">${formatDate(order.estimated_completion)}</span></div>` : ''}
          ${order.notes ? `<div style="font-size: 10px; font-style: italic; margin-top: 2px;">Catatan: ${order.notes}</div>` : ''}

          <div class="dashed"></div>

          <div class="center" style="margin-top: 8px; font-size: 10px;">
            <div style="font-weight: bold; margin-bottom: 2px;">Simpan nota ini untuk bukti pengambilan!</div>
            <div>Lacak status cucian di:</div>
            <div style="font-weight: bold; font-size: 9px; word-break: break-all;">${window.location.origin}/track</div>
            <div style="margin-top: 6px; font-size: 9px; color: #555;">--- Terima Kasih ---</div>
          </div>
        </body>
      </html>
    `)
    doc.close()

    setTimeout(() => {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
      }, 1000)
    }, 250)
  }

  // Format WhatsApp message cleanly without broken characters or variation selectors
  const handleSendWhatsApp = () => {
    if (!order.customer?.phone) return
    const rawPhone = formatWhatsAppPhone(order.customer.phone)

    const trackUrl = `${window.location.origin}/track?invoice=${order.invoice_number}`

    // Build items list cleanly
    const itemsText = order.items && order.items.length > 0
      ? order.items
          .map((i) => `- ${i.service?.name || i.service_name || 'Layanan'}: ${i.quantity} ${i.service?.unit || i.unit || ''} (${formatRupiah(i.subtotal)})`)
          .join('\n')
      : ''

    const lines = [
      `*LAUNDRY - NOTA TRANSAKSI*`,
      `------------------------------------------`,
      `Halo Kak *${order.customer?.name || 'Pelanggan'}*,`,
      `Terima kasih telah mempercayakan cucian Anda di *Laundry*.`,
      ``,
      `*Detail Pesanan:*`,
      `- No. Nota: *${order.invoice_number}*`,
      `- Total Biaya: *${formatRupiah(order.total_amount)}*`,
      `- Status Bayar: *${order.payment_status === 'paid' ? 'LUNAS (Terima Kasih)' : 'BELUM LUNAS'}*`,
      order.perfume ? `- Aroma Parfum: *${order.perfume}*` : null,
      order.estimated_completion ? `- Estimasi Selesai: *${formatDate(order.estimated_completion)}*` : null,
      itemsText ? `\n*Rincian Layanan:*\n${itemsText}` : null,
      ``,
      `*Lacak Status Cucian:*`,
      trackUrl,
      ``,
      `------------------------------------------`,
      `_Laundry - Bersih, Wangi, & Rapi._`
    ].filter(Boolean).join('\n')

    // Clean any accidental non-breaking space (0xA0, 0x202F) and variation selectors (0xFE00 - 0xFE0F)
    const cleanMessage = lines
      .replace(/[\u00A0\u202F]/g, ' ')
      .replace(/[\uFE00-\uFE0F]/g, '')

    window.open(`https://wa.me/${rawPhone}?text=${encodeURIComponent(cleanMessage)}`, '_blank')
  }

  return (
    <div className="flex flex-col items-center">
      {/* Action Buttons (Hidden when printing) */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 w-full print:hidden">
        <Button onClick={handlePrint} className="bg-slate-900 text-white hover:bg-slate-800">
          <Printer className="w-4 h-4 mr-2" />
          Cetak Struk Thermal
        </Button>
        <Button onClick={handleSendWhatsApp} variant="ghost" className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold border-0">
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
        className="w-full max-w-[340px] bg-white text-black p-5 rounded-2xl font-mono text-xs leading-tight shadow-md tabular-nums"
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

