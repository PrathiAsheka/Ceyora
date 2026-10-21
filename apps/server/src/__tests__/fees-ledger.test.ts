import assert from "node:assert";
import { describe, test } from "node:test";
import {
  balanceOf,
  chargeOrder,
  paidByCharge,
  receiptNumber,
} from "../services/fees";
import type { FeeCharge, Payment } from "../dto";

describe("Tuition Fee Ledger & Allocation Calculation Suite", () => {
  test("orders charges oldest due date first (FIFO allocation order)", () => {
    const charges: FeeCharge[] = [
      {
        id: "chg-3",
        institute_id: "inst-1",
        student_id: "s1",
        class_id: "cls-1",
        billing_period: "2026-10",
        amount: 4500,
        discount: 0,
        discount_type: "fixed",
        net_amount: 4500,
        due_date: "2026-10-15",
        status: "pending",
        created_at: "2026-10-01T00:00:00Z",
      },
      {
        id: "chg-1",
        institute_id: "inst-1",
        student_id: "s1",
        class_id: "cls-1",
        billing_period: "2026-08",
        amount: 4500,
        discount: 0,
        discount_type: "fixed",
        net_amount: 4500,
        due_date: "2026-08-15",
        status: "overdue",
        created_at: "2026-08-01T00:00:00Z",
      },
      {
        id: "chg-2",
        institute_id: "inst-1",
        student_id: "s1",
        class_id: "cls-1",
        billing_period: "2026-09",
        amount: 4500,
        discount: 0,
        discount_type: "fixed",
        net_amount: 4500,
        due_date: "2026-09-15",
        status: "overdue",
        created_at: "2026-09-01T00:00:00Z",
      },
    ];

    const sorted = [...charges].sort(chargeOrder);
    assert.strictEqual(sorted[0].id, "chg-1"); // 2026-08-15
    assert.strictEqual(sorted[1].id, "chg-2"); // 2026-09-15
    assert.strictEqual(sorted[2].id, "chg-3"); // 2026-10-15
  });

  test("calculates paid amounts per fee charge across multiple payment transactions", () => {
    const payments: Payment[] = [
      {
        id: "pay-1",
        institute_id: "inst-1",
        student_id: "s1",
        amount: 5000,
        payment_method: "cash",
        created_at: "2026-10-05T10:00:00Z",
        allocations: [
          { id: "alloc-1", payment_id: "pay-1", fee_charge_id: "chg-1", amount: 4500 },
          { id: "alloc-2", payment_id: "pay-1", fee_charge_id: "chg-2", amount: 500 },
        ],
      },
      {
        id: "pay-2",
        institute_id: "inst-1",
        student_id: "s1",
        amount: 4000,
        payment_method: "online",
        created_at: "2026-10-10T14:30:00Z",
        allocations: [
          { id: "alloc-3", payment_id: "pay-2", fee_charge_id: "chg-2", amount: 4000 },
        ],
      },
    ];

    const paidMap = paidByCharge(payments);
    assert.strictEqual(paidMap.get("chg-1"), 4500);
    assert.strictEqual(paidMap.get("chg-2"), 4500);
    assert.strictEqual(paidMap.get("chg-3"), undefined);
  });

  test("computes remaining balance accurately for paid, partial and unsettled charges", () => {
    const paidMap = new Map<string, number>([
      ["chg-full", 4500],
      ["chg-part", 2000],
    ]);

    const fullCharge: FeeCharge = {
      id: "chg-full",
      institute_id: "inst-1",
      student_id: "s1",
      class_id: "cls-1",
      billing_period: "2026-10",
      amount: 4500,
      discount: 0,
      discount_type: "fixed",
      net_amount: 4500,
      due_date: "2026-10-10",
      status: "paid",
      created_at: "2026-10-01T00:00:00Z",
    };

    const partCharge: FeeCharge = {
      id: "chg-part",
      institute_id: "inst-1",
      student_id: "s1",
      class_id: "cls-1",
      billing_period: "2026-10",
      amount: 5000,
      discount: 0,
      discount_type: "fixed",
      net_amount: 5000,
      due_date: "2026-10-10",
      status: "partial",
      created_at: "2026-10-01T00:00:00Z",
    };

    const unpaidCharge: FeeCharge = {
      id: "chg-unpaid",
      institute_id: "inst-1",
      student_id: "s1",
      class_id: "cls-1",
      billing_period: "2026-10",
      amount: 4200,
      discount: 0,
      discount_type: "fixed",
      net_amount: 4200,
      due_date: "2026-10-10",
      status: "pending",
      created_at: "2026-10-01T00:00:00Z",
    };

    assert.strictEqual(balanceOf(fullCharge, paidMap), 0);
    assert.strictEqual(balanceOf(partCharge, paidMap), 3000); // 5000 - 2000
    assert.strictEqual(balanceOf(unpaidCharge, paidMap), 4200); // 4200 - 0
  });

  test("generates predictable, audit-traceable receipt numbers", () => {
    const payment: Payment = {
      id: "pay-8902",
      institute_id: "inst-1",
      student_id: "s2",
      amount: 4500,
      payment_method: "online",
      created_at: "2026-10-15T09:30:00Z",
      allocations: [],
    };

    const receipt = receiptNumber(payment);
    assert.match(receipt, /^RC-2026-8902-\d+$/);
  });
});
