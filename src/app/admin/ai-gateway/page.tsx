'use client';
import { useState } from 'react';
import type { AIProvider, AITaskType } from '@/lib/types';

const TASK_PROVIDER_MAP: Record<AITaskType, AIProvider[]> = {
  card_generation: ['openai', 'gemini', 'anthropic'],
  game_generation: ['anthropic', 'openai', 'gemini'],
  lesson_creation: ['anthropic', 'openai', 'gemini'],
  video_analysis: ['gemini', 'openai'],
  character_generation: ['openai', 'gemini'],
  tts: ['openai', 'gemini'],
  stt: ['openai'],
  safety_check: ['anthropic', 'openai'],
  method_extraction: ['anthropic', 'openai', 'gemini'],
};

const TASK_LABELS: Record<AITaskType, string> = {
  card_generation: 'Генерация карточек',
  game_generation: 'Генерация игр',
  lesson_creation: 'Создание уроков',
  video_analysis: 'Анализ видео',
  character_generation: 'Создание персонажей',
  tts: 'Синтез речи (TTS)',
  stt: 'Распознавание речи (STT)',
  safety_check: 'Проверка безопасности',
  method_extraction: 'Извлечение правил',
};

const PROVIDER_COLORS: Record<AIProvider, string> = {
  openai: 'text-emerald-300',
  anthropic: 'text-amber-300',
  gemini: 'text-blue-300',
  local: 'text-slate-400',
};

type ProviderConfig = {
  key: AIProvider;
  name: string;
  enabled: boolean;
  apiKey: string;
  rateLimit: number;
  monthlyBudget: number;
  usage: number;
  color: string;
};

const INITIAL_PROVIDERS: ProviderConfig[] = [
  { key: 'openai', name: 'OpenAI GPT-4o', enabled: true, apiKey: 'sk-...abc1', rateLimit: 100, monthlyBudget: 20, usage: 62, color: 'bg-emerald-500' },
  { key: 'anthropic', name: 'Anthropic Claude', enabled: true, apiKey: 'sk-ant-...def2', rateLimit: 50, monthlyBudget: 15, usage: 55, color: 'bg-amber-500' },
  { key: 'gemini', name: 'Google Gemini', enabled: true, apiKey: 'AIza...ghi3', rateLimit: 80, monthlyBudget: 10, usage: 28, color: 'bg-blue-500' },
  { key: 'local', name: 'Local Model', enabled: false, apiKey: 'localhost:8080', rateLimit: 200, monthlyBudget: 0, usage: 0, color: 'bg-slate-500' },
];

const SAFETY_FILTERS = [
  { key: 'medical_diagnosis', label: 'Блокировать медицинские диагнозы' },
  { key: 'medications', label: 'Блокировать назначения лекарств' },
  { key: 'personal_data', label: 'Блокировать личные данные' },
  { key: 'scary_content', label: 'Блокировать пугающий контент' },
];

export default function AIGatewayPage() {
  const [providers, setProviders] = useState<ProviderConfig[]>(INITIAL_PROVIDERS);
  const [safetyFilters, setSafetyFilters] = useState<Record<string, boolean>>(
    Object.fromEntries(SAFETY_FILTERS.map(f => [f.key, true]))
  );
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [autoFallback, setAutoFallback] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(80);

  function toggleProvider(key: AIProvider) {
    setProviders(prev => prev.map(p => p.key === key ? { ...p, enabled: !p.enabled } : p));
  }

  function toggleSafety(key: string) {
    setSafetyFilters(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Gateway — Конфигурация</h1>
        <p className="mt-1 text-slate-400">Управление провайдерами и маршрутизацией задач</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {providers.map(provider => (
          <div key={provider.key} className="card space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${provider.enabled ? provider.color : 'bg-slate-600'}`} />
                <h3 className={`font-semibold ${PROVIDER_COLORS[provider.key]}`}>{provider.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => toggleProvider(provider.key)}
                className={`relative h-5 w-9 rounded-full transition-colors ${provider.enabled ? 'bg-emerald-500' : 'bg-slate-600'}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${provider.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500">API ключ</label>
              <div className="flex gap-2">
                <input
                  type={editingKey === provider.key ? 'text' : 'password'}
                  value={provider.apiKey}
                  readOnly={editingKey !== provider.key}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-300 focus:border-emerald-500/50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setEditingKey(editingKey === provider.key ? null : provider.key)}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:border-slate-600"
                >
                  {editingKey === provider.key ? 'Сохранить' : 'Изменить'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500">Лимит запросов/мин</label>
                <p className="mt-0.5 text-sm font-semibold text-white">{provider.rateLimit}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500">Лимит в месяц ($)</label>
                <p className="mt-0.5 text-sm font-semibold text-white">{provider.monthlyBudget}</p>
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-500">Использование</span>
                <span className="text-slate-300">{provider.usage}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    provider.usage > 80 ? 'bg-red-500' : provider.usage > 60 ? 'bg-amber-500' : provider.color
                  }`}
                  style={{ width: `${provider.usage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-white">Маршрутизация задач</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Задача</th>
                <th>1-й провайдер</th>
                <th>2-й (резерв)</th>
                <th>3-й (резерв)</th>
              </tr>
            </thead>
            <tbody>
              {(Object.entries(TASK_PROVIDER_MAP) as Array<[AITaskType, AIProvider[]]>).map(([task, provs]) => (
                <tr key={task}>
                  <td className="py-3 text-slate-300">{TASK_LABELS[task]}</td>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <td key={i} className="py-3">
                      {provs[i] ? (
                        <span className={`text-xs font-semibold ${PROVIDER_COLORS[provs[i]]}`}>
                          {provs[i]}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-700">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-white">Фильтры безопасности</h2>
        <div className="space-y-2">
          {SAFETY_FILTERS.map(f => (
            <label key={f.key} className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-700 px-3 py-2.5 hover:border-slate-600">
              <span className="text-sm text-slate-200">{f.label}</span>
              <button
                type="button"
                onClick={() => toggleSafety(f.key)}
                className={`relative h-5 w-9 rounded-full transition-colors ${safetyFilters[f.key] ? 'bg-emerald-500' : 'bg-slate-600'}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${safetyFilters[f.key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-white">Контроль затрат</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-700 px-3 py-2.5">
            <div>
              <p className="text-sm text-slate-200">Автоматический переход к резервному</p>
              <p className="text-xs text-slate-500">При ошибке — автоматически использовать следующий провайдер</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoFallback(!autoFallback)}
              className={`relative h-5 w-9 rounded-full transition-colors ${autoFallback ? 'bg-emerald-500' : 'bg-slate-600'}`}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${autoFallback ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500">Порог оповещения (% от бюджета): {alertThreshold}%</label>
            <input
              type="range"
              min={50}
              max={95}
              value={alertThreshold}
              onChange={e => setAlertThreshold(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
