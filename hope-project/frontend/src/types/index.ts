// ============================================================
// HOPE — Global TypeScript Types & Interfaces
// Save to: frontend/src/types/index.ts
// ============================================================

// ── User & Auth ──────────────────────────────────────────────
export type UserRole = 'patient' | 'caregiver' | 'doctor' | 'admin'

export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  createdAt: string
  // Patient-specific
  dateOfBirth?: string
  diagnosisDate?: string
  stage?: string
  // Doctor-specific
  specialty?: string
  hospital?: string
  licenseNo?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  role: UserRole
  phone?: string
}

// ── Detection ────────────────────────────────────────────────
export interface DetectionResult {
  _id: string
  userId: string
  imageUrl: string
  prediction: 'benign' | 'malignant' | 'normal' | 'uncertain'
  confidence: number       // 0–100 percentage
  recommendation: string
  createdAt: string
}

export interface SymptomCheckerResult {
  riskLevel: 'low' | 'moderate' | 'high'
  symptoms: string[]
  advice: string
  shouldSeeDoctor: boolean
}

// ── Awareness ────────────────────────────────────────────────
export interface AwarenessArticle {
  _id: string
  title: string
  category: 'symptoms' | 'prevention' | 'treatment' | 'lifestyle' | 'screening'
  summary: string
  content: string
  imageUrl?: string
  readTime: number         // minutes
  tags: string[]
  publishedAt: string
}

export interface SelfExamStep {
  step: number
  title: string
  description: string
  imageUrl?: string
  tip: string
}

// ── Community / Forum ────────────────────────────────────────
export interface ForumPost {
  _id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  authorRole: UserRole
  title: string
  content: string
  category: 'general' | 'treatment' | 'emotional' | 'recovery' | 'tips'
  tags: string[]
  likes: number
  likedBy: string[]        // user IDs
  comments: ForumComment[]
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export interface ForumComment {
  _id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  likes: number
  createdAt: string
}

// ── Medicine ─────────────────────────────────────────────────
export interface Medicine {
  _id: string
  name: string
  genericName: string
  brand: string
  category: 'chemotherapy' | 'hormone' | 'targeted' | 'immunotherapy' | 'supportive' | 'pain'
  description: string
  sideEffects: string[]
  isEssential: boolean    // MOH essential medicine list
  pharmacies: PharmacyStock[]
}

export interface PharmacyStock {
  pharmacyId: string
  pharmacyName: string
  address: string
  district: string
  phone: string
  inStock: boolean
  price?: number          // LKR
  lastUpdated: string
}

export interface MedicineSearchResult {
  medicine: Medicine
  nearbyPharmacies: PharmacyStock[]
}

// ── Hospital ─────────────────────────────────────────────────
export interface Hospital {
  _id: string
  name: string
  type: 'government' | 'private' | 'teaching' | 'clinic'
  address: string
  district: string
  province: string
  phone: string[]
  email?: string
  website?: string
  lat: number
  lng: number
  specialties: string[]
  hasCancerUnit: boolean
  hasOncologist: boolean
  emergencyAvailable: boolean
  rating?: number
}

// ── Counselling / Support ─────────────────────────────────────
export interface CounsellorProfile {
  _id: string
  name: string
  qualifications: string[]
  specialty: string
  languages: string[]     // e.g. ['Sinhala', 'English', 'Tamil']
  avatar?: string
  availableDays: string[]
  sessionTypes: ('online' | 'in-person')[]
  hospital?: string
  contactEmail: string
}

export interface MotivationalContent {
  _id: string
  type: 'quote' | 'story' | 'tip' | 'video'
  title: string
  content: string
  author?: string
  mediaUrl?: string
  tags: string[]
}

// ── API Response Wrappers ─────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ── UI State ─────────────────────────────────────────────────
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
