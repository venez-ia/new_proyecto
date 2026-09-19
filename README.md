# Reporte Situacional Intel — Diario y Semanal

Dashboard de inteligencia y operaciones (estilo OSINT) con 4 paneles en tiempo real:

1. **Exploración Exterior** — monitoreo internacional por país.
2. **Exploración Interna** — conflicto político, protestas, sabotajes, GEDOS, etc.
3. **Aero Naval** — estatus operacional (carga manual).
4. **Conducción Meteorológica** — snapshot climático automatizado.

La base de datos se alimenta diariamente por un workflow de **n8n** que scrapea
fuentes RSS de medios abiertos, clasifica los artículos y los guarda en
**Supabase**. El dashboard (Next.js) se suscribe a Supabase Realtime y se
actualiza solo, sin recargar la página.

## Stack

- Next.js 16 (App Router, TypeScript) + Tailwind CSS 4
- Supabase (Postgres + Realtime)
- n8n (automatización de scraping + clasificación)

## 1. Configurar Supabase

Proyecto: `https://msgllfwlousyfmeerrmx.supabase.co`

1. Abre el **SQL Editor** de tu proyecto Supabase y ejecuta, en orden:
   - `supabase/migrations/0001_init.sql` (crea todas las tablas, RLS y realtime)
   - `supabase/seed/0001_seed_sources.sql` (fuentes RSS de ejemplo — ajústalas a tu criterio)
2. Copia `.env.local.example` a `.env.local` y completa:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Settings → API → anon/public key)

   La `service_role` key **no** va en el frontend; solo la usa n8n (paso 3).

## 2. Correr el dashboard

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Al principio los paneles mostrarán "sin datos"
hasta que corra la primera vez el workflow de n8n (o cargues datos de prueba
manualmente en las tablas).

## 3. Configurar el workflow de n8n

Workflow ya creado (sin activar): **Reporte Situacional - Scraping OSINT Diario**
en tu instancia de n8n.

Antes de activarlo:

1. Crea una credencial tipo **Supabase API** llamada
   `Supabase - Reporte Situacional`:
   - Host: `https://msgllfwlousyfmeerrmx.supabase.co`
   - Service Role Secret: tu `service_role` key (Settings → API)
2. Revisa/edita la tabla `sources` en Supabase para apuntar a los medios que
   realmente quieres scrapear (por defecto trae 5 RSS de ejemplo).
3. Ajusta la latitud/longitud del nodo "Consultar Clima (Open-Meteo)" al
   punto geográfico que te interese (por defecto: Bogotá).
4. Actívalo. Corre todos los días a las 06:00 (hora de la instancia n8n):
   - Lee las fuentes activas → lee cada feed RSS → normaliza cada artículo →
     lo inserta en `articles` (ignora duplicados por URL) → clasifica el
     artículo nuevo en Exploración Exterior/Interna → lo inserta en
     `situational_events`.
   - En paralelo, consulta el clima actual (Open-Meteo, sin API key) y lo
     guarda en `meteorologia_status`.

El panel **Aero Naval** no tiene fuente abierta automatizable (es dato
operacional propio) — se carga insertando filas manualmente en
`aero_naval_status`, o puedes conectar tu propio sistema más adelante.

## Estructura de datos

Ver `supabase/migrations/0001_init.sql`. Tablas principales:

- `sources` — fuentes RSS activas para scraping.
- `articles` — artículos crudos scrapeados (deduplicados por `url`).
- `situational_events` — eventos ya clasificados que alimentan los paneles
  1 y 2 del dashboard.
- `aero_naval_status`, `meteorologia_status` — snapshots diarios de los
  paneles 3 y 4.
- `reports` / `report_items` — para futuros reportes consolidados
  diarios/semanales (snapshot histórico).

## Reportes diario/semanal

El esquema ya incluye `reports`/`report_items` para guardar snapshots
consolidados (por ejemplo, un resumen generado al cierre del día o de la
semana). Aún no hay automatización que los genere — es el siguiente paso
natural: un workflow n8n adicional (o un cron semanal) que lea
`situational_events` del período y arme el resumen.
