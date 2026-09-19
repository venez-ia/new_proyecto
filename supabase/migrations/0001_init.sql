-- Reporte Situacional Intel — esquema inicial
-- Panels: 1) Exploración Exterior  2) Exploración Interna
--         3) Aero Naval            4) Conducción Meteorológica

create extension if not exists pgcrypto;

do $$ begin
  create type risk_level as enum ('bajo', 'medio', 'alto', 'critico');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_type as enum ('diario', 'semanal');
exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────────────────────
-- Fuentes abiertas (medios / RSS) que n8n scrapea diariamente
-- ─────────────────────────────────────────────────────────
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  site_url text not null,
  rss_url text not null,
  country text,
  panel_hint text check (panel_hint in ('exploracion_exterior', 'exploracion_interna', 'general')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Artículos crudos obtenidos por el scraping (n8n)
-- ─────────────────────────────────────────────────────────
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references sources(id) on delete set null,
  title text not null,
  url text not null unique,
  summary text,
  content text,
  published_at timestamptz,
  scraped_at timestamptz not null default now(),
  country text,
  processed boolean not null default false,
  processed_at timestamptz
);

create index if not exists idx_articles_source on articles(source_id);
create index if not exists idx_articles_processed on articles(processed);
create index if not exists idx_articles_published on articles(published_at desc);

-- ─────────────────────────────────────────────────────────
-- Eventos situacionales clasificados: un registro por cada
-- ítem que aparece en alguno de los 4 paneles del dashboard
-- ─────────────────────────────────────────────────────────
create table if not exists situational_events (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references articles(id) on delete set null,
  panel text not null check (panel in ('exploracion_exterior', 'exploracion_interna')),
  category text not null,        -- p.ej. país (exterior) o tipo de incidente (interna)
  country text,
  title text not null,
  description text not null,
  risk_level risk_level,
  status_label text,             -- p.ej. 'ACTIVO', 'BAJO RIESGO'
  lat double precision,
  lng double precision,
  event_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists idx_events_panel_date on situational_events(panel, event_date desc);
create index if not exists idx_events_country on situational_events(country);

-- ─────────────────────────────────────────────────────────
-- Snapshot operacional Aero-Naval (panel 3)
-- ─────────────────────────────────────────────────────────
create table if not exists aero_naval_status (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null default current_date,
  aereo_estatus_pct numeric,
  aereo_misiones integer,
  naval_shipeos_desplegados integer,
  naval_horas_patrulla integer,
  notas text,
  created_at timestamptz not null default now(),
  unique (snapshot_date)
);

-- ─────────────────────────────────────────────────────────
-- Snapshot meteorológico (panel 4)
-- ─────────────────────────────────────────────────────────
create table if not exists meteorologia_status (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null default current_date,
  temp_actual numeric,
  temp_max numeric,
  temp_min numeric,
  humedad_pct numeric,
  viento_kmh numeric,
  viento_direccion text,
  condicion text,
  alertas text,
  created_at timestamptz not null default now(),
  unique (snapshot_date)
);

-- ─────────────────────────────────────────────────────────
-- Reportes generados (diario / semanal) — snapshot consolidado
-- ─────────────────────────────────────────────────────────
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  type report_type not null,
  period_start date not null,
  period_end date not null,
  title text not null,
  summary text,
  generated_at timestamptz not null default now()
);

create table if not exists report_items (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references reports(id) on delete cascade,
  situational_event_id uuid references situational_events(id) on delete set null,
  panel text not null,
  sort_order integer default 0
);

create index if not exists idx_report_items_report on report_items(report_id);

-- ─────────────────────────────────────────────────────────
-- Row Level Security: lectura pública (dashboard), escritura
-- solo con service_role (usada por n8n)
-- ─────────────────────────────────────────────────────────
alter table sources enable row level security;
alter table articles enable row level security;
alter table situational_events enable row level security;
alter table aero_naval_status enable row level security;
alter table meteorologia_status enable row level security;
alter table reports enable row level security;
alter table report_items enable row level security;

drop policy if exists "public read sources" on sources;
create policy "public read sources" on sources for select using (true);

drop policy if exists "public read articles" on articles;
create policy "public read articles" on articles for select using (true);

drop policy if exists "public read situational_events" on situational_events;
create policy "public read situational_events" on situational_events for select using (true);

drop policy if exists "public read aero_naval_status" on aero_naval_status;
create policy "public read aero_naval_status" on aero_naval_status for select using (true);

drop policy if exists "public read meteorologia_status" on meteorologia_status;
create policy "public read meteorologia_status" on meteorologia_status for select using (true);

drop policy if exists "public read reports" on reports;
create policy "public read reports" on reports for select using (true);

drop policy if exists "public read report_items" on report_items;
create policy "public read report_items" on report_items for select using (true);

-- ─────────────────────────────────────────────────────────
-- Realtime: publicar cambios para que el dashboard se actualice solo
-- ─────────────────────────────────────────────────────────
alter publication supabase_realtime add table situational_events;
alter publication supabase_realtime add table aero_naval_status;
alter publication supabase_realtime add table meteorologia_status;
