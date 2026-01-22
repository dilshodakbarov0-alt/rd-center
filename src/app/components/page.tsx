import { getPageDictionary } from "@/lib/page-helpers";

const mockComponents = [
  { name: "Gypsum", type: "Binder", eps: false },
  { name: "Basalt fiber", type: "Fiber", eps: false },
  { name: "EPS beads", type: "Lightweight", eps: true },
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
              <th>Component</th>
              <th>Type</th>
              <th>EPS</th>
            </tr>
          </thead>
          <tbody>
            {mockComponents.map((component) => (
              <tr key={component.name}>
                <td>{component.name}</td>
                <td>{component.type}</td>
                <td>{component.eps ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
