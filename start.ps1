Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " JalVigyan - Household Water Consumption & Leak Sentinel (SC-06)" -ForegroundColor Cyan
Write-Host " ANAVANDI 2026 Selection Round Prototype" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting backend on http://localhost:8085 ..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host ""

& "$PSScriptRoot\server.exe"
