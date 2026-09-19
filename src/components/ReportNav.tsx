"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PANELS } from "@/lib/panels";

export default function ReportNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Dashboard" },
    ...PANELS.map((p) => ({ href: `/reportes/${p.slug}`, label: p.navLabel })),
  ];

  return (
    <nav className="flex flex-wrap gap-2 border-t border-white/10 bg-[#0a2340] px-6 py-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
              active
                ? "bg-white text-[#0a2340]"
                : "text-slate-200 hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
