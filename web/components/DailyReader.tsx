"use client";

import { useEffect, useMemo, useState } from "react";
import { KuralCard } from "@/components/KuralCard";
import { kuralNumberForDate } from "@/lib/daily";
import type { KuralResponse } from "@/lib/types";

export function DailyReader() {
  const number = useMemo(() => kuralNumberForDate(new Date()), []);
  const [data, setData] = useState<KuralResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/kural/${number}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("fetch failed");
        return (await response.json()) as KuralResponse;
      })
      .then(setData)
      .catch((reason) => {
        if (reason?.name !== "AbortError") {
          setError("இன்றைய திருக்குறளை பெற முடியவில்லை. இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.");
        }
      });

    return () => controller.abort();
  }, [number]);

  if (error) {
    return (
      <div className="state-card error-state">
        <p>{error}</p>
        <button type="button" onClick={() => window.location.reload()}>மீண்டும் முயற்சி</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="kural-card skeleton" aria-label="திருக்குறள் ஏற்றப்படுகிறது">
        <div className="skeleton-line short" />
        <div className="skeleton-line hero" />
        <div className="skeleton-line hero" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>
    );
  }

  return <KuralCard kural={data} showNavigation />;
}
