from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_recommendations():
    return {"message": "Recommendations endpoint - TODO", "data": []}


@router.get("/alerts")
async def list_alerts():
    return {"message": "Alerts endpoint - TODO", "data": []}
