-- Add template_id to events
alter table events
  add column if not exists template_id text not null default 'birthday';
