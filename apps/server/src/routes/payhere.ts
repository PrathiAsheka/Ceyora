/**
 * PayHere Online Payment Gateway Endpoints
 * Provides checkout hash calculation and IPN webhook notification handling.
 */
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { badRequest, handle, HttpError } from "../http";
import {
  generatePayHereCheckoutHash,
  PayHereStatusCode,
  validatePayHereSignature,
} from "../lib/payhere";
import { recordAuditEntry } from "../lib/pdpa";
import { recordFeePayment } from "../services/fees";

export const payhereRouter = Router();

const DEFAULT_SECRET = process.env.PAYHERE_SECRET || "897ab3c49ef01289de674a2110bc88";
const DEFAULT_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || "1224890";

/**
 * POST /api/payments/payhere/checkout-hash
 * Generates MD5 checkout hash for the PayHere JavaScript SDK on the frontend.
 */
payhereRouter.post(
  "/payments/payhere/checkout-hash",
  handle(async (req) => {
    const body = z
      .object({
        order_id: z.string(),
        amount: z.coerce.number().positive(),
        currency: z.string().default("LKR"),
        student_id: z.string().optional(),
      })
      .parse(req.body);

    const hash = generatePayHereCheckoutHash({
      merchantId: DEFAULT_MERCHANT_ID,
      merchantSecret: DEFAULT_SECRET,
      orderId: body.order_id,
      amount: body.amount,
      currency: body.currency,
    });

    return {
      merchant_id: DEFAULT_MERCHANT_ID,
      order_id: body.order_id,
      amount: Number(body.amount).toFixed(2),
      currency: body.currency,
      hash,
    };
  })
);

/**
 * POST /api/payments/payhere/notify
 * Inbound IPN webhook from PayHere payment gateway.
 * Publicly reachable, protected cryptographically by MD5 signature checksum.
 */
payhereRouter.post(
  "/payments/payhere/notify",
  handle(async (req) => {
    const payload = req.body ?? {};
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      custom_1: studentId,
      method,
    } = payload;

    if (!merchant_id || !order_id || !payhere_amount || !status_code || !md5sig) {
      throw badRequest("Missing required PayHere IPN notification fields.");
    }

    // Verify cryptographic signature
    const isValid = validatePayHereSignature(payload, DEFAULT_SECRET);
    if (!isValid) {
      recordAuditEntry({
        action: "COLLECT_FEE",
        entityType: "PaymentTransaction",
        entityId: order_id,
        performedBy: "PAYHERE_WEBHOOK_UNAUTHORIZED",
        clientIp: req.ip,
        details: { reason: "MD5 Signature Mismatch", order_id, payment_id },
      });
      throw new HttpError(400, "Invalid PayHere checksum signature.");
    }

    // Only process successful charges (status_code === "2")
    if (status_code === PayHereStatusCode.SUCCESS) {
      const amountInt = Math.round(parseFloat(payhere_amount));

      // If student ID was passed in custom_1, allocate payment in ledger
      if (studentId) {
        try {
          await recordFeePayment({
            student_id: studentId,
            amount: amountInt,
            payment_method: "online",
            reference_number: `PH-${payment_id || order_id}`,
          });
        } catch (err) {
          // If student not found in DB, still log receipt
          console.warn("PayHere notification: Student ledger allocation bypassed:", err);
        }
      }

      recordAuditEntry({
        action: "COLLECT_FEE",
        entityType: "PaymentTransaction",
        entityId: payment_id || order_id,
        performedBy: "PAYHERE_GATEWAY",
        clientIp: req.ip,
        details: {
          method: method || "ONLINE",
          amount: amountInt,
          currency: payhere_currency,
          order_id,
          student_id: studentId,
        },
      });

      return { status: "success", payment_id, order_id };
    }

    return { status: "ignored", code: status_code };
  })
);
