from typing import Dict, List, Tuple
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
import csv
import io


async def validate_csv_import(
    file_content: str,
    import_type: str,
) -> Tuple[List[Dict], List[str]]:
    errors = []
    rows = []

    try:
        reader = csv.DictReader(io.StringIO(file_content))
        for i, row in enumerate(reader, 1):
            row_errors = validate_row(row, import_type, i)
            if row_errors:
                errors.extend(row_errors)
            else:
                rows.append(row)
    except Exception as e:
        errors.append(f"Failed to parse CSV: {str(e)}")

    return rows, errors


def validate_row(row: Dict, import_type: str, row_number: int) -> List[str]:
    errors = []

    if import_type == "students":
        required = ["first_name", "last_name", "guardian_name", "guardian_phone"]
        for field in required:
            if not row.get(field):
                errors.append(f"Row {row_number}: Missing required field '{field}'")

    elif import_type == "teachers":
        required = ["first_name", "last_name", "phone"]
        for field in required:
            if not row.get(field):
                errors.append(f"Row {row_number}: Missing required field '{field}'")

    elif import_type == "classes":
        required = ["name", "subject", "teacher", "day_of_week", "time_slot", "monthly_fee"]
        for field in required:
            if not row.get(field):
                errors.append(f"Row {row_number}: Missing required field '{field}'")

    return errors


async def process_import(
    db: AsyncSession,
    institute_id: UUID,
    rows: List[Dict],
    import_type: str,
) -> Dict:
    imported = 0
    skipped = 0
    errors = []

    for row in rows:
        try:
            if import_type == "students":
                await import_student(db, institute_id, row)
            elif import_type == "teachers":
                await import_teacher(db, institute_id, row)
            elif import_type == "classes":
                await import_class(db, institute_id, row)
            imported += 1
        except Exception as e:
            errors.append(str(e))
            skipped += 1

    return {
        "imported": imported,
        "skipped": skipped,
        "errors": errors,
    }


async def import_student(db, institute_id, row):
    pass  # TODO: Implement student import


async def import_teacher(db, institute_id, row):
    pass  # TODO: Implement teacher import


async def import_class(db, institute_id, row):
    pass  # TODO: Implement class import
