import type { ChildProfile, CardGenParams, GameGenParams, LessonGenParams } from './orchestrator-types';

export function buildCardGenerationPrompt(params: CardGenParams, child: ChildProfile): string {
  return `You are a children's educational illustration generator for a speech therapy platform.

Task: Generate a description for a cartoon-style flashcard for a child with developmental delays.

STRICT VISUAL RULES:
- Pure white or transparent background (no scenes, no rooms)
- Single central object/character only (no background people or objects)
- Friendly, simple, cartoon style — NOT realistic, NOT scary, NOT complex
- High contrast colors, large clear shape
- No text in the image
- No real faces, no personal data
- Child-safe content only

Card details:
- Type: ${params.card_type}
- Label (Uzbek): ${params.label_uz}
- Label (Russian): ${params.label_ru}
- Topic: ${params.topic}
- Child age: ${child.age_months} months
- Child speech level: ${child.speech_level}/7
${params.include_action ? '- Show the action being performed (simple, clear motion)' : ''}

Generate:
1. IMAGE_PROMPT: Detailed prompt for DALL-E/Midjourney (max 100 words)
2. STYLE_SPEC: Visual style specification (colors, size, positioning)
3. SAFETY_CHECK: Confirm no personal data, no scary elements, child-appropriate

Format: JSON with keys image_prompt, style_spec, safety_approved`;
}

export function buildGameGenerationPrompt(params: GameGenParams, child: ChildProfile): string {
  return `You are a VB-MAPP certified ABA therapist and educational game designer.

Task: Design a structured learning game for a child with developmental delays.

Child profile:
- Name: ${child.name}, Age: ${child.age_months} months
- Speech level: ${child.speech_level}/7 (${getSpeechLevelDescription(child.speech_level)})
- VB-MAPP level: ${child.vbmapp_level}/3
- Language: ${child.language}
- Interests: ${child.interests.join(', ')}
- Sensory notes: ${child.sensory_notes ?? 'none'}

Game parameters:
- Type: ${params.game_type}
- Cards on screen: ${params.cards_count}
- Target cards: ${params.target_cards.join(', ')}
- Family characters: ${params.characters.join(', ')}
- Prompt level: ${params.prompt_level}/3 (0=none, 1=verbal, 2=gesture, 3=physical)

GAME DESIGN RULES (ABA-based):
1. One clear instruction per trial
2. Wait 3-5 seconds before prompting
3. Prompt hierarchy: verbal → gestural → physical
4. Immediate reinforcement for correct responses
5. No more than 10 trials per session
6. Success criterion: 80%+ independent in 2-3 sessions

Generate a complete game specification in JSON with:
- title (uz, ru)
- instruction (uz, ru) — short, clear, 1-2 words max
- hint (uz, ru)
- praise phrases (uz, ru) — 3 variants
- prompt_sequence — ordered list of prompts
- success_criteria
- complexity_rule (when to advance)
- simplification_rule (when to simplify)
- tts_scripts for all audio cues

CRITICAL: All content must be in Uzbek (Cyrillic) and Russian. No medical language. No diagnosis references.`;
}

export function buildLessonScenarioPrompt(params: LessonGenParams, child: ChildProfile): string {
  return `You are an educational video director specializing in speech therapy content for children with ASD.

Task: Create a ${params.duration_seconds}-second AI video lesson scenario.

Audience: ${params.audience}
${params.audience === 'child' ? '→ Direct teaching video. Simple, engaging, one concept at a time.' : ''}
${params.audience === 'parent' ? '→ Teaching guide. Show parent HOW to conduct the exercise step by step.' : ''}
${params.audience === 'specialist' ? '→ Professional guide. Methodological details, prompt hierarchy, data collection.' : ''}

Child: ${child.name}, speech level ${child.speech_level}/7, VB-MAPP level ${child.vbmapp_level}
Topic: ${params.topic}
Characters: ${params.characters.join(', ')} (from confirmed family photos — use as named characters)
Cards: ${params.cards.join(', ')}
Duration: ${params.duration_seconds} seconds
Language: ${params.language}

CRITICAL SAFETY RULES:
✗ NEVER use real faces, voices, or personal data from original videos
✗ NEVER reference real names of actual people (use character names like "Ойи" only)
✗ NEVER make medical claims or diagnostic statements
✗ Content must be calm, clear, not overwhelming

SCENE STRUCTURE (${params.duration_seconds}s total):
- Card intro scenes: 3-4 seconds each
- Action scenes: 3-5 seconds
- Question + pause: 5-8 seconds (mandatory pause for child response)
- Praise: 2-3 seconds

Generate scenes array where each scene has:
- scene_index, type, visual_prompt (for AI image generation — no real faces), tts_text_uz, tts_text_ru, duration_seconds, pause_for_response, pause_duration_seconds

Also provide: full_voiceover_uz, full_voiceover_ru, safety_note, no_personal_data_confirmed: true`;
}

export function buildVideoAnalysisPrompt(transcript: string, childAge: number): string {
  return `You are a certified ABA therapist analyzing the methodology of a therapy session.

CRITICAL: You are analyzing ONLY the teaching methodology, NOT the child. Do not make diagnostic statements. Do not assess the child's ability level or potential. Do not reference personal identifying information.

Session transcript/description:
"""
${transcript}
"""

Child age reference: approximately ${childAge} months

Analyze ONLY:
1. Was there a clear, short instruction? (1-2 words ideally)
2. Was there a 3-5 second pause before prompting?
3. What type of prompt was used? (verbal/gestural/physical)
4. Was reinforcement/praise given immediately after correct response?
5. Were there signs of session being too long (>10-15 min)?
6. Was the difficulty appropriate (not too easy, not too hard)?
7. Were materials clear and uncluttered?
8. What was the approximate response rate?

Rate methodology 1-5:
5 = Textbook ABA/VB-MAPP methodology
4 = Good, minor improvements possible
3 = Adequate, some key elements missing
2 = Several methodology issues
1 = Major methodology concerns

Provide: strengths (2-3), improvements (2-3), recommendation, suggested_next_game_type
All in JSON format. Russian and Uzbek versions of recommendation.`;
}

export function buildMethodExtractionPrompt(title: string, excerpt: string): string {
  return `You are a methodology expert extracting teaching rules from professional literature on child development, ABA therapy, and speech-language pathology.

Source material: "${title}"

Excerpt:
"""
${excerpt.slice(0, 3000)}
"""

Extract specific, actionable teaching rules from this material. Rules must be:
- Concrete and implementable (not vague)
- Evidence-based (from the source)
- Applicable to teaching children with ASD/speech delays
- Safe (no medical prescriptions)

For each rule extract:
- rule_text_ru: clear rule in Russian (1-2 sentences)
- domain: one of [prompting, progression, reinforcement, safety, sensory, emotions, daily_skills, communication]
- confidence: 0.0-1.0 (how clearly stated in source)
- source_quote: exact or paraphrased quote from source
- applicable_speech_levels: array of speech levels 1-7 this applies to

Return JSON array of rules (max 15 per material). Rules require methodologist approval before use.`;
}

export function buildDailyPlanPrompt(child: ChildProfile, currentSkills: string[]): string {
  return `You are an AI methodologist creating a personalized daily learning plan.

Child: ${child.name}
Age: ${child.age_months} months
Speech level: ${child.speech_level}/7 (${getSpeechLevelDescription(child.speech_level)})
VB-MAPP level: ${child.vbmapp_level}
Language: ${child.language}
Interests: ${child.interests.join(', ')}
Sensory considerations: ${child.sensory_notes ?? 'none noted'}
Current skills being worked on: ${currentSkills.join(', ')}

Create a daily plan with 2-3 sessions max (total ≤ 30 minutes).
Each session: 5-10 minutes, one clear goal, one game type.

For each session include:
- order (1, 2, 3)
- module (speech/daily_skills/safety/emotions/social)
- game_type (from valid game types)
- skill_key (from VB-MAPP skills)
- target_cards (2-3 max)
- estimated_duration_minutes
- parent_instruction_ru: simple instruction for parent (not jargon)
- parent_instruction_uz: same in Uzbek
- why_this_exercise_ru: 1 sentence explanation WHY this exercise
- why_this_exercise_uz: same in Uzbek

Also provide:
- daily_tip_ru: one practical tip for today
- daily_tip_uz: same in Uzbek

Keep it realistic, not overwhelming. Parents are not therapists.
Return valid JSON.`;
}

function getSpeechLevelDescription(level: number): string {
  const descriptions: Record<number, string> = {
    1: 'no speech',
    2: 'produces sounds',
    3: 'single words',
    4: 'two-word combinations',
    5: 'simple phrases',
    6: 'answers questions',
    7: 'describes situations',
  };
  return descriptions[level] ?? 'unknown';
}
