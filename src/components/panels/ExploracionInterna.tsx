import type { SituationalEvent } from "@/types/db";
import { RISK_STYLES } from "@/lib/format";
import PanelShell from "@/components/PanelShell";

export default function ExploracionInterna({ events }: { events: SituationalEvent[] }) {
  return (
    <PanelShell number={2} title="EXPLORACIÓN INTERNA">
      {events.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          Sin eventos cargados aún. Se completará con la primera corrida de scraping en n8n.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {events.map((ev) => {
            const risk = ev.risk_level ? RISK_STYLES[ev.risk_level] : null;
            return (
              <li key={ev.id} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold uppercase text-slate-800">{ev.category}</p>
                  {(ev.status_label || risk) && (
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        risk?.className ?? "text-slate-600 bg-slate-50 border-slate-200"
                      }`}
                    >
                      {ev.status_label ?? risk?.label}
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-slate-600">{ev.title}</p>
                <p className="truncate text-xs text-slate-500">{ev.description}</p>
              </li>
            );
          })}
        </ul>
      )}
    </PanelShell>
  );
}
