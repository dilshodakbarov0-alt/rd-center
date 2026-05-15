create extension if not exists "pgcrypto";

create table if not exists children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references auth.users(id),
  name text not null,
  birth_date date,
  diagnosis text check (diagnosis in ('РАС', 'ЗПРР', 'ЗРР', 'other')),
  speech_level smallint default 0 check (speech_level between 0 and 5),
  language text default 'ru' check (language in ('ru', 'uz_cyr', 'uz_lat', 'bilingual')),
  interests text[],
  sensory_notes text,
  photo_url text,
  created_at timestamptz default now()
);

create table if not exists questionnaire_answers (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  question_key text not null,
  answer text check (answer in ('yes', 'sometimes', 'no', 'unknown')),
  comment text,
  answered_at timestamptz default now()
);

create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  label_ru text not null,
  label_uz text,
  label_uz_lat text,
  category text check (category in ('person', 'object', 'action', 'place', 'emotion')),
  card_type text default 'photo' check (card_type in ('photo', 'illustration')),
  image_url text,
  original_photo_url text,
  confirmed bool default false,
  speech_level_required smallint default 0,
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  conducted_by uuid references auth.users(id),
  module text check (module in ('speech', 'daily_skills', 'safety', 'sensory', 'emotions')),
  exercise_type text check (exercise_type in ('choose_1of2', 'choose_1of3', 'name_card', 'build_phrase', 'answer_question')),
  status text default 'in_progress' check (status in ('in_progress', 'completed', 'paused')),
  started_at timestamptz default now(),
  completed_at timestamptz,
  total_trials int default 0,
  independent_correct int default 0,
  prompted_correct int default 0,
  errors int default 0,
  refusals int default 0
);

create table if not exists session_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  card_id uuid references cards(id),
  target_phrase text,
  outcome text check (outcome in ('independent', 'prompted', 'error', 'refusal', 'no_response')),
  response_time_ms int,
  prompt_level int default 0,
  recorded_at timestamptz default now()
);

create table if not exists skill_map (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  skill_key text not null,
  level smallint default 0 check (level between 0 and 3),
  last_updated timestamptz default now(),
  unique (child_id, skill_key)
);

create table if not exists lesson_plans (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  plan_date date not null,
  exercises jsonb,
  completed bool default false,
  created_at timestamptz default now()
);

create table if not exists specialist_children (
  id uuid primary key default gen_random_uuid(),
  specialist_id uuid references auth.users(id),
  child_id uuid references children(id) on delete cascade,
  role text default 'observer',
  assigned_at timestamptz default now()
);

alter table children enable row level security;
alter table questionnaire_answers enable row level security;
alter table cards enable row level security;
alter table sessions enable row level security;
alter table session_results enable row level security;
alter table skill_map enable row level security;
alter table lesson_plans enable row level security;
alter table specialist_children enable row level security;

create policy "Children visible to parent" on children
  for select using (auth.uid() = parent_id);

create policy "Children insertable by parent" on children
  for insert with check (auth.uid() = parent_id);

create policy "Children updatable by parent" on children
  for update using (auth.uid() = parent_id);

create policy "Questionnaire by parent" on questionnaire_answers
  for all using (
    exists (select 1 from children where children.id = questionnaire_answers.child_id and children.parent_id = auth.uid())
  );

create policy "Cards visible to parent and specialist" on cards
  for select using (
    exists (select 1 from children where children.id = cards.child_id and children.parent_id = auth.uid())
    or exists (select 1 from specialist_children sc where sc.child_id = cards.child_id and sc.specialist_id = auth.uid())
  );

create policy "Cards insertable by parent" on cards
  for insert with check (
    exists (select 1 from children where children.id = cards.child_id and children.parent_id = auth.uid())
  );

create policy "Cards updatable by parent" on cards
  for update using (
    exists (select 1 from children where children.id = cards.child_id and children.parent_id = auth.uid())
  );

create policy "Sessions visible to parent and specialist" on sessions
  for select using (
    exists (select 1 from children where children.id = sessions.child_id and children.parent_id = auth.uid())
    or exists (select 1 from specialist_children sc where sc.child_id = sessions.child_id and sc.specialist_id = auth.uid())
    or auth.uid() = sessions.conducted_by
  );

create policy "Sessions insertable by parent" on sessions
  for insert with check (auth.uid() = sessions.conducted_by);

create policy "Sessions updatable by conductor" on sessions
  for update using (auth.uid() = sessions.conducted_by);

create policy "Session results by session access" on session_results
  for select using (
    exists (
      select 1 from sessions s
      join children c on c.id = s.child_id
      where s.id = session_results.session_id
        and (c.parent_id = auth.uid() or s.conducted_by = auth.uid())
    )
  );

create policy "Session results insertable by conductor" on session_results
  for insert with check (
    exists (select 1 from sessions s where s.id = session_results.session_id and s.conducted_by = auth.uid())
  );

create policy "Skill map visible to parent and specialist" on skill_map
  for select using (
    exists (select 1 from children where children.id = skill_map.child_id and children.parent_id = auth.uid())
    or exists (select 1 from specialist_children sc where sc.child_id = skill_map.child_id and sc.specialist_id = auth.uid())
  );

create policy "Skill map upsertable by parent" on skill_map
  for all using (
    exists (select 1 from children where children.id = skill_map.child_id and children.parent_id = auth.uid())
  );

create policy "Lesson plans visible to parent" on lesson_plans
  for select using (
    exists (select 1 from children where children.id = lesson_plans.child_id and children.parent_id = auth.uid())
  );

create policy "Lesson plans insertable by parent" on lesson_plans
  for insert with check (
    exists (select 1 from children where children.id = lesson_plans.child_id and children.parent_id = auth.uid())
  );

create policy "Specialist children visible to specialist" on specialist_children
  for select using (auth.uid() = specialist_id);

create policy "Specialist children insertable by specialist" on specialist_children
  for insert with check (auth.uid() = specialist_id);

insert into storage.buckets (id, name, public)
  values ('card-photos', 'card-photos', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('child-photos', 'child-photos', true)
  on conflict (id) do nothing;
