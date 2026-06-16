-- Track adults and kids separately on each RSVP
alter table guests add column if not exists adult_count int not null default 1;
alter table guests add column if not exists kids_count  int not null default 0;
