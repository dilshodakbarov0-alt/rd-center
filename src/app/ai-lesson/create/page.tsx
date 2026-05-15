'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { AILessonAudience } from '@/lib/types';

type Step = 1 | 2 | 3 | 4;

const AUDIENCE_OPTIONS: Array<{ value: AILessonAudience; label: string; desc: string; icon: string }> = [
  { value: 'child', label: 'Для ребёнка', desc: 'Короткий урок с персонажами', icon: '🧒' },
  { value: 'parent', label: 'Для родителя', desc: 'Как провести занятие дома', icon: '👨‍👩‍👧' },
  { value: 'specialist', label: 'Для специалиста', desc: 'Методические рекомендации', icon: '👩‍⚕️' },
];

const TOPICS = [
  'Называние членов семьи', 'Действия', 'Предметы', 'Эмоции',
  'Бытовые навыки', 'Безопасность', 'Социальная история',
];

const DURATIONS = [15, 20, 30];

const LANGUAGES = ['Узбекский', 'Русский', 'Оба'];

const GENERATION_STEPS = [
  'Анализируем профиль ребёнка...',
  'Подбираем методику...',
  'Создаём сценарий урока...',
  'Проверяем безопасность...',
  'Генерируем озвучку...',
];

const SCENE_ICONS: Record<string, string> = {
  card_show: '🃏',
  action_scene: '🎬',
  question: '❓',
  praise: '⭐',
};

const MOCK_SCENES = [
  { type: 'card_show', text: 'Бу ойи', voiceover: 'Бу ойи', duration: 3 },
  { type: 'card_show', text: 'Бу китоб', voiceover: 'Бу китоб', duration: 3 },
  { type: 'action_scene', text: 'Ойи китоб ўқияпти', voiceover: 'Ойи китоб ўқияпти', duration: 5 },
  { type: 'question', text: 'Ким китоб ўқияпти?', voiceover: '', duration: 5 },
  { type: 'praise', text: 'Жуда яхши! Баракалла!', voiceover: 'Жуда яхши!', duration: 4 },
];

export default function CreateAILessonPage() {
  const [step, setStep] = useState<Step>(1);
  const [audience, setAudience] = useState<AILessonAudience>('child');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [duration, setDuration] = useState(20);
  const [language, setLanguage] = useState('Узбекский');
  const [useOy, setUseOy] = useState(true);
  const [useAda, setUseAda] = useState(true);
  const [genStep, setGenStep] = useState(0);
  const [toast, setToast] = useState('');

  function startGeneration() {
    setStep(3);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setGenStep(i);
      if (i >= GENERATION_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => setStep(4), 500);
      }
    }, 600);
  }

  function handleCreateVideo() {
    setToast('Генерация видео занимает 2–3 минуты. Вы получите уведомление.');
    setTimeout(() => setToast(''), 4000);
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ai-lesson" className="text-sm text-slate-500 hover:text-slate-300">← AI-уроки</Link>
        <h1 className="text-xl font-bold text-white">Создать AI-урок</h1>
      </div>

      <div className="flex gap-2">
        {([1, 2, 3, 4] as Step[]).map(s => (
          <div
            key={s}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              step === s
                ? 'bg-emerald-500 text-slate-950'
                : step > s
                ? 'bg-emerald-500/30 text-emerald-300'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            {step > s ? '✓' : s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card space-y-6">
          <h2 className="text-base font-semibold text-white">Шаг 1 — Параметры урока</h2>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Для кого?</p>
            <div className="grid grid-cols-3 gap-2">
              {AUDIENCE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAudience(opt.value)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-all ${
                    audience === opt.value
                      ? 'border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/30'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-xs font-semibold text-white">{opt.label}</span>
                  <span className="text-[10px] text-slate-500 text-center">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Тема урока</label>
            <select
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none"
            >
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Уровень речи ребёнка</label>
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-300">
              Уровень 2 — отдельные слова (текущий профиль Акмала)
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Длительность</p>
            <div className="flex gap-2">
              {DURATIONS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${
                    duration === d
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {d} сек
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Язык</p>
            <div className="flex gap-2">
              {LANGUAGES.map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanguage(l)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${
                    language === l
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Далее →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card space-y-6">
          <h2 className="text-base font-semibold text-white">Шаг 2 — Персонажи и карточки</h2>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Использовать персонажей?</p>
            <div className="space-y-2">
              {[{ key: 'oy', label: 'Ойи (мама)', state: useOy, set: setUseOy }, { key: 'ada', label: 'Ада (папа)', state: useAda, set: setUseAda }].map(ch => (
                <label key={ch.key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 p-3 hover:border-slate-600">
                  <input
                    type="checkbox"
                    checked={ch.state}
                    onChange={() => ch.set(!ch.state)}
                    className="accent-emerald-500"
                  />
                  <span className="text-sm text-white">{ch.label}</span>
                  <span className="ml-auto text-xs text-emerald-400">✓ Персонаж готов</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Дополнительные карточки</p>
            <div className="flex flex-wrap gap-2">
              {['Китоб', 'Мяч', 'Чашка', 'Машина', 'Ложка', 'Яблоко'].map(card => (
                <button
                  key={card}
                  type="button"
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
                >
                  {card}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm font-semibold text-slate-300 hover:border-slate-600"
            >
              ← Назад
            </button>
            <button
              type="button"
              onClick={startGeneration}
              className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Создать урок →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card space-y-6">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-3xl font-bold text-white animate-pulse">
                ✦
              </div>
            </div>
            <h2 className="text-lg font-semibold text-white">ИИ создаёт сценарий...</h2>
          </div>

          <div className="space-y-3">
            {GENERATION_STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i < genStep ? 'bg-emerald-500 text-white' : i === genStep ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-500'
                }`}>
                  {i < genStep ? '✓' : i === genStep ? '⟳' : '○'}
                </div>
                <span className={`text-sm transition-colors ${i < genStep ? 'text-emerald-300' : i === genStep ? 'text-white' : 'text-slate-600'}`}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="card space-y-6">
          <h2 className="text-base font-semibold text-white">Шаг 4 — Предпросмотр сценария</h2>

          <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-3 text-xs text-slate-300">
            <p className="font-semibold text-white mb-1">Ойи китоб ўқияпти · 20 сек · 5 сцен</p>
            <p className="text-slate-500">Аудитория: {audience} · Уровень речи 2 · {language}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Сцены</p>
            {MOCK_SCENES.map((scene, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-700 p-3">
                <span className="text-lg">{SCENE_ICONS[scene.type] ?? '📄'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{scene.text}</p>
                  {scene.voiceover && <p className="text-xs text-slate-500 mt-0.5">Озвучка: «{scene.voiceover}»</p>}
                </div>
                <span className="shrink-0 text-xs text-slate-600">{scene.duration}с</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Озвучка (полный текст)</p>
            <div className="rounded-lg bg-slate-800/50 p-3 text-xs text-slate-300 leading-relaxed font-mono">
              Бу ойи. Бу китоб. Ойи китоб ўқияпти. [3 сек пауза] Жуда яхши! Баракалла!
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
            <span className="text-emerald-400">✓</span>
            <p className="text-xs text-emerald-300">Проверено — нет персональных данных, нет медицинских советов</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCreateVideo}
              className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Создать видео
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm font-semibold text-slate-300 hover:border-slate-600"
            >
              Сохранить сценарий
            </button>
          </div>

          {toast && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              {toast}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
