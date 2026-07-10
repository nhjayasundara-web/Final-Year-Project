import { FormEvent, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';
import type { Provider } from '../types';

export default function Providers() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [city, setCity] = useState('');
  const [selected, setSelected] = useState<Provider | null>(null);
  const [form, setForm] = useState({ patientName: '', contact: '', preferredDate: '', reason: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    api<{ items: Provider[] }>(`/providers?${params.toString()}`)
      .then((data) => {
        setProviders(data.items);
        setSelected(data.items[0] || null);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  const requestAppointment = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    setMessage('');
    setError('');
    try {
      const response = await api<{ message: string }>('/appointments', {
        method: 'POST',
        body: JSON.stringify({ ...form, providerId: selected.id })
      });
      setMessage(response.message);
      setForm({ patientName: '', contact: '', preferredDate: '', reason: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    }
  };

  return (
    <>
      <PageHeader eyebrow="Provider connection" title="Find care partners and request appointments" text="Connect with demo oncology, counselling, screening, and telehealth partners." />
      <section className="section-wrap grid gap-8 py-12 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <div className="rounded-[2rem] border border-rose-100 bg-white p-5 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input className="input" placeholder="Filter by city" value={city} onChange={(event) => setCity(event.target.value)} />
              <button onClick={load} className="btn-primary">Search</button>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            {providers.map((provider) => (
              <button key={provider.id} onClick={() => setSelected(provider)} className={`rounded-[2rem] border p-6 text-left shadow-sm transition ${selected?.id === provider.id ? 'border-hope-rose bg-hope-blush/60' : 'border-rose-100 bg-white hover:border-hope-rose/40'}`}>
                <span className="badge">{provider.type}</span>
                <h2 className="mt-3 text-2xl font-bold text-hope-berry">{provider.name}</h2>
                <p className="mt-2 text-sm text-slate-600">{provider.city} - {provider.phone}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {provider.services.map((service) => <span key={service} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">{service}</span>)}
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={requestAppointment} className="glass-card h-fit rounded-[2rem] p-6 md:p-8">
          <span className="badge">Appointment request</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-hope-berry">{selected ? selected.name : 'Select a provider'}</h2>
          <div className="mt-6 grid gap-4">
            <input className="input" placeholder="Patient name" value={form.patientName} onChange={(event) => setForm((prev) => ({ ...prev, patientName: event.target.value }))} />
            <input className="input" placeholder="Contact number or email" value={form.contact} onChange={(event) => setForm((prev) => ({ ...prev, contact: event.target.value }))} />
            <input className="input" type="date" value={form.preferredDate} onChange={(event) => setForm((prev) => ({ ...prev, preferredDate: event.target.value }))} />
            <textarea className="input min-h-32" placeholder="Reason for appointment" value={form.reason} onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))} />
          </div>
          <button className="btn-primary mt-5 w-full" disabled={!selected}>Submit request</button>
          {message && <p className="mt-4 rounded-2xl bg-green-50 p-4 text-sm text-green-700">{message}</p>}
          {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          <p className="mt-5 rounded-2xl bg-hope-blush p-4 text-sm leading-6 text-hope-berry">Demo provider data must be replaced with verified healthcare partners before launch.</p>
        </form>
      </section>
    </>
  );
}
