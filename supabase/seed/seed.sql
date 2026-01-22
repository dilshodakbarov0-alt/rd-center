insert into projects (id, owner_id, name, type, zone, status, region, raw_json)
values (
  '11111111-1111-1111-1111-111111111111',
  null,
  'Basalt-GypLight Mix',
  'ceiling',
  'Interior',
  'in_progress',
  'Tashkent',
  '{"id":"basalt-gyplight","name":"Basalt-GypLight Mix","type":"ceiling"}'::jsonb
);

insert into constraints (project_id, eps_policy, min_pull_off_mpa)
values ('11111111-1111-1111-1111-111111111111', 'forbidden', 0.40);

insert into targets (project_id, density_kg_m3, strength_mpa)
values ('11111111-1111-1111-1111-111111111111', 920, 0.35);

insert into variants (project_id, name, summary, raw_json)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Eco',
    'Low-cost gypsum mix with basalt fiber.',
    '{"name":"Eco","components":[{"name":"Gypsum","ratio":0.62}]}'::jsonb
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'Standard',
    'Balanced strength and workability.',
    '{"name":"Standard","components":[{"name":"Gypsum","ratio":0.58}]}'::jsonb
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'Pro',
    'High performance ceiling finish.',
    '{"name":"Pro","components":[{"name":"Gypsum","ratio":0.52}]}'::jsonb
  );

insert into translations (locale, key, value)
values
  ('ru', 'dashboard.title', 'Проекты'),
  ('uz', 'dashboard.title', 'Loyihalar');
