import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Shirt
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      console.error('Login error', err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Login gagal. Periksa kembali email dan password Anda atau pastikan Docker berjalan.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = async (role) => {
    const demoEmail = role === 'admin' ? 'admin@laundry.com' : 'kasir@laundry.com'
    const demoPassword = 'password'
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError(null)
    setLoading(true)

    try {
      await login(demoEmail, demoPassword)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      console.error('Quick login error', err)
      setError('Login gagal. Pastikan container backend berjalan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12"
      >
        {/* Left Side: Aesthetic Photography & Brand (5 Cols on Desktop) */}
        <div className="md:col-span-5 relative hidden md:flex flex-col justify-between p-8 text-white overflow-hidden bg-slate-900">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80"
              alt="Interior outlet laundry modern"
              width={800}
              height={800}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
          </div>

          <div className="relative z-10 space-y-2">
            <Link to="/" className="inline-flex items-center space-x-2 font-black text-2xl text-white tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span>Laundry</span>
            </Link>
            <p className="text-xs text-slate-300">Sistem Manajemen & Kasir Outlet</p>
          </div>

          <div className="relative z-10 space-y-4 pt-12">
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pencatatan nota kilat hitungan detik</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cetak struk thermal 58mm & 80mm</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Kirim nota otomatis ke WhatsApp</span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              © {new Date().getFullYear()} Laundry Management.
            </div>
          </div>
        </div>

        {/* Right Side: Login Form (7 Cols) */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center space-x-2 md:hidden mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl text-slate-900">Laundry</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Masuk ke Panel Staff
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan kredensial akun kasir atau admin Anda.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2 font-medium"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Email Staff</Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder="nama@laundry.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs">Kata Sandi</Label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 text-xs h-10"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full font-bold h-11 shadow-md">
              {loading ? 'Memverifikasi…' : 'Masuk Sekarang'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Quick 1-Click Login Demo */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
              Login Cepat 1-Klik (Demo Testing)
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() => handleQuickLogin('kasir')}
                className="text-xs h-9 font-semibold hover:bg-slate-50 border-slate-200 shadow-2xs"
              >
                ⚡ Masuk Kasir
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() => handleQuickLogin('admin')}
                className="text-xs h-9 font-semibold hover:bg-slate-50 border-slate-200 shadow-2xs"
              >
                👑 Masuk Admin
              </Button>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link to="/" className="text-xs text-slate-500 hover:text-primary transition-colors">
              ← Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
