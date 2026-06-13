# Haq Ittila — حق اطلاع
### KP Right to Information Companion

A civic accountability tool that helps citizens of Khyber Pakhtunkhwa draft legally sound RTI requests under the **KP Right to Information Act 2013**.

Built for the **AI for Civic Innovation Hackathon 2026** (Code for Pakistan / FAST NUCES / Grey Software / Scrimba).

---

## What it does

1. **Research** — searches KP party manifestos (PTI, ANP, JUI-F) and the web for promises and accountability gaps related to your question
2. **Route** — identifies the correct KP provincial department and its Public Information Officer
3. **Draft** — generates a formal RTI request in both English and Urdu, citing the KP RTI Act 2013

## How to run locally

**Prerequisites:** Node.js 18+, an Anthropic API key

```bash
git clone https://github.com/harisahmadkhan/Haq-Ittila---KP-RTI-Companion.git
cd Haq-Ittila---KP-RTI-Companion
npm install
```

Create a `.env.local` file in the project root:

```
VITE_ANTHROPIC_API_KEY=your_key_here
```

Then start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Setting the API key on Vercel

In your Vercel project: **Settings → Environment Variables** → add `VITE_ANTHROPIC_API_KEY`.

## Tech stack

- React 18 + Vite 8
- Tailwind CSS v4 (Digital Design Nizam tokens)
- Anthropic Claude API (`claude-sonnet-4-6`) with web search tool
- Frontend-only — no backend, no database

## Scope

KP RTI Act 2013 only. Does not cover Federal, Punjab, Sindh, or Balochistan RTI law. Does not file RTI requests — produces a draft the citizen submits themselves.
