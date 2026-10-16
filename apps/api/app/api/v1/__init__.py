from fastapi import APIRouter

from app.api.v1 import auth, institutes, teachers, students, classes, fee_charges, payments, expenses, attendance, exams, analytics, dashboard, reports, import_data, recommendations, settings, support

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(institutes.router, prefix="/institutes", tags=["Institutes"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["Teachers"])
api_router.include_router(students.router, prefix="/students", tags=["Students"])
api_router.include_router(classes.router, prefix="/classes", tags=["Classes"])
api_router.include_router(fee_charges.router, prefix="/fee-charges", tags=["Fee Charges"])
api_router.include_router(payments.router, prefix="/payments", tags=["Payments"])
api_router.include_router(expenses.router, prefix="/expenses", tags=["Expenses"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])
api_router.include_router(exams.router, prefix="/exams", tags=["Exams"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(import_data.router, prefix="/import", tags=["Import"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
api_router.include_router(support.router, prefix="/support", tags=["Support"])
