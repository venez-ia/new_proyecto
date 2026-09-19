"use client";

import { useEffect, useState } from "react";
import { formatDateLong } from "@/lib/format";

export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial paint of a live clock needs the current time immediately
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const time = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  return (
    <div className="flex items-center gap-4 text-white">
      <div className="text-right">
        <div className="text-xs uppercase tracking-wide text-slate-300">
          {formatDateLong(now)}
        </div>
        <div className="font-mono text-lg font-semibold tabular-nums">{time}</div>
      </div>
    </div>
  );
}
