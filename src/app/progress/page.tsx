import { StatCard } from "@/components/StatCard";
import { SkillBadge } from "@/components/SkillBadge";
import { getPageDictionary } from "@/lib/page-helpers";
import { ChartBar, BookOpen, Baby, Download } from "lucide-react";

type SkillLevel = 0 | 1 | 2 | 3;

const SKILLS: { name: string; level: SkillLevel; updated: string }[] = [
  { name: "Узнаёт членов семьи", level: 3, updated: "14 мая" },
  { name: "Называет людей", level: 2, updated: "13 мая" },
  { name: "Узнаёт предметы", level: 3, updated: "14 мая" },
  { name: "Называет предметы", level: 1, updated: "12 мая" },
  { name: "Строит фразу из 2 слов", level: 0, updated: "—" },
  { name: "Отвечает на «Кто это?»", level: 2, updated: "13 мая" },
  { name: "Бытовые навыки: еда", level: 1, updated: "11 мая" },
  { name: "Безопасность: откликается на имя", level: 3, updated: "14 мая" },
];

const SESSION_BARS = [
  { date: "9 мая", percent: 50, label: "50%" },
  { date: "10 мая", percent: 55, label: "55%" },
  { date: "11 мая", percent: 60, label: "60%" },
  { date: "12 мая", percent: 58, label: "58%" },
  { date: "13 мая", percent: 65, label: "65%" },
  { date: "14 мая", percent: 70, label: "70%" },
  { date: "15 мая", percent: 68, label: "68%" },
];

export default async function ProgressPage() {
  const { dictionary } = await getPageDictionary();

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">{dictionary["progress.title"]}</h1>
          <p className="mt-1 text-slate-400">Акмал · 4 года · РАС · Уровень речи 1</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600"
        >
          <Download size={15} />
          Скачать отчёт
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["За неделю", "За месяц", "За всё время"].map((tab, i) => (
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

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title={dictionary["progress.sessions_done"]}
          value="12"
          icon={<BookOpen className="text-emerald-400" size={24} />}
        />
        <StatCard
          title={dictionary["progress.independent_rate"]}
          value="68%"
          icon={<ChartBar className="text-sky-400" size={24} />}
        />
        <StatCard
          title={dictionary["progress.cards_mastered"]}
          value="24"
          icon={<Baby className="text-violet-400" size={24} />}
        />
        <StatCard
          title="Фраз освоено"
          value="8"
          icon={<ChartBar className="text-amber-400" size={24} />}
        />
      </div>

      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-white">Самостоятельность по дням</h2>
        <div className="flex items-end gap-2 h-36">
          {SESSION_BARS.map((bar) => (
            <div key={bar.date} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs text-slate-500">{bar.label}</span>
              <div
                className="w-full rounded-t-md bg-emerald-500/70 transition-all"
                style={{ height: `${bar.percent * 1.2}px` }}
              />
              <span className="text-xs text-slate-500 whitespace-nowrap">{bar.date.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-white">{dictionary["specialist.skill_map"]}</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Навык</th>
              <th>Уровень</th>
              <th>Обновлено</th>
            </tr>
          </thead>
          <tbody>
            {SKILLS.map((skill) => (
              <tr key={skill.name}>
                <td className="py-3">{skill.name}</td>
                <td className="py-3">
                  <SkillBadge level={skill.level} />
                </td>
                <td className="py-3 text-slate-400 text-sm">{skill.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
