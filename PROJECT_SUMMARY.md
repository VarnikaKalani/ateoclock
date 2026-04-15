# Cookd - Project Summary

> Read this at the start of every new chat to get full context without re-exploring the codebase.

---

## What Is Cookd?

**Cookd** (stylized "Coookd") is an Indian-market food platform that connects food creators with home cooks.

- **For home cooks:** Discover recipes, select ingredients, get optimal pricing across multiple Indian grocery delivery services (Blinkit, Zepto, Amazon Fresh, BigBasket, etc.), and check out in one tap.
- **For food creators:** Share recipes, earn affiliate commissions on ingredient orders, and track analytics - no sponsorships needed.

**Status:** Pre-launch. Currently a waitlist landing page only. No auth, no real recipe DB yet.

---

## File Structure

```
cookd/
├── src/
│   ├── app/
│   │   ├── page.tsx                  ← Main landing page (~1632 lines, client component)
│   │   ├── layout.tsx                ← Root layout + metadata
│   │   ├── globals.css               ← Tailwind + global resets
│   │   └── api/
│   │       ├── waitlist/route.ts     ← POST /api/waitlist
│   │       └── price-compare/route.ts← POST /api/price-compare
│   ├── components/
│   │   └── WaitlistForm.tsx          ← Reusable waitlist signup form
│   └── lib/
│       └── supabase.ts               ← Supabase client factory + DB types
├── public/
│   └── logos/                        ← Grocery service logos (SVG/PNG)
├── supabase/
│   └── screenshot_schema.sql         ← recipe_screenshots table schema
├── frontend/
│   └── SKILL.md                      ← Frontend design guidelines
├── .env.local                        ← Supabase credentials (not committed)
├── AGENTS.md                         ← Note: Next.js version has breaking changes, read docs in node_modules
└── PROJECT_SUMMARY.md                ← THIS FILE
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.1 (App Router, Turbopack) |
| UI | React 19.2.4 - mostly inline styles + CSS variables |
| Styling | Tailwind CSS 4.0 + inline CSS with CSS variable design tokens |
| Database | Supabase (PostgreSQL) |
| Language | TypeScript 5.9.3 |
| Compiler | React Compiler (babel-plugin-react-compiler) |

---

## Design System - CSS Variables

All components use these variables (defined in `globals.css`):

```
--color-orange          primary CTA color
--color-orange-dark     hover/loading state
--color-sand-dark       input borders
--color-warm-white      input backgrounds
--color-text            body text
--color-green-light     success messages
--font-sans             Inter / system-ui
```

Background: `#FAF0CA` warm off-white. Brand palette also uses deep red `#962d49`.

---

## Database - Supabase

### Table: `waitlist`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
email           text NOT NULL UNIQUE
role            text NOT NULL DEFAULT 'user'  -- 'user' | 'creator'
country         text NOT NULL DEFAULT ''
instagram_url   text                          -- NULL for users, optional for creators
created_at      timestamptz DEFAULT now()
```

### Table: `recipe_screenshots`

```sql
id                      uuid PRIMARY KEY
source                  text DEFAULT 'landing-upload'
original_filename       text
storage_path            text UNIQUE
mime_type               text
file_size_bytes         bigint
status                  text  -- 'uploaded' | 'parsed' | 'failed'
extracted_recipe_title  text (nullable)
extracted_ingredients   jsonb DEFAULT '[]'
created_at              timestamptz
updated_at              timestamptz (auto-updated via trigger)
```

Storage bucket: `recipe-screenshots`. RLS enabled on both tables.

---

## API Routes

### `POST /api/waitlist`

**Body:**
```json
{
  "email": "user@example.com",
  "role": "user" | "creator",
  "country": "India",
  "instagram_url": "https://instagram.com/handle"  // creators only, optional
}
```

**Responses:** `{ ok: true }` | `{ error: "..." }` with 400/500 status.

**DB:** Upserts to `waitlist` on conflict of `email` (ignores duplicates).

---

### `POST /api/price-compare`

**Body:** `{ items: [{ name: string, qty?: string }] }`

**Returns:** Per-item prices across 4 stores (Blinkit, Zepto, Amazon, BigBasket), best store per item, split checkout recommendation, total savings.

**Note:** Prices are currently hardcoded/deterministic for demo purposes. Not real-time.

---

## Key Components

### `WaitlistForm.tsx`

Props: `dark?: boolean` (switches to light-on-dark styles)

**Form fields:**
- Role toggle: "I'm a User" / "I'm a Creator" (orange highlight on active)
- Email (required, both roles)
- Instagram URL (optional, creators only)
- Country dropdown (65+ countries, required)

**State:** `role | email | country | instagramUrl | status (idle|loading|success|error)`

Submits to `POST /api/waitlist`.

---

### `page.tsx` - Landing Page Sections

1. **Nav** - hamburger mobile menu, scroll-to-waitlist CTA
2. **Hero** - value prop for cooks and creators
3. **About** - iPhone mockup, 3-step flow (recipe → ingredients → checkout)
4. **How It Works** - interactive 3-step demo with ingredient toggling
5. **For Cooks / Creators** - tab-switched sections with dashboard mockups
6. **Stats** - animated counters (4200 recipes, 38+ creators, 96% satisfaction)
7. **Final CTA** - `WaitlistForm` embedded here
8. **Footer** - live waitlist count via Supabase real-time subscription

**Custom hooks in page.tsx:**
- `useCounter(target, duration, trigger)` - scroll-triggered animated number counter
- `useVisible(ref)` - IntersectionObserver scroll visibility detection

**Demo data (all hardcoded, client-side):**
- `RECIPE_LIBRARY` - 2 recipes (Acai Bowl, Mango Lassi) with ingredients
- `STORES` - 7 grocery services with logos
- `FOCUSED_FLOW_PRICING` - per-ingredient prices per store for demo
- `SAVED_RECIPE_TILES` - 15 sample content type labels

---

## Supabase Client Usage

```ts
// Server-side (API routes)
import { getSupabaseServerClient } from "@/lib/supabase"
const supabase = getSupabaseServerClient()

// Client-side (browser, real-time)
import { getSupabaseBrowserClient } from "@/lib/supabase"
const supabase = getSupabaseBrowserClient()  // returns null if env vars missing
```

**Env vars required:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY     ← server only, falls back to anon key if missing
```

---

## Important Notes

- `AGENTS.md` warns: This Next.js version has breaking changes. Read `node_modules/next/dist/docs/` before writing Next.js code.
- `page.tsx` is a `"use client"` component - everything in it runs in the browser.
- No authentication system exists yet - waitlist only.
- Price comparison is mocked (deterministic hash-based, not real grocery APIs).
- The `WaitlistForm` component is the only extracted component - all other UI lives in `page.tsx`.
- Inline styles are the primary styling approach (not Tailwind classes), using CSS variables for theming.
