import { TabNav } from "@/components/TabNav";
import { getPageDictionary } from "@/lib/page-helpers";
import { evaluateQuality } from "@/lib/quality";
import { MaterialProjectV1Schema } from "@/lib/validators";

const mockProject = MaterialProjectV1Schema.parse({
  id: "basalt-gyplight",
  name: "Basalt-GypLight Mix",
  type: "ceiling",
  zone: "Interior",
  status: "in_progress",
  region: "Tashkent",
  constraints: {
    eps_policy: "forbidden",
    min_pull_off_mpa: 0.4,
  },
  targets: {
    density_kg_m3: 920,
    strength_mpa: 0.35,
  },
  recipe: {
    w_g: 0.33,
    rdp_pct: 0.9,
    rheology_pct: 0.08,
    water_retention_pct: 0.05,
    basalt_fiber_pct: 0.2,
  },
  variants: [
    {
      name: "Eco",
      summary: "Low-cost gypsum mix with basalt fiber.",
      components: [
        { name: "Gypsum", ratio: 0.62 },
        { name: "Basalt fiber", ratio: 0.02 },
        { name: "RDP", ratio: 0.009 },
      ],
    },
    {
      name: "Standard",
      summary: "Balanced strength and workability.",
      components: [
        { name: "Gypsum", ratio: 0.58 },
        { name: "Basalt fiber", ratio: 0.02 },
        { name: "Limestone", ratio: 0.15 },
      ],
    },
    {
      name: "Pro",
      summary: "High performance ceiling finish.",
      components: [
        { name: "Gypsum", ratio: 0.52 },
        { name: "Basalt fiber", ratio: 0.03 },
        { name: "Additives pack", ratio: 0.05 },
      ],
    },
  ],
  economics: {
    cost_per_ton: 120,
    margin_pct: 24,
  },
});

export default async function ProjectPage() {
  const { dictionary } = await getPageDictionary();
  const qualityIssues = evaluateQuality(mockProject);
  const tabs = [
    { name: dictionary["project.overview"], href: "#overview", active: true },
    { name: dictionary["project.targets"], href: "#targets" },
    { name: dictionary["project.recipe"], href: "#recipe" },
    { name: dictionary["project.variants"], href: "#variants" },
    { name: dictionary["project.doe"], href: "#doe" },
    { name: dictionary["project.qc"], href: "#qc" },
    { name: dictionary["project.sop"], href: "#sop" },
    { name: dictionary["project.economics"], href: "#economics" },
    { name: dictionary["project.documents"], href: "#documents" },
    { name: dictionary["project.images"], href: "#images" },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">{mockProject.name}</h1>
          <p className="text-sm text-slate-400">
            {mockProject.type} · {mockProject.zone} · {mockProject.region}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">
            {dictionary["actions.generate"]} Eco/Standard/Pro
          </button>
          <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200">
            {dictionary["actions.validate"]}
          </button>
        </div>
      </div>

      <TabNav tabs={tabs} />

      {qualityIssues.length > 0 && (
        <div className="card border border-amber-500/40 bg-amber-500/10">
          <h2 className="text-sm font-semibold text-amber-200">Quality & Safety</h2>
          <ul className="mt-2 space-y-2 text-sm text-amber-100">
            {qualityIssues.map((issue, index) => (
              <li key={index}>
                <span className="font-semibold uppercase">{issue.level}</span> — {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div id="overview" className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-semibold text-white">Overview</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Target density: {mockProject.targets.density_kg_m3} kg/m³</li>
            <li>Target pull-off: {mockProject.targets.strength_mpa} MPa</li>
            <li>Status: {mockProject.status}</li>
          </ul>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold text-white">Constraints</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>EPS policy: {mockProject.constraints.eps_policy}</li>
            <li>Min pull-off: {mockProject.constraints.min_pull_off_mpa} MPa</li>
          </ul>
        </div>
      </div>

      <div id="targets" className="card">
        <h2 className="text-lg font-semibold text-white">Targets & Constraints</h2>
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Rule</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>W/G</td>
              <td>{mockProject.recipe.w_g}</td>
              <td>0.34 - 0.42 (ceiling)</td>
            </tr>
            <tr>
              <td>RDP%</td>
              <td>{mockProject.recipe.rdp_pct}</td>
              <td>&gt;= 1.0%</td>
            </tr>
            <tr>
              <td>Rheology%</td>
              <td>{mockProject.recipe.rheology_pct}</td>
              <td>&gt;= 0.10%</td>
            </tr>
            <tr>
              <td>WaterRetention%</td>
              <td>{mockProject.recipe.water_retention_pct}</td>
              <td>&gt;= 0.06%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="recipe" className="card">
        <h2 className="text-lg font-semibold text-white">Recipe</h2>
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Component</th>
              <th>Ratio</th>
            </tr>
          </thead>
          <tbody>
            {mockProject.variants[0].components.map((component) => (
              <tr key={component.name}>
                <td>{component.name}</td>
                <td>{component.ratio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div id="variants" className="grid gap-4 md:grid-cols-3">
        {mockProject.variants.map((variant) => (
          <div key={variant.name} className="card">
            <h3 className="text-lg font-semibold text-white">{variant.name}</h3>
            <p className="mt-2 text-sm text-slate-300">{variant.summary}</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              {variant.components.map((component) => (
                <li key={component.name}>
                  {component.name}: {component.ratio}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div id="doe" className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">DOE / Lab</h2>
          <button className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200">
            Generate DOE (12 runs)
          </button>
        </div>
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Run</th>
              <th>W/G</th>
              <th>RDP%</th>
              <th>Rheology%</th>
              <th>WaterRetention%</th>
              <th>BasaltFiber%</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index}>
                <td>{String.fromCharCode(65 + index)}</td>
                <td>0.36</td>
                <td>1.1</td>
                <td>0.12</td>
                <td>0.07</td>
                <td>0.2</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div id="qc" className="card">
        <h2 className="text-lg font-semibold text-white">QC Plan</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          <li>Incoming gypsum moisture check (≤ 0.5%).</li>
          <li>Batch density verification.</li>
          <li>Adhesion pull-off ≥ {mockProject.constraints.min_pull_off_mpa} MPa.</li>
        </ul>
      </div>

      <div id="sop" className="card">
        <h2 className="text-lg font-semibold text-white">SOP</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Prepare dry blend in mixer for 90 seconds.</li>
          <li>Add water gradually until target rheology achieved.</li>
          <li>Apply 8-10 mm layer and finish within 25 minutes.</li>
        </ol>
      </div>

      <div id="economics" className="card">
        <h2 className="text-lg font-semibold text-white">Economics</h2>
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-300">
          <div>
            <p className="text-xs uppercase text-slate-500">Cost per ton</p>
            <p className="text-lg text-white">${mockProject.economics.cost_per_ton}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Margin</p>
            <p className="text-lg text-white">{mockProject.economics.margin_pct}%</p>
          </div>
        </div>
      </div>

      <div id="documents" className="card">
        <h2 className="text-lg font-semibold text-white">Documents</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          <li>SOP Export (PDF)</li>
          <li>QC Plan Export (PDF)</li>
          <li>Passport Export (PDF)</li>
        </ul>
      </div>

      <div id="images" className="card">
        <h2 className="text-lg font-semibold text-white">Images</h2>
        <p className="mt-2 text-sm text-slate-400">
          Generate application scene, cross section, texture tile for each variant.
        </p>
      </div>
    </section>
  );
}
