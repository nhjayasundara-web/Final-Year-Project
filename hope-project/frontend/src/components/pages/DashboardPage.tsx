// ============================================================
// HOPE — User Dashboard Page
// Save to: frontend/src/components/pages/DashboardPage.tsx
// ============================================================

import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart, Activity, BookOpen, Users, Pill, MapPin,
  Calendar, Bell, TrendingUp, Clock, ChevronRight, Shield
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getInitials, formatDate } from '../../lib/utils'

const QUICK_ACTIONS = [
  { label: 'Run AI Check',       icon: Activity, to: '/detection',  color: 'bg-hope-rose text-white' },
  { label: 'Self-Exam Guide',    icon: Shield,   to: '/awareness#self-exam', color: 'bg-hope-soft text-hope-wine border border-hope-blush/40' },
  { label: 'Find Medicine',      icon: Pill,     to: '/medicine',   color: 'bg-purple-50 text-purple-700 border border-purple-200' },
  { label: 'Locate Hospital',    icon: MapPin,   to: '/hospital',   color: 'bg-blue-50 text-blue-700 border border-blue-200' },
  { label: 'Community Forum',    icon: Users,    to: '/community',  color: 'bg-amber-50 text-amber-700 border border-amber-200' },
  { label: 'Read Articles',      icon: BookOpen, to: '/awareness',  color: 'bg-hope-mint/30 text-hope-teal border border-hope-teal/20' },
]

const RECENT_ARTICLES = [
  { title: 'Recognising Early Warning Signs', category: 'Symptoms',  time: '5 min read' },
  { title: 'When Should You Get a Mammogram?', category: 'Screening', time: '4 min read' },
  { title: 'Lifestyle Changes That Reduce Risk', category: 'Prevention', time: '6 min read' },
]

const AWARENESS_TIPS = [
  '🔍 Perform a breast self-exam monthly — 3–5 days after your period ends.',
  '🏥 Schedule a clinical breast exam every 1–3 years if aged 20–39.',
  '📅 Get an annual mammogram starting at age 40, or earlier if high-risk.',
  '🥗 A diet rich in fruits and vegetables may help lower your cancer risk.',
  '🚶‍♀️ Regular physical activity reduces breast cancer risk by up to 25%.',
]

export default function DashboardPage() {
  const { user } = useAuth()
  const today = new Date()
  const tip = AWARENESS_TIPS[today.getDate() % AWARENESS_TIPS.length]

  return (
    <div className="page-enter py-10">
      <div className="hope-container">

        {/* ── Welcome Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-gradient text-white font-display text-2xl font-bold flex items-center justify-center shadow-hope">
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                : getInitials(user?.name ?? 'U')
              }
            </div>
            <div>
              <p className="font-body text-sm text-hope-muted">Good {getGreeting()},</p>
              <h1 className="font-display text-3xl text-hope-wine">{user?.name?.split(' ')[0]} 💗</h1>
              <p className="font-body text-xs text-hope-muted capitalize">{user?.role} · Joined HOPE</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl bg-white shadow-card hover:shadow-card-hover transition-shadow border border-hope-blush/20">
              <Bell className="w-5 h-5 text-hope-muted" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-hope-rose rounded-full" />
            </button>
            <NavLink to="/awareness#self-exam" className="btn-primary flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 fill-white" /> Self-Exam Today
            </NavLink>
          </div>
        </motion.div>

        {/* ── Daily Tip Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-rose-gradient rounded-3xl p-6 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 dot-pattern opacity-10" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <p className="font-body text-xs text-white/70 uppercase tracking-wider mb-1">
                Today's Awareness Tip · {formatDate(today.toISOString())}
              </p>
              <p className="font-body text-white font-medium leading-relaxed">{tip}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left Column (2/3) ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="font-display text-xl text-hope-wine mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {QUICK_ACTIONS.map(({ label, icon: Icon, to, color }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={`${color} rounded-2xl p-4 flex flex-col gap-3 hover:shadow-card-hover transition-all hover:-translate-y-0.5 font-body`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{label}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>

            {/* Detection History */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-hope-wine">Recent AI Checks</h2>
                <NavLink to="/detection" className="font-body text-sm text-hope-rose hover:underline flex items-center gap-1">
                  New Check <ChevronRight className="w-3.5 h-3.5" />
                </NavLink>
              </div>
              <div className="card p-6">
                <div className="text-center py-8">
                  <Activity className="w-10 h-10 text-hope-blush mx-auto mb-3" />
                  <p className="font-display text-lg text-hope-wine mb-1">No checks yet</p>
                  <p className="font-body text-sm text-hope-muted mb-4">Run your first AI symptom check or image analysis.</p>
                  <NavLink to="/detection" className="btn-primary text-sm">Start AI Check</NavLink>
                </div>
              </div>
            </motion.div>

            {/* Recent Articles */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-hope-wine">Recommended Reading</h2>
                <NavLink to="/awareness" className="font-body text-sm text-hope-rose hover:underline flex items-center gap-1">
                  All Articles <ChevronRight className="w-3.5 h-3.5" />
                </NavLink>
              </div>
              <div className="space-y-3">
                {RECENT_ARTICLES.map(article => (
                  <NavLink
                    key={article.title}
                    to="/awareness"
                    className="card p-4 flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-hope-soft flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-hope-rose" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium text-sm text-hope-dark group-hover:text-hope-rose transition-colors truncate">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="badge bg-hope-cream text-hope-muted text-xs">{article.category}</span>
                        <span className="flex items-center gap-1 font-body text-xs text-hope-muted">
                          <Clock className="w-3 h-3" /> {article.time}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-hope-muted shrink-0 group-hover:text-hope-rose transition-colors" />
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right Column (1/3) ── */}
          <div className="space-y-6">

            {/* Monthly Reminder */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="card p-6 border-l-4 border-hope-rose">
                <div className="flex items-start gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-hope-rose shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-lg text-hope-wine">Monthly Self-Exam</h3>
                    <p className="font-body text-xs text-hope-muted">Scheduled for every 15th</p>
                  </div>
                </div>
                <p className="font-body text-sm text-hope-muted mb-4 leading-relaxed">
                  Regular self-examination is one of the most effective ways to detect changes early. Takes only 5 minutes.
                </p>
                <NavLink to="/awareness#self-exam" className="btn-primary w-full text-center text-sm block">
                  Start Self-Exam 🌸
                </NavLink>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <h3 className="font-display text-lg text-hope-wine mb-3">Platform Today</h3>
              <div className="space-y-3">
                {[
                  { label: 'Community members', value: '1,247', icon: Users, color: 'text-hope-teal' },
                  { label: 'Articles published', value: '86',   icon: BookOpen, color: 'text-hope-rose' },
                  { label: 'AI checks run',      value: '3,452', icon: Activity, color: 'text-purple-600' },
                  { label: 'Hospitals listed',   value: '48',   icon: MapPin, color: 'text-blue-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-hope-blush/20">
                    <Icon className={`w-4 h-4 ${color} shrink-0`} />
                    <span className="font-body text-sm text-hope-muted flex-1">{label}</span>
                    <span className="font-display text-base font-bold text-hope-wine">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Community snippet */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="card-soft">
                <h3 className="font-display text-lg text-hope-wine mb-3">Latest in Community</h3>
                <div className="space-y-3">
                  {[
                    { author: 'Nimesha P.', post: 'Six months after chemo — my story 💗', role: 'patient' },
                    { author: 'Dr. Kamani S.', post: 'Understanding your pathology report', role: 'doctor' },
                  ].map(({ author, post, role }) => (
                    <NavLink key={post} to="/community" className="block p-3 rounded-2xl bg-white border border-hope-blush/20 hover:border-hope-rose/30 transition-colors">
                      <p className="font-body text-xs text-hope-muted mb-1">{author} · <span className="capitalize">{role}</span></p>
                      <p className="font-body text-sm text-hope-dark">{post}</p>
                    </NavLink>
                  ))}
                </div>
                <NavLink to="/community" className="btn-ghost w-full mt-3 text-center text-sm flex items-center justify-center gap-1">
                  View All Posts <ChevronRight className="w-3.5 h-3.5" />
                </NavLink>
              </div>
            </motion.div>

            {/* Progress card */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <div className="card p-6 text-center relative overflow-hidden">
                <div className="absolute -top-4 -right-4 text-[80px] opacity-5 font-display">♥</div>
                <TrendingUp className="w-8 h-8 text-hope-teal mx-auto mb-3" />
                <h3 className="font-display text-lg text-hope-wine mb-1">You're taking action</h3>
                <p className="font-body text-xs text-hope-muted mb-3">Early awareness is your strongest shield.</p>
                <div className="text-4xl">🎀</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
