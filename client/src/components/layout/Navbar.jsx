import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, Search, UserCheck, Menu, X, PhoneCall } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export function Navbar() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Layanan & Tarif', path: '/layanan' },
    { name: 'Tentang Kami', path: '/tentang' },
    { name: 'Kontak', path: '/kontak' },
    { name: 'Lacak Resi', path: '/track', isSpecial: true },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 font-black text-xl text-primary tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-slate-900 font-extrabold text-2xl tracking-tight">Laundry</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Navigasi Utama" className="hidden md:flex items-center space-x-7 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors flex items-center ${
                  isActive
                    ? 'text-primary font-bold'
                    : link.isSpecial
                    ? 'text-primary font-semibold hover:text-primary/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.isSpecial && <Search className="w-3.5 h-3.5 mr-1 text-primary" />}
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center space-x-3">
          {isAuthenticated ? (
            <Link to="/admin/dashboard">
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90 font-medium">
                <UserCheck className="w-4 h-4 mr-1.5" />
                Panel {user?.role === 'admin' ? 'Owner' : 'Kasir'}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="outline" className="border-slate-300 text-xs font-semibold">
                Masuk Staff / Kasir
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-primary/10 text-primary font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
          <div className="pt-2 border-t">
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2 bg-primary text-white text-xs font-bold rounded-lg"
              >
                Panel {user?.role === 'admin' ? 'Owner' : 'Kasir'}
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg"
              >
                Masuk Staff / Kasir
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
