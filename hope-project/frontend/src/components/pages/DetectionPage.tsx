// ============================================================
// HOPE — AI Detection Page
// Save to: frontend/src/components/pages/DetectionPage.tsx
// ============================================================

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, AlertCircle, CheckCircle, Activity, Image,
  ChevronRight, RotateCcw, Download
} from 'lucide-react'
import { detectionAPI } from '../../lib/api'
import { cn, getPredictionColor, getConfidenceLabel } from '../../lib/utils'
import type { DetectionResult } from '../../types'

const SYMPTOMS = [
  'Lump or thickening in breast or underarm',
  'Change in size or shape of breast',
  'Nipple discharge (other than breast milk)',
  'Nipple turning inward',
  'Skin dimpling or puckering',
  'Redness or scaling on nipple or breast skin',
  'Swelling of breast (even without a lump)',
  'Persistent pain in breast or nipple',
]

type ActiveTab = 'image' | 'symptoms'

export default function DetectionPage() {
  const [tab,             setTab]           = useState<ActiveTab>('image')
  const [file,            setFile]          = useState<File | null>(null)
  const [preview,         setPreview]       = useState<string | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [result,          setResult]        = useState<DetectionResult | null>(null)
  const [loading,         setLoading]       = useState(false)
  const [error,           setError]         = useState<string | null>(null)

  // ── Dropzone ──
  const onDrop = useCallback((accepted: File[]) => {
    if (!accepted[0]) return
    setFile(accepted[0])
    setPreview(URL.createObjectURL(accepted[0]))
    setResult(null)
    setError(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  // ── Image Analysis ──
  const analyzeImage = async () => {
    if (!file) return
    setLoading(true); setError(null)
    try {
      const form = new FormData()
      form.append('image', file)
      const res = await detectionAPI.uploadImage(form)
      setResult(res.data.data)
    } catch {
      setError('Analysis failed. Please try again or ensure image is clear.')
    } finally {
      setLoading(false)
    }
  }

  // ── Symptom Check ──
  const toggleSymptom = (s: string) =>
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )

  const checkSymptoms = async () => {
    if (!selectedSymptoms.length) return
    setLoading(true); setError(null)
    try {
      const res = await detectionAPI.checkSymptoms(selectedSymptoms)
      setResult(res.data.data)
    } catch {
      setError('Symptom check failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFile(null); setPreview(null); setResult(null)
    setError(null); setSelectedSymptoms([])
  }

  return (
    <div className="page-enter py-16">
      <div className="hope-container">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div className="hope-divider mx-auto" />
          <h1 className="section-title mt-4">AI-Powered Detection</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Upload a mammogram image or describe your symptoms for a preliminary AI risk assessment.
            This does not replace professional medical advice.
          </p>
          <div className="alert-info inline-flex items-center gap-2 mt-4 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            For educational purposes only. Always consult a qualified doctor.
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-2xl p-1 shadow-card flex gap-1 border border-hope-blush/20">
            {([
              { key: 'image',    label: 'Image Analysis', Icon: Image },
              { key: 'symptoms', label: 'Symptom Checker', Icon: Activity },
            ] as const).map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => { setTab(key); reset() }}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-medium text-sm transition-all',
                  tab === key
                    ? 'bg-rose-gradient text-white shadow-hope'
                    : 'text-hope-muted hover:text-hope-dark'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">

            {/* ── Image Upload Tab ── */}
            {tab === 'image' && !result && (
              <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div
                  {...getRootProps()}
                  className={cn(
                    'card p-10 text-center cursor-pointer border-2 border-dashed transition-all',
                    isDragActive ? 'border-hope-rose bg-hope-soft' : 'border-hope-blush/40 hover:border-hope-rose/40'
                  )}
                >
                  <input {...getInputProps()} />
                  {preview ? (
                    <div>
                      <img src={preview} alt="preview" className="max-h-72 mx-auto rounded-2xl object-contain mb-4" />
                      <p className="font-body text-sm text-hope-muted">{file?.name}</p>
                    </div>
                  ) : (
                    <>
                      <Upload className={cn('w-12 h-12 mx-auto mb-4', isDragActive ? 'text-hope-rose' : 'text-hope-blush')} />
                      <p className="font-display text-xl text-hope-wine mb-2">
                        {isDragActive ? 'Drop it here' : 'Upload mammogram image'}
                      </p>
                      <p className="font-body text-sm text-hope-muted mb-4">
                        Drag & drop or click to browse · JPG, PNG up to 10MB
                      </p>
                      <button className="btn-secondary text-sm">Choose File</button>
                    </>
                  )}
                </div>

                {file && (
                  <div className="flex gap-3 mt-4">
                    <button onClick={reset} className="btn-ghost flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" /> Clear
                    </button>
                    <button
                      onClick={analyzeImage}
                      disabled={loading}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Analysing…</>
                      ) : (
                        <><Activity className="w-4 h-4" /> Analyse Image</>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Symptom Checker Tab ── */}
            {tab === 'symptoms' && !result && (
              <motion.div key="symptoms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="card p-8">
                  <h3 className="font-display text-xl text-hope-wine mb-2">Select symptoms you have noticed</h3>
                  <p className="font-body text-sm text-hope-muted mb-6">Select all that apply. Be as accurate as possible.</p>
                  <div className="space-y-3">
                    {SYMPTOMS.map(symptom => {
                      const selected = selectedSymptoms.includes(symptom)
                      return (
                        <button
                          key={symptom}
                          onClick={() => toggleSymptom(symptom)}
                          className={cn(
                            'w-full flex items-center gap-3 p-4 rounded-2xl border text-left font-body text-sm transition-all',
                            selected
                              ? 'border-hope-rose bg-hope-soft text-hope-wine'
                              : 'border-hope-blush/30 hover:border-hope-rose/30 text-hope-dark'
                          )}
                        >
                          <div className={cn(
                            'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                            selected ? 'border-hope-rose bg-hope-rose' : 'border-hope-blush'
                          )}>
                            {selected && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          {symptom}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setSelectedSymptoms([])} className="btn-ghost">Clear All</button>
                    <button
                      onClick={checkSymptoms}
                      disabled={!selectedSymptoms.length || loading}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Checking…</>
                      ) : (
                        <>Check Risk ({selectedSymptoms.length} selected) <ChevronRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Result ── */}
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-8"
              >
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">
                    {result.prediction === 'normal' ? '✅' : result.prediction === 'benign' ? '⚠️' : '🔴'}
                  </div>
                  <h3 className="font-display text-2xl text-hope-wine mb-2">Analysis Complete</h3>
                  <div className={cn('badge mx-auto text-base px-4 py-2 border', getPredictionColor(result.prediction))}>
                    {result.prediction.charAt(0).toUpperCase() + result.prediction.slice(1)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="card-soft text-center">
                    <div className="font-display text-3xl font-bold text-hope-wine">{result.confidence}%</div>
                    <div className="font-body text-sm text-hope-muted">Confidence — {getConfidenceLabel(result.confidence)}</div>
                  </div>
                  <div className="card-soft text-center">
                    <div className="font-display text-3xl font-bold text-hope-wine capitalize">{result.prediction}</div>
                    <div className="font-body text-sm text-hope-muted">AI Prediction</div>
                  </div>
                </div>

                <div className="alert-info mb-6">
                  <h4 className="font-body font-semibold mb-1">Recommendation</h4>
                  <p className="font-body text-sm">{result.recommendation}</p>
                </div>

                <div className="alert-error mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="font-body text-sm">
                      <strong>Important:</strong> This AI analysis is for informational purposes only. Please consult a qualified oncologist or breast care specialist for a proper diagnosis.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={reset} className="btn-secondary flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> New Analysis
                  </button>
                  <button className="btn-ghost flex items-center gap-2">
                    <Download className="w-4 h-4" /> Save Report
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {error && (
            <div className="alert-error mt-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
