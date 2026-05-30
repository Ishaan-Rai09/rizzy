# RIZZ AI

A sleek single-page web app that generates dating replies, openers, and bios using Groq.

## Quick Start

### Prerequisites

- Node.js v20+
- pnpm (or npm/yarn)

### Setup

1. Install dependencies
   ```bash
   pnpm install
   ```

2. Configure environment
   ```bash
   cp .env.example .env
   ```

   Add your Groq API key:
   ```
   GROQ_API_KEY=your_key_here
   ```

3. Start the dev server
   ```bash
   pnpm dev
   ```

4. Open http://localhost:3000

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Framer Motion
- react-hot-toast
- Groq (OpenAI-compatible Chat Completions)

## Features

- Reply generator (conversation + context panel + tone selector)
- Opener generator (profile text + tone selector)
- Bio writer (prompt form + style selector)
- One-tap copy with toast feedback
- Skeleton loading states

## Environment Variables

- GROQ_API_KEY

## Project Structure

```
app/
  api/generate/route.ts
  page.tsx
components/
  BioTab.tsx
  ConversationInput.tsx
  LoadingSkeleton.tsx
  OpenerTab.tsx
  ReplyCard.tsx
  ToneSelector.tsx
lib/
  groq.ts
  parseOptions.ts
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
```

## Notes

- The app is fully stateless by default. If you want MySQL persistence, add a data model and API routes as needed.

---

See CANDIDATE_ASSIGNMENT.md for assessment instructions.
