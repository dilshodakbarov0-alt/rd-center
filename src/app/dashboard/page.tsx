import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { getPageDictionary } from "@/lib/page-helpers";
import { Baby, Camera, ChartBar, BookOpen, Play, Plus } from "lucide-react";

export default async function DashboardPage() {
  const { dictionary } = await getPageDictionary();

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Сегодня, 15 мая 2026</p>
          <h1 className="text-3xl font-semibold text-white">{dictionary["dashboard.title"]}</h1>
          <p className="mt-1 text-slate-400">{dictionary["dashboard.subtitle"]}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3">
            <p className="text-xs text-slate-400">{dictionary["children.speech_level"]}</p>
            <p className="text-sm font-semibold text-emerald-200">Акмал · Уровень 1</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title={dictionary["progress.sessions_done"]}
          value="12"
          icon={<BookOpen className="text-emerald-400" size={28} />}
        />
        <StatCard
          title={dictionary["progress.independent_rate"]}
          value="68%"
          icon={<ChartBar className="text-sky-400" size={28} />}
        />
        <StatCard
          title={dictionary["progress.cards_mastered"]}
          value="24"
          icon={<Baby className="text-violet-400" size={28} />}
        />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">{dictionary["dashboard.today_plan"]}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="badge mb-2">Речевой модуль</span>
                <h3 className="text-base font-semibold text-white">Кто это?</h3>
                <p className="mt-1 text-sm text-slate-400">Выбор из 2 карточек · 10 попыток</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <BookOpen size={18} />
              </div>
            </div>
            <Link
              href="/sessions/demo"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              <Play size={16} />
              {dictionary["session.start"]}
            </Link>
          </div>

          <div className="card space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-200 mb-2">
                  Карточки
                </span>
                <h3 className="text-base font-semibold text-white">Что делает?</h3>
                <p className="mt-1 text-sm text-slate-400">Называние · 8 попыток</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                <Camera size={18} />
              </div>
            </div>
            <Link
              href="/sessions/demo"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-200 transition-colors hover:bg-sky-500/20"
            >
              <Play size={16} />
              {dictionary["session.start"]}
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Быстрые действия</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/children/new"
            className="card flex items-center gap-4 transition-colors hover:border-emerald-800"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Plus size={20} />
            </div>
            <div>
              <p className="font-semibold text-white">{dictionary["children.add"]}</p>
              <p className="text-xs text-slate-400">Новый профиль</p>
            </div>
          </Link>

          <Link
            href="/cards"
            className="card flex items-center gap-4 transition-colors hover:border-sky-800"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
              <Camera size={20} />
            </div>
            <div>
              <p className="font-semibold text-white">{dictionary["cards.upload_photo"]}</p>
              <p className="text-xs text-slate-400">ИИ создаст карточку</p>
            </div>
          </Link>

          <Link
            href="/progress"
            className="card flex items-center gap-4 transition-colors hover:border-violet-800"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
              <ChartBar size={20} />
            </div>
            <div>
              <p className="font-semibold text-white">Посмотреть прогресс</p>
              <p className="text-xs text-slate-400">Отчёт и навыки</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
