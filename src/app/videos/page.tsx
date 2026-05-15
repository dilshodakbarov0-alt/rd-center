'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { VideoAnalysisStatus } from '@/lib/types';

type VideoRecord = {
  id: string;
  title: string;
  date: string;
  duration: string;
  uploaderRole: 'parent' | 'specialist';
  status: VideoAnalysisStatus;
};

const MOCK_VIDEOS: VideoRecord[] = [
  { id: '1', title: 'Называние членов семьи', date: '14 мая', duration: '3:20', uploaderRole: 'parent', status: 'complete' },
  { id: '2', title: 'Мытьё рук — пошагово', date: '12 мая', duration: '2:45', uploaderRole: 'specialist', status: 'complete' },
  { id: '3', title: 'Выбор из 2 карточек', date: '11 мая', duration: '4:10', uploaderRole: 'parent', status: 'analyzing' },
  { id: '4', title: 'Сборка фразы', date: '9 мая', duration: '2:30', uploaderRole: 'specialist', status: 'queued' },
  { id: '5', title: 'Домашнее занятие, 8 мая', date: '8 мая', duration: '5:00', uploaderRole: 'parent', status: 'uploading' },
];

const STATUS_LABELS: Record<VideoAnalysisStatus, { label: string; color: string; icon: string }> = {
  complete: { label: 'Анализ завершён', color: 'text-emerald-300 bg-emerald-500/10', icon: '✓' },
  analyzing: { label: 'Анализируется', color: 'text-amber-300 bg-amber-500/10', icon: '⟳' },
  queued: { label: 'В очереди', color: 'text-slate-400 bg-slate-700/50', icon: '○' },
  uploading: { label: 'Новое — нажмите для анализа', color: 'text-sky-300 bg-sky-500/10', icon: '▶' },
  failed: { label: 'Ошибка', color: 'text-red-300 bg-red-500/10', icon: '✗' },
};

export default function VideosPage() {
  const [uploaderRole, setUploaderRole] = useState<'parent' | 'specialist'>('parent');
  const [consentGiven, setConsentGiven] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Видео занятий</h1>
        <p className="mt-1 text-slate-400">Загрузите видео для AI-анализа методики</p>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔒</span>
          <div>
            <p className="text-sm font-semibold text-amber-300">Ваши видео приватны</p>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Ваши видео видите только вы и прикреплённый специалист. Видео не показываются другим
              пользователям. ИИ анализирует только методику урока — не личные данные.
            </p>
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-white">Загрузить видео занятия</h2>

        <label
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
            dragOver ? 'border-emerald-400 bg-emerald-500/10' : 'border-slate-600 hover:border-slate-500'
          }`}
        >
          <span className="text-4xl mb-3">📹</span>
          <p className="text-sm font-semibold text-white">Загрузите видео занятия</p>
          <p className="mt-1 text-xs text-slate-500">MP4, MOV до 500 МБ · перетащите или кликните</p>
          <input type="file" accept="video/*" className="sr-only" />
        </label>

        <div className="grid gap-3 sm:grid-cols-2 text-xs text-slate-400">
          <div className="rounded-lg bg-slate-800/50 p-3">
            <p className="font-semibold text-slate-300 mb-1">📱 Домашнее занятие</p>
            <p>Видео, которое вы записали дома самостоятельно</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-3">
            <p className="font-semibold text-slate-300 mb-1">👩‍⚕️ Занятие специалиста</p>
            <p>Видео, которое прислал специалист</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Кто проводил занятие?</p>
          <div className="flex gap-2">
            {(['parent', 'specialist'] as const).map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setUploaderRole(role)}
                className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${
                  uploaderRole === role
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {role === 'parent' ? 'Родитель' : 'Специалист'}
              </button>
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={() => setConsentGiven(!consentGiven)}
            className="mt-0.5 accent-emerald-500"
          />
          <span className="text-xs text-slate-400 leading-relaxed">
            Я даю согласие на AI-анализ методики этого видео. Видео не показывается другим пользователям.
          </span>
        </label>

        <button
          type="button"
          disabled={!consentGiven}
          className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            consentGiven
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Загрузить и анализировать
        </button>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Мои видео</h2>
        <div className="space-y-3">
          {MOCK_VIDEOS.map(video => {
            const statusInfo = STATUS_LABELS[video.status];
            return (
              <div key={video.id} className="card flex items-center gap-4">
                <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-2xl">
                  ▶
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-white text-sm">{video.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      video.uploaderRole === 'specialist'
                        ? 'bg-green-500/10 text-green-300'
                        : 'bg-blue-500/10 text-blue-300'
                    }`}>
                      {video.uploaderRole === 'specialist' ? 'Специалист' : 'Родитель'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{video.date} · {video.duration}</p>
                </div>

                <div className="shrink-0 text-right space-y-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.color}`}>
                    <span>{statusInfo.icon}</span>
                    <span>{statusInfo.label}</span>
                  </span>
                  {video.status === 'complete' && (
                    <div>
                      <Link
                        href={`/videos/${video.id}/analysis`}
                        className="block text-xs text-emerald-400 hover:underline"
                      >
                        Смотреть анализ →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
