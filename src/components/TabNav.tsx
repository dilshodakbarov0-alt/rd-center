import Link from "next/link";

export type Tab = {
  name: string;
  href: string;
  active?: boolean;
};

export const TabNav = ({ tabs }: { tabs: Tab[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.href}
          className={`rounded-full px-4 py-2 text-xs font-semibold ${
            tab.active
              ? "bg-emerald-500/20 text-emerald-200"
              : "border border-slate-800 text-slate-300 hover:border-emerald-500/30"
          }`}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
};
