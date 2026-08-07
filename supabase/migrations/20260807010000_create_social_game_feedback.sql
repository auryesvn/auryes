create table public.social_game_feedback (
  id uuid primary key default gen_random_uuid(),
  box_code text not null,
  event_code text not null,
  rating smallint not null,
  memorable_moment text null,
  play_again boolean not null,
  instagram_handle text null,
  reconnect_consent boolean not null default false,
  created_at timestamptz not null default now(),

  constraint social_game_feedback_box_code_format
    check (
      box_code = btrim(box_code)
      and char_length(box_code) between 1 and 64
      and box_code ~ '^[A-Za-z0-9][A-Za-z0-9_-]*$'
    ),
  constraint social_game_feedback_event_code_format
    check (
      event_code = btrim(event_code)
      and char_length(event_code) between 1 and 64
      and event_code ~ '^[A-Za-z0-9][A-Za-z0-9_-]*$'
    ),
  constraint social_game_feedback_rating_range
    check (rating between 1 and 5),
  constraint social_game_feedback_memorable_moment_length
    check (
      memorable_moment is null
      or char_length(memorable_moment) <= 800
    ),
  constraint social_game_feedback_instagram_handle_format
    check (
      instagram_handle is null
      or (
        instagram_handle = btrim(instagram_handle)
        and char_length(instagram_handle) between 1 and 30
        and instagram_handle ~ '^[A-Za-z0-9._]+$'
      )
    ),
  constraint social_game_feedback_reconnect_requires_instagram
    check (not reconnect_consent or instagram_handle is not null)
);

alter table public.social_game_feedback enable row level security;

revoke all privileges on table public.social_game_feedback
  from public, anon, authenticated;

grant insert on table public.social_game_feedback to service_role;
