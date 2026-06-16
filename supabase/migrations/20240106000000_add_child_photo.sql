-- Child photo displayed on the invitation card
alter table events add column if not exists child_photo_url text;
