# Ceyora API Documentation

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

All endpoints (except `/auth/login`) require a Bearer token:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Auth
- `POST /auth/login` - Login and get tokens
- `GET /auth/me` - Get current user

### Institutes
- `GET /institutes/` - List institutes
- `POST /institutes/` - Create institute
- `GET /institutes/{id}` - Get institute
- `PUT /institutes/{id}` - Update institute

### Teachers
- `GET /teachers/` - List teachers
- `POST /teachers/` - Create teacher
- `GET /teachers/{id}` - Get teacher

### Students
- `GET /students/` - List students
- `POST /students/` - Create student
- `GET /students/{id}` - Get student

### Classes
- `GET /classes/` - List classes
- `POST /classes/` - Create class
- `GET /classes/{id}` - Get class

### Fee Charges
- `GET /fee-charges/` - List fee charges
- `POST /fee-charges/` - Create fee charge

### Payments
- `GET /payments/` - List payments
- `POST /payments/` - Record payment

### Expenses
- `GET /expenses/` - List expenses
- `POST /expenses/` - Add expense

### Attendance
- `GET /attendance/` - List attendance
- `POST /attendance/scan` - Record QR scan
- `POST /attendance/sync` - Sync offline scans

### Exams
- `GET /exams/` - List exams
- `POST /exams/` - Create exam
- `POST /exams/{id}/results` - Submit results

### Analytics
- `GET /analytics/overview` - Overview metrics
- `GET /analytics/financial` - Financial analytics
- `GET /analytics/student` - Student analytics
- `GET /analytics/class` - Class analytics
- `GET /analytics/academic` - Academic analytics

### Dashboard
- `GET /dashboard/` - Dashboard metrics

### Reports
- `GET /reports/` - List reports
- `POST /reports/monthly` - Generate monthly report

### Import
- `POST /import/csv` - Import CSV
- `POST /import/excel` - Import Excel

### Recommendations
- `GET /recommendations/` - List recommendations
- `GET /recommendations/alerts` - List alerts

### Settings
- `GET /settings/` - Get settings
- `PUT /settings/` - Update settings

### Support
- `GET /support/` - List tickets
- `POST /support/` - Create ticket
