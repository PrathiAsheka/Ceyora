from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_payments():
    return {"message": "Payments endpoint - TODO", "data": []}


@router.post("/")
async def create_payment():
    return {"message": "Record payment endpoint - TODO"}


@router.get("/{payment_id}")
async def get_payment(payment_id: str):
    return {"message": f"Payment {payment_id} endpoint - TODO"}
