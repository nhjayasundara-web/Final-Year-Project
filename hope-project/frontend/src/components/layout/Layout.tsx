// ============================================================
// HOPE — Root Layout Wrapper
// Save to: frontend/src/components/layout/Layout.tsx
// ============================================================

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { Toaster } from 'react-hot-toast'

export default function Layout() {
  return (
    <div className="page-wrapper flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'font-body text-sm rounded-2xl shadow-hope',
          success: { style: { background: '#A8D8C8', color: '#1A4A3A', border: '1px solid #2D6E6E30' } },
          error:   { style: { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A530' } },
        }}
      />
    </div>
  )
}
