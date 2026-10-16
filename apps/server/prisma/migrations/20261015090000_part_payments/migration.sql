-- Instalments on expense bills and salary payouts.
ALTER TABLE "expenses"
  ADD COLUMN "amount_paid" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "payments" JSONB NOT NULL DEFAULT '[]';

ALTER TABLE "payouts"
  ADD COLUMN "amount_paid" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "payments" JSONB NOT NULL DEFAULT '[]';

-- Existing paid bills and every existing payout were paid in full, in one go.
UPDATE "expenses"
SET "amount_paid" = "amount",
    "payments" = jsonb_build_array(
      jsonb_strip_nulls(jsonb_build_object(
        'id', "id" || '_p1',
        'date', to_char(COALESCE("paid_on", "date"), 'YYYY-MM-DD'),
        'amount', "amount",
        'method', lower("method"::text)
      ))
    )
WHERE "status" = 'PAID';

UPDATE "payouts"
SET "amount_paid" = "net",
    "payments" = jsonb_build_array(
      jsonb_strip_nulls(jsonb_build_object(
        'id', "id" || '_p1',
        'date', to_char("paid_on", 'YYYY-MM-DD'),
        'amount', "net",
        'method', lower("method"::text),
        'reference', "reference"
      ))
    )
WHERE "net" > 0;
