"use client";

import { useState } from "react";
import { Camera, CheckCircle2, RefreshCw, Upload } from "lucide-react";
import { FlashCard } from "@/components/FlashCard";

type CardStatus = "confirmed" | "pending" | "processing";

type MockCard = {
  id: string;
  labelRu: string;
  labelUz: string;
  category: string;
  status: CardStatus;
  colorIndex: number;
};

const MOCK_CARDS: MockCard[] = [
  { id: "1", labelRu: "Ойи (мама)", labelUz: "Oyi", category: "Человек", status: "confirmed", colorIndex: 0 },
  { id: "2", labelRu: "Ада (папа)", labelUz: "Ota", category: "Человек", status: "confirmed", colorIndex: 1 },
  { id: "3", labelRu: "Буви (бабушка)", labelUz: "Buvi", category: "Человек", status: "confirmed", colorIndex: 2 },
  { id: "4", labelRu: "Кошка", labelUz: "Mushuk", category: "Животное", status: "confirmed", colorIndex: 3 },
  { id: "5", labelRu: "Мячик", labelUz: "To'p", category: "Предмет", status: "pending", colorIndex: 4 },
  { id: "6", labelRu: "Чашка", labelUz: "Piyola", category: "Предмет", status: "pending", colorIndex: 5 },
  { id: "7", labelRu: "Ложка", labelUz: "Qoshiq", category: "Предмет", status: "processing", colorIndex: 6 },
  { id: "8", labelRu: "Собака", labelUz: "It", category: "Животное", status: "processing", colorIndex: 7 },
];

const STATUS_BADGES: Record<CardStatus, { label: string; className: string }> = {
  confirmed: { label: "Подтверждено", className: "bg-emerald-500/15 text-emerald-300" },
  pending: { label: "Ожидает подтверждения", className: "bg-amber-500/15 text-amber-300" },
  processing: { label: "Обрабатывается", className: "bg-sky-500/15 text-sky-300" },
};

export default function CardsPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [cards, setCards] = useState(MOCK_CARDS);

  const confirmCard = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "confirmed" as CardStatus } : c))
    );
  };

  const retryCard = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "processing" as CardStatus } : c))
    );
  };

  const confirmed = cards.filter((c) => c.status === "confirmed");
  const pending = cards.filter((c) => c.status === "pending");
  const processing = cards.filter((c) => c.status === "processing");

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Карточки</h1>
        <p className="mt-1 text-slate-400">Загрузите фото — ИИ создаст карточку автоматически</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
        className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-12 transition-colors ${
          isDragging
            ? "border-emerald-400 bg-emerald-500/10"
            : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
        }`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
          <Upload size={28} />
        </div>
        <div className="text-center">
          <p className="font-semibold text-white">Загрузите фото члена семьи или предмета</p>
          <p className="mt-1 text-sm text-slate-400">Перетащите сюда или нажмите для выбора · JPG, PNG до 10 МБ</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
        >
          <Camera size={16} />
          Выбрать фото
        </button>
      </div>

      {processing.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-sky-800 bg-sky-500/10 px-4 py-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
          <p className="text-sm text-sky-200">
            ИИ обрабатывает {processing.length} фото... Это займёт несколько секунд.
          </p>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Ожидают подтверждения
            <span className="ml-2 text-sm font-normal text-amber-400">({pending.length})</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {pending.map((card) => (
              <div key={card.id} className="card space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGES[card.status].className}`}>
                      {STATUS_BADGES[card.status].label}
                    </span>
                    <h3 className="mt-2 text-base font-semibold text-white">{card.labelRu}</h3>
                    <p className="text-sm text-slate-400">{card.labelUz} · {card.category}</p>
                  </div>
                </div>
                <FlashCard
                  label={card.labelRu}
                  labelSecondary={card.labelUz}
                  colorIndex={card.colorIndex}
                  size="sm"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => confirmCard(card.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
                  >
                    <CheckCircle2 size={15} />
                    Подтвердить
                  </button>
                  <button
                    type="button"
                    onClick={() => retryCard(card.id)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600"
                  >
                    <RefreshCw size={15} />
                    Переделать
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Подтверждённые карточки
          <span className="ml-2 text-sm font-normal text-emerald-400">({confirmed.length})</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {confirmed.map((card) => (
            <div key={card.id} className="space-y-2">
              <FlashCard
                label={card.labelRu}
                labelSecondary={card.labelUz}
                category={card.category}
                colorIndex={card.colorIndex}
                size="md"
              />
              <div className="flex items-center justify-between px-1">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGES.confirmed.className}`}>
                  {STATUS_BADGES.confirmed.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {processing.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            В обработке
            <span className="ml-2 text-sm font-normal text-sky-400">({processing.length})</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {processing.map((card) => (
              <div key={card.id} className="space-y-2 opacity-60">
                <FlashCard
                  label={card.labelRu}
                  labelSecondary={card.labelUz}
                  colorIndex={card.colorIndex}
                  size="md"
                />
                <div className="flex items-center justify-center">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGES.processing.className}`}>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
                    {STATUS_BADGES.processing.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
