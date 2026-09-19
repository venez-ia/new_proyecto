import type { SituationalEvent } from "@/types/db";
import { RISK_STYLES } from "@/lib/format";

export default function IncidentTable({ events }: { events: SituationalEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-slate-200 bg-white">
        <p className="p-6 text-center text-sm text-slate-400">
          Sin incidencias registradas para este reporte todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="sticky top-0 bg-[#0f2e52] text-white">
          <tr>
            <th className="px-3 py-2 font-semibold">Hora</th>
            <th className="px-3 py-2 font-semibold">Ubicación</th>
            <th className="px-3 py-2 font-semibold">Tipo</th>
            <th className="px-3 py-2 font-semibold">Descripción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {events.map((ev) => {
            const risk = ev.risk_level ? RISK_STYLES[ev.risk_level] : null;
            return (
              <tr key={ev.id} className="align-top">
                <td className="whitespace-nowrap px-3 py-2 text-slate-500">{ev.event_time ?? "—"}</td>
                <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                  {ev.location_label ?? ev.country ?? "—"}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                      risk?.className ?? "text-slate-600 bg-slate-50 border-slate-200"
                    }`}
                  >
                    {ev.status_label ?? ev.category}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-700">
                  <p className="font-semibold">{ev.title}</p>
                  <p className="text-xs text-slate-500">{ev.description}</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
