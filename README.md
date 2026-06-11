# 🔭 AstroLens — Live NASA Data + AI Space Explorer

**Live Demo:** https://astrolens-star.vercel.app

Built for Hack Club Stardance 2026 — a real-time NASA data explorer with an AI guide that explains what you're seeing in plain English.

## What it does

- 🌌 **APOD** — NASA Astronomy Picture of the Day with AI explanation
- 🔭 **JWST Gallery** — Browse James Webb Space Telescope images, click any for AI explanation
- ☀️ **Space Weather** — Live solar flares from NASA DONKI, AI briefing on impact
- ☄️ **Asteroids** — Near-Earth objects passing today, AI hazard assessment
- 📡 **DSN Live** — Real-time Deep Space Network dish tracking, AI mission explainer
- 🤖 **Persistent AI Chat** — Ask anything about space at any time

## Tech Stack

- React + Vite + Tailwind CSS
- NASA Open APIs (APOD, NeoWs, DONKI, Image Library)
- Hack Club AI API (Qwen3-32b via ai.hackclub.com)
- Vercel (hosting + serverless AI proxy)

## Run locally

```bash
git clone https://github.com/RisheS26/astrolens.git
cd astrolens
npm install
```

Create `.env`:
```
VITE_NASA_API_KEY=your_key_from_api.nasa.gov
VITE_HACKCLUB_AI_KEY=your_key_from_ai.hackclub.com
```

```bash
npm run dev
```

## APIs Used

- [NASA APOD](https://api.nasa.gov) — Astronomy Picture of the Day
- [NASA NeoWs](https://api.nasa.gov) — Near Earth Object Web Service
- [NASA DONKI](https://api.nasa.gov) — Space Weather Database
- [NASA Image Library](https://images-api.nasa.gov) — 300K+ space images
- [DSN Now](https://eyes.nasa.gov/dsn) — Deep Space Network live feed
- [Hack Club AI](https://ai.hackclub.com) — Free AI API for teens
