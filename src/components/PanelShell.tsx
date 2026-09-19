import type { ReactNode } from "react";
import Link from "next/link";

export default function PanelShell({
  number,
  title,
  href,
  children,
}: {
  number: number;
  title: string;
  href?: string;
  children: ReactNode;
}) {
  const header = (
    <header className="flex items-center justify-between gap-3 bg-[#0f2e52] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-[#0f2e52]">
          {number}
        </span>
        <h2 className="text-sm font-bold tracking-wide text-white">{title}</h2>
      </div>
      {href && (
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-300">
          Ver reporte completo →
        </span>
      )}
    </header>
  );

  return (
    <section className="flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      {href ? (
        <Link href={href} className="block hover:opacity-90">
          {header}
        </Link>
      ) : (
        header
      )}
      <div className="flex-1 p-4">{children}</div>
    </section>
  );
}
