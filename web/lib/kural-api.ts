import type { KuralResponse } from "@/lib/types";

const DEFAULT_BASE_URL = "https://kural.codewithram.dev/api";
const API_BASE_URL = (process.env.KURAL_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");

export async function fetchKural(number: number): Promise<KuralResponse> {
  if (!Number.isInteger(number) || number < 1 || number > 1330) {
    throw new Error("Kural number must be between 1 and 1330");
  }

  const response = await fetch(`${API_BASE_URL}/kural/${number}`, {
    next: { revalidate: 86_400 },
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Kural API returned ${response.status}`);
  }

  return (await response.json()) as KuralResponse;
}
