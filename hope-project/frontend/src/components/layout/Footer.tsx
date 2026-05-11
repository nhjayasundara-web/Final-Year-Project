// ============================================================
// HOPE — Footer Component
// Save to: frontend/src/components/layout/Footer.tsx
// ============================================================

import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-hope-dark text-white/80 pt-16 pb-8 mt-24">
      <div className="hope-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-rose-gradient rounded-2xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-white">HOPE</div>
                <div className="text-[10px] text-white/40 tracking-wider uppercase">Early Detection</div>
              </div>
            </div>
            <p className="font-body text-sm leading-relaxed text-white/60 mb-6">
              An AI-powered companion for breast cancer detection, awareness, and support.
              Together we fight — together we survive.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-hope-rose flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                ['Awareness', '/awareness'],
                ['AI Detection', '/detection'],
                ['Psychological Support', '/support'],
                ['Community Forum', '/community'],
              ].map(([label, to]) => (
                <li key={to}>
                  <NavLink to={to} className="font-body text-sm text-white/60 hover:text-hope-blush transition-colors">
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {[
                ['Find Hospitals', '/hospital'],
                ['Medicine Search', '/medicine'],
                ['Self-Examination Guide', '/awareness#self-exam'],
                ['Risk Factor Quiz', '/awareness#quiz'],
              ].map(([label, to]) => (
                <li key={to}>
                  <NavLink to={to} className="font-body text-sm text-white/60 hover:text-hope-blush transition-colors">
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-hope-blush mt-0.5 shrink-0" />
                <span className="font-body text-sm text-white/60">SLTC Research University, Padukka, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-hope-blush shrink-0" />
                <span className="font-body text-sm text-white/60">+94 76 621 6758</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-hope-blush shrink-0" />
                <span className="font-body text-sm text-white/60">22ug3-0210@sltc.ac.lk</span>
              </li>
            </ul>

            <div className="mt-6 p-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="font-body text-xs text-white/40 leading-relaxed">
                ⚠️ This platform provides informational support only and is not a substitute for professional medical advice. Always consult a qualified healthcare professional.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-white/40">
            © 2026 HOPE Platform · CIT310 · #CIT310_01_26_56 · SLTC Research University
          </p>
          <p className="font-body text-sm text-white/40 flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-hope-rose fill-hope-rose" /> for Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  )
}
