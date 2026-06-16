-- Banner selection: library ID or custom uploaded URL
alter table events add column if not exists banner_id  text;
alter table events add column if not exists banner_url text;
