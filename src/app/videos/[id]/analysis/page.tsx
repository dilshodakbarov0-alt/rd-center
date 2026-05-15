import Link from 'next/link';

const ANALYSIS = {
  title: 'Называние членов семьи',
  duration: '3:20',
  date: '14 мая 2026',
  uploaderRole: 'Родитель',
  goal: 'Обучение называнию членов семьи',
  structure: 'Введение → Основная часть → Закрепление',
  instructionQuality: 'Чёткая, короткая ✓',
  pauseBeforePrompt: '3 секунды ✓',
  promptType: 'Словесная',
  reinforcement: 'Используется ✓',
  fatigueSigns: 'Нет ✓',
  methodologyRating: 4,
  attempts: 8,
  independent: 6,
  prompted: 1,
  errors: 1,
  recommendation: 'На следующем занятии перейдите к выбору из 3 карточек. Акмал стабильно отвечает самостоятельно — можно усложнить.',
  nextExercise: 'choose_1of3',
};

export default function VideoAnalysisPage({ params: _params }: { params: { id: string } }) {
  const independentRate = Math.round((ANALYSIS.independent / ANALYSIS.attempts) * 100);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/videos" className="text-sm text-slate-500 hover:text-slate-300">← Мои видео</Link>
          <h1 className="mt-1 text-2xl font-bold text-white">{ANALYSIS.title}</h1>
        </div>
      </div>

      <div className="card">
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">Длительность</p>
            <p className="mt-0.5 text-sm font-semibold text-white">{ANALYSIS.duration}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Дата</p>
            <p className="mt-0.5 text-sm font-semibold text-white">{ANALYSIS.date}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Загрузил</p>
            <p className="mt-0.5 text-sm font-semibold text-white">{ANALYSIS.uploaderRole}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Оценка методики</p>
            <div className="mt-0.5 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < ANALYSIS.methodologyRating ? 'text-amber-400' : 'text-slate-700'}>★</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card space-y-4">
          <h2 className="text-base font-semibold text-white">Методика урока</h2>
          <div className="space-y-3">
            {[
              { label: 'Цель урока', value: ANALYSIS.goal },
              { label: 'Структура', value: ANALYSIS.structure },
              { label: 'Инструкция', value: ANALYSIS.instructionQuality },
              { label: 'Пауза перед подсказкой', value: ANALYSIS.pauseBeforePrompt },
              { label: 'Тип подсказки', value: ANALYSIS.promptType },
              { label: 'Подкрепление', value: ANALYSIS.reinforcement },
              { label: 'Признаки усталости', value: ANALYSIS.fatigueSigns },
            ].map(item => (
              <div key={item.label} className="flex items-start justify-between gap-4 border-b border-slate-800 pb-2 last:border-0">
                <span className="text-xs text-slate-500 shrink-0">{item.label}</span>
                <span className="text-xs font-semibold text-slate-200 text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-base font-semibold text-white">Реакция ребёнка</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-800/50 p-3 text-center">
              <p className="text-2xl font-bold text-white">{ANALYSIS.attempts}</p>
              <p className="text-xs text-slate-500">Попыток</p>
            </div>
            <div className="rounded-xl bg-emerald-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-300">{independentRate}%</p>
              <p className="text-xs text-slate-500">Самостоятельно</p>
            </div>
            <div className="rounded-xl bg-slate-800/50 p-3 text-center">
              <p className="text-2xl font-bold text-sky-300">{ANALYSIS.prompted}</p>
              <p className="text-xs text-slate-500">С подсказкой</p>
            </div>
            <div className="rounded-xl bg-slate-800/50 p-3 text-center">
              <p className="text-2xl font-bold text-red-300">{ANALYSIS.errors}</p>
              <p className="text-xs text-slate-500">Ошибок</p>
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-500">Самостоятельность</span>
              <span className="font-semibold text-emerald-300">{independentRate}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                style={{ width: `${independentRate}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-600">
              <span>0%</span>
              <span>80% — цель</span>
              <span>100%</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {[
              { label: 'Самостоятельных ответов', count: ANALYSIS.independent, color: 'bg-emerald-500' },
              { label: 'С подсказкой', count: ANALYSIS.prompted, color: 'bg-sky-500' },
              { label: 'Ошибок', count: ANALYSIS.errors, color: 'bg-red-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                <span className="text-slate-400">{item.label}:</span>
                <span className="font-semibold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">✦</span>
          <div>
            <p className="text-sm font-semibold text-emerald-300 mb-1">Рекомендация ИИ</p>
            <p className="text-sm text-slate-200">{ANALYSIS.recommendation}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/ai-lesson/create"
          className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
        >
          Создать AI-урок на основе анализа
        </Link>
        <Link
          href="/games"
          className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600"
        >
          Создать игру
        </Link>
      </div>
    </section>
  );
}
