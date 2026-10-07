import React, { useState, useEffect } from 'react'
import { Tag, Plus, Edit2, Trash2, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatRupiah } from '@/lib/utils'
import api from '@/services/api'

export function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('kiloan')
  const [unit, setUnit] = useState('kg')
  const [price, setPrice] = useState('')
  const [estimatedHours, setEstimatedHours] = useState('48')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const fetchServices = async () => {
    setLoading(true)
    try {
      const res = await api.get('/services')
      setServices(res.data)
    } catch (err) {
      console.error('Failed to load services', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleOpenModal = (svc = null) => {
    setError(null)
    if (svc) {
      setEditingService(svc)
      setName(svc.name)
      setCategory(svc.category)
      setUnit(svc.unit)
      setPrice(svc.price)
      setEstimatedHours(svc.estimated_hours.toString())
      setDescription(svc.description || '')
    } else {
      setEditingService(null)
      setName('')
      setCategory('kiloan')
      setUnit('kg')
      setPrice('')
      setEstimatedHours('48')
      setDescription('')
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const payload = {
        name,
        category,
        unit,
        price: parseFloat(price),
        estimated_hours: parseInt(estimatedHours),
        description,
        is_active: true,
      }

      if (editingService) {
        await api.put(`/services/${editingService.id}`, payload)
      } else {
        await api.post('/services', payload)
      }
      setModalOpen(false)
      fetchServices()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan paket layanan.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus layanan ini?')) return
    try {
      await api.delete(`/services/${id}`)
      fetchServices()
    } catch (err) {
      alert('Gagal menghapus paket layanan.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center">
            <Tag className="w-6 h-6 mr-2 text-primary" />
            Manajemen Layanan & Tarif
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur paket cuci, tarif per kilogram/satuan, dan estimasi jam pengerjaan.
          </p>
        </div>

        <Button size="sm" onClick={() => handleOpenModal()} className="font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Tambah Layanan Baru
        </Button>
      </div>

      {/* Services Table Card */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                <tr>
                  <th className="p-4">Nama Layanan</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Tarif Harga</th>
                  <th className="p-4">Estimasi Waktu</th>
                  <th className="p-4">Deskripsi</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      Memuat data layanan...
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      Belum ada paket layanan.
                    </td>
                  </tr>
                ) : (
                  services.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{s.name}</td>
                      <td className="p-4">
                        <Badge variant={s.category === 'kiloan' ? 'default' : 'secondary'} className="uppercase text-[10px] font-bold">
                          {s.category}
                        </Badge>
                      </td>
                      <td className="p-4 font-extrabold text-primary text-sm">
                        {formatRupiah(s.price)} <span className="text-[10px] text-slate-400 font-normal">/{s.unit}</span>
                      </td>
                      <td className="p-4 text-slate-700">
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {s.estimated_hours} Jam
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">{s.description || '-'}</td>
                      <td className="p-4 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(s)}
                          className="h-8 w-8 p-0 text-slate-600"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(s.id)}
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
              {editingService ? 'Edit Layanan Laundry' : 'Tambah Layanan Baru'}
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <Label className="text-xs">Nama Layanan *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Cuci Kering Setrika Express"
                required
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Kategori *</Label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value)
                    if (e.target.value === 'kiloan') setUnit('kg')
                    else setUnit('pcs')
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs mt-1"
                >
                  <option value="kiloan">Kiloan</option>
                  <option value="satuan">Satuan</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">Satuan Unit *</Label>
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="kg / pcs / pasang"
                  required
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Harga per Unit (Rp) *</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="8000"
                  required
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs">Estimasi Durasi (Jam) *</Label>
                <Input
                  type="number"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  placeholder="48"
                  required
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Keterangan / Deskripsi Layanan</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat untuk pelanggan"
                className="mt-1 h-9 text-xs"
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full font-bold">
              {saving ? 'Menyimpan...' : 'Simpan Layanan'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

