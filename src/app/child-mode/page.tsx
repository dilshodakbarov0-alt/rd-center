"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Lock, X, Star, Home, RotateCcw } from "lucide-react";
import { FlashCard } from "@/components/FlashCard";

// ─── Data ─────────────────────────────────────────────────────────────────────

const EXERCISES = [
  {
    id: "e1",
    instructionRu: "Покажи, где ОЙИ",
    instructionUz: "OYI ni ko'rsat!",
    correctId: "c_oyi",
    cards: [
      { id: "c_oyi",  labelRu: "Ойи",  labelUz: "Oyi",  category: "person" as const },
      { id: "c_ada",  labelRu: "Ада",  labelUz: "Ota",  category: "person" as const },
    ],
  },
  {
    id: "e2",
    instructionRu: "Покажи, где АДА",
    instructionUz: "OTA ni ko'rsat!",
    correctId: "c_ada",
    cards: [
      { id: "c_ada",  labelRu: "Ада",  labelUz: "Ota",  category: "person" as const },
      { id: "c_buvi", labelRu: "Буви", labelUz: "Buvi", category: "person" as const },
    ],
  },
  {
    id: "e3",
    instructionRu: "Покажи, где ЧАШКА",
    instructionUz: "PIYOLA ni ko'rsat!",
    correctId: "c_cup",
    cards: [
      { id: "c_ball", labelRu: "Мяч",  labelUz: "To'p",   category: "object" as const },
      { id: "c_cup",  labelRu: "Чашка",labelUz: "Piyola", category: "object" as const },
    ],
  },
  {
    id: "e4",
    instructionRu: "Покажи, где МЯЧ",
    instructionUz: "TO'P ni ko'rsat!",
    correctId: "c_ball",
    cards: [
      { id: "c_cup",  labelRu: "Чашка",labelUz: "Piyola", category: "object" as const },
      { id: "c_ball", labelRu: "Мяч",  labelUz: "To'p",   category: "object" as const },
    ],
  },
  {
    id: "e5",
    instructionRu: "Покажи, где БУВИ",
    instructionUz: "BUVI ni ko'rsat!",
    correctId: "c_buvi",
    cards: [
      { id: "c_oyi",  labelRu: "Ойи",  labelUz: "Oyi",  category: "person" as const },
      { id: "c_buvi", labelRu: "Буви", labelUz: "Buvi", category: "person" as const },
    ],
  },
  {
    id: "e6",
    instructionRu: "Покажи, где ОЙИ",
    instructionUz: "OYI ni ko'rsat!",
    correctId: "c_oyi",
    cards: [
      { id: "c_cup",  labelRu: "Чашка",labelUz: "Piyola", category: "object" as const },
      { id: "c_oyi",  labelRu: "Ойи",  labelUz: "Oyi",  category: "person" as const },
    ],
  },
  {
    id: "e7",
    instructionRu: "Покажи, где ЧАШКА",
    instructionUz: "PIYOLA ni ko'rsat!",
    correctId: "c_cup",
    cards: [
      { id: "c_cup",  labelRu: "Чашка",labelUz: "Piyola", category: "object" as const },
      { id: "c_ada",  labelRu: "Ада",  labelUz: "Ota",  category: "person" as const },
    ],
  },
  {
    id: "e8",
    instructionRu: "Покажи, где АДА",
    instructionUz: "OTA ni ko'rsat!",
    correctId: "c_ada",
    cards: [
      { id: "c_ball", labelRu: "Мяч",  labelUz: "To'p",   category: "object" as const },
      { id: "c_ada",  labelRu: "Ада",  labelUz: "Ota",  category: "person" as const },
    ],
  },
  {
    id: "e9",
    instructionRu: "Покажи, где МЯЧ",
    instructionUz: "TO'P ni ko'rsat!",
    correctId: "c_ball",
    cards: [
      { id: "c_buvi", labelRu: "Буви", labelUz: "Buvi", category: "person" as const },
      { id: "c_ball", labelRu: "Мяч",  labelUz: "To'p",   category: "object" as const },
    ],
  },
  {
    id: "e10",
    instructionRu: "Покажи, где БУВИ",
    instructionUz: "BUVI ni ko'rsat!",
    correctId: "c_buvi",
    cards: [
      { id: "c_cup",  labelRu: "Чашка",labelUz: "Piyola", category: "object" as const },
      { id: "c_buvi", labelRu: "Буви", labelUz: "Buvi", category: "person" as const },
    ],
  },
];

const TOTAL = EXERCISES.length;
const CORRECT_FOR_CELEBRATION = 5;

// ─── Confetti piece (CSS-only) ────────────────────────────────────────────────

const CONFETTI_COLORS = [
  "bg-yellow-400", "bg-emerald-400", "bg-pink-400",
  "bg-blue-400",   "bg-purple-400",  "bg-orange-400",
];

const ConfettiBurst = () => (
  <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        className={`confetti-piece ${CONFETTI_COLORS[i % CONFETTI_COLORS.length]}`}
        style={{
          left:             `${Math.random() * 100}%`,
          top:              `-${Math.random() * 10 + 5}%`,
          animationDuration:`${1.5 + Math.random() * 2}s`,
          animationDelay:   `${Math.random() * 0.5}s`,
          width:  `${6 + Math.random() * 8}px`,
          height: `${6 + Math.random() * 8}px`,
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
        }}
      />
    ))}
  </div>
);

// ─── Floating stars decoration ────────────────────────────────────────────────

const FloatingStars = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    {["animate-float-1", "animate-float-2", "animate-float-3", "animate-float-4", "animate-float-5"].map(
      (cls, i) => (
        <span
          key={i}
          className={`absolute text-yellow-400/30 text-2xl select-none ${cls}`}
          style={{
            top:  `${10 + i * 18}%`,
            left: i % 2 === 0 ? `${3 + i * 4}%` : undefined,
            right: i % 2 !== 0 ? `${3 + i * 4}%` : undefined,
          }}
        >
          ★
        </span>
      )
    )}
  </div>
);

// ─── Progress dots ─────────────────────────────────────────────────────────────

const ProgressDots = ({
  total,
  current,
  correctCount,
}: {
  total: number;
  current: number;
  correctCount: number;
}) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={[
          "rounded-full transition-all duration-300",
          i < correctCount
            ? "h-4 w-4 bg-emerald-400 shadow-[0_0_8px_#34d399]"
            : i === current
            ? "h-5 w-5 bg-emerald-300 ring-4 ring-emerald-400/30"
            : "h-3 w-3 bg-slate-700",
        ].join(" ")}
      />
    ))}
  </div>
);

// ─── PIN Modal ────────────────────────────────────────────────────────────────

const MOCK_PIN = "1234";

const PinModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError]   = useState(false);

  const addDigit = useCallback(
    (d: string) => {
      if (digits.length >= 4) return;
      const next = [...digits, d];
      setDigits(next);
      if (next.length === 4) {
        if (next.join("") === MOCK_PIN) {
          onSuccess();
        } else {
          setError(true);
          setTimeout(() => { setDigits([]); setError(false); }, 800);
        }
      }
    },
    [digits, onSuccess]
  );

  const backspace = () => setDigits((d) => d.slice(0, -1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="card w-full max-w-xs space-y-5 text-center">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            <Lock size={16} className="mr-2 inline-block text-slate-400" />
            Введите PIN
          </h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X size={20} />
          </button>
        </div>

        {/* PIN dots */}
        <div className="flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={[
                "h-12 w-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all",
                digits[i] !== undefined
                  ? error
                    ? "border-red-500 bg-red-500/20 text-red-300"
                    : "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                  : "border-slate-700 bg-slate-800",
              ].join(" ")}
            >
              {digits[i] !== undefined ? "●" : ""}
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-400">Неверный PIN. Попробуйте снова.</p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => (k === "⌫" ? backspace() : k ? addDigit(k) : undefined)}
              disabled={!k}
              className={[
                "rounded-xl border border-slate-700 bg-slate-800 py-3 text-lg font-semibold text-white transition-colors",
                k ? "hover:bg-slate-700 active:scale-95" : "invisible",
              ].join(" ")}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────

type Phase = "question" | "awaiting" | "feedback_correct" | "feedback_wrong" | "next_pause";

export default function ChildModePage() {
  const [current,      setCurrent]      = useState(0);
  const [phase,        setPhase]        = useState<Phase>("question");
  const [correctCount, setCorrectCount] = useState(0);
  const [showPin,      setShowPin]      = useState(false);
  const [done,         setDone]         = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);

  const exercise = EXERCISES[current];

  const handleTap = (cardId: string) => {
    if (phase !== "question" && phase !== "awaiting") return;
    setSelectedId(cardId);
    const isCorrect = cardId === exercise.correctId;

    if (isCorrect) {
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      setPhase("feedback_correct");

      // Celebration every 5 correct
      if (newCorrect % CORRECT_FOR_CELEBRATION === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      setTimeout(() => {
        setPhase("next_pause");
        setTimeout(() => {
          setSelectedId(null);
          if (current + 1 >= TOTAL) {
            setDone(true);
          } else {
            setCurrent((c) => c + 1);
            setPhase("question");
          }
        }, 400);
      }, 1500);
    } else {
      setPhase("feedback_wrong");
      setTimeout(() => {
        setSelectedId(null);
        setPhase("question");
      }, 1500);
    }
  };

  // ── Completion screen ────────────────────────────────────────────────────────
  if (done) {
    const starsEarned = Math.round((correctCount / TOTAL) * 5);
    return (
      <div className="relative flex min-h-[80vh] flex-col items-center justify-center gap-8 overflow-hidden text-center">
        <FloatingStars />

        <div className="space-y-2 relative z-10">
          <p className="text-6xl animate-bounce-in">🌟🌟🌟</p>
          <h1 className="text-4xl font-bold text-white">
            Машг&apos;улот тугади!
          </h1>
          <p className="text-xl text-slate-300">Занятие завершено!</p>
        </div>

        {/* Stars earned */}
        <div className="flex gap-2 relative z-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={36}
              className={i < starsEarned ? "text-yellow-400 fill-yellow-400" : "text-slate-700 fill-slate-700"}
            />
          ))}
        </div>
        <p className="text-slate-400 relative z-10">
          {correctCount} из {TOTAL} — {starsEarned} звёзд
        </p>

        <div className="flex flex-col gap-3 relative z-10">
          <button
            type="button"
            onClick={() => {
              setCurrent(0);
              setCorrectCount(0);
              setPhase("question");
              setDone(false);
              setSelectedId(null);
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-10 py-4 text-lg font-bold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            <RotateCcw size={20} />
            Яна ўйнаймизми? / Играем ещё?
          </button>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 px-10 py-4 text-base font-semibold text-slate-300 transition-colors hover:border-slate-500"
          >
            <Home size={18} />
            Uyga / Домой
          </Link>
        </div>
      </div>
    );
  }

  // ── Exercise screen ──────────────────────────────────────────────────────────
  const flashClass =
    phase === "feedback_correct"
      ? "animate-flash-green"
      : phase === "feedback_wrong"
      ? "animate-flash-red"
      : "";

  return (
    <div className={`relative min-h-[80vh] select-none rounded-3xl transition-colors ${flashClass}`}>
      {showConfetti && <ConfettiBurst />}
      <FloatingStars />

      {/* Lock button */}
      <button
        type="button"
        onClick={() => setShowPin(true)}
        className="absolute right-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 text-slate-500 hover:text-slate-400 transition-colors"
        aria-label="Выход (PIN)"
      >
        <Lock size={16} />
      </button>

      <div className="flex flex-col items-center gap-6 pt-4 pb-8">
        {/* Progress dots */}
        <ProgressDots total={TOTAL} current={current} correctCount={correctCount} />

        {/* Instruction */}
        <div className="text-center">
          <p className="text-base text-slate-400">{exercise.instructionUz}</p>
          <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
            {exercise.instructionRu}
          </h1>
        </div>

        {/* Feedback text */}
        <div className="h-12 flex items-center justify-center">
          {phase === "feedback_correct" && (
            <p className="animate-bounce-in text-2xl font-bold text-emerald-300">
              🌟 Баракалла!
            </p>
          )}
          {phase === "feedback_wrong" && (
            <p className="text-xl font-semibold text-red-300">
              Яна бир марта — попробуй ещё раз
            </p>
          )}
          {phase === "next_pause" && (
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-dot-1" />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-dot-2" />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-dot-3" />
            </div>
          )}
        </div>

        {/* Choice cards */}
        <div className="grid w-full max-w-md grid-cols-2 gap-6 px-4">
          {exercise.cards.map((card) => {
            const isSelected = selectedId === card.id;
            const isCorrect  = card.id === exercise.correctId;
            const showCorrectRing =
              phase === "feedback_correct" && isCorrect;
            const showDim =
              phase === "feedback_wrong" && !isSelected;

            return (
              <div
                key={card.id}
                className={[
                  "flex justify-center transition-all duration-150",
                  showDim ? "opacity-40" : "",
                ].join(" ")}
              >
                <FlashCard
                  label={card.labelRu}
                  labelSecondary={card.labelUz}
                  category={card.category}
                  size="lg"
                  selected={showCorrectRing || (isSelected && phase === "feedback_wrong")}
                  onClick={() => handleTap(card.id)}
                />
              </div>
            );
          })}
        </div>

        {/* Trial counter */}
        <p className="text-xs text-slate-600">
          {current + 1} / {TOTAL} · {correctCount} правильно
        </p>
      </div>

      {showPin && (
        <PinModal
          onClose={() => setShowPin(false)}
          onSuccess={() => {
            setShowPin(false);
            window.location.href = "/dashboard";
          }}
        />
      )}
    </div>
  );
}
