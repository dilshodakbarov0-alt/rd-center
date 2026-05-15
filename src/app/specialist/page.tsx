import Link from 'next/link';
import { SkillBadge } from '@/components/SkillBadge';

const CHILDREN = [
  {
    id: 'akmal',
    name: 'Акмал',
    age: '4 г.',
    diagnosis: 'РАС',
    speechLevel: 2 as 0 | 1 | 2 | 3,
    parentName: 'Малика',
    lastSession: 'вчера',
    lastOutcome: '85% самостоятельно, цель: называние членов семьи',
    sessions: 12,
    independentRate: 68,
    trend: '+8% за неделю',
  },
  {
    id: 'zarina',
    name: 'Зарина',
    age: '3 г.',
    diagnosis: 'ЗПРР',
    speechLevel: 1 as 0 | 1 | 2 | 3,
    parentName: 'Нодира',
    lastSession: '3 дня назад',
    lastOutcome: '55% самостоятельно, частые отказы к концу занятия',
    sessions: 7,
    independentRate: 55,
    trend: '+3% за неделю',
  },
  {
    id: 'timur',
    name: 'Тимур',
    age: '5 г.',
    diagnosis: 'ЗРР',
    speechLevel: 3 as 0 | 1 | 2 | 3,
    parentName: 'Дилором',
    lastSession: '5 дней назад',
    lastOutcome: '72% самостоятельно, прогресс в фразах из 2 слов',
    sessions: 20,
    independentRate: 72,
    trend: '+5% за неделю',
  },
];

const AI_RECOMMENDATIONS = [
  {
    childId: 'akmal',
    childName: 'Акмал',
    text: 'Акмал стабильно выбирает карточки из 2 вариантов 85%+ самостоятельно. Рекомендую перейти к выбору из 3.',
    type: 'upgrade',
  },
  {
    childId: 'zarina',
    childName: 'Зарина',
    text: 'Зарина: высокая частота отказов в конце занятия. Сократить длительность до 5 мин.',
    type: 'warning',
  },
];

const VIDEO_SUMMARIES = [
  { childName: 'Акмал', date: '14 мая', title: 'Называние членов семьи', rating: 4, response: '75%' },
  { childName: 'Зарина', date: '11 мая', title: 'Мытьё рук — пошагово', rating: 3, response: '60%' },
  { childName: 'Тимур', date: '10 мая', title: 'Сборка фразы', rating: 5, response: '85%' },
];

export default function SpecialistPage() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Кабинет специалиста</h1>
        <p className="mt-1 text-slate-400">Логопед Дилноза Каримова · 3 подопечных</p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Мои дети</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {CHILDREN.map(child => (
            <div key={child.id} className="card space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 text-lg font-bold">
                    {child.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{child.name}</h3>
                    <p className="text-xs text-slate-400">{child.age} · {child.diagnosis}</p>
                  </div>
                </div>
                <SkillBadge level={child.speechLevel} />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-slate-700 pl-2">{child.lastOutcome}</p>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-slate-800/50 px-2 py-2 text-center">
                  <p className="text-base font-semibold text-white">{child.sessions}</p>
                  <p className="text-[10px] text-slate-500">занятий</p>
                </div>
                <div className="rounded-lg bg-slate-800/50 px-2 py-2 text-center">
                  <p className="text-base font-semibold text-emerald-300">{child.independentRate}%</p>
                  <p className="text-[10px] text-slate-500">самост.</p>
                </div>
                <div className="rounded-lg bg-slate-800/50 px-2 py-2 text-center">
                  <p className="text-[10px] font-semibold text-sky-300 leading-tight">{child.trend}</p>
                  <p className="text-[10px] text-slate-500">прогресс</p>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Родитель: {child.parentName} · Последнее: {child.lastSession}
              </p>

              <div className="flex gap-2">
                <Link
                  href="/progress"
                  className="flex flex-1 items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600"
                >
                  Карта навыков
                </Link>
                <Link
                  href="/specialist/videos"
                  className="flex flex-1 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/20"
                >
                  Загрузить видео
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-emerald-400">✦</span>
          <h2 className="text-lg font-semibold text-white">Рекомендации для корректировки</h2>
        </div>
        <div className="space-y-3">
          {AI_RECOMMENDATIONS.map(rec => (
            <div
              key={rec.childId}
              className={`card border-l-4 ${rec.type === 'upgrade' ? 'border-l-emerald-500' : 'border-l-amber-500'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    rec.type === 'upgrade' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
                  }`}>
                    {rec.childName}
                  </span>
                  <p className="text-sm text-slate-200">{rec.text}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
                  >
                    Одобрить
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600"
                  >
                    Изменить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Видео занятий</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {VIDEO_SUMMARIES.map((v, i) => (
            <div key={i} className="card space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-white">{v.childName}</span>
                <span className="text-xs text-slate-500">{v.date}</span>
              </div>
              <p className="text-xs text-slate-300">{v.title}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <span key={si} className={si < v.rating ? 'text-amber-400' : 'text-slate-700'}>★</span>
                  ))}
                </div>
                <span className="text-xs text-emerald-300">{v.response} реакций</span>
              </div>
              <Link
                href="/videos/1/analysis"
                className="flex w-full items-center justify-center rounded-lg border border-slate-700 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600"
              >
                Смотреть анализ
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
