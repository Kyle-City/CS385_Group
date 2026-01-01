# 测试 MongoDB 连接和 API

Write-Host "测试服务器连接..." -ForegroundColor Cyan

# 测试注册端点
$body = @{
    email = "test@example.com"
    password = "123456"
    username = "testuser"
} | ConvertTo-Json

try {
    Write-Host "尝试注册测试用户..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ 注册成功！MongoDB 连接正常" -ForegroundColor Green
    Write-Host "Token: $($response.token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host "用户: $($response.user.username) ($($response.user.email))" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 409) {
        Write-Host "⚠️ 用户已存在（这是正常的，说明数据库连接正常）" -ForegroundColor Yellow
    } else {
        Write-Host "❌ 错误: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "响应详情: $responseBody" -ForegroundColor Red
        }
    }
}




