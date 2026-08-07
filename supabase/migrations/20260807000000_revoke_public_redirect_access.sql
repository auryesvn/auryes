-- Redirect resolution and administration must use trusted server-side roles.
revoke all privileges on table public.redirects from anon, authenticated;
