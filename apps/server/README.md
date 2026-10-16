# Ceyora360 API (`apps/server`)

The REST backend for the Ceyora360 tuition platform, built with Node.js, Express, Prisma and PostgreSQL.
It serves the same data shapes the web app already uses, so switching the
web app from its browser-local demo store to this API needs no UI changes.

## Run it

```bash
cd apps/server
cp .env.example .env            # DATABASE_URL, PORT, CORS_ORIGIN
docker compose up -d            # PostgreSQL 16 on localhost:5433
npm run db:deploy               # apply prisma/migrations
npm run db:seed                 # load the demo dataset (same ids/numbers as the web demo)
npm run dev                     # http://localhost:4000/api
```

Then point the web app at it (`apps/web/.env.local`):

```
NEXT_PUBLIC_DATA_SOURCE=api
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

`NEXT_PUBLIC_DATA_SOURCE=mock`, the default, keeps the browser-local demo store.

## Data model (`prisma/schema.prisma`)

Every business row has an `instituteId`, and deleting an institute cascades to everything under it.

| Model | Notes |
| --- | --- |
| `Institute` | `name`, `logo`, `address`, `cutOffDay` (bill due day), currency, contacts |
| `Subject` | per institute |
| `Class` | `grade`, `subjectId`, `medium`, `teacherId` (SET NULL when the teacher is deleted), weekly `dayOfWeek` / `timeSlot`, `monthlyFee` |
| `Teacher` | `name` (+ first/last), `phone`, `rate` + `rateType` (percentage of fees / per student / hourly) |
| `Staff` | `name`, `role`, `phone`, `salary` + `payType` (monthly / daily / hourly) and `unitsPerMonth` |
| `Student` | `classId` (primary class), `name`, `phone`, `parentPhone`, `address`, unique `qrCode` |
| `Enrollment` | student ↔ class (a student can take several classes); unique per pair |
| `Attendance` | `PRESENT` / `ABSENT` / `LATE` / `EXCUSED`; unique per class + student + date |
| `Payment` | **a bill**: one per student, class and `billingCycle` (`YYYY-MM`), with `amountBilled`, `amountPaid`, `balance`, `status` (`PAID` / `PARTIAL` / `PENDING` / `OVERDUE`) |
| `PaymentTransaction` + `PaymentAllocation` | money received, split over bills oldest-first |
| `Expense` | `title`, `category`, `amount`, `status` (`PAID` / `UNPAID`), `date`, due date, paid on, vendor, method, `amountPaid` and `payments` (instalments) |
| `TeacherAdvance` | `teacherId` (or `staffId`), `amount`, `date`, `settled`, plus status (requested / paid / rejected) and `deducted` |
| `Payout` | a settled salary with frozen earning lines, deductions, slip number `TP-YYYY-NNNN`, and `amountPaid` / `payments` when paid in parts |

## Sign-in and access control

- **First run:** the first visit asks for a Super Admin username and password (`POST /auth/setup`).
  Setup works only while no Super Admin exists. There are no built-in default credentials.
- **Super Admin:** has every permission across all institutes, and is the only account that can manage users and access codes.
- **Access codes:**
  - The Super Admin generates single-use codes like `CEY-7KQ2-M9XD` for teachers and class admins.
  - Each code carries a role, a name, permissions, an optional institute, an optional linked teacher with "own classes only", and an expiry of 1–30 days.
  - The person redeems it on the sign-in page and chooses their own username and password (`POST /auth/redeem`).
  - A code works once, and only its SHA-256 is stored.
- **Storage:**
  - Passwords are PBKDF2-SHA256 hashes (120,000 iterations).
  - Session tokens are random 256-bit values sent as `Authorization: Bearer <token>`. Only their SHA-256 is stored.
  - Sessions last 7 days.
  - Disabling an account or changing its password ends its other sessions.
  - Failed sign-ins are rate-limited to 10 per 15 minutes per username and IP.
- **Enforcement on every request** (`src/auth/guard.ts`):
  - A valid session is required everywhere except health, status, setup, login and redeem.
  - The route-to-permission table decides; anything not listed is refused.
  - Accounts limited to one institute only see and change that institute: `instituteId=all` becomes theirs, any other returns 403.
  - "Own classes only" teachers get only their classes, rosters, attendance and students.

| Endpoint | Purpose |
| --- | --- |
| `GET /auth/status` | `{ needs_setup }` |
| `POST /auth/setup` | Create the Super Admin (first run only) |
| `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | Session |
| `POST /auth/password` | Change own password |
| `POST /auth/redeem` | Create an account from an access code |
| `GET/POST /auth/invitations`, `POST /auth/invitations/:id/revoke` | Access codes (Super Admin) |
| `GET /auth/users`, `PATCH/DELETE /auth/users/:id` | Accounts: permissions, institute, disable, delete (Super Admin) |

## Rules

- **Strict institute scope:** every list or report needs `?instituteId=<id>` or `?instituteId=all`, and returns 400 without it.
  Single records answer 404 when `instituteId` is given and the record belongs to another institute.
  Linked records (a class's subject or teacher, an enrolment's student and class) must share an institute.
- **Fee rollover / partial payments:**
  - Money is applied to the oldest due bills first.
  - Underpayment leaves the rest owing, so it carries forward as a due.
  - Overpayment stays unapplied as a credit. It is applied automatically when the next bills are raised.
  - Bills past their due date become `OVERDUE`.
  - Each student's month is: opening (brought forward) + billed − received = closing (carried forward).
- **Payroll:**
  - Gross pay is a share of class fees, a rate per student, or an hourly rate × scheduled hours (teachers); or salary / wages (staff).
  - Net = gross − approved advances **dated on or before the payment date**, oldest first, capped at the gross.
  - Whatever is left of an advance is recovered from the next payout.
- **Partial payments (expenses and salaries):**
  - A bill or salary can be paid in instalments. Each payment adds to `amount_paid`; the balance (`amount - amount_paid`, or `net - amount_paid`) is what is still owed.
  - A bill stays `UNPAID` until fully paid, then becomes `PAID`. Paying more than the balance is rejected.
  - Dashboard: `expense_unpaid` is the balance still owed on bills; `payroll_paid` is the salary actually handed over.

## Endpoints (all under `/api`)

| Area | Endpoints |
| --- | --- |
| Institutes | `GET/POST /institutes`, `GET/PATCH/DELETE /institutes/:id` |
| Subjects, teachers, staff, classes, students | `GET` (scoped) and `POST` `/subjects` `/teachers` `/staff` `/classes` `/students`; `GET/PATCH/DELETE /<resource>/:id` |
| Enrolments | `GET/POST /enrollments`, `PATCH/DELETE /enrollments/:id` |
| Attendance | `GET /attendance?classId=&month=`, `GET /attendance/summary`, `GET /classes/:id/attendance?month=`, `PUT /attendance/marks` (batch upsert / clear), `POST /attendance/scan` |
| Bills | `GET/POST /fees/charges`, `GET /fees/periods` |
| Billing cycles | `POST /fees/cycles/:period/generate` (idempotent), `POST /fees/cycles/:period/process` (generate, apply credits, refresh statuses, return each student's rollover position) |
| Fee reports | `GET /fees/statuses?period=`, `GET /fees/outstanding`, `GET /fees/overdue`, `GET /fees/history?period=` |
| Student fees | `GET /students/:id/account`, `GET /students/:id/statement` |
| Payments | `GET /payments`, `POST /payments` (applies FIFO, returns the receipt), `POST /payments/unapplied`, `GET /payments/:id/receipt`, `POST /payments/receipts` (batch) |
| Expenses | `GET /expenses?status=paid\|unpaid&month=&category=`, `GET /expenses/summary`, `POST /expenses` (optional `amount_paid` for a first instalment), `POST /expenses/:id/payments` (pay part or all of the balance), `PATCH /expenses/:id`, `PATCH /expenses/:id/status`, `DELETE /expenses/:id` |
| Payroll | `GET /payroll?period=&paidOn=&payeeType=`, `GET/POST /payroll/advances`, `POST /payroll/advances/:id/decision`, `GET/POST /payroll/payouts` (optional `amount` paid now), `POST /payroll/payouts/:id/payments` (pay the balance), `GET /payroll/payouts/:id/receipt` |
| Dashboard | `GET /dashboard` |
| Academic | `GET /academic/summary`, `GET/POST /exams`, `DELETE /exams/:id`, `GET /exam-results`, `GET/POST /topics` |
| Support | `GET/POST /tickets`, `PATCH /tickets/:id` |
| Health | `GET /health` |

Set `LOG_REQUESTS=1` to log each request with its status and timing.

## Deploying

See [DEPLOY.md](../../DEPLOY.md) at the repository root: the API runs on Vercel as one serverless
function (`api/index.ts`, `vercel.json`) with a hosted PostgreSQL database.

## Notes

- **Deletes cascade:** deleting a student or class also removes its bills and payments.
- **Dashboard trend:** it is computed from real transactions, expenses and payouts, so months
  before any recorded activity show zero.
