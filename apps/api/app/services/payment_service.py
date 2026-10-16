from decimal import Decimal
from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import Payment, PaymentAllocation, FeeCharge, FeeChargeStatus


async def allocate_payment(
    db: AsyncSession,
    payment_id: UUID,
    allocations: List[dict],
) -> List[PaymentAllocation]:
    result_records = []
    for alloc in allocations:
        fee_charge_id = alloc["fee_charge_id"]
        amount = Decimal(str(alloc["amount"]))

        fee_result = await db.execute(
            select(FeeCharge).where(FeeCharge.id == fee_charge_id)
        )
        fee_charge = fee_result.scalar_one_or_none()

        if not fee_charge:
            continue

        allocation = PaymentAllocation(
            payment_id=payment_id,
            fee_charge_id=fee_charge_id,
            amount=amount,
        )
        db.add(allocation)
        result_records.append(allocation)

        already_paid = sum(
            a.amount for a in fee_charge.allocations if a.payment_id != payment_id
        )
        total_paid = already_paid + amount

        if total_paid >= fee_charge.net_amount:
            fee_charge.status = FeeChargeStatus.PAID
        elif total_paid > 0:
            fee_charge.status = FeeChargeStatus.PARTIAL

    await db.flush()
    return result_records


async def create_reversal(
    db: AsyncSession,
    payment_id: UUID,
    reason: str,
) -> Payment:
    original_result = await db.execute(select(Payment).where(Payment.id == payment_id))
    original = original_result.scalar_one_or_none()

    if not original:
        raise ValueError("Payment not found")

    reversal = Payment(
        student_id=original.student_id,
        amount=-original.amount,
        payment_method=original.payment_method,
        reference_number=f"REV-{original.reference_number or original.id}",
        notes=f"Reversal: {reason}",
    )
    db.add(reversal)
    await db.flush()

    alloc_result = await db.execute(
        select(PaymentAllocation).where(PaymentAllocation.payment_id == payment_id)
    )
    for alloc in alloc_result.scalars().all():
        reverse_alloc = PaymentAllocation(
            payment_id=reversal.id,
            fee_charge_id=alloc.fee_charge_id,
            amount=-alloc.amount,
        )
        db.add(reverse_alloc)

    await db.flush()
    return reversal
