import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell detail-page">
      <div className="state-card error-state">
        <p>இந்த திருக்குறளை காண முடியவில்லை.</p>
        <Link className="text-button" href="/">முகப்பிற்கு செல்லவும்</Link>
      </div>
    </main>
  );
}
