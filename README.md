# Reporte Situacional Intel — Diario y Semanal

Dashboard de inteligencia y operaciones (estilo OSINT) con 4 paneles en tiempo real,
y una hoja de reporte completa por panel (mapa de incidencias + tabla detallada):

1. **Exploración Exterior** — monitoreo internacional por país.
2. **Exploración Interna** — conflicto político, protestas, sabotajes, GEDOS, etc.
   Alimentado también por incidencias reportadas en grupos de Telegram.
3. **Aero Naval** — estatus operacional (carga manual).
4. **Conducción Meteorológica** — Open-Meteo + boletín de INAMEH.

La base de datos se alimenta por un workflow de **n8n** con tres ramas:
scraping diario de RSS de medios abiertos, snapshot meteorológico diario
(Open-Meteo + INAMEH) e ingesta en tiempo real de mensajes de grupos de
Telegram. Todo se clasifica y guarda en **Supabase**. El dashboard (Next.js)
se suscribe a Supabase Realtime y se actualiza solo, sin recargar la página
— funciona igual en navegador de escritorio o de celular (responsive).

Nota sobre identidad visual: este proyecto usa branding genérico (sin
escudos, sellos ni nombres de una institución militar/gubernamental real),
ya que no se puede verificar autorización para usar símbolos oficiales de
terceros. Si tienes derechos sobre un logo propio, puedes agregarlo tú
mismo en `src/components/DashboardHeader.tsx`.

## Stack

- Next.js 16 (App Router, TypeScript) + Tailwind CSS 4
- Supabase (Postgres + Realtime)
- Leaflet / react-leaflet (mapas de incidencias)
- n8n (scraping RSS + Telegram + meteorología)

## 1. Configurar Supabase

Proyecto: `https://msgllfwlousyfmeerrmx.supabase.co`

1. Abre el **SQL Editor** de tu proyecto Supabase y ejecuta, **en este orden**:
   - `supabase/migrations/0001_init.sql` (tablas base, RLS y realtime)
   - `supabase/migrations/0002_full_report_pages.sql` (habilita incidencias en los 4 paneles + `location_label`/`event_time`)
   - `supabase/migrations/0003_telegram_ingestion.sql` (tabla `telegram_messages` + boletín INAMEH)
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
en tu instancia de n8n, con 3 ramas independientes:

### Rama A — Scraping RSS (diario, 06:00)
Lee las fuentes activas → lee cada feed RSS → normaliza cada artículo → lo
inserta en `articles` (ignora duplicados por URL) → clasifica el artículo
nuevo en Exploración Exterior/Interna → lo inserta en `situational_events`.

### Rama B — Meteorología (diario, 06:00)
Consulta Open-Meteo (temperatura/humedad/viento, sin API key) **y** hace un
fetch a INAMEH para un boletín textual, y guarda ambos en
`meteorologia_status`.

⚠️ El nodo "Extraer Boletín INAMEH" usa un extractor de texto genérico
(quita etiquetas HTML) porque no pude verificar la estructura real de
inameh.gob.ve desde este entorno (sin acceso a internet general). Revisa el
resultado una vez actives el workflow y ajusta la URL/lógica de extracción
a la página específica que uses (por ejemplo el boletín o pronóstico
nacional, no solo el home).

### Rama C — Ingesta de Telegram (tiempo real, no programada)
Se dispara con cada mensaje que reciba tu bot de Telegram → lo guarda en
`telegram_messages` (ignora duplicados) → si es nuevo, lo clasifica como
incidencia de Exploración Interna → lo inserta en `situational_events`.

Antes de activar el workflow:

1. Crea una credencial tipo **Supabase API** llamada
   `Supabase - Reporte Situacional`:
   - Host: `https://msgllfwlousyfmeerrmx.supabase.co`
   - Service Role Secret: tu `service_role` key (Settings → API)
2. Crea un bot en Telegram con [@BotFather](https://t.me/BotFather):
   - `/newbot` → guarda el token.
   - `/setprivacy` → **Disable** (crítico: si no, el bot solo ve mensajes
     que lo mencionen directamente, no todos los mensajes del grupo).
   - Agrega el bot a cada grupo que quieras monitorear (no hay límite de
     grupos; cualquier miembro puede agregarlo salvo que el grupo lo
     restrinja a administradores).
3. Crea una credencial tipo **Telegram API** llamada
   `Telegram Bot - Reporte Situacional` con ese token.
4. Revisa/edita la tabla `sources` en Supabase para apuntar a los medios que
   realmente quieres scrapear (por defecto trae 5 RSS de ejemplo).
5. Ajusta la latitud/longitud del nodo "Consultar Clima (Open-Meteo)" y la
   URL del nodo INAMEH al punto/página que corresponda.
6. Actívalo.

El panel **Aero Naval** no tiene fuente abierta automatizable (es dato
operacional propio) — se carga insertando filas manualmente en
`aero_naval_status` (snapshot diario) o `situational_events` con
`panel = 'aero_naval'` (incidencias individuales para el mapa/tabla de esa
hoja), o puedes conectar tu propio sistema más adelante.

## Hojas de reporte completas

Cada panel del dashboard principal tiene su propia página a pantalla
completa (`/reportes/exterior`, `/reportes/interior`, `/reportes/aeronaval`,
`/reportes/meteorologico`), con navegación entre ellas y un layout dividido:
mapa de incidencias (Leaflet) a un lado, tabla de incidencias más
recientes/importantes al otro. Cualquier fila de `situational_events` con
`panel` correspondiente aparece ahí automáticamente.

## Estructura de datos

Ver `supabase/migrations/`. Tablas principales:

- `sources` — fuentes RSS activas para scraping.
- `articles` — artículos crudos scrapeados (deduplicados por `url`).
- `telegram_messages` — mensajes crudos recibidos de los grupos de Telegram
  (deduplicados por `chat_id` + `message_id`).
- `situational_events` — eventos ya clasificados que alimentan las 4 hojas
  de reporte (`panel` = exploracion_exterior / exploracion_interna /
  aero_naval / meteorologia); incluye `location_label`, `event_time`,
  `lat`/`lng` para el mapa.
- `aero_naval_status`, `meteorologia_status` — snapshots numéricos diarios
  (stats agregados) de los paneles 3 y 4.
- `reports` / `report_items` — para futuros reportes consolidados
  diarios/semanales (snapshot histórico).

## Reportes diario/semanal

El esquema ya incluye `reports`/`report_items` para guardar snapshots
consolidados (por ejemplo, un resumen generado al cierre del día o de la
semana). Aún no hay automatización que los genere — es el siguiente paso
natural: un workflow n8n adicional (o un cron semanal) que lea
`situational_events` del período y arme el resumen.
