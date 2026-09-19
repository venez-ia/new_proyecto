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

// Centroides aproximados — solo para ubicar el marcador de un país en el
// mapa cuando el evento no trae lat/lng propio (p.ej. eventos de Exploración
// Exterior clasificados automáticamente por país).
const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
  "estados unidos": [39.8, -98.6],
  "ee.uu.": [39.8, -98.6],
  colombia: [4.57, -74.3],
  brasil: [-14.2, -51.9],
  rusia: [61.5, 105.3],
  ucrania: [48.4, 31.2],
  venezuela: [6.42, -66.6],
  peru: [-9.19, -75.02],
  "perú": [-9.19, -75.02],
  ecuador: [-1.83, -78.18],
  panama: [8.54, -80.78],
  "panamá": [8.54, -80.78],
  mexico: [23.6, -102.55],
  "méxico": [23.6, -102.55],
  chile: [-35.68, -71.54],
  argentina: [-38.42, -63.62],
  china: [35.86, 104.2],
  "corea del norte": [40.34, 127.51],
};

export function countryCentroid(country: string | null | undefined): [number, number] | null {
  if (!country) return null;
  return COUNTRY_CENTROIDS[country.trim().toLowerCase()] ?? null;
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
