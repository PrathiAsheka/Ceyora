from decimal import Decimal
from typing import Optional
from uuid import UUID


def calculate_fee_amount(
    base_amount: Decimal,
    discount: Decimal = Decimal(0),
    discount_type: str = "fixed",
) -> Decimal:
    if discount_type == "percentage":
        discount_amount = base_amount * (discount / Decimal(100))
    else:
        discount_amount = discount

    net_amount = base_amount - discount_amount
    return max(net_amount, Decimal(0))


def calculate_sibling_discount(
    base_amount: Decimal,
    sibling_count: int,
    discount_percentage: Decimal = Decimal(10),
) -> Decimal:
    if sibling_count <= 1:
        return Decimal(0)
    return base_amount * (discount_percentage / Decimal(100))


def calculate_teacher_share(
    total_collection: Decimal,
    compensation_type: str,
    compensation_value: Decimal,
    student_count: int = 0,
    hours: float = 0,
) -> Decimal:
    if compensation_type == "percentage":
        return total_collection * (compensation_value / Decimal(100))
    elif compensation_type == "flat_student":
        return compensation_value * student_count
    elif compensation_type == "hourly_rate":
        return compensation_value * Decimal(str(hours))
    return Decimal(0)
