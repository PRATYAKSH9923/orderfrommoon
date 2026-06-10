# Supabase Setup — Step by Step

You said you have **nothing ready** and asked *how do I give you the URL*. Here is
exactly how to create the database and where to copy the URL + keys from. It takes
about 5 minutes and is **100% free** for this app.

> You don't "give the URL to me" — you paste it into the `.env.local` file in this
> project. The app reads it from there. I've already created `.env.local` for you
> with empty blanks to fill in.

---

## 1. Create a Supabase account & project

1. Go to **https://supabase.com** and click **Start your project** (sign in with
   GitHub or email — free).
2. Click **New project**.
3. Fill in:
   - **Name**: `belgian-waffle-xpress` (anything you like)
   - **Database Password**: click *Generate a password* and **save it somewhere**
     (you won't need it for this app, but Supabase requires one).
   - **Region**: pick the one closest to your customers (e.g. *Mumbai* / *Singapore*
     for India).
4. Click **Create new project** and wait ~1 minute while it provisions.

---

## 2. Get your URL and keys (this is the "URL" you were asking about)

1. In the project, open the left sidebar → **Project Settings** (gear icon) →
   **API**.
2. You'll see three things to copy:

   | On the Supabase page          | Paste into `.env.local` as              |
   | ----------------------------- | --------------------------------------- |
   | **Project URL**               | `NEXT_PUBLIC_SUPABASE_URL`               |
   | **Project API keys → `anon` `public`** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
   | **Project API keys → `service_role` `secret`** | `SUPABASE_SERVICE_ROLE_KEY` |

   - The **Project URL** looks like `https://abcdxyz123456.supabase.co` — **this is
     the URL.**
   - The **anon key** is safe to expose in the browser.
   - The **service_role key** is a secret — it is used only on the server (for the
     admin to change order status). Never commit it or put it in client code.

3. Open `.env.local` in this project and paste each value after the `=` sign.

> If you ever see "Legacy" vs "new" API keys in Supabase: the **anon/public** and
> **service_role/secret** keys both still work. Use the `anon` one for
> `NEXT_PUBLIC_SUPABASE_ANON_KEY` and the `service_role` one for
> `SUPABASE_SERVICE_ROLE_KEY`.

---

## 3. Create the tables (run the SQL)

1. In the Supabase sidebar, open **SQL Editor** → **New query**.
2. Open the file **`supabase/schema.sql`** from this project, copy **all** of it,
   paste into the editor, and click **Run**. You should see "Success".
3. Open **`supabase/seed.sql`**, copy all of it into a **new query**, and click
   **Run**. This loads the full Belgian Waffle Xpress menu (every item from the
   menu cards) and the branding row.

That's it — your database now has the menu, categories, settings, and empty
`orders` / `order_items` tables.

---

## 4. Turn on Realtime (so order status updates live)

The `schema.sql` already adds the `orders` table to the realtime publication with
this line:

```sql
alter publication supabase_realtime add table orders;
```

To double-check it's on: **Database → Replication** (or **Realtime**) → make sure
the `orders` table is enabled. If it errored as "already a member", that's fine —
it's already enabled.

---

## 5. Fill in the rest of `.env.local`

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (the anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (the service_role key)

# Admin login — change these!
ADMIN_USERNAME=admin
ADMIN_PASSWORD=pick-a-strong-password
ADMIN_SESSION_SECRET=any-long-random-string

# Restaurant WhatsApp number (intl format, digits only, no + or spaces)
NEXT_PUBLIC_RESTAURANT_WHATSAPP=919876543210
```

> Also update the **real WhatsApp number** inside the database: open
> **Table Editor → restaurant_settings**, edit the single row's `whatsapp_number`.
> The app reads the live number from the table; the env value is only a fallback.

---

## 6. Run the app

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. You should see the landing page with **Consumer**
and **Admin** cards. The menu will load from Supabase.

- Consumer: browse → add to cart → checkout → WhatsApp confirm → track order.
- Admin: log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD` → see orders update live.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Menu is empty | Did `seed.sql` run without errors? Re-run it. |
| "Invalid API key" | Re-copy the `anon` key; make sure no spaces/line breaks. |
| Order status doesn't update live | Confirm `orders` is in the realtime publication (step 4). |
| Admin login fails | Restart `npm run dev` after editing `.env.local`. |
| Tracking page 404s | Use the exact order number shown after checkout, e.g. `#101`. |
