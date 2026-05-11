// ============================================================
// HOPE — Hospital Finder Page
// Save to: frontend/src/components/pages/HospitalPage.tsx
// ============================================================

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Globe, Star, CheckCircle, Filter, Search } from 'lucide-react'
import { cn, SRI_LANKA_DISTRICTS } from '../../lib/utils'
import type { Hospital } from '../../types'

const MOCK_HOSPITALS: Hospital[] = [
  {
    _id: 'h1', name: 'Apeksha Hospital (National Cancer Hospital)',
    type: 'government', address: 'Maharagama', district: 'Colombo', province: 'Western',
    phone: ['+94 11 4620000', '+94 11 4620001'], email: 'info@apeksha.health.gov.lk',
    website: 'https://www.health.gov.lk', lat: 6.8485, lng: 79.9968,
    specialties: ['Oncology', 'Radiation Therapy', 'Chemotherapy', 'Surgical Oncology'],
    hasCancerUnit: true, hasOncologist: true, emergencyAvailable: true, rating: 4.5,
  },
  {
    _id: 'h2', name: 'Lanka Hospitals Cancer Centre',
    type: 'private', address: '578 Elvitigala Mawatha, Narahenpita, Colombo 5', district: 'Colombo', province: 'Western',
    phone: ['+94 11 5430000'], email: 'cancer@lankahospitals.com',
    website: 'https://www.lankahospitals.com', lat: 6.8948, lng: 79.8697,
    specialties: ['Medical Oncology', 'Breast Surgery', 'Mammography', 'Genetic Counselling'],
    hasCancerUnit: true, hasOncologist: true, emergencyAvailable: false, rating: 4.8,
  },
  {
    _id: 'h3', name: 'Teaching Hospital Karapitiya',
    type: 'teaching', address: 'Karapitiya, Galle', district: 'Galle', province: 'Southern',
    phone: ['+94 91 2234540'], website: 'https://www.health.gov.lk',
    lat: 6.0534, lng: 80.2113,
    specialties: ['Oncology', 'Surgery', 'Radiology'],
    hasCancerUnit: true, hasOncologist: true, emergencyAvailable: true, rating: 4.1,
  },
  {
    _id: 'h4', name: 'Asiri Surgical Hospital',
    type: 'private', address: '21 Kirimandala Mawatha, Colombo 5', district: 'Colombo', province: 'Western',
    phone: ['+94 11 4526200'], website: 'https://www.asirihealth.com',
    lat: 6.8989, lng: 79.8681,
    specialties: ['Breast Surgery', 'Mammography', 'Oncology', 'Pathology'],
    hasCancerUnit: true, hasOncologist: true, emergencyAvailable: true, rating: 4.7,
  },
  {
    _id: 'h5', name: 'Teaching Hospital Kandy',
    type: 'teaching', address: 'Kandy', district: 'Kandy', province: 'Central',
    phone: ['+94 81 2223337'],
    lat: 7.2906, lng: 80.6337,
    specialties: ['Oncology', 'Surgery', 'Radiation Therapy'],
    hasCancerUnit: true, hasOncologist: true, emergencyAvailable: true, rating: 4.2,
  },
]

const TYPE_BADGE: Record<string, string> = {
  government: 'bg-hope-mint/30 text-hope-teal border-hope-teal/20',
  private:    'bg-blue-50 text-blue-700 border-blue-200',
  teaching:   'bg-purple-50 text-purple-700 border-purple-200',
  clinic:     'bg-amber-50 text-amber-700 border-amber-200',
}

export default function HospitalPage() {
  const [search,   setSearch]   = useState('')
  const [district, setDistrict] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selected, setSelected] = useState<Hospital | null>(null)

  const filtered = MOCK_HOSPITALS.filter(h => {
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase())
    const matchDistrict = !district || h.district === district
    const matchType = !typeFilter || h.type === typeFilter
    return matchSearch && matchDistrict && matchType
  })

  return (
    <div className="page-enter py-16">
      <div className="hope-container">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="hope-divider mx-auto" />
          <h1 className="section-title mt-4">Find a Hospital</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Locate cancer treatment centres, oncologists, and diagnostic facilities near you across Sri Lanka.
          </p>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-8 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hope-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hospital name…"
              className="input pl-11"
            />
          </div>
          <select value={district} onChange={e => setDistrict(e.target.value)} className="input md:w-44">
            <option value="">All Districts</option>
            {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input md:w-40">
            <option value="">All Types</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
            <option value="teaching">Teaching</option>
          </select>
          <button onClick={() => { setSearch(''); setDistrict(''); setTypeFilter('') }} className="btn-ghost flex items-center gap-2 whitespace-nowrap">
            <Filter className="w-4 h-4" /> Clear
          </button>
        </div>

        <p className="font-body text-sm text-hope-muted mb-4">{filtered.length} hospitals found</p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-4">
            {filtered.map((h, i) => (
              <motion.div
                key={h._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <button
                  onClick={() => setSelected(h)}
                  className={cn('card p-5 w-full text-left transition-all',
                    selected?._id === h._id && 'ring-2 ring-hope-rose shadow-hope'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-lg text-hope-wine">{h.name}</h3>
                    <span className={cn('badge border text-xs shrink-0 ml-2', TYPE_BADGE[h.type])}>
                      {h.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-hope-muted shrink-0" />
                    <span className="font-body text-sm text-hope-muted">{h.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {h.specialties.slice(0, 3).map(s => (
                      <span key={s} className="badge bg-hope-cream text-hope-muted text-xs">{s}</span>
                    ))}
                    {h.specialties.length > 3 && (
                      <span className="badge bg-hope-cream text-hope-muted text-xs">+{h.specialties.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {h.hasCancerUnit && (
                      <div className="flex items-center gap-1.5 text-xs text-hope-teal">
                        <CheckCircle className="w-3.5 h-3.5" /> Cancer Unit
                      </div>
                    )}
                    {h.rating && (
                      <div className="flex items-center gap-1 text-xs text-amber-600 ml-auto">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {h.rating}
                      </div>
                    )}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Detail panel */}
          <div className="sticky top-24">
            {selected ? (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="card p-7">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-2xl text-hope-wine">{selected.name}</h3>
                  <span className={cn('badge border text-sm', TYPE_BADGE[selected.type])}>
                    {selected.type}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 font-body text-sm text-hope-dark">
                    <MapPin className="w-4 h-4 text-hope-rose shrink-0 mt-0.5" />
                    {selected.address}, {selected.district}
                  </div>
                  {selected.phone.map(p => (
                    <div key={p} className="flex items-center gap-3 font-body text-sm">
                      <Phone className="w-4 h-4 text-hope-rose shrink-0" />
                      <a href={`tel:${p}`} className="text-hope-dark hover:text-hope-rose transition-colors">{p}</a>
                    </div>
                  ))}
                  {selected.website && (
                    <div className="flex items-center gap-3 font-body text-sm">
                      <Globe className="w-4 h-4 text-hope-rose shrink-0" />
                      <a href={selected.website} target="_blank" rel="noreferrer" className="text-hope-rose hover:underline truncate">
                        {selected.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="font-body font-semibold text-hope-dark mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.specialties.map(s => (
                      <span key={s} className="badge bg-hope-soft text-hope-wine border border-hope-blush/30">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Cancer Unit', val: selected.hasCancerUnit },
                    { label: 'Oncologist', val: selected.hasOncologist },
                    { label: '24h Emergency', val: selected.emergencyAvailable },
                  ].map(({ label, val }) => (
                    <div key={label} className={cn('rounded-2xl p-3 text-center',
                      val ? 'bg-hope-mint/20 border border-hope-teal/20' : 'bg-gray-50 border border-gray-200'
                    )}>
                      <div className={cn('text-lg mb-1', val ? 'text-hope-teal' : 'text-gray-400')}>
                        {val ? '✅' : '❌'}
                      </div>
                      <div className="font-body text-xs text-hope-muted">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <a href={`tel:${selected.phone[0]}`} className="btn-secondary flex items-center gap-2 flex-1 justify-center">
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${selected.lat},${selected.lng}`}
                    target="_blank" rel="noreferrer"
                    className="btn-primary flex items-center gap-2 flex-1 justify-center"
                  >
                    <MapPin className="w-4 h-4" /> Get Directions
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="card p-10 text-center h-64 flex flex-col items-center justify-center">
                <MapPin className="w-12 h-12 text-hope-blush mb-4" />
                <p className="font-display text-xl text-hope-wine mb-2">Select a Hospital</p>
                <p className="font-body text-sm text-hope-muted">Click any hospital to view full details and contact information.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
