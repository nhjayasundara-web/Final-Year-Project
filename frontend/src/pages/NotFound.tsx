import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section-wrap py-24 text-center">
      <span className="badge">404</span>
      <h1 className="mt-4 font-display text-5xl font-bold text-hope-berry">Page not found</h1>
      <p className="mx-auto mt-4 max-w-xl text-slate-600">The page you opened does not exist. Return to the HOPE home page.</p>
      <Link to="/" className="btn-primary mt-8">Go home</Link>
    </section>
  );
}
