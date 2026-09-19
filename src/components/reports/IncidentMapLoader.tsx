"use client";

import dynamic from "next/dynamic";

const IncidentMap = dynamic(() => import("./IncidentMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-400">
      Cargando mapa…
    </div>
  ),
});

export default IncidentMap;
