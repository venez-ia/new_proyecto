import type { Panel } from "@/types/db";

export interface PanelMeta {
  panel: Panel;
  slug: string;
  number: number;
  navLabel: string;
  title: string;
  mapCenter: [number, number];
  mapZoom: number;
}

export const PANELS: PanelMeta[] = [
  {
    panel: "exploracion_exterior",
    slug: "exterior",
    number: 1,
    navLabel: "Reporte Exterior",
    title: "REPORTE EXTERIOR",
    mapCenter: [10, -60],
    mapZoom: 2,
  },
  {
    panel: "exploracion_interna",
    slug: "interior",
    number: 2,
    navLabel: "Reporte Interior",
    title: "REPORTE INTERIOR",
    mapCenter: [4.6, -66],
    mapZoom: 5,
  },
  {
    panel: "aero_naval",
    slug: "aeronaval",
    number: 3,
    navLabel: "Reporte Aeronaval",
    title: "REPORTE AERONAVAL",
    mapCenter: [8, -65],
    mapZoom: 5,
  },
  {
    panel: "meteorologia",
    slug: "meteorologico",
    number: 4,
    navLabel: "Reporte Meteorológico",
    title: "REPORTE METEOROLÓGICO",
    mapCenter: [4.6, -66],
    mapZoom: 5,
  },
];

export function panelBySlug(slug: string): PanelMeta | undefined {
  return PANELS.find((p) => p.slug === slug);
}
