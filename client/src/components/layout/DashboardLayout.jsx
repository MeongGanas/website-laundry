import React, { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  Layers,
  Users,
  Settings2,
  LogOut,
  Sparkles,
  ExternalLink,
  Menu,
  X,
  User as UserIcon,
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'

export function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuItems = [
    {
      title: 'Dashboard Ringkasan',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'POS Kasir (Order Baru)',
      path: '/admin/pos',
      icon: ShoppingCart,
      highlight: true,
    },
    {
      title: 'Papan Antrian Cucian',
      path: '/admin/orders',
      icon: Layers,
    },
    {
      title: 'Data Pelanggan',
      path: '/admin/customers',
      icon: Users,
    },
    {
      title: 'Layanan & Tarif',
      path: '/admin/services',
      icon: Tag,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-white sticky top-0 h-screen z-30">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="flex items-center space-x-2 font-black text-xl text-primary tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-900 font-extrabold text-xl">Laundry</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Menu Operasional
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : item.highlight
                    ? 'bg-primary/10 text-primary hover:bg-primary/20 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-primary' : 'text-slate-500'}`} />
                <span>{item.title}</span>
              </Link>
            )
          })}

          <div className="pt-6 px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Akses Publik
          </div>
          <a
            href="/track"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <span className="flex items-center space-x-3">
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>Portal Lacak Resi</span>
            </span>
            <Badge variant="outline" className="text-[10px] py-0">Publik</Badge>
          </a>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t bg-slate-50/50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-slate-900 truncate">
                {user?.name || 'Staff Laundry'}
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold py-0">
                  {user?.role || 'Kasir'}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar (Logout)
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <header className="h-16 bg-white border-b sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="font-semibold text-slate-800 text-base sm:text-lg">
              {menuItems.find((i) => i.path === location.pathname)?.title || 'Panel Laundry'}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/admin/pos">
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90 font-medium">
                <ShoppingCart className="w-4 h-4 mr-2" />
                + Order Baru
              </Button>
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b p-4 space-y-2 shadow-lg">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
            <div className="pt-2 border-t flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">{user?.name} ({user?.role})</span>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-rose-600">
                <LogOut className="w-4 h-4 mr-1" /> Keluar
              </Button>
            </div>
          </div>
        )}

        {/* Nested Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

