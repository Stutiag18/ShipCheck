# Ship Check

A pre-release content feedback system that assembles a panel of AI personas to evaluate your content from diverse perspectives before you publish.

Instead of releasing content to a live audience and hoping for the best, Opinion Bot lets you get structured, multi-perspective feedback in under 60 seconds.

## How It Works

```
Content Input → Auto-Detect Type → Generate 5 Personas → Parallel Evaluation → Senior Synthesis → Actionable Report
```

1. **Paste your content** — newsletter, LinkedIn post, landing page copy, tweet, or any text content
2. **Auto-detection** — the system identifies content type and target audience automatically
3. **Persona generation** — 5 distinct AI personas are created, tailored to your content type and audience
4. **Independent evaluation** — each persona reviews your content from their unique perspective (no cross-contamination)
5. **Senior synthesis** — a senior evaluator aggregates all feedback into a prioritized action plan with scores, strengths, improvements, and optionally a rewritten version

## Supported Content Types

Opinion Bot auto-detects and generates appropriate personas for:

- Newsletters / Thought leadership
- LinkedIn posts
- Twitter/X threads
- Landing page copy
- Marketing emails
- Blog posts / How-to guides
- Sales copy / Advertisements
- YouTube scripts
- Creative writing (fiction, poetry)
- And more — any text content works

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **LLM Providers**: Groq (primary, Llama 3) + Google Gemini (fallback) — both free tier
- **Database**: SQLite via Prisma ORM (zero setup locally)
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel-ready

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  User Input │────▶│  Content Analyzer │────▶│  Persona Engine  │
│  (any text) │     │  (auto-detect     │     │  (generates 5    │
│             │     │   type + audience)│     │   tailored       │
│             │     │                   │     │   personas)      │
└─────────────┘     └──────────────────┘     └────────┬─────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │  5 Agent Evals   │
                                              │  (parallel, each │
                                              │   independent)   │
                                              └────────┬─────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │  Senior Model    │
                                              │  (synthesizes    │
                                              │   final report)  │
                                              └────────┬─────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │  Structured      │
                                              │  Feedback Report │
                                              └─────────────────┘
```

### Serverless Pipeline Design

The evaluation pipeline is split into independently retryable stages to work within serverless function timeouts:

| Stage | Action | LLM Call |
|-------|--------|----------|
| 1 | Content analysis (type + audience detection) | 1 call |
| 2 | Persona generation (5 tailored personas) | 1 call |
| 3-7 | Agent evaluations (one per persona) | 5 calls |
| 8 | Senior synthesis (aggregated report) | 1 call |

Each stage is a single API call (`POST /api/evaluate/[id]/process`), making the pipeline fault-tolerant and resumable.

### LLM Fallback System

```
Groq (Llama 3.1 8B) ──fail──▶ Gemini (2.0 Flash) ──fail──▶ Demo Mode (mock responses)
```

- Token-bucket rate limiting per provider
- Exponential backoff on retries
- Automatic provider switching on rate limits or errors
- Demo mode works with zero API keys for testing

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Clone the repo
git clone <your-repo-url>
cd opinion-bot

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Set up the database
npx prisma migrate dev

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
# Database (SQLite - works locally with no setup)
DATABASE_URL="file:./prisma/dev.db"

# Groq API (get free key at https://console.groq.com/keys)
GROQ_API_KEY=""

# Google Gemini API (get free key at https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=""
```

> **Note**: The app works without any API keys using built-in demo mode (returns realistic mock responses). Add keys for real LLM-powered evaluations.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/evaluate` | Create a new evaluation |
| `POST` | `/api/evaluate/[id]/process` | Process the next pipeline stage |
| `GET` | `/api/evaluate/[id]` | Fetch evaluation status and results |
| `GET` | `/api/history` | List past evaluations (session-based) |

### Create Evaluation

```bash
curl -X POST http://localhost:3000/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your content here...",
    "platform": "LinkedIn",
    "goal": "Drive engagement"
  }'
```

### Process Pipeline (call repeatedly until COMPLETED)

```bash
curl -X POST http://localhost:3000/api/evaluate/{id}/process
```

## Project Structure

```
src/
├── app/
│   ├── api/evaluate/         # API routes
│   ├── evaluate/             # Content input page
│   ├── results/[id]/         # Results display page
│   └── history/              # Past evaluations
├── components/
│   ├── ui/                   # Reusable UI primitives
│   ├── evaluate/             # Input form components
│   └── results/              # Result display components
├── lib/
│   ├── llm/                  # LLM clients, rate limiter, fallback logic
│   ├── evaluation/           # Pipeline orchestration
│   ├── prompts/              # Prompt templates
│   └── db.ts                 # Prisma client
└── types/                    # TypeScript type definitions
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:migrate   # Run Prisma migrations
npm run db:reset     # Reset database
```

## Cost & Limits (Free Tier)

| Provider | Rate Limit | Daily Limit | Capacity |
|----------|-----------|-------------|----------|
| Groq | 30 RPM | 14,400 req/day | ~2,000 evaluations/day |
| Gemini | 15 RPM | 1,500 req/day | ~214 evaluations/day |

With the fallback system, you get roughly **2,000 free evaluations per day** combining both providers.

## License

MIT
