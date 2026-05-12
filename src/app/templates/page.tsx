import { getPageDictionary } from "@/lib/page-helpers";

const templates = [
  { name: "Шаблон СОП", description: "Операционные шаги и контрольный список безопасности." },
  { name: "Шаблон плана КК", description: "Контрольные точки качества и приёмка." },
  { name: "Шаблон паспорта", description: "Паспорт продукта с техническими характеристиками." },
];

export default async function TemplatesPage() {
  const { dictionary } = await getPageDictionary();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">{dictionary["templates.title"]}</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {templates.map((template) => (
          <div key={template.name} className="card">
            <h3 className="text-lg font-semibold text-white">{template.name}</h3>
            <p className="mt-2 text-sm text-slate-400">{template.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
