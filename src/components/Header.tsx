import Link from "next/link";
import { Brain } from "lucide-react";
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
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Brain size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-200">{dictionary["app.name"]}</p>
            <p className="text-xs text-slate-500">{dictionary["app.subtitle"]}</p>
          </div>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <Link className="hover:text-emerald-200 transition-colors" href="/dashboard">
            {dictionary["nav.dashboard"]}
          </Link>
          <Link className="hover:text-emerald-200 transition-colors" href="/cards">
            {dictionary["nav.cards"]}
          </Link>
          <Link className="hover:text-emerald-200 transition-colors" href="/sessions">
            {dictionary["nav.sessions"]}
          </Link>
          <Link className="hover:text-emerald-200 transition-colors" href="/progress">
            {dictionary["nav.progress"]}
          </Link>
          <Link className="hover:text-emerald-200 transition-colors" href="/specialist">
            {dictionary["nav.specialist"]}
          </Link>
          <Link className="hover:text-emerald-200 transition-colors" href="/emotions">
            {dictionary["nav.emotions"] ?? "Эмоции"}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher initialLocale={locale} />
          <Link
            href="/child-mode"
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20 transition-colors"
          >
            {dictionary["nav.child_mode"]}
          </Link>
        </div>
      </div>
    </header>
  );
};
