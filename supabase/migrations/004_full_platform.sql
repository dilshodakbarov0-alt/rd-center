-- Users extended
create table if not exists user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  role text not null default 'parent' check (role in ('parent','specialist','methodologist','admin')),
  full_name text,
  phone text,
  organization text,
  avatar_url text,
  language text default 'ru',
  created_at timestamptz default now()
);

-- Family members (people only — no objects)
create table if not exists family_members (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  role text not null,
  name text,
  photo_url text,
  consent_given boolean default false,
  created_at timestamptz default now()
);

-- AI-generated characters from family photos
create table if not exists generated_characters (
  id uuid primary key default gen_random_uuid(),
  family_member_id uuid references family_members(id) on delete cascade,
  child_id uuid references children(id) on delete cascade,
  character_style text default 'cartoon_clean',
  character_url text,
  generation_prompt text,
  confirmed boolean default false,
  created_at timestamptz default now()
);

-- Private training videos (not shown to other users)
create table if not exists uploaded_videos (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  uploaded_by uuid references auth.users(id),
  uploader_role text not null,
  title text,
  storage_path text not null,
  duration_seconds int,
  file_size_bytes bigint,
  consent_given boolean default false,
  analysis_status text default 'queued' check (analysis_status in ('uploading','queued','analyzing','complete','failed')),
  created_at timestamptz default now()
);

-- Video analysis results
create table if not exists video_analysis (
  id uuid primary key default gen_random_uuid(),
  video_id uuid references uploaded_videos(id) on delete cascade,
  duration_seconds int,
  attempts_count int,
  lesson_goal text,
  instruction_quality text,
  pause_before_prompt boolean,
  prompt_type text,
  child_response_rate numeric,
  reinforcement_used boolean,
  fatigue_signs boolean,
  methodology_rating int check (methodology_rating between 1 and 5),
  recommendation text,
  next_exercise_suggestion text,
  raw_analysis jsonb,
  created_at timestamptz default now()
);

-- AI-generated cards (objects/actions/places/emotions — NOT photos)
alter table cards add column if not exists generated_by_ai boolean default false;
alter table cards add column if not exists style text default 'cartoon_clean';
alter table cards add column if not exists phrases jsonb;
alter table cards add column if not exists questions jsonb;

-- Games
create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  game_type text not null,
  title_ru text,
  title_uz text,
  instruction_ru text,
  instruction_uz text,
  card_ids uuid[],
  difficulty_level int default 1,
  prompt_level int default 1,
  success_criteria text,
  complexity_rule text,
  simplification_rule text,
  created_by_ai boolean default true,
  created_at timestamptz default now()
);

-- AI Video Lessons (15-30 seconds)
create table if not exists ai_lessons (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  audience text not null check (audience in ('child','parent','specialist')),
  title text,
  duration_seconds int,
  scenes jsonb not null,
  voiceover_script text,
  language text default 'uz',
  status text default 'draft' check (status in ('draft','generating','ready','archived')),
  video_url text,
  thumbnail_url text,
  created_at timestamptz default now()
);

-- Methodological base materials (methodologist/admin only)
create table if not exists method_materials (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid references auth.users(id),
  title text not null,
  material_type text not null check (material_type in ('book','pdf','protocol','checklist','research','docx')),
  storage_path text not null,
  file_size_bytes bigint,
  language text default 'ru',
  tags text[],
  summary text,
  processing_status text default 'queued' check (processing_status in ('queued','processing','complete','failed')),
  created_at timestamptz default now()
);

-- Extracted methodology rules
create table if not exists method_rules (
  id uuid primary key default gen_random_uuid(),
  material_id uuid references method_materials(id) on delete cascade,
  rule_text text not null,
  domain text not null,
  confidence numeric check (confidence between 0 and 1),
  status text default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- Audit log
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  action text not null,
  resource_type text,
  resource_id uuid,
  metadata jsonb,
  ip_address text,
  created_at timestamptz default now()
);

-- Reports
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  period_start date,
  period_end date,
  report_type text check (report_type in ('parent_simple','specialist_detailed','weekly','monthly')),
  summary jsonb,
  generated_at timestamptz default now()
);

-- Sensory profile (if not already exists from 003)
create table if not exists sensory_profiles (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade unique,
  sound_sensitivity int check (sound_sensitivity between 1 and 5),
  touch_sensitivity int check (touch_sensitivity between 1 and 5),
  light_sensitivity int check (light_sensitivity between 1 and 5),
  movement_sensitivity int check (movement_sensitivity between 1 and 5),
  visual_load_sensitivity int check (visual_load_sensitivity between 1 and 5),
  notes text,
  updated_at timestamptz default now()
);

-- RLS policies
alter table user_profiles enable row level security;
alter table family_members enable row level security;
alter table generated_characters enable row level security;
alter table uploaded_videos enable row level security;
alter table video_analysis enable row level security;
alter table games enable row level security;
alter table ai_lessons enable row level security;
alter table method_materials enable row level security;
alter table method_rules enable row level security;
alter table reports enable row level security;

create policy "Users manage own profile" on user_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Parent manages family members" on family_members
  for all using (exists (select 1 from children c where c.id = child_id and c.parent_id = auth.uid()));

create policy "Parent manages characters" on generated_characters
  for all using (exists (select 1 from children c where c.id = child_id and c.parent_id = auth.uid()));

create policy "Parent manages videos" on uploaded_videos
  for all using (auth.uid() = uploaded_by);

create policy "Specialist manages own videos" on uploaded_videos
  for all using (auth.uid() = uploaded_by);

create policy "Parent views own video analysis" on video_analysis
  for select using (exists (
    select 1 from uploaded_videos v join children c on c.id = v.child_id
    where v.id = video_id and c.parent_id = auth.uid()
  ));

create policy "Parent manages games" on games
  for all using (exists (select 1 from children c where c.id = child_id and c.parent_id = auth.uid()));

create policy "Parent manages AI lessons" on ai_lessons
  for all using (exists (select 1 from children c where c.id = child_id and c.parent_id = auth.uid()));

create policy "Methodologist manages method materials" on method_materials
  for all using (auth.uid() = uploaded_by);

create policy "Users view approved method rules" on method_rules
  for select using (status = 'approved');

create policy "Methodologist manages method rules" on method_rules
  for all using (exists (
    select 1 from user_profiles where user_id = auth.uid() and role in ('methodologist','admin')
  ));

create policy "Parent views own reports" on reports
  for select using (exists (select 1 from children c where c.id = child_id and c.parent_id = auth.uid()));

-- Storage buckets
insert into storage.buckets (id, name, public) values ('family-photos', 'family-photos', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('training-videos', 'training-videos', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('method-materials', 'method-materials', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('ai-lessons', 'ai-lessons', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('characters', 'characters', true) on conflict do nothing;
