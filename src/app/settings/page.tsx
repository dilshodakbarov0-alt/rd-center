import { getPageDictionary } from "@/lib/page-helpers";
import { sectionSpecs } from "@/lib/sections";

export default async function SettingsPage() {
  const { dictionary } = await getPageDictionary();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">{dictionary["settings.title"]}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-4">
          <div>
            <p className="text-xs uppercase text-slate-500">Язык по умолчанию</p>
            <select className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
              <option>Русский</option>
              <option>Ўзбекча</option>
            </select>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Политика EPS по умолчанию</p>
            <select className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
              <option>Запрещено</option>
              <option>Разрешено</option>
            </select>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Логотип</p>
            <input type="file" className="mt-2 w-full text-sm text-slate-300" />
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold text-white">Библиотека сечений</h2>
          <p className="mt-2 text-sm text-slate-400">
            Пользовательские сечения для расчётов конструкций.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {sectionSpecs.map((section) => (
              <li key={section.name}>
                {section.name}: b {section.b} мм · h {section.h} мм
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
