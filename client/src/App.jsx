import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LandingPage } from '@/pages/public/LandingPage'
import { ServicesPublicPage } from '@/pages/public/ServicesPublicPage'
import { AboutPage } from '@/pages/public/AboutPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { TrackOrderPage } from '@/pages/public/TrackOrderPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { PosPage } from '@/pages/pos/PosPage'
import { OrderBoardPage } from '@/pages/orders/OrderBoardPage'
import { CustomersPage } from '@/pages/customers/CustomersPage'
import { ServicesPage } from '@/pages/services/ServicesPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const hasToken = isAuthenticated || Boolean(localStorage.getItem('laundry_token'))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-sm">
        Memverifikasi sesi pengguna...
      </div>
    )
  }

  if (!hasToken) {
    return <Navigate to="/login" replace />
  }

  return children
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Sisi Publik (Multi-halaman Pelanggan) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/layanan" element={<ServicesPublicPage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/kontak" element={<ContactPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Sisi Kasir & Back-Office (Terproteksi) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="pos" element={<PosPage />} />
            <Route path="orders" element={<OrderBoardPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="services" element={<ServicesPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
