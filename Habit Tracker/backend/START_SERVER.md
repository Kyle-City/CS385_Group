# 启动服务器说明

## 已完成的步骤

✅ 已安装所有依赖包（npm install）
✅ 已创建 .env 文件

## 当前状态

服务器已在后台启动。如果服务器没有正常运行，可能是以下原因：

### 1. MongoDB 未运行

**检查 MongoDB 是否运行：**
```powershell
# Windows 服务检查
Get-Service MongoDB

# 或尝试连接
mongosh
```

**如果 MongoDB 未运行，需要：**

**选项 A：启动本地 MongoDB**
```powershell
# 如果是 Windows 服务
Start-Service MongoDB

# 或手动启动
mongod --dbpath "C:\data\db"
```

**选项 B：使用 MongoDB Atlas（云数据库）**
修改 `.env` 文件中的 `MONGODB_URI` 为你的 Atlas 连接字符串：
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habit-tracker
```

### 2. 端口被占用

如果 3000 端口已被占用，可以：
- 修改 `.env` 文件中的 `PORT` 为其他端口（如 3001）
- 或停止占用 3000 端口的程序

### 3. 手动启动服务器

如果需要查看详细的启动日志，可以手动启动：

```powershell
cd "D:\Habit Tracker\backend"
npm run dev
```

或直接运行：
```powershell
cd "D:\Habit Tracker\backend"
node server.js
```

## 验证服务器运行

服务器成功启动后，你应该看到：
```
MongoDB connected
Server running on port 3000
```

然后在浏览器或 Postman 中访问：
```
http://localhost:3000/auth/me
```

如果返回错误（因为未认证），说明服务器正常运行！

## 下一步

服务器运行后，你可以：

1. **启动前端应用**：
```powershell
cd "D:\Habit Tracker\frontend"
npm install
npm start
```

2. **测试 API**：
   - 使用 Postman 或类似工具
   - 或使用 curl：
   ```powershell
   # 注册用户
   curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{\"email\":\"test@test.com\",\"password\":\"123456\",\"username\":\"testuser\"}'
   ```

## 常见错误

### "MongoDB connection error"
- 确保 MongoDB 服务正在运行
- 检查 `.env` 文件中的 `MONGODB_URI` 是否正确

### "Port 3000 is already in use"
- 修改 `.env` 文件中的 `PORT` 为其他端口
- 或停止占用该端口的程序

### "nodemon not found"
- 运行 `npm install` 重新安装依赖
- 或使用 `node server.js` 而不是 `npm run dev`




