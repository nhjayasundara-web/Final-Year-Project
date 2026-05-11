// ============================================================
// HOPE — Navbar Component
// Save to: frontend/src/components/layout/Navbar.tsx
// ============================================================

import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Heart, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn, getInitials } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { to: '/awareness',  label: 'Awareness' },
  { to: '/detection',  label: 'Detection' },
  { to: '/support',    label: 'Support'   },
  { to: '/community',  label: 'Community' },
  { to: '/medicine',   label: 'Medicine'  },
  { to: '/hospital',   label: 'Hospitals' },
]

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled,     setScrolled]     = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-hope border-b border-hope-blush/30'
          : 'bg-transparent'
      )}
    >
      <div className="hope-container">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* ── Logo ── */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-rose-gradient rounded-2xl flex items-center justify-center shadow-hope group-hover:shadow-hope-lg transition-shadow">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold text-hope-wine">HOPE</span>
              <span className="font-body text-[10px] text-hope-muted tracking-wider uppercase">Early Detection</span>
            </div>
          </NavLink>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => cn(
                  'nav-link px-4 py-2 rounded-xl text-sm',
                  isActive && 'text-hope-rose bg-hope-soft'
                )}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Auth Section ── */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-hope-soft transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-gradient flex items-center justify-center text-white text-xs font-bold">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                      : getInitials(user.name)
                    }
                  </div>
                  <span className="font-body font-medium text-hope-dark text-sm">{user.name.split(' ')[0]}</span>
                  <ChevronDown className={cn('w-4 h-4 text-hope-muted transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-card-hover border border-hope-blush/20 overflow-hidden"
                    >
                      <NavLink
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm font-body text-hope-dark hover:bg-hope-soft transition-colors"
                      >
                        <User className="w-4 h-4 text-hope-muted" />
                        My Dashboard
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-body text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <NavLink to="/auth" className="btn-ghost text-sm">Sign In</NavLink>
                <NavLink to="/auth?tab=register" className="btn-primary text-sm py-2.5">
                  Join HOPE
                </NavLink>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-hope-soft transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-hope-rose" /> : <Menu className="w-5 h-5 text-hope-dark" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-hope-blush/20 overflow-hidden"
          >
            <div className="hope-container py-4 space-y-1">
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => cn(
                    'block px-4 py-3 rounded-2xl font-body font-medium text-sm transition-colors',
                    isActive ? 'bg-hope-soft text-hope-rose' : 'text-hope-dark hover:bg-hope-soft'
                  )}
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-3 border-t border-hope-blush/20 flex gap-3">
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="btn-secondary text-sm w-full">Sign Out</button>
                ) : (
                  <>
                    <NavLink to="/auth" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm flex-1 text-center">Sign In</NavLink>
                    <NavLink to="/auth?tab=register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm flex-1 text-center">Join HOPE</NavLink>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
