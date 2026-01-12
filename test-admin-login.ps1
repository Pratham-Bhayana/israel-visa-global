# Test Admin Login on Railway
$BASE_URL = "https://israel-visa-global-production.up.railway.app/api"

Write-Host "`n🔍 Testing Authentication System...`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "1️⃣ Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BASE_URL/health" -Method Get
    Write-Host "✅ Health Check: " -ForegroundColor Green -NoNewline
    Write-Host ($health | ConvertTo-Json -Compress)
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Test 2: Auth System Status
Write-Host "2️⃣ Testing Auth System Status..." -ForegroundColor Yellow
try {
    $authTest = Invoke-RestMethod -Uri "$BASE_URL/auth/test" -Method Get
    Write-Host "✅ Auth System Status:" -ForegroundColor Green
    Write-Host ($authTest | ConvertTo-Json -Depth 3)
    
    if (-not $authTest.status.jwtSecretConfigured) {
        Write-Host "`n⚠️  WARNING: JWT_SECRET is NOT configured on Railway!" -ForegroundColor Red
        Write-Host "   This will cause login to fail." -ForegroundColor Red
        Write-Host "   Please set JWT_SECRET in Railway environment variables." -ForegroundColor Yellow
    }
    
    if ($authTest.status.adminUsers -eq 0) {
        Write-Host "`n⚠️  WARNING: No admin users found in database!" -ForegroundColor Red
    } else {
        Write-Host "`n✅ Found $($authTest.status.adminUsers) admin user(s)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Auth Test Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n"

# Test 3: Try Login
Write-Host "3️⃣ Testing Login with Admin Credentials...`n" -ForegroundColor Yellow

$credentials = @(
    @{ name = "Rohit Dubey"; email = "rohitdubey@adminisrael.com"; password = "rohitdubey@2025" },
    @{ name = "SEO Raizing Group"; email = "seoraizinggroup@adminisrael.com"; password = "seoraizinggroup@2025" },
    @{ name = "Testing Team"; email = "testingteam@adminisrael.com"; password = "testingteam@2025" },
    @{ name = "BSR"; email = "bsr@adminisrael.com"; password = "bsr@2025" }
)

foreach ($cred in $credentials) {
    Write-Host "Testing: $($cred.name) ($($cred.email))" -ForegroundColor Cyan
    
    $body = @{
        email = $cred.email
        password = $cred.password
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" `
            -Method Post `
            -Body $body `
            -ContentType "application/json"
        
        Write-Host "✅ SUCCESS for $($cred.name)" -ForegroundColor Green
        Write-Host "   Token received: $(if($response.token) {'YES'} else {'NO'})" -ForegroundColor Green
        Write-Host "   User role: $($response.user.role)" -ForegroundColor Green
        Write-Host ""
        break  # Stop after first successful login
    } catch {
        Write-Host "❌ FAILED for $($cred.name)" -ForegroundColor Red
        Write-Host "   Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        
        if ($_.ErrorDetails.Message) {
            $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "   Message: $($errorDetails.message)" -ForegroundColor Red
            if ($errorDetails.error) {
                Write-Host "   Error: $($errorDetails.error)" -ForegroundColor Red
            }
        } else {
            Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        }
        Write-Host ""
    }
}

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Green
Write-Host ""
