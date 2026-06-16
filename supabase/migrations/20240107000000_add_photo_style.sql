-- Photo size and position controls for the invitation card
alter table events
  add column if not exists child_photo_size text default 'md',
  add column if not exists child_photo_position text default 'top-center';
