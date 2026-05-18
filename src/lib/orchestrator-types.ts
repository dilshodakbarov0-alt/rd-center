import type { GameType, SpeechLevel, CardType, AILessonAudience, Language } from './types';

// ─── INPUTS ─────────────────────────────────────────────────────────────────

export type ChildProfile = {
  id: string;
  name: string;
  age_months: number;
  speech_level: SpeechLevel;
  language: Language;
  vbmapp_level: 1 | 2 | 3;
  interests: string[];
  sensory_notes?: string;
  behavioral_notes?: string;
  confirmed_characters: string[]; // e.g. ['oy', 'ada', 'buvi']
  current_skill_keys: string[];   // skills currently being worked on
};

export type SessionResult = {
  id: string;
  module: 'speech' | 'daily_skills' | 'safety' | 'sensory' | 'emotions' | 'social';
  game_type: GameType;
  skill_key: string;
  total_trials: number;
  independent_correct: number;
  prompted_correct: number;
  errors: number;
  refusals: number;
  no_responses: number;
  sessions_at_current_level: number; // consecutive sessions at this difficulty
  avg_response_time_ms?: number;
  fatigue_detected: boolean;
  refusal_pattern: boolean;           // multiple refusals = pattern
  prompt_level_used: 0 | 1 | 2 | 3;  // 0=none, 1=verbal, 2=gesture, 3=physical
  cards_used: string[];
};

export type GenerationRequest = {
  content_type: 'card' | 'game' | 'ai_lesson' | 'video_scenario';
  params: CardGenParams | GameGenParams | LessonGenParams | VideoScenarioParams;
};

export type CardGenParams = {
  content_type: 'card';
  card_type: CardType;
  topic: string;           // e.g. 'kitob', 'stul', 'yuvmoq'
  label_uz: string;
  label_ru: string;
  style: 'cartoon_clean';  // always cartoon_clean
  background: 'white';     // always white/transparent
  include_action?: boolean; // for action cards: show action being performed
};

export type GameGenParams = {
  content_type: 'game';
  game_type: GameType;
  speech_level: SpeechLevel;
  vbmapp_level: 1 | 2 | 3;
  cards_count: 2 | 3 | 4 | 5;
  target_cards: string[];   // card labels to use
  characters: string[];     // confirmed family characters
  prompt_level: 0 | 1 | 2 | 3;
  language: Language;
};

export type LessonGenParams = {
  content_type: 'ai_lesson';
  audience: AILessonAudience;
  topic: string;
  speech_level: SpeechLevel;
  characters: string[];
  cards: string[];
  duration_seconds: 15 | 20 | 30;
  language: Language;
};

export type VideoScenarioParams = {
  content_type: 'video_scenario';
  topic: string;
  characters: string[];
  target_phrase: string;
  question: string;
  language: Language;
};

export type VideoTranscript = {
  duration_seconds: number;
  transcript: string;
  description?: string;
};

export type OrchestratorInput =
  | { type: 'session_result'; child: ChildProfile; session: SessionResult }
  | { type: 'generate_content'; child: ChildProfile; request: GenerationRequest }
  | { type: 'analyze_video'; child: ChildProfile; video: VideoTranscript }
  | { type: 'method_extract'; material_title: string; material_type: string; content_excerpt: string }
  | { type: 'daily_plan'; child: ChildProfile; date: string };

// ─── OUTPUTS ────────────────────────────────────────────────────────────────

export type AdaptiveDecision = {
  action: 'advance' | 'repeat' | 'simplify';
  reason_ru: string;
  reason_uz: string;
  confidence: number;
  rule_applied: string;
};

export type SkillUpdate = {
  skill_key: string;
  skill_name_ru: string;
  previous_level: 0 | 1 | 2 | 3;
  new_level: 0 | 1 | 2 | 3;
  vbmapp_level_up: boolean;
};

export type NextSessionPlan = {
  game_type: GameType;
  cards_count: number;
  prompt_level: 0 | 1 | 2 | 3;
  target_cards: string[];
  instruction_uz: string;
  instruction_ru: string;
  estimated_duration_minutes: number;
  difficulty_change: 'increased' | 'same' | 'decreased';
};

export type GeneratedCard = {
  id: string;
  label_uz: string;
  label_uz_lat?: string;
  label_ru: string;
  card_type: CardType;
  image_prompt: string;        // prompt for image generation model
  style_spec: string;          // visual specification
  tts_uz: string;              // text for TTS in Uzbek
  tts_ru: string;              // text for TTS in Russian
  phrases_uz: string[];        // related phrases
  phrases_ru: string[];
  questions_uz: string[];      // questions to ask about this card
  questions_ru: string[];
  safety_approved: boolean;
};

export type GeneratedGame = {
  game_type: GameType;
  title_uz: string;
  title_ru: string;
  instruction_uz: string;
  instruction_ru: string;
  hint_uz: string;
  hint_ru: string;
  praise_uz: string[];
  praise_ru: string[];
  cards_on_screen: number;
  target_card_label: string;
  distractor_labels: string[];
  prompt_sequence: string[];   // ordered list of prompts if child doesn't respond
  success_criteria: string;
  trials_required: number;
  complexity_rule: string;
  simplification_rule: string;
  tts_scripts: {
    instruction: { uz: string; ru: string };
    hint: { uz: string; ru: string };
    correct: { uz: string; ru: string };
    incorrect: { uz: string; ru: string };
    pause_cue: { uz: string; ru: string };
  };
};

export type LessonScene = {
  scene_index: number;
  type: 'card_intro' | 'action' | 'question' | 'pause' | 'praise' | 'instruction_to_adult';
  visual_prompt: string;       // image/video generation prompt
  tts_text_uz: string;
  tts_text_ru: string;
  duration_seconds: number;
  pause_for_response: boolean;
  pause_duration_seconds?: number;
};

export type GeneratedLesson = {
  audience: AILessonAudience;
  title_uz: string;
  title_ru: string;
  total_duration_seconds: number;
  scenes: LessonScene[];
  full_voiceover_uz: string;
  full_voiceover_ru: string;
  safety_note: string;
  no_personal_data_confirmed: boolean;
};

export type VideoAnalysisResult = {
  duration_seconds: number;
  lesson_goal_detected: string;
  instruction_quality: 'excellent' | 'good' | 'needs_improvement';
  pause_before_prompt: boolean;
  pause_duration_seconds?: number;
  prompt_type_used: string;
  child_response_rate: number;
  reinforcement_used: boolean;
  fatigue_signs: boolean;
  methodology_rating: 1 | 2 | 3 | 4 | 5;
  strengths: string[];
  improvements: string[];
  recommendation_ru: string;
  recommendation_uz: string;
  suggested_next_game_type: GameType;
  ai_note: string;
};

export type MethodRule = {
  rule_text_ru: string;
  domain: 'prompting' | 'progression' | 'reinforcement' | 'safety' | 'sensory' | 'emotions' | 'daily_skills' | 'communication';
  confidence: number;
  source_quote: string;
  applicable_speech_levels: SpeechLevel[];
};

export type DailyPlan = {
  date: string;
  child_id: string;
  sessions: Array<{
    order: number;
    module: string;
    game_type: GameType;
    skill_key: string;
    target_cards: string[];
    estimated_duration_minutes: number;
    parent_instruction_ru: string;
    parent_instruction_uz: string;
    why_this_exercise_ru: string;
    why_this_exercise_uz: string;
  }>;
  daily_tip_ru: string;
  daily_tip_uz: string;
};

export type AgentStep = {
  agent: 'adaptive_engine' | 'methodologist' | 'speech_expert' | 'aba_analyst' | 'content_generator' | 'safety_filter' | 'orchestrator';
  action: string;
  result: string;
  passed: boolean;
};

export type OrchestratorOutput = {
  orchestrator_version: '2.0';
  input_type: OrchestratorInput['type'];
  child_id: string;
  timestamp: string;
  decision?: AdaptiveDecision;
  skill_update?: SkillUpdate;
  next_session?: NextSessionPlan;
  generated_cards?: GeneratedCard[];
  generated_game?: GeneratedGame;
  generated_lesson?: GeneratedLesson;
  video_analysis?: VideoAnalysisResult;
  method_rules?: MethodRule[];
  daily_plan?: DailyPlan;
  agent_chain: AgentStep[];
  parent_message: { ru: string; uz: string };
  specialist_note?: string;
  safety_passed: boolean;
  processing_time_ms: number;
};
