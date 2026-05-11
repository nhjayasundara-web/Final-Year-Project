// ============================================================
// HOPE — Utility Functions
// Save to: frontend/src/lib/utils.ts
// ============================================================

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'

// ── Tailwind class merger ──
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Date formatters ──
export const formatDate = (dateStr: string) =>
  format(new Date(dateStr), 'dd MMM yyyy')

export const formatDateTime = (dateStr: string) =>
  format(new Date(dateStr), 'dd MMM yyyy, h:mm a')

export const timeAgo = (dateStr: string) =>
  formatDistanceToNow(new Date(dateStr), { addSuffix: true })

// ── Confidence level label ──
export const getConfidenceLabel = (confidence: number): string => {
  if (confidence >= 90) return 'Very High'
  if (confidence >= 75) return 'High'
  if (confidence >= 60) return 'Moderate'
  return 'Low'
}

// ── Risk color ──
export const getRiskColor = (level: 'low' | 'moderate' | 'high') => {
  return {
    low:      'text-hope-teal bg-hope-mint/20 border-hope-teal/30',
    moderate: 'text-amber-700 bg-amber-50 border-amber-200',
    high:     'text-red-700 bg-red-50 border-red-200',
  }[level]
}

// ── Prediction badge color ──
export const getPredictionColor = (prediction: string) => {
  return {
    normal:     'text-hope-teal bg-hope-mint/20',
    benign:     'text-amber-700 bg-amber-50',
    malignant:  'text-red-700 bg-red-50',
    uncertain:  'text-gray-700 bg-gray-100',
  }[prediction] ?? 'text-gray-700 bg-gray-100'
}

// ── District list (Sri Lanka) ──
export const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
]

// ── Forum categories ──
export const FORUM_CATEGORIES = [
  { value: 'general',   label: 'General Discussion', emoji: '💬' },
  { value: 'treatment', label: 'Treatment Experiences', emoji: '💊' },
  { value: 'emotional', label: 'Emotional Support', emoji: '💗' },
  { value: 'recovery',  label: 'Recovery Stories', emoji: '🌸' },
  { value: 'tips',      label: 'Tips & Advice', emoji: '✨' },
]

// ── Truncate text ──
export const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? text.slice(0, maxLength) + '...' : text

// ── Format LKR price ──
export const formatLKR = (amount: number): string =>
  new Intl.NumberFormat('si-LK', { style: 'currency', currency: 'LKR' }).format(amount)

// ── Get initials for avatar ──
export const getInitials = (name: string): string =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

// ── Scroll to top ──
export const scrollToTop = () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })

// ── Validate Sri Lankan phone ──
export const isValidSriLankaPhone = (phone: string): boolean =>
  /^(\+94|0)[0-9]{9}$/.test(phone.replace(/\s/g, ''))

// ── Read time estimator ──
export const estimateReadTime = (content: string): number =>
  Math.ceil(content.split(/\s+/).length / 200)
