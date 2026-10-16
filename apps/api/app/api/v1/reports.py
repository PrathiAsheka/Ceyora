from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_reports():
    return {"message": "Reports endpoint - TODO", "data": []}


@router.post("/monthly")
async def generate_monthly_report():
    return {"message": "Generate monthly report endpoint - TODO"}


@router.get("/{report_id}")
async def get_report(report_id: str):
    return {"message": f"Report {report_id} endpoint - TODO"}


@router.get("/{report_id}/preview")
async def preview_report(report_id: str):
    return {"message": f"Preview report {report_id} endpoint - TODO"}


@router.get("/{report_id}/download")
async def download_report(report_id: str):
    return {"message": f"Download report {report_id} endpoint - TODO"}
