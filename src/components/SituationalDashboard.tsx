"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  getLatestAeroNaval,
  getLatestEvents,
  getLatestMeteorologia,
} from "@/lib/queries";
import type { AeroNavalStatus, MeteorologiaStatus, SituationalEvent } from "@/types/db";
import DashboardHeader from "@/components/DashboardHeader";
import ExploracionExterior from "@/components/panels/ExploracionExterior";
import ExploracionInterna from "@/components/panels/ExploracionInterna";
import AeroNaval from "@/components/panels/AeroNaval";
import Meteorologia from "@/components/panels/Meteorologia";

export default function SituationalDashboard() {
  const [exterior, setExterior] = useState<SituationalEvent[]>([]);
  const [interna, setInterna] = useState<SituationalEvent[]>([]);
  const [aeroNaval, setAeroNaval] = useState<AeroNavalStatus | null>(null);
  const [meteo, setMeteo] = useState<MeteorologiaStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    try {
      const [ext, intr, aero, met] = await Promise.all([
        getLatestEvents("exploracion_exterior"),
        getLatestEvents("exploracion_interna"),
        getLatestAeroNaval(),
        getLatestMeteorologia(),
      ]);
      setExterior(ext);
      setInterna(intr);
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
    loadAll();

    const channel = supabase
      .channel("situational-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "situational_events" },
        () => loadAll()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "aero_naval_status" },
        () => loadAll()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "meteorologia_status" },
        () => loadAll()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <DashboardHeader />
      <main className="flex-1 p-4 sm:p-6">
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {loading ? (
          <p className="text-sm text-slate-500">Cargando datos…</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ExploracionExterior events={exterior} />
            <ExploracionInterna events={interna} />
            <AeroNaval status={aeroNaval} />
            <Meteorologia status={meteo} />
          </div>
        )}
      </main>
    </div>
  );
}
