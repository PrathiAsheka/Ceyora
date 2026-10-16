from typing import Dict, List


async def generate_whatsapp_message(
    student_name: str,
    guardian_name: str,
    amount: float,
    billing_period: str,
    due_date: str,
) -> str:
    return (
        f"Hello {guardian_name}, this is a kind reminder that the tuition fee of "
        f"LKR {amount:,.0f} for {billing_period} is still outstanding. "
        f"Please settle the payment by {due_date}. Thank you."
    )


async def send_whatsapp_message(
    phone_number: str,
    message: str,
) -> Dict:
    # TODO: Implement Meta WhatsApp Cloud API integration
    return {
        "success": False,
        "message": "WhatsApp integration not yet implemented",
        "phone": phone_number,
    }


async def send_sms(
    phone_number: str,
    message: str,
) -> Dict:
    # TODO: Implement SMS gateway integration
    return {
        "success": False,
        "message": "SMS integration not yet implemented",
        "phone": phone_number,
    }


async def dispatch_fee_reminders(
    db,
    institute_id,
) -> Dict:
    return {
        "dispatched": 0,
        "failed": 0,
        "message": "Fee reminder dispatch not yet implemented",
    }
