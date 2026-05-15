"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, X } from "lucide-react";

const EXERCISES = [
  {
    id: "e1",
    instruction: "Покажи, где ОЙМА",
    correctId: "c1",
    cards: [
      { id: "c1", label: "ОЙМА", sub: "Oyi", colorIndex: 0, bg: "bg-emerald-700" },
      { id: "c2", label: "ОТА", sub: "Ota", colorIndex: 1, bg: "bg-teal-700" },
    ],
  },
  {
    id: "e2",
    instruction: "Покажи, где ОТА",
    correctId: "c2",
    cards: [
      { id: "c2", label: "ОТА", sub: "Ota", colorIndex: 1, bg: "bg-teal-700" },
      { id: "c3", label: "БУВИ", sub: "Buvi", colorIndex: 2, bg: "bg-sky-700" },
    ],
  },
  {
    id: "e3",
    instruction: "Покажи, где БУВИ",
    correctId: "c3",
    cards: [
      { id: "c1", label: "ОЙМА", sub: "Oyi", colorIndex: 0, bg: "bg-emerald-700" },
      { id: "c3", label: "БУВИ", sub: "Buvi", colorIndex: 2, bg: "bg-sky-700" },
    ],
  },
  {
    id: "e4",
    instruction: "Покажи, где ОЙМА",
    correctId: "c1",
    cards: [
      { id: "c3", label: "БУВИ", sub: "Buvi", colorIndex: 2, bg: "bg-sky-700" },
      { id: "c1", label: "ОЙМА", sub: "Oyi", colorIndex: 0, bg: "bg-emerald-700" },
    ],
  },
  {
    id: "e5",
    instruction: "Покажи, где ОТА",
    correctId: "c2",
    cards: [
      { id: "c2", label: "ОТА", sub: "Ota", colorIndex: 1, bg: "bg-teal-700" },
      { id: "c1", label: "ОЙМА", sub: "Oyi", colorIndex: 0, bg: "bg-emerald-700" },
    ],
  },
];

type Feedback = "correct" | "wrong" | null;

export default function ChildModePage() {
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [done, setDone] = useState(false);

  const exercise = EXERCISES[current];

  const handleTap = (cardId: string) => {
    if (feedback) return;
    const isCorrect = cardId === exercise.correctId;
    setFeedback(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      setFeedback(null);
      if (isCorrect) {
        if (current + 1 >= EXERCISES.length) {
          setDone(true);
        } else {
          setCurrent((c) => c + 1);
        }
      }
    }, 1500);
  };

  if (done) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 text-center">
        <div className="space-y-3">
          <p className="text-7xl">🌟🌟🌟</p>
          <h1 className="text-4xl font-bold text-white">Молодец, Акмал!</h1>
          <p className="text-xl text-slate-400">Ты справился со всеми заданиями!</p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-bold text-slate-950 transition-colors hover:bg-emerald-400"
        >
          Готово!
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] select-none">
      <button
        type="button"
        onClick={() => setShowPinModal(true)}
        className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 text-slate-500 hover:text-slate-400"
      >
        <Lock size={16} />
      </button>

      <div className="flex flex-col items-center gap-8 pt-4">
        <div className="flex gap-2">
          {EXERCISES.map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full transition-all ${
                i < current
                  ? "bg-emerald-400"
                  : i === current
                  ? "bg-emerald-300 ring-4 ring-emerald-400/30"
                  : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        <div className="text-center">
          <p className="text-xl text-slate-400">Привет, Акмал! 👋</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{exercise.instruction}</h1>
        </div>

        {feedback && (
          <div className={`rounded-2xl px-10 py-5 text-center transition-all ${
            feedback === "correct"
              ? "bg-emerald-500/20"
              : "bg-red-500/10"
          }`}>
            <p className={`text-3xl font-bold ${
              feedback === "correct" ? "text-emerald-300" : "text-red-300"
            }`}>
              {feedback === "correct" ? "🌟 Молодец!" : "Попробуй ещё раз"}
            </p>
          </div>
        )}

        <div className="grid w-full max-w-lg grid-cols-2 gap-6">
          {exercise.cards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleTap(card.id)}
              className={`flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-3xl transition-all active:scale-95 ${card.bg}
                ${feedback === "correct" && card.id === exercise.correctId
                  ? "ring-4 ring-emerald-400 ring-offset-4 ring-offset-slate-950"
                  : feedback === "wrong" && card.id !== exercise.correctId
                  ? "opacity-50"
                  : "hover:opacity-90"
                }`}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/20 text-4xl font-bold text-white">
                {card.label[0]}
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{card.label}</p>
                <p className="text-base text-white/60">{card.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="card w-full max-w-sm space-y-5 text-center">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Введите PIN</h2>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 rounded-xl border border-slate-700 bg-slate-800"
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k) => (
                <button
                  key={k}
                  type="button"
                  className="rounded-xl border border-slate-700 bg-slate-800 py-3 text-lg font-semibold text-white transition-colors hover:bg-slate-700 disabled:invisible"
                  disabled={!k}
                >
                  {k}
                </button>
              ))}
            </div>
            <Link
              href="/dashboard"
              className="block w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              Выйти из режима ребёнка
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
