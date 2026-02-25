#!/bin/bash

# Deploy Production API Fix
# This script commits and pushes the API URL fixes to trigger Netlify rebuild

echo "🚀 Deploying Production API Connection Fix"
echo "=========================================="
echo ""

# Check git status
echo "📋 Checking git status..."
git status --short
echo ""

# Add all changes
echo "➕ Adding changes..."
git add frontend/src/admin/pages/Users.js
git add frontend/src/admin/pages/VisaTypes.js
git add frontend/netlify.toml
git add PRODUCTION_API_FIX.md
echo "✅ Changes staged"
echo ""

# Commit changes
echo "💾 Committing changes..."
git commit -m "Fix: Replace hardcoded localhost URLs with environment variables

- Fixed Users.js to use REACT_APP_API_URL environment variable
- Fixed VisaTypes.js to use REACT_APP_API_URL environment variable
- Enhanced Netlify configuration for production context
- Added PRODUCTION_API_FIX.md documentation

This resolves ERR_CONNECTION_REFUSED errors in production admin panel
where visa types and users were not loading due to hardcoded localhost:5000 URLs."
echo "✅ Changes committed"
echo ""

# Push to remote
echo "🔄 Pushing to remote repository..."
git push origin main
echo "✅ Changes pushed"
echo ""

echo "=========================================="
echo "✅ Deployment initiated!"
echo ""
echo "Next steps:"
echo "1. Wait for Netlify to rebuild (2-3 minutes)"
echo "2. Check Netlify deployment log for any errors"
echo "3. Test admin panel visa types page"
echo "4. Test admin panel users page"
echo ""
echo "Monitor deployment at: https://app.netlify.com"
echo "=========================================="
