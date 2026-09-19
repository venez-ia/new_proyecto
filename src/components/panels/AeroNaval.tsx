import type { AeroNavalStatus } from "@/types/db";
import PanelShell from "@/components/PanelShell";

export default function AeroNaval({ status }: { status: AeroNavalStatus | null }) {
  return (
    <PanelShell number={3} title="AERO NAVAL">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Aéreo</p>
          <Stat label="Estatus" value={fmtPct(status?.aereo_estatus_pct)} />
          <Stat label="Misión" value={status?.aereo_misiones?.toString() ?? "—"} />
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Naval</p>
          <Stat label="Shipeos desplegados" value={status?.naval_shipeos_desplegados?.toString() ?? "—"} />
          <Stat label="Horas patrulla" value={status?.naval_horas_patrulla?.toString() ?? "—"} />
        </div>
      </div>
      {status?.notas && <p className="mt-3 text-xs text-slate-500">{status.notas}</p>}
      {!status && (
        <p className="mt-2 text-xs text-slate-400">Sin snapshot cargado para hoy.</p>
      )}
    </PanelShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2">
      <p className="text-lg font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function fmtPct(v: number | null | undefined) {
  return v === null || v === undefined ? "—" : `${v}% Operacional`;
}
