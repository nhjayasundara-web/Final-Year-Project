// ============================================================
// HOPE — Psychological Support Page
// Save to: frontend/src/components/pages/SupportPage.tsx
// ============================================================

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Video, MapPin, Calendar, Phone, Quote } from 'lucide-react'
import { cn } from '../../lib/utils'

const COUNSELLORS = [
  {
    _id: 'c1', name: 'Dr. Priyanthi Jayasinghe', qualifications: ['PhD Clinical Psychology', 'MSc Oncology Counselling'],
    specialty: 'Cancer patient counselling & grief therapy', languages: ['Sinhala', 'English'],
    availableDays: ['Monday', 'Wednesday', 'Friday'], sessionTypes: ['online', 'in-person'] as const,
    hospital: 'Apeksha Hospital, Maharagama', contactEmail: 'priyanthi@hope.lk', avatar: null,
  },
  {
    _id: 'c2', name: 'Mr. Kasun Bandara', qualifications: ['MA Counselling Psychology', 'Certified Oncology Social Worker'],
    specialty: 'Family support & caregiver burnout', languages: ['Sinhala', 'English', 'Tamil'],
    availableDays: ['Tuesday', 'Thursday', 'Saturday'], sessionTypes: ['online'] as const,
    hospital: 'NIMH, Angoda', contactEmail: 'kasun@hope.lk', avatar: null,
  },
  {
    _id: 'c3', name: 'Dr. Nirmala Cooray', qualifications: ['MD Psychiatry', 'Diploma Palliative Care'],
    specialty: 'Anxiety, depression & end-of-life counselling', languages: ['Sinhala', 'Tamil', 'English'],
    availableDays: ['Monday', 'Tuesday', 'Thursday'], sessionTypes: ['online', 'in-person'] as const,
    hospital: 'General Hospital Kandy', contactEmail: 'nirmala@hope.lk', avatar: null,
  },
]

const MOTIVATIONAL = [
  { type: 'quote', content: 'You are not fighting alone. Every woman who has walked this path before you has lit a candle in the dark.', author: 'HOPE Community' },
  { type: 'quote', content: 'Strength is not the absence of fear — it is choosing to face it, one day at a time.', author: 'Survivor, Colombo' },
  { type: 'tip',   content: '🌸 Self-care tip: Gentle walks in the morning can reduce fatigue and boost mood during chemotherapy. Even 10 minutes helps.', author: 'Dr. Priyanthi Jayasinghe' },
  { type: 'story', content: 'Nimesha completed 6 months of chemotherapy and is now cancer-free. "I thought my life was over. But it was just a new chapter beginning," she says.', author: 'Nimesha, 38, Gampaha' },
  { type: 'quote', content: 'The pink ribbon is not just a symbol. It is a promise — that no woman fights this alone.', author: 'HOPE Team' },
  { type: 'tip',   content: '💊 Treatment tip: Keep a symptom diary during treatment to help your oncologist adjust your care plan. Bring it to every appointment.', author: 'Dr. Kamani Silva' },
]

const RESOURCES = [
  { emoji: '📞', title: 'Cancer Helpline', desc: 'Free counselling helpline operated by the National Cancer Control Programme Sri Lanka.', contact: '0112 695 695', type: 'phone' },
  { emoji: '💬', title: 'Online Chat Support', desc: '24/7 anonymous chat with trained volunteer supporters from our HOPE community.', contact: 'Chat now →', type: 'link' },
  { emoji: '👥', title: 'Group Therapy Sessions', desc: 'Weekly online group sessions for patients and survivors, facilitated by certified counsellors.', contact: 'Enroll →', type: 'link' },
  { emoji: '📚', title: 'Coping Guides', desc: 'Downloadable PDF guides on managing anxiety, nutrition, hair loss, and family communication during treatment.', contact: 'Download →', type: 'link' },
]

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'counsellors' | 'motivation' | 'resources'>('counsellors')
  const [selectedLang, setSelectedLang] = useState('All')

  const filteredCounsellors = COUNSELLORS.filter(c =>
    selectedLang === 'All' || c.languages.includes(selectedLang)
  )

  return (
    <div className="page-enter py-16">
      <div className="hope-container">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="hope-divider mx-auto" />
          <h1 className="section-title mt-4">Psychological Support</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Your mental health matters as much as your physical health. Connect with trained counsellors, find community strength, and access emotional wellness resources.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-2xl p-1 shadow-card flex gap-1 border border-hope-blush/20 flex-wrap">
            {([
              { key: 'counsellors', label: 'Find Counsellors', emoji: '👩‍⚕️' },
              { key: 'motivation',  label: 'Daily Motivation', emoji: '💗' },
              { key: 'resources',   label: 'Support Resources', emoji: '📚' },
            ] as const).map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-medium text-sm transition-all',
                  activeTab === key ? 'bg-rose-gradient text-white shadow-hope' : 'text-hope-muted hover:text-hope-dark'
                )}
              >
                {emoji} {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── COUNSELLORS ── */}
        {activeTab === 'counsellors' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {['All', 'Sinhala', 'English', 'Tamil'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={cn('px-4 py-2 rounded-full font-body text-sm border transition-all',
                    selectedLang === lang ? 'bg-hope-rose text-white border-hope-rose' : 'border-hope-blush/40 text-hope-muted hover:border-hope-rose/40'
                  )}
                >{lang}</button>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {filteredCounsellors.map((c, i) => (
                <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="card p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-gradient text-white font-display text-xl font-bold flex items-center justify-center shrink-0">
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-display text-lg text-hope-wine">{c.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {c.sessionTypes.map(t => (
                            <span key={t} className="badge bg-hope-soft text-hope-wine border border-hope-blush/30 text-xs gap-1">
                              {t === 'online' ? <Video className="w-2.5 h-2.5" /> : <MapPin className="w-2.5 h-2.5" />}
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="font-body text-sm text-hope-muted mb-3 flex-1">{c.specialty}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 font-body text-xs text-hope-muted">
                        🌐 {c.languages.join(', ')}
                      </div>
                      <div className="flex items-center gap-2 font-body text-xs text-hope-muted">
                        <Calendar className="w-3 h-3" /> {c.availableDays.join(', ')}
                      </div>
                      {c.hospital && (
                        <div className="flex items-center gap-2 font-body text-xs text-hope-muted">
                          <MapPin className="w-3 h-3" /> {c.hospital}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <a href={`tel:${c.contactEmail}`} className="btn-secondary flex-1 flex items-center justify-center gap-1.5 text-sm py-2">
                        <Phone className="w-3.5 h-3.5" /> Contact
                      </a>
                      <button className="btn-primary flex-1 text-sm py-2">Book Session</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── MOTIVATION ── */}
        {activeTab === 'motivation' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            <div className="space-y-5">
              {MOTIVATIONAL.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn('card p-7', item.type === 'story' ? 'border-l-4 border-hope-rose' : '')}
                >
                  {item.type === 'quote' && (
                    <Quote className="w-8 h-8 text-hope-blush mb-4" />
                  )}
                  <p className="font-body text-base leading-relaxed text-hope-dark mb-3">{item.content}</p>
                  <p className="font-body text-sm text-hope-muted font-medium">— {item.author}</p>
                </motion.div>
              ))}
            </div>
            <div className="card-soft mt-8 text-center">
              <Heart className="w-8 h-8 text-hope-rose mx-auto mb-3 fill-hope-rose" />
              <h3 className="font-display text-xl text-hope-wine mb-2">Share Your Story</h3>
              <p className="font-body text-sm text-hope-muted mb-4">Your experience can give someone else hope.</p>
              <button className="btn-primary">Contribute a Story</button>
            </div>
          </motion.div>
        )}

        {/* ── RESOURCES ── */}
        {activeTab === 'resources' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid md:grid-cols-2 gap-6">
              {RESOURCES.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="card p-7 flex gap-5">
                    <div className="text-4xl shrink-0">{r.emoji}</div>
                    <div>
                      <h3 className="font-display text-xl text-hope-wine mb-2">{r.title}</h3>
                      <p className="font-body text-sm text-hope-muted leading-relaxed mb-4">{r.desc}</p>
                      <button className={cn(
                        'font-body font-medium text-sm',
                        r.type === 'phone' ? 'btn-secondary flex items-center gap-2' : 'btn-primary'
                      )}>
                        {r.type === 'phone' && <Phone className="w-3.5 h-3.5" />}
                        {r.contact}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 bg-rose-gradient rounded-3xl p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 dot-pattern opacity-10" />
              <div className="relative z-10">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="font-display text-2xl mb-2">Are you a trained counsellor?</h3>
                <p className="font-body text-white/80 text-sm mb-6 max-w-md mx-auto">
                  Join our volunteer network and offer your expertise to women who need it most across Sri Lanka.
                </p>
                <button className="bg-white text-hope-rose font-body font-semibold px-6 py-3 rounded-2xl hover:shadow-hope-lg transition-shadow">
                  Join as Counsellor
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}
