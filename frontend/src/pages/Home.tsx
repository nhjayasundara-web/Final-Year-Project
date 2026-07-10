import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';

const features = [
  ['Learn', 'Reliable breast cancer awareness articles, symptoms, risk factors, and screening guidance.', '/learn', 'A'],
  ['Self-exam guide', 'Step-by-step breast awareness support with monthly reminder setup.', '/self-exam', 'S'],
  ['Risk check', 'Educational triage questions that explain when to seek professional advice.', '/risk', 'R'],
  ['AI triage', 'Upload an image for a clearly labelled demo analysis or connect your validated model.', '/ai-screening', 'AI'],
  ['Medicine access', 'Search pharmacy stock and send medicine availability requests.', '/medicines', 'M'],
  ['Community support', 'Join a respectful support space for patients and caregivers.', '/community', 'C']
];

export default function Home() {
  return (
    <>
      <section className="ribbon-bg overflow-hidden py-16 md:py-24">
        <div className="section-wrap grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="badge">Together we fight - together we survive</span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight text-hope-berry md:text-7xl">
              Early Detection,
              <span className="block text-hope-wine">Better Protection.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-700">
              HOPE is an AI-ready companion for breast cancer awareness, early action, emotional support, medicine access, and healthcare collaboration.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/risk" className="btn-primary">Start risk check</Link>
              <Link to="/learn" className="btn-secondary">Explore awareness guide</Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['Awareness', 'Protection', 'Recovery'].map((item) => (
                <div key={item} className="rounded-3xl border border-rose-100 bg-white/70 p-4 text-center shadow-sm">
                  <p className="text-sm font-bold text-hope-wine">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-hope-blush blur-3xl" />
            <div className="glass-card relative rounded-[2.5rem] p-6 md:p-8">
              <div className="rounded-[2rem] bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-hope-rose">HOPE care map</p>
                    <h2 className="mt-2 font-display text-3xl font-bold text-hope-berry">Your next step, clearly guided.</h2>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-hope-blush text-3xl">H</div>
                </div>
                <div className="mt-8 grid gap-4">
                  {[
                    ['1', 'Notice symptoms and learn what changes mean.'],
                    ['2', 'Use self-exam and risk check to decide next action.'],
                    ['3', 'Connect with providers, support, and medicine access.']
                  ].map(([step, text]) => (
                    <div key={step} className="flex gap-4 rounded-3xl bg-hope-cream p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-hope-wine font-bold text-white">{step}</span>
                      <p className="text-sm leading-7 text-slate-700">{text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-3xl bg-hope-blush/70 p-5 text-sm leading-7 text-hope-berry">
                  Not a diagnosis. HOPE helps you prepare, ask questions, and find care faster.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap py-16">
        <div className="max-w-3xl">
          <span className="badge">Complete platform</span>
          <h2 className="mt-4 font-display text-4xl font-bold text-hope-berry">Built for patients, caregivers, and healthcare partners.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Every module is designed to reduce confusion, improve awareness, and create a bridge between people and qualified healthcare services.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, text, href, icon]) => (
            <FeatureCard key={title} title={title} text={text} icon={icon}>
              <Link to={href} className="mt-5 inline-flex text-sm font-bold text-hope-wine">Open module</Link>
            </FeatureCard>
          ))}
        </div>
      </section>

      <section className="section-wrap rounded-[2.5rem] bg-hope-wine p-8 text-white shadow-soft md:p-12">
        <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-100">Implementation ready</p>
            <h2 className="mt-4 font-display text-4xl font-bold">React + Flask + MongoDB + AI-ready services</h2>
            <p className="mt-4 leading-8 text-rose-50">
              The included backend, frontend, Docker setup, seed data, and documentation are ready for local development and future production hardening.
            </p>
          </div>
          <Link to="/providers" className="rounded-full bg-white px-6 py-4 text-center font-bold text-hope-wine">Find healthcare support</Link>
        </div>
      </section>
    </>
  );
}
