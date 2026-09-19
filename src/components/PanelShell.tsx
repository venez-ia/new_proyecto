import type { ReactNode } from "react";

export default function PanelShell({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      <header className="flex items-center gap-3 bg-[#0f2e52] px-4 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-[#0f2e52]">
          {number}
        </span>
        <h2 className="text-sm font-bold tracking-wide text-white">{title}</h2>
      </header>
      <div className="flex-1 p-4">{children}</div>
    </section>
  );
}
