"use client";

import { useState, useRef } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronDown,
  Loader2,
  RefreshCw,
  Upload,
} from "lucide-react";
import { FlashCard } from "@/components/FlashCard";
import { EmotionCard } from "@/components/EmotionCard";

// ─── Types ────────────────────────────────────────────────────────────────────

type CardStatus = "confirmed" | "pending" | "processing";

type MockCard = {
  id: string;
  labelRu: string;
  labelUz: string;
  category: "person" | "object" | "action" | "emotion" | "place";
  status: CardStatus;
};

type UploadStep =
  | { phase: "idle" }
  | { phase: "received" }
  | { phase: "bg_remove" }
  | { phase: "cartoon" }
  | { phase: "done" };

// ─── Mock data ────────────────────────────────────────────────────────────────

const FAMILY_CARDS: MockCard[] = [
  { id: "f1", labelRu: "Ойи",    labelUz: "Mама",      category: "person", status: "confirmed" },
  { id: "f2", labelRu: "Ада",    labelUz: "Папа",      category: "person", status: "confirmed" },
  { id: "f3", labelRu: "Буви",   labelUz: "Бабушка",   category: "person", status: "confirmed" },
  { id: "f4", labelRu: "Бобо",   labelUz: "Дедушка",   category: "person", status: "confirmed" },
];

const OBJECT_CARDS: MockCard[] = [
  { id: "o1", labelRu: "Китоб",  labelUz: "Книга",     category: "object", status: "confirmed" },
  { id: "o2", labelRu: "Чашка",  labelUz: "Чашка",     category: "object", status: "pending"   },
  { id: "o3", labelRu: "Мяч",    labelUz: "Мяч",       category: "object", status: "confirmed" },
  { id: "o4", labelRu: "Қошиқ",  labelUz: "Ложка",     category: "object", status: "processing"},
];

const ROLE_OPTIONS = [
  { value: "person_oyi",   label: "Ойи / Мама"       },
  { value: "person_ada",   label: "Ада / Папа"       },
  { value: "person_buvi",  label: "Буви / Бабушка"   },
  { value: "person_bobo",  label: "Бобо / Дедушка"   },
  { value: "person_child", label: "Бола / Ребёнок"   },
  { value: "object",       label: "Нарса / Предмет"  },
  { value: "place",        label: "Жой / Место"      },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const ConfirmedBadge = () => (
  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
    <CheckCircle2 size={11} />
    Подтверждено
  </span>
);

const ProcessingBadge = () => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-semibold text-sky-300">
    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
    Обрабатывается
  </span>
);

/** Before/after mini preview strip */
const BeforeAfterPreview = ({
  color,
  label,
  labelUz,
  category,
}: {
  color: string;
  label: string;
  labelUz: string;
  category: "person" | "object" | "place";
}) => (
  <div className="flex items-center gap-2">
    {/* "Real photo" stand-in */}
    <div
      className={`flex h-16 w-14 flex-shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-slate-600 ${color} text-xs font-bold text-white`}
    >
      фото
    </div>
    <ArrowRight size={14} className="flex-shrink-0 text-slate-500" />
    {/* Resulting FlashCard (sm) */}
    <FlashCard label={label} labelSecondary={labelUz} category={category} size="sm" />
  </div>
);

/** Upload progress stepper */
const UploadStepper = ({ step }: { step: UploadStep }) => {
  const steps = [
    { phase: "received", icon: "✓", label: "Фото получено — хорошее качество" },
    { phase: "bg_remove", icon: <Loader2 size={13} className="animate-spin" />, label: "Удаляем фон..." },
    { phase: "cartoon",  icon: <Loader2 size={13} className="animate-spin" />, label: "Создаём мультяшную карточку..." },
    { phase: "done",     icon: "✓", label: "Карточка готова!" },
  ] as const;

  const phaseOrder: Record<string, number> = {
    idle: -1, received: 0, bg_remove: 1, cartoon: 2, done: 3,
  };
  const currentIdx = phaseOrder[step.phase] ?? -1;

  return (
    <div className="mt-4 space-y-2 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
      {steps.map((s, i) => {
        const isActive  = i === currentIdx;
        const isDone    = i < currentIdx || step.phase === "done";
        const isPending = i > currentIdx;
        return (
          <div
            key={s.phase}
            className={`flex items-center gap-3 text-sm transition-all ${
              isDone
                ? "text-emerald-300"
                : isActive
                ? "text-white"
                : "text-slate-600"
            }`}
          >
            <span
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                isDone
                  ? "bg-emerald-500/20 text-emerald-400"
                  : isActive
                  ? "bg-sky-500/20 text-sky-300"
                  : "bg-slate-800 text-slate-600"
              }`}
            >
              {isDone ? "✓" : isActive ? s.icon : i + 1}
            </span>
            {s.label}
          </div>
        );
      })}
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CardsPage() {
  const [isDragging, setIsDragging]   = useState(false);
  const [uploadStep, setUploadStep]   = useState<UploadStep>({ phase: "idle" });
  const [role, setRole]               = useState(ROLE_OPTIONS[0].value);
  const [language, setLanguage]       = useState<"ru" | "uz">("ru");
  const [objectCards, setObjectCards] = useState(OBJECT_CARDS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Simulate multi-step AI processing */
  const simulateUpload = () => {
    setUploadStep({ phase: "received" });
    setTimeout(() => setUploadStep({ phase: "bg_remove" }), 1000);
    setTimeout(() => setUploadStep({ phase: "cartoon" }),   2400);
    setTimeout(() => setUploadStep({ phase: "done" }),      4000);
    setTimeout(() => setUploadStep({ phase: "idle" }),      7000);
  };

  const confirmCard = (id: string) => {
    setObjectCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "confirmed" as CardStatus } : c))
    );
  };

  const retryCard = (id: string) => {
    setObjectCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "processing" as CardStatus } : c))
    );
  };

  const pendingCards   = objectCards.filter((c) => c.status === "pending");
  const processingCards = objectCards.filter((c) => c.status === "processing");

  return (
    <section className="space-y-10">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-3xl font-semibold text-white">Карточки</h1>
        <p className="mt-1 text-slate-400">
          Загрузите фото — ИИ создаст обучающую карточку автоматически
        </p>
      </div>

      {/* ── Upload zone ── */}
      <div className="space-y-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e)  => { e.preventDefault(); setIsDragging(false); simulateUpload(); }}
          onClick={() => fileInputRef.current?.click()}
          className={[
            "flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed px-6 py-12 transition-colors cursor-pointer",
            isDragging
              ? "border-emerald-400 bg-emerald-500/10"
              : "border-slate-700 bg-slate-900/30 hover:border-slate-500",
          ].join(" ")}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => simulateUpload()}
          />

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
            <Upload size={28} />
          </div>

          <div className="text-center">
            <p className="font-semibold text-white">
              Загрузите фото человека, предмета или игрушки
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Перетащите сюда или нажмите для выбора · JPG, PNG до 10 МБ
            </p>
          </div>

          {/* Options row */}
          <div
            className="flex flex-wrap items-center justify-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Role selector */}
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none rounded-lg border border-slate-700 bg-slate-800 pl-3 pr-8 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {ROLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>

            {/* Language selector */}
            <div className="flex rounded-lg border border-slate-700 bg-slate-800 overflow-hidden">
              {(["ru", "uz"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    language === lang
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {lang === "ru" ? "Рус" : "O'zb"}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => simulateUpload()}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              <Camera size={16} />
              Выбрать фото
            </button>
          </div>
        </div>

        {/* Before / after previews */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Примеры — фото превращается в карточку
          </p>
          <div className="flex flex-wrap gap-6">
            <BeforeAfterPreview color="bg-blue-700"  label="Ойи"   labelUz="Мама"   category="person" />
            <BeforeAfterPreview color="bg-green-700" label="Чашка" labelUz="Piyola" category="object" />
            <BeforeAfterPreview color="bg-purple-700" label="Уй"   labelUz="Дом"    category="place"  />
          </div>
        </div>

        {/* Upload progress stepper */}
        {uploadStep.phase !== "idle" && <UploadStepper step={uploadStep} />}
      </div>

      {/* ── Pending confirmation ── */}
      {pendingCards.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Ожидают подтверждения
            <span className="ml-2 text-sm font-normal text-amber-400">({pendingCards.length})</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {pendingCards.map((card) => (
              <div key={card.id} className="card flex items-start gap-4">
                <FlashCard
                  label={card.labelRu}
                  labelSecondary={card.labelUz}
                  category={card.category}
                  size="md"
                />
                <div className="flex flex-1 flex-col gap-3 pt-1">
                  <div>
                    <span className="inline-flex rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                      Ожидает
                    </span>
                    <h3 className="mt-2 font-semibold text-white">{card.labelRu}</h3>
                    <p className="text-sm text-slate-400">{card.labelUz}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => confirmCard(card.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
                    >
                      <CheckCircle2 size={14} />
                      Подтвердить
                    </button>
                    <button
                      type="button"
                      onClick={() => retryCard(card.id)}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 hover:border-slate-600 transition-colors"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Семья section ── */}
      <div>
        <h2 className="mb-1 text-lg font-semibold text-white">Семья</h2>
        <p className="mb-4 text-sm text-slate-500">Оила · Family</p>
        <div className="flex flex-wrap gap-4">
          {FAMILY_CARDS.map((card) => (
            <div key={card.id} className="flex flex-col items-center gap-2">
              <FlashCard
                label={card.labelRu}
                labelSecondary={card.labelUz}
                category="person"
                size="md"
              />
              <ConfirmedBadge />
            </div>
          ))}
        </div>
      </div>

      {/* ── Предметы section ── */}
      <div>
        <h2 className="mb-1 text-lg font-semibold text-white">Предметы</h2>
        <p className="mb-4 text-sm text-slate-500">Narsalar · Objects</p>
        <div className="flex flex-wrap gap-4">
          {objectCards.map((card) => (
            <div key={card.id} className="flex flex-col items-center gap-2">
              <div className={card.status === "processing" ? "opacity-60" : undefined}>
                <FlashCard
                  label={card.labelRu}
                  labelSecondary={card.labelUz}
                  category="object"
                  size="md"
                />
              </div>
              {card.status === "confirmed" && <ConfirmedBadge />}
              {card.status === "processing" && <ProcessingBadge />}
              {card.status === "pending" && (
                <button
                  type="button"
                  onClick={() => confirmCard(card.id)}
                  className="flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition-colors"
                >
                  <CheckCircle2 size={11} />
                  Подтвердить
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Эмоции section ── */}
      <div>
        <h2 className="mb-1 text-lg font-semibold text-white">Эмоции</h2>
        <p className="mb-4 text-sm text-slate-500">
          His-tuyg&apos;ular · По методике Энди Бонди (PECS)
        </p>
        <div className="flex flex-wrap gap-4">
          <EmotionCard emotion="happy"  language={language} size="md" />
          <EmotionCard emotion="sad"    language={language} size="md" />
          <EmotionCard emotion="angry"  language={language} size="md" />
        </div>
        <p className="mt-3 text-xs text-slate-600">
          Все 7 эмоций доступны на странице{" "}
          <a href="/emotions" className="text-emerald-400 hover:underline">
            Эмоции →
          </a>
        </p>
      </div>
    </section>
  );
}
