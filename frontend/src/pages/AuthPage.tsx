import { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

export default function AuthPage() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' as Role });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Secure access" title="Sign in to your HOPE account" text="Save reminders, post in the community, and keep your care navigation in one place." />
      <section className="section-wrap flex justify-center py-12">
        <form onSubmit={submit} className="glass-card w-full max-w-xl rounded-[2rem] p-6 md:p-8">
          <div className="grid grid-cols-2 gap-3 rounded-full bg-white p-2">
            <button type="button" onClick={() => setMode('login')} className={`rounded-full px-4 py-3 text-sm font-bold ${mode === 'login' ? 'bg-hope-wine text-white' : 'text-slate-600'}`}>Login</button>
            <button type="button" onClick={() => setMode('register')} className={`rounded-full px-4 py-3 text-sm font-bold ${mode === 'register' ? 'bg-hope-wine text-white' : 'text-slate-600'}`}>Register</button>
          </div>

          <div className="mt-6 grid gap-4">
            {mode === 'register' && <input className="input" placeholder="Full name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />}
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} />
            {mode === 'register' && (
              <select className="input" value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as Role }))}>
                <option value="patient">Patient</option>
                <option value="caregiver">Caregiver</option>
              </select>
            )}
          </div>
          {error && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          <button className="btn-primary mt-6 w-full" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}</button>
          <div className="mt-6 rounded-3xl bg-white p-5 text-sm leading-7 text-slate-600">
            Demo patient login: <strong>patient@hope.local</strong> / <strong>Patient123!</strong>
          </div>
          {mode === 'register' && (
            <div className="mt-4 rounded-3xl bg-hope-blush/70 p-5 text-sm leading-7 text-hope-berry">
              Public signup is limited to patient and caregiver accounts. Doctor, pharmacist, and admin accounts must be created through internal admin workflows.
            </div>
          )}
        </form>
      </section>
    </>
  );
}
