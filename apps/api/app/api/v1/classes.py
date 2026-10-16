from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_classes():
    return {"message": "Classes endpoint - TODO", "data": []}


@router.post("/")
async def create_class():
    return {"message": "Create class endpoint - TODO"}


@router.get("/{class_id}")
async def get_class(class_id: str):
    return {"message": f"Class {class_id} endpoint - TODO"}
