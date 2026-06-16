-- ============================================================
--  Migration: Add user authentication
-- ============================================================

-- Add user_id FK to events
alter table events
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists events_user_id_idx on events(user_id);

-- Users can read/update/delete their own events
create policy "Users can manage their own events"
  on events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
