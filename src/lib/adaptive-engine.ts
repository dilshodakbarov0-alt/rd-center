import type { SessionResult, AdaptiveDecision, SkillUpdate, NextSessionPlan } from './orchestrator-types';
import type { GameType } from './types';
import { VBMAPP_SKILLS } from './vbmapp-skills';

const ADVANCE_THRESHOLD = 0.80;    // 80%+ independent correct
const ADVANCE_SESSIONS = 2;        // 2 consecutive sessions at threshold
const SIMPLIFY_THRESHOLD = 0.40;   // below 40% → simplify
const SIMPLIFY_REFUSAL = 3;        // 3+ refusals → simplify

export function computeIndependentRate(s: SessionResult): number {
  if (s.total_trials === 0) return 0;
  return s.independent_correct / s.total_trials;
}

export function makeAdaptiveDecision(session: SessionResult): AdaptiveDecision {
  const rate = computeIndependentRate(session);
  const isFatigued = session.fatigue_detected;
  const hasRefusalPattern = session.refusal_pattern || session.refusals >= SIMPLIFY_REFUSAL;

  if (isFatigued || hasRefusalPattern) {
    return {
      action: 'simplify',
      reason_ru: isFatigued
        ? 'Обнаружены признаки усталости. Сокращаем занятие и добавляем подсказку.'
        : 'Частые отказы — ребёнок перегружен. Упрощаем задание.',
      reason_uz: isFatigued
        ? 'Charchoq belgilari aniqlandi. Mashg\'ulotni qisqartiramiz va maslahat beramiz.'
        : 'Ko\'p rad etish — bola ortiqcha yuklanmoqda. Topshiriqni soddalashtiring.',
      confidence: 0.95,
      rule_applied: isFatigued ? 'fatigue_detected → simplify' : 'refusal_pattern ≥ 3 → simplify',
    };
  }

  if (rate < SIMPLIFY_THRESHOLD) {
    return {
      action: 'simplify',
      reason_ru: `Ребёнок выполнил только ${Math.round(rate * 100)}% самостоятельно. Возвращаемся на предыдущий уровень сложности.`,
      reason_uz: `Bola faqat ${Math.round(rate * 100)}% mustaqil bajardi. Oldingi darajaga qaytamiz.`,
      confidence: 0.92,
      rule_applied: `independent_rate ${Math.round(rate * 100)}% < 40% → simplify`,
    };
  }

  if (rate >= ADVANCE_THRESHOLD && session.sessions_at_current_level >= ADVANCE_SESSIONS) {
    return {
      action: 'advance',
      reason_ru: `${Math.round(rate * 100)}% самостоятельных ответов в ${session.sessions_at_current_level} занятиях подряд. Переходим на следующий уровень!`,
      reason_uz: `${session.sessions_at_current_level} darsda ketma-ket ${Math.round(rate * 100)}% mustaqil javob. Keyingi darajaga o\'tamiz!`,
      confidence: 0.97,
      rule_applied: `independent_rate ≥ 80% × ${ADVANCE_SESSIONS} sessions → advance`,
    };
  }

  return {
    action: 'repeat',
    reason_ru: `${Math.round(rate * 100)}% самостоятельных ответов. Продолжаем отрабатывать этот уровень для закрепления навыка.`,
    reason_uz: `${Math.round(rate * 100)}% mustaqil javob. Ko\'nikma mustahkamlanishi uchun ushbu darajada davom etamiz.`,
    confidence: 0.88,
    rule_applied: `intermediate_rate → repeat for consolidation`,
  };
}

export function computeSkillUpdate(
  session: SessionResult,
  decision: AdaptiveDecision,
  currentLevel: 0 | 1 | 2 | 3 = 1
): SkillUpdate {
  const skill = VBMAPP_SKILLS.find(s => s.key === session.skill_key);
  let newLevel = currentLevel as 0 | 1 | 2 | 3;

  if (decision.action === 'advance' && currentLevel < 3) {
    newLevel = (currentLevel + 1) as 0 | 1 | 2 | 3;
  } else if (decision.action === 'simplify' && currentLevel > 0) {
    newLevel = (currentLevel - 1) as 0 | 1 | 2 | 3;
  }

  return {
    skill_key: session.skill_key,
    skill_name_ru: skill?.nameRu ?? session.skill_key,
    previous_level: currentLevel,
    new_level: newLevel,
    vbmapp_level_up: newLevel === 3 && currentLevel < 3,
  };
}

// Complexity progression for each game type
const GAME_PROGRESSION: Record<GameType, GameType[]> = {
  show_correct: ['show_correct', 'show_correct', 'who_does_what', 'build_phrase'],
  build_phrase: ['show_correct', 'build_phrase', 'build_phrase', 'build_phrase'],
  who_does_what: ['show_correct', 'who_does_what', 'who_does_what', 'build_phrase'],
  repeat_after_me: ['repeat_after_me', 'repeat_after_me', 'build_phrase', 'social_story'],
  find_same: ['find_same', 'find_same', 'sort_groups', 'sort_groups'],
  sort_groups: ['find_same', 'sort_groups', 'sort_groups', 'build_phrase'],
  wash_hands: ['wash_hands', 'wash_hands', 'wash_hands', 'social_story'],
  come_here: ['come_here', 'come_here', 'come_here', 'social_story'],
  emotions: ['show_correct', 'emotions', 'emotions', 'build_phrase'],
  social_story: ['social_story', 'social_story', 'social_story', 'social_story'],
};

export function computeNextSession(
  session: SessionResult,
  decision: AdaptiveDecision
): NextSessionPlan {
  const currentCardsCount = session.cards_used.length;
  let nextCardsCount = currentCardsCount;
  let nextGameType: GameType = session.game_type;
  let nextPromptLevel = session.prompt_level_used;
  let difficultyChange: 'increased' | 'same' | 'decreased' = 'same';

  if (decision.action === 'advance') {
    nextCardsCount = Math.min(currentCardsCount + 1, 5);
    nextPromptLevel = Math.max(0, nextPromptLevel - 1) as 0 | 1 | 2 | 3;
    const progression = GAME_PROGRESSION[session.game_type];
    const currentIdx = Math.min(session.sessions_at_current_level, progression.length - 1);
    nextGameType = progression[Math.min(currentIdx + 1, progression.length - 1)];
    difficultyChange = 'increased';
  } else if (decision.action === 'simplify') {
    nextCardsCount = Math.max(currentCardsCount - 1, 2);
    nextPromptLevel = Math.min(nextPromptLevel + 1, 3) as 0 | 1 | 2 | 3;
    difficultyChange = 'decreased';
  }

  const instructionTemplates: Record<GameType, { uz: string; ru: string }> = {
    show_correct: { uz: 'Ойини кўрсат', ru: 'Покажи маму' },
    build_phrase: { uz: 'Ойи нима қиляпти?', ru: 'Что делает мама?' },
    who_does_what: { uz: 'Ким нима қиляпти?', ru: 'Кто что делает?' },
    repeat_after_me: { uz: 'Мен каби қил', ru: 'Повтори за мной' },
    find_same: { uz: 'Худди шундайини топ', ru: 'Найди такой же' },
    sort_groups: { uz: 'Гуруҳларга ажрат', ru: 'Разложи по группам' },
    wash_hands: { uz: 'Қўлларимизни ювайлик', ru: 'Моем руки' },
    come_here: { uz: 'Мен олдимга кел', ru: 'Иди сюда' },
    emotions: { uz: 'Бу қандай ҳис?', ru: 'Какое это чувство?' },
    social_story: { uz: 'Кейин нима бўлади?', ru: 'Что будет дальше?' },
  };

  return {
    game_type: nextGameType,
    cards_count: nextCardsCount,
    prompt_level: nextPromptLevel,
    target_cards: session.cards_used.slice(0, nextCardsCount),
    instruction_uz: instructionTemplates[nextGameType].uz,
    instruction_ru: instructionTemplates[nextGameType].ru,
    estimated_duration_minutes: decision.action === 'simplify' ? 5 : 10,
    difficulty_change: difficultyChange,
  };
}
