export type Role = 'patient' | 'caregiver' | 'doctor' | 'pharmacist' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
  profile?: Record<string, unknown>;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  readingMinutes: number;
  lastReviewed?: string;
  sources?: string[];
  content: string[];
  reviewStatus?: 'draft' | 'in-review' | 'published';
  countryApplicability?: string;
  nextReviewDate?: string;
  clinicalDisclaimer?: string;
  version?: string;
  reviewedBy?: string;
  reviewerRole?: string;
}

export interface SelfExamStep {
  id: string;
  order: number;
  title: string;
  detail: string;
}

export interface Medicine {
  id: string;
  name: string;
  type: string;
  strength: string;
  pharmacy: string;
  city: string;
  status: string;
  quantity: number;
  note?: string;
  isActive?: boolean;
  updatedByEmail?: string;
}

export interface Provider {
  id: string;
  name: string;
  type: string;
  city: string;
  phone: string;
  email: string;
  services: string[];
  acceptingAppointments: boolean;
  isDemo?: boolean;
  isActive?: boolean;
  verifiedBy?: string;
  verificationSource?: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  title: string;
  body: string;
  tags: string[];
  commentCount?: number;
  createdAt: string;
  moderationStatus?: 'pending' | 'approved' | 'hidden';
}

export interface MedicineRequest {
  id: string;
  medicineName: string;
  city: string;
  contact: string;
  patientName: string;
  notes?: string;
  status: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  providerName: string;
  patientName: string;
  contact: string;
  preferredDate?: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface AiResultRecord {
  id: string;
  createdAt: string;
  confidenceBand?: string;
  result: {
    headline?: string;
    triageCategory?: string;
    score?: number;
  };
}
