-- ============================================================
--  BdayInvite — Database Schema
--  Run this in your Supabase SQL Editor (Project → SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ---- Events ----
create table if not exists events (
  id                  uuid primary key default gen_random_uuid(),
  host_name           text not null,
  host_email          text not null,
  title               text not null,
  date                date not null,
  time                text not null,           -- "18:30"
  venue               text not null,
  venue_address       text,
  description         text,
  theme               text not null default 'confetti',
  cover_emoji         text not null default '🎂',
  max_guests          integer,
  plus_ones_allowed   boolean not null default true,
  message_prompt      text,
  dashboard_token     text not null default encode(gen_random_bytes(24), 'hex'),
  created_at          timestamptz not null default now()
);

-- ---- Guests ----
create table if not exists guests (
  id              uuid primary key default gen_random_uuid(),
  event_id        uuid not null references events(id) on delete cascade,
  name            text not null,
  email           text not null,
  phone           text,
  rsvp_status     text not null check (rsvp_status in ('attending', 'not_attending', 'maybe')),
  plus_one_count  integer not null default 0,
  message         text,
  invited_at      timestamptz,
  rsvped_at       timestamptz not null default now(),
  unique(event_id, email)
);

-- ---- Row Level Security ----
-- Events are readable by anyone with the id; writable only via service role
alter table events enable row level security;
alter table guests enable row level security;

-- Public can read events (needed for RSVP page)
create policy "Public can read events"
  on events for select using (true);

-- Public can insert guests (RSVP)
create policy "Public can insert guests"
  on guests for insert with check (true);

-- Public can read guests for an event (for dashboard via token check in app layer)
create policy "Public can read guests"
  on guests for select using (true);

-- ---- Indexes ----
create index if not exists guests_event_id_idx on guests(event_id);
create index if not exists events_host_email_idx on events(host_email);
