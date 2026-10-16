from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_tickets():
    return {"message": "Support tickets endpoint - TODO", "data": []}


@router.post("/")
async def create_ticket():
    return {"message": "Create support ticket endpoint - TODO"}


@router.get("/{ticket_id}")
async def get_ticket(ticket_id: str):
    return {"message": f"Ticket {ticket_id} endpoint - TODO"}


@router.put("/{ticket_id}")
async def update_ticket(ticket_id: str):
    return {"message": f"Update ticket {ticket_id} endpoint - TODO"}
