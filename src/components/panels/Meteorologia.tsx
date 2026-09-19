import type { MeteorologiaStatus } from "@/types/db";
import PanelShell from "@/components/PanelShell";

export default function Meteorologia({ status }: { status: MeteorologiaStatus | null }) {
  return (
    <PanelShell number={4} title="CONDUCCIÓN METEOROLÓGICA" href="/reportes/meteorologico">
      {!status ? (
        <p className="text-xs text-slate-400">Sin snapshot meteorológico cargado para hoy.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="col-span-2">
            <p className="text-3xl font-bold text-slate-800">
              {status.temp_actual ?? "—"}°C
            </p>
            <p className="text-xs text-slate-500">
              Máx {status.temp_max ?? "—"}°C · Mín {status.temp_min ?? "—"}°C
            </p>
          </div>
          <Field label="Condición" value={status.condicion ?? "—"} />
          <Field label="Humedad" value={status.humedad_pct !== null ? `${status.humedad_pct}%` : "—"} />
          <Field
            label="Viento"
            value={
              status.viento_kmh !== null
                ? `${status.viento_kmh} km/h ${status.viento_direccion ?? ""}`.trim()
                : "—"
            }
          />
          <div className="col-span-2">
            <p className="text-xs font-bold uppercase text-slate-500">Alertas</p>
            <p className="text-sm text-red-600">{status.alertas ?? "Sin alertas activas"}</p>
          </div>
          {status.boletin_oficial && (
            <div className="col-span-2 border-t border-slate-100 pt-2">
              <p className="text-xs font-bold uppercase text-slate-500">Boletín INAMEH</p>
              <p className="text-xs text-slate-600">{status.boletin_oficial}</p>
            </div>
          )}
        </div>
      )}
    </PanelShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="text-slate-800">{value}</p>
    </div>
  );
}
