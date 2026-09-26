import { NextResponse } from "next/server";
import { fetchKural } from "@/lib/kural-api";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const number = Number(id);

  if (!Number.isInteger(number) || number < 1 || number > 1330) {
    return NextResponse.json({ error: "Kural number must be between 1 and 1330" }, { status: 400 });
  }

  try {
    const kural = await fetchKural(number);
    return NextResponse.json(kural, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" }
    });
  } catch {
    return NextResponse.json({ error: "Unable to load Kural" }, { status: 502 });
  }
}
