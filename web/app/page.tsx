import Link from "next/link";
import { DailyReader } from "@/components/DailyReader";

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="திருக்குறள் Daily முகப்பு">
          <span className="brand-mark" aria-hidden="true">க</span>
          <span>
            <strong>திருக்குறள்</strong>
            <small>DAILY</small>
          </span>
        </Link>
        <div className="header-note">ஒரு நாள் · ஒரு குறள்</div>
      </header>

      <section className="hero-copy">
        <p className="eyebrow">திருவள்ளுவர்</p>
        <h2>ஒவ்வொரு நாளுக்கும்<br />ஒரு சிந்தனை.</h2>
        <p>1 முதல் 1330 வரை — தினமும் அடுத்த திருக்குறள், தமிழில் முழு உரையுடன்.</p>
      </section>

      <DailyReader />

      <section className="widget-callout">
        <div>
          <p className="eyebrow">ANDROID WIDGET</p>
          <h3>திறக்காமலே படியுங்கள்.</h3>
          <p>இந்த திட்டத்தின் Android app-ஐ நிறுவி, உங்கள் home screen-ல் நேரடியாக தினசரி குறளைப் பார்க்கலாம்.</p>
        </div>
        <div className="mini-widget" aria-hidden="true">
          <span>திருக்குறள்</span>
          <strong>001</strong>
          <p>அகர முதல எழுத்தெல்லாம் ஆதி<br />பகவன் முதற்றே உலகு.</p>
        </div>
      </section>

      <footer>
        <span>திருக்குறள் Daily</span>
        <span>1330 குறள் · தினசரி ஒரு குறள்</span>
      </footer>
    </main>
  );
}
