import type { AeroNavalStatus, MeteorologiaStatus, Panel } from "@/types/db";

export default function ReportStatStrip({
  panel,
  aeroNaval,
  meteo,
}: {
  panel: Panel;
  aeroNaval: AeroNavalStatus | null;
  meteo: MeteorologiaStatus | null;
}) {
  if (panel === "aero_naval") {
    return (
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Estatus Aéreo" value={fmtPct(aeroNaval?.aereo_estatus_pct)} />
        <Stat label="Misiones" value={aeroNaval?.aereo_misiones?.toString() ?? "—"} />
        <Stat label="Shipeos Desplegados" value={aeroNaval?.naval_shipeos_desplegados?.toString() ?? "—"} />
        <Stat label="Horas Patrulla" value={aeroNaval?.naval_horas_patrulla?.toString() ?? "—"} />
      </div>
    );
  }

  if (panel === "meteorologia") {
    return (
      <div className="mb-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Temp. Actual" value={meteo?.temp_actual !== undefined && meteo?.temp_actual !== null ? `${meteo.temp_actual}°C` : "—"} />
          <Stat label="Humedad" value={meteo?.humedad_pct !== undefined && meteo?.humedad_pct !== null ? `${meteo.humedad_pct}%` : "—"} />
          <Stat label="Viento" value={meteo?.viento_kmh !== undefined && meteo?.viento_kmh !== null ? `${meteo.viento_kmh} km/h` : "—"} />
          <Stat label="Condición" value={meteo?.condicion ?? "—"} />
        </div>
        {meteo?.boletin_oficial && (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Boletín INAMEH</p>
            <p className="text-sm text-slate-700">{meteo.boletin_oficial}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-lg font-bold text-slate-800">{value}</p>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}

function fmtPct(v: number | null | undefined) {
  return v === null || v === undefined ? "—" : `${v}%`;
}
