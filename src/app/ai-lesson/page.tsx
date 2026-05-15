import Link from 'next/link';
import type { AILessonAudience } from '@/lib/types';

type LessonStatus = 'ready' | 'generating';

type MockLesson = {
  id: string;
  audience: AILessonAudience;
  title: string;
  duration: number;
  sceneCount: number;
  status: LessonStatus;
};

const MOCK_LESSONS: MockLesson[] = [
  { id: '1', audience: 'child', title: 'Ойи китоб ўқияпти', duration: 20, sceneCount: 5, status: 'ready' },
  { id: '2', audience: 'child', title: 'Ада мошина ҳайдаяпти', duration: 15, sceneCount: 4, status: 'ready' },
  { id: '3', audience: 'parent', title: 'Как провести занятие по называнию', duration: 25, sceneCount: 6, status: 'ready' },
  { id: '4', audience: 'parent', title: 'Подсказки и подкрепление', duration: 30, sceneCount: 7, status: 'generating' },
  { id: '5', audience: 'specialist', title: 'ABA: выбор из 3 карточек', duration: 20, sceneCount: 5, status: 'ready' },
  { id: '6', audience: 'specialist', title: 'Работа с отказами', duration: 25, sceneCount: 6, status: 'ready' },
];

const AUDIENCE_CONFIG: Record<AILessonAudience, { label: string; color: string; icon: string }> = {
  child: { label: 'Для ребёнка', color: 'bg-purple-500/15 text-purple-300', icon: '🧒' },
  parent: { label: 'Для родителя', color: 'bg-blue-500/15 text-blue-300', icon: '👨‍👩‍👧' },
  specialist: { label: 'Для специалиста', color: 'bg-green-500/15 text-green-300', icon: '👩‍⚕️' },
};

const ALL_TABS = [
  { key: 'all', label: 'Все' },
  { key: 'child', label: 'Для ребёнка' },
  { key: 'parent', label: 'Для родителя' },
  { key: 'specialist', label: 'Для специалиста' },
];

export default function AILessonsPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">AI-уроки</h1>
          <p className="mt-1 text-slate-400">15–30-секундные видеоуроки, созданные ИИ</p>
        </div>
        <Link
          href="/ai-lesson/create"
          className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
        >
          + Создать AI-урок
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {ALL_TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:border-slate-600 first:border-emerald-500/40 first:bg-emerald-500/10 first:text-emerald-200"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {MOCK_LESSONS.map(lesson => {
          const audienceInfo = AUDIENCE_CONFIG[lesson.audience];
          return (
            <div key={lesson.id} className="card flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${audienceInfo.color}`}>
                      <span>{audienceInfo.icon}</span>
                      <span>{audienceInfo.label}</span>
                    </span>
                    <span className="text-xs text-slate-500">{lesson.duration} сек</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white leading-snug">{lesson.title}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">{lesson.sceneCount} сцен</p>
                </div>
                <div className="shrink-0">
                  {lesson.status === 'ready' ? (
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                      Готов
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                      Генерируется...
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <button
                  type="button"
                  disabled={lesson.status !== 'ready'}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
                    lesson.status === 'ready'
                      ? 'border border-slate-700 text-slate-300 hover:border-slate-600'
                      : 'border border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  Предпросмотр
                </button>
                <button
                  type="button"
                  disabled={lesson.status !== 'ready'}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
                    lesson.status === 'ready'
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Использовать
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
