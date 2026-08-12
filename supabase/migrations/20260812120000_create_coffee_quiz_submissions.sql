create table public.coffee_quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  quiz_version smallint not null,
  name text not null,
  instagram_handle text null,
  address_mode text not null,
  answers jsonb not null,
  verdict_key text not null,
  profile_snapshot jsonb not null,
  constraint coffee_quiz_version check (quiz_version = 1),
  constraint coffee_quiz_name check (name = btrim(name) and char_length(name) between 1 and 80),
  constraint coffee_quiz_instagram check (instagram_handle is null or (char_length(instagram_handle) between 1 and 30 and instagram_handle ~ '^[a-z0-9._]+$')),
  constraint coffee_quiz_address_mode check (address_mode in ('ban_minh', 'cau_minh', 'anh_em')),
  constraint coffee_quiz_answers_object check (jsonb_typeof(answers) = 'object'),
  constraint coffee_quiz_verdict check (verdict_key in ('uncertain', 'promising', 'friend_like', 'different_system')),
  constraint coffee_quiz_profile_object check (jsonb_typeof(profile_snapshot) = 'object')
);

alter table public.coffee_quiz_submissions enable row level security;

revoke all privileges on table public.coffee_quiz_submissions
  from public, anon, authenticated;

grant insert on table public.coffee_quiz_submissions to service_role;
