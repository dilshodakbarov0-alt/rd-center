import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n";

type HeaderProps = {
  locale: Locale;
  dictionary: Record<string, string>;
};

export const Header = ({ locale, dictionary }: HeaderProps) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-lg font-bold text-emerald-200">
            R&D
          </div>
          <div>
            <p className="text-sm text-slate-400">{dictionary["app.name"]}</p>
            <p className="text-xs text-slate-500">Construction Materials Lab</p>
          </div>
        </div>
        <nav className="flex items-center gap-4 text-sm text-slate-200">
          <Link className="hover:text-emerald-200" href="/dashboard">
            {dictionary["nav.dashboard"]}
          </Link>
          <Link className="hover:text-emerald-200" href="/components">
            {dictionary["nav.components"]}
          </Link>
          <Link className="hover:text-emerald-200" href="/prices">
            {dictionary["nav.prices"]}
          </Link>
          <Link className="hover:text-emerald-200" href="/templates">
            {dictionary["nav.templates"]}
          </Link>
          <Link className="hover:text-emerald-200" href="/settings">
            {dictionary["nav.settings"]}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher initialLocale={locale} />
          <Link
            href="/login"
            className="rounded-lg border border-emerald-500/40 px-3 py-2 text-xs font-semibold text-emerald-200"
          >
            {dictionary["nav.login"]}
          </Link>
        </div>
      </div>
    </header>
  );
};
