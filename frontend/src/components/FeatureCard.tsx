import { ReactNode } from 'react';

export default function FeatureCard({ icon, title, text, children }: { icon: string; title: string; text: string; children?: ReactNode }) {
  return (
    <article className="glass-card rounded-[2rem] p-6 transition hover:-translate-y-1">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-hope-blush text-2xl">{icon}</div>
      <h3 className="mt-5 text-xl font-bold text-hope-berry">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
      {children}
    </article>
  );
}
