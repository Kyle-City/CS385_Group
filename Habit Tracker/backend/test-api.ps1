# API 测试脚本
# 用于测试后端 API 是否正常工作

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  后端 API 测试脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$apiUrl = "http://10.132.100.124:3000"

Write-Host "1. 测试服务器是否运行 (localhost)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/me" -Method GET -ErrorAction Stop
    Write-Host "   ❌ 不应该成功（需要认证）" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 403) {
        Write-Host "   ✅ 服务器运行正常（返回认证错误是正常的）" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  服务器响应: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "2. 测试网络访问 (10.132.100.124)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$apiUrl/auth/me" -Method GET -ErrorAction Stop
    Write-Host "   ❌ 不应该成功（需要认证）" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 403) {
        Write-Host "   ✅ 网络访问正常（返回认证错误是正常的）" -ForegroundColor Green
    } elseif ($_.Exception.Message -like "*无法连接*" -or $_.Exception.Message -like "*refused*") {
        Write-Host "   ❌ 无法连接到服务器" -ForegroundColor Red
        Write-Host "      请确保服务器监听 0.0.0.0 而不是 localhost" -ForegroundColor Yellow
    } else {
        Write-Host "   ⚠️  错误: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "3. 测试注册 API..." -ForegroundColor Yellow
$testEmail = "test_$(Get-Date -Format 'yyyyMMddHHmmss')@test.com"
$testPassword = "123456"
$testUsername = "testuser_$(Get-Date -Format 'HHmmss')"

$registerBody = @{
    email = $testEmail
    password = $testPassword
    username = $testUsername
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -Body $registerBody -ContentType "application/json" -ErrorAction Stop
    $result = $response.Content | ConvertFrom-Json
    Write-Host "   ✅ 注册成功！" -ForegroundColor Green
    Write-Host "      用户: $testUsername" -ForegroundColor Gray
    Write-Host "      邮箱: $testEmail" -ForegroundColor Gray
    Write-Host "      Token: $($result.token.Substring(0, 20))..." -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "4. 测试登录 API..." -ForegroundColor Yellow
    $loginBody = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
        $loginResult = $loginResponse.Content | ConvertFrom-Json
        Write-Host "   ✅ 登录成功！" -ForegroundColor Green
        Write-Host "      用户: $($loginResult.user.username)" -ForegroundColor Gray
    } catch {
        Write-Host "   ❌ 登录失败: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorContent = $_.Exception.Response | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
        Write-Host "   ❌ 注册失败: HTTP $statusCode" -ForegroundColor Red
        
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            $errorObj = $responseBody | ConvertFrom-Json
            Write-Host "      错误信息: $($errorObj.message)" -ForegroundColor Yellow
        } catch {
            Write-Host "      无法解析错误信息" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ❌ 注册失败: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan





