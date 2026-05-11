// ============================================================
// HOPE — Awareness Page
// Save to: frontend/src/components/pages/AwarenessPage.tsx
// ============================================================

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Hand, ChevronRight, ChevronLeft, Clock, Tag } from 'lucide-react'
import { cn } from '../../lib/utils'

const CATEGORIES = ['All', 'Symptoms', 'Prevention', 'Treatment', 'Lifestyle', 'Screening']

const ARTICLES = [
  {
    id: '1', category: 'Symptoms', readTime: 5,
    title: 'Recognising Early Warning Signs of Breast Cancer',
    summary: 'Learn the key signs and symptoms that should prompt you to seek medical attention, including lumps, nipple changes, and skin texture differences.',
    tags: ['early detection', 'symptoms', 'self-exam'],
    emoji: '🔍',
  },
  {
    id: '2', category: 'Screening', readTime: 4,
    title: 'When and How Often Should You Get a Mammogram?',
    summary: 'Guidelines for breast cancer screening in Sri Lanka, including age recommendations, frequency, and what to expect during the procedure.',
    tags: ['mammogram', 'screening', 'women\'s health'],
    emoji: '🏥',
  },
  {
    id: '3', category: 'Prevention', readTime: 6,
    title: 'Lifestyle Changes That Can Lower Your Breast Cancer Risk',
    summary: 'Evidence-based dietary, exercise, and lifestyle modifications proven to reduce the risk of developing breast cancer.',
    tags: ['prevention', 'lifestyle', 'diet'],
    emoji: '🥗',
  },
  {
    id: '4', category: 'Treatment', readTime: 8,
    title: 'Understanding Breast Cancer Treatment Options in Sri Lanka',
    summary: 'An overview of surgery, chemotherapy, radiation, hormone therapy and targeted therapy available at government and private hospitals.',
    tags: ['treatment', 'hospitals', 'chemotherapy'],
    emoji: '💊',
  },
  {
    id: '5', category: 'Lifestyle', readTime: 3,
    title: 'Eating Well During Breast Cancer Treatment',
    summary: 'Nutritional guidance tailored for patients undergoing chemotherapy, radiation, or surgery — including local Sri Lankan food recommendations.',
    tags: ['nutrition', 'diet', 'recovery'],
    emoji: '🌱',
  },
  {
    id: '6', category: 'Symptoms', readTime: 4,
    title: 'Breast Pain: When Is It Concerning?',
    summary: 'Not all breast pain signals cancer, but this guide helps you understand which types of pain warrant immediate medical attention.',
    tags: ['pain', 'symptoms', 'when to see doctor'],
    emoji: '❤️‍🩹',
  },
]

const SELF_EXAM_STEPS = [
  {
    step: 1,
    title: 'Visual check in the mirror',
    description: 'Stand with your shoulders straight and arms on your hips. Look for any changes in size, shape, or colour. Check for dimpling, puckering, bulging skin or inverted nipples.',
    tip: '💡 Do this in good lighting.',
  },
  {
    step: 2,
    title: 'Raise your arms',
    description: 'Now raise both arms above your head. Look for the same changes — this position can reveal dimpling that is not visible when arms are at sides.',
    tip: '💡 Look for any fluid discharge from the nipples.',
  },
  {
    step: 3,
    title: 'Feel while lying down',
    description: 'Lie down with one arm behind your head. Use the opposite hand with firm, smooth circular motions. Cover the entire breast — from armpit to breastbone, and collarbone to abdomen.',
    tip: '💡 Use the pads of your fingers, not the tips.',
  },
  {
    step: 4,
    title: 'Feel while standing or sitting',
    description: 'Repeat step 3 while standing. Many women find it easiest to do this in the shower with wet or soapy skin. Cover the entire breast using the same small circular motions.',
    tip: '💡 Check your armpits too — lymph nodes can swell.',
  },
  {
    step: 5,
    title: 'Check both breasts thoroughly',
    description: 'Repeat the entire process for the other breast. Note any differences between the two sides — asymmetry can sometimes indicate a problem.',
    tip: '💡 Do this monthly, 3–5 days after your period ends.',
  },
]

export default function AwarenessPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [examStep, setExamStep] = useState(0)
  const [activeTab, setActiveTab] = useState<'articles' | 'selfexam'>('articles')

  const filtered = activeCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory)

  return (
    <div className="page-enter py-16">
      <div className="hope-container">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="hope-divider mx-auto" />
          <h1 className="section-title mt-4">Awareness & Education</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Knowledge is your first line of defence. Explore articles on breast cancer, learn proper self-examination techniques, and understand your risk factors.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-2xl p-1 shadow-card flex gap-1 border border-hope-blush/20">
            {([
              { key: 'articles', label: 'Articles & Guides', Icon: BookOpen },
              { key: 'selfexam', label: 'Self-Exam Guide', Icon: Hand },
            ] as const).map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-medium text-sm transition-all',
                  activeTab === key ? 'bg-rose-gradient text-white shadow-hope' : 'text-hope-muted hover:text-hope-dark'
                )}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── ARTICLES TAB ── */}
        {activeTab === 'articles' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-4 py-2 rounded-full font-body text-sm font-medium border transition-all',
                    activeCategory === cat
                      ? 'bg-hope-rose text-white border-hope-rose'
                      : 'border-hope-blush/40 text-hope-muted hover:border-hope-rose/40 hover:text-hope-rose'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className="card p-6 h-full flex flex-col group cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{article.emoji}</div>
                      <span className="badge bg-hope-soft text-hope-wine border border-hope-blush/30 text-xs">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="font-display text-lg text-hope-wine mb-2 group-hover:text-hope-rose transition-colors">
                      {article.title}
                    </h3>
                    <p className="font-body text-sm text-hope-muted leading-relaxed flex-1 mb-4">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-hope-muted">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-body text-xs">{article.readTime} min read</span>
                      </div>
                      <div className="flex items-center gap-1 text-hope-rose text-sm font-body font-medium group-hover:gap-2 transition-all">
                        Read <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-hope-blush/20">
                      {article.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-[11px] text-hope-muted">
                          <Tag className="w-2.5 h-2.5" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── SELF-EXAM TAB ── */}
        {activeTab === 'selfexam' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            <div className="card p-8">
              {/* Progress bar */}
              <div className="flex items-center gap-3 mb-8">
                {SELF_EXAM_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex-1 h-2 rounded-full transition-all duration-300',
                      i <= examStep ? 'bg-rose-gradient' : 'bg-hope-blush/30'
                    )}
                  />
                ))}
              </div>

              <div className="text-center mb-4">
                <span className="badge bg-hope-soft text-hope-wine border border-hope-blush/30">
                  Step {examStep + 1} of {SELF_EXAM_STEPS.length}
                </span>
              </div>

              <AnimatedStep step={SELF_EXAM_STEPS[examStep]} />

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setExamStep(s => Math.max(0, s - 1))}
                  disabled={examStep === 0}
                  className="btn-secondary flex items-center gap-2 px-4"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                {examStep < SELF_EXAM_STEPS.length - 1 ? (
                  <button
                    onClick={() => setExamStep(s => s + 1)}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-hope-mint/30 text-hope-teal font-body font-medium rounded-2xl px-4 py-3 text-sm gap-2">
                    ✅ Self-exam complete! Repeat monthly.
                  </div>
                )}
              </div>

              <p className="font-body text-xs text-hope-muted text-center mt-4">
                Perform monthly, 3–5 days after your menstrual period when breasts are least tender.
                Post-menopause: choose a fixed date each month.
              </p>
            </div>

            {/* Warning card */}
            <div className="card-soft mt-6 border-l-4 border-hope-rose">
              <h4 className="font-display text-hope-wine mb-2">When to see a doctor immediately</h4>
              <ul className="space-y-1.5">
                {[
                  'A new lump or hardened knot in the breast or underarm',
                  'Nipple discharge (clear, milky, or bloody)',
                  'Any skin dimpling, puckering, or redness',
                  'A change that persists after your next period',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 font-body text-sm text-hope-dark">
                    <span className="text-hope-rose mt-0.5">⚡</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function AnimatedStep({ step }: { step: typeof SELF_EXAM_STEPS[0] }) {
  return (
    <motion.div
      key={step.step}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-hope-soft rounded-3xl p-8 text-center mb-6">
        <div className="text-6xl mb-4">
          {['🪞', '🙌', '🛏️', '🚿', '🔄'][step.step - 1]}
        </div>
        <h3 className="font-display text-2xl text-hope-wine mb-3">{step.title}</h3>
        <p className="font-body text-hope-muted leading-relaxed">{step.description}</p>
      </div>
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <span className="text-xl">{step.tip.slice(0, 2)}</span>
        <p className="font-body text-sm text-amber-800">{step.tip.slice(3)}</p>
      </div>
    </motion.div>
  )
}
