# Deploying Ceyora360 to Vercel

Ceyora360 is deployed as **two Vercel projects from the same Git repository**:

| Vercel project | Root Directory | What it is |
| --- | --- | --- |
| `ceyora360-api` | `apps/server` | Express + Prisma REST API (one serverless function) |
| `ceyora360-web` | `apps/web` | Next.js web app |

Plus one **PostgreSQL database** (Neon, through the Vercel Marketplace, is the easiest).

Each project already has a `vercel.json`, so Vercel uses the right install, build and routing settings.

---

## 0. Before you start

1. **Commit and push** all the changes to GitHub (the repo the Vercel projects will import).
   - Commit `apps/server`, `apps/web` (including `apps/web/public/`), `package-lock.json` and this file.
   - Don't commit `.env` files. They are already ignored.
   - Don't commit the old `apps/api` folder (the earlier FastAPI backend). It isn't used.
2. Have a Vercel account connected to that GitHub account.

## 1. Create the database

1. In Vercel: **Storage → Create Database → Neon (Postgres)**. Pick the region closest to your users (Singapore for Sri Lanka).
2. Open the database's **.env.local / Quickstart** tab and keep two connection strings:
   - **Pooled** connection (host contains `-pooler`) → becomes `DATABASE_URL`.
   - **Direct / unpooled** connection → becomes `DIRECT_URL`.

Any other PostgreSQL 14+ provider (Supabase, Railway, RDS…) works the same way.

## 2. Deploy the API (`apps/server`)

1. Vercel → **Add New → Project** → import the repo.
2. **Root Directory:** `apps/server`. Leave Framework Preset as **Other**; `vercel.json` sets the rest.
3. **Environment Variables:**

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | the **pooled** Neon connection string |
   | `DIRECT_URL` | the **direct** Neon connection string |
   | `SETUP_TOKEN` | a long random secret, e.g. from `openssl rand -hex 24`. Needed to create the Super Admin |
   | `CORS_ORIGIN` | the web app's URL, e.g. `https://ceyora360-web.vercel.app` (set after step 3, then redeploy) |

4. **Deploy.** The build runs `prisma generate` and `prisma migrate deploy`, which creates every table.
5. Check `https://<your-api>.vercel.app/api/health`. It should return `{"ok":true}`.

## 3. Deploy the web app (`apps/web`)

1. **Add New → Project** → import the same repo again.
2. **Root Directory:** `apps/web`. Framework: **Next.js**.
3. **Environment Variables:**

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_DATA_SOURCE` | `api` |
   | `NEXT_PUBLIC_API_URL` | `https://<your-api>.vercel.app/api` |

4. **Deploy.**
5. Go back to the API project. Set `CORS_ORIGIN` to this web URL (several origins can be separated by commas, e.g. a custom domain too), then **Redeploy** the API.

## 4. First sign-in

1. Open the web app. It shows **Create the Super Admin**.
2. Enter your name, a username, a password, and the **Setup key**, which is the `SETUP_TOKEN` value.
3. You are now the Super Admin. Under **Settings → Users & access**, generate access codes for teachers and class admins.

## 5. Data: start empty or load the demo

The database starts **empty**: no institutes, students or fees. Add your institutes from **Manage institutes**.

To load the **demo dataset** instead (4 institutes, about 450 students, September/October 2026 fees, attendance, exams), run once from your computer:

```bash
cd apps/server
# PowerShell: $env:DATABASE_URL="<DIRECT Neon URL>"; $env:DIRECT_URL="<DIRECT Neon URL>"; npm run db:seed
DATABASE_URL="<DIRECT Neon URL>" DIRECT_URL="<DIRECT Neon URL>" npm run db:seed
```

The seed **replaces all institute data** (accounts are kept). Don't run it on a database with real data.

## Updating later

Push to GitHub and both projects redeploy. New database migrations (`apps/server/prisma/migrations`) are applied automatically by the API build.

## Notes

- **Demo mode without a backend:**
  - If the web project has no `NEXT_PUBLIC_DATA_SOURCE` (or it's `mock`), every visitor gets their own demo data stored in their browser.
  - That's fine for a public demo, but not for real use.
- **Security:**
  - Passwords are PBKDF2-hashed.
  - Sessions and access codes are stored only as SHA-256 hashes.
  - Every API request is checked against the account's permissions and institute.
  - Always set `SETUP_TOKEN` on a public deployment.
- **Limits on Vercel's free (Hobby) plan:**
  - API requests are limited to 30 s (`vercel.json`); all of them finish far faster.
  - Hobby is for non-commercial use; a paying institute should use Vercel Pro.
- **Custom domain:**
  - Add it in the web project's Settings → Domains.
  - Then add that origin to the API's `CORS_ORIGIN`.
