export default function PageHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="ribbon-bg border-b border-rose-100 py-16">
      <div className="section-wrap max-w-4xl text-center">
        <span className="badge">{eyebrow}</span>
        <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-hope-berry md:text-6xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">{text}</p>
      </div>
    </section>
  );
}
