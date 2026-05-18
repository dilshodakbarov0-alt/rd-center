'use client';

import { useState } from 'react';
import type { OrchestratorOutput, AgentStep } from '@/lib/orchestrator-types';

// ── EXAMPLE PAYLOADS ───────────────────────────────────────────────────────

const EXAMPLE_CHILD = {
  id: 'child_akmal_001',
  name: 'Акмал',
  age_months: 36,
  speech_level: 3,
  language: 'uz_cyr',
  vbmapp_level: 2,
  interests: ['машинки', 'мячи'],
  sensory_notes: 'Чувствителен к громким звукам',
  confirmed_characters: ['ойи', 'ада', 'буви'],
  current_skill_keys: ['names_family', 'choose_from_2'],
};

type InputTypeName = 'session_result' | 'generate_content_card' | 'generate_content_lesson' | 'analyze_video' | 'daily_plan';

const EXAMPLE_PAYLOADS: Record<InputTypeName, object> = {
  session_result: {
    type: 'session_result',
    child: EXAMPLE_CHILD,
    session: {
      id: 'sess_demo_001',
      module: 'speech',
      game_type: 'show_correct',
      skill_key: 'names_family',
      total_trials: 10,
      independent_correct: 9,
      prompted_correct: 1,
      errors: 0,
      refusals: 0,
      no_responses: 0,
      sessions_at_current_level: 3,
      avg_response_time_ms: 2100,
      fatigue_detected: false,
      refusal_pattern: false,
      prompt_level_used: 1,
      cards_used: ['ойи', 'ада'],
    },
  },
  generate_content_card: {
    type: 'generate_content',
    child: EXAMPLE_CHILD,
    request: {
      content_type: 'card',
      params: {
        content_type: 'card',
        card_type: 'object',
        topic: 'kitob',
        label_uz: 'Китоб',
        label_ru: 'Книга',
        style: 'cartoon_clean',
        background: 'white',
      },
    },
  },
  generate_content_lesson: {
    type: 'generate_content',
    child: EXAMPLE_CHILD,
    request: {
      content_type: 'ai_lesson',
      params: {
        content_type: 'ai_lesson',
        audience: 'child',
        topic: 'Ойи китоб ўқияпти',
        speech_level: 3,
        characters: ['ойи', 'ада'],
        cards: ['китоб', 'стол'],
        duration_seconds: 20,
        language: 'uz_cyr',
      },
    },
  },
  analyze_video: {
    type: 'analyze_video',
    child: EXAMPLE_CHILD,
    video: {
      duration_seconds: 240,
      transcript: 'Мама раскладывает 2 карточки: «ойи» и «ада». Говорит: «Покажи ойи». Ждёт 4 секунды. Акмал показывает правильно. Мама: «Молодец!»',
    },
  },
  daily_plan: {
    type: 'daily_plan',
    child: EXAMPLE_CHILD,
    date: new Date().toISOString().split('T')[0],
  },
};

const INPUT_TYPE_LABELS: Record<InputTypeName, string> = {
  session_result: 'session_result — Результат занятия',
  generate_content_card: 'generate_content/card — Карточка',
  generate_content_lesson: 'generate_content/lesson — AI-урок',
  analyze_video: 'analyze_video — Анализ видео',
  daily_plan: 'daily_plan — Дневной план',
};

// ── MOCK RESPONSES ─────────────────────────────────────────────────────────

function buildMockResponse(type: InputTypeName): OrchestratorOutput {
  const base = {
    orchestrator_version: '2.0' as const,
    input_type: type === 'generate_content_card' || type === 'generate_content_lesson'
      ? 'generate_content' as const
      : type === 'session_result'
        ? 'session_result' as const
        : type === 'analyze_video'
          ? 'analyze_video' as const
          : 'daily_plan' as const,
    child_id: 'child_akmal_001',
    timestamp: new Date().toISOString(),
    safety_passed: true,
    agent_chain: [] as AgentStep[],
    parent_message: { ru: '', uz: '' },
    processing_time_ms: Math.floor(Math.random() * 800) + 300,
  };

  if (type === 'session_result') {
    const chain: AgentStep[] = [
      { agent: 'safety_filter', action: 'input_safety_check', result: 'PASSED: no safety violations', passed: true },
      { agent: 'aba_analyst', action: 'adaptive_decision', result: 'advance — independent_rate ≥ 80% × 2 sessions → advance (confidence: 0.97)', passed: true },
      { agent: 'methodologist', action: 'skill_map_update', result: 'names_family: level 1 → 2', passed: true },
      { agent: 'speech_expert', action: 'next_session_planning', result: 'who_does_what × 3 cards, prompt L0', passed: true },
      { agent: 'content_generator', action: 'game_generation', result: 'Generated who_does_what game for next session', passed: true },
    ];
    return {
      ...base,
      agent_chain: chain,
      decision: {
        action: 'advance',
        reason_ru: '90% самостоятельных ответов в 3 занятиях подряд. Переходим на следующий уровень!',
        reason_uz: '3 darsda ketma-ket 90% mustaqil javob. Keyingi darajaga o\'tamiz!',
        confidence: 0.97,
        rule_applied: 'independent_rate ≥ 80% × 2 sessions → advance',
      },
      skill_update: {
        skill_key: 'names_family',
        skill_name_ru: 'Называет членов семьи',
        previous_level: 1,
        new_level: 2,
        vbmapp_level_up: false,
      },
      next_session: {
        game_type: 'who_does_what',
        cards_count: 3,
        prompt_level: 0,
        target_cards: ['ойи', 'ада'],
        instruction_uz: 'Ким нима қиляпти?',
        instruction_ru: 'Кто что делает?',
        estimated_duration_minutes: 10,
        difficulty_change: 'increased',
      },
      parent_message: {
        ru: 'Акмал молодец! Переходим на следующий уровень. Следующее занятие: Кто что делает?.',
        uz: 'Akmal zo\'r! Keyingi darajaga o\'tamiz.',
      },
      specialist_note: 'Session sess_demo_001: 90% independent (9/10). Decision: advance. Next: who_does_what ×3 cards, prompt L0.',
    };
  }

  if (type === 'generate_content_card') {
    const chain: AgentStep[] = [
      { agent: 'safety_filter', action: 'input_safety_check', result: 'PASSED: no safety violations', passed: true },
      { agent: 'content_generator', action: 'card_generation', result: 'Card "Китоб" generated', passed: true },
    ];
    return {
      ...base,
      agent_chain: chain,
      generated_cards: [{
        id: 'card-kitob-demo',
        label_uz: 'Китоб',
        label_ru: 'Книга',
        card_type: 'object',
        image_prompt: 'Cute cartoon book, bright blue cover, white background, flat design, no text',
        style_spec: 'Flat cartoon, primary blue, centered on white canvas',
        tts_uz: 'Бу Китоб',
        tts_ru: 'Это Книга',
        phrases_uz: ['Бу Китоб', 'Китобни кўрсат', 'Китоб қаерда?'],
        phrases_ru: ['Это книга', 'Покажи книгу', 'Где книга?'],
        questions_uz: ['Бу нима?', 'Китобни топ'],
        questions_ru: ['Что это?', 'Найди книгу'],
        safety_approved: true,
      }],
      parent_message: {
        ru: 'Карточка «Книга» создана и готова к использованию.',
        uz: '«Китоб» kartochkasi yaratildi va foydalanishga tayyor.',
      },
    };
  }

  if (type === 'generate_content_lesson') {
    const chain: AgentStep[] = [
      { agent: 'safety_filter', action: 'input_safety_check', result: 'PASSED: no safety violations', passed: true },
      { agent: 'content_generator', action: 'lesson_creation', result: 'AI lesson (child, 20s) generated', passed: true },
    ];
    return {
      ...base,
      agent_chain: chain,
      generated_lesson: {
        audience: 'child',
        title_uz: 'Ойи китоб ўқияпти',
        title_ru: 'Мама читает книгу',
        total_duration_seconds: 20,
        scenes: [
          { scene_index: 0, type: 'card_intro', visual_prompt: 'Cartoon ойи character, white background', tts_text_uz: 'Бу ойи', tts_text_ru: 'Это мама', duration_seconds: 4, pause_for_response: false },
          { scene_index: 1, type: 'card_intro', visual_prompt: 'Cartoon book, white background', tts_text_uz: 'Бу китоб', tts_text_ru: 'Это книга', duration_seconds: 4, pause_for_response: false },
          { scene_index: 2, type: 'action', visual_prompt: 'Cartoon ойи holding book', tts_text_uz: 'Ойи китоб ўқияпти', tts_text_ru: 'Мама читает книгу', duration_seconds: 5, pause_for_response: false },
          { scene_index: 3, type: 'question', visual_prompt: 'Question mark cartoon', tts_text_uz: 'Ким китоб ўқияпти?', tts_text_ru: 'Кто читает книгу?', duration_seconds: 7, pause_for_response: true, pause_duration_seconds: 5 },
        ],
        full_voiceover_uz: 'Бу ойи. Бу китоб. Ойи китоб ўқияпти. Ким китоб ўқияпти?',
        full_voiceover_ru: 'Это мама. Это книга. Мама читает книгу. Кто читает книгу?',
        safety_note: 'No real personal data used. All characters are AI-generated.',
        no_personal_data_confirmed: true,
      },
      parent_message: {
        ru: 'AI-урок (20 сек) для ребёнка создан.',
        uz: 'AI-dars (20 sek) bola uchun yaratildi.',
      },
    };
  }

  if (type === 'analyze_video') {
    const chain: AgentStep[] = [
      { agent: 'safety_filter', action: 'input_safety_check', result: 'PASSED: no safety violations', passed: true },
      { agent: 'methodologist', action: 'video_analysis', result: 'Methodology rating: 4', passed: true },
      { agent: 'safety_filter', action: 'privacy_check', result: 'No personal data in output confirmed', passed: true },
    ];
    return {
      ...base,
      agent_chain: chain,
      video_analysis: {
        duration_seconds: 240,
        lesson_goal_detected: 'Обучение называнию членов семьи',
        instruction_quality: 'good',
        pause_before_prompt: true,
        pause_duration_seconds: 4,
        prompt_type_used: 'gestural',
        child_response_rate: 0.75,
        reinforcement_used: true,
        fatigue_signs: false,
        methodology_rating: 4,
        strengths: ['Чёткая инструкция', 'Пауза перед подсказкой', 'Мгновенное подкрепление'],
        improvements: ['Попробуйте сначала вербальную подсказку', 'Добавьте 3-ю карточку'],
        recommendation_ru: 'Отличная работа! Перейдите к выбору из 3 карточек.',
        recommendation_uz: 'Ajoyib ish! 3 ta kartochkadan tanlovga o\'ting.',
        suggested_next_game_type: 'show_correct',
        ai_note: 'Анализ выполнен на основе описания занятия.',
      },
      parent_message: {
        ru: 'Анализ видео завершён. Смотрите рекомендации ниже.',
        uz: 'Video tahlili yakunlandi.',
      },
      specialist_note: 'Отличная работа! Перейдите к выбору из 3 карточек.',
    };
  }

  // daily_plan
  const chain: AgentStep[] = [
    { agent: 'safety_filter', action: 'input_safety_check', result: 'PASSED: no safety violations', passed: true },
    { agent: 'orchestrator', action: 'daily_plan_generation', result: 'Daily plan generated for Акмал', passed: true },
  ];
  return {
    ...base,
    agent_chain: chain,
    daily_plan: {
      date: new Date().toISOString().split('T')[0] ?? '2026-05-18',
      child_id: 'child_akmal_001',
      sessions: [
        {
          order: 1,
          module: 'speech',
          game_type: 'show_correct',
          skill_key: 'names_family',
          target_cards: ['ойи', 'ада'],
          estimated_duration_minutes: 7,
          parent_instruction_ru: 'Разложите 2 карточки. Скажите «Покажи ойи» и ждите 5 секунд.',
          parent_instruction_uz: '2 kartochkani yoying. "Oyini ko\'rsat" deb 5 soniya kuting.',
          why_this_exercise_ru: 'Узнавание членов семьи — основа для первых фраз.',
          why_this_exercise_uz: 'Oila a\'zolarini tanish — birinchi jumlalar uchun asos.',
        },
        {
          order: 2,
          module: 'daily_skills',
          game_type: 'wash_hands',
          skill_key: 'hand_washing',
          target_cards: ['кран', 'мыло'],
          estimated_duration_minutes: 8,
          parent_instruction_ru: 'Используйте карточки в ванной. Показывайте каждый шаг.',
          parent_instruction_uz: 'Hammomda kartochkalarni ishlating. Har bir qadamni ko\'rsating.',
          why_this_exercise_ru: 'Мытьё рук — важный навык самообслуживания.',
          why_this_exercise_uz: 'Qo\'l yuvish — muhim o\'z-o\'ziga xizmat ko\'rsatish ko\'nikmasi.',
        },
      ],
      daily_tip_ru: 'Хвалите сразу! Подкрепление через 1-2 секунды — самое эффективное.',
      daily_tip_uz: 'Darhol maqtang! 1-2 soniya ichida rag\'batlantirish eng samarali.',
    },
    parent_message: {
      ru: 'План на сегодня для Акмал готов. Не забудьте похвалить!',
      uz: 'Akmal uchun bugungi reja tayyor.',
    },
  };
}

// ── COMPONENT HELPERS ──────────────────────────────────────────────────────

const AGENT_ICONS: Record<string, string> = {
  safety_filter: '🛡️',
  aba_analyst: '📊',
  methodologist: '📚',
  speech_expert: '🗣️',
  content_generator: '✨',
  orchestrator: '🧠',
  adaptive_engine: '⚙️',
};

const DECISION_COLORS: Record<string, string> = {
  advance: 'text-emerald-300 bg-emerald-900/30 border-emerald-700',
  repeat: 'text-amber-300 bg-amber-900/30 border-amber-700',
  simplify: 'text-rose-300 bg-rose-900/30 border-rose-700',
};

function AgentChainView({ steps }: { steps: AgentStep[] }) {
  return (
    <div className="space-y-1.5">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-2 rounded-lg bg-slate-800/50 px-3 py-2">
          <span className="text-base leading-none mt-0.5">{AGENT_ICONS[step.agent] ?? '🤖'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-200">{step.agent}</span>
              <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[10px] text-slate-400">{step.action}</span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400 truncate">{step.result}</p>
          </div>
          <span className={`shrink-0 text-xs font-bold ${step.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
            {step.passed ? '✓' : '✗'}
          </span>
        </div>
      ))}
    </div>
  );
}

function JsonBlock({ data, maxHeight = '300px' }: { data: unknown; maxHeight?: string }) {
  return (
    <pre
      className="overflow-auto rounded-lg bg-slate-950 p-4 text-[11px] text-slate-300 font-mono leading-relaxed"
      style={{ maxHeight }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

// ── MAIN PAGE COMPONENT ────────────────────────────────────────────────────

export default function OrchestratorConsolePage() {
  const [selectedType, setSelectedType] = useState<InputTypeName>('session_result');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<OrchestratorOutput | null>(null);
  const [showInput, setShowInput] = useState(true);

  const payload = EXAMPLE_PAYLOADS[selectedType];

  async function handleRun() {
    setIsRunning(true);
    setOutput(null);
    // Simulate 1.5s delay for mock
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = buildMockResponse(selectedType);
    setOutput(result);
    setIsRunning(false);
    setShowInput(false);
  }

  const decision = output?.decision;
  const decisionColor = decision ? (DECISION_COLORS[decision.action] ?? 'text-slate-300') : '';

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Orchestrator v2.0</h1>
          <p className="mt-1 text-sm text-slate-400">Тестовая консоль — интерактивное тестирование всех типов запросов</p>
        </div>
        <a
          href="/api/orchestrator"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-600 transition-colors"
        >
          GET /api/orchestrator ↗
        </a>
      </div>

      {/* Agent architecture overview */}
      <div className="card">
        <h2 className="mb-3 text-sm font-semibold text-white">Цепочка агентов</h2>
        <div className="flex flex-wrap gap-2 text-[11px]">
          {[
            { icon: '🛡️', name: 'safety_filter', desc: 'Фильтр безопасности' },
            { icon: '📊', name: 'aba_analyst', desc: 'ABA-аналитик' },
            { icon: '📚', name: 'methodologist', desc: 'Методист' },
            { icon: '🗣️', name: 'speech_expert', desc: 'Речевой эксперт' },
            { icon: '✨', name: 'content_generator', desc: 'Генератор контента' },
            { icon: '🧠', name: 'orchestrator', desc: 'Оркестратор' },
          ].map(a => (
            <div key={a.name} className="flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5">
              <span>{a.icon}</span>
              <span className="font-mono text-slate-300">{a.name}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{a.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left panel: Input */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-white">Тип запроса</h2>

          <div className="space-y-2">
            {(Object.entries(INPUT_TYPE_LABELS) as [InputTypeName, string][]).map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="radio"
                  name="input_type"
                  value={key}
                  checked={selectedType === key}
                  onChange={() => {
                    setSelectedType(key);
                    setOutput(null);
                    setShowInput(true);
                  }}
                  className="mt-0.5 accent-violet-500"
                />
                <div>
                  <span className="text-xs font-semibold text-white">{label}</span>
                </div>
              </label>
            ))}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Пример запроса</span>
              <button
                onClick={() => setShowInput(v => !v)}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                {showInput ? 'Скрыть' : 'Показать'}
              </button>
            </div>
            {showInput && <JsonBlock data={payload} maxHeight="340px" />}
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {isRunning ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Обработка…
              </span>
            ) : (
              'Запустить →'
            )}
          </button>
        </div>

        {/* Right panel: Output */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-white">Результат оркестратора</h2>

          {!output && !isRunning && (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 py-16 text-slate-600 text-sm">
              Нажмите «Запустить» для получения результата
            </div>
          )}

          {isRunning && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
              <p className="text-sm text-slate-400">Агенты обрабатывают запрос…</p>
            </div>
          )}

          {output && (
            <div className="space-y-4">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-900/40 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                  v{output.orchestrator_version}
                </span>
                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-slate-400">
                  {output.input_type}
                </span>
                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-slate-400">
                  {output.processing_time_ms}ms
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${output.safety_passed ? 'bg-emerald-900/40 text-emerald-400' : 'bg-rose-900/40 text-rose-400'}`}>
                  {output.safety_passed ? '✓ Safe' : '✗ Blocked'}
                </span>
              </div>

              {/* Adaptive Decision */}
              {output.decision && (
                <div className={`rounded-lg border px-4 py-3 ${decisionColor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wide">
                      {output.decision.action === 'advance' ? '⬆ Усложняем' : output.decision.action === 'simplify' ? '⬇ Упрощаем' : '↻ Повторяем'}
                    </span>
                    <span className="ml-auto text-[11px] opacity-70">conf. {(output.decision.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-xs">{output.decision.reason_ru}</p>
                  <p className="mt-1 text-[10px] font-mono opacity-60">{output.decision.rule_applied}</p>
                </div>
              )}

              {/* Skill Update */}
              {output.skill_update && (
                <div className="rounded-lg bg-slate-800/50 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-300 mb-1">Обновление навыка</p>
                  <p className="text-xs text-slate-400">{output.skill_update.skill_name_ru}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="rounded bg-slate-700 px-2 py-0.5 text-[11px] text-slate-300">
                      Уровень {output.skill_update.previous_level}
                    </span>
                    <span className="text-slate-500">→</span>
                    <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${output.skill_update.new_level > output.skill_update.previous_level ? 'bg-emerald-900/40 text-emerald-300' : output.skill_update.new_level < output.skill_update.previous_level ? 'bg-rose-900/40 text-rose-300' : 'bg-slate-700 text-slate-300'}`}>
                      Уровень {output.skill_update.new_level}
                    </span>
                    {output.skill_update.vbmapp_level_up && (
                      <span className="rounded bg-violet-900/40 px-2 py-0.5 text-[10px] text-violet-300 font-semibold">VB-MAPP ↑</span>
                    )}
                  </div>
                </div>
              )}

              {/* Next Session */}
              {output.next_session && (
                <div className="rounded-lg bg-slate-800/50 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-300 mb-2">Следующее занятие</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-400">
                    <span>Игра:</span><span className="text-white">{output.next_session.game_type}</span>
                    <span>Карточек:</span><span className="text-white">{output.next_session.cards_count}</span>
                    <span>Подсказка:</span><span className="text-white">L{output.next_session.prompt_level}</span>
                    <span>Сложность:</span>
                    <span className={
                      output.next_session.difficulty_change === 'increased' ? 'text-emerald-400' :
                      output.next_session.difficulty_change === 'decreased' ? 'text-rose-400' : 'text-slate-300'
                    }>
                      {output.next_session.difficulty_change}
                    </span>
                    <span>Инструкция:</span><span className="text-white">{output.next_session.instruction_ru}</span>
                  </div>
                </div>
              )}

              {/* Generated Card preview */}
              {output.generated_cards && output.generated_cards.length > 0 && (
                <div className="rounded-lg bg-slate-800/50 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-300 mb-2">Сгенерированная карточка</p>
                  {output.generated_cards.map(card => (
                    <div key={card.id} className="space-y-1 text-[11px]">
                      <div className="flex gap-2 items-center">
                        <span className="font-semibold text-white">{card.label_uz}</span>
                        <span className="text-slate-500">/</span>
                        <span className="text-slate-300">{card.label_ru}</span>
                        <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${card.safety_approved ? 'bg-emerald-900/40 text-emerald-400' : 'bg-rose-900/40 text-rose-400'}`}>
                          {card.safety_approved ? '✓ Safe' : '✗ Review'}
                        </span>
                      </div>
                      <p className="text-slate-400 italic">{card.image_prompt}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Generated Lesson preview */}
              {output.generated_lesson && (
                <div className="rounded-lg bg-slate-800/50 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-300 mb-2">
                    AI-урок — {output.generated_lesson.title_ru} ({output.generated_lesson.total_duration_seconds}s)
                  </p>
                  <div className="space-y-1">
                    {output.generated_lesson.scenes.map((scene, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        <span className="w-4 shrink-0 rounded bg-slate-700 text-center text-[10px] text-slate-400">{i + 1}</span>
                        <span className="rounded bg-violet-900/30 px-1.5 text-violet-300 text-[10px]">{scene.type}</span>
                        <span className="text-slate-400 truncate">{scene.tts_text_ru}</span>
                        <span className="shrink-0 text-slate-600">{scene.duration_seconds}s</span>
                        {scene.pause_for_response && <span className="shrink-0 text-amber-400 text-[10px]">⏸</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Analysis */}
              {output.video_analysis && (
                <div className="rounded-lg bg-slate-800/50 px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-semibold text-slate-300">Анализ видео</p>
                    <span className="ml-auto flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`text-xs ${i < output.video_analysis!.methodology_rating ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
                      ))}
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-400">
                    <p><span className="text-emerald-400">Сильные стороны:</span> {output.video_analysis.strengths.join(' · ')}</p>
                    <p><span className="text-amber-400">Улучшения:</span> {output.video_analysis.improvements.join(' · ')}</p>
                  </div>
                </div>
              )}

              {/* Daily Plan */}
              {output.daily_plan && (
                <div className="rounded-lg bg-slate-800/50 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-300 mb-2">Дневной план — {output.daily_plan.date}</p>
                  <div className="space-y-2">
                    {output.daily_plan.sessions.map(s => (
                      <div key={s.order} className="flex gap-2.5 text-[11px]">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-800 text-[10px] font-bold text-white">{s.order}</span>
                        <div>
                          <p className="text-white">{s.module} · {s.game_type} · {s.estimated_duration_minutes}мин</p>
                          <p className="text-slate-400">{s.parent_instruction_ru}</p>
                        </div>
                      </div>
                    ))}
                    <p className="mt-2 text-[11px] text-amber-300 border-t border-slate-700 pt-2">
                      Совет: {output.daily_plan.daily_tip_ru}
                    </p>
                  </div>
                </div>
              )}

              {/* Agent Chain */}
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-400">Цепочка агентов</p>
                <AgentChainView steps={output.agent_chain} />
              </div>

              {/* Parent Message */}
              {(output.parent_message.ru || output.parent_message.uz) && (
                <div className="rounded-lg border border-emerald-800/40 bg-emerald-900/20 px-4 py-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-500">Сообщение родителю</p>
                  {output.parent_message.ru && <p className="text-xs text-emerald-200">{output.parent_message.ru}</p>}
                  {output.parent_message.uz && <p className="mt-0.5 text-[11px] text-emerald-400/70 italic">{output.parent_message.uz}</p>}
                </div>
              )}

              {/* Specialist Note */}
              {output.specialist_note && (
                <div className="rounded-lg border border-blue-800/40 bg-blue-900/20 px-4 py-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-blue-500">Заметка специалиста</p>
                  <p className="text-[11px] font-mono text-blue-200">{output.specialist_note}</p>
                </div>
              )}

              {/* Full JSON toggle */}
              <details className="group">
                <summary className="cursor-pointer list-none text-[11px] text-slate-500 hover:text-slate-300">
                  <span className="group-open:hidden">▶ Показать полный JSON</span>
                  <span className="hidden group-open:inline">▼ Скрыть JSON</span>
                </summary>
                <div className="mt-2">
                  <JsonBlock data={output} maxHeight="400px" />
                </div>
              </details>
            </div>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-3 text-xs">
        <a href="/api/orchestrator/demo" target="_blank" className="rounded-lg bg-slate-800 px-3 py-2 text-slate-400 hover:text-slate-200 transition-colors">
          GET /api/orchestrator/demo ↗
        </a>
        <a href="/admin" className="rounded-lg bg-slate-800 px-3 py-2 text-slate-400 hover:text-slate-200 transition-colors">
          ← Назад к панели
        </a>
      </div>
    </section>
  );
}
