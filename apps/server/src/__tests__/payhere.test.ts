import assert from "node:assert";
import { test, describe } from "node:test";
import {
  generatePayHereCheckoutHash,
  validatePayHereSignature,
  md5,
  PayHereStatusCode,
  PayHereWebhookPayload,
} from "../lib/payhere";

describe("PayHere Gateway Integration Suite", () => {
  const merchantId = "1224890";
  const merchantSecret = "my_secret_key_8899";

  test("computes correct MD5 checksum", () => {
    const hash = md5("Hello Ceyora");
    assert.strictEqual(typeof hash, "string");
    assert.strictEqual(hash.length, 32);
    assert.strictEqual(hash, hash.toUpperCase());
  });

  test("generates deterministic checkout hash for client modal", () => {
    const orderId = "ORD-2026-9012";
    const amount = 6500;

    const hash1 = generatePayHereCheckoutHash({
      merchantId,
      merchantSecret,
      orderId,
      amount,
      currency: "LKR",
    });

    const hash2 = generatePayHereCheckoutHash({
      merchantId,
      merchantSecret,
      orderId,
      amount,
      currency: "LKR",
    });

    assert.strictEqual(hash1, hash2);
    assert.strictEqual(hash1.length, 32);
  });

  test("verifies valid PayHere IPN webhook notification signature", () => {
    const orderId = "ORD-2026-9012";
    const paymentId = "320025112000";
    const amountStr = "6500.00";
    const currency = "LKR";
    const statusCode = PayHereStatusCode.SUCCESS;

    // Calculate expected signature
    const secretHash = md5(merchantSecret);
    const expectedSig = md5(`${merchantId}${orderId}${amountStr}${currency}${statusCode}${secretHash}`);

    const payload: PayHereWebhookPayload = {
      merchant_id: merchantId,
      order_id: orderId,
      payment_id: paymentId,
      payhere_amount: amountStr,
      payhere_currency: currency,
      status_code: statusCode,
      md5sig: expectedSig,
      custom_1: "s1",
      method: "VISA",
    };

    const isValid = validatePayHereSignature(payload, merchantSecret);
    assert.strictEqual(isValid, true, "Signature validation should succeed for authentic payload");
  });

  test("rejects tampered or forged PayHere webhook signature", () => {
    const payload: PayHereWebhookPayload = {
      merchant_id: merchantId,
      order_id: "ORD-FORGED-1111",
      payment_id: "320025112000",
      payhere_amount: "6500.00",
      payhere_currency: "LKR",
      status_code: PayHereStatusCode.SUCCESS,
      md5sig: "FORGED_SIGNATURE_HASH_INCORRECT_00000",
    };

    const isValid = validatePayHereSignature(payload, merchantSecret);
    assert.strictEqual(isValid, false, "Signature validation should fail for forged payload");
  });
});
