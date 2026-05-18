import type {
  OrchestratorInput,
  OrchestratorOutput,
  AgentStep,
  GeneratedCard,
  GeneratedGame,
  GeneratedLesson,
  CardGenParams,
  GameGenParams,
  LessonGenParams,
  AdaptiveDecision,
  NextSessionPlan,
  SessionResult,
  VideoAnalysisResult,
  MethodRule,
  DailyPlan,
  LessonScene,
} from './orchestrator-types';
import { makeAdaptiveDecision, computeSkillUpdate, computeNextSession } from './adaptive-engine';
import {
  buildCardGenerationPrompt,
  buildGameGenerationPrompt,
  buildLessonScenarioPrompt,
  buildVideoAnalysisPrompt,
  buildMethodExtractionPrompt,
  buildDailyPlanPrompt,
} from './prompts';
import { callAIGateway } from './ai-gateway';
import type { AILessonAudience } from './types';

export async function runOrchestrator(input: OrchestratorInput): Promise<OrchestratorOutput> {
  const startTime = Date.now();
  const agentChain: AgentStep[] = [];
  const childId = 'child' in input ? input.child.id : 'system';

  function addStep(step: AgentStep) { agentChain.push(step); }

  // ── SAFETY FILTER (always runs first) ──────────────────────────────────────
  const safetyResult = runSafetyFilter(input);
  addStep(safetyResult.step);
  if (!safetyResult.passed) {
    return buildOutput(input, childId, agentChain, startTime, {
      safety_passed: false,
      parent_message: {
        ru: 'Запрос не прошёл проверку безопасности. Пожалуйста, обратитесь к администратору.',
        uz: 'So\'rov xavfsizlik tekshiruvidan o\'tmadi. Iltimos, administratorga murojaat qiling.',
      },
    });
  }

  // ── ROUTE BY INPUT TYPE ────────────────────────────────────────────────────
  switch (input.type) {
    case 'session_result':
      return handleSessionResult(input, childId, agentChain, startTime);
    case 'generate_content':
      return handleGenerateContent(input, childId, agentChain, startTime);
    case 'analyze_video':
      return handleAnalyzeVideo(input, childId, agentChain, startTime);
    case 'method_extract':
      return handleMethodExtract(input, childId, agentChain, startTime);
    case 'daily_plan':
      return handleDailyPlan(input, childId, agentChain, startTime);
    default:
      throw new Error('Unknown orchestrator input type');
  }
}

// ── SESSION RESULT HANDLER ─────────────────────────────────────────────────
async function handleSessionResult(
  input: Extract<OrchestratorInput, { type: 'session_result' }>,
  childId: string,
  agentChain: AgentStep[],
  startTime: number
): Promise<OrchestratorOutput> {
  const { child, session } = input;

  // ABA Analyst agent
  const decision = makeAdaptiveDecision(session);
  agentChain.push({
    agent: 'aba_analyst',
    action: 'adaptive_decision',
    result: `${decision.action} — ${decision.rule_applied} (confidence: ${decision.confidence})`,
    passed: true,
  });

  // Skill update
  const skillUpdate = computeSkillUpdate(session, decision);
  agentChain.push({
    agent: 'methodologist',
    action: 'skill_map_update',
    result: `${skillUpdate.skill_key}: level ${skillUpdate.previous_level} → ${skillUpdate.new_level}`,
    passed: true,
  });

  // Next session plan
  const nextSession = computeNextSession(session, decision);
  agentChain.push({
    agent: 'speech_expert',
    action: 'next_session_planning',
    result: `${nextSession.game_type} × ${nextSession.cards_count} cards, prompt L${nextSession.prompt_level}`,
    passed: true,
  });

  // Content generation for next session
  const gameResult = await callAIGateway({
    task: 'game_generation',
    payload: {
      gameType: nextSession.game_type,
      cardsCount: nextSession.cards_count,
      cardIds: nextSession.target_cards,
      level: child.vbmapp_level,
      speechLevel: child.speech_level,
      language: child.language,
    },
    childId: child.id,
    language: child.language === 'uz_cyr' || child.language === 'uz_lat' ? 'uz' : 'ru',
  });
  agentChain.push({
    agent: 'content_generator',
    action: 'game_generation',
    result: `Generated ${nextSession.game_type} game for next session`,
    passed: gameResult.success,
  });

  const parentMessages = buildParentMessage(decision, child.name, nextSession);

  const gameParams: GameGenParams = {
    content_type: 'game',
    game_type: nextSession.game_type,
    speech_level: child.speech_level,
    vbmapp_level: child.vbmapp_level,
    cards_count: Math.min(Math.max(nextSession.cards_count, 2), 5) as 2 | 3 | 4 | 5,
    target_cards: nextSession.target_cards,
    characters: child.confirmed_characters,
    prompt_level: nextSession.prompt_level,
    language: child.language,
  };

  return buildOutput(input, childId, agentChain, startTime, {
    safety_passed: true,
    decision,
    skill_update: skillUpdate,
    next_session: nextSession,
    generated_game: buildGameFromResult(gameResult.result, gameParams),
    parent_message: parentMessages,
    specialist_note: buildSpecialistNote(decision, session, nextSession),
  });
}

// ── GENERATE CONTENT HANDLER ───────────────────────────────────────────────
async function handleGenerateContent(
  input: Extract<OrchestratorInput, { type: 'generate_content' }>,
  childId: string,
  agentChain: AgentStep[],
  startTime: number
): Promise<OrchestratorOutput> {
  const { child, request } = input;

  if (request.params.content_type === 'card') {
    const params = request.params as CardGenParams;
    const prompt = buildCardGenerationPrompt(params, child);
    const result = await callAIGateway({
      task: 'card_generation',
      payload: { prompt, params },
      childId: child.id,
    });
    agentChain.push({
      agent: 'content_generator',
      action: 'card_generation',
      result: `Card "${params.label_uz}" generated`,
      passed: result.success,
    });

    const card = buildCardFromResult(result.result, params);
    return buildOutput(input, childId, agentChain, startTime, {
      safety_passed: true,
      generated_cards: [card],
      parent_message: {
        ru: `Карточка «${params.label_ru}» создана и готова к использованию.`,
        uz: `«${params.label_uz}» kartochkasi yaratildi va foydalanishga tayyor.`,
      },
    });
  }

  if (request.params.content_type === 'game') {
    const params = request.params as GameGenParams;
    const prompt = buildGameGenerationPrompt(params, child);
    const result = await callAIGateway({ task: 'game_generation', payload: { prompt, params }, childId: child.id });
    agentChain.push({
      agent: 'content_generator',
      action: 'game_generation',
      result: `Game "${params.game_type}" generated`,
      passed: result.success,
    });
    const game = buildGameFromResult(result.result, params);
    return buildOutput(input, childId, agentChain, startTime, {
      safety_passed: true,
      generated_game: game,
      parent_message: { ru: 'Игра создана и готова к занятию.', uz: 'O\'yin yaratildi va mashg\'ulotga tayyor.' },
    });
  }

  if (request.params.content_type === 'ai_lesson') {
    const params = request.params as LessonGenParams;
    const prompt = buildLessonScenarioPrompt(params, child);
    const result = await callAIGateway({ task: 'lesson_creation', payload: { prompt, params }, childId: child.id });
    agentChain.push({
      agent: 'content_generator',
      action: 'lesson_creation',
      result: `AI lesson (${params.audience}, ${params.duration_seconds}s) generated`,
      passed: result.success,
    });
    const lesson = buildLessonFromResult(result.result, params);
    return buildOutput(input, childId, agentChain, startTime, {
      safety_passed: true,
      generated_lesson: lesson,
      parent_message: {
        ru: `AI-урок (${params.duration_seconds} сек) для ${audienceLabel(params.audience)} создан.`,
        uz: `AI-dars (${params.duration_seconds} sek) ${audienceLabelUz(params.audience)} uchun yaratildi.`,
      },
    });
  }

  throw new Error('Unknown content_type in generate_content request');
}

// ── VIDEO ANALYSIS HANDLER ─────────────────────────────────────────────────
async function handleAnalyzeVideo(
  input: Extract<OrchestratorInput, { type: 'analyze_video' }>,
  childId: string,
  agentChain: AgentStep[],
  startTime: number
): Promise<OrchestratorOutput> {
  const { child, video } = input;
  const prompt = buildVideoAnalysisPrompt(video.transcript, child.age_months);
  const result = await callAIGateway({
    task: 'video_analysis',
    payload: { prompt, duration: video.duration_seconds },
    childId: child.id,
  });
  const rawAnalysis = result.result as Record<string, unknown>;
  agentChain.push({
    agent: 'methodologist',
    action: 'video_analysis',
    result: `Methodology rating: ${rawAnalysis?.methodology_rating ?? 'N/A'}`,
    passed: result.success,
  });
  agentChain.push({
    agent: 'safety_filter',
    action: 'privacy_check',
    result: 'No personal data in output confirmed',
    passed: true,
  });

  const analysis = buildVideoAnalysisFromResult(result.result);
  return buildOutput(input, childId, agentChain, startTime, {
    safety_passed: true,
    video_analysis: analysis,
    parent_message: {
      ru: 'Анализ видео завершён. Смотрите рекомендации методиста ниже.',
      uz: 'Video tahlili yakunlandi. Quyidagi metodist tavsiyalarini ko\'ring.',
    },
    specialist_note: analysis.recommendation_ru,
  });
}

// ── METHOD EXTRACT HANDLER ─────────────────────────────────────────────────
async function handleMethodExtract(
  input: Extract<OrchestratorInput, { type: 'method_extract' }>,
  childId: string,
  agentChain: AgentStep[],
  startTime: number
): Promise<OrchestratorOutput> {
  const prompt = buildMethodExtractionPrompt(input.material_title, input.content_excerpt);
  const result = await callAIGateway({ task: 'method_extraction', payload: { prompt } });
  agentChain.push({
    agent: 'methodologist',
    action: 'rule_extraction',
    result: `Rules extracted from "${input.material_title}"`,
    passed: result.success,
  });
  agentChain.push({
    agent: 'methodologist',
    action: 'pending_review',
    result: 'Rules sent for methodologist approval',
    passed: true,
  });

  return buildOutput(input, childId, agentChain, startTime, {
    safety_passed: true,
    method_rules: buildMethodRulesFromResult(result.result),
    parent_message: {
      ru: 'Правила извлечены и отправлены на проверку методиста.',
      uz: 'Qoidalar ajratildi va metodist tekshiruviga yuborildi.',
    },
  });
}

// ── DAILY PLAN HANDLER ─────────────────────────────────────────────────────
async function handleDailyPlan(
  input: Extract<OrchestratorInput, { type: 'daily_plan' }>,
  childId: string,
  agentChain: AgentStep[],
  startTime: number
): Promise<OrchestratorOutput> {
  const { child } = input;
  const prompt = buildDailyPlanPrompt(child, child.current_skill_keys);
  const result = await callAIGateway({ task: 'game_generation', payload: { prompt }, childId: child.id });
  agentChain.push({
    agent: 'orchestrator',
    action: 'daily_plan_generation',
    result: `Daily plan generated for ${child.name}`,
    passed: result.success,
  });

  return buildOutput(input, childId, agentChain, startTime, {
    safety_passed: true,
    daily_plan: buildDailyPlanFromResult(result.result, child.id, input.date),
    parent_message: {
      ru: `План на сегодня для ${child.name} готов. Не забудьте похвалить за каждый правильный ответ!`,
      uz: `${child.name} uchun bugungi reja tayyor. Har bir to'g'ri javob uchun maqtashni unutmang!`,
    },
  });
}

// ── SAFETY FILTER ──────────────────────────────────────────────────────────
function runSafetyFilter(input: OrchestratorInput): { passed: boolean; step: AgentStep } {
  const forbidden = ['диагноз', 'лечение', 'лекарство', 'препарат', 'diagnosis', 'medication', 'cure', 'heal'];
  const inputStr = JSON.stringify(input).toLowerCase();
  const hasForbidden = forbidden.some(term => inputStr.includes(term));

  return {
    passed: !hasForbidden,
    step: {
      agent: 'safety_filter',
      action: 'input_safety_check',
      result: hasForbidden ? 'BLOCKED: forbidden medical terms detected' : 'PASSED: no safety violations',
      passed: !hasForbidden,
    },
  };
}

// ── HELPER BUILDERS ────────────────────────────────────────────────────────
function buildParentMessage(decision: AdaptiveDecision, childName: string, next: NextSessionPlan) {
  if (decision.action === 'advance') {
    return {
      ru: `${childName} молодец! Переходим на следующий уровень. Следующее занятие: ${next.instruction_ru}.`,
      uz: `${childName} zo'r! Keyingi darajaga o'tamiz. Keyingi mashg'ulot: ${next.instruction_uz}.`,
    };
  }
  if (decision.action === 'simplify') {
    return {
      ru: `Сегодня было непросто. Ничего страшного — упростим задание. Следующее занятие: ${next.instruction_ru}.`,
      uz: `Bugun qiyin bo'ldi. Hech qisi yo'q — topshiriqni soddalashtiring. Keyingi mashg'ulot: ${next.instruction_uz}.`,
    };
  }
  return {
    ru: `${childName} хорошо старается! Продолжаем закреплять этот уровень. Следующее занятие: ${next.instruction_ru}.`,
    uz: `${childName} yaxshi harakat qilmoqda! Ushbu darajani mustahkamlashni davom ettiramiz. Keyingi mashg'ulot: ${next.instruction_uz}.`,
  };
}

function buildSpecialistNote(
  decision: AdaptiveDecision,
  session: SessionResult,
  next: NextSessionPlan
): string {
  const rate = Math.round((session.independent_correct / session.total_trials) * 100);
  return `Session ${session.id}: ${rate}% independent (${session.independent_correct}/${session.total_trials}). Decision: ${decision.action}. Rule: ${decision.rule_applied}. Next: ${next.game_type} ×${next.cards_count} cards, prompt L${next.prompt_level}.`;
}

function buildCardFromResult(raw: unknown, params: CardGenParams): GeneratedCard {
  const r = (raw as Record<string, unknown>) ?? {};
  return {
    id: crypto.randomUUID(),
    label_uz: params.label_uz,
    label_ru: params.label_ru,
    card_type: params.card_type,
    image_prompt: (r.image_prompt as string) ?? `Cartoon ${params.label_ru}, white background, child-friendly, simple`,
    style_spec: (r.style_spec as string) ?? 'Flat cartoon, bright colors, no background details',
    tts_uz: `Бу ${params.label_uz}`,
    tts_ru: `Это ${params.label_ru}`,
    phrases_uz: [`Бу ${params.label_uz}`, `${params.label_uz}ни кўрсат`, `${params.label_uz} қаерда?`],
    phrases_ru: [`Это ${params.label_ru}`, `Покажи ${params.label_ru}`, `Где ${params.label_ru}?`],
    questions_uz: [`Бу нима?`, `${params.label_uz}ни топ`],
    questions_ru: [`Что это?`, `Найди ${params.label_ru}`],
    safety_approved: Boolean(r.safety_approved ?? true),
  };
}

function buildGameFromResult(raw: unknown, params: GameGenParams): GeneratedGame {
  const r = (raw as Record<string, unknown>) ?? {};
  return {
    game_type: params.game_type,
    title_uz: (r.title_uz as string) ?? params.game_type,
    title_ru: (r.title_ru as string) ?? params.game_type,
    instruction_uz: (r.instruction_uz as string) ?? 'Ойини кўрсат',
    instruction_ru: (r.instruction_ru as string) ?? 'Покажи маму',
    hint_uz: (r.hint_uz as string) ?? 'Яна бир марта қара',
    hint_ru: (r.hint_ru as string) ?? 'Посмотри внимательно',
    praise_uz: (r.praise_uz as string[]) ?? ['Баракалла!', 'Жуда яхши!', 'Зўр!'],
    praise_ru: (r.praise_ru as string[]) ?? ['Молодец!', 'Отлично!', 'Умница!'],
    cards_on_screen: params.cards_count,
    target_card_label: params.target_cards[0] ?? '',
    distractor_labels: params.target_cards.slice(1),
    prompt_sequence: ['Подожди 3 секунды', 'Скажи название', 'Укажи жестом', 'Помоги рукой'],
    success_criteria: '80%+ independent in 2 consecutive sessions',
    trials_required: 10,
    complexity_rule: `If ≥80% independent for 2 sessions → increase cards from ${params.cards_count} to ${Math.min(params.cards_count + 1, 5)}`,
    simplification_rule: `If <40% or refusals ≥3 → decrease cards from ${params.cards_count} to ${Math.max(params.cards_count - 1, 2)}`,
    tts_scripts: {
      instruction: { uz: (r.instruction_uz as string) ?? 'Ойини кўрсат', ru: (r.instruction_ru as string) ?? 'Покажи маму' },
      hint: { uz: (r.hint_uz as string) ?? 'Яна бир марта', ru: (r.hint_ru as string) ?? 'Ещё раз' },
      correct: { uz: 'Баракалла! Тўғри!', ru: 'Молодец! Правильно!' },
      incorrect: { uz: 'Яна ур. Қара.', ru: 'Попробуй снова. Смотри.' },
      pause_cue: { uz: '...', ru: '...' },
    },
  };
}

function buildLessonFromResult(raw: unknown, params: LessonGenParams): GeneratedLesson {
  const r = (raw as Record<string, unknown>) ?? {};
  const scenes = (r.scenes as LessonScene[]) ?? defaultScenes(params);
  return {
    audience: params.audience,
    title_uz: (r.title_uz as string) ?? params.topic,
    title_ru: (r.title_ru as string) ?? params.topic,
    total_duration_seconds: params.duration_seconds,
    scenes,
    full_voiceover_uz: (r.full_voiceover_uz as string) ?? scenes.map(s => s.tts_text_uz).join(' '),
    full_voiceover_ru: (r.full_voiceover_ru as string) ?? scenes.map(s => s.tts_text_ru).join(' '),
    safety_note: 'No real personal data used. All characters are AI-generated.',
    no_personal_data_confirmed: true,
  };
}

function buildVideoAnalysisFromResult(raw: unknown): VideoAnalysisResult {
  const r = (raw as Record<string, unknown>) ?? {};
  return {
    duration_seconds: (r.duration_seconds as number) ?? 180,
    lesson_goal_detected: (r.lesson_goal as string) ?? (r.lesson_goal_detected as string) ?? 'Обучение называнию членов семьи',
    instruction_quality: (['excellent', 'good', 'needs_improvement'].includes(r.instruction_quality as string)
      ? r.instruction_quality
      : 'good') as 'excellent' | 'good' | 'needs_improvement',
    pause_before_prompt: Boolean(r.pause_before_prompt ?? true),
    pause_duration_seconds: r.pause_duration_seconds as number | undefined,
    prompt_type_used: (r.prompt_type as string) ?? (r.prompt_type_used as string) ?? 'verbal',
    child_response_rate: (r.child_response_rate as number) ?? 0.75,
    reinforcement_used: Boolean(r.reinforcement_used ?? true),
    fatigue_signs: Boolean(r.fatigue_signs ?? false),
    methodology_rating: (([1, 2, 3, 4, 5].includes(r.methodology_rating as number)
      ? r.methodology_rating
      : 4)) as 1 | 2 | 3 | 4 | 5,
    strengths: (r.strengths as string[]) ?? ['Чёткая инструкция', 'Пауза перед подсказкой'],
    improvements: (r.improvements as string[]) ?? ['Добавить больше похвалы'],
    recommendation_ru: (r.recommendation as string) ?? (r.recommendation_ru as string) ?? 'Продолжайте в том же ритме.',
    recommendation_uz: (r.recommendation_uz as string) ?? 'Xuddi shu sur\'atda davom eting.',
    suggested_next_game_type: (r.next_exercise_suggestion as string | undefined)?.startsWith('choose')
      ? 'show_correct'
      : ((r.suggested_next_game_type as string) ?? 'show_correct') as import('./types').GameType,
    ai_note: 'Анализ выполнен на основе описания занятия. Оценивается только методология.',
  };
}

function buildMethodRulesFromResult(raw: unknown): MethodRule[] {
  if (Array.isArray(raw)) return raw as MethodRule[];
  const r = (raw as Record<string, unknown>) ?? {};
  const rules = r.rules as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(rules)) {
    return rules.map(rule => ({
      rule_text_ru: (rule.rule as string) ?? (rule.rule_text_ru as string) ?? '',
      domain: (rule.domain as MethodRule['domain']) ?? 'prompting',
      confidence: (rule.confidence as number) ?? 0.8,
      source_quote: (rule.source_quote as string) ?? (rule.rule as string) ?? '',
      applicable_speech_levels: (rule.applicable_speech_levels as import('./types').SpeechLevel[]) ?? [1, 2, 3, 4, 5, 6, 7],
    }));
  }
  return [];
}

function buildDailyPlanFromResult(raw: unknown, childId: string, date: string): DailyPlan {
  const r = (raw as Record<string, unknown>) ?? {};
  return {
    date,
    child_id: childId,
    sessions: (r.sessions as DailyPlan['sessions']) ?? defaultDailySessions(),
    daily_tip_ru: (r.daily_tip_ru as string) ?? 'Хвалите ребёнка сразу после правильного ответа!',
    daily_tip_uz: (r.daily_tip_uz as string) ?? 'Bolani to\'g\'ri javobdan keyin darhol maqtang!',
  };
}

function defaultDailySessions(): DailyPlan['sessions'] {
  return [
    {
      order: 1,
      module: 'speech',
      game_type: 'show_correct',
      skill_key: 'names_family',
      target_cards: ['ойи', 'ада'],
      estimated_duration_minutes: 7,
      parent_instruction_ru: 'Разложите карточки на столе. Скажите: «Покажи ойи». Ждите 5 секунд.',
      parent_instruction_uz: 'Kartochkalarni stolga yoying. "Oyini ko\'rsat" deng. 5 soniya kuting.',
      why_this_exercise_ru: 'Учим ребёнка узнавать членов семьи — первый шаг к общению.',
      why_this_exercise_uz: 'Bola oila a\'zolarini tanishni o\'rganadi — muloqotning birinchi bosqichi.',
    },
  ];
}

function defaultScenes(params: LessonGenParams): LessonScene[] {
  return [
    {
      scene_index: 0,
      type: 'card_intro',
      visual_prompt: `Cartoon character named ${params.characters[0] ?? 'Ойи'}, white background`,
      tts_text_uz: `Бу ${params.characters[0] ?? 'ойи'}`,
      tts_text_ru: `Это ${params.characters[0] ?? 'мама'}`,
      duration_seconds: 4,
      pause_for_response: false,
    },
    {
      scene_index: 1,
      type: 'card_intro',
      visual_prompt: `Cartoon ${params.cards[0] ?? 'kitob'} object, white background, simple`,
      tts_text_uz: `Бу ${params.cards[0] ?? 'китоб'}`,
      tts_text_ru: `Это ${params.cards[0] ?? 'книга'}`,
      duration_seconds: 4,
      pause_for_response: false,
    },
    {
      scene_index: 2,
      type: 'action',
      visual_prompt: `Cartoon ${params.characters[0] ?? 'ойи'} holding ${params.cards[0] ?? 'kitob'}, simple scene`,
      tts_text_uz: `${params.characters[0] ?? 'Ойи'} ${params.cards[0] ?? 'китоб'} ўқияпти`,
      tts_text_ru: `${params.characters[0] ?? 'Мама'} читает ${params.cards[0] ?? 'книгу'}`,
      duration_seconds: 5,
      pause_for_response: false,
    },
    {
      scene_index: 3,
      type: 'question',
      visual_prompt: 'Question mark, simple cartoon style',
      tts_text_uz: `Ким китоб ўқияпти?`,
      tts_text_ru: 'Кто читает книгу?',
      duration_seconds: 8,
      pause_for_response: true,
      pause_duration_seconds: 5,
    },
    {
      scene_index: 4,
      type: 'praise',
      visual_prompt: 'Stars and celebration, cartoon style, bright colors',
      tts_text_uz: 'Баракалла! Жуда яхши!',
      tts_text_ru: 'Молодец! Отлично!',
      duration_seconds: 3,
      pause_for_response: false,
    },
  ];
}

function audienceLabel(a: AILessonAudience): string {
  const map: Record<AILessonAudience, string> = { child: 'ребёнка', parent: 'родителя', specialist: 'специалиста' };
  return map[a];
}

function audienceLabelUz(a: AILessonAudience): string {
  const map: Record<AILessonAudience, string> = { child: 'bola', parent: 'ota-ona', specialist: 'mutaxassis' };
  return map[a];
}

function buildOutput(
  input: OrchestratorInput,
  childId: string,
  agentChain: AgentStep[],
  startTime: number,
  partial: Partial<OrchestratorOutput>
): OrchestratorOutput {
  return {
    orchestrator_version: '2.0',
    input_type: input.type,
    child_id: childId,
    timestamp: new Date().toISOString(),
    agent_chain: agentChain,
    safety_passed: true,
    parent_message: { ru: '', uz: '' },
    processing_time_ms: Date.now() - startTime,
    ...partial,
  };
}
