import { FormEvent, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { CommunityPost } from '../types';

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [guidelines, setGuidelines] = useState<string[]>([]);
  const [form, setForm] = useState({ title: '', body: '', tags: '' });
  const [communityConsent, setCommunityConsent] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api<{ items: CommunityPost[]; communityGuidelines: string[] }>('/community/posts')
      .then((data) => {
        setPosts(data.items);
        setGuidelines(data.communityGuidelines);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await api('/community/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          body: form.body,
          tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
          communityConsent
        })
      });
      setForm({ title: '', body: '', tags: '' });
      setCommunityConsent(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Post failed');
    }
  };

  return (
    <>
      <PageHeader eyebrow="Community" title="Supportive conversations, safer sharing" text="A moderated-style support space for encouragement, questions, and patient-caregiver connection." />
      <section className="section-wrap grid gap-8 py-12 lg:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge">{post.authorRole}</span>
                {post.moderationStatus && post.moderationStatus !== 'approved' && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{post.moderationStatus}</span>}
                {post.tags?.map((tag) => <span key={tag} className="rounded-full bg-hope-cream px-3 py-1 text-xs font-semibold text-slate-600">#{tag}</span>)}
              </div>
              <h2 className="mt-4 text-2xl font-bold text-hope-berry">{post.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{post.body}</p>
              <p className="mt-4 text-sm font-semibold text-slate-500">By {post.authorName} - {post.commentCount || 0} comments</p>
            </article>
          ))}
        </div>

        <aside className="grid h-fit gap-6">
          <form onSubmit={submit} className="glass-card rounded-[2rem] p-6 md:p-8">
            <span className="badge">Share safely</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-hope-berry">Create a post</h2>
            {!user && <p className="mt-4 rounded-2xl bg-hope-blush p-4 text-sm text-hope-berry">Please sign in to post. You can still read community support.</p>}
            <div className="mt-6 grid gap-4">
              <input className="input" placeholder="Title" value={form.title} disabled={!user} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
              <textarea className="input min-h-36" placeholder="Message" value={form.body} disabled={!user} onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))} />
              <input className="input" placeholder="Tags separated by commas" value={form.tags} disabled={!user} onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))} />
              <label className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
                <input type="checkbox" className="mt-1" checked={communityConsent} disabled={!user} onChange={(event) => setCommunityConsent(event.target.checked)} />
                <span>I understand community posts are moderated, should avoid diagnoses or private medical records, and may remain hidden until reviewed.</span>
              </label>
            </div>
            <button className="btn-primary mt-5 w-full" disabled={!user || !communityConsent}>Publish</button>
            {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          </form>

          <div className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-hope-berry">Community guidelines</h3>
            <ul className="mt-4 grid gap-3 text-sm text-slate-600">
              {guidelines.map((item) => <li key={item} className="rounded-2xl bg-hope-cream p-3">{item}</li>)}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
