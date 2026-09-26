import { notFound } from "next/navigation";
import { KuralCard } from "@/components/KuralCard";
import { fetchKural } from "@/lib/kural-api";
import type { KuralResponse } from "@/lib/types";

export default async function KuralPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const number = Number(id);

  if (!Number.isInteger(number) || number < 1 || number > 1330) {
    notFound();
  }

  let kural: KuralResponse;
  try {
    kural = await fetchKural(number);
  } catch {
    notFound();
  }

  return (
    <main className="page-shell detail-page">
      <a className="back-link" href="/">← இன்றைய குறள்</a>
      <KuralCard kural={kural} showNavigation />
    </main>
  );
}
