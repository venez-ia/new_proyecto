import LiveClock from "@/components/LiveClock";

export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between bg-[#0a2340] px-6 py-4 text-white">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/40 text-xs font-bold">
          RI&O
        </div>
        <div className="text-xs font-semibold uppercase leading-tight tracking-wide text-slate-200">
          Reporte de Inteligencia
          <br />y Operaciones
        </div>
      </div>
      <h1 className="text-xl font-extrabold uppercase tracking-wide sm:text-2xl">
        Reporte Diario de Situación
      </h1>
      <LiveClock />
    </header>
  );
}
