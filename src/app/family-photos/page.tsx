'use client';
import { useState } from 'react';
import Link from 'next/link';

type FamilyRole = { key: string; labelUz: string; labelRu: string; icon: string };

const FAMILY_ROLES: FamilyRole[] = [
  { key: 'oy', labelUz: 'Ойи', labelRu: 'мама', icon: '👩' },
  { key: 'ada', labelUz: 'Ада', labelRu: 'папа', icon: '👨' },
  { key: 'buvi', labelUz: 'Буви', labelRu: 'бабушка', icon: '👵' },
  { key: 'bobo', labelUz: 'Бобо', labelRu: 'дедушка', icon: '👴' },
  { key: 'aka', labelUz: 'Ака', labelRu: 'брат', icon: '👦' },
  { key: 'opa', labelUz: 'Опа', labelRu: 'сестра', icon: '👧' },
  { key: 'bola', labelUz: 'Бола', labelRu: 'ребёнок', icon: '🧒' },
];

type UploadedPhoto = { key: string; dataUrl: string; consentGiven: boolean };

export default function FamilyPhotosPage() {
  const [photos, setPhotos] = useState<Record<string, UploadedPhoto>>({});
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [consentExpanded, setConsentExpanded] = useState(false);

  function handleFileChange(key: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setPhotos(prev => ({
        ...prev,
        [key]: { key, dataUrl: ev.target?.result as string, consentGiven: consents[key] ?? false },
      }));
    };
    reader.readAsDataURL(file);
  }

  function toggleConsent(key: string) {
    setConsents(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const uploadedCount = Object.keys(photos).length;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Фото семьи</h1>
          <p className="mt-1 text-slate-400">Загружено: {uploadedCount} из {FAMILY_ROLES.length}</p>
        </div>
        {uploadedCount > 0 && (
          <Link
            href="/characters"
            className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Создать персонажей →
          </Link>
        )}
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <p className="text-sm font-semibold text-blue-300">Только фото людей</p>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Здесь загружайте только фото людей из семьи: маму, папу, бабушку, дедушку, братьев, сестёр.
              Предметы, действия и места ИИ создаёт сам — вам не нужно их фотографировать.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {FAMILY_ROLES.map(member => {
          const photo = photos[member.key];
          const hasConsent = consents[member.key];

          return (
            <div key={member.key} className="card flex flex-col items-center gap-3">
              <div className={`relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 transition-all ${
                photo ? 'border-emerald-500/40 bg-slate-800' : 'border-dashed border-slate-600 bg-slate-800/50'
              }`}>
                {photo ? (
                  <img src={photo.dataUrl} alt={member.labelUz} className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  <span className="text-3xl opacity-60">{member.icon}</span>
                )}
                {photo && (
                  <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-xs text-white font-bold">✓</div>
                )}
              </div>

              <div className="text-center">
                <p className="font-semibold text-white">{member.labelUz}</p>
                <p className="text-xs text-slate-500">{member.labelRu}</p>
              </div>

              <label className={`w-full cursor-pointer rounded-lg border px-3 py-2 text-center text-xs font-semibold transition-colors ${
                photo
                  ? 'border-slate-700 text-slate-400 hover:border-slate-600'
                  : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20'
              }`}>
                {photo ? 'Изменить' : 'Загрузить фото'}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={e => handleFileChange(member.key, e)}
                />
              </label>

              {photo && (
                <label className="flex cursor-pointer items-start gap-2 text-left">
                  <input
                    type="checkbox"
                    checked={hasConsent ?? false}
                    onChange={() => toggleConsent(member.key)}
                    className="mt-0.5 accent-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 leading-tight">
                    Я даю согласие на AI-обработку этого фото
                  </span>
                </label>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800/30">
        <button
          type="button"
          onClick={() => setConsentExpanded(!consentExpanded)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm text-slate-300"
        >
          <span className="font-semibold">Как используются фото?</span>
          <span>{consentExpanded ? '▲' : '▼'}</span>
        </button>
        {consentExpanded && (
          <div className="border-t border-slate-700 px-4 pb-4 pt-3">
            <p className="text-xs text-slate-400 leading-relaxed">
              Загруженные фото используются ТОЛЬКО для создания мультяшного персонажа для учебных карточек.
              Фото не публикуются и не передаются третьим лицам. Оригиналы хранятся в зашифрованном виде.
              Вы можете удалить фото в любое время в разделе{' '}
              <Link href="/settings/privacy" className="text-emerald-400 hover:underline">
                Настройки конфиденциальности
              </Link>.
            </p>
          </div>
        )}
      </div>

      {uploadedCount > 0 && (
        <div className="flex justify-center">
          <Link
            href="/characters"
            className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Создать персонажей из фото ({uploadedCount}) →
          </Link>
        </div>
      )}
    </section>
  );
}
