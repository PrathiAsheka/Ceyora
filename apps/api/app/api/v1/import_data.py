from fastapi import APIRouter, UploadFile, File

router = APIRouter()


@router.post("/csv")
async def import_csv(file: UploadFile = File(...)):
    return {"message": "CSV import endpoint - TODO"}


@router.post("/excel")
async def import_excel(file: UploadFile = File(...)):
    return {"message": "Excel import endpoint - TODO"}


@router.get("/preview")
async def preview_import():
    return {"message": "Preview import endpoint - TODO", "data": {}}


@router.post("/confirm")
async def confirm_import():
    return {"message": "Confirm import endpoint - TODO"}
