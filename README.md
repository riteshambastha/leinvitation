# 🎂 BdayInvite

A free, self-hosted birthday invitation platform. Create invites, collect RSVPs, manage your guest list, and send emails — no subscriptions.

## Stack

- **Next.js 14** (App Router + TypeScript)
- **Supabase** — database (PostgreSQL) + row-level security
- **Resend** — email delivery (free: 3,000 emails/month)
- **Tailwind CSS** — styling
- **Vercel** — hosting (free tier works fine)

---

## Setup (15 minutes)

### 1. Install dependencies

```bash
cd "bday invite"
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Once created, go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your keys from **Settings → API**

### 3. Set up Resend (email)

1. Sign up at [resend.com](https://resend.com) — free tier is plenty
2. Add and verify your sending domain (or use `onboarding@resend.dev` for testing)
3. Create an API key

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in all values.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add all your `.env.local` variables to Vercel's project environment variables.

Update `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL.

---

## How it works

| Route | Who sees it | Purpose |
|---|---|---|
| `/` | Anyone | Landing page + invite creation form |
| `/invite/[id]` | Guests | Public RSVP page |
| `/dashboard/[id]?token=XXX` | Host only | See RSVPs, send emails, manage list |

**Token security:** The dashboard uses a random hex token (not authentication). Keep the dashboard URL private. In a future version, add Supabase Auth for proper login.

---

## Roadmap

- [ ] Custom domain emails per host
- [ ] SMS reminders via Twilio
- [ ] Google Maps venue integration
- [ ] Calendar invites (.ics attachment)
- [ ] Multiple events per account (with Supabase Auth)
- [ ] Public landing page & multi-tenant SaaS mode
- [ ] Photo/media sharing for the event
