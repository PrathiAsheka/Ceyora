from fastapi import APIRouter

router = APIRouter()


@router.get("/overview")
async def analytics_overview():
    return {"message": "Analytics overview endpoint - TODO", "data": {}}


@router.get("/financial")
async def financial_analytics():
    return {"message": "Financial analytics endpoint - TODO", "data": {}}


@router.get("/student")
async def student_analytics():
    return {"message": "Student analytics endpoint - TODO", "data": {}}


@router.get("/class")
async def class_analytics():
    return {"message": "Class analytics endpoint - TODO", "data": {}}


@router.get("/teacher")
async def teacher_analytics():
    return {"message": "Teacher analytics endpoint - TODO", "data": {}}


@router.get("/attendance")
async def attendance_analytics():
    return {"message": "Attendance analytics endpoint - TODO", "data": {}}


@router.get("/academic")
async def academic_analytics():
    return {"message": "Academic analytics endpoint - TODO", "data": {}}
