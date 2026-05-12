import { getPageDictionary } from "@/lib/page-helpers";

const mockComponents = [
  { name: "Гипс", type: "Вяжущее", eps: false },
  { name: "Базальтовое волокно", type: "Волокно", eps: false },
  { name: "Гранулы EPS", type: "Лёгкий наполнитель", eps: true },
];

export default async function ComponentsPage() {
  const { dictionary } = await getPageDictionary();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">{dictionary["components.title"]}</h1>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Компонент</th>
              <th>Тип</th>
              <th>EPS</th>
            </tr>
          </thead>
          <tbody>
            {mockComponents.map((component) => (
              <tr key={component.name}>
                <td>{component.name}</td>
                <td>{component.type}</td>
                <td>{component.eps ? "Да" : "Нет"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
