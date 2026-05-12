import { getPageDictionary } from "@/lib/page-helpers";

const mockPrices = [
  { region: "Ташкент", gypsum: 120, basalt: 240 },
  { region: "Самарканд", gypsum: 110, basalt: 230 },
];

export default async function PricesPage() {
  const { dictionary } = await getPageDictionary();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">{dictionary["prices.title"]}</h1>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Регион</th>
              <th>Гипс</th>
              <th>Базальтовое волокно</th>
            </tr>
          </thead>
          <tbody>
            {mockPrices.map((price) => (
              <tr key={price.region}>
                <td>{price.region}</td>
                <td>${price.gypsum}</td>
                <td>${price.basalt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
