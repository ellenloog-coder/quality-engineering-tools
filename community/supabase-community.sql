-- Run this once in Supabase SQL Editor.
create table if not exists public.community_feedback (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  message text not null,
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  constraint community_feedback_name_length check (display_name is null or char_length(display_name) <= 80),
  constraint community_feedback_message_length check (char_length(message) between 1 and 2000)
);

alter table public.community_feedback enable row level security;

grant select, insert on public.community_feedback to anon;

drop policy if exists "Anyone can read approved feedback" on public.community_feedback;
create policy "Anyone can read approved feedback"
  on public.community_feedback for select to anon
  using (status = 'approved');

drop policy if exists "Anyone can submit pending feedback" on public.community_feedback;
create policy "Anyone can submit pending feedback"
  on public.community_feedback for insert to anon
  with check (status = 'approved');

-- If the table already exists, use the same auto-publish behavior for new rows.
alter table public.community_feedback alter column status set default 'approved';
drop policy if exists "Anyone can submit pending feedback" on public.community_feedback;
create policy "Anyone can submit approved feedback"
  on public.community_feedback for insert to anon
  with check (status = 'approved');

create index if not exists community_feedback_approved_created_idx
  on public.community_feedback (created_at desc)
  where status = 'approved';
