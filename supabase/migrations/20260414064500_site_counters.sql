create table if not exists public.site_counters (
  key text primary key,
  value integer not null default 0 check (value >= 0),
  updated_at timestamptz not null default now()
);

insert into public.site_counters (key, value)
values ('love_this_idea', 501)
on conflict (key) do update
set value = greatest(public.site_counters.value, excluded.value),
    updated_at = case
      when public.site_counters.value < excluded.value then now()
      else public.site_counters.updated_at
    end;

alter table public.site_counters enable row level security;

drop policy if exists site_counters_public_read on public.site_counters;

create policy site_counters_public_read
on public.site_counters
for select
to anon, authenticated
using (key = 'love_this_idea');

create or replace function public.increment_love_this_idea()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  next_value integer;
begin
  insert into public.site_counters (key, value)
  values ('love_this_idea', 502)
  on conflict (key) do update
  set value = public.site_counters.value + 1,
      updated_at = now()
  returning value into next_value;

  return next_value;
end;
$$;

revoke all on function public.increment_love_this_idea() from public;
grant select on table public.site_counters to anon, authenticated;
grant execute on function public.increment_love_this_idea() to anon, authenticated;
