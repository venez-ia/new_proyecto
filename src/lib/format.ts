import type { RiskLevel } from "@/types/db";

const COUNTRY_FLAGS: Record<string, string> = {
  "estados unidos": "🇺🇸",
  "ee.uu.": "🇺🇸",
  eeuu: "🇺🇸",
  usa: "🇺🇸",
  colombia: "🇨🇴",
  brasil: "🇧🇷",
  brazil: "🇧🇷",
  rusia: "🇷🇺",
  russia: "🇷🇺",
  ucrania: "🇺🇦",
  ukraine: "🇺🇦",
  venezuela: "🇻🇪",
  peru: "🇵🇪",
  "perú": "🇵🇪",
  ecuador: "🇪🇨",
  panama: "🇵🇦",
  "panamá": "🇵🇦",
  mexico: "🇲🇽",
  "méxico": "🇲🇽",
  chile: "🇨🇱",
  argentina: "🇦🇷",
  china: "🇨🇳",
  "corea del norte": "🇰🇵",
};

export function countryFlag(country: string | null | undefined): string {
  if (!country) return "🏳️";
  return COUNTRY_FLAGS[country.trim().toLowerCase()] ?? "🏳️";
}

export const RISK_STYLES: Record<RiskLevel, { label: string; className: string }> = {
  bajo: { label: "BAJO RIESGO", className: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  medio: { label: "RIESGO MEDIO", className: "text-amber-700 bg-amber-50 border-amber-200" },
  alto: { label: "RIESGO ALTO", className: "text-orange-700 bg-orange-50 border-orange-200" },
  critico: { label: "CRÍTICO", className: "text-red-700 bg-red-50 border-red-200" },
};

export function formatDateLong(date: Date): string {
  const s = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
