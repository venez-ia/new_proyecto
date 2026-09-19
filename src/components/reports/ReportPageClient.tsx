"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getLatestAeroNaval, getLatestEvents, getLatestMeteorologia } from "@/lib/queries";
import type { AeroNavalStatus, MeteorologiaStatus, SituationalEvent } from "@/types/db";
import type { PanelMeta } from "@/lib/panels";
import { formatDateLong } from "@/lib/format";
import AppShell from "@/components/AppShell";
import IncidentMap from "@/components/reports/IncidentMapLoader";
import IncidentTable from "@/components/reports/IncidentTable";
import ReportStatStrip from "@/components/reports/ReportStatStrip";

export default function ReportPageClient({ meta }: { meta: PanelMeta }) {
  const [events, setEvents] = useState<SituationalEvent[]>([]);
  const [aeroNaval, setAeroNaval] = useState<AeroNavalStatus | null>(null);
  const [meteo, setMeteo] = useState<MeteorologiaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const [ev, aero, met] = await Promise.all([
        getLatestEvents(meta.panel, 50),
        meta.panel === "aero_naval" ? getLatestAeroNaval() : Promise.resolve(null),
        meta.panel === "meteorologia" ? getLatestMeteorologia() : Promise.resolve(null),
      ]);
      setEvents(ev);
      setAeroNaval(aero);
      setMeteo(met);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando datos de Supabase.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount before subscribing to realtime changes
    load();

    const channel = supabase
      .channel(`report-${meta.panel}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "situational_events", filter: `panel=eq.${meta.panel}` },
        () => load()
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "aero_naval_status" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "meteorologia_status" }, () => load())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.panel]);

  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-extrabold uppercase tracking-wide text-[#0a2340]">{meta.title}</h1>
        <span className="text-sm text-slate-500">{formatDateLong(new Date())}</span>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Cargando datos…</p>
      ) : (
        <>
          <ReportStatStrip panel={meta.panel} aeroNaval={aeroNaval} meteo={meteo} />
          <div className="grid h-[calc(100vh-280px)] min-h-[420px] grid-cols-1 gap-4 lg:grid-cols-2">
            <IncidentMap events={events} center={meta.mapCenter} zoom={meta.mapZoom} />
            <IncidentTable events={events} />
          </div>
        </>
      )}
    </AppShell>
  );
}
