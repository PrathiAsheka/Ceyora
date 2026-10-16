/**
 * Financial Ledger Reversals & PDPA Compliance Endpoints
 * Adheres to double-entry bookkeeping principles (reversals instead of destructive deletions)
 * and Sri Lanka PDPA No. 9 of 2022 audit requirements.
 */
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { badRequest, handle, HttpError, notFound } from "../http";
import { ensureInScope } from "../auth/guard";
import { anonymizeExamRankings, getRecentAuditLogs, recordAuditEntry } from "../lib/pdpa";

export const reversalsRouter = Router();

/**
 * POST /api/payments/:id/reverse
 * Executes a compensating reversal of a recorded fee payment transaction.
 * Restores the student's outstanding balances and registers a mandatory audit entry.
 */
reversalsRouter.post(
  "/payments/:id/reverse",
  handle(async (req) => {
    const { id } = req.params;
    const body = z
      .object({
        reason: z.string().min(5, "Reversal reason must be at least 5 characters"),
        authorized_by: z.string().optional(),
      })
      .parse(req.body);

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id },
      include: {
        allocations: {
          include: { payment: true },
        },
        student: true,
      },
    });

    if (!transaction) throw notFound("Payment transaction");
    ensureInScope(req, transaction.instituteId);

    // Execute compensating reversal in transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Unwind each allocation against the billed Payment rows
      for (const alloc of transaction.allocations) {
        const payment = alloc.payment;
        const newPaid = Math.max(0, payment.amountPaid - alloc.amount);
        const newBalance = payment.amountBilled - newPaid;
        const newStatus =
          newBalance === 0 ? "PAID" : newPaid > 0 ? "PARTIAL" : "PENDING";

        await tx.payment.update({
          where: { id: payment.id },
          data: {
            amountPaid: newPaid,
            balance: newBalance,
            status: newStatus,
          },
        });
      }

      // 2. Remove the allocations so bills can be settled again
      await tx.paymentAllocation.deleteMany({
        where: { transactionId: transaction.id },
      });

      // 3. Instead of deleting the transaction, update reference with reversal tag
      const updatedTx = await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          reference: `${transaction.reference ? transaction.reference + " | " : ""}REVERSED: ${body.reason}`,
        },
      });

      return updatedTx;
    });

    // Record immutable audit entry
    recordAuditEntry({
      action: "REVERSE_PAYMENT",
      entityType: "PaymentTransaction",
      entityId: transaction.id,
      performedBy: req.auth?.user.username || body.authorized_by || "ADMIN",
      clientIp: req.ip,
      details: {
        originalAmount: transaction.amount,
        studentId: transaction.studentId,
        studentName: `${transaction.student.firstName} ${transaction.student.lastName}`,
        reason: body.reason,
      },
    });

    return {
      ok: true,
      transaction_id: transaction.id,
      reversed_amount: transaction.amount,
      reason: body.reason,
      message: "Compensating ledger reversal recorded successfully. Student balances recalculated.",
    };
  })
);

/**
 * GET /api/compliance/audit-logs
 * Retrieves the high-integrity audit trail for PDPA compliance verification.
 */
reversalsRouter.get(
  "/compliance/audit-logs",
  handle(async () => {
    return getRecentAuditLogs(200);
  })
);

/**
 * GET /api/compliance/anonymized-leaderboard
 * Converts exam results for a given class/exam into masked candidate tokens.
 */
reversalsRouter.get(
  "/compliance/anonymized-leaderboard",
  handle(async (req) => {
    const examId = req.query.exam_id as string | undefined;
    const where = examId ? { examId } : {};

    const results = await prisma.examResult.findMany({
      where,
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
        exam: { select: { id: true, name: true, totalMarks: true } },
      },
      orderBy: { marks: "desc" },
    });

    const mapped = results.map((r) => ({
      id: r.id,
      studentId: r.studentId,
      studentName: `${r.student.firstName} ${r.student.lastName}`,
      marks: r.marks,
      grade: r.grade,
      examName: r.exam.name,
      totalMarks: r.exam.totalMarks,
    }));

    return anonymizeExamRankings(mapped);
  })
);
