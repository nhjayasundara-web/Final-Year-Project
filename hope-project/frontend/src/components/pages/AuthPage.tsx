// ============================================================
// HOPE — Auth Page (Login + Register)
// Save to: frontend/src/components/pages/AuthPage.tsx
// ============================================================

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Heart, Eye, EyeOff, AlertCircle, User, Mail, Phone, Lock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'
import toast from 'react-hot-toast'
import type { UserRole } from '../../types'

// ── Zod Schemas ──
const loginSchema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Enter a valid email address'),
  phone:    z.string().optional(),
  role:     z.enum(['patient', 'caregiver', 'doctor']),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm:  z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})

type LoginForm    = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

const ROLES: { value: UserRole; label: string; desc: string; emoji: string }[] = [
  { value: 'patient',   label: 'Patient',          desc: 'I am seeking information or support',    emoji: '🌸' },
  { value: 'caregiver', label: 'Caregiver/Family',  desc: 'I support someone with breast cancer',   emoji: '💗' },
  { value: 'doctor',    label: 'Healthcare Professional', desc: 'I am a doctor, nurse or health worker', emoji: '👩‍⚕️' },
]

export default function AuthPage() {
  const [params] = useSearchParams()
  const [tab, setTab] = useState<'login' | 'register'>(
    params.get('tab') === 'register' ? 'register' : 'login'
  )
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { login, register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (isAuthenticated) navigate('/dashboard') }, [isAuthenticated, navigate])

  // ── Login form ──
  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const onLogin = async (data: LoginForm) => {
    try {
      await login(data)
      toast.success('Welcome back! 💗')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed. Please check your credentials.')
    }
  }

  // ── Register form ──
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'patient' },
  })
  const selectedRole = registerForm.watch('role')

  const onRegister = async (data: RegisterForm) => {
    try {
      const { confirm, ...payload } = data
      await register(payload)
      toast.success('Welcome to HOPE! 🎀')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-hope-gradient flex items-center justify-center py-16 px-4 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-hope-blush/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-hope-rose/10 rounded-full blur-3xl" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-hope-blush/10 rounded-full blur-2xl" />

      <div className="w-full max-w-xl relative z-10">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <NavLink to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-rose-gradient rounded-2xl flex items-center justify-center shadow-hope group-hover:shadow-hope-lg transition-shadow">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="text-left">
              <div className="font-display text-2xl font-bold text-hope-wine">HOPE</div>
              <div className="font-body text-xs text-hope-muted tracking-wider">Early Detection, Better Protection</div>
            </div>
          </NavLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8 md:p-10"
        >
          {/* Tab switcher */}
          <div className="flex bg-hope-cream rounded-2xl p-1 gap-1 mb-8">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 py-2.5 rounded-xl font-body font-medium text-sm transition-all capitalize',
                  tab === t ? 'bg-white text-hope-rose shadow-card' : 'text-hope-muted hover:text-hope-dark'
                )}
              >
                {t === 'login' ? 'Sign In' : 'Join HOPE'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── LOGIN FORM ── */}
            {tab === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <h2 className="font-display text-2xl text-hope-wine">Welcome back</h2>
                  <p className="font-body text-sm text-hope-muted mt-1">Sign in to your HOPE account</p>
                </div>

                {/* Email */}
                <div>
                  <label className="form-label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hope-muted" />
                    <input
                      {...loginForm.register('email')}
                      type="email"
                      placeholder="you@example.com"
                      className={cn('input pl-11', loginForm.formState.errors.email && 'border-red-400 focus:border-red-400 focus:ring-red-100')}
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 font-body">
                      <AlertCircle className="w-3 h-3" /> {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="form-label">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hope-muted" />
                    <input
                      {...loginForm.register('password')}
                      type={showPass ? 'text' : 'password'}
                      placeholder="Your password"
                      className={cn('input pl-11 pr-11', loginForm.formState.errors.password && 'border-red-400')}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-hope-muted hover:text-hope-dark">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 font-body">
                      <AlertCircle className="w-3 h-3" /> {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button type="button" className="font-body text-sm text-hope-rose hover:underline">Forgot password?</button>
                </div>

                <button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                >
                  {loginForm.formState.isSubmitting ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in…</>
                  ) : (
                    <>Sign In <Heart className="w-4 h-4 fill-white" /></>
                  )}
                </button>

                <p className="text-center font-body text-sm text-hope-muted">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setTab('register')} className="text-hope-rose font-medium hover:underline">
                    Join HOPE — it's free
                  </button>
                </p>
              </motion.form>
            )}

            {/* ── REGISTER FORM ── */}
            {tab === 'register' && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={registerForm.handleSubmit(onRegister)}
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <h2 className="font-display text-2xl text-hope-wine">Join HOPE</h2>
                  <p className="font-body text-sm text-hope-muted mt-1">Create your free account — together we are stronger</p>
                </div>

                {/* Role selector */}
                <div>
                  <label className="form-label">I am joining as…</label>
                  <div className="grid grid-cols-1 gap-2">
                    {ROLES.map(role => (
                      <label
                        key={role.value}
                        className={cn(
                          'flex items-center gap-4 p-3.5 rounded-2xl border cursor-pointer transition-all',
                          selectedRole === role.value
                            ? 'border-hope-rose bg-hope-soft'
                            : 'border-hope-blush/30 hover:border-hope-rose/30'
                        )}
                      >
                        <input type="radio" {...registerForm.register('role')} value={role.value} className="sr-only" />
                        <span className="text-2xl">{role.emoji}</span>
                        <div>
                          <div className="font-body font-semibold text-sm text-hope-dark">{role.label}</div>
                          <div className="font-body text-xs text-hope-muted">{role.desc}</div>
                        </div>
                        <div className={cn(
                          'ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                          selectedRole === role.value ? 'border-hope-rose bg-hope-rose' : 'border-hope-blush'
                        )}>
                          {selectedRole === role.value && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="form-label">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hope-muted" />
                    <input
                      {...registerForm.register('name')}
                      placeholder="Your full name"
                      className={cn('input pl-11', registerForm.formState.errors.name && 'border-red-400')}
                    />
                  </div>
                  {registerForm.formState.errors.name && (
                    <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 font-body">
                      <AlertCircle className="w-3 h-3" /> {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="form-label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hope-muted" />
                    <input
                      {...registerForm.register('email')}
                      type="email"
                      placeholder="you@example.com"
                      className={cn('input pl-11', registerForm.formState.errors.email && 'border-red-400')}
                    />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 font-body">
                      <AlertCircle className="w-3 h-3" /> {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="form-label">Mobile Number <span className="text-hope-muted font-normal">(optional)</span></label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hope-muted" />
                    <input
                      {...registerForm.register('phone')}
                      placeholder="+94 7X XXX XXXX"
                      className="input pl-11"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="form-label">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hope-muted" />
                    <input
                      {...registerForm.register('password')}
                      type={showPass ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      className={cn('input pl-11 pr-11', registerForm.formState.errors.password && 'border-red-400')}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-hope-muted">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 font-body">
                      <AlertCircle className="w-3 h-3" /> {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="form-label">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hope-muted" />
                    <input
                      {...registerForm.register('confirm')}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      className={cn('input pl-11 pr-11', registerForm.formState.errors.confirm && 'border-red-400')}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-hope-muted">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.confirm && (
                    <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 font-body">
                      <AlertCircle className="w-3 h-3" /> {registerForm.formState.errors.confirm.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={registerForm.formState.isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                >
                  {registerForm.formState.isSubmitting ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account…</>
                  ) : (
                    <>Create My HOPE Account 🎀</>
                  )}
                </button>

                <p className="text-center font-body text-xs text-hope-muted leading-relaxed">
                  By joining, you agree that this platform is for informational support only and does not replace professional medical advice.
                </p>

                <p className="text-center font-body text-sm text-hope-muted">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setTab('login')} className="text-hope-rose font-medium hover:underline">Sign in</button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
