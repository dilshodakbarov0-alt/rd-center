import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { getPageDictionary } from "@/lib/page-helpers";

const sampleProjects = [
  {
    id: "basalt-gyplight",
    name: "Basalt-GypLight Mix",
    type: "потолок",
    zone: "Интерьер",
    status: "В процессе",
    region: "Ташкент",
  },
  {
    id: "panel-eco",
    name: "Panel ThermoShield",
    type: "панель",
    zone: "Экстерьер",
    status: "Черновик",
    region: "Самарканд",
  },
];

export default async function DashboardPage() {
  const { dictionary } = await getPageDictionary();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{dictionary["dashboard.title"]}</p>
          <h1 className="text-3xl font-semibold text-white">Центр R&D</h1>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">
            + {dictionary["actions.generate"]}
          </button>
          <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200">
            {dictionary["actions.validate"]}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Активные проекты" value="12" />
        <StatCard title="Варианты на проверке" value="8" />
        <StatCard title="Заблокированы КК" value="2" />
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">{dictionary["dashboard.filters"]}</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
              <option>Тип</option>
              <option>Смесь</option>
              <option>Панель</option>
            </select>
            <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
              <option>Зона</option>
              <option>Интерьер</option>
              <option>Экстерьер</option>
            </select>
            <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
              <option>Статус</option>
              <option>Черновик</option>
              <option>В процессе</option>
              <option>Готово</option>
            </select>
            <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
              <option>Регион</option>
              <option>Ташкент</option>
              <option>Самарканд</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {sampleProjects.map((project) => (
          <Link key={project.id} href={`/project/${project.id}`} className="card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                <p className="text-sm text-slate-400">
                  {project.type} · {project.zone} · {project.region}
                </p>
              </div>
              <span className="badge">{project.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
