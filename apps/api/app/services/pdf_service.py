import io
from typing import Dict
from datetime import datetime


async def generate_monthly_report_html(
    institute_data: Dict,
    financial_data: Dict,
    student_data: Dict,
    attendance_data: Dict,
    academic_data: Dict,
    month: str,
) -> str:
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Monthly Report - {month}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; color: #333; }}
            h1 {{ color: #1a54e1; border-bottom: 2px solid #1a54e1; padding-bottom: 10px; }}
            h2 {{ color: #333; margin-top: 30px; }}
            table {{ width: 100%; border-collapse: collapse; margin: 15px 0; }}
            th, td {{ border: 1px solid #ddd; padding: 10px; text-align: left; }}
            th {{ background-color: #f5f5f5; font-weight: bold; }}
            .kpi {{ display: inline-block; width: 22%; margin: 1%; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center; }}
            .kpi-value {{ font-size: 24px; font-weight: bold; color: #1a54e1; }}
            .kpi-label {{ font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <h1>Monthly Management Report - {month}</h1>
        <p>Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M')}</p>

        <h2>Executive Summary</h2>
        <div class="kpi">
            <div class="kpi-label">Total Students</div>
            <div class="kpi-value">{student_data.get('total', 0)}</div>
        </div>
        <div class="kpi">
            <div class="kpi-label">Monthly Revenue</div>
            <div class="kpi-value">LKR {financial_data.get('revenue', 0):,.0f}</div>
        </div>
        <div class="kpi">
            <div class="kpi-label">Collection Rate</div>
            <div class="kpi-value">{financial_data.get('collection_rate', 0):.1f}%</div>
        </div>
        <div class="kpi">
            <div class="kpi-label">Attendance Rate</div>
            <div class="kpi-value">{attendance_data.get('average_rate', 0):.1f}%</div>
        </div>

        <h2>Financial Performance</h2>
        <p>Revenue details will be populated with actual data.</p>

        <h2>Student Growth & Retention</h2>
        <p>Student metrics will be populated with actual data.</p>

        <h2>Attendance Analysis</h2>
        <p>Attendance analysis will be populated with actual data.</p>

        <h2>Academic Performance</h2>
        <p>Academic metrics will be populated with actual data.</p>

        <h2>Recommendations</h2>
        <p>Recommendations will be generated based on analytics.</p>
    </body>
    </html>
    """
    return html


async def render_pdf(html_content: str) -> bytes:
    # TODO: Integrate WeasyPrint
    return html_content.encode("utf-8")
