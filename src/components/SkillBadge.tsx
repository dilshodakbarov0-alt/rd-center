type SkillLevel = 0 | 1 | 2 | 3;

type SkillBadgeProps = {
  level: SkillLevel;
};

const LEVEL_CONFIG: Record<SkillLevel, { label: string; className: string }> = {
  0: { label: "Не начато", className: "bg-slate-700/50 text-slate-400" },
  1: { label: "Появляется", className: "bg-sky-500/15 text-sky-300" },
  2: { label: "С подсказкой", className: "bg-yellow-500/15 text-yellow-300" },
  3: { label: "Независимый", className: "bg-emerald-500/15 text-emerald-300" },
};

export const SkillBadge = ({ level }: SkillBadgeProps) => {
  const config = LEVEL_CONFIG[level];
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
};
