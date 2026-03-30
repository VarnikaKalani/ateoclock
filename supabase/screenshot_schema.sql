create extension if not exists pgcrypto;

create table if not exists public.recipe_screenshots (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'landing-upload',
  original_filename text not null,
  storage_path text not null unique,
  mime_type text not null,
  file_size_bytes bigint not null check (file_size_bytes > 0),
  status text not null default 'uploaded' check (status in ('uploaded', 'parsed', 'failed')),
  extracted_recipe_title text,
  extracted_ingredients jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recipe_screenshots_created_at_idx
  on public.recipe_screenshots (created_at desc);

create index if not exists recipe_screenshots_status_idx
  on public.recipe_screenshots (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists recipe_screenshots_set_updated_at on public.recipe_screenshots;

create trigger recipe_screenshots_set_updated_at
before update on public.recipe_screenshots
for each row
execute function public.set_updated_at();

alter table public.recipe_screenshots enable row level security;

insert into storage.buckets (id, name, public)
values ('recipe-screenshots', 'recipe-screenshots', false)
on conflict (id) do nothing;

comment on table public.recipe_screenshots is
'Stores uploaded recipe screenshots and any extracted ingredient payload for Coookd.';
