import Link from "next/link";
import { EmotionCard, type Emotion } from "@/components/EmotionCard";
import { getSkillsByDomain } from "@/lib/vbmapp-skills";

// ─── Mock child skill data (level achieved) ───────────────────────────────────

const MOCK_SKILL_LEVELS: Record<string, number> = {
  happy:  2,   // recognizes + names with prompt
  sad:    2,
  angry:  1,
  scared: 1,
  tired:  0,
  proud:  0,
  sick:   0,
};

const EMOTIONS: { emotion: Emotion; vbmappLevelUnlocked: 1 | 2 | 3 }[] = [
  { emotion: "happy",  vbmappLevelUnlocked: 1 },
  { emotion: "sad",    vbmappLevelUnlocked: 1 },
  { emotion: "angry",  vbmappLevelUnlocked: 2 },
  { emotion: "scared", vbmappLevelUnlocked: 2 },
  { emotion: "tired",  vbmappLevelUnlocked: 2 },
  { emotion: "proud",  vbmappLevelUnlocked: 3 },
  { emotion: "sick",   vbmappLevelUnlocked: 3 },
];

// ─── VB-MAPP milestones ────────────────────────────────────────────────────────

const VBMAPP_MILESTONES = [
  {
    level: 1,
    labelRu: "Уровень 1: Узнаёт 2 эмоции",
    labelUz: "2 ta his-tuyg'uni taniydi",
    achieved: true,
  },
  {
    level: 2,
    labelRu: "Уровень 2: Узнаёт 5 эмоций",
    labelUz: "5 ta his-tuyg'uni taniydi",
    achieved: true,
  },
  {
    level: 3,
    labelRu: "Уровень 3: Называет эмоции словами",
    labelUz: "His-tuyg'ularini so'zda ifodalaydi",
    achieved: false,
  },
] as const;

// How many emotions are "confirmed" (level >= 1)
const confirmedCount = Object.values(MOCK_SKILL_LEVELS).filter((v) => v >= 1).length;
const totalEmotions = EMOTIONS.length;
const progressPct = Math.round((confirmedCount / totalEmotions) * 100);

// ─── Component ────────────────────────────────────────────────────────────────

export default function EmotionsPage() {
  // Fetch emotion-domain skills for display
  const emotionSkills = getSkillsByDomain("emotions");

  return (
    <section className="space-y-10">
      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-semibold text-white">
          Эмоции{" "}
          <span className="text-slate-500 font-normal text-2xl">/ His-tuyg&apos;ular</span>
        </h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Учим ребёнка узнавать и называть 7 базовых эмоций. По методике Энди Бонди (PECS) —
          одна эмоция на карточке, чистый фон, крупное изображение.
        </p>
      </div>

      {/* ── VB-MAPP progress ── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <h2 className="text-base font-semibold text-white">
          Прогресс по VB-MAPP — домен «Эмоции»
        </h2>

        {/* Milestone badges */}
        <div className="flex flex-wrap gap-3">
          {VBMAPP_MILESTONES.map((m) => (
            <div
              key={m.level}
              className={[
                "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold border",
                m.achieved
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  : "bg-slate-800 border-slate-700 text-slate-500",
              ].join(" ")}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  m.achieved ? "bg-emerald-400" : "bg-slate-600"
                }`}
              />
              {m.labelRu}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div>
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>Освоено эмоций</span>
            <span>{confirmedCount} / {totalEmotions}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Skill keys table */}
        <details className="group">
          <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-300 transition-colors">
            Навыки VB-MAPP в этом домене ({emotionSkills.length}) ▸
          </summary>
          <div className="mt-3 space-y-1.5">
            {emotionSkills.map((skill) => (
              <div
                key={skill.key}
                className="flex items-center gap-3 rounded-lg bg-slate-800/50 px-3 py-2 text-sm"
              >
                <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs font-bold text-slate-400">
                  L{skill.level}
                </span>
                <span className="text-slate-300">{skill.nameRu}</span>
                <span className="text-slate-600 text-xs ml-auto">{skill.nameUz}</span>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* ── Emotion cards grid ── */}
      <div>
        <h2 className="mb-5 text-lg font-semibold text-white">
          7 базовых эмоций
          <span className="ml-2 text-sm font-normal text-slate-500">/ 7 ta asosiy his-tuyg&apos;u</span>
        </h2>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {EMOTIONS.map(({ emotion, vbmappLevelUnlocked }) => {
            const skillLevel = MOCK_SKILL_LEVELS[emotion] ?? 0;

            return (
              <div key={emotion} className="flex flex-col items-center gap-3">
                <EmotionCard emotion={emotion} size="lg" language="ru" />

                {/* VB-MAPP level badge */}
                <span
                  className={[
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    vbmappLevelUnlocked === 1
                      ? "bg-sky-500/15 text-sky-300"
                      : vbmappLevelUnlocked === 2
                      ? "bg-amber-500/15 text-amber-300"
                      : "bg-purple-500/15 text-purple-300",
                  ].join(" ")}
                >
                  VB {vbmappLevelUnlocked}
                </span>

                {/* Skill progress dots */}
                <div className="flex gap-1">
                  {[1, 2, 3].map((lvl) => (
                    <div
                      key={lvl}
                      className={`h-2 w-2 rounded-full ${
                        skillLevel >= lvl ? "bg-emerald-400" : "bg-slate-700"
                      }`}
                      title={`Уровень ${lvl}`}
                    />
                  ))}
                </div>

                {/* Start session button */}
                <Link
                  href="/sessions/demo"
                  className="w-full rounded-lg bg-emerald-500/15 px-2 py-1.5 text-center text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-colors"
                >
                  Начать занятие
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Methodology note ── */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 px-5 py-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-300">
          Методика: Энди Бонди — PECS / Карточки эмоций
        </h3>
        <ul className="space-y-1 text-sm text-slate-500 list-disc list-inside">
          <li>Одна эмоция на карточку — без визуальной перегрузки (Айрес)</li>
          <li>Уровень 1: выбрать из 2 → Уровень 2: выбрать из 3 → Уровень 3: назвать</li>
          <li>Мультяшные лица — простые, узнаваемые, без реалистичных фото</li>
          <li>Цвет карточки = эмоция (жёлтый=радость, синий=грусть, красный=злость…)</li>
        </ul>
      </div>
    </section>
  );
}
