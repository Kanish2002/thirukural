# திருக்குறள் Daily

A small, focused Thirukkural experience built as:

- a **Next.js PWA** for Vercel
- a native **Android home-screen widget**
- a deterministic daily sequence from Kural 1 → 1330

The daily sequence starts on **2026-09-27**, so that date is Kural 1. After Kural 1330, the sequence wraps to Kural 1.

## Why this architecture?

The repository does **not** redistribute modern commentary text. Instead, the web app and Android widget request one Kural at a time from the public Thirukkural API at `https://kural.codewithram.dev/api`. This keeps the project small and makes the content provider easy to replace later with a bundled/offline dataset whose licensing you have verified.

The UI currently exposes three Tamil commentary choices when returned by the API:

- மு. வரதராசனார்
- சாலமன் பாப்பையா
- கலைஞர்

The Android widget defaults to the Solomon Pappayya commentary and caches the most recently fetched Kural so it still has something useful to show if the network is temporarily unavailable.

## Repository layout

```text
thirukkural-daily/
├── web/       # Next.js PWA, deploy this folder to Vercel
└── android/   # Native Android app + home-screen widget
```

## Web / Vercel

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:3000`.

### Deploy to Vercel

Create/import a Vercel project and set the **Root Directory** to `web`.

No environment variables are required for the default API provider. If you later proxy or self-host the Kural API, set:

```text
KURAL_API_BASE_URL=https://your-api.example/api
```

The web app includes a web app manifest and service worker so it can be installed to a phone home screen as a PWA. A PWA icon is **not** the same thing as a live launcher widget; the native Android project provides the actual widget.

## Android widget

Open the `android` directory in Android Studio, let Gradle sync, and run the `app` configuration on a device/emulator running Android 8.0+.

The widget:

- calculates the Kural number locally from the date
- fetches `GET /api/kural/{number}`
- shows the Kural and Tamil meaning
- refreshes on the normal widget update schedule and on date/time changes
- caches the latest successful response
- opens the corresponding web Kural when tapped

Before publishing, change `WEB_BASE_URL` in `android/app/build.gradle.kts` to your real Vercel domain.

## Daily sequence

The rule is intentionally simple and shared by both clients:

```text
days = localDate - 2026-09-27
number = floorMod(days, 1330) + 1
```

This gives a predictable sequence without a scheduler, database, account, or cron job.

## Data attribution / licensing

The application consumes the public API from `nramc/thirukkural-api`. Its project code is MIT licensed, while its README notes that source text, translations, meanings, images, fonts, and other third-party assets may have separate terms. This repo therefore does not copy the commentary dataset into source control. Review the upstream data notices before distributing a commercial build or before bundling content offline.

## Next improvements

- replace remote fetches with a verified-license local 1,330-Kural dataset for fully offline widgets
- add iOS WidgetKit support
- add favorites/search/history to the native app
- add notification mode (“குறள் of the morning”)
- add selectable commentary preference to the Android widget configuration screen
