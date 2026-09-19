import LiveClock from "@/components/LiveClock";

export default function DashboardHeader() {
  return (
    <header className="flex flex-col gap-3 bg-[#0a2340] px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white/40 text-xs font-bold">
            RI&O
          </div>
          <div className="text-xs font-semibold uppercase leading-tight tracking-wide text-slate-200">
            Reporte de Inteligencia
            <br />y Operaciones
          </div>
        </div>
        <div className="sm:hidden">
          <LiveClock />
        </div>
      </div>
      <h1 className="text-lg font-extrabold uppercase tracking-wide sm:order-none sm:text-center sm:text-2xl">
        Reporte Diario de Situación
      </h1>
      <div className="hidden sm:block">
        <LiveClock />
      </div>
    </header>
  );
}
