// ============================================================
// HOPE — Home Page
// Save to: frontend/src/components/pages/HomePage.tsx
// ============================================================

import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart, Search, Shield, Users, Pill, MapPin,
  ArrowRight, CheckCircle, Star, TrendingUp
} from 'lucide-react'

const STATS = [
  { number: '1 in 8', label: 'Women affected by breast cancer globally', icon: Heart },
  { number: '90%+', label: 'Survival rate with early detection', icon: TrendingUp },
  { number: '4,000+', label: 'New cases diagnosed yearly in Sri Lanka', icon: Shield },
  { number: '24/7',   label: 'Platform availability for support', icon: Star },
]

const FEATURES = [
  {
    icon: Search,
    title: 'AI-Powered Detection',
    description: 'Upload mammogram images or describe symptoms for our AI model to provide preliminary risk analysis and personalised recommendations.',
    color: 'bg-rose-50 text-hope-rose',
    to: '/detection',
  },
  {
    icon: Shield,
    title: 'Awareness & Education',
    description: 'Access comprehensive information on breast cancer symptoms, risk factors, and step-by-step self-examination guides in Sinhala and English.',
    color: 'bg-hope-soft text-hope-wine',
    to: '/awareness',
  },
  {
    icon: Heart,
    title: 'Psychological Support',
    description: 'Connect with trained counsellors, access motivational content, and join group therapy sessions designed for cancer patients and survivors.',
    color: 'bg-hope-mint/30 text-hope-teal',
    to: '/support',
  },
  {
    icon: Users,
    title: 'Community Forum',
    description: 'Share experiences, ask questions, and find comfort in a safe, moderated community of patients, survivors, caregivers and doctors.',
    color: 'bg-amber-50 text-amber-700',
    to: '/community',
  },
  {
    icon: Pill,
    title: 'Medicine Availability',
    description: 'Search for essential breast cancer medicines and find nearby pharmacies with real-time stock information across all districts in Sri Lanka.',
    color: 'bg-purple-50 text-purple-700',
    to: '/medicine',
  },
  {
    icon: MapPin,
    title: 'Hospital Finder',
    description: 'Locate cancer treatment centres, oncologists, and diagnostic labs near you with contact details, specialties, and directions.',
    color: 'bg-blue-50 text-blue-700',
    to: '/hospital',
  },
]

const STEPS = [
  { step: '01', title: 'Create your profile', desc: 'Register securely as a patient, caregiver, or healthcare professional.' },
  { step: '02', title: 'Check your risk', desc: 'Use our AI symptom checker or guided self-exam tool to assess your risk.' },
  { step: '03', title: 'Get connected', desc: 'Find hospitals, medicines, counsellors, and community support instantly.' },
]

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.1 } } },
  item:      { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
}

export default function HomePage() {
  return (
    <div className="page-enter">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-hope-gradient">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-hope-blush/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-64 h-64 bg-hope-rose/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-hope-blush/5 rounded-full blur-3xl pointer-events-none" />

        {/* Dot pattern top right */}
        <div className="absolute top-0 right-0 w-72 h-72 dot-pattern opacity-20 pointer-events-none" />

        <div className="hope-container relative z-10 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hope-soft border border-hope-blush/40 mb-6">
              <Heart className="w-4 h-4 text-hope-rose fill-hope-rose" />
              <span className="font-body text-sm font-medium text-hope-wine">Early Detection, Better Protection</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-hope-wine leading-tight mb-6">
              Together we<br />
              <em className="text-gradient not-italic">fight</em> — together<br />
              we <em className="text-gradient not-italic">survive.</em>
            </h1>

            <p className="font-body text-lg text-hope-muted leading-relaxed mb-8 max-w-lg">
              HOPE is Sri Lanka's first AI-powered companion for breast cancer detection, awareness,
              and emotional support — designed for patients, caregivers, and healthcare professionals.
            </p>

            <div className="flex flex-wrap gap-4">
              <NavLink to="/detection" className="btn-primary flex items-center gap-2">
                <Search className="w-4 h-4" />
                Check My Risk
              </NavLink>
              <NavLink to="/awareness" className="btn-secondary flex items-center gap-2">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </NavLink>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              {['Free to use', 'Available in Sinhala & English', 'Medically reviewed'].map(text => (
                <div key={text} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-hope-teal" />
                  <span className="font-body text-sm text-hope-muted">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right – floating ribbon card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Main card */}
              <div className="card p-8 w-80 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 text-[120px] opacity-5 font-display font-bold text-hope-rose select-none">♥</div>
                <div className="ribbon-float text-center mb-6">
                  <div className="text-7xl">🎀</div>
                </div>
                <h3 className="font-display text-xl text-hope-wine text-center mb-2">HOPE Platform</h3>
                <p className="font-body text-sm text-hope-muted text-center mb-6">AI-powered breast cancer support for Sri Lanka</p>
                <div className="space-y-3">
                  {['AI Detection Model', 'Pharmacy Network', 'Counselling Services', 'Community Support'].map(item => (
                    <div key={item} className="flex items-center gap-3 p-2.5 rounded-xl bg-hope-soft">
                      <div className="w-5 h-5 rounded-full bg-hope-rose flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-body text-sm text-hope-dark">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating stat pill */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-8 bg-white rounded-2xl shadow-hope-lg p-4 flex items-center gap-3 border border-hope-blush/20"
              >
                <div className="w-10 h-10 bg-hope-mint/30 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-hope-teal" />
                </div>
                <div>
                  <div className="font-display text-lg font-bold text-hope-wine">90%+</div>
                  <div className="font-body text-xs text-hope-muted">Early detection survival</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="wave-bottom" />
      </section>

      {/* ── STATS ── */}
      <section className="py-20 bg-white">
        <div className="hope-container">
          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {STATS.map(({ number, label, icon: Icon }) => (
              <motion.div key={number} variants={stagger.item} className="stat-card overflow-visible">
                <div className="w-12 h-12 rounded-2xl bg-hope-soft flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-hope-rose" />
                </div>
                <div className="font-display text-3xl font-bold text-hope-wine mb-1">{number}</div>
                <p className="font-body text-sm text-hope-muted leading-snug">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-hope-cream">
        <div className="hope-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="hope-divider mx-auto" />
            <h2 className="section-title mt-4">Everything you need,<br />all in one place</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              A comprehensive digital platform connecting patients, caregivers and healthcare professionals across Sri Lanka.
            </p>
          </motion.div>

          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map(({ icon: Icon, title, description, color, to }) => (
              <motion.div key={title} variants={stagger.item}>
                <NavLink to={to} className="card block p-7 h-full group">
                  <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl text-hope-wine mb-2">{title}</h3>
                  <p className="font-body text-sm text-hope-muted leading-relaxed mb-4">{description}</p>
                  <div className="flex items-center gap-1.5 text-hope-rose text-sm font-medium font-body group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-white">
        <div className="hope-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="hope-divider mx-auto" />
            <h2 className="section-title mt-4">Get started in 3 steps</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-hope-blush/50" />
            {STEPS.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-full bg-rose-gradient text-white font-display text-xl font-bold flex items-center justify-center mx-auto mb-5 shadow-hope animate-pulse-rose">
                  {step}
                </div>
                <h3 className="font-display text-xl text-hope-wine mb-2">{title}</h3>
                <p className="font-body text-sm text-hope-muted">{desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <NavLink to="/auth?tab=register" className="btn-primary inline-flex items-center gap-2">
              <Heart className="w-4 h-4 fill-white" />
              Join HOPE Today — It's Free
            </NavLink>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 bg-rose-gradient relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="hope-container text-center relative z-10">
          <div className="text-6xl mb-6 ribbon-float inline-block">🎀</div>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Early detection saves lives.
          </h2>
          <p className="font-body text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Don't wait. Check your symptoms today, find a hospital near you, or talk to our community — all for free.
          </p>
          <NavLink to="/detection" className="bg-white text-hope-rose font-body font-semibold px-8 py-4 rounded-2xl hover:shadow-hope-lg transition-shadow inline-flex items-center gap-2">
            Start AI Check <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      </section>
    </div>
  )
}
