import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export function ContactPage() {
  const shouldReduceMotion = useReducedMotion()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const waText = [
      `*PESAN DARI WEBSITE LAUNDRY*`,
      `------------------------------------------`,
      `Nama: *${name.trim() || 'Pelanggan'}*`,
      `No. HP: *${phone.trim() || '-'}*`,
      ``,
      `*Pesan:*`,
      message.trim(),
      `------------------------------------------`
    ]
      .join('\n')
      .replace(/[\u00A0\u202F]/g, ' ')
      .replace(/[\uFE00-\uFE0F]/g, '')

    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(waText)}`, '_blank')
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-blue-50/70 to-slate-50 py-16 sm:py-20 border-b">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-xs px-3.5 py-1 font-bold">
              Hubungi Kami
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Kontak & Lokasi Outlet
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Ada pertanyaan mengenai paket cuci, ingin konsultasi bahan pakaian khusus, atau mencari alamat outlet? Kami siap melayani Anda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Left: Outlet Information Cards & Photo */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Outlet Showcase Image */}
              <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80"
                  alt="Meja layanan pelanggan outlet laundry yang ramah dan bersih"
                  width={800}
                  height={384}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-48 object-cover"
                />
              </div>

              <Card className="border-slate-200 shadow-2xs">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-rose-500" />
                    Alamat Outlet Utama
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-2 text-xs sm:text-sm text-slate-600">
                  <p className="font-bold text-slate-900">Laundry Outlet Pusat</p>
                  <p>Jl. Melati No. 12, Kelurahan Sukamaju, Kecamatan Kota Baru</p>
                  <p className="text-xs text-slate-500">Patokan: Seberang Minimarket Melati, samping apotek.</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-2xs">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    Jam Buka & Operasional
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-slate-700">Senin - Sabtu:</span>
                    <span className="font-bold text-slate-900 tabular-nums">07:00 - 21:00 WIB</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-slate-700">Minggu & Hari Libur:</span>
                    <span className="font-bold text-slate-900 tabular-nums">08:00 - 18:00 WIB</span>
                  </div>
                  <div className="flex justify-between pt-1 text-emerald-600 font-semibold text-xs">
                    <span>Layanan Antar-Jemput:</span>
                    <span>Tersedia (Sesuai Perjanjian)</span>
                  </div>
                </CardContent>
              </Card>

              {/* Direct WhatsApp Action */}
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                <div className="flex items-center space-x-2 font-bold text-base">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  <span>Respon Cepat WhatsApp</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Perlu konfirmasi mendesak atau ingin tanya status cucian Anda? Hubungi kasir langsung melalui WhatsApp.
                </p>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20admin%20Laundry,%20saya%20mau%20bertanya%20seputar%20layanan"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block"
                >
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm tabular-nums">
                    Chat WhatsApp: 0812-3456-7890
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-slate-200 shadow-md">
                <CardHeader className="border-b">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center">
                    <Send className="w-4 h-4 mr-2 text-primary" />
                    Kirim Pesan / Pertanyaan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Pesan dialihkan ke WhatsApp kasir. Terima kasih!</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
                    <div>
                      <Label htmlFor="contact-name" className="text-xs">Nama Anda</Label>
                      <Input
                        id="contact-name"
                        placeholder="Nama lengkap"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        className="mt-1 h-10 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact-phone" className="text-xs">Nomor WhatsApp / HP</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="08123456789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 h-10 text-xs tabular-nums"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact-message" className="text-xs">Isi Pesan / Pertanyaan</Label>
                      <textarea
                        id="contact-message"
                        placeholder="Tuliskan pertanyaan Anda seputar tarif, antar-jemput, atau pakaian khusus…"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-32 mt-1 rounded-md border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full font-bold h-11 shadow-sm">
                      <Send className="w-4 h-4 mr-2" />
                      Kirim via WhatsApp
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
