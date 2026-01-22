export type DoeRun = {
  run: string;
  w_g: number;
  rdp_pct: number;
  rheology_pct: number;
  water_retention_pct: number;
  basalt_fiber_pct: number;
};

const base = {
  w_g: 0.36,
  rdp_pct: 1.1,
  rheology_pct: 0.12,
  water_retention_pct: 0.07,
  basalt_fiber_pct: 0.2,
};

export const generateDoePlan = (runs = 12): DoeRun[] => {
  return Array.from({ length: runs }).map((_, index) => {
    const delta = (index % 3) * 0.01;
    return {
      run: String.fromCharCode(65 + (index % 26)),
      w_g: Number((base.w_g + delta).toFixed(3)),
      rdp_pct: Number((base.rdp_pct + delta).toFixed(3)),
      rheology_pct: Number((base.rheology_pct + delta / 10).toFixed(3)),
      water_retention_pct: Number((base.water_retention_pct + delta / 10).toFixed(3)),
      basalt_fiber_pct: Number((base.basalt_fiber_pct + delta / 10).toFixed(3)),
    };
  });
};

export const suggestNextBestExperiment = (runs: DoeRun[]) => {
  const avgWg = runs.reduce((acc, run) => acc + run.w_g, 0) / runs.length;
  return {
    recommendation: "Increase W/G slightly to improve workability while monitoring pull-off strength.",
    suggested: {
      ...base,
      w_g: Number((avgWg + 0.01).toFixed(3)),
    },
  };
};
