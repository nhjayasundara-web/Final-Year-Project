import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';
import type { SelfExamStep } from '../types';

const fallbackSteps: SelfExamStep[] = [
  { id: '1', order: 1, title: 'Know your normal', detail: 'Notice how your breasts usually look and feel.' },
  { id: '2', order: 2, title: 'Look in the mirror', detail: 'Check shape, size, skin, and nipple changes.' },
  { id: '3', order: 3, title: 'Feel with finger pads', detail: 'Use small circles and cover the breast and underarm.' }
];

export default function SelfExam() {
  const [steps, setSteps] = useState<SelfExamStep[]>([]);
  const [reminderDay, setReminderDay] = useState(() => localStorage.getItem('hope_reminder_day') || '1');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api<{ steps: SelfExamStep[] }>('/content/self-exam')
      .then((data) => setSteps(data.steps))
      .catch(() => setSteps(fallbackSteps));
  }, []);

  const saveReminder = () => {
    localStorage.setItem('hope_reminder_day', reminderDay);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <PageHeader eyebrow="Guided self-exam" title="Know your normal, notice changes early" text="Self-awareness can help you identify changes and seek professional care sooner. It does not replace screening." />
      <section className="section-wrap py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="grid gap-5">
            {steps.map((step) => (
              <article key={step.id} className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-hope-wine text-lg font-bold text-white">{step.order}</span>
                  <div>
                    <h2 className="text-xl font-bold text-hope-berry">{step.title}</h2>
                    <p className="mt-2 leading-7 text-slate-600">{step.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="glass-card h-fit rounded-[2rem] p-6">
            <span className="badge">Monthly reminder</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-hope-berry">Set a gentle reminder</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Choose a day of the month. This demo stores the reminder in your browser. Production can add SMS, email, or push notifications.
            </p>
            <label className="label mt-6" htmlFor="reminderDay">Day of month</label>
            <select id="reminderDay" className="input" value={reminderDay} onChange={(event) => setReminderDay(event.target.value)}>
              {Array.from({ length: 28 }, (_, index) => String(index + 1)).map((day) => <option key={day} value={day}>{day}</option>)}
            </select>
            <button onClick={saveReminder} className="btn-primary mt-5 w-full">Save reminder</button>
            {saved && <p className="mt-4 rounded-2xl bg-green-50 p-3 text-sm font-semibold text-green-700">Reminder saved locally.</p>}
            <div className="mt-6 rounded-3xl bg-hope-blush/70 p-5 text-sm leading-7 text-hope-berry">
              Seek care for any new, persistent, or worrying breast change, even if it is painless.
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
