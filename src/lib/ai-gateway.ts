import type { AIProvider, AITaskType } from './types';

export type AIGatewayRequest = {
  task: AITaskType;
  payload: Record<string, unknown>;
  childId?: string;
  preferredProvider?: AIProvider;
  maxTokens?: number;
  language?: 'ru' | 'uz';
};

export type AIGatewayResponse = {
  success: boolean;
  provider: AIProvider;
  result: unknown;
  tokensUsed?: number;
  error?: string;
  fallbackUsed?: boolean;
};

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

export async function callAIGateway(req: AIGatewayRequest): Promise<AIGatewayResponse> {
  const providers = req.preferredProvider
    ? [req.preferredProvider, ...TASK_PROVIDER_MAP[req.task].filter(p => p !== req.preferredProvider)]
    : TASK_PROVIDER_MAP[req.task];

  for (const provider of providers) {
    try {
      const result = await dispatchToProvider(provider, req);
      return { success: true, provider, result, tokensUsed: estimateTokens(req) };
    } catch {
      continue;
    }
  }
  return { success: false, provider: providers[0], result: null, error: 'All providers failed' };
}

async function dispatchToProvider(provider: AIProvider, req: AIGatewayRequest): Promise<unknown> {
  void provider;
  switch (req.task) {
    case 'card_generation': return generateCardMock(req);
    case 'game_generation': return generateGameMock(req);
    case 'lesson_creation': return generateLessonMock(req);
    case 'video_analysis': return generateVideoAnalysisMock(req);
    case 'character_generation': return generateCharacterMock(req);
    case 'method_extraction': return generateMethodExtractionMock(req);
    default: return { status: 'mocked', provider };
  }
}

function estimateTokens(_req: AIGatewayRequest): number {
  return Math.floor(Math.random() * 800) + 200;
}

function generateCardMock(req: AIGatewayRequest) {
  const type = req.payload.cardType as string;
  const label = (req.payload.labelUz as string) || 'Карточка';
  return {
    label_uz: label,
    label_ru: (req.payload.labelRu as string) || label,
    category: type,
    style: 'cartoon_clean',
    description: `Мультяшная карточка: ${label} на белом фоне, крупное изображение, минимум деталей`,
    phrases: [`Бу ${label}`, `${label}ни кўрсат`, `${label} қаерда?`],
    questions: [`Бу нима?`, `${label}ни топ`],
  };
}

function generateGameMock(req: AIGatewayRequest) {
  return {
    type: req.payload.gameType,
    title_ru: 'Покажи правильно',
    title_uz: "To'g'ri ko'rsat",
    instruction_ru: 'Покажи, где Ойи',
    instruction_uz: 'Ойини кўрсат',
    cards: req.payload.cardIds,
    prompt_level: 1,
    success_criteria: '80% within 3 sessions',
    difficulty: req.payload.level,
  };
}

function generateLessonMock(req: AIGatewayRequest) {
  const audience = req.payload.audience as string;
  return {
    audience,
    duration_seconds: 20,
    title: audience === 'child' ? 'Ойи китоб ўқияпти' : 'Как провести занятие',
    scenes: [
      { type: 'card_show', card: 'oy', text: 'Бу ойи', voiceover: 'Бу ойи' },
      { type: 'card_show', card: 'kitob', text: 'Бу китоб', voiceover: 'Бу китоб' },
      { type: 'action_scene', text: 'Ойи китоб ўқияпти', voiceover: 'Ойи китоб ўқияпти' },
      { type: 'question', text: 'Ким китоб ўқияпти?', pause_seconds: 3 },
      { type: 'praise', text: 'Жуда яхши! Баракалла!', voiceover: 'Жуда яхши!' },
    ],
    safety_note: 'No real personal data used',
  };
}

function generateVideoAnalysisMock(_req: AIGatewayRequest) {
  return {
    duration_seconds: 180,
    attempts_count: 8,
    lesson_goal: 'Обучение называнию членов семьи',
    instruction_quality: 'good',
    pause_before_prompt: true,
    prompt_type: 'verbal',
    child_response_rate: 0.75,
    reinforcement_used: true,
    fatigue_signs: false,
    recommendation: 'Перейдите к выбору из 3 карточек на следующем занятии',
    next_exercise_suggestion: 'choose_1of3',
    methodology_rating: 4,
  };
}

function generateCharacterMock(req: AIGatewayRequest) {
  return {
    character_style: 'friendly_cartoon',
    description: `Мультяшный персонаж: ${req.payload.role as string}, дружелюбное выражение лица, яркие цвета, без тёмных или пугающих деталей`,
    palette: ['#FFE0B2', '#81D4FA', '#A5D6A7'],
    safe_for_children: true,
  };
}

function generateMethodExtractionMock(req: AIGatewayRequest) {
  return {
    source: req.payload.filename,
    summary: 'Методика основана на поведенческом анализе (ABA) и направлена на развитие коммуникативных навыков.',
    rules: [
      { rule: 'Давать подсказку только после паузы 3–5 секунд', domain: 'prompting', confidence: 0.95 },
      { rule: 'Усложнять только при 80%+ самостоятельности в 3 занятиях', domain: 'progression', confidence: 0.98 },
      { rule: 'Хвалить за каждый самостоятельный ответ немедленно', domain: 'reinforcement', confidence: 0.99 },
    ],
    status: 'pending_review',
  };
}
