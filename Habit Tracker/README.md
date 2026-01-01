# 习惯追踪应用 (Habit Tracker)

一个完整的习惯追踪应用，包含 React Native + Expo 前端和 Node.js + Express + MongoDB 后端。

## 项目结构

```
Habit Tracker/
├── backend/          # 后端服务器
│   ├── models/       # Mongoose 数据模型
│   ├── routes/       # API 路由
│   ├── middleware/   # 认证中间件
│   └── server.js     # 服务器入口
├── frontend/         # React Native 前端
│   ├── screens/      # 页面组件
│   ├── context/      # Context API
│   ├── services/     # API 服务
│   └── App.js        # 应用入口
└── README.md
```

## 功能特性

### 前端功能
- ✅ 用户注册/登录
- ✅ Token 自动保存与验证
- ✅ 习惯列表展示
- ✅ 创建新习惯
- ✅ 习惯详情页面
- ✅ 今日打卡功能
- ✅ 连续天数统计
- ✅ 删除习惯
- ✅ 个人资料页面
- ✅ 设置页面

### 后端功能
- ✅ 用户注册/登录 + JWT 认证
- ✅ 习惯 CRUD 操作
- ✅ 打卡功能（Check-in）
- ✅ 打卡历史记录
- ✅ 数据统计 API

## 技术栈

### 后端
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs (密码加密)

### 前端
- React Native
- Expo
- React Navigation (Stack & Tab Navigator)
- AsyncStorage (本地存储)
- Axios (HTTP 请求)

## 安装与运行

### 后端设置

1. 进入后端目录：
```bash
cd backend
```

2. 安装依赖：
```bash
npm install
```

3. 创建 `.env` 文件（参考 `.env.example`）：
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=your-secret-key-change-in-production
```

4. 确保 MongoDB 正在运行

5. 启动服务器：
```bash
npm run dev
```

服务器将在 `http://localhost:3000` 运行

### 前端设置

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 修改 API 地址（如需要）：
   - 编辑 `frontend/context/AuthContext.js` 和 `frontend/services/api.js`
   - 将 `API_BASE_URL` 改为你的后端地址
   - 如果使用真实设备，请使用你的电脑 IP 地址（例如：`http://192.168.1.100:3000`）

4. 启动 Expo：
```bash
npm start
```

5. 在 Expo Go 应用中扫描二维码，或在模拟器中运行

## API 文档

### 认证 API

#### POST /auth/register
注册新用户

请求体：
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username"
}
```

#### POST /auth/login
用户登录

请求体：
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

响应：
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username"
  }
}
```

#### GET /auth/me
获取当前用户信息（需要 Authorization header）

### 习惯 API

#### POST /habits/create
创建新习惯（需要认证）

请求体：
```json
{
  "name": "习惯名称",
  "description": "描述",
  "color": "#4CAF50",
  "icon": "⭐"
}
```

#### GET /habits
获取当前用户所有习惯（需要认证）

查询参数：
- `sort=streak` - 按连续天数排序
- `sort=recent` - 按创建时间排序

#### GET /habits/:id
获取习惯详情（需要认证）

#### PUT /habits/:id
更新习惯（需要认证）

#### DELETE /habits/:id
删除习惯（需要认证）

### 打卡 API

#### POST /habits/:id/checkin
今日打卡（需要认证）

#### GET /habits/:id/checkins
获取打卡记录（需要认证）

### 统计 API

#### GET /stats/overview
获取统计数据（需要认证）

响应：
```json
{
  "totalHabits": 5,
  "totalCheckins": 42,
  "longestStreak": 12
}
```

## 数据库模型

### User
- username: String
- email: String (唯一)
- password: String (加密)
- createdAt: Date

### Habit
- userId: ObjectId (引用 User)
- name: String
- description: String
- color: String
- icon: String
- startDate: Date
- streak: Number
- totalCompletions: Number
- createdAt: Date

### Checkin
- habitId: ObjectId (引用 Habit)
- userId: ObjectId (引用 User)
- date: Date

## 开发注意事项

1. **后端 API 地址**：如果使用真实设备测试，需要将 API 地址改为你的电脑 IP 地址
2. **MongoDB**：确保 MongoDB 服务正在运行
3. **JWT Secret**：在生产环境中，请使用强密码作为 JWT_SECRET
4. **CORS**：后端已配置 CORS，允许前端跨域请求

## 许可证

MIT




