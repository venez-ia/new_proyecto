import { notFound } from "next/navigation";
import { panelBySlug, PANELS } from "@/lib/panels";
import ReportPageClient from "@/components/reports/ReportPageClient";

export function generateStaticParams() {
  return PANELS.map((p) => ({ panel: p.slug }));
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ panel: string }>;
}) {
  const { panel } = await params;
  const meta = panelBySlug(panel);
  if (!meta) notFound();
  return <ReportPageClient meta={meta} />;
}
