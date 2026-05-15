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
  person: 'border-blue-400',
  object: 'border-green-400',
  action: 'border-orange-400',
  emotion: 'border-yellow-400',
  place: 'border-purple-400',
};

const CATEGORY_ICON_BG: Record<string, string> = {
  person: 'bg-blue-100 text-blue-500',
  object: 'bg-green-100 text-green-500',
  action: 'bg-orange-100 text-orange-500',
  emotion: 'bg-yellow-100 text-yellow-500',
  place: 'bg-purple-100 text-purple-500',
};

const CATEGORY_LABEL_COLOR: Record<string, string> = {
  person: 'text-blue-600',
  object: 'text-green-600',
  action: 'text-orange-600',
  emotion: 'text-yellow-600',
  place: 'text-purple-600',
};

const SIZE_CONFIG = {
  sm: {
    card: 'w-[120px]',
    image: 'h-[90px]',
    icon: 'h-12 w-12 text-2xl',
    label: 'text-sm',
    sub: 'text-xs',
    padding: 'p-2',
    border: 'border-3',
    rounded: 'rounded-xl',
  },
  md: {
    card: 'w-[160px]',
    image: 'h-[120px]',
    icon: 'h-16 w-16 text-3xl',
    label: 'text-base',
    sub: 'text-xs',
    padding: 'p-3',
    border: 'border-4',
    rounded: 'rounded-2xl',
  },
  lg: {
    card: 'w-[220px]',
    image: 'h-[160px]',
    icon: 'h-24 w-24 text-5xl',
    label: 'text-xl',
    sub: 'text-sm',
    padding: 'p-4',
    border: 'border-4',
    rounded: 'rounded-3xl',
  },
};

// Simple SVG placeholder icon per category
const CategoryIcon = ({ category, className }: { category: string; className: string }) => {
  if (category === 'person') {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={className}>
        <circle cx="32" cy="20" r="12" fill="currentColor" opacity="0.8" />
        <path d="M8 56c0-13.255 10.745-24 24-24s24 10.745 24 24" fill="currentColor" opacity="0.6" />
      </svg>
    );
  }
  if (category === 'object') {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={className}>
        <rect x="12" y="20" width="40" height="30" rx="4" fill="currentColor" opacity="0.8" />
        <rect x="22" y="12" width="20" height="12" rx="3" fill="currentColor" opacity="0.5" />
      </svg>
    );
  }
  if (category === 'action') {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={className}>
        <circle cx="32" cy="16" r="8" fill="currentColor" opacity="0.8" />
        <path d="M20 32l12-8 12 8v16H20V32z" fill="currentColor" opacity="0.7" />
        <path d="M26 48v-10h12v10" fill="currentColor" opacity="0.5" />
        <path d="M14 40l6-12M50 40l-6-12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      </svg>
    );
  }
  if (category === 'place') {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={className}>
        <path d="M32 8L8 28h6v24h36V28h6L32 8z" fill="currentColor" opacity="0.7" />
        <rect x="24" y="38" width="16" height="14" rx="2" fill="white" opacity="0.6" />
      </svg>
    );
  }
  // default / emotion
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="22" fill="currentColor" opacity="0.7" />
      <circle cx="24" cy="26" r="3" fill="white" />
      <circle cx="40" cy="26" r="3" fill="white" />
      <path d="M22 40 Q32 50 42 40" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
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
  const cfg = SIZE_CONFIG[size];
  const borderColor = CATEGORY_BORDER[category] ?? 'border-slate-300';
  const iconBg = CATEGORY_ICON_BG[category] ?? 'bg-slate-100 text-slate-500';
  const labelColor = CATEGORY_LABEL_COLOR[category] ?? 'text-slate-700';

  const isInteractive = !!onClick;

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
      {/* Image area */}
      <div className={`flex w-full items-center justify-center ${cfg.image} overflow-hidden rounded-xl bg-amber-50`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className={`flex items-center justify-center rounded-full ${iconBg} ${cfg.icon}`}>
            <CategoryIcon category={category} className="h-full w-full p-2" />
          </div>
        )}
      </div>

      {/* Label */}
      <div className="mt-2 w-full text-center">
        <p className={`font-bold leading-tight ${cfg.label} text-slate-800`}>{label}</p>
        {labelSecondary && (
          <p className={`mt-0.5 ${cfg.sub} ${labelColor} font-medium`}>{labelSecondary}</p>
        )}
      </div>
    </button>
  );
};
