import Link from 'next/link';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { RoleNav } from '@/components/RoleNav';

const ROLE_COLORS = {
  parent: 'bg-blue-500/20 text-blue-300',
  specialist: 'bg-green-500/20 text-green-300',
  methodologist: 'bg-purple-500/20 text-purple-300',
  admin: 'bg-red-500/20 text-red-300',
};
const ROLE_LABELS_RU = { parent: 'Родитель', specialist: 'Специалист', methodologist: 'Методист', admin: 'Администратор' };

export function Header({ locale, dictionary: _dictionary }: { locale: string; dictionary: Record<string, string> }) {
  const role = 'parent' as const;
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-lg font-bold shadow-lg shadow-emerald-900/30">
            ✦
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Bolajon</p>
            <p className="text-xs text-emerald-400 leading-none">AI Rivoj</p>
          </div>
        </Link>

        <span className={`hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLORS[role]}`}>
          {ROLE_LABELS_RU[role]}
        </span>

        <div className="flex-1 overflow-x-auto">
          <RoleNav role={role} />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher initialLocale={locale as 'ru' | 'uz'} />
          {role === 'parent' && (
            <button className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-emerald-500/40">
              Акмал ▾
            </button>
          )}
          <Link href="/login" className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-500">
            Выйти
          </Link>
        </div>
      </div>
    </header>
  );
}
