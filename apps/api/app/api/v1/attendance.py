from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_attendance():
    return {"message": "Attendance endpoint - TODO", "data": []}


@router.post("/scan")
async def record_qr_scan():
    return {"message": "QR scan attendance endpoint - TODO"}


@router.post("/sync")
async def sync_offline_scans():
    return {"message": "Sync offline scans endpoint - TODO"}


@router.get("/{class_id}")
async def get_class_attendance(class_id: str):
    return {"message": f"Class {class_id} attendance endpoint - TODO"}
