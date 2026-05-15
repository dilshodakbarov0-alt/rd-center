'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FlashCard } from '@/components/FlashCard';

type CharacterStatus = 'confirmed' | 'generating' | 'empty';

type Character = {
  key: string;
  labelUz: string;
  labelRu: string;
  status: CharacterStatus;
  useInCards: boolean;
  useInLessons: boolean;
};

const INITIAL_CHARACTERS: Character[] = [
  { key: 'oy', labelUz: 'Ойи', labelRu: 'Мама', status: 'confirmed', useInCards: true, useInLessons: true },
  { key: 'ada', labelUz: 'Ада', labelRu: 'Папа', status: 'confirmed', useInCards: true, useInLessons: true },
  { key: 'buvi', labelUz: 'Буви', labelRu: 'Бабушка', status: 'generating', useInCards: false, useInLessons: false },
  { key: 'bobo', labelUz: 'Бобо', labelRu: 'Дедушка', status: 'empty', useInCards: false, useInLessons: false },
  { key: 'aka', labelUz: 'Ака', labelRu: 'Брат', status: 'empty', useInCards: false, useInLessons: false },
  { key: 'opa', labelUz: 'Опа', labelRu: 'Сестра', status: 'empty', useInCards: false, useInLessons: false },
  { key: 'bola', labelUz: 'Бола', labelRu: 'Ребёнок', status: 'empty', useInCards: false, useInLessons: false },
];

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);

  function toggleUseInCards(key: string) {
    setCharacters(prev => prev.map(c => c.key === key ? { ...c, useInCards: !c.useInCards } : c));
  }

  function toggleUseInLessons(key: string) {
    setCharacters(prev => prev.map(c => c.key === key ? { ...c, useInLessons: !c.useInLessons } : c));
  }

  function handleDelete(key: string) {
    setCharacters(prev => prev.map(c => c.key === key ? { ...c, status: 'empty' as CharacterStatus, useInCards: false, useInLessons: false } : c));
  }

  const confirmedCount = characters.filter(c => c.status === 'confirmed').length;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Персонажи</h1>
          <p className="mt-1 text-slate-400">Создано: {confirmedCount} персонажа</p>
        </div>
        <Link
          href="/family-photos"
          className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
        >
          + Создать персонажей
        </Link>
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">✦</span>
          <div>
            <p className="text-sm font-semibold text-emerald-300">Как это работает</p>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              ИИ создаёт мультяшного персонажа из вашего фото. Персонаж используется в карточках и
              AI-видеоуроках. Оригинальное фото не публикуется и не передаётся третьим лицам.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {characters.map(char => (
          <div key={char.key} className="card space-y-4">
            {char.status === 'confirmed' && (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">Оригинал</span>
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-700 text-2xl">👩</div>
                  </div>
                  <span className="text-slate-500 text-lg">→</span>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wide">Персонаж</span>
                    <FlashCard label={char.labelUz} labelSecondary={char.labelRu} category="person" size="sm" />
                  </div>
                </div>

                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">В карточках</span>
                    <button
                      type="button"
                      onClick={() => toggleUseInCards(char.key)}
                      className={`relative h-5 w-9 rounded-full transition-colors ${char.useInCards ? 'bg-emerald-500' : 'bg-slate-600'}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${char.useInCards ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-300">В AI-уроках</span>
                    <button
                      type="button"
                      onClick={() => toggleUseInLessons(char.key)}
                      className={`relative h-5 w-9 rounded-full transition-colors ${char.useInLessons ? 'bg-emerald-500' : 'bg-slate-600'}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${char.useInLessons ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(char.key)}
                  className="w-full rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10"
                >
                  Удалить персонажа
                </button>
              </>
            )}

            {char.status === 'generating' && (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-700 text-2xl animate-pulse">👵</div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">{char.labelUz} ({char.labelRu})</p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-300">
                    <span className="animate-dot-1 text-base">•</span>
                    <span className="animate-dot-2 text-base">•</span>
                    <span className="animate-dot-3 text-base">•</span>
                    <span>Создаём персонажа...</span>
                  </div>
                </div>
              </div>
            )}

            {char.status === 'empty' && (
              <div className="flex flex-col items-center gap-3 py-4 opacity-50">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-slate-600 text-2xl">
                  <span className="text-slate-500">+</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-400">{char.labelUz} ({char.labelRu})</p>
                  <p className="text-xs text-slate-600">Загрузите фото</p>
                </div>
                <Link
                  href="/family-photos"
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-600"
                >
                  Загрузить фото
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
