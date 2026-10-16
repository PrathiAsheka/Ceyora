from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_fee_charges():
    return {"message": "Fee charges endpoint - TODO", "data": []}


@router.post("/")
async def create_fee_charge():
    return {"message": "Create fee charge endpoint - TODO"}


@router.get("/{charge_id}")
async def get_fee_charge(charge_id: str):
    return {"message": f"Fee charge {charge_id} endpoint - TODO"}
