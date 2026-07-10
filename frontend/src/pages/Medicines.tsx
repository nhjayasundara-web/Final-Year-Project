import { FormEvent, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';
import type { Medicine } from '../types';

export default function Medicines() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [items, setItems] = useState<Medicine[]>([]);
  const [disclaimer, setDisclaimer] = useState('');
  const [requestForm, setRequestForm] = useState({ patientName: '', contact: '', medicineName: '', city: '', notes: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (city) params.set('city', city);
    api<{ items: Medicine[]; disclaimer: string }>(`/medicines?${params.toString()}`)
      .then((data) => {
        setItems(data.items);
        setDisclaimer(data.disclaimer);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  const requestMedicine = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await api<{ message: string }>('/medicine-requests', { method: 'POST', body: JSON.stringify(requestForm) });
      setMessage(response.message);
      setRequestForm({ patientName: '', contact: '', medicineName: '', city: '', notes: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    }
  };

  return (
    <>
      <PageHeader eyebrow="Medicine availability" title="Find and request essential medicines" text="Search demo pharmacy inventory and submit requests for hard-to-find medicines." />
      <section className="section-wrap grid gap-8 py-12 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <div className="rounded-[2rem] border border-rose-100 bg-white p-5 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_0.8fr_auto]">
              <input className="input" placeholder="Search medicine, type, or pharmacy" value={query} onChange={(event) => setQuery(event.target.value)} />
              <input className="input" placeholder="City" value={city} onChange={(event) => setCity(event.target.value)} />
              <button onClick={load} className="btn-primary">Search</button>
            </div>
            {disclaimer && <p className="mt-4 rounded-2xl bg-hope-blush p-4 text-sm leading-6 text-hope-berry">{disclaimer}</p>}
          </div>

          <div className="mt-6 grid gap-4">
            {items.map((item) => (
              <article key={item.id} className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <span className="badge">{item.status}</span>
                    <h2 className="mt-3 text-2xl font-bold text-hope-berry">{item.name}</h2>
                    <p className="mt-2 text-sm text-slate-600">{item.type} - {item.strength}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.pharmacy}, {item.city}</p>
                    {item.note && <p className="mt-3 text-sm leading-6 text-slate-500">{item.note}</p>}
                  </div>
                  <div className="rounded-3xl bg-hope-cream p-5 text-center">
                    <p className="text-sm font-semibold text-slate-500">Quantity</p>
                    <p className="mt-2 text-4xl font-bold text-hope-wine">{item.quantity}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <form onSubmit={requestMedicine} className="glass-card h-fit rounded-[2rem] p-6 md:p-8">
          <span className="badge">Request help</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-hope-berry">Medicine request</h2>
          <div className="mt-6 grid gap-4">
            <input className="input" placeholder="Patient name" value={requestForm.patientName} onChange={(event) => setRequestForm((prev) => ({ ...prev, patientName: event.target.value }))} />
            <input className="input" placeholder="Contact number or email" value={requestForm.contact} onChange={(event) => setRequestForm((prev) => ({ ...prev, contact: event.target.value }))} />
            <input className="input" placeholder="Medicine name" value={requestForm.medicineName} onChange={(event) => setRequestForm((prev) => ({ ...prev, medicineName: event.target.value }))} />
            <input className="input" placeholder="Preferred city" value={requestForm.city} onChange={(event) => setRequestForm((prev) => ({ ...prev, city: event.target.value }))} />
            <textarea className="input min-h-28" placeholder="Notes" value={requestForm.notes} onChange={(event) => setRequestForm((prev) => ({ ...prev, notes: event.target.value }))} />
          </div>
          <button className="btn-primary mt-5 w-full">Submit request</button>
          {message && <p className="mt-4 rounded-2xl bg-green-50 p-4 text-sm text-green-700">{message}</p>}
          {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        </form>
      </section>
    </>
  );
}
