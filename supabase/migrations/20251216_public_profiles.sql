
-- Add public profile fields
alter table public.profiles 
add column if not exists is_public boolean default false;

-- Add RLS policy for public profiles
-- Anyone can view a profile if is_public is true
create policy "Public profiles are viewable by everyone if is_public"
on profiles for select
using ( is_public = true );

-- Allow viewing public entries
-- Policy: Entries are viewable if they belong to a user with is_public=true AND the entry is 'High' impact
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
