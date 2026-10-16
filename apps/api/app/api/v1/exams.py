from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_exams():
    return {"message": "Exams endpoint - TODO", "data": []}


@router.post("/")
async def create_exam():
    return {"message": "Create exam endpoint - TODO"}


@router.get("/{exam_id}")
async def get_exam(exam_id: str):
    return {"message": f"Exam {exam_id} endpoint - TODO"}


@router.post("/{exam_id}/results")
async def submit_exam_results(exam_id: str):
    return {"message": f"Submit results for exam {exam_id} - TODO"}
