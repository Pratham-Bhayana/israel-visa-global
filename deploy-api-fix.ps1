# Deploy Production API Fix
# PowerShell script to commit and push the API URL fixes to trigger Netlify rebuild

Write-Host "🚀 Deploying Production API Connection Fix" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check git status
Write-Host "📋 Checking git status..." -ForegroundColor Yellow
git status --short
Write-Host ""

# Add all changes
Write-Host "➕ Adding changes..." -ForegroundColor Yellow
git add frontend/src/admin/pages/Users.js
git add frontend/src/admin/pages/VisaTypes.js
git add frontend/netlify.toml
git add PRODUCTION_API_FIX.md
git add deploy-api-fix.sh
git add deploy-api-fix.ps1
Write-Host "✅ Changes staged" -ForegroundColor Green
Write-Host ""

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
$commitMessage = @"
Fix: Replace hardcoded localhost URLs with environment variables

- Fixed Users.js to use REACT_APP_API_URL environment variable
- Fixed VisaTypes.js to use REACT_APP_API_URL environment variable
- Enhanced Netlify configuration for production context
- Added PRODUCTION_API_FIX.md documentation

This resolves ERR_CONNECTION_REFUSED errors in production admin panel
where visa types and users were not loading due to hardcoded localhost:5000 URLs.
"@
git commit -m $commitMessage
Write-Host "✅ Changes committed" -ForegroundColor Green
Write-Host ""

# Push to remote
Write-Host "🔄 Pushing to remote repository..." -ForegroundColor Yellow
git push origin main
Write-Host "✅ Changes pushed" -ForegroundColor Green
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ Deployment initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Wait for Netlify to rebuild (2-3 minutes)" -ForegroundColor White
Write-Host "2. Check Netlify deployment log for any errors" -ForegroundColor White
Write-Host "3. Test admin panel visa types page" -ForegroundColor White
Write-Host "4. Test admin panel users page" -ForegroundColor White
Write-Host ""
Write-Host "Monitor deployment at: https://app.netlify.com" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
