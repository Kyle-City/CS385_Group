# 快速启动指南

## 前提条件

- Node.js (v14 或更高版本)
- MongoDB (本地运行或使用 MongoDB Atlas)
- Expo CLI (可选，用于前端开发)

## 后端启动步骤

1. 进入后端目录：
```bash
cd backend
```

2. 安装依赖：
```bash
npm install
```

3. 创建 `.env` 文件（参考 `backend/ENV_SETUP.md`）：
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

## 前端启动步骤

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 配置 API 地址：
   - 如果使用模拟器：保持 `http://localhost:3000`
   - 如果使用真实设备：修改 `frontend/context/AuthContext.js` 和 `frontend/services/api.js` 中的 `API_BASE_URL` 为你的电脑 IP 地址
   - 例如：`http://192.168.1.100:3000`

4. 启动 Expo：
```bash
npm start
```

5. 使用 Expo Go 应用扫描二维码，或按 `a` 在 Android 模拟器中运行，按 `i` 在 iOS 模拟器中运行

## 测试账户

首次使用需要注册账户：
1. 打开应用
2. 点击"还没有账户？点击注册"
3. 填写用户名、邮箱和密码（至少6个字符）
4. 注册成功后自动登录

## 功能测试

1. **创建习惯**：
   - 在主页点击右下角的 "+" 按钮
   - 输入习惯名称、描述
   - 选择颜色和图标
   - 点击"创建习惯"

2. **打卡**：
   - 在主页点击习惯卡片上的"打卡"按钮
   - 或在习惯详情页点击"今日打卡"

3. **查看统计**：
   - 在"我的"标签页查看总习惯数、总打卡数、最长连续天数

## 常见问题

### 前端无法连接到后端

- 确保后端服务器正在运行
- 检查 API 地址配置是否正确
- 如果使用真实设备，确保设备与电脑在同一网络

### MongoDB 连接错误

- 确保 MongoDB 服务正在运行
- 检查 `.env` 文件中的 `MONGODB_URI` 是否正确
- 如果使用 MongoDB Atlas，确保 IP 地址在白名单中

### 端口已被占用

- 修改 `.env` 文件中的 `PORT` 值
- 相应地更新前端的 API 地址配置




