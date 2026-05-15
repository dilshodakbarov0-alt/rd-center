'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROLE_NAV } from '@/lib/roles';
import type { UserRole } from '@/lib/types';

export function RoleNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const links = ROLE_NAV[role];
  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm">
      {links.map(link => (
        <Link
          key={link.key}
          href={link.href}
          className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
            pathname.startsWith(link.href) && link.href !== '/'
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {link.ru}
        </Link>
      ))}
    </nav>
  );
}
