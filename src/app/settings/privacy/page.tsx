'use client';
import { useState } from 'react';
import type { ConsentType } from '@/lib/types';

type ConsentConfig = {
  type: ConsentType;
  title: string;
  description: string;
  required: boolean;
};

const CONSENTS: ConsentConfig[] = [
  {
    type: 'data_processing',
    title: 'Обработка персональных данных',
    description: 'Хранение имени, возраста и профиля ребёнка. Обязательно для работы платформы.',
    required: true,
  },
  {
    type: 'photo_upload',
    title: 'Загрузка и AI-обработка фото',
    description: 'Фото семьи используются для создания персонажей. Оригиналы хранятся в зашифрованном виде и не публикуются.',
    required: false,
  },
  {
    type: 'video_upload',
    title: 'Загрузка и AI-анализ видео',
    description: 'Видео занятий анализируются ИИ для оценки методики. Видео не показываются другим пользователям.',
    required: false,
  },
  {
    type: 'external_ai',
    title: 'Использование внешних AI-моделей',
    description: 'ChatGPT, Claude, Gemini обрабатывают текстовые запросы. Фото и видео передаются только с отдельным согласием.',
    required: false,
  },
  {
    type: 'model_training',
    title: 'Использование данных для улучшения модели',
    description: 'Анонимизированные результаты занятий могут использоваться для улучшения платформы. Личные данные не передаются.',
    required: false,
  },
];

const AUDIT_ENTRIES = [
  { action: 'Загрузка фото', resource: 'family_members', time: '14 мая, 15:32' },
  { action: 'Согласие: AI-анализ видео', resource: 'consent_records', time: '12 мая, 11:00' },
  { action: 'Создание AI-урока', resource: 'ai_lessons', time: '10 мая, 14:15' },
  { action: 'Изменение профиля ребёнка', resource: 'children', time: '8 мая, 10:22' },
  { action: 'Вход в систему', resource: 'auth', time: '8 мая, 10:20' },
];

export default function PrivacySettingsPage() {
  const [consents, setConsents] = useState<Record<ConsentType, boolean>>({
    data_processing: true,
    photo_upload: true,
    video_upload: false,
    external_ai: true,
    model_training: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function toggleConsent(type: ConsentType) {
    if (type === 'data_processing') return;
    setConsents(prev => ({ ...prev, [type]: !prev[type] }));
  }

  return (
    <section className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Конфиденциальность</h1>
        <p className="mt-1 text-slate-400">Управление согласиями и данными</p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Мои согласия</h2>
        <div className="space-y-3">
          {CONSENTS.map(consent => (
            <div
              key={consent.type}
              className={`rounded-xl border p-4 ${consents[consent.type] ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-slate-700 bg-slate-900/30'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">{consent.title}</h3>
                    {consent.required && (
                      <span className="rounded-full bg-slate-700/70 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                        Обязательно
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{consent.description}</p>
                </div>
                <div className="shrink-0">
                  {consent.required ? (
                    <div className="flex h-5 w-9 items-center justify-center rounded-full bg-emerald-500/30">
                      <span className="text-[10px] text-emerald-400">🔒</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleConsent(consent.type)}
                      className={`relative h-5 w-9 rounded-full transition-colors ${consents[consent.type] ? 'bg-emerald-500' : 'bg-slate-600'}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${consents[consent.type] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Удаление данных</h2>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="w-full rounded-xl border border-slate-700 px-4 py-3 text-left text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600"
          >
            Удалить профиль ребёнка...
          </button>
          <button
            type="button"
            className="w-full rounded-xl border border-slate-700 px-4 py-3 text-left text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600"
          >
            Удалить все фото
          </button>
          <button
            type="button"
            className="w-full rounded-xl border border-slate-700 px-4 py-3 text-left text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600"
          >
            Удалить все видео
          </button>
          <button
            type="button"
            className="w-full rounded-xl border border-red-500/30 px-4 py-3 text-left text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10"
          >
            Удалить мой аккаунт
          </button>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Журнал действий</h2>
        <div className="space-y-2">
          {AUDIT_ENTRIES.map((entry, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-800/30 px-3 py-2.5">
              <div className="h-1.5 w-1.5 mt-1.5 shrink-0 rounded-full bg-slate-600"></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white">{entry.action}</p>
                <p className="text-[10px] text-slate-500">{entry.resource}</p>
              </div>
              <span className="shrink-0 text-[10px] text-slate-600">{entry.time}</span>
            </div>
          ))}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-white">Удалить профиль ребёнка?</h3>
            <p className="mt-2 text-sm text-slate-400">
              Все данные, карточки, сессии и прогресс будут удалены безвозвратно.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm font-semibold text-slate-300 hover:border-slate-600"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-400"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
