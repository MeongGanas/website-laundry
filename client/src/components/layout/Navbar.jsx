import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sparkles,
  Search,
  UserCheck,
  Menu,
  X,
  Home,
  Shirt,
  Info,
  PhoneCall,
  LogIn,
  ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'

export function Navbar() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Layanan & Tarif', path: '/layanan', icon: Shirt },
    { name: 'Tentang Kami', path: '/tentang', icon: Info },
    { name: 'Kontak', path: '/kontak', icon: PhoneCall },
    { name: 'Lacak Resi', path: '/track', icon: Search, isSpecial: true },
  ]

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close menu on resize to desktop (lg = 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2.5 font-black text-xl text-primary tracking-tight shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-blue-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-slate-900 font-extrabold text-xl sm:text-2xl tracking-tight">Laundry</span>
        </Link>

        {/* Desktop Navigation Links (>= lg: 1024px) */}
        <nav aria-label="Navigasi Utama" className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-semibold">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            const Icon = link.icon

            if (link.isSpecial) {
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-primary bg-primary/10 hover:bg-primary/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              )
            }

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-primary font-bold bg-primary/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Right CTA (>= lg: 1024px) */}
        <div className="hidden lg:flex items-center space-x-3 shrink-0">
          {isAuthenticated ? (
            <Link to="/admin/dashboard">
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90 font-semibold shadow-xs">
                <UserCheck className="w-4 h-4 mr-1.5" />
                Panel {user?.role === 'admin' ? 'Owner' : 'Kasir'}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="outline" className="border-slate-300 text-xs font-semibold hover:bg-slate-50">
                <LogIn className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Masuk Staff / Kasir
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile & Tablet Right Controls (< lg) */}
        <div className="flex lg:hidden items-center space-x-2">
          {/* Quick Track Pill for handy 1-tap mobile access */}
          <Link
            to="/track"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Lacak Resi</span>
            <span className="sm:hidden">Lacak</span>
          </Link>

          {/* Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Animated Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              key="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-16 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
            />

            {/* Slide Down Menu Content */}
            <motion.div
              key="mobile-nav-panel"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-200 p-4 sm:p-6 shadow-xl lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <div className="space-y-1">
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Navigasi Menu
                </div>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-xs'
                          : link.isSpecial
                          ? 'bg-primary/10 text-primary font-bold hover:bg-primary/15'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : link.isSpecial ? 'text-primary' : 'text-slate-500'}`} />
                        <span>{link.name}</span>
                      </div>
                      {link.isSpecial && !isActive ? (
                        <Badge variant="outline" className="text-[10px] bg-white border-primary/30 text-primary">
                          Cek Nota
                        </Badge>
                      ) : (
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white/80' : 'text-slate-300'}`} />
                      )}
                    </Link>
                  )
                })}
              </div>

              {/* Bottom Customer Support & Login Area */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>Customer Service</span>
                  <a href="tel:081234567890" className="font-semibold text-primary hover:underline">
                    0812-3456-7890
                  </a>
                </div>

                {isAuthenticated ? (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Buka Panel {user?.role === 'admin' ? 'Owner' : 'Kasir'}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl"
                  >
                    <LogIn className="w-4 h-4 text-slate-600" />
                    <span>Masuk Staff / Kasir Laundry</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

