export type VBMAPPLevel = 1 | 2 | 3;

export type Skill = {
  key: string;
  nameRu: string;
  nameUz: string;
  level: VBMAPPLevel;
  domain: 'speech' | 'imitation' | 'visual' | 'play' | 'social' | 'daily_skills' | 'safety' | 'emotions';
  ageMonthsApprox: number;
  description: string;
  exerciseTypes: string[];
  prerequisiteKeys?: string[];
};

export const VBMAPP_SKILLS: Skill[] = [
  // ─── LEVEL 1 (~18 months) ───────────────────────────────────────────────────
  {
    key: 'responds_to_name',
    nameRu: 'Откликается на имя',
    nameUz: 'Ismiga munosabat bildiradi',
    level: 1,
    domain: 'social',
    ageMonthsApprox: 12,
    description: 'Поворачивает голову или смотрит в ответ на имя',
    exerciseTypes: ['name_response'],
  },
  {
    key: 'follows_simple_instruction',
    nameRu: 'Выполняет простые инструкции',
    nameUz: "Oddiy ko'rsatmalarga amal qiladi",
    level: 1,
    domain: 'speech',
    ageMonthsApprox: 15,
    description: 'Иди сюда, дай, покажи',
    exerciseTypes: ['instruction_following'],
  },
  {
    key: 'choose_from_2',
    nameRu: 'Выбирает из 2 карточек',
    nameUz: '2 ta kartochkadan tanlaydi',
    level: 1,
    domain: 'visual',
    ageMonthsApprox: 15,
    description: 'Показывает на названную карточку из 2',
    exerciseTypes: ['choose_1of2'],
  },
  {
    key: 'points_gesture',
    nameRu: 'Указывает жестом',
    nameUz: "Ko'rsatib bildiradi",
    level: 1,
    domain: 'social',
    ageMonthsApprox: 12,
    description: 'Указывает пальцем на желаемый предмет',
    exerciseTypes: ['gesture_pointing'],
  },
  {
    key: 'names_family',
    nameRu: 'Называет членов семьи',
    nameUz: "Oila a'zolarini nomlaydi",
    level: 1,
    domain: 'speech',
    ageMonthsApprox: 18,
    description: 'Говорит Ойи, Ада, Буви',
    exerciseTypes: ['name_card', 'choose_1of2'],
  },
  {
    key: 'names_objects_5',
    nameRu: 'Называет 5+ предметов',
    nameUz: '5+ predmetni nomlaydi',
    level: 1,
    domain: 'speech',
    ageMonthsApprox: 18,
    description: 'Чашка, ложка, мяч, машина, книга',
    exerciseTypes: ['name_card', 'choose_1of2'],
  },
  {
    key: 'hand_washing',
    nameRu: 'Моет руки (с помощью)',
    nameUz: "Qo'llarini yuvadi (yordamda)",
    level: 1,
    domain: 'daily_skills',
    ageMonthsApprox: 18,
    description: 'Пошаговое мытьё рук с физической подсказкой',
    exerciseTypes: ['visual_sequence'],
  },
  {
    key: 'basic_safety_stop',
    nameRu: 'Реагирует на "Стой!"',
    nameUz: '"To\'xta!" ga munosabat bildiradi',
    level: 1,
    domain: 'safety',
    ageMonthsApprox: 15,
    description: 'Останавливается по команде',
    exerciseTypes: ['safety_command'],
  },
  {
    key: 'recognizes_emotions_2',
    nameRu: 'Узнаёт 2 эмоции',
    nameUz: "2 ta his-tuyg'uni taniydi",
    level: 1,
    domain: 'emotions',
    ageMonthsApprox: 18,
    description: 'Счастлив / Грустит на картинке',
    exerciseTypes: ['choose_1of2', 'emotion_match'],
  },

  // ─── LEVEL 2 (~30 months) ───────────────────────────────────────────────────
  {
    key: 'choose_from_3',
    nameRu: 'Выбирает из 3 карточек',
    nameUz: '3 ta kartochkadan tanlaydi',
    level: 2,
    domain: 'visual',
    ageMonthsApprox: 24,
    description: 'Показывает на названную карточку из 3',
    exerciseTypes: ['choose_1of3'],
    prerequisiteKeys: ['choose_from_2'],
  },
  {
    key: 'two_word_phrase',
    nameRu: 'Строит фразу из 2 слов',
    nameUz: "2 so'zli jumla tuzadi",
    level: 2,
    domain: 'speech',
    ageMonthsApprox: 24,
    description: 'Ойи еяпти, Ада кетяпти',
    exerciseTypes: ['build_phrase', 'answer_question'],
    prerequisiteKeys: ['names_family', 'names_objects_5'],
  },
  {
    key: 'answers_who',
    nameRu: 'Отвечает на "Кто это?"',
    nameUz: '"Bu kim?" ga javob beradi',
    level: 2,
    domain: 'speech',
    ageMonthsApprox: 24,
    description: 'Называет людей по фото',
    exerciseTypes: ['answer_question'],
    prerequisiteKeys: ['names_family'],
  },
  {
    key: 'answers_what',
    nameRu: 'Отвечает на "Что это?"',
    nameUz: '"Bu nima?" ga javob beradi',
    level: 2,
    domain: 'speech',
    ageMonthsApprox: 24,
    description: 'Называет предметы по картинке',
    exerciseTypes: ['answer_question'],
    prerequisiteKeys: ['names_objects_5'],
  },
  {
    key: 'dressing_assisted',
    nameRu: 'Одевается (с помощью)',
    nameUz: 'Kiyinadi (yordamda)',
    level: 2,
    domain: 'daily_skills',
    ageMonthsApprox: 30,
    description: 'Надевает штаны, носки, куртку с подсказкой',
    exerciseTypes: ['visual_sequence'],
    prerequisiteKeys: ['hand_washing'],
  },
  {
    key: 'recognizes_emotions_5',
    nameRu: 'Узнаёт 5 эмоций',
    nameUz: "5 ta his-tuyg'uni taniydi",
    level: 2,
    domain: 'emotions',
    ageMonthsApprox: 30,
    description: 'Счастлив, грустит, злится, боится, устал',
    exerciseTypes: ['choose_1of3', 'emotion_match'],
    prerequisiteKeys: ['recognizes_emotions_2'],
  },
  {
    key: 'asks_for_help',
    nameRu: 'Просит о помощи',
    nameUz: "Yordam so'raydi",
    level: 2,
    domain: 'social',
    ageMonthsApprox: 24,
    description: 'Говорит или показывает "помоги"',
    exerciseTypes: ['mand_training'],
    prerequisiteKeys: ['follows_simple_instruction'],
  },

  // ─── LEVEL 3 (~48 months) ───────────────────────────────────────────────────
  {
    key: 'three_word_phrase',
    nameRu: 'Строит фразу из 3 слов',
    nameUz: "3 so'zli jumla tuzadi",
    level: 3,
    domain: 'speech',
    ageMonthsApprox: 36,
    description: 'Ойи тухум еяпти',
    exerciseTypes: ['build_phrase', 'answer_question'],
    prerequisiteKeys: ['two_word_phrase'],
  },
  {
    key: 'answers_where',
    nameRu: 'Отвечает на "Где?"',
    nameUz: '"Qayerda?" ga javob beradi',
    level: 3,
    domain: 'speech',
    ageMonthsApprox: 36,
    description: 'Ада уйда, Буви ошхонада',
    exerciseTypes: ['answer_question'],
    prerequisiteKeys: ['answers_who'],
  },
  {
    key: 'answers_doing',
    nameRu: 'Отвечает на "Что делает?"',
    nameUz: '"Nima qilyapti?" ga javob beradi',
    level: 3,
    domain: 'speech',
    ageMonthsApprox: 36,
    description: 'Ойи еяпти, Ада ўқияпти',
    exerciseTypes: ['answer_question', 'build_phrase'],
    prerequisiteKeys: ['two_word_phrase'],
  },
  {
    key: 'independent_dressing',
    nameRu: 'Одевается самостоятельно',
    nameUz: 'Mustaqil kiyinadi',
    level: 3,
    domain: 'daily_skills',
    ageMonthsApprox: 48,
    description: 'Полный цикл одевания без помощи',
    exerciseTypes: ['visual_sequence'],
    prerequisiteKeys: ['dressing_assisted'],
  },
  {
    key: 'expresses_emotions',
    nameRu: 'Выражает эмоции словами',
    nameUz: "His-tuyg'ularini so'zda ifodalaydi",
    level: 3,
    domain: 'emotions',
    ageMonthsApprox: 36,
    description: 'Говорит "Мне грустно", "Я рад"',
    exerciseTypes: ['emotion_expression'],
    prerequisiteKeys: ['recognizes_emotions_5'],
  },
  {
    key: 'social_story_follows',
    nameRu: 'Понимает социальные истории',
    nameUz: 'Ijtimoiy hikoyalarni tushunadi',
    level: 3,
    domain: 'social',
    ageMonthsApprox: 42,
    description: 'Следует визуальному расписанию',
    exerciseTypes: ['social_story'],
    prerequisiteKeys: ['asks_for_help'],
  },
];

export const getSkillsByDomain = (domain: Skill['domain']): Skill[] =>
  VBMAPP_SKILLS.filter((s) => s.domain === domain);

export const getSkillsByLevel = (level: VBMAPPLevel): Skill[] =>
  VBMAPP_SKILLS.filter((s) => s.level === level);

export const getSkillByKey = (key: string): Skill | undefined =>
  VBMAPP_SKILLS.find((s) => s.key === key);
