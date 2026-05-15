type FlashCardProps = {
  label: string;
  labelSecondary?: string;
  category?: string;
  imageUrl?: string;
  colorIndex?: number;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  selected?: boolean;
};

const BG_COLORS = [
  "bg-emerald-700/60",
  "bg-teal-700/60",
  "bg-sky-700/60",
  "bg-violet-700/60",
  "bg-cyan-700/60",
  "bg-indigo-700/60",
  "bg-green-700/60",
  "bg-blue-700/60",
];

const TEXT_COLORS = [
  "text-emerald-100",
  "text-teal-100",
  "text-sky-100",
  "text-violet-100",
  "text-cyan-100",
  "text-indigo-100",
  "text-green-100",
  "text-blue-100",
];

const SIZE_CLASSES = {
  sm: { card: "min-h-[100px] rounded-xl p-3", text: "text-base", sub: "text-xs" },
  md: { card: "min-h-[140px] rounded-2xl p-4", text: "text-lg", sub: "text-sm" },
  lg: { card: "min-h-[200px] rounded-2xl p-6", text: "text-2xl", sub: "text-base" },
};

export const FlashCard = ({
  label,
  labelSecondary,
  category,
  imageUrl,
  colorIndex = 0,
  size = "md",
  onClick,
  selected,
}: FlashCardProps) => {
  const idx = colorIndex % 8;
  const bg = BG_COLORS[idx];
  const textColor = TEXT_COLORS[idx];
  const sizes = SIZE_CLASSES[size];
  const initial = label.charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 ${sizes.card} ${bg} border-2 transition-all w-full cursor-pointer
        ${selected
          ? "border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/20"
          : "border-transparent hover:border-slate-600"
        }
        ${onClick ? "active:scale-95" : "cursor-default"}
      `}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={label} className="h-16 w-16 rounded-lg object-cover" />
      ) : (
        <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-black/20 ${textColor} text-2xl font-bold`}>
          {initial}
        </div>
      )}
      <span className={`font-bold ${textColor} ${sizes.text} text-center leading-tight`}>{label}</span>
      {labelSecondary && (
        <span className={`${textColor} opacity-70 ${sizes.sub} text-center`}>{labelSecondary}</span>
      )}
      {category && (
        <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs text-white/60">{category}</span>
      )}
    </button>
  );
};
