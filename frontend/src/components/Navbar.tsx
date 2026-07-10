import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  ['Learn', '/learn'],
  ['Self-exam', '/self-exam'],
  ['Risk check', '/risk'],
  ['AI triage', '/ai-screening'],
  ['Medicines', '/medicines'],
  ['Providers', '/providers'],
  ['Community', '/community'],
  ['Support', '/support']
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const baseClass = 'rounded-full px-3 py-2 text-sm font-medium transition hover:bg-hope-blush hover:text-hope-wine';

  return (
    <header className="sticky top-0 z-40 border-b border-rose-100/80 bg-hope-cream/90 backdrop-blur-xl">
      <div className="section-wrap flex min-h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-hope-blush text-2xl shadow-soft">H</span>
          <span>
            <span className="block font-display text-2xl font-bold text-hope-wine">HOPE</span>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 sm:block">Early detection</span>
          </span>
        </Link>

        <button className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm font-semibold text-hope-wine lg:hidden" onClick={() => setOpen((value) => !value)}>
          Menu
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map(([label, href]) => (
            <NavLink key={href} to={href} className={({ isActive }) => `${baseClass} ${isActive ? 'bg-hope-blush text-hope-wine' : 'text-slate-600'}`}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-secondary px-4 py-2">Dashboard</Link>
              <button onClick={logout} className="btn-primary px-4 py-2">Logout</button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary px-5 py-2">Sign in</Link>
          )}
        </div>
      </div>

      {open && (
        <div className="section-wrap pb-5 lg:hidden">
          <nav className="grid gap-2 rounded-3xl border border-rose-100 bg-white p-3 shadow-soft">
            {navItems.map(([label, href]) => (
              <NavLink key={href} to={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-semibold text-slate-700 hover:bg-hope-blush hover:text-hope-wine">
                {label}
              </NavLink>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-semibold text-slate-700 hover:bg-hope-blush hover:text-hope-wine">Dashboard</Link>
                <button onClick={() => { logout(); setOpen(false); }} className="rounded-2xl bg-hope-wine px-4 py-3 text-left font-semibold text-white">Logout</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="rounded-2xl bg-hope-wine px-4 py-3 font-semibold text-white">Sign in</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
