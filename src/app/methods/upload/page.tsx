'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { MethodMaterialType } from '@/lib/types';

type UploadPhase = 'idle' | 'uploading' | 'reading' | 'extracting' | 'reviewing' | 'done';

const MATERIAL_TYPES: MethodMaterialType[] = ['book', 'pdf', 'protocol', 'checklist', 'research', 'docx'];
const TYPE_LABELS: Record<MethodMaterialType, string> = {
  book: 'Книга', pdf: 'PDF', protocol: 'Протокол', checklist: 'Чеклист', research: 'Исследование', docx: 'DOCX',
};

const LANGUAGES = ['Русский', 'Узбекский', 'Английский'];

const UPLOAD_PHASES: Array<{ phase: UploadPhase; label: string }> = [
  { phase: 'uploading', label: 'Загружаем файл...' },
  { phase: 'reading', label: 'ИИ читает материал...' },
  { phase: 'extracting', label: 'Извлекаем методические правила...' },
  { phase: 'reviewing', label: 'Отправляем на проверку...' },
  { phase: 'done', label: 'Готово!' },
];

const RECENT_UPLOADS = [
  { name: 'ABA Therapy Basics.pdf', type: 'PDF' as MethodMaterialType, date: '12 мая', rulesCount: 15, status: 'done' as UploadPhase },
  { name: 'VB-MAPP Assessment.pdf', type: 'PDF' as MethodMaterialType, date: '10 мая', rulesCount: 22, status: 'done' as UploadPhase },
  { name: 'DTT_Manual.docx', type: 'docx' as MethodMaterialType, date: '8 мая', rulesCount: 0, status: 'reading' as UploadPhase },
];

export default function MethodsUploadPage() {
  const [title, setTitle] = useState('');
  const [materialType, setMaterialType] = useState<MethodMaterialType>('pdf');
  const [language, setLanguage] = useState('Русский');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [phase, setPhase] = useState<UploadPhase>('idle');
  const [phaseIndex, setPhaseIndex] = useState(0);

  function addTag() {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag));
  }

  function handleUpload() {
    setPhase('uploading');
    setPhaseIndex(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setPhaseIndex(i);
      if (i >= UPLOAD_PHASES.length - 1) {
        clearInterval(interval);
        setPhase('done');
      } else {
        setPhase(UPLOAD_PHASES[i].phase);
      }
    }, 900);
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/methods" className="text-sm text-slate-500 hover:text-slate-300">← Метод. база</Link>
        <h1 className="mt-1 text-2xl font-bold text-white">Загрузить материал</h1>
        <p className="mt-1 text-slate-400">ИИ извлечёт методические правила автоматически</p>
      </div>

      {phase === 'idle' && (
        <div className="card space-y-5">
          <label
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); }}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
              dragOver ? 'border-emerald-400 bg-emerald-500/10' : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <span className="text-4xl mb-3">📄</span>
            <p className="text-sm font-semibold text-white">Перетащите PDF, DOCX, книги, протоколы, чеклисты</p>
            <p className="mt-1 text-xs text-slate-500">PDF, DOCX, DOC · до 50 МБ</p>
            <input type="file" accept=".pdf,.docx,.doc" className="sr-only" />
          </label>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Название материала</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Например: ABA Therapy Basics"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Тип материала</label>
            <div className="flex flex-wrap gap-2">
              {MATERIAL_TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setMaterialType(t)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    materialType === t
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Язык</label>
            <div className="flex gap-2">
              {LANGUAGES.map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanguage(l)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${
                    language === l
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Теги</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag()}
                placeholder="Добавить тег..."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:border-slate-600"
              >
                +
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 rounded-full bg-slate-700/70 px-2.5 py-0.5 text-xs text-slate-300">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-slate-500 hover:text-slate-300">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!title.trim()}
            className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              title.trim()
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Загрузить и обработать
          </button>
        </div>
      )}

      {phase !== 'idle' && phase !== 'done' && (
        <div className="card space-y-5">
          <h2 className="text-base font-semibold text-white">Обрабатываем материал...</h2>
          <div className="space-y-3">
            {UPLOAD_PHASES.slice(0, -1).map((p, i) => (
              <div key={p.phase} className="flex items-center gap-3">
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i < phaseIndex ? 'bg-emerald-500 text-white' : i === phaseIndex ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-500'
                }`}>
                  {i < phaseIndex ? '✓' : i === phaseIndex ? '⟳' : '○'}
                </div>
                <span className={`text-sm transition-colors ${i < phaseIndex ? 'text-emerald-300' : i === phaseIndex ? 'text-white' : 'text-slate-600'}`}>
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="card space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-2xl">✅</div>
            <div>
              <p className="font-semibold text-white">Готово! 12 правил извлечено</p>
              <p className="text-xs text-slate-400">Правила отправлены на проверку методиста</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/methods"
              className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm font-semibold text-center text-slate-300 hover:border-slate-600"
            >
              К метод. базе
            </Link>
            <button
              type="button"
              onClick={() => { setPhase('idle'); setTitle(''); setTags([]); }}
              className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Загрузить ещё
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-base font-semibold text-white">Последние загрузки</h2>
        <div className="space-y-2">
          {RECENT_UPLOADS.map((u, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
              <span className="text-xl">📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{u.name}</p>
                <p className="text-xs text-slate-500">{u.date} · {TYPE_LABELS[u.type]}</p>
              </div>
              <div className="shrink-0 text-right">
                {u.status === 'done' ? (
                  <span className="text-xs text-emerald-400">{u.rulesCount} правил</span>
                ) : (
                  <span className="text-xs text-amber-400">Обрабатывается...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
