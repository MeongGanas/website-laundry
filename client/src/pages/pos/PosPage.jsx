import React, { useState, useEffect } from 'react'
import {
  ShoppingCart,
  Plus,
  Trash2,
  Printer,
  MessageCircle,
  User,
  Phone,
  MapPin,
  Sparkles,
  Calculator,
  Search,
  CheckCircle2,
  Clock,
  Shirt
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ThermalReceipt } from '@/components/receipt/ThermalReceipt'
import { formatRupiah } from '@/lib/utils'
import api from '@/services/api'

const PERFUMES = ['Lavender', 'Akasia', 'Ocean Fresh', 'Snappy', 'Sakura', 'Tanpa Parfum']

export function PosPage() {
  const [services, setServices] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loadingServices, setLoadingServices] = useState(true)

  // Customer state
  const [customerSearch, setCustomerSearch] = useState('')
  const [customerResults, setCustomerResults] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')

  // Order items state (Cart)
  const [cartItems, setCartItems] = useState([])
  const [perfume, setPerfume] = useState('Lavender')
  const [orderNotes, setOrderNotes] = useState('')

  // Payment state
  const [paymentStatus, setPaymentStatus] = useState('paid') // 'paid' or 'unpaid'
  const [paymentMethod, setPaymentMethod] = useState('cash') // 'cash', 'transfer', 'qris'
  const [receivedAmount, setReceivedAmount] = useState('')

  // Submission & Receipt Modal state
  const [submitting, setSubmitting] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  // Fetch Services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services')
        setServices(res.data)
      } catch (err) {
        console.error('Failed to load services', err)
      } finally {
        setLoadingServices(false)
      }
    }
    fetchServices()
  }, [])

  // Search Customer debounce
  useEffect(() => {
    if (!customerSearch.trim()) {
      setCustomerResults([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/customers?search=${encodeURIComponent(customerSearch)}`)
        setCustomerResults(res.data.data || [])
      } catch (err) {
        console.error('Customer search error', err)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [customerSearch])

  const selectExistingCustomer = (c) => {
    setSelectedCustomer(c)
    setCustomerName(c.name)
    setCustomerPhone(c.phone)
    setCustomerAddress(c.address || '')
    setCustomerSearch('')
    setCustomerResults([])
  }

  const resetCustomer = () => {
    setSelectedCustomer(null)
    setCustomerName('')
    setCustomerPhone('')
    setCustomerAddress('')
  }

  // Add service to cart
  const addToCart = (service) => {
    const existingIndex = cartItems.findIndex((item) => item.service_id === service.id)
    if (existingIndex > -1) {
      const updated = [...cartItems]
      updated[existingIndex].quantity = Number((updated[existingIndex].quantity + 1).toFixed(2))
      setCartItems(updated)
    } else {
      setCartItems([
        ...cartItems,
        {
          service_id: service.id,
          name: service.name,
          category: service.category,
          unit: service.unit,
          price: Number(service.price),
          quantity: service.category === 'kiloan' ? 1.0 : 1,
          item_notes: '',
        },
      ])
    }
  }

  const updateQuantity = (index, newQty) => {
    if (newQty <= 0) return
    const updated = [...cartItems]
    updated[index].quantity = Number(parseFloat(newQty) || 0)
    setCartItems(updated)
  }

  const updateItemNotes = (index, notes) => {
    const updated = [...cartItems]
    updated[index].item_notes = notes
    setCartItems(updated)
  }

  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index))
  }

  // Calculate Subtotals
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const changeAmount = paymentStatus === 'paid' && paymentMethod === 'cash' && receivedAmount
    ? Math.max(0, parseFloat(receivedAmount) - totalAmount)
    : 0

  // Filtered services
  const filteredServices = services.filter((s) => {
    if (activeCategory === 'all') return true
    return s.category === activeCategory
  })

  // Submit Order to API
  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Nama dan Nomor HP pelanggan wajib diisi.')
      return
    }

    if (cartItems.length === 0) {
      setErrorMessage('Pilih minimal 1 item layanan laundry.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        customer_id: selectedCustomer?.id || null,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        perfume,
        notes: orderNotes,
        payment_status: paymentStatus,
        payment_method: paymentStatus === 'paid' ? paymentMethod : null,
        paid_amount: paymentStatus === 'paid' ? totalAmount : 0,
        items: cartItems.map((item) => ({
          service_id: item.service_id,
          quantity: item.quantity,
          item_notes: item.item_notes,
        })),
      }

      const res = await api.post('/orders', payload)
      setCompletedOrder(res.data.order)
      setReceiptOpen(true)

      // Reset form
      setCartItems([])
      resetCustomer()
      setReceivedAmount('')
      setOrderNotes('')
    } catch (err) {
      console.error('Order creation error', err)
      setErrorMessage(err.response?.data?.message || 'Gagal menyimpan transaksi. Periksa kembali form.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2 text-primary" />
            Kasir Point of Sale (POS)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Input transaksi cepat, timbang cucian, cetak nota, dan kirim resi WhatsApp otomatis.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {/* Main Grid: Left (Catalog), Right (Cart & Bill) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Service Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Selection Card */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center">
                  <User className="w-4 h-4 mr-2 text-primary" />
                  Data Pelanggan
                </CardTitle>
                {selectedCustomer && (
                  <Button variant="ghost" size="sm" onClick={resetCustomer} className="text-xs text-rose-600 h-7">
                    Ganti Pelanggan
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {/* Autocomplete Search input */}
              <div className="relative">
                <label htmlFor="pos-customer-search" className="sr-only">
                  Cari Pelanggan Lama
                </label>
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  id="pos-customer-search"
                  type="text"
                  placeholder="Cari pelanggan lama via Nama / No. HP…"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  className="pl-9 h-10 text-xs"
                />
                {customerResults.length > 0 && (
                  <div role="listbox" className="absolute left-0 right-0 top-11 bg-white border border-slate-200 rounded-lg shadow-xl z-30 max-h-48 overflow-y-auto divide-y">
                    {customerResults.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => selectExistingCustomer(c)}
                        className="w-full text-left p-3 text-xs hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{c.name}</div>
                          <div className="text-slate-500 text-[11px] tabular-nums">{c.phone}</div>
                        </div>
                        <Badge variant="outline" className="text-[10px]">Pilih</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Manual Input or Prefilled */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <Label htmlFor="pos-customer-name" className="text-xs">Nama Pelanggan *</Label>
                  <Input
                    id="pos-customer-name"
                    placeholder="Nama Lengkap"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    autoComplete="name"
                    className="h-9 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pos-customer-phone" className="text-xs">Nomor WhatsApp / HP *</Label>
                  <Input
                    id="pos-customer-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="08123456789"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="h-9 text-xs mt-1 tabular-nums"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="pos-customer-address" className="text-xs">Alamat (Opsional)</Label>
                  <Input
                    id="pos-customer-address"
                    placeholder="Alamat domisili atau patokan antar"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="h-9 text-xs mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Picker Catalog */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center">
                <Shirt className="w-4 h-4 mr-2 text-primary" />
                Pilih Paket & Layanan Laundry
              </CardTitle>
              {/* Category Filter Tabs */}
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    activeCategory === 'all' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('kiloan')}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    activeCategory === 'kiloan' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  Kiloan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('satuan')}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    activeCategory === 'satuan' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  Satuan
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {loadingServices ? (
                <div className="text-center py-8 text-xs text-slate-400">Memuat layanan…</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                  {filteredServices.map((svc) => (
                    <div
                      key={svc.id}
                      onClick={() => addToCart(svc)}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-primary/60 hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-1 mb-1">
                          <span className="font-bold text-xs text-slate-800 group-hover:text-primary transition-colors">
                            {svc.name}
                          </span>
                          <Badge variant={svc.category === 'kiloan' ? 'default' : 'secondary'} className="text-[9px] uppercase py-0 font-bold">
                            {svc.category}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {svc.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                        <span className="text-xs font-black text-primary tabular-nums">
                          {formatRupiah(svc.price)} <span className="text-[10px] text-slate-400 font-normal">/{svc.unit}</span>
                        </span>
                        <Button size="sm" className="h-7 px-2.5 text-xs bg-slate-900 group-hover:bg-primary transition-colors">
                          <Plus className="w-3.5 h-3.5 mr-1" /> Tambah
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Order Cart & Bill (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 shadow-sm sticky top-20">
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center">
                  <Calculator className="w-4 h-4 mr-2 text-primary" />
                  Nota Transaksi (<span className="tabular-nums">{cartItems.length}</span> Layanan)
                </CardTitle>
                {cartItems.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setCartItems([])} className="text-xs text-rose-600 h-7">
                    Kosongkan
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Item List in Cart */}
              {cartItems.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  <Shirt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  Keranjang masih kosong.<br />Pilih layanan dari daftar di sebelah kiri.
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
                  {cartItems.map((item, index) => (
                    <div key={index} className="pt-2 first:pt-0 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-2">
                          <div className="text-xs font-bold text-slate-800">{item.name}</div>
                          <div className="text-[10px] text-slate-400 tabular-nums">
                            {formatRupiah(item.price)} / {item.unit}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-extrabold text-slate-900 tabular-nums">
                            {formatRupiah(item.price * item.quantity)}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(index)}
                            aria-label={`Hapus ${item.name} dari keranjang`}
                            className="text-rose-500 hover:text-rose-700 text-[10px] flex items-center ml-auto mt-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded"
                          >
                            <Trash2 className="w-3 h-3 mr-0.5" /> Hapus
                          </button>
                        </div>
                      </div>

                      {/* Quantity & Notes Controls */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-1">
                          <label htmlFor={`cart-item-qty-${index}`} className="text-[10px] text-slate-500 whitespace-nowrap">
                            {item.category === 'kiloan' ? 'Berat (kg):' : 'Jumlah (pcs):'}
                          </label>
                          <Input
                            id={`cart-item-qty-${index}`}
                            type="number"
                            step={item.category === 'kiloan' ? '0.1' : '1'}
                            min="0.1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(index, e.target.value)}
                            className="h-7 text-xs px-2 w-20 text-center font-bold tabular-nums"
                          />
                        </div>
                        <div>
                          <label htmlFor={`cart-item-notes-${index}`} className="sr-only">
                            Catatan untuk {item.name}
                          </label>
                          <Input
                            id={`cart-item-notes-${index}`}
                            type="text"
                            placeholder="Catatan noda / pisah…"
                            value={item.item_notes}
                            onChange={(e) => updateItemNotes(index, e.target.value)}
                            className="h-7 text-[11px] px-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Extra Choices: Aroma Parfum & Catatan */}
              <div className="pt-2 border-t space-y-3">
                <div>
                  <Label htmlFor="pos-perfume" className="text-xs font-semibold">Pilihan Aroma Parfum</Label>
                  <select
                    id="pos-perfume"
                    value={perfume}
                    onChange={(e) => setPerfume(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs mt-1"
                  >
                    {PERFUMES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="pos-order-notes" className="text-xs">Catatan Khusus Nota</Label>
                  <Input
                    id="pos-order-notes"
                    placeholder="Misal: Harum maksimal, kemeja digantung"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Payment Section */}
              <div className="pt-3 border-t space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-sm font-extrabold">
                  <span className="text-slate-700">TOTAL BIAYA:</span>
                  <span className="text-xl text-primary font-black tabular-nums">{formatRupiah(totalAmount)}</span>
                </div>

                {/* Status Bayar Selector */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('paid')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      paymentStatus === 'paid'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Bayar Lunas Sekarang
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('unpaid')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      paymentStatus === 'unpaid'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Bayar Nanti (Ambil)
                  </button>
                </div>

                {/* If Paid: Payment Method & Change Calculator */}
                {paymentStatus === 'paid' && (
                  <div className="space-y-2 pt-2">
                    <Label className="text-xs">Metode Pembayaran</Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['cash', 'transfer', 'qris'].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setPaymentMethod(m)}
                          className={`py-1.5 text-[11px] font-bold uppercase rounded border ${
                            paymentMethod === m
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-600 border-slate-200'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>

                    {paymentMethod === 'cash' && (
                      <div className="space-y-1.5 pt-2">
                        <Label htmlFor="pos-received-amount" className="text-xs">Uang Diterima (Tunai)</Label>
                        <div className="flex gap-2">
                          <Input
                            id="pos-received-amount"
                            type="number"
                            placeholder="Rp 0"
                            value={receivedAmount}
                            onChange={(e) => setReceivedAmount(e.target.value)}
                            className="h-8 text-xs font-bold tabular-nums"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setReceivedAmount(totalAmount.toString())}
                            className="text-[10px] h-8 px-2"
                          >
                            Uang Pas
                          </Button>
                        </div>
                        {receivedAmount && parseFloat(receivedAmount) >= totalAmount && (
                          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200 flex justify-between">
                            <span>Kembalian:</span>
                            <span className="tabular-nums">{formatRupiah(changeAmount)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Final Submit Button */}
              <Button
                type="button"
                onClick={handleSubmitOrder}
                disabled={submitting || cartItems.length === 0}
                className="w-full h-11 text-sm font-bold shadow-md bg-primary hover:bg-primary/90"
              >
                {submitting ? 'Memproses Transaksi…' : 'SIMPAN & CETAK NOTA'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instant Print Thermal Modal Dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-bold">Nota Siap Dicetak & Dikirim</DialogTitle>
          </DialogHeader>
          <ThermalReceipt order={completedOrder} onClose={() => setReceiptOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

