import React, { useState, useEffect } from 'react'
import { Users, Search, Plus, Edit2, Trash2, Phone, MapPin, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatWhatsAppPhone } from '@/lib/utils'
import api from '@/services/api'

export function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Form Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/customers?search=${encodeURIComponent(search)}`)
      setCustomers(res.data.data || [])
    } catch (err) {
      console.error('Failed to load customers', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleOpenModal = (cust = null) => {
    setError(null)
    if (cust) {
      setEditingCustomer(cust)
      setName(cust.name)
      setPhone(cust.phone)
      setAddress(cust.address || '')
      setNotes(cust.notes || '')
    } else {
      setEditingCustomer(null)
      setName('')
      setPhone('')
      setAddress('')
      setNotes('')
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const payload = { name, phone, address, notes }
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, payload)
      } else {
        await api.post('/customers', payload)
      }
      setModalOpen(false)
      fetchCustomers()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data pelanggan.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pelanggan ini?')) return
    try {
      await api.delete(`/customers/${id}`)
      fetchCustomers()
    } catch (err) {
      alert('Gagal menghapus data pelanggan.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center">
            <Users className="w-6 h-6 mr-2 text-primary" />
            Database Pelanggan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar pelanggan terdaftar, kontak WhatsApp, dan riwayat transaksi.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Cari nama / nomor HP…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Button size="sm" onClick={() => handleOpenModal()} className="font-semibold shadow-xs">
            <Plus className="w-4 h-4 mr-1" /> Tambah
          </Button>
        </div>
      </div>

      {/* Customer Table Card */}
      <Card className="border-0 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold">
                <tr>
                  <th className="p-4">Nama Pelanggan</th>
                  <th className="p-4">Nomor HP / WhatsApp</th>
                  <th className="p-4">Alamat Domisili</th>
                  <th className="p-4">Catatan</th>
                  <th className="p-4 text-center">Total Order</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      Memuat data pelanggan…
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      Tidak ada pelanggan ditemukan.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{c.name}</td>
                      <td className="p-4 font-mono text-slate-600 tabular-nums">
                        <a
                          href={`https://wa.me/${formatWhatsAppPhone(c.phone)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline flex items-center"
                        >
                          <Phone className="w-3 h-3 mr-1" /> {c.phone}
                        </a>
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs truncate">{c.address || '-'}</td>
                      <td className="p-4 text-slate-500 italic max-w-xs truncate">{c.notes || '-'}</td>
                      <td className="p-4 text-center font-bold text-primary tabular-nums">
                        {c.orders_count || 0}
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(c)}
                          aria-label={`Edit pelanggan ${c.name}`}
                          className="h-8 w-8 p-0 text-slate-600"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(c.id)}
                          aria-label={`Hapus pelanggan ${c.name}`}
                          className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold">
              {editingCustomer ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <Label htmlFor="cust-name" className="text-xs">Nama Lengkap *</Label>
              <Input
                id="cust-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="cust-phone" className="text-xs">Nomor WhatsApp / HP *</Label>
              <Input
                id="cust-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-1 h-9 text-xs tabular-nums"
              />
            </div>

            <div>
              <Label htmlFor="cust-address" className="text-xs">Alamat Domisili</Label>
              <Input
                id="cust-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="cust-notes" className="text-xs">Catatan Khusus</Label>
              <Input
                id="cust-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Suka wangi lavender, minta setrika licin"
                className="mt-1 h-9 text-xs"
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full font-bold">
              {saving ? 'Menyimpan…' : 'Simpan Data Pelanggan'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

