import { FormEvent, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';

const symptomOptions = [
  ['new_lump', 'New breast lump'],
  ['underarm_lump', 'Underarm lump'],
  ['skin_dimpling', 'Skin dimpling or pitting'],
  ['nipple_discharge', 'Nipple discharge'],
  ['nipple_change', 'Nipple pulling or change'],
  ['size_shape_change', 'Size or shape change'],
  ['pain', 'Breast or nipple pain'],
  ['redness_scaling', 'Redness, scaling, or rash']
];

interface RiskResult {
  score: number;
  level: string;
  headline: string;
  factors: string[];
  recommendations: string[];
  disclaimer: string;
}

export default function RiskAssessment() {
  const [form, setForm] = useState({
    age: '35',
    familyHistory: false,
    geneticMutation: false,
    priorBiopsy: false,
    chestRadiation: false,
    hormoneTherapy: false,
    denseBreasts: false,
    symptoms: [] as string[]
  });
  const [result, setResult] = useState<RiskResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  type BoolKey = 'familyHistory' | 'geneticMutation' | 'priorBiopsy' | 'chestRadiation' | 'hormoneTherapy' | 'denseBreasts';
  const updateBool = (key: BoolKey) => setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  const updateSymptom = (value: string) => {
    setForm((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(value) ? prev.symptoms.filter((item) => item !== value) : [...prev.symptoms, value]
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, age: Number(form.age) };
      const response = await api<RiskResult>('/assessments/risk', { method: 'POST', body: JSON.stringify(payload) });
      setResult(response);
      localStorage.setItem('hope_last_risk', JSON.stringify(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Risk check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Educational risk check" title="Understand when to seek care" text="Answer a few questions. HOPE will explain general risk signals and recommended next steps." />
      <section className="section-wrap grid gap-8 py-12 lg:grid-cols-[1fr_0.9fr]">
        <form onSubmit={submit} className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm md:p-8">
          <label className="label" htmlFor="age">Age</label>
          <input id="age" type="number" min="1" max="120" className="input" value={form.age} onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))} />

          <h2 className="mt-8 text-xl font-bold text-hope-berry">Risk factors</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ['familyHistory', 'Family history'],
              ['geneticMutation', 'Known gene mutation'],
              ['priorBiopsy', 'Previous breast biopsy'],
              ['chestRadiation', 'Previous chest radiation'],
              ['hormoneTherapy', 'Hormone therapy'],
              ['denseBreasts', 'Dense breast tissue']
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 rounded-2xl border border-rose-100 p-4 text-sm font-semibold text-slate-700">
                <input type="checkbox" checked={Boolean(form[key as BoolKey])} onChange={() => updateBool(key as BoolKey)} />
                {label}
              </label>
            ))}
          </div>

          <h2 className="mt-8 text-xl font-bold text-hope-berry">Current symptoms or changes</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {symptomOptions.map(([value, label]) => (
              <label key={value} className="flex items-center gap-3 rounded-2xl border border-rose-100 p-4 text-sm font-semibold text-slate-700">
                <input type="checkbox" checked={form.symptoms.includes(value)} onChange={() => updateSymptom(value)} />
                {label}
              </label>
            ))}
          </div>

          {error && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          <button className="btn-primary mt-8 w-full" disabled={loading}>{loading ? 'Checking...' : 'Get guidance'}</button>
        </form>

        <aside className="glass-card h-fit rounded-[2rem] p-6 md:p-8">
          {result ? (
            <>
              <span className="badge">{result.level} signal</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-hope-berry">{result.headline}</h2>
              <div className="mt-5 rounded-3xl bg-white p-5">
                <p className="text-sm font-semibold text-slate-500">Educational score</p>
                <p className="mt-2 text-5xl font-bold text-hope-wine">{result.score}</p>
              </div>
              {result.factors.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold text-slate-900">Signals noticed</h3>
                  <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                    {result.factors.map((factor) => <li key={factor} className="rounded-2xl bg-white p-3">{factor}</li>)}
                  </ul>
                </div>
              )}
              <div className="mt-6">
                <h3 className="font-bold text-slate-900">Next steps</h3>
                <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                  {result.recommendations.map((item) => <li key={item} className="rounded-2xl bg-white p-3">{item}</li>)}
                </ul>
              </div>
              <p className="mt-6 rounded-2xl bg-hope-blush p-4 text-sm leading-6 text-hope-berry">{result.disclaimer}</p>
            </>
          ) : (
            <>
              <span className="badge">Private and educational</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-hope-berry">Your result will appear here</h2>
              <p className="mt-3 leading-7 text-slate-600">The tool does not diagnose. It highlights when professional review may be important.</p>
            </>
          )}
        </aside>
      </section>
    </>
  );
}
