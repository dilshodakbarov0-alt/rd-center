'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FlashCard } from '@/components/FlashCard';
import { EmotionCard } from '@/components/EmotionCard';
import type { GameType, TrialOutcome } from '@/lib/types';

type Trial = { outcome: TrialOutcome };

const TOTAL_TRIALS = 10;

const GAME_TITLES: Record<string, { ru: string; uz: string; vbmapp: string }> = {
  show_correct: { ru: 'Покажи правильно', uz: "To'g'ri ko'rsat", vbmapp: 'VB-MAPP Уровень 1 — Понимание речи' },
  build_phrase: { ru: 'Собери фразу', uz: 'Ibora tuz', vbmapp: 'VB-MAPP Уровень 2 — Фразовая речь' },
  who_does_what: { ru: 'Ким нима қиляпти?', uz: 'Kim nima qilyapti?', vbmapp: 'VB-MAPP Уровень 2 — Понимание действий' },
  repeat_after_me: { ru: 'Повтори за мной', uz: 'Menga ergash', vbmapp: 'VB-MAPP Уровень 1 — Подражание' },
  find_same: { ru: 'Найди такой же', uz: 'Shunday topib ber', vbmapp: 'VB-MAPP Уровень 1 — Внимание' },
  sort_groups: { ru: 'Разложи по группам', uz: "Guruhlarga ajrat", vbmapp: 'VB-MAPP Уровень 2 — Категории' },
  wash_hands: { ru: 'Моем руки', uz: "Qo'l yuvamiz", vbmapp: 'VB-MAPP Уровень 1 — Быт' },
  come_here: { ru: 'Иди сюда', uz: 'Bu yerga kel', vbmapp: 'VB-MAPP Уровень 1 — Безопасность' },
  emotions: { ru: 'Эмоции', uz: "His-tuyg'ular", vbmapp: 'VB-MAPP Уровень 1 — Эмоции' },
  social_story: { ru: 'Социальная история', uz: 'Ijtimoiy hikoya', vbmapp: 'VB-MAPP Уровень 3 — Социальные навыки' },
};

const WASH_STEPS = [
  { icon: '🚰', text: 'Открыть кран' },
  { icon: '💧', text: 'Намочить руки' },
  { icon: '🧴', text: 'Взять мыло' },
  { icon: '🤲', text: 'Намылить руки' },
  { icon: '🔄', text: 'Потереть 20 секунд' },
  { icon: '💧', text: 'Смыть мыло' },
  { icon: '🪣', text: 'Вытереть полотенцем' },
];

const SOCIAL_SCENES = [
  { icon: '🏫', text: 'Иди в садик' },
  { icon: '🧥', text: 'Раздеться' },
  { icon: '🚪', text: 'Найти свой шкафчик' },
  { icon: '🪑', text: 'Сесть на место' },
  { icon: '👋', text: 'Поздороваться' },
];

const PHRASE_WORDS = ['Ойи', 'китоб', 'ўқияпти'];

function GameHeader({ gameType }: { gameType: string }) {
  const info = GAME_TITLES[gameType] ?? GAME_TITLES['show_correct'];
  return (
    <div>
      <Link href="/games" className="text-sm text-slate-500 hover:text-slate-300">← Игры</Link>
      <h1 className="mt-1 text-xl font-bold text-white">{info.ru}</h1>
      <p className="text-xs text-slate-500">{info.vbmapp}</p>
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>Попытка {current} из {total}</span>
        <span>{Math.round((current / total) * 100)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function OutcomeButtons({ onRecord }: { onRecord: (outcome: TrialOutcome) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {([
        { outcome: 'independent' as TrialOutcome, label: 'Самостоятельно', color: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' },
        { outcome: 'prompted' as TrialOutcome, label: 'С подсказкой', color: 'bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30' },
        { outcome: 'error' as TrialOutcome, label: 'Ошибка', color: 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30' },
        { outcome: 'refusal' as TrialOutcome, label: 'Отказ', color: 'bg-slate-700 text-slate-300 hover:bg-slate-600' },
      ]).map(btn => (
        <button
          key={btn.outcome}
          type="button"
          onClick={() => onRecord(btn.outcome)}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${btn.color}`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

function CompletionScreen({ trials }: { trials: Trial[] }) {
  const independent = trials.filter(t => t.outcome === 'independent').length;
  const rate = Math.round((independent / trials.length) * 100);
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="text-5xl">🎉</div>
      <div>
        <h2 className="text-2xl font-bold text-white">Молодец!</h2>
        <p className="mt-1 text-slate-400">Занятие завершено</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-800/50 px-4 py-3 text-center">
          <p className="text-xl font-bold text-white">{trials.length}</p>
          <p className="text-xs text-slate-500">Попыток</p>
        </div>
        <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-center">
          <p className="text-xl font-bold text-emerald-300">{rate}%</p>
          <p className="text-xs text-slate-500">Самостоятельно</p>
        </div>
        <div className="rounded-xl bg-slate-800/50 px-4 py-3 text-center">
          <p className="text-xl font-bold text-white">{independent}</p>
          <p className="text-xs text-slate-500">Правильно</p>
        </div>
      </div>
      {rate >= 80 && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-300">
          ✦ Отлично! Рекомендую усложнить на следующем занятии.
        </div>
      )}
      {rate < 60 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">
          ⚠ Продолжайте упражнение. Увеличьте паузу перед подсказкой.
        </div>
      )}
      <div className="flex gap-3">
        <Link href="/games" className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:border-slate-600">
          К играм
        </Link>
        <Link href="/sessions/new" className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
          Новое занятие
        </Link>
      </div>
    </div>
  );
}

export default function GamePage({ params }: { params: { type: string } }) {
  const gameType = params.type as GameType;
  const [trials, setTrials] = useState<Trial[]>([]);
  const [phraseSelected, setPhraseSelected] = useState<string[]>([]);
  const [washStep, setWashStep] = useState(0);
  const [socialStep, setSocialStep] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const currentTrial = trials.length + 1;
  const isComplete = trials.length >= TOTAL_TRIALS;

  function recordOutcome(outcome: TrialOutcome) {
    setTrials(prev => [...prev, { outcome }]);
  }

  if (isComplete) {
    return (
      <section className="mx-auto max-w-lg space-y-6">
        <GameHeader gameType={gameType} />
        <div className="card">
          <CompletionScreen trials={trials} />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <GameHeader gameType={gameType} />
      <ProgressBar current={currentTrial} total={TOTAL_TRIALS} />

      {gameType === 'show_correct' && (
        <div className="card space-y-6">
          <div className="text-center">
            <p className="text-lg font-bold text-white">Ойини кўрсат!</p>
            <p className="text-sm text-slate-400">Покажи маму</p>
          </div>
          <div className="flex justify-center gap-6 flex-wrap">
            <FlashCard label="Ойи" labelSecondary="мама" category="person" size="lg" onClick={() => recordOutcome('independent')} />
            <FlashCard label="Ада" labelSecondary="папа" category="person" size="lg" onClick={() => recordOutcome('error')} />
          </div>
          <OutcomeButtons onRecord={recordOutcome} />
        </div>
      )}

      {gameType === 'build_phrase' && (
        <div className="card space-y-6">
          <div className="min-h-12 rounded-xl border-2 border-dashed border-slate-600 p-3 text-center">
            {phraseSelected.length === 0 ? (
              <span className="text-slate-600 text-sm">Нажимай слова по порядку...</span>
            ) : (
              <span className="text-lg font-bold text-white">{phraseSelected.join(' ')}</span>
            )}
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            {PHRASE_WORDS.map(word => (
              <button
                key={word}
                type="button"
                onClick={() => setPhraseSelected(prev => [...prev, word])}
                className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-base font-bold text-white transition-all hover:bg-emerald-500/20 active:scale-95"
              >
                {word}
              </button>
            ))}
          </div>
          {phraseSelected.length > 0 && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPhraseSelected([])}
                className="flex-1 rounded-lg border border-slate-700 py-2 text-xs font-semibold text-slate-400 hover:border-slate-600"
              >
                Сбросить
              </button>
              <button
                type="button"
                onClick={() => { setPhraseSelected([]); recordOutcome('independent'); }}
                className="flex-1 rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Проверить
              </button>
            </div>
          )}
          <OutcomeButtons onRecord={recordOutcome} />
        </div>
      )}

      {gameType === 'emotions' && (
        <div className="card space-y-6">
          <div className="text-center">
            <p className="text-lg font-bold text-white">Бу қандай ҳис?</p>
            <p className="text-sm text-slate-400">Покажи: счастлив</p>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <EmotionCard emotion="happy" size="lg" selected={selectedEmotion === 'happy'} onClick={() => { setSelectedEmotion('happy'); recordOutcome('independent'); }} />
            <EmotionCard emotion="sad" size="lg" selected={selectedEmotion === 'sad'} onClick={() => { setSelectedEmotion('sad'); recordOutcome('error'); }} />
            <EmotionCard emotion="angry" size="lg" selected={selectedEmotion === 'angry'} onClick={() => { setSelectedEmotion('angry'); recordOutcome('error'); }} />
          </div>
          <OutcomeButtons onRecord={recordOutcome} />
        </div>
      )}

      {gameType === 'wash_hands' && (
        <div className="card space-y-6">
          <div className="text-center">
            <p className="text-sm text-slate-400">Шаг {washStep + 1} из {WASH_STEPS.length}</p>
          </div>
          <div className="space-y-2">
            {WASH_STEPS.map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                  i < washStep ? 'bg-emerald-500/10 opacity-60' : i === washStep ? 'bg-slate-800 ring-1 ring-emerald-500/30' : 'bg-slate-900/50 opacity-40'
                }`}
              >
                <span className="text-xl">{i < washStep ? '✅' : s.icon}</span>
                <span className={`text-sm font-semibold ${i < washStep ? 'text-emerald-300' : i === washStep ? 'text-white' : 'text-slate-600'}`}>
                  {s.text}
                </span>
              </div>
            ))}
          </div>
          {washStep < WASH_STEPS.length && (
            <button
              type="button"
              onClick={() => {
                if (washStep < WASH_STEPS.length - 1) {
                  setWashStep(prev => prev + 1);
                } else {
                  setWashStep(0);
                  recordOutcome('independent');
                }
              }}
              className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Готово ✓
            </button>
          )}
        </div>
      )}

      {gameType === 'social_story' && (
        <div className="card space-y-6">
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-1">Что будет дальше?</p>
            <p className="text-sm font-semibold text-slate-400">
              Сцена {socialStep + 1} из {SOCIAL_SCENES.length}
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-slate-800 text-6xl">
              {SOCIAL_SCENES[socialStep].icon}
            </div>
            <p className="text-xl font-bold text-white">{SOCIAL_SCENES[socialStep].text}</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                if (socialStep < SOCIAL_SCENES.length - 1) {
                  setSocialStep(prev => prev + 1);
                } else {
                  setSocialStep(0);
                  recordOutcome('independent');
                }
              }}
              className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Следующий шаг →
            </button>
          </div>
          <OutcomeButtons onRecord={recordOutcome} />
        </div>
      )}

      {gameType === 'who_does_what' && (
        <div className="card space-y-6">
          <div className="text-center">
            <p className="text-lg font-bold text-white">Ким нима қиляпти?</p>
            <p className="text-sm text-slate-400">Ойи нима қиляпти?</p>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <FlashCard label="Ойи ўқияпти" labelSecondary="мама читает" category="action" size="md" onClick={() => recordOutcome('independent')} />
            <FlashCard label="Ойи еяпти" labelSecondary="мама ест" category="action" size="md" onClick={() => recordOutcome('error')} />
            <FlashCard label="Ойи ухлаяпти" labelSecondary="мама спит" category="action" size="md" onClick={() => recordOutcome('error')} />
          </div>
          <OutcomeButtons onRecord={recordOutcome} />
        </div>
      )}

      {gameType === 'repeat_after_me' && (
        <div className="card space-y-6">
          <div className="text-center">
            <p className="text-lg font-bold text-white">Повтори за мной!</p>
            <p className="text-sm text-slate-400">Скажи: «Ойи»</p>
          </div>
          <div className="flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-slate-800 text-5xl animate-bounce-in">
              👩
            </div>
          </div>
          <p className="text-center text-2xl font-bold text-emerald-300">«Ойи»</p>
          <OutcomeButtons onRecord={recordOutcome} />
        </div>
      )}

      {gameType === 'find_same' && (
        <div className="card space-y-6">
          <div className="text-center">
            <p className="text-lg font-bold text-white">Найди такой же!</p>
          </div>
          <div className="flex justify-center">
            <FlashCard label="Китоб" labelSecondary="книга" category="object" size="lg" />
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <FlashCard label="Китоб" labelSecondary="книга" category="object" size="md" onClick={() => recordOutcome('independent')} />
            <FlashCard label="Мяч" labelSecondary="мяч" category="object" size="md" onClick={() => recordOutcome('error')} />
            <FlashCard label="Чашка" labelSecondary="чашка" category="object" size="md" onClick={() => recordOutcome('error')} />
          </div>
          <OutcomeButtons onRecord={recordOutcome} />
        </div>
      )}

      {gameType === 'sort_groups' && (
        <div className="card space-y-6">
          <div className="text-center">
            <p className="text-lg font-bold text-white">Разложи по группам</p>
            <p className="text-sm text-slate-400">Это еда или игрушка?</p>
          </div>
          <div className="flex justify-center">
            <FlashCard label="Яблоко" labelSecondary="apple" category="object" size="lg" />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => recordOutcome('independent')}
              className="flex-1 rounded-xl border-2 border-emerald-500/40 bg-emerald-500/10 py-4 text-sm font-bold text-emerald-200 transition-colors hover:bg-emerald-500/20"
            >
              🍎 Еда
            </button>
            <button
              type="button"
              onClick={() => recordOutcome('error')}
              className="flex-1 rounded-xl border-2 border-slate-700 py-4 text-sm font-bold text-slate-300 transition-colors hover:border-slate-600"
            >
              🧸 Игрушка
            </button>
          </div>
          <OutcomeButtons onRecord={recordOutcome} />
        </div>
      )}

      {gameType === 'come_here' && (
        <div className="card space-y-6">
          <div className="text-center">
            <p className="text-lg font-bold text-white">Иди сюда!</p>
            <p className="text-2xl mt-3">🚶 →</p>
            <p className="mt-3 text-sm text-slate-400">Акмал, иди ко мне!</p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-xs text-amber-300">
              Встаньте в 2–3 метрах от ребёнка. Скажите «Иди сюда» и зафиксируйте реакцию.
            </p>
          </div>
          <OutcomeButtons onRecord={recordOutcome} />
        </div>
      )}
    </section>
  );
}
