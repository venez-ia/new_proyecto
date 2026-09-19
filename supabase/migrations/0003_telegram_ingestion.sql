-- Ingesta de incidencias reportadas por grupos de Telegram, y boletín
-- textual de fuente oficial (INAMEH) para el panel meteorológico.

create table if not exists telegram_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id bigint not null,
  chat_title text,
  message_id bigint not null,
  sender_username text,
  sender_name text,
  text text not null,
  message_date timestamptz,
  received_at timestamptz not null default now(),
  processed boolean not null default false,
  unique (chat_id, message_id)
);

create index if not exists idx_telegram_messages_chat on telegram_messages(chat_id);
create index if not exists idx_telegram_messages_processed on telegram_messages(processed);

alter table situational_events
  add column if not exists telegram_message_id uuid references telegram_messages(id) on delete set null;

alter table meteorologia_status
  add column if not exists boletin_oficial text;

alter table telegram_messages enable row level security;

drop policy if exists "public read telegram_messages" on telegram_messages;
create policy "public read telegram_messages" on telegram_messages for select using (true);
