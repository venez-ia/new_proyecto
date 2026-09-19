export type RiskLevel = "bajo" | "medio" | "alto" | "critico";
export type Panel = "exploracion_exterior" | "exploracion_interna";
export type ReportType = "diario" | "semanal";

export interface SituationalEvent {
  id: string;
  article_id: string | null;
  panel: Panel;
  category: string;
  country: string | null;
  title: string;
  description: string;
  risk_level: RiskLevel | null;
  status_label: string | null;
  lat: number | null;
  lng: number | null;
  event_date: string;
  created_at: string;
}

export interface AeroNavalStatus {
  id: string;
  snapshot_date: string;
  aereo_estatus_pct: number | null;
  aereo_misiones: number | null;
  naval_shipeos_desplegados: number | null;
  naval_horas_patrulla: number | null;
  notas: string | null;
}

export interface MeteorologiaStatus {
  id: string;
  snapshot_date: string;
  temp_actual: number | null;
  temp_max: number | null;
  temp_min: number | null;
  humedad_pct: number | null;
  viento_kmh: number | null;
  viento_direccion: string | null;
  condicion: string | null;
  alertas: string | null;
}

export interface Report {
  id: string;
  type: ReportType;
  period_start: string;
  period_end: string;
  title: string;
  summary: string | null;
  generated_at: string;
}

export interface Source {
  id: string;
  name: string;
  site_url: string;
  rss_url: string;
  country: string | null;
  panel_hint: string | null;
  active: boolean;
}

export interface Article {
  id: string;
  source_id: string | null;
  title: string;
  url: string;
  summary: string | null;
  published_at: string | null;
  scraped_at: string;
  country: string | null;
  processed: boolean;
}
