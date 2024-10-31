# ER diagram

### films
- id (int unsigned not null) [PK]
- name (varchar not null)
- author (varchar null default null)
- created_at (datetime not null default now())

### clips
- id (int unsigned not null) [PK]
- start_time (int unsigned not null)
- duration (int unsigned not null)
- film_id (int unsigned not null) [FK films(id)]

### audios
- id (int unsigned not null) [PK]
- start_time (int unsigned not null)
- duration (int unsigned not null)
- volume_level (int unsigned null default null)
- film_id (int unsigned not null) [FK films(id)]

### transitions
- id (int unsigned not null) [PK]
- type (varchar not null)
- start_time (int unsigned not null)
- duration (int unsigned not null)
- clip_id (int unsigned null default null) [FK clips(id)]
- audio_id (int unsigned null default null) [FK audios(id)]
