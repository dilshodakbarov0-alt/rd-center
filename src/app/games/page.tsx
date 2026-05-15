import Link from 'next/link';
import type { GameType } from '@/lib/types';

type GameMeta = {
  type: GameType;
  icon: string;
  titleRu: string;
  titleUz: string;
  description: string;
  domain: string;
  domainColor: string;
  level: number;
};

const GAMES: GameMeta[] = [
  {
    type: 'show_correct',
    icon: '👁️',
    titleRu: 'Покажи правильно',
    titleUz: "To'g'ri ko'rsat",
    description: 'Понимание речи: выбери названную карточку',
    domain: 'речь',
    domainColor: 'bg-blue-500/15 text-blue-300',
    level: 1,
  },
  {
    type: 'build_phrase',
    icon: '🧩',
    titleRu: 'Собери фразу',
    titleUz: "Ibora tuz",
    description: 'Фразовая речь: выбери слова по порядку',
    domain: 'речь',
    domainColor: 'bg-blue-500/15 text-blue-300',
    level: 2,
  },
  {
    type: 'who_does_what',
    icon: '🎬',
    titleRu: 'Ким нима қиляпти?',
    titleUz: 'Kim nima qilyapti?',
    description: 'Понимание действий: кто что делает',
    domain: 'речь',
    domainColor: 'bg-blue-500/15 text-blue-300',
    level: 2,
  },
  {
    type: 'repeat_after_me',
    icon: '🤲',
    titleRu: 'Повтори за мной',
    titleUz: "Menga ergash",
    description: 'Подражание: повтори жест или слово',
    domain: 'подражание',
    domainColor: 'bg-violet-500/15 text-violet-300',
    level: 1,
  },
  {
    type: 'find_same',
    icon: '🔍',
    titleRu: 'Найди такой же',
    titleUz: "Shunday topib ber",
    description: 'Внимание и сопоставление карточек',
    domain: 'внимание',
    domainColor: 'bg-amber-500/15 text-amber-300',
    level: 1,
  },
  {
    type: 'sort_groups',
    icon: '📦',
    titleRu: 'Разложи по группам',
    titleUz: "Guruhlarga ajrat",
    description: 'Категории и логическое мышление',
    domain: 'внимание',
    domainColor: 'bg-amber-500/15 text-amber-300',
    level: 2,
  },
  {
    type: 'wash_hands',
    icon: '🫧',
    titleRu: 'Моем руки',
    titleUz: "Qo'l yuvamiz",
    description: 'Бытовой навык по шагам',
    domain: 'быт',
    domainColor: 'bg-teal-500/15 text-teal-300',
    level: 1,
  },
  {
    type: 'come_here',
    icon: '🚶',
    titleRu: 'Иди сюда',
    titleUz: "Bu yerga kel",
    description: 'Безопасность: реагирование на команды',
    domain: 'безопасность',
    domainColor: 'bg-red-500/15 text-red-300',
    level: 1,
  },
  {
    type: 'emotions',
    icon: '😊',
    titleRu: 'Эмоции',
    titleUz: "His-tuyg'ular",
    description: 'Узнавание и называние эмоций',
    domain: 'эмоции',
    domainColor: 'bg-yellow-500/15 text-yellow-300',
    level: 1,
  },
  {
    type: 'social_story',
    icon: '📖',
    titleRu: 'Социальная история',
    titleUz: "Ijtimoiy hikoya",
    description: 'Понимание социальных ситуаций',
    domain: 'эмоции',
    domainColor: 'bg-yellow-500/15 text-yellow-300',
    level: 3,
  },
];

const LEVEL_TABS = [
  { key: 'all', label: 'Все' },
  { key: '1', label: 'Уровень 1' },
  { key: '2', label: 'Уровень 2' },
  { key: '3', label: 'Уровень 3' },
];

export default function GamesPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Игры и упражнения</h1>
          <p className="mt-1 text-slate-400">10 типов игр · адаптированы по VB-MAPP</p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
        >
          + Создать игру
        </button>
      </div>

      <div className="flex gap-2">
        {LEVEL_TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 transition-colors hover:border-slate-600 first:border-emerald-500/40 first:bg-emerald-500/10 first:text-emerald-200"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map(game => (
          <div key={game.type} className="card flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl leading-none">{game.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white leading-tight">{game.titleRu}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{game.titleUz}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{game.description}</p>

            <div className="flex items-center justify-between">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${game.domainColor}`}>
                {game.domain}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${i < game.level ? 'bg-emerald-400' : 'bg-slate-700'}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-auto">
              <Link
                href={`/games/${game.type}`}
                className="flex flex-1 items-center justify-center rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
              >
                Играть
              </Link>
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-lg border border-slate-700 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600"
              >
                Настроить
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
