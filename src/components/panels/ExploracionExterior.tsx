import type { SituationalEvent } from "@/types/db";
import { countryFlag } from "@/lib/format";
import PanelShell from "@/components/PanelShell";

export default function ExploracionExterior({ events }: { events: SituationalEvent[] }) {
  return (
    <PanelShell number={1} title="EXPLORACIÓN EXTERIOR">
      {events.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="divide-y divide-slate-100">
          {events.map((ev) => (
            <li key={ev.id} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
              <span className="text-2xl leading-none">{countryFlag(ev.country)}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase text-slate-800">
                  {ev.country ?? ev.category}
                </p>
                <p className="truncate text-xs text-slate-600">{ev.title}</p>
                <p className="truncate text-xs text-slate-500">{ev.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PanelShell>
  );
}

function EmptyState() {
  return (
    <p className="py-6 text-center text-sm text-slate-400">
      Sin eventos cargados aún. Se completará con la primera corrida de scraping en n8n.
    </p>
  );
}
