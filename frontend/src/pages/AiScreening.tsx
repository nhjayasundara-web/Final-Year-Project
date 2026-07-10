import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';

interface AiResult {
  id: string;
  score: number;
  triageCategory: string;
  headline: string;
  analysisMode: string;
  disclaimer: string;
  nextSteps: string[];
  predictedClass?: string;
  confidence?: number;
  confidenceBand?: string;
  probabilities?: Record<string, number>;
  providerEscalationCta?: {
    label: string;
    href: string;
  };
}

export default function AiScreening() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState<AiResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);

  const chooseFile = (nextFile: File | null) => {
    setFile(nextFile);
    setResult(null);
    setError('');
    if (preview) URL.revokeObjectURL(preview);
    setPreview(nextFile ? URL.createObjectURL(nextFile) : '');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError('Choose an image first.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    formData.append('consentAcknowledged', String(consentAcknowledged));
    setLoading(true);
    setError('');
    try {
      const response = await api<AiResult>('/ai/analyze-image', { method: 'POST', body: formData });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="AI-ready triage" title="Safe image analysis workflow" text="Upload a supported image for a demo result or connect your validated TensorFlow/Keras model in the backend." />
      <section className="section-wrap grid gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submit} className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm md:p-8">
          <span className="badge">Not a diagnosis</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-hope-berry">Upload image</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Accepted formats: PNG, JPG, JPEG, WEBP. Do not upload real personal medical images unless your deployment has consent, security, and clinical review in place.
          </p>
          <label className="label mt-6" htmlFor="image">Image file</label>
          <input id="image" type="file" accept="image/png,image/jpeg,image/webp" className="input" onChange={(event) => chooseFile(event.target.files?.[0] || null)} />
          <label className="mt-5 flex items-start gap-3 rounded-2xl bg-hope-blush/70 p-4 text-sm leading-6 text-hope-berry">
            <input type="checkbox" className="mt-1" checked={consentAcknowledged} onChange={(event) => setConsentAcknowledged(event.target.checked)} />
            <span>I understand this is educational triage support only, not diagnosis, and that I should seek qualified clinical review for any concern.</span>
          </label>
          {preview && <img src={preview} alt="Upload preview" className="mt-5 max-h-80 w-full rounded-3xl object-cover" />}
          {error && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          <button className="btn-primary mt-6 w-full" disabled={loading || !consentAcknowledged}>{loading ? 'Analyzing...' : 'Analyze image'}</button>
        </form>

        <aside className="glass-card h-fit rounded-[2rem] p-6 md:p-8">
          {result ? (
            <>
              <span className="badge">{result.analysisMode}</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-hope-berry">{result.headline}</h2>
              <div className="mt-5 rounded-3xl bg-white p-5">
                <p className="text-sm font-semibold text-slate-500">Triage score</p>
                <p className="mt-2 text-5xl font-bold text-hope-wine">{Math.round(result.score * 100)}%</p>
                <p className="mt-2 text-sm text-slate-600">Category: {result.triageCategory}</p>
                {result.confidenceBand && <p className="mt-2 text-sm text-slate-600">Confidence band: {result.confidenceBand}</p>}
                {result.predictedClass && (
                  <p className="mt-2 text-sm text-slate-600">Model class: {result.predictedClass} {result.confidence ? `(${Math.round(result.confidence * 100)}% confidence)` : ''}</p>
                )}
              </div>
              {result.probabilities && (
                <div className="mt-4 rounded-3xl bg-white p-5">
                  <p className="text-sm font-semibold text-slate-500">Model probabilities</p>
                  <div className="mt-3 grid gap-2">
                    {Object.entries(result.probabilities).map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between rounded-2xl bg-hope-blush px-4 py-3 text-sm">
                        <span className="capitalize text-hope-berry">{label}</span>
                        <span className="font-semibold text-hope-wine">{Math.round(value * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <h3 className="mt-6 font-bold text-slate-900">Next steps</h3>
              <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                {result.nextSteps.map((step) => <li key={step} className="rounded-2xl bg-white p-3">{step}</li>)}
              </ul>
              {result.providerEscalationCta && (
                <Link to={result.providerEscalationCta.href} className="btn-primary mt-6 inline-flex">
                  {result.providerEscalationCta.label}
                </Link>
              )}
              <p className="mt-6 rounded-2xl bg-hope-blush p-4 text-sm leading-6 text-hope-berry">{result.disclaimer}</p>
            </>
          ) : (
            <>
              <span className="badge">Model integration point</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-hope-berry">Backend endpoint ready</h2>
              <p className="mt-3 leading-7 text-slate-600">
                Add your trained `.keras` model path in backend `.env` as `MODEL_PATH`. The included ML pipeline trains a MobileNetV2 classifier on real BUSI breast ultrasound images, with no synthetic data.
              </p>
            </>
          )}
        </aside>
      </section>
    </>
  );
}
