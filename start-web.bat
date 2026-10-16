@echo off
title Ceyora Tuition BI Platform
echo ============================================================
echo   CEYORA TUITION BI & OPERATIONS PLATFORM
echo   Starting Next.js Frontend Development Server...
echo ============================================================
echo.
cd /d "%~dp0apps\web"
echo Ready at http://localhost:3000
echo.
call npm run dev
