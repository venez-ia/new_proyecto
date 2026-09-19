import { supabase } from "@/lib/supabase";
import type {
  AeroNavalStatus,
  MeteorologiaStatus,
  Report,
  SituationalEvent,
} from "@/types/db";

export async function getLatestEvents(panel: "exploracion_exterior" | "exploracion_interna") {
  const { data, error } = await supabase
    .from("situational_events")
    .select("*")
    .eq("panel", panel)
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) throw error;
  return (data ?? []) as SituationalEvent[];
}

export async function getLatestAeroNaval() {
  const { data, error } = await supabase
    .from("aero_naval_status")
    .select("*")
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as AeroNavalStatus | null;
}

export async function getLatestMeteorologia() {
  const { data, error } = await supabase
    .from("meteorologia_status")
    .select("*")
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as MeteorologiaStatus | null;
}

export async function getReports(type: "diario" | "semanal", limit = 10) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("type", type)
    .order("period_start", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Report[];
}
