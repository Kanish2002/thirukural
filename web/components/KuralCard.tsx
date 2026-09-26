"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { KuralResponse } from "@/lib/types";

const commentaryOptions = [
  { key: "ta_salamon", label: "சாலமன் பாப்பையா" },
  { key: "ta_mu_va", label: "மு. வரதராசனார்" },
  { key: "ta_kalaignar", label: "கலைஞர்" }
] as const;

type CommentaryKey = (typeof commentaryOptions)[number]["key"];

type Props = {
  kural: KuralResponse;
  showNavigation?: boolean;
};

function availableMeaning(kural: KuralResponse, key: CommentaryKey): string {
  return kural.meaning?.[key]?.trim() || "இந்த உரை தற்போது கிடைக்கவில்லை.";
}

export function KuralCard({ kural, showNavigation = true }: Props) {
  const [commentary, setCommentary] = useState<CommentaryKey>("ta_salamon");
  const [shared, setShared] = useState(false);

  const previous = kural.number <= 1 ? 1330 : kural.number - 1;
  const next = kural.number >= 1330 ? 1 : kural.number + 1;

  const shareText = useMemo(() => {
    const lines = kural.kural.join("\n");
    return `திருக்குறள் ${kural.number}\n\n${lines}\n\nபொருள்:\n${availableMeaning(kural, commentary)}`;
  }, [kural, commentary]);

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `திருக்குறள் ${kural.number}`,
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
        setShared(true);
        window.setTimeout(() => setShared(false), 1600);
      }
    } catch {
      // User cancellation or clipboard denial does not need an error banner.
    }
  }

  return (
    <article className="kural-card" aria-labelledby={`kural-${kural.number}`}>
      <div className="card-topline">
        <span className="eyebrow">இன்றைய திருக்குறள்</span>
        <span className="number-chip">#{String(kural.number).padStart(4, "0")}</span>
      </div>

      <div className="taxonomy">
        <span>{kural.section?.names?.ta || "திருக்குறள்"}</span>
        <span className="dot" aria-hidden="true">•</span>
        <span>{kural.chapter?.names?.ta || `அதிகாரம் ${Math.ceil(kural.number / 10)}`}</span>
      </div>

      <h1 id={`kural-${kural.number}`} className="kural-lines">
        <span>{kural.kural?.[0]}</span>
        <span>{kural.kural?.[1]}</span>
      </h1>

      <section className="meaning-block">
        <div className="meaning-header">
          <h2>பொருள்</h2>
          <div className="commentary-tabs" role="tablist" aria-label="உரை ஆசிரியர்">
            {commentaryOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={commentary === option.key ? "tab active" : "tab"}
                onClick={() => setCommentary(option.key)}
                role="tab"
                aria-selected={commentary === option.key}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <p>{availableMeaning(kural, commentary)}</p>
      </section>

      <div className="card-actions">
        {showNavigation ? (
          <>
            <Link className="nav-button" href={`/kural/${previous}`} aria-label="முந்தைய குறள்">←</Link>
            <Link className="text-button" href="/">இன்று</Link>
            <Link className="nav-button" href={`/kural/${next}`} aria-label="அடுத்த குறள்">→</Link>
          </>
        ) : <span />}
        <button className="share-button" type="button" onClick={share}>
          {shared ? "நகலெடுக்கப்பட்டது" : "பகிர்"}
        </button>
      </div>
    </article>
  );
}
