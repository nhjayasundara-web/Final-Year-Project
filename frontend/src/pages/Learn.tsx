import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';
import type { Article } from '../types';

export default function Learn() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [active, setActive] = useState<Article | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<{ items: Article[] }>('/content/articles')
      .then((data) => {
        setArticles(data.items);
        setActive(data.items[0] || null);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Awareness library" title="Reliable knowledge for early action" text="Browse symptoms, risk factors, screening guidance, emotional support, and recovery navigation." />
      <section className="section-wrap py-12">
        {error && <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4">
            {articles.map((article) => (
              <button
                key={article.id}
                onClick={() => setActive(article)}
                className={`rounded-3xl border p-5 text-left transition ${active?.id === article.id ? 'border-hope-rose bg-hope-blush/60' : 'border-rose-100 bg-white hover:border-hope-rose/50'}`}
              >
                <span className="badge">{article.category}</span>
                <h2 className="mt-3 text-xl font-bold text-hope-berry">{article.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{article.summary}</p>
                <p className="mt-3 text-xs font-semibold text-slate-500">{article.readingMinutes} min read</p>
              </button>
            ))}
          </div>

          <article className="glass-card rounded-[2rem] p-6 md:p-8">
            {active ? (
              <>
                <span className="badge">{active.category}</span>
                <h2 className="mt-4 font-display text-4xl font-bold text-hope-berry">{active.title}</h2>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                  <span className="rounded-full bg-white px-3 py-2">Review status: {active.reviewStatus || 'published'}</span>
                  <span className="rounded-full bg-white px-3 py-2">Country: {active.countryApplicability || 'Sri Lanka'}</span>
                  <span className="rounded-full bg-white px-3 py-2">Version: {active.version || '1.0'}</span>
                </div>
                <div className="mt-6 grid gap-4">
                  {active.content.map((paragraph, index) => (
                    <p key={index} className="leading-8 text-slate-700">{paragraph}</p>
                  ))}
                </div>
                <div className="mt-8 rounded-3xl bg-white p-5">
                  <h3 className="font-bold text-hope-wine">Sources and review</h3>
                  <p className="mt-2 text-sm text-slate-600">Last reviewed: {active.lastReviewed || 'To be reviewed'}</p>
                  {active.nextReviewDate && <p className="mt-2 text-sm text-slate-600">Next review due: {active.nextReviewDate}</p>}
                  {active.reviewedBy && <p className="mt-2 text-sm text-slate-600">Reviewed by: {active.reviewedBy} ({active.reviewerRole || 'reviewer'})</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(active.sources || []).map((source) => <span key={source} className="badge">{source}</span>)}
                  </div>
                </div>
                {active.clinicalDisclaimer && <p className="mt-6 rounded-2xl bg-hope-blush p-4 text-sm leading-6 text-hope-berry">{active.clinicalDisclaimer}</p>}
              </>
            ) : (
              <p className="text-slate-600">Loading awareness content...</p>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
