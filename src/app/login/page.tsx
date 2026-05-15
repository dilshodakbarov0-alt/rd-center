'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/lib/types';
import { ROLE_HOME } from '@/lib/roles';

const ROLES: Array<{ role: UserRole; label: string; desc: string; icon: string; color: string }> = [
  { role: 'parent', label: 'Родитель', desc: 'Провожу занятия дома с ребёнком', icon: '👨‍👩‍👧', color: 'border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10' },
  { role: 'specialist', label: 'Специалист', desc: 'Логопед, дефектолог, терапевт', icon: '👩‍⚕️', color: 'border-green-500/40 bg-green-500/5 hover:bg-green-500/10' },
  { role: 'methodologist', label: 'Методист', desc: 'Разрабатываю методические материалы', icon: '📚', color: 'border-purple-500/40 bg-purple-500/5 hover:bg-purple-500/10' },
  { role: 'admin', label: 'Администратор', desc: 'Управление платформой', icon: '⚙️', color: 'border-red-500/40 bg-red-500/5 hover:bg-red-500/10' },
];

const SELECTED_COLORS: Record<UserRole, string> = {
  parent: 'border-blue-400 bg-blue-500/15 ring-2 ring-blue-400/30',
  specialist: 'border-green-400 bg-green-500/15 ring-2 ring-green-400/30',
  methodologist: 'border-purple-400 bg-purple-500/15 ring-2 ring-purple-400/30',
  admin: 'border-red-400 bg-red-500/15 ring-2 ring-red-400/30',
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    router.push(ROLE_HOME[selectedRole]);
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center gap-8 py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-3xl font-bold text-white shadow-lg shadow-emerald-900/30">
          ✦
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Bolajon AI Rivoj</h1>
          <p className="text-sm text-emerald-400">Адаптивная ИИ-платформа</p>
        </div>
      </div>

      <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl backdrop-blur">
        <h2 className="mb-6 text-lg font-semibold text-white">Войдите в систему</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Я вхожу как</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setSelectedRole(r.role)}
                  className={`flex flex-col gap-1 rounded-xl border p-3 text-left transition-all ${
                    selectedRole === r.role ? SELECTED_COLORS[r.role] : r.color + ' border-slate-700'
                  }`}
                >
                  <span className="text-lg leading-none">{r.icon}</span>
                  <span className="text-sm font-semibold text-white">{r.label}</span>
                  <span className="text-xs text-slate-400">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 active:bg-emerald-600"
          >
            Войти
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-sm text-slate-500">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-emerald-400 hover:text-emerald-300">
              Зарегистрируйтесь
            </Link>
          </p>
        </div>
      </div>

      <p className="max-w-sm text-center text-xs text-slate-600">
        Нажимая «Войти», вы соглашаетесь с обработкой персональных данных согласно{' '}
        <Link href="/settings/privacy" className="text-slate-400 hover:underline">
          политике конфиденциальности
        </Link>
        . Данные детей хранятся в зашифрованном виде.
      </p>
    </div>
  );
}
