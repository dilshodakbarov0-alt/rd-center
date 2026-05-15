const STATS = [
  { label: 'Пользователей', value: '156', sub: 'Родителей: 120 · Специалистов: 28 · Методистов: 6 · Админов: 2' },
  { label: 'Детей', value: '134', sub: 'Профилей создано' },
  { label: 'Занятий за месяц', value: '2 847', sub: 'Апрель 2026' },
  { label: 'AI-запросов за месяц', value: '15 430', sub: 'Стоимость: $23.40' },
];

const HEALTH_CARDS = [
  { label: 'API Status', value: 'Все провайдеры', status: 'ok', icon: '✅' },
  { label: 'Хранилище', value: '67% использовано', status: 'ok', icon: '💾' },
  { label: 'Очередь задач', value: '3 в очереди', status: 'ok', icon: '⚙️' },
  { label: 'Безопасность', value: '0 нарушений', status: 'ok', icon: '🛡️' },
];

const AI_PROVIDERS = [
  { name: 'OpenAI GPT-4o', status: 'active', requests: 847, latency: '1.2s', cost: '$12.40' },
  { name: 'Anthropic Claude', status: 'active', requests: 432, latency: '1.8s', cost: '$8.20' },
  { name: 'Google Gemini', status: 'active', requests: 231, latency: '0.9s', cost: '$2.80' },
  { name: 'Local Model', status: 'offline', requests: 0, latency: '—', cost: '$0' },
];

const AUDIT_LOG = [
  { user: 'malika@example.com', action: 'upload_photo', resource: 'family_members', time: '10 мин назад' },
  { user: 'specialist@example.com', action: 'approve_recommendation', resource: 'ai_recommendations', time: '25 мин назад' },
  { user: 'admin@example.com', action: 'update_provider_config', resource: 'ai_gateway', time: '1 ч назад' },
  { user: 'nodira@example.com', action: 'revoke_consent', resource: 'consent_records', time: '2 ч назад' },
  { user: 'methodist@example.com', action: 'approve_rule', resource: 'method_rules', time: '3 ч назад' },
];

export default function AdminPage() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Панель администратора</h1>
        <p className="mt-1 text-slate-400">Bolajon AI Rivoj · 15 мая 2026</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(s => (
          <div key={s.label} className="card">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-300">{s.label}</p>
            <p className="mt-1 text-[10px] text-slate-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HEALTH_CARDS.map(h => (
          <div key={h.label} className="card flex items-center gap-3">
            <span className="text-2xl">{h.icon}</span>
            <div>
              <p className="text-xs text-slate-500">{h.label}</p>
              <p className="text-sm font-semibold text-white">{h.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="mb-4 text-base font-semibold text-white">AI Gateway — статус провайдеров</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Провайдер</th>
                <th>Статус</th>
                <th>Запросов сегодня</th>
                <th>Средняя задержка</th>
                <th>Стоимость в месяце</th>
              </tr>
            </thead>
            <tbody>
              {AI_PROVIDERS.map(p => (
                <tr key={p.name}>
                  <td className="py-3 font-semibold text-white">{p.name}</td>
                  <td className="py-3">
                    {p.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                        Активен
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                        Офлайн
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-slate-300">{p.requests}</td>
                  <td className="py-3 text-slate-300">{p.latency}</td>
                  <td className="py-3 font-semibold text-emerald-300">{p.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-base font-semibold text-white">Журнал аудита</h2>
        <div className="space-y-2">
          {AUDIT_LOG.map((entry, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-800/30 px-3 py-2.5">
              <div className="h-1.5 w-1.5 mt-1.5 shrink-0 rounded-full bg-slate-600"></div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-white truncate">{entry.user}</span>
                  <span className="rounded-full bg-slate-700/70 px-2 py-0.5 text-[10px] text-slate-400">
                    {entry.action}
                  </span>
                  <span className="text-[10px] text-slate-600">{entry.resource}</span>
                </div>
              </div>
              <span className="shrink-0 text-[10px] text-slate-600">{entry.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
