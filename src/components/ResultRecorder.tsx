"use client";

type Outcome = "independent" | "prompted" | "error" | "refusal" | "no_response";

type ResultRecorderProps = {
  onRecord: (outcome: Outcome) => void;
};

const OUTCOMES: { key: Outcome; label: string; color: string; dot: string }[] = [
  { key: "independent", label: "Самостоятельно", color: "border-emerald-500 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25", dot: "bg-emerald-400" },
  { key: "prompted", label: "С подсказкой", color: "border-yellow-500 bg-yellow-500/15 text-yellow-200 hover:bg-yellow-500/25", dot: "bg-yellow-400" },
  { key: "error", label: "Ошибка", color: "border-red-500 bg-red-500/15 text-red-200 hover:bg-red-500/25", dot: "bg-red-400" },
  { key: "refusal", label: "Отказ", color: "border-slate-500 bg-slate-500/15 text-slate-200 hover:bg-slate-500/25", dot: "bg-slate-400" },
  { key: "no_response", label: "Нет реакции", color: "border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-700/50", dot: "bg-slate-600" },
];

export const ResultRecorder = ({ onRecord }: ResultRecorderProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {OUTCOMES.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onRecord(o.key)}
          className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all active:scale-95 ${o.color}`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${o.dot}`} />
          {o.label}
        </button>
      ))}
    </div>
  );
};
