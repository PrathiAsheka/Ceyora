/**
 * PayHere Payment Gateway Integration Engine
 * Compliant with PayHere Merchant Specifications for Sri Lanka (LKR currency)
 * Provides cryptographic MD5 checkout hash generation and IPN webhook signature validation.
 */
import { createHash } from "node:crypto";
import { z } from "zod";

export interface PayHereCheckoutParams {
  merchantId: string;
  merchantSecret: string;
  orderId: string;
  amount: number;
  currency?: string; // defaults to "LKR"
}

export interface PayHereWebhookPayload {
  merchant_id: string;
  order_id: string;
  payment_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string; // "2" = SUCCESS, "0" = PENDING, "-1" = CANCELED, "-2" = FAILED, "-3" = CHARGEDBACK
  md5sig: string;
  custom_1?: string; // Student ID
  custom_2?: string; // Class ID or Institute ID
  method?: string; // "VISA", "MASTER", "FRIMI", "GENIE", "EZCASH", etc.
  status_message?: string;
  card_holder_name?: string;
  card_no?: string;
}

export const payHereWebhookSchema = z.object({
  merchant_id: z.string(),
  order_id: z.string(),
  payment_id: z.string(),
  payhere_amount: z.string(),
  payhere_currency: z.string(),
  status_code: z.string(),
  md5sig: z.string(),
  custom_1: z.string().optional(),
  custom_2: z.string().optional(),
  method: z.string().optional(),
  status_message: z.string().optional(),
  card_holder_name: z.string().optional(),
  card_no: z.string().optional(),
});

/**
 * Computes MD5 hash in uppercase as required by PayHere.
 */
export function md5(input: string): string {
  return createHash("md5").update(input).digest("hex").toUpperCase();
}

/**
 * Generates the frontend PayHere checkout hash:
 * uppercase(md5(merchant_id + order_id + amount_formatted + currency + uppercase(md5(merchant_secret))))
 */
export function generatePayHereCheckoutHash(params: PayHereCheckoutParams): string {
  const currency = params.currency ?? "LKR";
  const formattedAmount = Number(params.amount).toFixed(2);
  const secretHash = md5(params.merchantSecret);
  const rawString = `${params.merchantId}${params.orderId}${formattedAmount}${currency}${secretHash}`;
  return md5(rawString);
}

/**
 * Validates the inbound PayHere IPN webhook notification checksum:
 * uppercase(md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + uppercase(md5(merchant_secret))))
 */
export function validatePayHereSignature(
  payload: PayHereWebhookPayload,
  merchantSecret: string
): boolean {
  const secretHash = md5(merchantSecret);
  const rawString = `${payload.merchant_id}${payload.order_id}${payload.payhere_amount}${payload.payhere_currency}${payload.status_code}${secretHash}`;
  const localChecksum = md5(rawString);
  return localChecksum === payload.md5sig.toUpperCase();
}

export const PayHereStatusCode = {
  SUCCESS: "2",
  PENDING: "0",
  CANCELED: "-1",
  FAILED: "-2",
  CHARGEDBACK: "-3",
} as const;
