# Delhi AQI Dashboard

A full-stack air quality monitoring dashboard for Delhi NCR, built on real-time government data. Unlike a simple "check today's AQI" lookup, this project tracks historical trends per station and uses an LLM to generate grounded, data-backed insights — not generic summaries.

## Live Demo
[aqi-project-mu.vercel.app](https://aqi-project-mu.vercel.app)

## What it does
- Automatically fetches real-time AQI data from India's CPCB (Central Pollution Control Board) via the data.gov.in API, once daily
- Stores every reading in a Postgres database, building genuine historical trend data over time — something a live lookup can't offer
- Displays station-level readings in an interactive dashboard with color-coded AQI categories
- Lets users select any station and pollutant to view its historical trend as a chart
- Generates plain-language insights using an LLM, explicitly constrained to avoid inventing causes (like traffic or construction) unless the data itself supports them

## Tech Stack
- **Frontend:** Next.js 16 (App Router), TypeScript, Recharts
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL (Neon, via Vercel)
- **Automation:** Vercel Cron Jobs
- **AI:** Google Gemini API
- **Deployment:** Vercel

## Architecture
```
data.gov.in API → Next.js API route (/api/fetch-aqi) → Postgres (via Prisma)
                                ↑
                    Vercel Cron (daily trigger)

Dashboard (/) → /api/stations → station/pollutant dropdown
             → /api/history   → historical chart data
            → /api/insight   → LLM-generated summary
```

## Key design decisions
- **Grounded AI, not decorative AI:** the insight prompt explicitly instructs the model not to attribute causes (weather, traffic, construction) unless the data shows a clear pattern. If there isn't enough variation in the data, the model says so plainly rather than fabricating a confident-sounding explanation.
- **Approximate AQI categorization:** category breakpoints (Good/Moderate/Poor/etc.) are a simplified per-pollutant approximation of CPCB standards, not the full official multi-pollutant sub-index calculation — a deliberate scope decision for a portfolio project.
- **Daily cron cadence:** chosen to fit Vercel's free-tier cron limits while still building meaningful multi-day trend data.

## Running locally
```bash
git clone https://github.com/goelanaisha/aqi-project.git
cd aqi-project
npm install
```

Create a `.env` file:

DATA_GOV_API_KEY=your_key
DATABASE_URL=your_postgres_connection_string
GEMINI_API_KEY=your_key
CRON_SECRET=any_random_string

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

## What I'd build next
- Map view using station latitude/longitude (already captured, not yet visualized)
- User accounts to save favorite stations
- Multi-day insight comparisons once more historical data accumulates