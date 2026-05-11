// ============================================================
// HOPE — Axios API Client
// Save to: frontend/src/lib/api.ts
// ============================================================

import axios, { AxiosError, AxiosResponse } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request Interceptor: attach JWT token ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hope_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor: handle 401 ──
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hope_token')
      localStorage.removeItem('hope_user')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export default api

// ── Auth Endpoints ──
export const authAPI = {
  login:    (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: object) =>
    api.post('/auth/register', data),
  me:       () =>
    api.get('/auth/me'),
  logout:   () =>
    api.post('/auth/logout'),
}

// ── Detection Endpoints ──
export const detectionAPI = {
  uploadImage: (formData: FormData) =>
    api.post('/detect/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  checkSymptoms: (symptoms: string[]) =>
    api.post('/detect/symptoms', { symptoms }),
  getHistory: () =>
    api.get('/detect/history'),
}

// ── Awareness Endpoints ──
export const awarenessAPI = {
  getArticles: (category?: string) =>
    api.get('/awareness/articles', { params: { category } }),
  getArticle:  (id: string) =>
    api.get(`/awareness/articles/${id}`),
  getSelfExamSteps: () =>
    api.get('/awareness/self-exam'),
  getRiskFactors: () =>
    api.get('/awareness/risk-factors'),
}

// ── Community Endpoints ──
export const communityAPI = {
  getPosts:    (category?: string, page = 1) =>
    api.get('/community/posts', { params: { category, page } }),
  getPost:     (id: string) =>
    api.get(`/community/posts/${id}`),
  createPost:  (data: object) =>
    api.post('/community/posts', data),
  likePost:    (id: string) =>
    api.post(`/community/posts/${id}/like`),
  addComment:  (postId: string, content: string) =>
    api.post(`/community/posts/${postId}/comments`, { content }),
  deletePost:  (id: string) =>
    api.delete(`/community/posts/${id}`),
}

// ── Medicine Endpoints ──
export const medicineAPI = {
  search:       (query: string, district?: string) =>
    api.get('/medicine/search', { params: { query, district } }),
  getMedicine:  (id: string) =>
    api.get(`/medicine/${id}`),
  getPharmacies: (medicineId: string, district?: string) =>
    api.get(`/medicine/${medicineId}/pharmacies`, { params: { district } }),
  reportStock:  (pharmacyId: string, medicineId: string, inStock: boolean) =>
    api.post('/medicine/stock-report', { pharmacyId, medicineId, inStock }),
}

// ── Hospital Endpoints ──
export const hospitalAPI = {
  search:      (district?: string, speciality?: string) =>
    api.get('/hospital/search', { params: { district, speciality } }),
  getHospital: (id: string) =>
    api.get(`/hospital/${id}`),
  getNearby:   (lat: number, lng: number, radius = 20) =>
    api.get('/hospital/nearby', { params: { lat, lng, radius } }),
}

// ── Support Endpoints ──
export const supportAPI = {
  getCounsellors:     () =>
    api.get('/support/counsellors'),
  getMotivational:    () =>
    api.get('/support/motivational'),
  bookAppointment:    (counsellorId: string, data: object) =>
    api.post(`/support/book/${counsellorId}`, data),
}
