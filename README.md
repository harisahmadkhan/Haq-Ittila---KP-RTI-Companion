# Haq Ittila — حق اطلاع
### KP Right to Information Companion

A civic accountability tool that helps citizens of Khyber Pakhtunkhwa draft legally sound RTI requests under the **KP Right to Information Act 2013**.

**Live:** https://haq-ittila-kp-rti-companion.vercel.app

---

## What it does

A citizen describes what they want to know from the KP government in plain English or Urdu. The tool does three things:

1. **Research** — searches KP party manifestos (PTI, ANP, JUI-F) for relevant promises, and uses web search to surface recent news, audit reports, and official statements. Returns a structured breakdown: Promises Found / Web Findings / Accountability Gap / RTI Relevance.
2. **Route** — identifies the correct KP provincial department and its Public Information Officer under the KP RTI Act 2013. The citizen can confirm or override the suggestion.
3. **Draft** — generates a formal RTI request in both **English and Urdu (Nastaliq script, right-to-left)**, citing KP RTI Act 2013 sections 4 and 7, the 14 working-day deadline, and the KP Information Commission as the escalation body. Both drafts are editable before the citizen submits.

A submission guide then shows the PIO contact, address, email, the filing deadline date, and the escalation path if no response arrives.

---

## Demo Mode

The app ships with **16 pre-baked example queries** covering all 9 KP department categories. Selecting any example query runs a full end-to-end flow — research panel, department routing, bilingual RTI draft — with zero API calls.

| Category | Example queries |
|---|---|
| Education | School construction in Swat · Ghost school closures since 2022 |
| Health | Rural health centre doctors · Sehat Sahulat card functionality |
| Infrastructure | Peshawar BRT budget · DI Khan–Peshawar Motorway expenditure |
| Agriculture | Subsidised fertiliser beneficiaries · Land records digitisation |
| Energy | Hydropower project delays · Merged district village electrification |
| Water & Sanitation | Clean drinking water in Kohistan |
| Local Government | Charsadda flood relief funds · Local body elections delay |
| Police | Police station upgrades · Merit-based recruitment records |
| Forestry | Billion Tree Tsunami verified coverage |

For custom queries, the app calls the Anthropic API (requires `VITE_ANTHROPIC_API_KEY` in `.env.local`).

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v4 — CSS-first `@theme` config via `@tailwindcss/vite` |
| Design system | Digital Design Nizam (Code for Pakistan) |
| AI | Anthropic `claude-sonnet-4-6` with web search tool |
| Fonts | Open Sans · EB Garamond · Gulzar (Urdu Nastaliq) — Google Fonts |
| State | React `useReducer` — no external library |
| Backend | None — frontend-only |
| Deployment | Vercel |

---

## Project structure

```
src/
├── App.jsx                          ← Wizard orchestration, step routing
├── main.jsx
├── components/
│   ├── layout/
│   │   ├── Header.jsx               ← Gradient header with KP emblem SVG
│   │   └── StepIndicator.jsx        ← 5-step progress bar
│   ├── steps/
│   │   ├── QueryInput.jsx           ← Step 1 — hero banner + 16-query category grid
│   │   ├── ResearchPanel.jsx        ← Step 2 — manifesto refs + research panels
│   │   ├── RoutingConfirm.jsx       ← Step 3 — department card + override dropdown
│   │   ├── RTIDraft.jsx             ← Step 4 — side-by-side EN/UR editable drafts
│   │   └── SubmissionGuide.jsx      ← Step 5 — PIO contact, deadline, escalation
│   └── ui/
│       ├── Button.jsx
│       ├── Badge.jsx
│       ├── Card.jsx
│       ├── Spinner.jsx
│       ├── StatusTag.jsx
│       └── UrduText.jsx             ← RTL wrapper for Urdu blocks
├── data/
│   ├── manifestos.js                ← 20 manifesto chunks (PTI 8, ANP 5, JUI-F 5)
│   ├── departments.js               ← 10 KP departments with PIO info and addresses
│   ├── kp-rti-act.js                ← Key KP RTI Act 2013 provisions as constants
│   └── demo-responses.js            ← 16 full pre-baked responses (EN + UR drafts)
├── lib/
│   ├── claude.js                    ← Anthropic API wrapper + extractJSON utility
│   ├── prompts.js                   ← System prompts: RESEARCH, ROUTING, RTI_DRAFT
│   └── manifesto-search.js          ← Keyword matching with stopword filter
├── hooks/
│   └── useWizard.js                 ← useReducer wizard state (GO_TO_STEP, UPDATE, RESET)
└── styles/
    ├── globals.css                  ← Tailwind v4 @theme, Nizam tokens, print CSS
    └── rtl.css                      ← RTL utilities
```

---

## Scope

- **KP RTI Act 2013 only.** Does not cover Federal, Punjab, Sindh, or Balochistan RTI law.
- **No filing.** The tool produces a draft the citizen submits themselves — it does not connect to any government system.
- **No backend, no database, no authentication.**

---

## Built by

Haris Ahmad Khan
