"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Home, Shield, Zap, Heart, CheckCircle2 } from "lucide-react";
import { FlashCard } from "@/components/FlashCard";

type Step = 1 | 2 | 3 | 4;

const MODULES = [
  { key: "speech", label: "Речевой модуль", desc: "Ким? Нима? Нима қиляпти?", icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/30" },
  { key: "daily_skills", label: "Бытовые навыки", desc: "Еда, одевание, гигиена", icon: Home, color: "text-sky-400", bg: "bg-sky-500/20 border-sky-500/30" },
  { key: "safety", label: "Безопасность", desc: "Откликается на имя, стоп", icon: Shield, color: "text-red-400", bg: "bg-red-500/20 border-red-500/30" },
  { key: "sensory", label: "Сенсорика", desc: "Сортировка, текстуры", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/20 border-amber-500/30" },
  { key: "emotions", label: "Эмоции", desc: "Рад, грустный, испуганный", icon: Heart, color: "text-violet-400", bg: "bg-violet-500/20 border-violet-500/30" },
];

const EXERCISE_TYPES = [
  { key: "choose_1of2", label: "Выбор из 2 карточек", desc: "Покажи где…", level: "0+" },
  { key: "choose_1of3", label: "Выбор из 3 карточек", desc: "Покажи где…", level: "1+" },
  { key: "name_card", label: "Назови карточку", desc: "Кто это?", level: "2+" },
  { key: "build_phrase", label: "Построй фразу", desc: "Скажи: Ойи кушает", level: "3+" },
  { key: "answer_question", label: "Ответь на вопрос", desc: "Что делает мама?", level: "4+" },
];

const AVAILABLE_CARDS = [
  { id: "c1", label: "Ойи (мама)", labelSecondary: "Oyi", colorIndex: 0 },
  { id: "c2", label: "Ада (папа)", labelSecondary: "Ota", colorIndex: 1 },
  { id: "c3", label: "Буви (бабушка)", labelSecondary: "Buvi", colorIndex: 2 },
  { id: "c4", label: "Кошка", labelSecondary: "Mushuk", colorIndex: 3 },
  { id: "c5", label: "Мячик", labelSecondary: "To'p", colorIndex: 4 },
  { id: "c6", label: "Чашка", labelSecondary: "Piyola", colorIndex: 5 },
];

export default function NewSessionPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const toggleCard = (id: string) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-white">Новое занятие</h1>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-emerald-500" : "bg-slate-700"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Шаг {step} из 4</p>
      </div>

      {step === 1 && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-white">Выберите ребёнка</h2>
          <button
            type="button"
            className="w-full rounded-xl border-2 border-emerald-500 bg-emerald-500/10 px-5 py-4 text-left transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Акмал</p>
                <p className="text-sm text-slate-400">4 года · РАС · Уровень речи 1</p>
              </div>
              <CheckCircle2 className="text-emerald-400" size={20} />
            </div>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Выберите модуль</h2>
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.key}
                type="button"
                onClick={() => setSelectedModule(mod.key)}
                className={`w-full rounded-xl border px-5 py-4 text-left transition-all ${
                  selectedModule === mod.key
                    ? `${mod.bg} border-current`
                    : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/20 ${mod.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className={`font-semibold ${selectedModule === mod.key ? mod.color : "text-white"}`}>
                      {mod.label}
                    </p>
                    <p className="text-sm text-slate-400">{mod.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Тип упражнения</h2>
          <p className="text-sm text-slate-400">Уровень речи Акмала: 1. Рекомендуется: Выбор из 2 карточек.</p>
          {EXERCISE_TYPES.map((ex) => (
            <button
              key={ex.key}
              type="button"
              onClick={() => setSelectedExercise(ex.key)}
              className={`w-full rounded-xl border px-5 py-4 text-left transition-all ${
                selectedExercise === ex.key
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-semibold ${selectedExercise === ex.key ? "text-emerald-200" : "text-white"}`}>
                    {ex.label}
                  </p>
                  <p className="text-sm text-slate-400">{ex.desc}</p>
                </div>
                <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-xs text-slate-400">
                  Ур. {ex.level}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Выберите карточки</h2>
            <span className="text-sm text-slate-400">{selectedCards.length} выбрано</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {AVAILABLE_CARDS.map((card) => (
              <FlashCard
                key={card.id}
                label={card.label}
                labelSecondary={card.labelSecondary}

                size="sm"
                selected={selectedCards.includes(card.id)}
                onClick={() => toggleCard(card.id)}
              />
            ))}
          </div>
          {selectedCards.length >= 2 && (
            <Link
              href="/sessions/demo"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              Начать занятие
            </Link>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600"
          >
            Назад
          </button>
        )}
        {step < 4 && (
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) as Step)}
            disabled={step === 2 && !selectedModule || step === 3 && !selectedExercise}
            className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Далее
          </button>
        )}
      </div>
    </div>
  );
}
