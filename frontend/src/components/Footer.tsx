import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-rose-100 bg-white/70 py-10">
      <div className="section-wrap grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <h2 className="font-display text-3xl font-bold text-hope-wine">HOPE</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
            A breast cancer awareness and support companion for education, early action, emotional care, medicine access, and provider navigation.
          </p>
          <p className="mt-4 rounded-2xl bg-hope-blush/70 p-4 text-sm font-medium text-hope-berry">
            Educational support only. HOPE cannot diagnose, confirm, or rule out cancer. Please consult qualified healthcare professionals for medical concerns.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Modules</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            <Link to="/learn">Awareness library</Link>
            <Link to="/self-exam">Self-exam guide</Link>
            <Link to="/risk">Risk check</Link>
            <Link to="/support">Support hub</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Care access</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            <Link to="/providers">Find providers</Link>
            <Link to="/medicines">Medicine availability</Link>
            <Link to="/community">Community</Link>
            <Link to="/auth">Secure account</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
