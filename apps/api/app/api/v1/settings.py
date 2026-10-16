from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_settings():
    return {"message": "Settings endpoint - TODO", "data": {}}


@router.put("/")
async def update_settings():
    return {"message": "Update settings endpoint - TODO"}
