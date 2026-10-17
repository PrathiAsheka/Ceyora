# Ceyora 360 - Production Deployment & Operational Runbook

This runbook outlines the required manual steps, architectural requirements, environment configurations, and security verifications needed to deploy the **Ceyora Tuition Management & Business Intelligence Platform** into a secure, enterprise-grade production environment.

---

## 1. Hosting Architecture Options

### Option A: Modern Managed Cloud (Recommended for high availability)
- **Frontend (`@ceyora/web`)**: [Vercel](https://vercel.com) or [Cloudflare Pages](https://pages.cloudflare.com)
  - Framework preset: `Next.js`
  - Root directory: `apps/web`
  - Build command: `npm run build`
  - Output directory: `.next`
- **Backend API (`@ceyora/server`)**: [Railway](https://railway.app), [Render](https://render.com), [Fly.io](https://fly.io), or [AWS ECS/App Runner](https://aws.amazon.com)
  - Root directory: `apps/server`
  - Build command: `npm run build`
  - Start command: `npm start` (or `node dist/src/index.js`)
- **Database (PostgreSQL 16)**: [Neon](https://neon.tech), [Supabase](https://supabase.com), or [AWS RDS PostgreSQL](https://aws.amazon.com/rds/postgresql/)
  - Provides built-in connection pooling, automated failover, and point-in-time recovery.

### Option B: Self-Hosted Docker VPS (Ubuntu 22.04 LTS / 24.04 LTS)
Deploy the full stack on a single Virtual Private Server (DigitalOcean Droplet, Hetzner Cloud, AWS EC2, or Linode) using the included orchestration:
```bash
# Clone the repository onto the VPS
git clone https://github.com/PrathiAsheka/Ceyora.git
cd Ceyora

# Copy and edit production environment variables
cp .env.example .env
nano .env

# Build and start all production containers in the background
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 2. Step-by-Step Manual Actions Required

### Step 1: PostgreSQL Database Provisioning & Schema Migration
1. Create a production PostgreSQL 16 database.
2. If using a connection pooler (like Neon, Supabase, or PgBouncer), retrieve two connection strings:
   - **`DATABASE_URL`**: Pooled connection (e.g. port `6543` or `-pooler` hostname) used by the API at runtime.
   - **`DIRECT_URL`**: Direct connection (port `5432`) used by Prisma to apply DDL migrations.
3. Run the schema migrations from your terminal or CI/CD pipeline:
   ```bash
   # From the repository root
   npm run db:deploy
   ```
4. *(Optional)* Seed initial master curriculum data or demo branches:
   ```bash
   npm run db:seed
   ```

---

### Step 2: Initial Super-Admin Provisioning
To prevent unauthorized takeover of a fresh instance, Ceyora protects the first-time setup route:
1. Generate a 32-character random cryptographic string for `SETUP_TOKEN`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Set `SETUP_TOKEN=<your-token>` in the backend environment.
3. Trigger the initial setup call via `curl` or Postman:
   ```bash
   curl -X POST https://api.yourdomain.lk/api/auth/setup \
     -H "Content-Type: application/json" \
     -H "X-Setup-Token: <your-token>" \
     -d '{
       "name": "Head Office Super Admin",
       "username": "superadmin",
       "password": "YourStrongPasswordHere#2026",
       "institute_name": "Apex Educational Institute",
       "branch_name": "Colombo Main Campus"
     }'
   ```
4. Once completed, the endpoint permanently locks down and cannot be called again.

---

### Step 3: PayHere Sri Lanka Payment Gateway Onboarding
1. Sign in to [PayHere Merchant Portal](https://www.payhere.lk).
2. Complete merchant verification (requires Sri Lankan Business Registration certificate or individual NIC).
3. Under **Settings > Domains & Credentials**:
   - Add your live domain (e.g., `https://app.yourdomain.lk`).
   - Copy your live **Merchant ID** and **Merchant Secret**.
4. In **PayHere Notification Settings**:
   - Set IPN (Instant Payment Notification) Notify URL to:
     `https://api.yourdomain.lk/api/payhere/notify`
5. Update your backend environment variables:
   ```ini
   PAYHERE_MERCHANT_ID=your_live_merchant_id
   PAYHERE_SECRET=your_live_merchant_secret
   PAYHERE_SANDBOX=0
   ```
6. Update frontend environment variables:
   ```ini
   NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your_live_merchant_id
   NEXT_PUBLIC_PAYHERE_MODE=production
   ```

---

### Step 4: Sri Lanka SMS Gateway Configuration (TRCSL Approved)
For automated fee receipts, attendance alerts, and arrears collection notices:
1. Contact a Sri Lankan telecommunication enterprise provider:
   - **Mobitel Enterprise SMS (Esana)**
   - **Dialog Enterprise Corporate SMS**
2. Obtain TRCSL approval for your custom alphanumeric Sender ID (e.g. `CEYORA` or `INSTITUTE`).
3. Set the credentials in your backend environment:
   ```ini
   SMS_GATEWAY_PROVIDER=mobitel
   SMS_API_URL=https://msmsenterprise.mobitel.lk/api/v1/sms/send
   SMS_API_KEY=your_production_api_key
   SMS_SENDER_ID=CEYORA
   ```

---

### Step 5: Domain DNS, Reverse Proxy & SSL Setup
1. Configure DNS records with your DNS provider (e.g. Cloudflare):
   - `app.yourdomain.lk` &rarr; CNAME to Vercel/Cloudflare or A record to VPS IP.
   - `api.yourdomain.lk` &rarr; CNAME to Railway/Render or A record to VPS IP.
2. If using Nginx on a VPS, configure reverse proxy with SSL (Let's Encrypt):
   ```nginx
   # Frontend
   server {
       server_name app.yourdomain.lk;
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Forwarded-For $remote_addr;
           proxy_set_header X-Forwarded-Proto https;
       }
   }

   # Backend API
   server {
       server_name api.yourdomain.lk;
       location / {
           proxy_pass http://localhost:4000;
           proxy_set_header Host $host;
           proxy_set_header X-Forwarded-For $remote_addr;
           proxy_set_header X-Forwarded-Proto https;
       }
   }
   ```
3. Update `CORS_ORIGIN` in backend `.env`:
   ```ini
   CORS_ORIGIN=https://app.yourdomain.lk
   ```

---

### Step 6: Sri Lanka Personal Data Protection Act (PDPA) Compliance
Under the Sri Lanka Personal Data Protection Act (Act No. 9 of 2022):
1. **Purpose Limitation**: Ensure student data (NIC, contact numbers, grades) is processed exclusively for tuition administration.
2. **Data Masking**: Active by default in Ceyora (`PDPA_AUDIT_LOG_ENABLED=1`). NIC numbers and parent contact numbers are automatically masked on public/sub-admin screens.
3. **Right to Erasure**: Use the student profile "Deactivate & Anonymize" feature to remove personally identifiable records while maintaining financial transaction integrity.
4. **Data Retention**: Set `PDPA_DATA_RETENTION_DAYS=2555` (7 years) to comply with statutory financial record-keeping requirements.

---

### Step 7: Automated Backups & System Monitoring
1. **Automated Database Backups**: Set up a daily cron job to dump PostgreSQL and upload to encrypted off-site cloud storage (AWS S3 or Cloudflare R2):
   ```bash
   0 2 * * * pg_dump -U ceyora -d ceyora -F c -b -v -f /backups/ceyora_$(date +\%F).dump && aws s3 cp /backups/ceyora_$(date +\%F).dump s3://your-secure-backup-bucket/
   ```
2. **Health Monitoring**: Configure an uptime monitoring alert (e.g., UptimeRobot, BetterUptime) pointing to:
   - `GET https://api.yourdomain.lk/api/health` (checks database connectivity, service latency, and PDPA status).
