import Link from 'next/link';

const STATS = [
  { label: 'Материалов загружено', value: '12' },
  { label: 'Правил извлечено', value: '89' },
  { label: 'Правил одобрено', value: '67' },
  { label: 'На проверке', value: '22' },
];

const MATERIALS = [
  { name: 'ABA Therapy Basics', type: 'PDF', date: '12 мая', status: 'complete' },
  { name: 'VB-MAPP Assessment', type: 'PDF', date: '10 мая', status: 'complete' },
  { name: 'Логопедические протоколы', type: 'DOCX', date: '8 мая', status: 'complete' },
  { name: 'Сенсорная интеграция', type: 'Book', date: '5 мая', status: 'processing' },
  { name: 'DTT Manual', type: 'PDF', date: '1 мая', status: 'complete' },
];

const PENDING_RULES = [
  {
    id: 1,
    text: 'Давать подсказку только после паузы 3–5 секунд, чтобы дать ребёнку время ответить самостоятельно.',
    domain: 'prompting',
    confidence: 0.95,
    source: 'ABA Therapy Basics',
  },
  {
    id: 2,
    text: 'Усложнять только при 80%+ самостоятельности в течение 3 последовательных занятий.',
    domain: 'progression',
    confidence: 0.98,
    source: 'VB-MAPP Assessment',
  },
  {
    id: 3,
    text: 'Хвалить за каждый самостоятельный ответ немедленно, не ждать конца занятия.',
    domain: 'reinforcement',
    confidence: 0.99,
    source: 'ABA Therapy Basics',
  },
];

const DOMAIN_STATS = [
  { domain: 'Prompting', count: 15, color: 'bg-blue-500' },
  { domain: 'Progression', count: 18, color: 'bg-emerald-500' },
  { domain: 'Reinforcement', count: 12, color: 'bg-amber-500' },
  { domain: 'Safety', count: 8, color: 'bg-red-500' },
  { domain: 'Sensory', count: 7, color: 'bg-purple-500' },
  { domain: 'Emotions', count: 7, color: 'bg-yellow-500' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  complete: { label: 'Обработано', color: 'text-emerald-300 bg-emerald-500/10' },
  processing: { label: 'Обрабатывается', color: 'text-amber-300 bg-amber-500/10' },
  queued: { label: 'В очереди', color: 'text-slate-400 bg-slate-700/50' },
};

export default function MethodsPage() {
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Методическая база</h1>
          <p className="mt-1 text-slate-400">Методист Дилром Юсупова · Управление знаниями платформы</p>
        </div>
        <Link
          href="/methods/upload"
          className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
        >
          + Загрузить материал
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(s => (
          <div key={s.label} className="card">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-1 text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="mb-4 text-base font-semibold text-white">Последние материалы</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {MATERIALS.map((m, i) => {
                const statusInfo = STATUS_CONFIG[m.status] ?? STATUS_CONFIG.queued;
                return (
                  <tr key={i}>
                    <td className="py-3 font-medium text-white">{m.name}</td>
                    <td className="py-3">
                      <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-400">{m.type}</span>
                    </td>
                    <td className="py-3 text-slate-500">{m.date}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link href="/methods/review" className="text-xs text-emerald-400 hover:underline">
                        Просмотр правил
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Правила на проверке</h2>
        <div className="space-y-3">
          {PENDING_RULES.map(rule => (
            <div key={rule.id} className="card space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-700/70 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                      {rule.domain}
                    </span>
                    <span className="text-xs text-slate-500">
                      Уверенность: {Math.round(rule.confidence * 100)}%
                    </span>
                    <span className="text-xs text-slate-600">из: {rule.source}</span>
                  </div>
                  <p className="text-sm text-slate-200">{rule.text}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
                  >
                    Одобрить ✓
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/25"
                  >
                    Отклонить ✗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-base font-semibold text-white">База знаний по доменам</h2>
        <div className="space-y-3">
          {DOMAIN_STATS.map(d => (
            <div key={d.domain} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-xs text-slate-400">{d.domain}</span>
              <div className="flex-1 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${d.color} transition-all`}
                  style={{ width: `${(d.count / 20) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-xs font-semibold text-white">{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
