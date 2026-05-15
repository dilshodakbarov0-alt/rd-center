-- ============================================================
-- 003_v4_additions.sql
-- Bolajon Rivoj — v4 schema additions
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. ai_request_log  (admin-only, no RLS)
-- ────────────────────────────────────────────────────────────
create table if not exists ai_request_log (
  id               uuid        primary key default gen_random_uuid(),
  child_id         uuid        references children(id) on delete set null,
  request_type     text        not null,          -- e.g. 'bg_remove', 'cartoonify', 'plan_generate'
  model_used       text,                          -- e.g. 'gpt-4o', 'gemini-1.5-pro'
  tokens_used      int,
  cost_estimate    numeric(10, 6),                -- USD
  response_summary text,
  created_at       timestamptz default now()
);

-- No RLS — admin-only access controlled at application layer.

-- ────────────────────────────────────────────────────────────
-- 2. consent_records
-- ────────────────────────────────────────────────────────────
create table if not exists consent_records (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        references auth.users(id) on delete cascade,
  consent_type text        not null
                           check (consent_type in ('photo', 'video', 'external_ai', 'data_improvement')),
  granted      bool        not null default false,
  granted_at   timestamptz,
  revoked_at   timestamptz,
  unique (user_id, consent_type)
);

alter table consent_records enable row level security;

create policy "Consent visible to owner" on consent_records
  for select using (auth.uid() = user_id);

create policy "Consent insertable by owner" on consent_records
  for insert with check (auth.uid() = user_id);

create policy "Consent updatable by owner" on consent_records
  for update using (auth.uid() = user_id);

create policy "Consent deletable by owner" on consent_records
  for delete using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 3. sensory_profile
-- ────────────────────────────────────────────────────────────
create table if not exists sensory_profile (
  id                      uuid        primary key default gen_random_uuid(),
  child_id                uuid        references children(id) on delete cascade unique,
  sound_sensitivity       smallint    default 3 check (sound_sensitivity between 1 and 5),
  touch_sensitivity       smallint    default 3 check (touch_sensitivity between 1 and 5),
  light_sensitivity       smallint    default 3 check (light_sensitivity between 1 and 5),
  movement_sensitivity    smallint    default 3 check (movement_sensitivity between 1 and 5),
  visual_load_sensitivity smallint    default 3 check (visual_load_sensitivity between 1 and 5),
  notes                   text,
  updated_at              timestamptz default now()
);

alter table sensory_profile enable row level security;

create policy "Sensory profile visible to parent" on sensory_profile
  for select using (
    exists (
      select 1 from children
      where children.id = sensory_profile.child_id
        and children.parent_id = auth.uid()
    )
  );

create policy "Sensory profile insertable by parent" on sensory_profile
  for insert with check (
    exists (
      select 1 from children
      where children.id = sensory_profile.child_id
        and children.parent_id = auth.uid()
    )
  );

create policy "Sensory profile updatable by parent" on sensory_profile
  for update using (
    exists (
      select 1 from children
      where children.id = sensory_profile.child_id
        and children.parent_id = auth.uid()
    )
  );

create policy "Sensory profile visible to specialist" on sensory_profile
  for select using (
    exists (
      select 1 from specialist_children sc
      where sc.child_id = sensory_profile.child_id
        and sc.specialist_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────
-- 4. Alter existing tables
-- ────────────────────────────────────────────────────────────

-- Add vbmapp_level to skill_map
alter table skill_map
  add column if not exists vbmapp_level int default 1
    check (vbmapp_level between 1 and 3);

-- Add emotion column to cards (nullable — only set for emotion-type cards)
alter table cards
  add column if not exists emotion text
    check (emotion in ('happy', 'sad', 'angry', 'scared', 'tired', 'proud', 'sick'));
