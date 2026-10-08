import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Shirt,
  Award,
  ArrowRight,
  Heart,
  Droplets,
  Wind
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export function AboutPage() {
  const shouldReduceMotion = useReducedMotion()
  const steps = [
    { title: '1. Penerimaan & Timbang', desc: 'Pakaian diperiksa, ditimbang transparan, dan dicatat preferensi aroma parfumnya.' },
    { title: '2. Pemilahan (Sorting)', desc: 'Pemisahan bahan sensitif dan pembersihan awal noda membandel (spotting).' },
    { title: '3. Pencucian 1 Mesin 1 Nota', desc: 'Dicuci tersendiri dengan detergen antibakteri dan air terfiltrasi bersih.' },
    { title: '4. Pengeringan Mesin Suhu Terkontrol', desc: 'Dikeringkan tanpa dijemur di debu luar ruangan, bebas dari bau apek.' },
    { title: '5. Setrika Uap & Parfum', desc: 'Disetrika dengan uap bertekanan tinggi untuk hasil halus licin tanpa merusak serat kain.' },
    { title: '6. Pengemasan & Notifikasi', desc: 'Dikemas rapi dalam plastik kedap udara, siap diambil dengan notifikasi WhatsApp.' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 to-slate-50 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-xs px-3.5 py-1 font-bold">
              Mengenal Lebih Dekat
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Tentang Laundry Kami
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Hadir dengan komitmen memberikan solusi pencucian higienis, cepat, dan transparan bagi keluarga, pekerja, dan para profesional di kota ini.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story & Philosophy Section with Side-by-Side Photo Showcase */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Narrative */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-5"
            >
              <span className="text-xs font-bold text-primary tracking-wider uppercase">Dedikasi Kebersihan</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Standar Laundry Modern yang Lebih Higienis dan Akuntabel
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Kami memahami bahwa pakaian adalah cerminan rasa percaya diri Anda sehari-hari. Oleh karena itu, <strong>Laundry</strong> didirikan dengan prinsip dasar bahwa setiap helai pakaian harus diperlakukan dengan higienis dan cermat.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Melalui integrasi teknologi sistem pelacakan digital, setiap pelanggan dapat memantau kapan pakaiannya sedang dicuci, dikeringkan, atau siap diambil tanpa rasa khawatir.
              </p>

              <div className="pt-2">
                <Link to="/layanan">
                  <Button className="font-semibold shadow-sm">
                    Lihat Paket Layanan <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right Col: Two Aesthetic Overlapping Photos */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative mx-auto max-w-md">
                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?auto=format&fit=crop&w=800&q=80"
                    alt="Deretan mesin cuci higienis berstandar industri"
                    width={800}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-80 object-cover"
                  />
                </div>
                {/* Overlapping small photo */}
                <div className="absolute -bottom-8 -left-6 w-52 rounded-2xl overflow-hidden shadow-2xl border-4 border-white hidden sm:block">
                  <img
                    src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=400&q=80"
                    alt="Handuk bersih tersusun rapi setelah setrika uap"
                    width={400}
                    height={200}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-36 object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Quality Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              4 Pilar Komitmen Layanan Kami
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Prinsip yang kami pegang teguh dalam setiap cucian pelanggan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div whileHover={shouldReduceMotion ? {} : { y: -5 }} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-primary flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">1 Mesin 1 Pelanggan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pakaian Anda tidak pernah dicampur dengan cucian orang lain. 100% higienis & aman.
              </p>
            </motion.div>

            <motion.div whileHover={shouldReduceMotion ? {} : { y: -5 }} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Detergen Khusus Serat</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Formula ramah serat kain dengan pewangi grade A yang harum berhari-hari.
              </p>
            </motion.div>

            <motion.div whileHover={shouldReduceMotion ? {} : { y: -5 }} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Tepat Waktu & Disiplin</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Estimasi pengerjaan akurat yang dipantau dengan sistem digital otomatis.
              </p>
            </motion.div>

            <motion.div whileHover={shouldReduceMotion ? {} : { y: -5 }} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Garansi 100% Puas</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cuci ulang tanpa biaya jika hasil cucian tidak harum atau masih kotor.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6 Steps Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Tahapan Standar Operasional Kami
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Bagaimana pakaian Anda diproses dari awal hingga kembali rapi ke tangan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((st, idx) => (
              <motion.div
                key={idx}
                whileHover={shouldReduceMotion ? {} : { y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-black flex items-center justify-center text-sm mb-3 tabular-nums">
                      {idx + 1}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{st.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
