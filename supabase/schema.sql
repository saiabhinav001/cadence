-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES (Public profiles linked to Auth Users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,

  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- TAGS
create table public.tags (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null, -- Every tag belongs to a user (no global tags for now to keep it simple, or maybe global tags have user_id null?)
  -- let's stick to user defined tags for personal brag docs
  name text not null,
  color text not null, -- e.g. '#ff00ff', 'neon-blue'
  category text, -- 'skill', 'praise', 'project'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tags enable row level security;

create policy "Users can view own tags"
  on tags for select
  using ( auth.uid() = user_id );

create policy "Users can insert own tags"
  on tags for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own tags"
  on tags for update
  using ( auth.uid() = user_id );

create policy "Users can delete own tags"
  on tags for delete
  using ( auth.uid() = user_id );


-- ENTRIES (The Wins)
create table public.entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  impact text check (impact in ('Low', 'Medium', 'High')) default 'Medium',
  mood text check (mood in ('Flow', 'Drain', 'Neutral')) default 'Flow',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.entries enable row level security;

create policy "Users can view own entries"
  on entries for select
  using ( auth.uid() = user_id );

create policy "Users can insert own entries"
  on entries for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own entries"
  on entries for update
  using ( auth.uid() = user_id );

create policy "Users can delete own entries"
  on entries for delete
  using ( auth.uid() = user_id );

-- ENTRY_TAGS (Junction)
create table public.entry_tags (
  entry_id uuid references public.entries on delete cascade not null,
  tag_id uuid references public.tags on delete cascade not null,
  primary key (entry_id, tag_id)
);

alter table public.entry_tags enable row level security;

create policy "Users can view own entry tags"
  on entry_tags for select
  using ( exists ( select 1 from entries where id = entry_tags.entry_id and user_id = auth.uid() ) );

create policy "Users can insert own entry tags"
  on entry_tags for insert
  with check ( exists ( select 1 from entries where id = entry_tags.entry_id and user_id = auth.uid() ) );

create policy "Users can delete own entry tags"
  on entry_tags for delete
  using ( exists ( select 1 from entries where id = entry_tags.entry_id and user_id = auth.uid() ) );


-- Function to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- PUBLIC PROFILES UPDATE (2025-12-16)
alter table public.profiles 
add column if not exists is_public boolean default false;

-- Allow viewing public profiles
create policy "Public profiles are viewable by everyone if is_public"
on profiles for select
using ( is_public = true );

-- Allow viewing public high-impact entries
create policy "Public high impact entries are viewable"
on entries for select
using (
  exists (
    select 1 from profiles
    where profiles.id = entries.user_id
    and profiles.is_public = true
  )
  and impact = 'High'
);
