type FlashCardCategory = 'person' | 'object' | 'action' | 'emotion' | 'place';

type FlashCardProps = {
  label: string;
  labelSecondary?: string;
  category?: FlashCardCategory | string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  selected?: boolean;
};

const CATEGORY_BORDER: Record<string, string> = {
  person:  'border-blue-400',
  object:  'border-green-400',
  action:  'border-orange-400',
  emotion: 'border-yellow-400',
  place:   'border-purple-400',
};

const CATEGORY_ICON_BG: Record<string, string> = {
  person:  'bg-blue-50 text-blue-400',
  object:  'bg-green-50 text-green-500',
  action:  'bg-orange-50 text-orange-500',
  emotion: 'bg-yellow-50 text-yellow-500',
  place:   'bg-purple-50 text-purple-500',
};

const CATEGORY_LABEL_COLOR: Record<string, string> = {
  person:  'text-blue-600',
  object:  'text-green-600',
  action:  'text-orange-600',
  emotion: 'text-yellow-600',
  place:   'text-purple-600',
};

const SIZE_CONFIG = {
  sm: {
    card:    'w-[120px]',
    image:   'h-[90px]',
    icon:    'h-12 w-12',
    label:   'text-sm',
    sub:     'text-[11px]',
    padding: 'p-2',
    border:  'border-[3px]',
    rounded: 'rounded-xl',
    imgRounded: 'rounded-lg',
  },
  md: {
    card:    'w-[160px]',
    image:   'h-[120px]',
    icon:    'h-16 w-16',
    label:   'text-base',
    sub:     'text-xs',
    padding: 'p-3',
    border:  'border-4',
    rounded: 'rounded-2xl',
    imgRounded: 'rounded-xl',
  },
  lg: {
    card:    'w-[220px]',
    image:   'h-[160px]',
    icon:    'h-24 w-24',
    label:   'text-xl',
    sub:     'text-sm',
    padding: 'p-4',
    border:  'border-4',
    rounded: 'rounded-3xl',
    imgRounded: 'rounded-2xl',
  },
};

/**
 * Simple SVG placeholder illustrations — one per category.
 * Clean lines, educational flashcard style.
 */
const PersonIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
    {/* Head */}
    <circle cx="32" cy="18" r="11" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2" />
    {/* Eyes */}
    <circle cx="27.5" cy="17" r="2" fill="#1D4ED8" />
    <circle cx="36.5" cy="17" r="2" fill="#1D4ED8" />
    {/* Smile */}
    <path d="M27 22 Q32 27 37 22" stroke="#1D4ED8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    {/* Body / shoulders */}
    <path d="M14 56 C14 42 18 36 32 36 C46 36 50 42 50 56" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="2" />
    {/* Neck */}
    <rect x="28" y="28" width="8" height="9" rx="3" fill="#93C5FD" />
  </svg>
);

const ObjectIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
    {/* Cup / mug shape */}
    <rect x="14" y="22" width="30" height="28" rx="5" fill="#A7F3D0" stroke="#10B981" strokeWidth="2" />
    {/* Handle */}
    <path d="M44 30 Q56 30 56 38 Q56 46 44 46" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Steam lines */}
    <path d="M22 17 Q24 12 22 8" stroke="#34D399" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M30 15 Q32 10 30 6" stroke="#34D399" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M38 17 Q40 12 38 8" stroke="#34D399" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const ActionIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
    {/* Running figure */}
    {/* Head */}
    <circle cx="38" cy="12" r="7" fill="#FED7AA" stroke="#F97316" strokeWidth="1.8" />
    {/* Body */}
    <path d="M38 19 L34 34" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
    {/* Left arm (back) */}
    <path d="M36 24 L24 20" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
    {/* Right arm (forward) */}
    <path d="M36 24 L44 18" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
    {/* Left leg (forward) */}
    <path d="M34 34 L22 44 L20 54" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Right leg (back) */}
    <path d="M34 34 L42 44 L46 54" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Motion lines */}
    <path d="M14 26 L8 26" stroke="#FED7AA" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 32 L10 32" stroke="#FED7AA" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 38 L12 38" stroke="#FED7AA" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const EmotionIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
    <circle cx="32" cy="32" r="26" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
    {/* Eyes */}
    <ellipse cx="23" cy="26" rx="4" ry="3.5" fill="#1F2937" />
    <ellipse cx="41" cy="26" rx="4" ry="3.5" fill="#1F2937" />
    {/* Smile */}
    <path d="M20 40 Q32 52 44 40" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Cheeks */}
    <circle cx="17" cy="37" r="5" fill="#FCA5A5" opacity="0.55" />
    <circle cx="47" cy="37" r="5" fill="#FCA5A5" opacity="0.55" />
  </svg>
);

const PlaceIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
    {/* House roof */}
    <path d="M32 6 L6 30 H12 V56 H52 V30 H58 Z" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round" />
    {/* Door */}
    <rect x="24" y="38" width="16" height="18" rx="3" fill="#7C3AED" opacity="0.7" />
    {/* Window left */}
    <rect x="13" y="32" width="10" height="10" rx="2" fill="white" stroke="#7C3AED" strokeWidth="1.5" />
    {/* Window right */}
    <rect x="41" y="32" width="10" height="10" rx="2" fill="white" stroke="#7C3AED" strokeWidth="1.5" />
  </svg>
);

const ICON_MAP: Record<string, React.ComponentType<{ className: string }>> = {
  person:  PersonIcon,
  object:  ObjectIcon,
  action:  ActionIcon,
  emotion: EmotionIcon,
  place:   PlaceIcon,
};

export const FlashCard = ({
  label,
  labelSecondary,
  category = 'object',
  imageUrl,
  size = 'md',
  onClick,
  selected,
}: FlashCardProps) => {
  const cfg         = SIZE_CONFIG[size as keyof typeof SIZE_CONFIG] ?? SIZE_CONFIG.md;
  const borderColor = CATEGORY_BORDER[category] ?? 'border-slate-300';
  const iconBg      = CATEGORY_ICON_BG[category] ?? 'bg-slate-50 text-slate-400';
  const labelColor  = CATEGORY_LABEL_COLOR[category] ?? 'text-slate-600';
  const isInteractive = !!onClick;

  const IconComponent = ICON_MAP[category] ?? ObjectIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isInteractive}
      className={[
        'flex flex-col items-center bg-white',
        cfg.card,
        cfg.rounded,
        cfg.padding,
        cfg.border,
        borderColor,
        'transition-all duration-150',
        selected
          ? 'ring-4 ring-emerald-400 scale-105 shadow-xl shadow-emerald-300/30'
          : isInteractive
          ? 'hover:scale-[1.02] hover:shadow-lg cursor-pointer active:scale-95'
          : 'cursor-default',
        size === 'lg' ? 'drop-shadow-xl' : 'shadow-md',
      ].join(' ')}
    >
      {/* Image / illustration area */}
      <div
        className={[
          'flex w-full items-center justify-center overflow-hidden',
          cfg.image,
          cfg.imgRounded,
          'bg-amber-50',
        ].join(' ')}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className={`flex items-center justify-center rounded-full ${iconBg} ${cfg.icon}`}>
            <IconComponent className="h-full w-full p-2" />
          </div>
        )}
      </div>

      {/* Label area */}
      <div className="mt-2 w-full text-center">
        <p className={`font-bold leading-tight ${cfg.label} text-slate-800`}>{label}</p>
        {labelSecondary && (
          <p className={`mt-0.5 font-medium ${cfg.sub} ${labelColor}`}>{labelSecondary}</p>
        )}
      </div>
    </button>
  );
};
