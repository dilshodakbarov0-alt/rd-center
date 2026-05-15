import Link from "next/link";
import { SkillBadge } from "@/components/SkillBadge";
import { getPageDictionary } from "@/lib/page-helpers";
import { User, ChartBar, Brain, Settings } from "lucide-react";

const CHILDREN = [
  {
    id: "akmal",
    name: "Акмал",
    age: "4 г.",
    diagnosis: "РАС",
    speechLevel: 1,
    parentName: "Малика",
    lastSession: "вчера",
    sessions: 12,
    independentRate: 68,
    trend: "+8% за неделю",
  },
  {
    id: "zarina",
    name: "Зарина",
    age: "3 г.",
    diagnosis: "ЗПРР",
    speechLevel: 2,
    parentName: "Нодира",
    lastSession: "3 дня назад",
    sessions: 7,
    independentRate: 55,
    trend: "+3% за неделю",
  },
];

const AI_RECOMMENDATIONS = [
  {
    childId: "akmal",
    childName: "Акмал",
    text: "Акмал стабильно выбирает карточки из 2 вариантов 85%+ самостоятельно. Рекомендую перейти к выбору из 3.",
    type: "upgrade",
  },
  {
    childId: "zarina",
    childName: "Зарина",
    text: "Зарина: высокая частота отказов в конце занятия. Сократить длительность до 5 мин.",
    type: "warning",
  },
];

export default async function SpecialistPage() {
  const { dictionary } = await getPageDictionary();

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">{dictionary["specialist.title"]}</h1>
        <p className="mt-1 text-slate-400">Логопед Дилноза Каримова · 2 подопечных</p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Мои дети</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {CHILDREN.map((child) => (
            <div key={child.id} className="card space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 text-lg font-bold">
                    {child.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{child.name}</h3>
                    <p className="text-sm text-slate-400">{child.age} · {child.diagnosis}</p>
                  </div>
                </div>
                <SkillBadge level={child.speechLevel > 3 ? 3 : child.speechLevel as 0|1|2|3} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-800/50 px-3 py-2 text-center">
                  <p className="text-lg font-semibold text-white">{child.sessions}</p>
                  <p className="text-xs text-slate-500">занятий</p>
                </div>
                <div className="rounded-xl bg-slate-800/50 px-3 py-2 text-center">
                  <p className="text-lg font-semibold text-emerald-300">{child.independentRate}%</p>
                  <p className="text-xs text-slate-500">самост.</p>
                </div>
                <div className="rounded-xl bg-slate-800/50 px-3 py-2 text-center">
                  <p className="text-xs font-semibold text-sky-300">{child.trend}</p>
                  <p className="text-xs text-slate-500">прогресс</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User size={13} />
                  <span>Родитель: {child.parentName}</span>
                </div>
                <span>Последнее занятие: {child.lastSession}</span>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/progress"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600"
                >
                  <ChartBar size={14} />
                  Прогресс
                </Link>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/20"
                >
                  <Settings size={14} />
                  Скорректировать
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <Brain size={18} className="text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Рекомендации ИИ</h2>
        </div>
        <div className="space-y-3">
          {AI_RECOMMENDATIONS.map((rec) => (
            <div
              key={rec.childId}
              className={`card border-l-4 ${
                rec.type === "upgrade"
                  ? "border-l-emerald-500"
                  : "border-l-amber-500"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    rec.type === "upgrade"
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-amber-500/15 text-amber-300"
                  }`}>
                    {rec.childName}
                  </span>
                  <p className="text-sm text-slate-200">{rec.text}</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600"
                >
                  Скорректировать
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-white">{dictionary["specialist.skill_map"]}</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Ребёнок</th>
                <th>Узнаёт людей</th>
                <th>Называет</th>
                <th>Фразы</th>
                <th>Бытовые</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 font-medium">Акмал</td>
                <td className="py-3"><SkillBadge level={3} /></td>
                <td className="py-3"><SkillBadge level={2} /></td>
                <td className="py-3"><SkillBadge level={0} /></td>
                <td className="py-3"><SkillBadge level={1} /></td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Зарина</td>
                <td className="py-3"><SkillBadge level={3} /></td>
                <td className="py-3"><SkillBadge level={3} /></td>
                <td className="py-3"><SkillBadge level={1} /></td>
                <td className="py-3"><SkillBadge level={2} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
