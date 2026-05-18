import { NextResponse } from 'next/server';
import type { OrchestratorInput, OrchestratorOutput } from '@/lib/orchestrator-types';

// ── EXAMPLE INPUTS ─────────────────────────────────────────────────────────

const EXAMPLE_CHILD = {
  id: 'child_akmal_001',
  name: 'Акмал',
  age_months: 36,
  speech_level: 3 as const,
  language: 'uz_cyr' as const,
  vbmapp_level: 2 as const,
  interests: ['машинки', 'мячи', 'мультфильмы'],
  sensory_notes: 'Чувствителен к громким звукам',
  behavioral_notes: 'Лучше работает в первой половине дня',
  confirmed_characters: ['ойи', 'ада', 'буви'],
  current_skill_keys: ['names_family', 'choose_from_2', 'two_word_phrase'],
};

const EXAMPLE_INPUTS: Record<string, OrchestratorInput> = {
  session_result: {
    type: 'session_result',
    child: EXAMPLE_CHILD,
    session: {
      id: 'sess_20260518_001',
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
        include_action: false,
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
      transcript: `Мама раскладывает 2 карточки: «ойи» и «ада». Говорит: «Акмал, покажи ойи». Ждёт 4 секунды. Акмал показывает на карточку с ойи. Мама сразу говорит: «Молодец! Правильно!» и даёт наклейку. Затем: «Покажи ада». Акмал не отвечает 3 секунды. Мама указывает жестом на карточку ада. Акмал смотрит и показывает. Мама: «Хорошо!». Занятие продолжается 12 минут, 8 попыток, 6 правильных самостоятельно.`,
      description: 'Домашнее занятие по карточкам, мама проводит занятие с ребёнком на диване',
    },
  },

  method_extract: {
    type: 'method_extract',
    material_title: 'VB-MAPP: Verbal Behavior Milestones Assessment and Placement Program',
    material_type: 'protocol',
    content_excerpt: `The prompt hierarchy in ABA therapy follows a specific sequence from most-to-least intrusive: physical guidance → model prompt → gestural prompt → verbal prompt → no prompt. The therapist should always begin with the least intrusive prompt necessary for success. After a correct response, reinforcement should be delivered immediately — within 1-2 seconds. Sessions should not exceed 10-15 minutes for young children to prevent fatigue and maintain high motivation. Advancement criteria: 80% or more independent correct responses across 3 consecutive sessions before moving to the next skill level.`,
  },

  daily_plan: {
    type: 'daily_plan',
    child: EXAMPLE_CHILD,
    date: new Date().toISOString().split('T')[0] ?? '2026-05-18',
  },
};

// ── EXAMPLE OUTPUTS ────────────────────────────────────────────────────────

const EXAMPLE_OUTPUTS: Record<string, OrchestratorOutput> = {
  session_result: {
    orchestrator_version: '2.0',
    input_type: 'session_result',
    child_id: 'child_akmal_001',
    timestamp: '2026-05-18T09:30:00.000Z',
    safety_passed: true,
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
      target_cards: ['ойи', 'ада', 'буви'],
      instruction_uz: 'Ким нима қиляпти?',
      instruction_ru: 'Кто что делает?',
      estimated_duration_minutes: 10,
      difficulty_change: 'increased',
    },
    generated_game: {
      game_type: 'who_does_what',
      title_uz: 'Ким нима қиляпти?',
      title_ru: 'Кто что делает?',
      instruction_uz: 'Ким нима қиляпти?',
      instruction_ru: 'Кто что делает?',
      hint_uz: 'Яхшилаб қара',
      hint_ru: 'Посмотри внимательно',
      praise_uz: ['Баракалла!', 'Жуда яхши!', 'Зўр!'],
      praise_ru: ['Молодец!', 'Отлично!', 'Умница!'],
      cards_on_screen: 3,
      target_card_label: 'ойи',
      distractor_labels: ['ада', 'буви'],
      prompt_sequence: ['Подожди 3 секунды', 'Скажи название', 'Укажи жестом', 'Помоги рукой'],
      success_criteria: '80%+ independent in 2 consecutive sessions',
      trials_required: 10,
      complexity_rule: 'If ≥80% independent for 2 sessions → increase cards from 3 to 4',
      simplification_rule: 'If <40% or refusals ≥3 → decrease cards from 3 to 2',
      tts_scripts: {
        instruction: { uz: 'Ким нима қиляпти?', ru: 'Кто что делает?' },
        hint: { uz: 'Яна бир марта', ru: 'Ещё раз' },
        correct: { uz: 'Баракалла! Тўғри!', ru: 'Молодец! Правильно!' },
        incorrect: { uz: 'Яна ур. Қара.', ru: 'Попробуй снова. Смотри.' },
        pause_cue: { uz: '...', ru: '...' },
      },
    },
    parent_message: {
      ru: 'Акмал молодец! Переходим на следующий уровень. Следующее занятие: Кто что делает?.',
      uz: 'Akmal zo\'r! Keyingi darajaga o\'tamiz. Keyingi mashg\'ulot: Kim nima qilyapti?.',
    },
    specialist_note: 'Session sess_20260518_001: 90% independent (9/10). Decision: advance. Rule: independent_rate ≥ 80% × 2 sessions → advance. Next: who_does_what ×3 cards, prompt L0.',
    agent_chain: [
      { agent: 'safety_filter', action: 'input_safety_check', result: 'PASSED: no safety violations', passed: true },
      { agent: 'aba_analyst', action: 'adaptive_decision', result: 'advance — independent_rate ≥ 80% × 2 sessions → advance (confidence: 0.97)', passed: true },
      { agent: 'methodologist', action: 'skill_map_update', result: 'names_family: level 1 → 2', passed: true },
      { agent: 'speech_expert', action: 'next_session_planning', result: 'who_does_what × 3 cards, prompt L0', passed: true },
      { agent: 'content_generator', action: 'game_generation', result: 'Generated who_does_what game for next session', passed: true },
    ],
    processing_time_ms: 342,
  },

  generate_content_card: {
    orchestrator_version: '2.0',
    input_type: 'generate_content',
    child_id: 'child_akmal_001',
    timestamp: '2026-05-18T09:31:00.000Z',
    safety_passed: true,
    generated_cards: [
      {
        id: 'card-uuid-kitob-001',
        label_uz: 'Китоб',
        label_ru: 'Книга',
        card_type: 'object',
        image_prompt: 'Cute cartoon book, closed, bright blue cover, simple flat design, white background, no text on cover, child-friendly, large clear shape',
        style_spec: 'Flat cartoon style, primary blue color, rounded corners, no shadows, centered on white canvas',
        tts_uz: 'Бу Китоб',
        tts_ru: 'Это Книга',
        phrases_uz: ['Бу Китоб', 'Китобни кўрсат', 'Китоб қаерда?'],
        phrases_ru: ['Это Книга', 'Покажи Книга', 'Где Книга?'],
        questions_uz: ['Бу нима?', 'Китобни топ'],
        questions_ru: ['Что это?', 'Найди Книга'],
        safety_approved: true,
      },
    ],
    parent_message: {
      ru: 'Карточка «Книга» создана и готова к использованию.',
      uz: '«Китоб» kartochkasi yaratildi va foydalanishga tayyor.',
    },
    agent_chain: [
      { agent: 'safety_filter', action: 'input_safety_check', result: 'PASSED: no safety violations', passed: true },
      { agent: 'content_generator', action: 'card_generation', result: 'Card "Китоб" generated', passed: true },
    ],
    processing_time_ms: 876,
  },

  analyze_video: {
    orchestrator_version: '2.0',
    input_type: 'analyze_video',
    child_id: 'child_akmal_001',
    timestamp: '2026-05-18T09:35:00.000Z',
    safety_passed: true,
    video_analysis: {
      duration_seconds: 240,
      lesson_goal_detected: 'Обучение называнию членов семьи по карточкам',
      instruction_quality: 'good',
      pause_before_prompt: true,
      pause_duration_seconds: 4,
      prompt_type_used: 'gestural',
      child_response_rate: 0.75,
      reinforcement_used: true,
      fatigue_signs: false,
      methodology_rating: 4,
      strengths: [
        'Чёткая короткая инструкция (1-2 слова)',
        'Пауза 4 секунды перед жестовой подсказкой',
        'Немедленное подкрепление после правильного ответа',
      ],
      improvements: [
        'Попробуйте сначала вербальную подсказку, затем жестовую',
        'Можно добавить 3-ю карточку для усложнения',
      ],
      recommendation_ru: 'Отличная работа! Перейдите к выбору из 3 карточек на следующем занятии.',
      recommendation_uz: 'Ajoyib ish! Keyingi mashg\'ulotda 3 ta kartochkadan tanlovga o\'ting.',
      suggested_next_game_type: 'show_correct',
      ai_note: 'Анализ выполнен на основе описания занятия. Оценивается только методология.',
    },
    parent_message: {
      ru: 'Анализ видео завершён. Смотрите рекомендации методиста ниже.',
      uz: 'Video tahlili yakunlandi. Quyidagi metodist tavsiyalarini ko\'ring.',
    },
    specialist_note: 'Отличная работа! Перейдите к выбору из 3 карточек на следующем занятии.',
    agent_chain: [
      { agent: 'safety_filter', action: 'input_safety_check', result: 'PASSED: no safety violations', passed: true },
      { agent: 'methodologist', action: 'video_analysis', result: 'Methodology rating: 4', passed: true },
      { agent: 'safety_filter', action: 'privacy_check', result: 'No personal data in output confirmed', passed: true },
    ],
    processing_time_ms: 1240,
  },

  method_extract: {
    orchestrator_version: '2.0',
    input_type: 'method_extract',
    child_id: 'system',
    timestamp: '2026-05-18T10:00:00.000Z',
    safety_passed: true,
    method_rules: [
      {
        rule_text_ru: 'Подсказку следует давать только после паузы 3–5 секунд, начиная с наименее навязчивой формы.',
        domain: 'prompting',
        confidence: 0.98,
        source_quote: 'always begin with the least intrusive prompt necessary for success',
        applicable_speech_levels: [1, 2, 3, 4],
      },
      {
        rule_text_ru: 'Подкрепление должно следовать в течение 1–2 секунд после правильного ответа.',
        domain: 'reinforcement',
        confidence: 0.99,
        source_quote: 'reinforcement should be delivered immediately — within 1-2 seconds',
        applicable_speech_levels: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        rule_text_ru: 'Усложнение задания допустимо только при 80%+ самостоятельных ответов в 3 последовательных занятиях.',
        domain: 'progression',
        confidence: 0.97,
        source_quote: '80% or more independent correct responses across 3 consecutive sessions',
        applicable_speech_levels: [1, 2, 3, 4, 5, 6, 7],
      },
    ],
    parent_message: {
      ru: 'Правила извлечены и отправлены на проверку методиста.',
      uz: 'Qoidalar ajratildi va metodist tekshiruviga yuborildi.',
    },
    agent_chain: [
      { agent: 'safety_filter', action: 'input_safety_check', result: 'PASSED: no safety violations', passed: true },
      { agent: 'methodologist', action: 'rule_extraction', result: 'Rules extracted from "VB-MAPP: Verbal Behavior Milestones Assessment and Placement Program"', passed: true },
      { agent: 'methodologist', action: 'pending_review', result: 'Rules sent for methodologist approval', passed: true },
    ],
    processing_time_ms: 2100,
  },

  daily_plan: {
    orchestrator_version: '2.0',
    input_type: 'daily_plan',
    child_id: 'child_akmal_001',
    timestamp: '2026-05-18T08:00:00.000Z',
    safety_passed: true,
    daily_plan: {
      date: '2026-05-18',
      child_id: 'child_akmal_001',
      sessions: [
        {
          order: 1,
          module: 'speech',
          game_type: 'show_correct',
          skill_key: 'names_family',
          target_cards: ['ойи', 'ада'],
          estimated_duration_minutes: 7,
          parent_instruction_ru: 'Разложите 2 карточки на столе. Скажите «Покажи ойи» и ждите 5 секунд.',
          parent_instruction_uz: '2 ta kartochkani stolga yoying. "Oyini ko\'rsat" deb 5 soniya kuting.',
          why_this_exercise_ru: 'Узнавание членов семьи — основа для построения первых фраз.',
          why_this_exercise_uz: 'Oila a\'zolarini tanish — birinchi jumlalar tuzishning asosi.',
        },
        {
          order: 2,
          module: 'daily_skills',
          game_type: 'wash_hands',
          skill_key: 'hand_washing',
          target_cards: ['кран', 'мыло', 'полотенце'],
          estimated_duration_minutes: 8,
          parent_instruction_ru: 'Используйте карточки-подсказки в ванной. Показывайте каждый шаг.',
          parent_instruction_uz: 'Hammomda ko\'rsatma kartochkalarini ishlating. Har bir qadamni ko\'rsating.',
          why_this_exercise_ru: 'Мытьё рук — важный навык самообслуживания и гигиены.',
          why_this_exercise_uz: 'Qo\'l yuvish — muhim o\'z-o\'ziga xizmat ko\'rsatish va gigiyena ko\'nikmasidir.',
        },
        {
          order: 3,
          module: 'speech',
          game_type: 'build_phrase',
          skill_key: 'two_word_phrase',
          target_cards: ['ойи', 'ада', 'еяпти'],
          estimated_duration_minutes: 8,
          parent_instruction_ru: 'Покажите карточку действия и спросите «Кто это делает?»',
          parent_instruction_uz: 'Harakat kartochkasini ko\'rsating va "Kim buni qilyapti?" deb so\'rang.',
          why_this_exercise_ru: 'Двухсловные фразы — следующий этап развития речи по VB-MAPP.',
          why_this_exercise_uz: 'Ikki so\'zli jumlalar — VB-MAPP bo\'yicha nutq rivojlanishining keyingi bosqichi.',
        },
      ],
      daily_tip_ru: 'Хвалите сразу! Подкрепление через 1-2 секунды после правильного ответа работает лучше всего.',
      daily_tip_uz: 'Darhol maqtang! To\'g\'ri javobdan 1-2 soniya ichida rag\'batlantirish eng yaxshi ishlaydi.',
    },
    parent_message: {
      ru: 'План на сегодня для Акмал готов. Не забудьте похвалить за каждый правильный ответ!',
      uz: 'Akmal uchun bugungi reja tayyor. Har bir to\'g\'ri javob uchun maqtashni unutmang!',
    },
    agent_chain: [
      { agent: 'safety_filter', action: 'input_safety_check', result: 'PASSED: no safety violations', passed: true },
      { agent: 'orchestrator', action: 'daily_plan_generation', result: 'Daily plan generated for Акмал', passed: true },
    ],
    processing_time_ms: 1560,
  },
};

// ── ADAPTIVE LOGIC DOCUMENTATION ──────────────────────────────────────────

const ADAPTIVE_LOGIC = {
  rules: [
    {
      id: 'fatigue_simplify',
      trigger: 'fatigue_detected = true OR refusals ≥ 3',
      action: 'simplify',
      priority: 1,
      description: 'Safety rule: always simplify if fatigue or repeated refusals detected',
    },
    {
      id: 'low_rate_simplify',
      trigger: 'independent_rate < 40%',
      action: 'simplify',
      priority: 2,
      description: 'Return to previous difficulty level if performance too low',
    },
    {
      id: 'high_rate_advance',
      trigger: 'independent_rate ≥ 80% AND sessions_at_current_level ≥ 2',
      action: 'advance',
      priority: 3,
      description: 'VB-MAPP mastery criterion: 80% in 2 consecutive sessions',
    },
    {
      id: 'intermediate_repeat',
      trigger: '40% ≤ independent_rate < 80%',
      action: 'repeat',
      priority: 4,
      description: 'Continue at current level to consolidate skill',
    },
  ],
  advance_effects: {
    cards_count: '+1 (max 5)',
    prompt_level: '-1 (less prompting)',
    game_type: 'may progress in complexity (e.g. show_correct → who_does_what)',
  },
  simplify_effects: {
    cards_count: '-1 (min 2)',
    prompt_level: '+1 (more support)',
    game_type: 'stays same or reverts',
  },
};

export async function GET() {
  return NextResponse.json({
    service: 'Bolajon AI Orchestrator — Demo',
    version: '2.0',
    description: 'Example inputs and outputs for all orchestrator input types',
    example_inputs: EXAMPLE_INPUTS,
    example_outputs: EXAMPLE_OUTPUTS,
    adaptive_logic: ADAPTIVE_LOGIC,
    agents: {
      safety_filter: 'Runs first on every request. Blocks forbidden medical/diagnostic terms.',
      aba_analyst: 'Applies ABA-based decision rules to session data (pure logic, no AI).',
      methodologist: 'Updates skill maps, extracts method rules, analyzes videos.',
      speech_expert: 'Plans next session parameters based on adaptive decision.',
      content_generator: 'Calls AI Gateway to generate cards, games, and lessons.',
      orchestrator: 'Coordinates all agents and builds final output.',
    },
  });
}
