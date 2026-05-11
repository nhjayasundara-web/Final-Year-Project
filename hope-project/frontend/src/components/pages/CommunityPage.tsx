// ============================================================
// HOPE — Community Forum Page
// Save to: frontend/src/components/pages/CommunityPage.tsx
// ============================================================

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Pin, Plus, Search, Send, X } from 'lucide-react'
import { cn, timeAgo, FORUM_CATEGORIES, getInitials } from '../../lib/utils'
import type { ForumPost } from '../../types'

// Mock data – replace with API call
const MOCK_POSTS: ForumPost[] = [
  {
    _id: '1', authorId: 'u1', authorName: 'Nimesha Perera', authorRole: 'patient',
    title: 'Six months after chemo — my story 💗',
    content: 'I wanted to share my experience completing chemotherapy six months ago. It was the hardest thing I\'ve ever done, but I\'m here and I\'m stronger. If anyone is just starting treatment, please know it gets better.',
    category: 'recovery', tags: ['chemo', 'survivor', 'hope'], likes: 47, likedBy: [],
    comments: [], isPinned: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2', authorId: 'u2', authorName: 'Dr. Kamani Silva', authorRole: 'doctor',
    title: 'Understanding your pathology report — a guide',
    content: 'Many patients receive their pathology reports and feel overwhelmed by the terminology. In this post I\'ll walk you through the key terms: ER/PR status, HER2, grade, and margins.',
    category: 'treatment', tags: ['pathology', 'education', 'doctor'], likes: 89, likedBy: [],
    comments: [], isPinned: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3', authorId: 'u3', authorName: 'Sanduni Rathnayake', authorRole: 'caregiver',
    title: 'Tips for supporting a family member through treatment',
    content: 'My mother was diagnosed 8 months ago. Here are the things I wish someone had told me when I became her primary caregiver — practical, emotional, and logistical tips.',
    category: 'tips', tags: ['caregiver', 'family', 'support'], likes: 33, likedBy: [],
    comments: [], isPinned: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '4', authorId: 'u4', authorName: 'Priya Fernando', authorRole: 'patient',
    title: 'Dealing with hair loss — what helped me',
    content: 'I know hair loss during chemo is something many of us face. I\'d like to share practical tips that helped me emotionally and physically cope with this side effect.',
    category: 'emotional', tags: ['hair loss', 'chemo', 'coping'], likes: 28, likedBy: [],
    comments: [], isPinned: false,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const ROLE_BADGE: Record<string, string> = {
  patient:   'bg-hope-soft text-hope-wine border-hope-blush/30',
  caregiver: 'bg-amber-50 text-amber-700 border-amber-200',
  doctor:    'bg-blue-50 text-blue-700 border-blue-200',
  admin:     'bg-purple-50 text-purple-700 border-purple-200',
}

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [showNewPost, setShowNewPost] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' })

  const filtered = MOCK_POSTS.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  }).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))

  const toggleLike = (id: string) =>
    setLikedPosts(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="page-enter py-16">
      <div className="hope-container">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="hope-divider mx-auto" />
          <h1 className="section-title mt-4">Community Forum</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            A safe space to share, support, and connect. Whether you're a patient, survivor, caregiver, or healthcare professional — you belong here.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hope-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="input pl-11"
            />
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn('px-4 py-2 rounded-full font-body text-sm font-medium border transition-all',
              activeCategory === 'all' ? 'bg-hope-rose text-white border-hope-rose' : 'border-hope-blush/40 text-hope-muted hover:border-hope-rose/40'
            )}
          >
            All Posts
          </button>
          {FORUM_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn('px-4 py-2 rounded-full font-body text-sm font-medium border transition-all',
                activeCategory === cat.value ? 'bg-hope-rose text-white border-hope-rose' : 'border-hope-blush/40 text-hope-muted hover:border-hope-rose/40'
              )}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-5">
          {filtered.map((post, i) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card p-6"
            >
              {post.isPinned && (
                <div className="flex items-center gap-1.5 text-xs text-hope-rose font-body font-medium mb-3">
                  <Pin className="w-3 h-3" /> Pinned Post
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-rose-gradient text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {getInitials(post.authorName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-body font-semibold text-hope-dark text-sm">{post.authorName}</span>
                    <span className={cn('badge border text-xs', ROLE_BADGE[post.authorRole])}>
                      {post.authorRole}
                    </span>
                    <span className="font-body text-xs text-hope-muted ml-auto">{timeAgo(post.createdAt)}</span>
                  </div>
                  <h3 className="font-display text-lg text-hope-wine mb-2 hover:text-hope-rose cursor-pointer transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-body text-sm text-hope-muted leading-relaxed mb-4">
                    {post.content.slice(0, 180)}{post.content.length > 180 ? '…' : ''}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(post._id)}
                      className={cn(
                        'flex items-center gap-1.5 font-body text-sm transition-colors',
                        likedPosts.has(post._id) ? 'text-hope-rose' : 'text-hope-muted hover:text-hope-rose'
                      )}
                    >
                      <Heart className={cn('w-4 h-4', likedPosts.has(post._id) && 'fill-hope-rose')} />
                      {post.likes + (likedPosts.has(post._id) ? 1 : 0)}
                    </button>
                    <button className="flex items-center gap-1.5 font-body text-sm text-hope-muted hover:text-hope-dark transition-colors">
                      <MessageCircle className="w-4 h-4" /> {post.comments.length} Reply
                    </button>
                    <div className="flex gap-1.5 ml-auto flex-wrap">
                      {post.tags.map(tag => (
                        <span key={tag} className="badge bg-hope-cream text-hope-muted text-xs"># {tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* New Post Modal */}
        {showNewPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-hope-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-2xl text-hope-wine">Share Your Story</h3>
                <button onClick={() => setShowNewPost(false)} className="p-2 rounded-xl hover:bg-hope-soft transition-colors">
                  <X className="w-5 h-5 text-hope-muted" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={newPost.category}
                    onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}
                    className="input"
                  >
                    {FORUM_CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Title</label>
                  <input
                    value={newPost.title}
                    onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                    placeholder="Give your post a meaningful title…"
                    className="input"
                  />
                </div>
                <div>
                  <label className="form-label">Your Story or Question</label>
                  <textarea
                    value={newPost.content}
                    onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                    placeholder="Share your experience, ask a question, or offer support…"
                    rows={5}
                    className="input resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowNewPost(false)} className="btn-secondary">Cancel</button>
                  <button
                    disabled={!newPost.title || !newPost.content}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Publish Post
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
