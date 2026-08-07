alter table public.social_game_feedback
  add column favorite_card_id smallint null,
  add column favorite_card_reason text null,
  add constraint social_game_feedback_favorite_card_id_range
    check (favorite_card_id is null or favorite_card_id between 1 and 31),
  add constraint social_game_feedback_favorite_card_reason_length
    check (
      favorite_card_reason is null
      or char_length(favorite_card_reason) <= 500
    );
