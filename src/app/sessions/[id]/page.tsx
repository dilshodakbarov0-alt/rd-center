"use client";

import { useState } from "react";
import Link from "next/link";
import { FlashCard } from "@/components/FlashCard";
import { ResultRecorder } from "@/components/ResultRecorder";

type Outcome = "independent" | "prompted" | "error" | "refusal" | "no_response";

type TrialResult = {
  cardId: string;
  outcome: Outcome;
};

const SESSION_CARDS = [
  { id: "c1", label: "Ойи (мама)", labelSecondary: "Oyi", colorIndex: 0 },
  { id: "c2", label: "Ада (папа)", labelSecondary: "Ota", colorIndex: 1 },
  { id: "c3", label: "Буви (бабушка)", labelSecondary: "Buvi", colorIndex: 2 },
];

const TOTAL_TRIALS = 10;

const FEEDBACK: Record<Outcome, { text: string; color: string }> = {
  independent: { text: "Молодец! ✓", color: "text-emerald-400" },
  prompted: { text: "Хорошо, с подсказкой ✓", color: "text-yellow-400" },
  error: { text: "Попробуем ещё раз", color: "text-red-400" },
  refusal: { text: "Хорошо, отдохнём", color: "text-slate-400" },
  no_response: { text: "Без ответа", color: "text-slate-500" },
};

export default function SessionRunnerPage() {
  const [trial, setTrial] = useState(0);
  const [results, setResults] = useState<TrialResult[]>([]);
  const [lastOutcome, setLastOutcome] = useState<Outcome | null>(null);
  const [showPause, setShowPause] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const currentCardIdx = trial % SESSION_CARDS.length;
  const currentCard = SESSION_CARDS[currentCardIdx];
  const distractorIdx = (currentCardIdx + 1) % SESSION_CARDS.length;
  const distractorCard = SESSION_CARDS[distractorIdx];

  const recordResult = (outcome: Outcome) => {
    const newResult: TrialResult = { cardId: currentCard.id, outcome };
    const newResults = [...results, newResult];
    setResults(newResults);
    setLastOutcome(outcome);
    setSelectedCard(null);

    setTimeout(() => {
      setLastOutcome(null);
      const nextTrial = trial + 1;

      if (nextTrial >= TOTAL_TRIALS) {
        setDone(true);
      } else if (nextTrial === 5) {
        setShowPause(true);
        setTrial(nextTrial);
      } else {
        setTrial(nextTrial);
      }
    }, 1200);
  };

  const countOutcome = (o: Outcome) => results.filter((r) => r.outcome === o).length;

  const independentCount = countOutcome("independent");
  const promptedCount = countOutcome("prompted");
  const errorCount = countOutcome("error");
  const refusalCount = countOutcome("refusal");
  const noResponseCount = countOutcome("no_response");
  const independentRate = results.length > 0 ? Math.round((independentCount / results.length) * 100) : 0;

  const aiRecommendation =
    independentRate >= 80
      ? "Усложнить: перейти к выбору из 3 карточек"
      : independentRate >= 60
      ? "Продолжить на том же уровне"
      : "Упростить: использовать больше подсказок";

  if (done) {
    return (
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="card space-y-6">
          <div className="space-y-2">
            <p className="text-4xl">🎉</p>
            <h1 className="text-2xl font-semibold text-white">Занятие завершено!</h1>
            <p className="text-slate-400">Акмал сделал {TOTAL_TRIALS} попыток</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-500/10 px-4 py-3">
              <p className="text-2xl font-semibold text-emerald-300">{independentCount}</p>
              <p className="text-xs text-slate-400">Самостоятельно</p>
            </div>
            <div className="rounded-xl bg-yellow-500/10 px-4 py-3">
              <p className="text-2xl font-semibold text-yellow-300">{promptedCount}</p>
              <p className="text-xs text-slate-400">С подсказкой</p>
            </div>
            <div className="rounded-xl bg-red-500/10 px-4 py-3">
              <p className="text-2xl font-semibold text-red-300">{errorCount}</p>
              <p className="text-xs text-slate-400">Ошибок</p>
            </div>
            <div className="rounded-xl bg-slate-700/50 px-4 py-3">
              <p className="text-2xl font-semibold text-slate-300">{refusalCount + noResponseCount}</p>
              <p className="text-xs text-slate-400">Отказ / Нет реакции</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-800 px-4 py-4">
            <p className="text-xs font-semibold text-emerald-300">ИИ рекомендует:</p>
            <p className="mt-1 text-sm text-slate-200">{aiRecommendation}</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/sessions/new"
              className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 text-center"
            >
              Ещё одно занятие
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600 text-center"
            >
              На главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showPause) {
    return (
      <div className="mx-auto max-w-sm space-y-6 text-center">
        <div className="card space-y-4">
          <p className="text-3xl">⏸️</p>
          <h2 className="text-xl font-semibold text-white">Пауза?</h2>
          <p className="text-slate-400">Половина занятия позади! Акмал делает 5 из 10 попыток.</p>
          <div className="rounded-xl bg-slate-800 px-4 py-3">
            <p className="text-sm text-slate-200">
              Самостоятельно: {independentCount} · С подсказкой: {promptedCount}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowPause(false)}
              className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              Продолжить
            </button>
            <Link
              href="/dashboard"
              className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600 text-center"
            >
              Остановить
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Попытка {trial + 1} из {TOTAL_TRIALS}</span>
          <span>Самостоятельно: {independentCount}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${((trial) / TOTAL_TRIALS) * 100}%` }}
          />
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-white">Покажи, где</p>
        <p className="text-2xl font-bold text-emerald-200">{currentCard.label.toUpperCase()}</p>
      </div>

      {lastOutcome ? (
        <div className="flex items-center justify-center">
          <div className={`rounded-2xl bg-slate-800 px-8 py-6 text-center`}>
            <p className={`text-xl font-bold ${FEEDBACK[lastOutcome].color}`}>
              {FEEDBACK[lastOutcome].text}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <FlashCard
            label={currentCard.label}
            labelSecondary={currentCard.labelSecondary}
            colorIndex={currentCard.colorIndex}
            size="lg"
            selected={selectedCard === currentCard.id}
            onClick={() => setSelectedCard(currentCard.id)}
          />
          <FlashCard
            label={distractorCard.label}
            labelSecondary={distractorCard.labelSecondary}
            colorIndex={distractorCard.colorIndex}
            size="lg"
            selected={selectedCard === distractorCard.id}
            onClick={() => setSelectedCard(distractorCard.id)}
          />
        </div>
      )}

      {!lastOutcome && (
        <div className="card space-y-3">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            Запишите результат
          </p>
          <ResultRecorder onRecord={recordResult} />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_TRIALS }).map((_, i) => {
            const r = results[i];
            return (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  r?.outcome === "independent"
                    ? "bg-emerald-400"
                    : r?.outcome === "prompted"
                    ? "bg-yellow-400"
                    : r?.outcome === "error"
                    ? "bg-red-400"
                    : r
                    ? "bg-slate-500"
                    : i === trial
                    ? "bg-slate-400 ring-2 ring-slate-400/50"
                    : "bg-slate-700"
                }`}
              />
            );
          })}
        </div>
        <Link href="/dashboard" className="text-xs text-slate-500 hover:text-slate-300">
          Остановить
        </Link>
      </div>
    </div>
  );
}
