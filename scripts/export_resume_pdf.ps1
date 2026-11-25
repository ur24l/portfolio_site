# Regenerate public/assets/Bhargav-Sai-Bhartu-Resume.pdf from the /resume/ page (Windows, Microsoft Edge).
# 1. In another terminal:  npm run build ; npm run preview      (serves http://127.0.0.1:4321/portfolio_site/)
# 2. Then run:            .\scripts\export_resume_pdf.ps1
# 3. Open the PDF and check it is still ONE page.
param([string]$Url = "http://127.0.0.1:4321/portfolio_site/resume/")
$ErrorActionPreference = "Stop"
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
$out = Join-Path $PSScriptRoot "..\public\assets\Bhargav-Sai-Bhartu-Resume.pdf"
$profileDir = Join-Path $env:TEMP "resume-pdf-edge"
& $edge --headless=new --disable-gpu --no-first-run "--user-data-dir=$profileDir" --no-pdf-header-footer `
    --virtual-time-budget=5000 "--print-to-pdf=$out" $Url | Out-Null
Write-Host "Saved $out"
