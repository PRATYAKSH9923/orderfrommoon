# Deploying to Vercel

This app deploys to Vercel with zero special configuration — Vercel auto-detects
Next.js. The only required step is setting environment variables.

## Prerequisites

- A Supabase project that is already set up and seeded
  (see [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)).
- The repo pushed to GitHub (or GitLab/Bitbucket).

## 1. Push to Git

```bash
git add .
git commit -m "Belgian Waffle Xpress ordering app"
git push origin main
```

> `.env.local` is gitignored — your secrets are **not** committed. `.env.example`
> is committed as a template.

## 2. Import into Vercel

1. Go to <https://vercel.com/new> and import your Git repository.
2. Framework preset: **Next.js** (auto-detected). Leave build/output settings as
   default:
   - Build command: `next build`
   - Output: (managed by Vercel)
   - Install command: `npm install`

## 3. Add environment variables

In the Vercel import screen (or **Project → Settings → Environment Variables**),
add each variable from your `.env.local`:

| Variable | Environment |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview (keep secret) |
| `ADMIN_USERNAME` | Production, Preview |
| `ADMIN_PASSWORD` | Production, Preview |
| `ADMIN_SESSION_SECRET` | Production, Preview |
| `NEXT_PUBLIC_RESTAURANT_NAME` | Production, Preview, Development |
| `NEXT_PUBLIC_RESTAURANT_WHATSAPP` | Production, Preview, Development |
| `NEXT_PUBLIC_PRIMARY_COLOR` | optional |
| `NEXT_PUBLIC_SECONDARY_COLOR` | optional |

> **Important:** never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. It is
> only read in server code (`src/lib/supabase/server.ts`, API routes). Do **not**
> prefix it with `NEXT_PUBLIC_`.

## 4. Deploy

Click **Deploy**. After it finishes you'll get a URL like
`https://your-app.vercel.app`.

## 5. Post-deploy checklist

- [ ] Open the URL → landing page shows **Consumer** and **Admin** cards.
- [ ] Consumer → the full waffle menu loads.
- [ ] Place a test order → confirmation modal shows the order number and the
      WhatsApp countdown works (it opens `wa.me` with the pre-filled message).
- [ ] Set the **real WhatsApp number** in Supabase →
      **Table Editor → restaurant_settings → whatsapp_number** (digits only, intl
      format, e.g. `919876543210`).
- [ ] Admin → log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
- [ ] In a second tab open the order's tracking page; change the status in admin
      and confirm the customer page updates **without refreshing** (Realtime).

## Realtime over HTTPS

Supabase Realtime works over Vercel's HTTPS out of the box — no extra config. If
live updates don't arrive, confirm the `orders` table is in the
`supabase_realtime` publication (the schema adds it; see SUPABASE_SETUP step 4).

## PWA / install

The app is installable on Android once served over HTTPS (Vercel provides this).
Chrome will offer "Add to Home screen". The service worker (`public/service-worker.js`)
provides an offline shell.

## Custom domain (optional)

**Project → Settings → Domains** → add your domain and follow the DNS
instructions. The PWA `start_url` and scope are relative (`/`), so no changes are
needed for a custom domain.

## Updating the menu later

Edit `supabase/seed.sql` (or use the Supabase Table Editor) and re-run it. No
redeploy is needed — the menu is fetched at request time. Branding colours,
restaurant name, and WhatsApp number are likewise live from the database.
