from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_dashboard():
    return {
        "message": "Dashboard endpoint - TODO",
        "data": {
            "total_students": 0,
            "active_classes": 0,
            "active_teachers": 0,
            "monthly_revenue": 0,
            "outstanding_fees": 0,
            "collection_rate": 0,
        },
    }
