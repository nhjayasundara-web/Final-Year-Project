import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';

interface SupportData {
  resources: { id: string; title: string; type: string; description: string }[];
  affirmations: string[];
  counsellors: { name: string; mode: string; contact: string; isDemo: boolean }[];
  urgentNote: string;
}

export default function Support() {
  const [data, setData] = useState<SupportData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<SupportData>('/support').then(setData).catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Emotional support" title="You are not alone in this journey" text="Access calming exercises, counselling contacts, caregiver guidance, and motivational support." />
      <section className="section-wrap py-12">
        {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {data && (
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
            <div className="grid gap-4 md:grid-cols-2">
              {data.resources.map((resource) => (
                <article key={resource.id} className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
                  <span className="badge">{resource.type}</span>
                  <h2 className="mt-4 text-xl font-bold text-hope-berry">{resource.title}</h2>
                  <p className="mt-3 leading-7 text-slate-600">{resource.description}</p>
                </article>
              ))}
            </div>
            <aside className="grid h-fit gap-6">
              <div className="glass-card rounded-[2rem] p-6 md:p-8">
                <span className="badge">Affirmations</span>
                <div className="mt-5 grid gap-3">
                  {data.affirmations.map((item) => <p key={item} className="rounded-2xl bg-white p-4 text-sm font-semibold text-hope-berry">{item}</p>)}
                </div>
              </div>
              <div className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-hope-berry">Counselling contacts</h3>
                <div className="mt-4 grid gap-3">
                  {data.counsellors.map((counsellor) => (
                    <div key={counsellor.name} className="rounded-2xl bg-hope-cream p-4 text-sm text-slate-600">
                      <p className="font-bold text-slate-900">{counsellor.name}</p>
                      <p>{counsellor.mode}</p>
                      <p>{counsellor.contact}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm leading-6 text-red-700">{data.urgentNote}</p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
