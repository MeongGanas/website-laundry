import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Tag,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  HelpCircle,
  Shirt,
  ShieldCheck,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/utils'
import api from '@/services/api'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const CATEGORY_IMAGES = {
  all: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1200&q=80',
  kiloan: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1200&q=80',
  satuan: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=1200&q=80',
}

export function ServicesPublicPage() {
  const shouldReduceMotion = useReducedMotion()
  const [services, setServices] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/public/services')
        setServices(res.data)
      } catch (err) {
        console.error('Failed to load services', err)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const filteredServices = services.filter((s) => {
    if (activeCategory === 'all') return true
    return s.category === activeCategory
  })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Header Banner with Background Image Overlay */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 border-b">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={CATEGORY_IMAGES[activeCategory]}
            alt="Banner Layanan dan Tarif Laundry"
            width={1200}
            height={400}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover transition-opacity duration-700"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-0" />

        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-primary text-white border-0 text-xs px-3.5 py-1 font-bold shadow-md">
              Daftar Paket & Tarif Resmi
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Pilihan Paket Layanan Laundry
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Timbangan digital transparan dan harga bersahabat. Dari pakaian harian kiloan hingga perawatan khusus bed cover, gorden, dan sepatu kesayangan.
            </p>

            {/* Filter Pills with Framer Motion Layout */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 mt-8">
              {[
                { key: 'all', label: `Semua Layanan (${services.length})` },
                { key: 'kiloan', label: 'Cuci Kiloan' },
                { key: 'satuan', label: 'Cuci Satuan & Khusus' },
              ].map((tab) => {
                const isActive = activeCategory === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveCategory(tab.key)}
                    className={`relative px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      isActive ? 'text-slate-900 font-extrabold' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 bg-white rounded-xl shadow-md"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid with AnimatePresence */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          {loading ? (
            <div className="text-center py-20 text-slate-400">Memuat katalog layanan…</div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredServices.map((svc) => (
                  <motion.div
                    key={svc.id}
                    layout
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    whileHover={shouldReduceMotion ? {} : { y: -6 }}
                  >
                    <Card className="h-full border-slate-200 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden bg-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={svc.category === 'kiloan' ? 'default' : 'secondary'} className="uppercase font-bold text-[10px]">
                            {svc.category}
                          </Badge>
                          <span className="text-xs text-slate-600 font-medium flex items-center bg-slate-100 px-2.5 py-1 rounded-full">
                            <Clock className="w-3.5 h-3.5 mr-1 text-primary" />
                            <span className="tabular-nums font-semibold">{svc.estimated_hours}</span>&nbsp;Jam
                          </span>
                        </div>
                        <CardTitle className="text-lg font-bold text-slate-900 leading-snug">
                          {svc.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-xs text-slate-600 leading-relaxed min-h-[44px]">
                          {svc.description || 'Pencucian higienis dengan detergen berkualitas dan pelipatan rapi.'}
                        </p>

                        <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                          <div>
                            <span className="text-2xl font-black text-primary tabular-nums">{formatRupiah(svc.price)}</span>
                            <span className="text-xs text-slate-500 font-medium">&nbsp;/ {svc.unit}</span>
                          </div>
                          <Link to="/track">
                            <Button variant="ghost" size="sm" className="text-xs text-primary font-bold hover:bg-blue-50">
                              Lacak Nota →
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              Pertanyaan Seputar Layanan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Informasi penting seputar proses pencucian dan standar kami.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                Apakah pakaian saya akan dicampur dengan cucian orang lain?
              </h4>
              <p className="text-slate-600 pl-6 leading-relaxed">
                <strong>Sama sekali tidak!</strong> Kami menerapkan aturan ketat <em>1 mesin 1 pelanggan</em>. Setiap nota cucian dicuci dan dikeringkan secara terpisah untuk menjamin kebersihan dan kehigienisan maksimal.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                Berapa minimal berat untuk cucian kiloan?
              </h4>
              <p className="text-slate-600 pl-6 leading-relaxed">
                Minimal berat cucian kiloan adalah 2&nbsp;kg. Jika cucian kurang dari 2&nbsp;kg, tetap akan dihitung tarif 2&nbsp;kg. Timbangan kami selalu menggunakan timbangan digital presisi yang dikalibrasi berkala.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                Bagaimana jika hasil cucian masih bernoda atau kurang rapi?
              </h4>
              <p className="text-slate-600 pl-6 leading-relaxed">
                Kami memberikan <strong>Garansi Cuci Ulang Gratis 100%</strong>. Cukup informasikan kepada kasir saat pengambilan atau hubungi admin WhatsApp kami maksimal 1×24&nbsp;jam setelah cucian diterima.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
