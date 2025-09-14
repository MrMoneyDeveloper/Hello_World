World Pulse

What it is
- Pure client‑side app (HTML/CSS/JS). No backend, no build step.
- ES modules, small widgets, and public APIs. Works on any static host.

Run locally
- From the project root:
  - python3 -m http.server 5500
  - Open http://localhost:5500

60‑second demo
- macOS/Linux (open browser, serve, then wait):
  - sh -lc 'python3 -m http.server 5500 & sleep 1; (xdg-open http://localhost:5500 || open http://localhost:5500); wait'
- Windows PowerShell:
  - pwsh -NoProfile -Command "$p=5500; Start-Job { python -m http.server $using:p }; Start-Sleep 1; Start-Process http://localhost:$p"

Replacing climate media
- Put your files in `assets/` with these names:
  - assets/climate_poster.jpg — poster image (recommended <400 KB; 1280×720 or 1920×1080)
  - assets/climate_hero.mp4 — muted looping clip (recommended 1280×720, H.264/AAC)

API sources + limits
- Crypto: CoinGecko Simple Price (anonymous; be courteous with polling).
- FX: exchangerate.host (free).
- Weather: Open‑Meteo (free, no key).
- Air Quality: Open‑Meteo AQ (free, no key).
- NASA APOD: uses `DEMO_KEY` by default (about 30 req/hour, 50/day/IP). Set your own in `js/utils.js` → `NASA_KEY` for higher limits.
- Tech: HN Algolia front page (anonymous).
- Tip: Add `?demo=no-gps` to the URL to force the Durban fallback.

Deploy to GitHub Pages
1) Create a GitHub repo and push this folder (index.html at repo root).
2) In Settings → Pages, set Source: “Deploy from a branch”, Branch: `main` and Folder: `/ (root)`.
3) Wait for the Pages build; visit the provided URL.

Optional extensions
- Add an OpenAQ tile or enhance AQ with stations.
- Add earthquakes via USGS feeds (e.g., all_hour.geojson).
- Cache API responses in localStorage with a short TTL (e.g., 5–10 minutes).

Replacing climate media
- Drop your assets into `assets/` with these exact names:
  - `assets/climate_poster.jpg` — used as the Climate card poster image and video poster.
  - `assets/climate_hero.mp4` — the collapsible video shown in the Climate card.
- Suggested resolutions and sizes:
  - Video: 1280×720 (H.264/AAC), short loop, muted; aim <10–20 MB.
  - Image: keep under 400 KB; prefer 1280×720 or 1920×1080.
- Tips:
  - Make the loop seamless and keep motion subtle; the card uses rounded corners and a subtle border to blend with the glass UI.
  - Ensure the video is muted so it can autoplay when users expand it.
