# PetLife AI

### AI-Powered Pet Health Timeline

**Transform raw pet health records into a meaningful health story.**

PetLife AI is a responsive React + Vite web application that helps pet parents turn recorded health information into a clear timeline, personalized insights, and responsible AI-powered explanations.

I built this as a working prototype for an interview task, so it's scoped as a focused MVP rather than a finished product — the core flow works end to end, but a few things below are intentionally left as roadmap items.

> **Current status:** Working responsive web MVP / prototype. PetLife AI is a web application, not a native Android or iOS application.

---

## Table of Contents

- [Core Flow](#core-flow)
- [Problem](#problem)
- [Solution](#solution)
- [Key Features](#key-features)
- [How AI Is Used](#how-ai-is-used)
- [User Journey](#user-journey)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Firestore Data Structure](#firestore-data-structure)
- [Responsible AI & Safety](#responsible-ai--safety)
- [Security](#security)
- [Responsive Design](#responsive-design)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Testing & Validation](#testing--validation)
- [Current Scope](#current-scope)
- [Future Roadmap](#future-roadmap)
- [Documentation](#documentation)
- [Demo](#demo)
- [A note on this project](#a-note-on-this-project)

---

## Core Flow

**Raw Pet Data → Health Timeline → AI Health Story → Personalized Insights → Responsible Action**

---

## Problem

Pet parents may have health information recorded across different events and dates, but can struggle to understand:

- What happened
- What changed
- What patterns exist
- What may need attention

The records exist, but the story connecting them does not.

---

## Solution

PetLife AI organizes a pet's recorded information into a chronological health timeline and uses AI to explain that information in plain language.

| Step | What PetLife AI does |
|---|---|
| Record | Pet profile and health events stored per user |
| See | Chronological Health Timeline |
| Understand | AI Health Story and Ask PetLife AI |
| Measure | Deterministic Health Insights |
| Act responsibly | Care Reminders and non-diagnostic suggested next steps |

**Target user:** Pet parents / pet owners.

---

## Key Features

| Feature | Description |
|---|---|
| Pet Profile | Store the pet's profile information |
| Health Events | Record health events over time |
| Health Timeline | View recorded events chronologically |
| AI Health Story | Gemini-generated story from the pet's records |
| Ask PetLife AI | Ask natural-language questions about recorded pet data |
| Health Insights | Calculate weight changes, event counts, and patterns |
| Care Reminders | Create, edit, complete, and delete reminders |
| Firebase Authentication | Secure user accounts |
| Firestore Persistence | Store data per authenticated user |

---

## How AI Is Used

PetLife AI uses AI where language understanding adds value and deterministic application logic where exact calculations are required.

### AI Health Story

Powered by Google Gemini 2.5 Flash. I picked Gemini 2.5 Flash specifically because it was a good fit for a prototype — fast responses, solid natural-language understanding, and a straightforward integration path through the `@google/genai` SDK. Gemini is only used where language understanding actually adds value (writing the story, answering questions); everything numeric stays in plain JavaScript so the math is exact and repeatable rather than something the model estimates.

It turns the current pet profile and recorded health events into:

- What Happened
- What Changed
- Patterns to Monitor
- Suggested Next Steps

**Keeping it grounded:** During development I found that some leftover demo data and hardcoded provider info could sneak into the timeline and end up in the AI's context. I stripped those out and tightened the grounding rules so the model can't invent a diagnosis, medication, vet, hospital, symptom, or medical history that isn't actually in the user's records. The Gemini API key also stays server-side — it's never exposed to the client.

### Ask PetLife AI

Users can ask natural-language questions about their pet.

Gemini receives:

- The current pet profile
- The current pet's health events
- The user's question

Responses are grounded in the recorded pet data.

### Health Insights — Not AI

Health Insights uses deterministic JavaScript rather than Gemini for:

- Weight difference
- Weight percentage change
- Recent event counts
- Repeated-event detection
- Record-based patterns

This keeps numeric calculations exact and repeatable.

---

## User Journey

```text
Sign up / Log in
        ↓
Create Pet Profile
        ↓
Add Health Events
        ↓
View Health Timeline
        ↓
 ┌───────────────┬────────────────┬─────────────────┐
 ↓               ↓                ↓
AI Health      Ask PetLife      Health
Story          AI               Insights
 └───────────────┴────────────────┴─────────────────┘
                       ↓
                Care Reminders
                       ↓
             Responsible follow-up
                 when needed
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | Tailwind CSS |
| Routing | React Router |
| Icons | Lucide React |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore |
| AI | Google Gemini 2.5 Flash |
| AI SDK | `@google/genai` |
| API | Server-side API handlers |

---

## Architecture

```text
                         ┌─────────────────────┐
                         │     Pet Parent      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │  Vite + Tailwind    │
                         └──────┬──────┬───────┘
                                │      │
                    ┌───────────┘      └────────────┐
                    ▼                               ▼
          ┌─────────────────┐              ┌──────────────────┐
          │ Firebase Auth   │              │ Firebase         │
          │                 │              │ Firestore        │
          └─────────────────┘              └──────────────────┘
                                │
                           AI requests
                                ▼
                     ┌─────────────────────┐
                     │ Server-side API     │
                     ├─────────────────────┤
                     │ /api/generate-      │
                     │ summary             │
                     │                     │
                     │ /api/ask-ai         │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │ Gemini 2.5 Flash    │
                     └─────────────────────┘
```

### AI API Routes

| Route | Purpose |
|---|---|
| `/api/generate-summary` | Generates the AI Health Story |
| `/api/ask-ai` | Answers questions for Ask PetLife AI |

### Health Insights

```text
Pet + Health Events
        ↓
insightsCalculator
        ↓
Deterministic calculations
        ↓
Health Insights UI
```

---

## Firestore Data Structure

```text
users/{uid}
  └── pets/{petId}
       ├── healthEvents/{eventId}
       └── reminders/{reminderId}
```

Data is scoped under each authenticated user's `uid`.

---

## Responsible AI & Safety

PetLife AI helps pet parents understand their recorded information. It does not replace professional veterinary judgment.

PetLife AI does **not**:

- Diagnose medical conditions
- Prescribe medication
- Recommend dosage changes
- Invent medical records
- Invent doctors
- Invent hospitals
- Invent symptoms
- Invent medical history
- Replace veterinary care

If information is not present in the recorded data, the AI should state that the information is unavailable rather than guessing.

For detailed responsible-AI design, see [`docs/AI_RESPONSIBLE_USE.md`](docs/AI_RESPONSIBLE_USE.md).

---

## Security

The application includes:

- Gemini API key remains server-side
- No `VITE_GEMINI_API_KEY`
- Gemini SDK is not included in the client production bundle
- `.env.local` is not committed
- Firestore uses authenticated, user-scoped access
- Multi-user isolation has been tested
- API inputs are validated
- Production bundle security has been verified

> Never commit or share real API keys.

---

## Responsive Design

PetLife AI is a responsive web application designed for mobile-first use and tested across different screen sizes.

> PetLife AI is currently a web application. Native Android/iOS applications are future roadmap items.

---

## Project Structure

```text
PetLife AI/
├── api/
├── docs/
│   ├── PRODUCT_PLAN.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   └── AI_RESPONSIBLE_USE.md
├── server/
├── src/
├── package.json
├── vite.config.js
└── README.md
```

> `.env.local` is local-only and must never be committed.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file using the variables listed below.

### 3. Start the development server

```bash
npm run dev
```

### 4. Create a production build

```bash
npm run build
```

---

## Environment Variables

Set these variables in `.env.local`:

```text
GEMINI_API_KEY
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

> `GEMINI_API_KEY` is server-side only. There is intentionally no `VITE_GEMINI_API_KEY`.

Never include real values in the README or source repository.

---

## Testing & Validation

The project has testing and validation covering:

| Area | Status |
|---|---|
| Firebase / Firestore | Passed |
| Multi-user isolation | Passed |
| AI Health Story | Passed |
| Ask PetLife AI | Passed |
| Health Insights | Passed |
| Reminders | Passed |
| Production bundle security | Passed |
| Production build | Passed |

The final audit recorded 32 of 33 automated checks passing. The one failure was a transient Gemini 503 (the service was under high demand at that moment) — not an application code bug, just an external API limitation surfacing during testing.

---

## Current Scope

The current submission is a working responsive web MVP with:

- Authentication
- Pet profile
- Health events
- Health timeline
- Gemini AI Health Story
- Gemini conversational Ask PetLife AI
- Deterministic Health Insights
- Firestore-backed care reminders
- Responsive web UI

---

## Future Roadmap

The following are future ideas and are not implemented in the current MVP:

| Future Feature | Status |
|---|---|
| Native Android / iOS applications | Planned |
| Push notifications | Planned |
| Offline support | Planned |
| OCR for veterinary documents | Planned |
| Wearable / device integrations | Planned |
| Voice AI | Planned |
| Multiple pets | Planned |
| Advanced analytics | Planned |
| Veterinary integrations | Planned |

---

## Documentation

| Document | Description |
|---|---|
| [Product Plan](docs/PRODUCT_PLAN.md) | Product problem, users, features, journey, and roadmap |
| [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md) | Technology stack, architecture, data flows, Firestore, and security |
| [Responsible AI Use](docs/AI_RESPONSIBLE_USE.md) | AI grounding, safety boundaries, privacy, and limitations |

---

## Demo

**Live Demo:** Coming after deployment

**GitHub Repository:** Coming after GitHub setup

---

## A note on this project

I built PetLife AI as an interview task, so the scope is deliberately tight: get the core loop (record → timeline → AI story → insights) working well and grounded, rather than building out every feature. The parts I spent the most time on were making sure the AI never invents anything that isn't in the user's actual data, and keeping the numeric insights fully deterministic so they don't depend on the model getting arithmetic right.

> PetLife AI provides informational insights based on the records you provide. It does not diagnose or replace veterinary care.
