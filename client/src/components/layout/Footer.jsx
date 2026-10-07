import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, MapPin, Phone, Clock, Mail, ShieldCheck } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 font-black text-2xl text-white tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span>Laundry</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Solusi laundry profesional terpercaya. Pakaian bersih higienis, wangi tahan lama, rapi sempurna, dan dapat dipantau progresnya secara *real-time*.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>1 Mesin = 1 Pelanggan (Higienis)</span>
            </div>
          </div>

          {/* Col 2: Navigasi Halaman */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Menu Utama</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
              </li>
              <li>
                <Link to="/layanan" className="hover:text-primary transition-colors">Layanan & Tarif</Link>
              </li>
              <li>
                <Link to="/tentang" className="hover:text-primary transition-colors">Tentang Kami</Link>
              </li>
              <li>
                <Link to="/kontak" className="hover:text-primary transition-colors">Kontak & Lokasi</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-primary transition-colors font-semibold text-primary">
                  🔍 Lacak Resi Cucian
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Jam Layanan */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Jam Operasional</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Senin - Sabtu:</p>
                  <p>07.00 - 21.00 WIB</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 pt-1">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Minggu & Libur Nasional:</p>
                  <p>08.00 - 18.00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Kontak Outlet */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Kontak Outlet</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Jl. Melati No. 12, Pusat Kota</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="hover:underline">
                  0812-3456-7890 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>halo@laundry.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Laundry. Seluruh hak cipta dilindungi.</p>
          <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
            Akses Masuk Kasir / Staff →
          </Link>
        </div>
      </div>
    </footer>
  )
}

