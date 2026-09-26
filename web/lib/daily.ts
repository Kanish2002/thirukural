export const KURAL_COUNT = 1330;
export const START_DATE = "2026-09-27";

function asUtcDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function kuralNumberForDate(date: Date): number {
  const start = new Date(`${START_DATE}T00:00:00Z`);
  const current = asUtcDateOnly(date);
  const days = Math.floor((current.getTime() - start.getTime()) / 86_400_000);
  const normalized = ((days % KURAL_COUNT) + KURAL_COUNT) % KURAL_COUNT;
  return normalized + 1;
}
