"use client";

export type Emotion = 'happy' | 'sad' | 'angry' | 'scared' | 'tired' | 'proud' | 'sick';

type EmotionCardProps = {
  emotion: Emotion;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
  language?: 'ru' | 'uz';
};

const EMOTION_META: Record<
  Emotion,
  { labelRu: string; labelUz: string; bg: string; border: string; faceColor: string }
> = {
  happy: {
    labelRu: 'Счастлив',
    labelUz: 'Xursand',
    bg: 'bg-yellow-100',
    border: 'border-yellow-400',
    faceColor: '#FCD34D',
  },
  sad: {
    labelRu: 'Грустит',
    labelUz: 'Xafa',
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    faceColor: '#93C5FD',
  },
  angry: {
    labelRu: 'Злится',
    labelUz: "G'azablangan",
    bg: 'bg-red-100',
    border: 'border-red-400',
    faceColor: '#FCA5A5',
  },
  scared: {
    labelRu: 'Боится',
    labelUz: "Qo'rqqan",
    bg: 'bg-purple-100',
    border: 'border-purple-400',
    faceColor: '#C4B5FD',
  },
  tired: {
    labelRu: 'Устал',
    labelUz: 'Charchagan',
    bg: 'bg-gray-100',
    border: 'border-gray-400',
    faceColor: '#D1D5DB',
  },
  proud: {
    labelRu: 'Гордый',
    labelUz: "G'ururli",
    bg: 'bg-amber-100',
    border: 'border-amber-400',
    faceColor: '#FDE68A',
  },
  sick: {
    labelRu: 'Плохо',
    labelUz: 'Yomon',
    bg: 'bg-green-100',
    border: 'border-green-400',
    faceColor: '#A7F3D0',
  },
};

const SIZE_CONFIG = {
  sm: { card: 'w-[100px]', face: 60, text: 'text-xs', padding: 'p-2', border: 'border-3', rounded: 'rounded-xl' },
  md: { card: 'w-[140px]', face: 88, text: 'text-sm', padding: 'p-3', border: 'border-4', rounded: 'rounded-2xl' },
  lg: { card: 'w-[200px]', face: 128, text: 'text-base', padding: 'p-4', border: 'border-4', rounded: 'rounded-3xl' },
};

// SVG face components for each emotion
const HappyFace = ({ size }: { size: number }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  const eyeY = cy - r * 0.18;
  const eyeOffX = r * 0.3;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Face */}
      <circle cx={cx} cy={cy} r={r} fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
      {/* Eyes - half-closed happy */}
      <ellipse cx={cx - eyeOffX} cy={eyeY} rx={r * 0.12} ry={r * 0.09} fill="#1F2937" />
      <ellipse cx={cx + eyeOffX} cy={eyeY} rx={r * 0.12} ry={r * 0.09} fill="#1F2937" />
      {/* Smile */}
      <path
        d={`M ${cx - r * 0.35} ${cy + r * 0.1} Q ${cx} ${cy + r * 0.55} ${cx + r * 0.35} ${cy + r * 0.1}`}
        fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round"
      />
      {/* Cheeks */}
      <circle cx={cx - r * 0.42} cy={cy + r * 0.2} r={r * 0.12} fill="#FCA5A5" opacity="0.6" />
      <circle cx={cx + r * 0.42} cy={cy + r * 0.2} r={r * 0.12} fill="#FCA5A5" opacity="0.6" />
    </svg>
  );
};

const SadFace = ({ size }: { size: number }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  const eyeY = cy - r * 0.15;
  const eyeOffX = r * 0.3;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="#93C5FD" stroke="#60A5FA" strokeWidth="2" />
      {/* Eyes - drooping */}
      <ellipse cx={cx - eyeOffX} cy={eyeY} rx={r * 0.12} ry={r * 0.1} fill="#1F2937" />
      <ellipse cx={cx + eyeOffX} cy={eyeY} rx={r * 0.12} ry={r * 0.1} fill="#1F2937" />
      {/* Drooping upper eyelids */}
      <path d={`M ${cx - eyeOffX - r * 0.15} ${eyeY - r * 0.06} Q ${cx - eyeOffX} ${eyeY - r * 0.18} ${cx - eyeOffX + r * 0.15} ${eyeY - r * 0.06}`} fill="#93C5FD" opacity="0.8" />
      <path d={`M ${cx + eyeOffX - r * 0.15} ${eyeY - r * 0.06} Q ${cx + eyeOffX} ${eyeY - r * 0.18} ${cx + eyeOffX + r * 0.15} ${eyeY - r * 0.06}`} fill="#93C5FD" opacity="0.8" />
      {/* Sad eyebrows */}
      <path d={`M ${cx - eyeOffX - r * 0.18} ${eyeY - r * 0.3} Q ${cx - eyeOffX} ${eyeY - r * 0.22} ${cx - eyeOffX + r * 0.18} ${eyeY - r * 0.32}`} fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      <path d={`M ${cx + eyeOffX - r * 0.18} ${eyeY - r * 0.32} Q ${cx + eyeOffX} ${eyeY - r * 0.22} ${cx + eyeOffX + r * 0.18} ${eyeY - r * 0.3}`} fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      {/* Frown */}
      <path
        d={`M ${cx - r * 0.35} ${cy + r * 0.35} Q ${cx} ${cy + r * 0.15} ${cx + r * 0.35} ${cy + r * 0.35}`}
        fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round"
      />
      {/* Tear */}
      <ellipse cx={cx - eyeOffX + r * 0.04} cy={eyeY + r * 0.22} rx={r * 0.06} ry={r * 0.09} fill="#3B82F6" opacity="0.7" />
    </svg>
  );
};

const AngryFace = ({ size }: { size: number }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  const eyeY = cy - r * 0.12;
  const eyeOffX = r * 0.3;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="#FCA5A5" stroke="#F87171" strokeWidth="2" />
      {/* Eyes */}
      <ellipse cx={cx - eyeOffX} cy={eyeY} rx={r * 0.12} ry={r * 0.1} fill="#1F2937" />
      <ellipse cx={cx + eyeOffX} cy={eyeY} rx={r * 0.12} ry={r * 0.1} fill="#1F2937" />
      {/* Angry V-shaped eyebrows pointing inward */}
      <line x1={cx - eyeOffX - r * 0.2} y1={eyeY - r * 0.35} x2={cx - eyeOffX + r * 0.2} y2={eyeY - r * 0.16} stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx + eyeOffX + r * 0.2} y1={eyeY - r * 0.35} x2={cx + eyeOffX - r * 0.2} y2={eyeY - r * 0.16} stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
      {/* Straight/gritted mouth */}
      <line x1={cx - r * 0.3} y1={cy + r * 0.3} x2={cx + r * 0.3} y2={cy + r * 0.3} stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
      {/* Wrinkle on forehead */}
      <line x1={cx - r * 0.06} y1={cy - r * 0.55} x2={cx + r * 0.06} y2={cy - r * 0.35} stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

const ScaredFace = ({ size }: { size: number }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  const eyeY = cy - r * 0.15;
  const eyeOffX = r * 0.3;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="#C4B5FD" stroke="#A78BFA" strokeWidth="2" />
      {/* Wide open circle eyes */}
      <circle cx={cx - eyeOffX} cy={eyeY} r={r * 0.16} fill="white" stroke="#1F2937" strokeWidth="1.5" />
      <circle cx={cx + eyeOffX} cy={eyeY} r={r * 0.16} fill="white" stroke="#1F2937" strokeWidth="1.5" />
      <circle cx={cx - eyeOffX} cy={eyeY} r={r * 0.09} fill="#1F2937" />
      <circle cx={cx + eyeOffX} cy={eyeY} r={r * 0.09} fill="#1F2937" />
      {/* Raised eyebrows */}
      <path d={`M ${cx - eyeOffX - r * 0.18} ${eyeY - r * 0.36} Q ${cx - eyeOffX} ${eyeY - r * 0.45} ${cx - eyeOffX + r * 0.18} ${eyeY - r * 0.36}`} fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      <path d={`M ${cx + eyeOffX - r * 0.18} ${eyeY - r * 0.36} Q ${cx + eyeOffX} ${eyeY - r * 0.45} ${cx + eyeOffX + r * 0.18} ${eyeY - r * 0.36}`} fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      {/* Open mouth O */}
      <ellipse cx={cx} cy={cy + r * 0.3} rx={r * 0.18} ry={r * 0.14} fill="#1F2937" />
      <ellipse cx={cx} cy={cy + r * 0.28} rx={r * 0.12} ry={r * 0.09} fill="#7C3AED" />
    </svg>
  );
};

const TiredFace = ({ size }: { size: number }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  const eyeY = cy - r * 0.12;
  const eyeOffX = r * 0.3;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
      {/* Droopy eyelid eyes */}
      <ellipse cx={cx - eyeOffX} cy={eyeY} rx={r * 0.12} ry={r * 0.07} fill="#1F2937" />
      <ellipse cx={cx + eyeOffX} cy={eyeY} rx={r * 0.12} ry={r * 0.07} fill="#1F2937" />
      {/* Heavy drooping eyelids covering top half */}
      <path d={`M ${cx - eyeOffX - r * 0.15} ${eyeY} Q ${cx - eyeOffX} ${eyeY - r * 0.14} ${cx - eyeOffX + r * 0.15} ${eyeY}`} fill="#D1D5DB" />
      <path d={`M ${cx + eyeOffX - r * 0.15} ${eyeY} Q ${cx + eyeOffX} ${eyeY - r * 0.14} ${cx + eyeOffX + r * 0.15} ${eyeY}`} fill="#D1D5DB" />
      {/* Slight frown */}
      <path d={`M ${cx - r * 0.28} ${cy + r * 0.3} Q ${cx} ${cy + r * 0.22} ${cx + r * 0.28} ${cy + r * 0.3}`} fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
      {/* ZZZ */}
      <text x={cx + r * 0.35} y={cy - r * 0.5} fontSize={r * 0.22} fill="#9CA3AF" fontWeight="bold">z</text>
      <text x={cx + r * 0.48} y={cy - r * 0.66} fontSize={r * 0.18} fill="#9CA3AF" fontWeight="bold">z</text>
    </svg>
  );
};

const ProudFace = ({ size }: { size: number }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  const eyeY = cy - r * 0.15;
  const eyeOffX = r * 0.3;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
      {/* Eyes */}
      <ellipse cx={cx - eyeOffX} cy={eyeY} rx={r * 0.12} ry={r * 0.1} fill="#1F2937" />
      <ellipse cx={cx + eyeOffX} cy={eyeY} rx={r * 0.12} ry={r * 0.1} fill="#1F2937" />
      {/* Raised proud eyebrows */}
      <path d={`M ${cx - eyeOffX - r * 0.18} ${eyeY - r * 0.28} Q ${cx - eyeOffX} ${eyeY - r * 0.38} ${cx - eyeOffX + r * 0.18} ${eyeY - r * 0.28}`} fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" />
      <path d={`M ${cx + eyeOffX - r * 0.18} ${eyeY - r * 0.28} Q ${cx + eyeOffX} ${eyeY - r * 0.38} ${cx + eyeOffX + r * 0.18} ${eyeY - r * 0.28}`} fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" />
      {/* Slight proud upward smile */}
      <path d={`M ${cx - r * 0.32} ${cy + r * 0.16} Q ${cx} ${cy + r * 0.44} ${cx + r * 0.32} ${cy + r * 0.16}`} fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
      {/* Star decoration */}
      <text x={cx - r * 0.08} y={cy - r * 0.62} fontSize={r * 0.22} textAnchor="middle">⭐</text>
    </svg>
  );
};

const SickFace = ({ size }: { size: number }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  const eyeY = cy - r * 0.15;
  const eyeOffX = r * 0.3;
  const eyeSize = r * 0.12;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="#A7F3D0" stroke="#34D399" strokeWidth="2" />
      {/* X eyes */}
      <line x1={cx - eyeOffX - eyeSize} y1={eyeY - eyeSize} x2={cx - eyeOffX + eyeSize} y2={eyeY + eyeSize} stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx - eyeOffX + eyeSize} y1={eyeY - eyeSize} x2={cx - eyeOffX - eyeSize} y2={eyeY + eyeSize} stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx + eyeOffX - eyeSize} y1={eyeY - eyeSize} x2={cx + eyeOffX + eyeSize} y2={eyeY + eyeSize} stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx + eyeOffX + eyeSize} y1={eyeY - eyeSize} x2={cx + eyeOffX - eyeSize} y2={eyeY + eyeSize} stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
      {/* Wavy mouth */}
      <path
        d={`M ${cx - r * 0.35} ${cy + r * 0.28} Q ${cx - r * 0.18} ${cy + r * 0.18} ${cx} ${cy + r * 0.28} Q ${cx + r * 0.18} ${cy + r * 0.38} ${cx + r * 0.35} ${cy + r * 0.28}`}
        fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round"
      />
      {/* Green tint spots */}
      <circle cx={cx - r * 0.42} cy={cy + r * 0.18} r={r * 0.1} fill="#6EE7B7" opacity="0.6" />
      <circle cx={cx + r * 0.42} cy={cy + r * 0.18} r={r * 0.1} fill="#6EE7B7" opacity="0.6" />
    </svg>
  );
};

const FACE_COMPONENTS: Record<Emotion, React.ComponentType<{ size: number }>> = {
  happy: HappyFace,
  sad: SadFace,
  angry: AngryFace,
  scared: ScaredFace,
  tired: TiredFace,
  proud: ProudFace,
  sick: SickFace,
};

export const EmotionCard = ({
  emotion,
  size = 'md',
  selected,
  onClick,
  language = 'ru',
}: EmotionCardProps) => {
  const meta = EMOTION_META[emotion];
  const cfg = SIZE_CONFIG[size];
  const FaceComponent = FACE_COMPONENTS[emotion];
  const label = language === 'uz' ? meta.labelUz : meta.labelRu;
  const subLabel = language === 'uz' ? meta.labelRu : meta.labelUz;
  const isInteractive = !!onClick;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isInteractive}
      className={[
        'flex flex-col items-center',
        meta.bg,
        cfg.card,
        cfg.rounded,
        cfg.padding,
        cfg.border,
        meta.border,
        'transition-all duration-150',
        selected
          ? 'ring-4 ring-emerald-400 scale-105 shadow-xl'
          : isInteractive
          ? 'hover:scale-[1.02] hover:shadow-lg cursor-pointer active:scale-95'
          : 'cursor-default',
        'shadow-md',
      ].join(' ')}
    >
      <div className="flex w-full items-center justify-center py-1">
        <FaceComponent size={cfg.face} />
      </div>
      <div className="mt-2 text-center">
        <p className={`font-bold text-slate-800 ${cfg.text} leading-tight`}>{label}</p>
        <p className={`text-slate-500 ${cfg.text === 'text-xs' ? 'text-[10px]' : 'text-xs'} mt-0.5`}>{subLabel}</p>
      </div>
    </button>
  );
};
