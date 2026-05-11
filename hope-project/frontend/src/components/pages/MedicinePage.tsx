// ============================================================
// HOPE — Medicine Availability Page
// Save to: frontend/src/components/pages/MedicinePage.tsx
// ============================================================

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Pill, MapPin, Phone, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'
import { cn, SRI_LANKA_DISTRICTS, formatLKR } from '../../lib/utils'

const MOCK_MEDICINES = [
  {
    _id: 'm1', name: 'Tamoxifen', genericName: 'Tamoxifen Citrate', brand: 'Nolvadex',
    category: 'hormone', description: 'Hormone therapy used to treat and prevent breast cancer in women.',
    isEssential: true,
    pharmacies: [
      { pharmacyId: 'p1', pharmacyName: 'National Hospital Pharmacy', address: 'Regent St, Colombo 10', district: 'Colombo', phone: '+94112691111', inStock: true, price: 850, lastUpdated: new Date().toISOString() },
      { pharmacyId: 'p2', pharmacyName: 'Osu Sala – Kandy', address: 'Temple Rd, Kandy', district: 'Kandy', phone: '+94812222845', inStock: true, price: 820, lastUpdated: new Date().toISOString() },
      { pharmacyId: 'p3', pharmacyName: 'City Pharmacy Galle', address: 'Main St, Galle', district: 'Galle', phone: '+94912222333', inStock: false, price: 900, lastUpdated: new Date().toISOString() },
    ]
  },
  {
    _id: 'm2', name: 'Trastuzumab', genericName: 'Trastuzumab', brand: 'Herceptin',
    category: 'targeted', description: 'Targeted therapy for HER2-positive breast cancer patients.',
    isEssential: true,
    pharmacies: [
      { pharmacyId: 'p4', pharmacyName: 'Apeksha Hospital Pharmacy', address: 'Maharagama', district: 'Colombo', phone: '+94114620000', inStock: true, price: 85000, lastUpdated: new Date().toISOString() },
    ]
  },
  {
    _id: 'm3', name: 'Letrozole', genericName: 'Letrozole', brand: 'Femara',
    category: 'hormone', description: 'Aromatase inhibitor used for hormone receptor-positive breast cancer in postmenopausal women.',
    isEssential: true,
    pharmacies: [
      { pharmacyId: 'p5', pharmacyName: 'Lanka Hospitals Pharmacy', address: 'Narahenpita, Colombo 5', district: 'Colombo', phone: '+94115430000', inStock: true, price: 3200, lastUpdated: new Date().toISOString() },
      { pharmacyId: 'p6', pharmacyName: 'Asiri Pharmacy', address: 'Kirula Rd, Colombo 5', district: 'Colombo', phone: '+94114526200', inStock: true, price: 3400, lastUpdated: new Date().toISOString() },
    ]
  },
  {
    _id: 'm4', name: 'Cyclophosphamide', genericName: 'Cyclophosphamide', brand: 'Endoxan',
    category: 'chemotherapy', description: 'Chemotherapy drug used as part of combination regimens for breast cancer.',
    isEssential: true,
    pharmacies: [
      { pharmacyId: 'p7', pharmacyName: 'Apeksha Hospital Pharmacy', address: 'Maharagama', district: 'Colombo', phone: '+94114620000', inStock: true, price: 1200, lastUpdated: new Date().toISOString() },
    ]
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  chemotherapy: 'bg-red-50 text-red-700 border-red-200',
  hormone:      'bg-purple-50 text-purple-700 border-purple-200',
  targeted:     'bg-blue-50 text-blue-700 border-blue-200',
  immunotherapy:'bg-green-50 text-green-700 border-green-200',
  supportive:   'bg-amber-50 text-amber-700 border-amber-200',
  pain:         'bg-gray-50 text-gray-700 border-gray-200',
}

export default function MedicinePage() {
  const [query,          setQuery]          = useState('')
  const [district,       setDistrict]       = useState('')
  const [selectedMed,    setSelectedMed]    = useState<typeof MOCK_MEDICINES[0] | null>(null)
  const [searched,       setSearched]       = useState(false)

  const results = MOCK_MEDICINES.filter(m => {
    const matchName = !query ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.genericName.toLowerCase().includes(query.toLowerCase()) ||
      m.brand.toLowerCase().includes(query.toLowerCase())
    return matchName
  })

  const filteredPharmacies = selectedMed
    ? selectedMed.pharmacies.filter(p => !district || p.district === district)
    : []

  return (
    <div className="page-enter py-16">
      <div className="hope-container">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="hope-divider mx-auto" />
          <h1 className="section-title mt-4">Medicine Availability</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Search for essential breast cancer medicines and find pharmacies with stock near you across all districts in Sri Lanka.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="card p-2 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hope-muted" />
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); setSearched(false); setSelectedMed(null) }}
                placeholder="Search medicine name or generic name…"
                className="input pl-11 border-0 shadow-none bg-transparent focus:ring-0"
              />
            </div>
            <select
              value={district}
              onChange={e => setDistrict(e.target.value)}
              className="input border-0 shadow-none bg-hope-soft w-40 shrink-0"
            >
              <option value="">All Districts</option>
              {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <button
              onClick={() => setSearched(true)}
              className="btn-primary px-5 whitespace-nowrap"
            >
              Search
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {['Tamoxifen', 'Trastuzumab', 'Letrozole', 'Cyclophosphamide'].map(name => (
              <button
                key={name}
                onClick={() => { setQuery(name); setSearched(true) }}
                className="px-3 py-1.5 rounded-full border border-hope-blush/40 text-sm font-body text-hope-muted hover:border-hope-rose/40 hover:text-hope-rose transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left: Medicine list */}
          <div>
            <h3 className="font-display text-xl text-hope-wine mb-4">
              {results.length} Medicine{results.length !== 1 ? 's' : ''} Found
            </h3>
            <div className="space-y-4">
              {results.map((med, i) => (
                <motion.div
                  key={med._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <button
                    onClick={() => setSelectedMed(med)}
                    className={cn(
                      'card p-5 w-full text-left transition-all',
                      selectedMed?._id === med._id && 'ring-2 ring-hope-rose shadow-hope'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Pill className="w-4 h-4 text-hope-rose" />
                          <span className="font-display text-lg text-hope-wine">{med.name}</span>
                          {med.isEssential && (
                            <span className="badge bg-hope-mint/30 text-hope-teal border border-hope-teal/20 text-xs">
                              Essential
                            </span>
                          )}
                        </div>
                        <p className="font-body text-xs text-hope-muted">{med.genericName} · {med.brand}</p>
                      </div>
                      <span className={cn('badge border text-xs', CATEGORY_COLORS[med.category])}>
                        {med.category}
                      </span>
                    </div>
                    <p className="font-body text-sm text-hope-muted mb-3">{med.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-hope-teal" />
                        <span className="font-body text-xs text-hope-teal">
                          {med.pharmacies.filter(p => p.inStock).length} in stock
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-hope-muted" />
                        <span className="font-body text-xs text-hope-muted">
                          {med.pharmacies.length} pharmacies
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Pharmacy list */}
          <div>
            {selectedMed ? (
              <div>
                <h3 className="font-display text-xl text-hope-wine mb-4">
                  Pharmacies stocking {selectedMed.name}
                </h3>
                {filteredPharmacies.length === 0 ? (
                  <div className="card p-8 text-center">
                    <AlertCircle className="w-10 h-10 text-hope-blush mx-auto mb-3" />
                    <p className="font-body text-hope-muted">No pharmacies found in {district || 'this area'}.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPharmacies.map((pharm, i) => (
                      <motion.div
                        key={pharm.pharmacyId}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="card p-5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-display text-base text-hope-wine">{pharm.pharmacyName}</h4>
                          <div className={cn('flex items-center gap-1.5 text-xs font-body font-medium px-2 py-1 rounded-full',
                            pharm.inStock ? 'bg-hope-mint/30 text-hope-teal' : 'bg-red-50 text-red-600'
                          )}>
                            {pharm.inStock
                              ? <><CheckCircle className="w-3 h-3" /> In Stock</>
                              : <><XCircle className="w-3 h-3" /> Out of Stock</>
                            }
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 font-body text-sm text-hope-muted">
                            <MapPin className="w-3.5 h-3.5 shrink-0" /> {pharm.address}
                          </div>
                          <div className="flex items-center gap-2 font-body text-sm text-hope-muted">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <a href={`tel:${pharm.phone}`} className="hover:text-hope-rose transition-colors">
                              {pharm.phone}
                            </a>
                          </div>
                          {pharm.price && (
                            <div className="flex items-center gap-2 font-body text-sm text-hope-dark font-medium">
                              💰 {formatLKR(pharm.price)} per unit
                            </div>
                          )}
                          <div className="flex items-center gap-2 font-body text-xs text-hope-muted/60">
                            <Clock className="w-3 h-3" /> Updated {new Date(pharm.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-10 text-center h-64 flex flex-col items-center justify-center">
                <Pill className="w-12 h-12 text-hope-blush mb-4" />
                <p className="font-display text-xl text-hope-wine mb-2">Select a medicine</p>
                <p className="font-body text-sm text-hope-muted">
                  Click any medicine on the left to see pharmacy availability.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
