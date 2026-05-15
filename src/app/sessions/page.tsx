import Link from "next/link";
import { Play, CheckCircle2 } from "lucide-react";
import { getPageDictionary } from "@/lib/page-helpers";

const MOCK_SESSIONS = [
  {
    id: "s1",
    date: "15 мая",
    module: "Речевой модуль",
    moduleKey: "speech",
    trials: 10,
    independent: 70,
    status: "completed",
    exercise: "Выбор из 2 карточек",
  },
  {
    id: "s2",
    date: "14 мая",
    module: "Карточки — действия",
    moduleKey: "speech",
    trials: 8,
    independent: 63,
    status: "completed",
    exercise: "Назови карточку",
  },
  {
    id: "s3",
    date: "13 мая",
    module: "Безопасность",
    moduleKey: "safety",
    trials: 6,
    independent: 50,
    status: "completed",
    exercise: "Выбор из 2 карточек",
  },
  {
    id: "s4",
    date: "12 мая",
    module: "Эмоции",
    moduleKey: "emotions",
    trials: 10,
    independent: 80,
    status: "completed",
    exercise: "Ответь на вопрос",
  },
  {
    id: "s5",
    date: "11 мая",
    module: "Бытовые навыки",
    moduleKey: "daily_skills",
    trials: 8,
    independent: 55,
    status: "completed",
    exercise: "Построй фразу",
  },
];

const MODULE_COLORS: Record<string, string> = {
  speech: "bg-emerald-500/15 text-emerald-300",
  safety: "bg-red-500/15 text-red-300",
  emotions: "bg-violet-500/15 text-violet-300",
  daily_skills: "bg-sky-500/15 text-sky-300",
  sensory: "bg-amber-500/15 text-amber-300",
};

export default async function SessionsPage() {
  const { dictionary } = await getPageDictionary();

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">{dictionary["nav.sessions"]}</h1>
          <p className="mt-1 text-slate-400">История занятий и запуск нового</p>
        </div>
        <Link
          href="/sessions/new"
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
        >
          <Play size={16} />
          {dictionary["session.start"]}
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["Все", "Речь", "Быт", "Безопасность"].map((tab, i) => (
          <button
            key={tab}
            type="button"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              i === 0
                ? "bg-emerald-500/20 text-emerald-200"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {MOCK_SESSIONS.map((session) => (
          <div key={session.id} className="card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white">{session.date}</span>
                    <span className="text-slate-600">·</span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${MODULE_COLORS[session.moduleKey]}`}>
                      {session.module}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {session.exercise} · {session.trials} попыток
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-emerald-300">{session.independent}%</p>
                  <p className="text-xs text-slate-500">самостоятельность</p>
                </div>
                <Link
                  href="/sessions/demo"
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600"
                >
                  Повторить
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
