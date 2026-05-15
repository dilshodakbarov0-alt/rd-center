export type UserRole = 'parent' | 'specialist' | 'methodologist' | 'admin';

export type SpeechLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Language = 'uz_cyr' | 'uz_lat' | 'ru' | 'bilingual';

export type CardType = 'character' | 'object' | 'action' | 'place' | 'emotion';
export type CardStatus = 'generating' | 'pending_confirm' | 'confirmed' | 'rejected';

export type GameType =
  | 'show_correct'
  | 'build_phrase'
  | 'who_does_what'
  | 'repeat_after_me'
  | 'find_same'
  | 'sort_groups'
  | 'wash_hands'
  | 'come_here'
  | 'emotions'
  | 'social_story';

export type TrialOutcome = 'independent' | 'prompted' | 'error' | 'refusal' | 'no_response';
export type PromptLevel = 0 | 1 | 2 | 3;

export type VideoAnalysisStatus = 'uploading' | 'queued' | 'analyzing' | 'complete' | 'failed';

export type AILessonAudience = 'child' | 'parent' | 'specialist';

export type MethodMaterialType = 'book' | 'pdf' | 'protocol' | 'checklist' | 'research' | 'docx';
export type MethodRuleStatus = 'pending' | 'approved' | 'rejected';

export type ConsentType = 'data_processing' | 'photo_upload' | 'video_upload' | 'external_ai' | 'model_training';

export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'local';
export type AITaskType = 'card_generation' | 'game_generation' | 'lesson_creation' | 'video_analysis' | 'character_generation' | 'tts' | 'stt' | 'safety_check' | 'method_extraction';
