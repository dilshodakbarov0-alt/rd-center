import Link from 'next/link';
import { StatCard } from '@/components/StatCard';

const SESSIONS_TODAY = [
  {
    id: 1,
    icon: '🗣️',
    module: 'Речевой модуль',
    exercise: 'Выбор из 2 карточек',
    duration: '10 мин',
    skill: 'choose_from_2',
    skillName: 'Называние членов семьи',
  },
  {
    id: 2,
    icon: '🏠',
    module: 'Бытовые навыки',
    exercise: 'Пошаговое мытьё рук',
    duration: '7 мин',
    skill: 'hand_washing',
    skillName: 'Моет руки (с помощью)',
  },
  {
    id: 3,
    icon: '😊',
    module: 'Эмоции',
    exercise: 'Узнай эмоцию',
    duration: '8 мин',
    skill: 'recognizes_emotions_2',
    skillName: 'Узнаёт 2 эмоции',
  },
];

const AI_RECS = [
  {
    id: 1,
    type: 'upgrade',
    text: 'Акмал освоил выбор из 2 карточек на 85%+. Рекомендую перейти к выбору из 3.',
    action: 'Применить',
  },
  {
    id: 2,
    type: 'warning',
    text: 'Высокая усталость в конце занятий. Сократить сессию до 5 минут.',
    action: 'Принять',
  },
];

const RECENT_SESSIONS = [
  { date: '14 мая', module: 'Речевой', attempts: 10, independent: 85, result: '✓ Хорошо' },
  { date: '13 мая', module: 'Эмоции', attempts: 8, independent: 75, result: '✓ Хорошо' },
  { date: '12 мая', module: 'Бытовые', attempts: 7, independent: 57, result: '⚠ Средне' },
  { date: '11 мая', module: 'Речевой', attempts: 10, independent: 70, result: '✓ Хорошо' },
];

const QUICK_ACTIONS = [
  { href: '/family-photos', label: 'Загрузить фото', icon: '📷', color: 'border-blue-500/30 hover:border-blue-400/50' },
  { href: '/ai-lesson/create', label: 'Создать AI-урок', icon: '🎬', color: 'border-emerald-500/30 hover:border-emerald-400/50' },
  { href: '/videos', label: 'Загрузить видео', icon: '📹', color: 'border-violet-500/30 hover:border-violet-400/50' },
  { href: '/progress', label: 'Прогресс', icon: '📊', color: 'border-sky-500/30 hover:border-sky-400/50' },
];

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Сегодня, 15 мая 2026</p>
          <h1 className="text-3xl font-bold text-white">Добро пожаловать!</h1>
          <p className="mt-1 text-slate-400">Платформа готова к занятиям</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span className="text-sm font-semibold text-white">Акмал</span>
          <span className="text-xs text-slate-400">4 г. · Уровень речи 2</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Занятий сегодня" value="2 / 3" />
        <StatCard title="Самостоятельность" value="68%" />
        <StatCard title="Карточек освоено" value="24" />
        <StatCard title="AI-уроков" value="5" />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Сегодняшний план</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {SESSIONS_TODAY.map(s => (
            <div key={s.id} className="card flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="badge mb-1.5 text-[10px]">{s.module}</span>
                  <h3 className="text-sm font-semibold text-white">{s.exercise}</h3>
                  <p className="mt-0.5 text-xs text-slate-400">{s.duration} · VB-MAPP: {s.skillName}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                <Link
                  href="/sessions/new"
                  className="flex flex-1 items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
                >
                  Начать
                </Link>
                <Link
                  href="/ai-lesson/create"
                  className="flex flex-1 items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-500/40"
                >
                  AI-урок
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-emerald-400">✦</span>
          <h2 className="text-lg font-semibold text-white">Рекомендации ИИ</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {AI_RECS.map(rec => (
            <div
              key={rec.id}
              className={`card border-l-4 ${rec.type === 'upgrade' ? 'border-l-emerald-500' : 'border-l-amber-500'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-slate-200">{rec.text}</p>
                <button
                  type="button"
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    rec.type === 'upgrade'
                      ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                      : 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                  }`}
                >
                  {rec.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-white">Последние занятия</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Модуль</th>
                <th>Попыток</th>
                <th>Самостоятельно</th>
                <th>Результат</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_SESSIONS.map((s, i) => (
                <tr key={i}>
                  <td className="py-3 text-slate-400">{s.date}</td>
                  <td className="py-3 font-medium text-white">{s.module}</td>
                  <td className="py-3 text-slate-300">{s.attempts}</td>
                  <td className="py-3">
                    <span className={`font-semibold ${s.independent >= 80 ? 'text-emerald-300' : s.independent >= 60 ? 'text-sky-300' : 'text-amber-300'}`}>
                      {s.independent}%
                    </span>
                  </td>
                  <td className="py-3 text-sm">{s.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Быстрые действия</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map(a => (
            <Link
              key={a.href}
              href={a.href}
              className={`card flex items-center gap-3 transition-colors ${a.color}`}
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="font-semibold text-white text-sm">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
