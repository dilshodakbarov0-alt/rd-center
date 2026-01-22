import type { ReactNode } from "react";

export const StatCard = ({ title, value, icon }: { title: string; value: string; icon?: ReactNode }) => (
  <div className="card flex items-center justify-between gap-4">
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
    {icon}
  </div>
);
