// ============================================================
// HOPE — Root App Component + Router
// Save to: frontend/src/App.tsx
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import Layout      from './components/layout/Layout'
import HomePage    from './components/pages/HomePage'
import AuthPage    from './components/pages/AuthPage'
import DashboardPage  from './components/pages/DashboardPage'
import AwarenessPage  from './components/pages/AwarenessPage'
import DetectionPage  from './components/pages/DetectionPage'
import SupportPage    from './components/pages/SupportPage'
import CommunityPage  from './components/pages/CommunityPage'
import MedicinePage   from './components/pages/MedicinePage'
import HospitalPage   from './components/pages/HospitalPage'
import { useAuth }  from './hooks/useAuth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  }
})

// ── Protected Route wrapper ──
function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return <>{children}</>
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-hope-cream flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 ribbon-float inline-block">🎀</div>
        <p className="font-display text-2xl text-hope-wine">HOPE</p>
        <p className="font-body text-sm text-hope-muted mt-1">Loading your account…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public: layout wrapper with Navbar + Footer */}
          <Route element={<Layout />}>
            <Route index         element={<HomePage />} />
            <Route path="awareness"  element={<AwarenessPage />} />
            <Route path="detection"  element={<DetectionPage />} />
            <Route path="support"    element={<SupportPage />} />
            <Route path="community"  element={<CommunityPage />} />
            <Route path="medicine"   element={<MedicinePage />} />
            <Route path="hospital"   element={<HospitalPage />} />

            {/* Protected routes */}
            <Route path="dashboard" element={
              <Protected><DashboardPage /></Protected>
            } />
          </Route>

          {/* Auth: no layout (full-screen) */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
