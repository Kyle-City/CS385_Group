# MongoDB Atlas 连接配置

## 已配置的连接信息

你的 MongoDB Atlas 连接字符串已成功添加到 `.env` 文件中：

```
MONGODB_URI=mongodb+srv://ihaterainydayzh_db_user:ZhongChang123456@cluster0.q360t6v.mongodb.net/habit-tracker?retryWrites=true&w=majority&appName=Cluster0
```

## 配置说明

- **数据库名称**: `habit-tracker`
- **连接参数**:
  - `retryWrites=true` - 启用写入重试
  - `w=majority` - 写入确认模式
  - `appName=Cluster0` - 应用名称

## 验证连接

服务器重启后，如果 MongoDB 连接成功，你应该在服务器日志中看到：
```
MongoDB connected
Server running on port 3000
```

如果看到错误信息，可能的原因：

1. **网络访问限制**
   - 确保 MongoDB Atlas 中的 IP 白名单包含了你的当前 IP 地址
   - 或者添加 `0.0.0.0/0` 允许所有 IP（仅用于开发环境）

2. **用户名/密码错误**
   - 检查 MongoDB Atlas 中的用户凭据是否正确

3. **数据库权限**
   - 确保用户有读写权限

## 测试连接

你可以通过以下方式测试连接：

### 1. 测试 API 端点

```powershell
# 测试服务器是否运行（会返回认证错误，这是正常的）
Invoke-WebRequest -Uri http://localhost:3000/auth/me

# 注册一个测试用户
$body = @{
    email = "test@example.com"
    password = "123456"
    username = "testuser"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/auth/register -Method POST -Body $body -ContentType "application/json"
```

### 2. 使用 MongoDB Compass

1. 下载并安装 [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. 使用连接字符串连接：
   ```
   mongodb+srv://ihaterainydayzh_db_user:ZhongChang123456@cluster0.q360t6v.mongodb.net/
   ```
3. 查看是否成功连接，并检查 `habit-tracker` 数据库

## 安全提示

⚠️ **重要**: `.env` 文件包含敏感信息，请确保：

1. ✅ `.env` 文件已在 `.gitignore` 中（不会被提交到 Git）
2. ⚠️ 不要将 `.env` 文件分享给他人
3. ⚠️ 生产环境应该使用环境变量管理器（如 AWS Secrets Manager）

## 下一步

连接配置完成后，你可以：

1. 启动前端应用开始使用
2. 使用 API 测试工具（如 Postman）测试各个端点
3. 开始创建用户和习惯数据




