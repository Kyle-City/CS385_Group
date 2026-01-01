# 环境变量配置

在 `backend` 目录下创建 `.env` 文件，内容如下：

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=your-secret-key-change-in-production
```

## 说明

- `PORT`: 服务器端口号（默认：3000）
- `MONGODB_URI`: MongoDB 连接字符串
- `JWT_SECRET`: JWT 令牌密钥（生产环境请使用强密码）




