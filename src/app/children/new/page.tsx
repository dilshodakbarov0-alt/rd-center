"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Baby } from "lucide-react";

type Step = 1 | 2 | 3 | 4;

type FormData = {
  name: string;
  birthdate: string;
  language: string;
  diagnosis: string;
  speechLevel: number;
  answers: Record<string, string>;
};

const QUESTIONS = [
  {
    group: "Понимание речи",
    items: [
      { key: "responds_to_name", label: "Откликается на имя" },
      { key: "follows_simple_instructions", label: "Выполняет простые инструкции" },
      { key: "chooses_from_2_cards", label: "Выбирает из 2 карточек" },
    ],
  },
  {
    group: "Экспрессивная речь",
    items: [
      { key: "produces_sounds", label: "Произносит звуки/слоги" },
      { key: "says_words", label: "Говорит отдельные слова" },
      { key: "builds_2_word_phrase", label: "Строит фразу из 2 слов" },
    ],
  },
  {
    group: "Коммуникация",
    items: [
      { key: "points_gesture", label: "Указывает жестом" },
      { key: "asks_for_help", label: "Просит о помощи" },
      { key: "eye_contact", label: "Смотрит в глаза" },
    ],
  },
  {
    group: "Сенсорика",
    items: [
      { key: "sensitive_to_sounds", label: "Чувствителен к звукам" },
      { key: "touch_issues", label: "Трудно с прикосновениями" },
      { key: "reacts_to_bright_light", label: "Реагирует на яркий свет" },
    ],
  },
];

const ANSWER_OPTS = [
  { value: "yes", label: "Да", color: "border-emerald-500 bg-emerald-500/15 text-emerald-200" },
  { value: "sometimes", label: "Иногда", color: "border-yellow-500 bg-yellow-500/15 text-yellow-200" },
  { value: "no", label: "Нет", color: "border-red-500 bg-red-500/15 text-red-200" },
  { value: "unknown", label: "Не знаю", color: "border-slate-500 bg-slate-500/15 text-slate-300" },
];

const SPEECH_LEVELS = [
  { level: 0, label: "Уровень 0 — Доречевой", desc: "Нет слов, только звуки или молчание" },
  { level: 1, label: "Уровень 1 — Отдельные звуки/слоги", desc: "Произносит ма, па, ба и т.д." },
  { level: 2, label: "Уровень 2 — Отдельные слова", desc: "10–50 слов, нет фраз" },
  { level: 3, label: "Уровень 3 — Простые фразы", desc: "2–3 слова: «дай воды», «хочу кушать»" },
  { level: 4, label: "Уровень 4 — Развёрнутая речь", desc: "Предложения, но трудности с диалогом" },
  { level: 5, label: "Уровень 5 — Развитая речь", desc: "Полноценный диалог" },
];

export default function NewChildPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    name: "",
    birthdate: "",
    language: "ru",
    diagnosis: "",
    speechLevel: 0,
    answers: {},
  });

  const totalQuestions = QUESTIONS.flatMap((g) => g.items).length;
  const answeredCount = Object.keys(form.answers).length;

  const setAnswer = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, answers: { ...prev.answers, [key]: value } }));
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Baby size={18} />
          </div>
          <h1 className="text-2xl font-semibold text-white">Новый профиль ребёнка</h1>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-emerald-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Шаг {step} из 4</p>
      </div>

      {step === 1 && (
        <div className="card space-y-5">
          <h2 className="text-lg font-semibold text-white">Основная информация</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Имя ребёнка</label>
              <input
                type="text"
                placeholder="Акмал"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Дата рождения</label>
              <input
                type="date"
                value={form.birthdate}
                onChange={(e) => setForm((p) => ({ ...p, birthdate: e.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Основной язык обучения</label>
              <select
                value={form.language}
                onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="ru">Русский</option>
                <option value="uz_cyr">Ўзбекча (кирилл)</option>
                <option value="uz_lat">O'zbekcha (lotin)</option>
                <option value="bilingual">Двуязычный</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card space-y-5">
          <h2 className="text-lg font-semibold text-white">Диагноз и уровень речи</h2>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Диагноз</label>
            <div className="grid grid-cols-2 gap-2">
              {["РАС", "ЗПРР", "ЗРР", "Другое"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, diagnosis: d }))}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                    form.diagnosis === d
                      ? "border-emerald-500 bg-emerald-500/15 text-emerald-200"
                      : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Уровень речи</label>
            <div className="space-y-2">
              {SPEECH_LEVELS.map(({ level, label, desc }) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, speechLevel: level }))}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                    form.speechLevel === level
                      ? "border-emerald-500 bg-emerald-500/15"
                      : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                  }`}
                >
                  <p className={`text-sm font-semibold ${form.speechLevel === level ? "text-emerald-200" : "text-white"}`}>
                    {label}
                  </p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Анкета ребёнка</h2>
            <span className="text-sm text-slate-400">{answeredCount}/{totalQuestions}</span>
          </div>
          {QUESTIONS.map((group) => (
            <div key={group.group} className="card space-y-4">
              <h3 className="text-sm font-semibold text-emerald-300">{group.group}</h3>
              {group.items.map((item) => (
                <div key={item.key}>
                  <p className="mb-2 text-sm text-slate-200">{item.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {ANSWER_OPTS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAnswer(item.key, opt.value)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                          form.answers[item.key] === opt.value
                            ? opt.color
                            : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="card space-y-6 text-center">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 size={44} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Профиль создан!</h2>
            <p className="mt-2 text-slate-400">
              ИИ подготовит первый план занятий для {form.name || "ребёнка"} на основе анкеты.
            </p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-left">
            <p className="text-xs font-semibold text-emerald-300">Рекомендация ИИ</p>
            <p className="mt-1 text-sm text-slate-300">
              Начать с упражнений «Выбор из 2 карточек» — персонажи из семьи (Ойи, Ада). Длительность: 5–7 минут.
            </p>
          </div>
          <Link
            href="/cards"
            className="block w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Перейти к карточкам
          </Link>
        </div>
      )}

      <div className="flex gap-3">
        {step > 1 && step < 4 && (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600"
          >
            Назад
          </button>
        )}
        {step < 3 && (
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) as Step)}
            className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Далее
          </button>
        )}
        {step === 3 && (
          <button
            type="button"
            onClick={() => setStep(4)}
            className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Сохранить
          </button>
        )}
      </div>
    </div>
  );
}
