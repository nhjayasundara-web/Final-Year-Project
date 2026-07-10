import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { AiResultRecord, Appointment, Article, CommunityPost, MedicineRequest, Provider, Role, User } from '../types';

interface AdminOverview {
  counts: {
    users: number;
    postsPending: number;
    articlesPending: number;
    providersPending: number;
    appointments: number;
    medicineRequests: number;
    aiUploads: number;
  };
  recentCommunityPosts: CommunityPost[];
  recentAiResults: AiResultRecord[];
}

interface DoctorOverview {
  appointments: Appointment[];
  articles: Article[];
  providers: Provider[];
}

interface PharmacistOverview {
  requests: MedicineRequest[];
  staleInventoryCount: number;
}

const roleLabels: Record<Role, string> = {
  admin: 'Admin',
  caregiver: 'Caregiver',
  doctor: 'Doctor',
  patient: 'Patient',
  pharmacist: 'Pharmacist'
};

const sharedLinks = [
  ['Awareness library', '/learn'],
  ['Risk check', '/risk'],
  ['Find providers', '/providers'],
  ['Support hub', '/support']
] as const;

export default function Dashboard() {
  const { user } = useAuth();
  const currentRole = user?.role || 'patient';
  const lastRisk = localStorage.getItem('hope_last_risk');
  const risk = lastRisk ? JSON.parse(lastRisk) as { level: string; score: number; headline: string } : null;

  const [adminOverview, setAdminOverview] = useState<AdminOverview | null>(null);
  const [doctorOverview, setDoctorOverview] = useState<DoctorOverview | null>(null);
  const [pharmacistOverview, setPharmacistOverview] = useState<PharmacistOverview | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [myMedicineRequests, setMyMedicineRequests] = useState<MedicineRequest[]>([]);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [createUserForm, setCreateUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient' as Role
  });

  const loadDashboard = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      if (user.role === 'admin') {
        const [overview, userResult, communityResult, articleResult, providerResult] = await Promise.all([
          api<AdminOverview>('/admin/overview'),
          api<{ items: User[]; summary: Record<Role, number> }>('/admin/users'),
          api<{ items: CommunityPost[] }>('/community/posts'),
          api<{ items: Article[] }>('/content/articles'),
          api<{ items: Provider[] }>('/providers')
        ]);
        setAdminOverview(overview);
        setUsers(userResult.items);
        setPosts(communityResult.items);
        setArticles(articleResult.items);
        setProviders(providerResult.items);
      } else if (user.role === 'doctor') {
        const overview = await api<DoctorOverview>('/doctor/overview');
        setDoctorOverview(overview);
      } else if (user.role === 'pharmacist') {
        const overview = await api<PharmacistOverview>('/pharmacist/overview');
        setPharmacistOverview(overview);
      } else {
        const [requestResult, appointmentResult] = await Promise.all([
          api<{ items: MedicineRequest[] }>('/medicine-requests/mine'),
          api<{ items: Appointment[] }>('/appointments/mine')
        ]);
        setMyMedicineRequests(requestResult.items);
        setMyAppointments(appointmentResult.items);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dashboard failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user?.id, user?.role]);

  const createUser = async () => {
    setError('');
    setNotice('');
    try {
      const result = await api<{ user: User }>('/admin/users', {
        method: 'POST',
        body: JSON.stringify(createUserForm)
      });
      setCreateUserForm({ name: '', email: '', password: '', role: 'patient' });
      setNotice(`Created ${roleLabels[result.user.role]} account for ${result.user.email}.`);
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create user');
    }
  };

  const toggleUser = async (account: User) => {
    try {
      await api(`/admin/users/${account.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !account.isActive })
      });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update user');
    }
  };

  const moderatePost = async (postId: string, moderationStatus: 'approved' | 'hidden') => {
    try {
      await api(`/admin/community/posts/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify({ moderationStatus })
      });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to moderate post');
    }
  };

  const updateArticleStatus = async (articleId: string, reviewStatus: 'draft' | 'in-review' | 'published') => {
    try {
      await api(`/content/articles/${articleId}`, {
        method: 'PATCH',
        body: JSON.stringify({ reviewStatus })
      });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update article');
    }
  };

  const verifyProvider = async (providerId: string) => {
    try {
      await api(`/admin/providers/${providerId}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: true, verificationSource: 'dashboard-review' })
      });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to verify provider');
    }
  };

  const updateAppointment = async (appointmentId: string, status: 'reviewing' | 'scheduled' | 'completed') => {
    try {
      await api(`/doctor/appointments/${appointmentId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update appointment');
    }
  };

  const updateMedicineRequest = async (requestId: string, status: 'reviewing' | 'resolved' | 'unavailable') => {
    try {
      await api(`/pharmacist/medicine-requests/${requestId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update medicine request');
    }
  };

  const pendingPosts = posts.filter((post) => (post.moderationStatus || 'approved') !== 'approved');
  const pendingArticles = articles.filter((article) => (article.reviewStatus || 'published') !== 'published');
  const pendingProviders = providers.filter((provider) => !provider.isActive);

  return (
    <>
      <PageHeader eyebrow="Secure dashboard" title={`Welcome, ${user?.name || 'friend'}`} text={`Your ${roleLabels[currentRole].toLowerCase()} workspace with care follow-up and operational tasks.`} />
      <section className="section-wrap py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
            <span className="badge">Profile</span>
            <h2 className="mt-4 text-2xl font-bold text-hope-berry">{roleLabels[currentRole]}</h2>
            <p className="mt-2 text-sm text-slate-600">{user?.email}</p>
          </div>
          <div className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
            <span className="badge">Reminder</span>
            <h2 className="mt-4 text-2xl font-bold text-hope-berry">Day {localStorage.getItem('hope_reminder_day') || 'not set'}</h2>
            <Link to="/self-exam" className="mt-4 inline-flex text-sm font-bold text-hope-wine">Update reminder</Link>
          </div>
          <div className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
            <span className="badge">Last risk check</span>
            <h2 className="mt-4 text-2xl font-bold text-hope-berry">{risk ? `${risk.level} - ${risk.score}` : 'Not completed'}</h2>
            <p className="mt-2 text-sm text-slate-600">{risk?.headline || 'Take the educational risk check when ready.'}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {sharedLinks.map(([label, href]) => <Link key={href} to={href} className="btn-secondary text-center">{label}</Link>)}
        </div>

        {(error || notice) && (
          <div className="mt-6 grid gap-3">
            {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
            {notice && <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p>}
          </div>
        )}

        {currentRole === 'admin' && (
          <div className="mt-10 grid gap-8">
            <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="badge">Admin overview</span>
                  <h2 className="mt-4 text-3xl font-bold text-hope-berry">Platform operations</h2>
                </div>
                <div className="rounded-3xl bg-hope-blush px-4 py-3 text-sm font-semibold text-hope-berry">
                  {loading ? 'Refreshing...' : `${adminOverview?.counts.users || 0} users`}
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {adminOverview && [
                  ['Posts pending', adminOverview.counts.postsPending],
                  ['Articles pending', adminOverview.counts.articlesPending],
                  ['Providers pending', adminOverview.counts.providersPending],
                  ['AI uploads', adminOverview.counts.aiUploads]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-3xl bg-hope-cream p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hope-wine">{label}</p>
                    <p className="mt-3 text-3xl font-bold text-hope-berry">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
                <span className="badge">User management</span>
                <h3 className="mt-4 text-2xl font-bold text-hope-berry">Create and disable accounts</h3>
                <div className="mt-5 grid gap-3">
                  <input className="input" placeholder="Full name" value={createUserForm.name} onChange={(event) => setCreateUserForm((prev) => ({ ...prev, name: event.target.value }))} />
                  <input className="input" type="email" placeholder="Email" value={createUserForm.email} onChange={(event) => setCreateUserForm((prev) => ({ ...prev, email: event.target.value }))} />
                  <input className="input" type="password" placeholder="Temporary password" value={createUserForm.password} onChange={(event) => setCreateUserForm((prev) => ({ ...prev, password: event.target.value }))} />
                  <select className="input" value={createUserForm.role} onChange={(event) => setCreateUserForm((prev) => ({ ...prev, role: event.target.value as Role }))}>
                    <option value="patient">Patient</option>
                    <option value="caregiver">Caregiver</option>
                    <option value="doctor">Doctor</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="button" className="btn-primary" onClick={createUser}>Create account</button>
                </div>
                <div className="mt-6 grid gap-3">
                  {users.map((account) => (
                    <div key={account.id} className="rounded-3xl border border-rose-100 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-bold text-hope-berry">{account.name}</p>
                          <p className="text-sm text-slate-600">{account.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="badge">{roleLabels[account.role]}</span>
                          <button type="button" className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700" onClick={() => toggleUser(account)}>
                            {account.isActive === false ? 'Enable' : 'Disable'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6">
                <div className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
                  <span className="badge">Community moderation</span>
                  <h3 className="mt-4 text-2xl font-bold text-hope-berry">Pending posts</h3>
                  <div className="mt-4 grid gap-3">
                    {pendingPosts.length ? pendingPosts.map((post) => (
                      <div key={post.id} className="rounded-3xl bg-hope-cream p-4">
                        <p className="font-bold text-hope-berry">{post.title}</p>
                        <p className="mt-2 text-sm text-slate-600">{post.body}</p>
                        <div className="mt-3 flex gap-2">
                          <button type="button" className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-800" onClick={() => moderatePost(post.id, 'approved')}>Approve</button>
                          <button type="button" className="rounded-full bg-red-100 px-4 py-2 text-xs font-semibold text-red-800" onClick={() => moderatePost(post.id, 'hidden')}>Hide</button>
                        </div>
                      </div>
                    )) : <p className="rounded-3xl bg-hope-cream p-4 text-sm text-slate-600">No posts pending moderation.</p>}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
                  <span className="badge">Governance queues</span>
                  <h3 className="mt-4 text-2xl font-bold text-hope-berry">Articles and providers</h3>
                  <div className="mt-4 grid gap-3">
                    {pendingArticles.slice(0, 3).map((article) => (
                      <div key={article.id} className="rounded-3xl bg-hope-cream p-4">
                        <p className="font-bold text-hope-berry">{article.title}</p>
                        <button type="button" className="mt-3 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-800" onClick={() => updateArticleStatus(article.id, 'published')}>Publish</button>
                      </div>
                    ))}
                    {pendingProviders.slice(0, 3).map((provider) => (
                      <div key={provider.id} className="rounded-3xl bg-hope-cream p-4">
                        <p className="font-bold text-hope-berry">{provider.name}</p>
                        <p className="mt-2 text-sm text-slate-600">{provider.city} • {provider.type}</p>
                        <button type="button" className="mt-3 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-800" onClick={() => verifyProvider(provider.id)}>Verify</button>
                      </div>
                    ))}
                    {pendingArticles.length === 0 && pendingProviders.length === 0 && (
                      <p className="rounded-3xl bg-hope-cream p-4 text-sm text-slate-600">No pending review items.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentRole === 'doctor' && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
              <span className="badge">Appointment queue</span>
              <h2 className="mt-4 text-3xl font-bold text-hope-berry">Follow-up requests</h2>
              <div className="mt-5 grid gap-3">
                {doctorOverview?.appointments.length ? doctorOverview.appointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-3xl bg-hope-cream p-4">
                    <p className="font-bold text-hope-berry">{appointment.providerName}</p>
                    <p className="mt-2 text-sm text-slate-600">{appointment.patientName} • {appointment.contact}</p>
                    <p className="mt-2 text-sm text-slate-600">{appointment.reason}</p>
                    <div className="mt-3 flex gap-2">
                      <button type="button" className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-800" onClick={() => updateAppointment(appointment.id, 'reviewing')}>Mark reviewing</button>
                      <button type="button" className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-800" onClick={() => updateAppointment(appointment.id, 'scheduled')}>Mark scheduled</button>
                    </div>
                  </div>
                )) : <p className="rounded-3xl bg-hope-cream p-4 text-sm text-slate-600">No appointment requests yet.</p>}
              </div>
            </section>

            <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
              <span className="badge">Content review</span>
              <h2 className="mt-4 text-3xl font-bold text-hope-berry">Article queue</h2>
              <div className="mt-5 grid gap-3">
                {doctorOverview?.articles.filter((article) => (article.reviewStatus || 'published') !== 'published').length ? doctorOverview?.articles.filter((article) => (article.reviewStatus || 'published') !== 'published').map((article) => (
                  <div key={article.id} className="rounded-3xl bg-hope-cream p-4">
                    <p className="font-bold text-hope-berry">{article.title}</p>
                    <button type="button" className="mt-3 rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-800" onClick={() => updateArticleStatus(article.id, 'in-review')}>Mark in review</button>
                  </div>
                )) : <p className="rounded-3xl bg-hope-cream p-4 text-sm text-slate-600">No pending articles.</p>}
              </div>
            </section>
          </div>
        )}

        {currentRole === 'pharmacist' && (
          <section className="mt-10 rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
            <span className="badge">Medicine request inbox</span>
            <h2 className="mt-4 text-3xl font-bold text-hope-berry">Inventory follow-up</h2>
            <p className="mt-2 text-sm text-slate-600">Stale inventory alerts: {pharmacistOverview?.staleInventoryCount || 0}</p>
            <div className="mt-5 grid gap-3">
              {pharmacistOverview?.requests.length ? pharmacistOverview.requests.map((item) => (
                <div key={item.id} className="rounded-3xl bg-hope-cream p-4">
                  <p className="font-bold text-hope-berry">{item.medicineName}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.patientName} • {item.contact}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-800" onClick={() => updateMedicineRequest(item.id, 'reviewing')}>Reviewing</button>
                    <button type="button" className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-800" onClick={() => updateMedicineRequest(item.id, 'resolved')}>Resolved</button>
                    <button type="button" className="rounded-full bg-red-100 px-4 py-2 text-xs font-semibold text-red-800" onClick={() => updateMedicineRequest(item.id, 'unavailable')}>Unavailable</button>
                  </div>
                </div>
              )) : <p className="rounded-3xl bg-hope-cream p-4 text-sm text-slate-600">No medicine requests yet.</p>}
            </div>
          </section>
        )}

        {(currentRole === 'patient' || currentRole === 'caregiver') && (
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
              <span className="badge">My medicine requests</span>
              <h2 className="mt-4 text-3xl font-bold text-hope-berry">Pharmacy follow-up</h2>
              <div className="mt-5 grid gap-3">
                {myMedicineRequests.length ? myMedicineRequests.map((item) => (
                  <div key={item.id} className="rounded-3xl bg-hope-cream p-4">
                    <p className="font-bold text-hope-berry">{item.medicineName}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.city} • {item.status}</p>
                  </div>
                )) : <p className="rounded-3xl bg-hope-cream p-4 text-sm text-slate-600">You have not submitted medicine requests yet.</p>}
              </div>
            </section>

            <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
              <span className="badge">My provider requests</span>
              <h2 className="mt-4 text-3xl font-bold text-hope-berry">Appointment follow-up</h2>
              <div className="mt-5 grid gap-3">
                {myAppointments.length ? myAppointments.map((item) => (
                  <div key={item.id} className="rounded-3xl bg-hope-cream p-4">
                    <p className="font-bold text-hope-berry">{item.providerName}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.status}{item.preferredDate ? ` • ${item.preferredDate}` : ''}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.reason}</p>
                  </div>
                )) : <p className="rounded-3xl bg-hope-cream p-4 text-sm text-slate-600">You have not submitted provider requests yet.</p>}
              </div>
            </section>
          </div>
        )}
      </section>
    </>
  );
}
