from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_expenses():
    return {"message": "Expenses endpoint - TODO", "data": []}


@router.post("/")
async def create_expense():
    return {"message": "Add expense endpoint - TODO"}


@router.get("/{expense_id}")
async def get_expense(expense_id: str):
    return {"message": f"Expense {expense_id} endpoint - TODO"}
