# 项目结构说明

## 目录结构

```
Habit Tracker/
├── backend/                      # 后端服务器
│   ├── models/                   # Mongoose 数据模型
│   │   ├── User.js              # 用户模型
│   │   ├── Habit.js             # 习惯模型
│   │   └── Checkin.js           # 打卡记录模型
│   ├── routes/                   # API 路由
│   │   ├── auth.js              # 认证路由（注册/登录）
│   │   ├── habits.js            # 习惯管理路由
│   │   └── stats.js             # 统计路由
│   ├── middleware/               # 中间件
│   │   └── auth.js              # JWT 认证中间件
│   ├── server.js                # 服务器入口文件
│   ├── package.json             # 后端依赖配置
│   └── ENV_SETUP.md             # 环境变量配置说明
│
├── frontend/                     # React Native 前端
│   ├── screens/                  # 页面组件
│   │   ├── LoginScreen.js       # 登录页面
│   │   ├── RegisterScreen.js    # 注册页面
│   │   ├── HomeScreen.js        # 主页（习惯列表）
│   │   ├── CreateHabitScreen.js # 创建习惯页面
│   │   ├── HabitDetailScreen.js # 习惯详情页面
│   │   ├── ProfileScreen.js     # 个人资料页面
│   │   └── SettingsScreen.js    # 设置页面
│   ├── context/                  # Context API
│   │   └── AuthContext.js       # 认证状态管理
│   ├── services/                 # API 服务
│   │   └── api.js               # Axios 配置
│   ├── assets/                   # 资源文件
│   │   └── README.md            # 资源文件说明
│   ├── App.js                   # 应用入口文件
│   ├── app.json                 # Expo 配置
│   ├── babel.config.js          # Babel 配置
│   └── package.json             # 前端依赖配置
│
├── README.md                     # 项目说明文档
├── QUICK_START.md               # 快速启动指南
├── PROJECT_CHECKLIST.md         # 功能检查清单
├── TROUBLESHOOTING.md           # 故障排除指南
├── PROJECT_STRUCTURE.md         # 项目结构说明（本文件）
└── .gitignore                   # Git 忽略文件配置
```

## 后端架构

### 技术栈
- **Node.js** - 运行时环境
- **Express.js** - Web 框架
- **MongoDB** - 数据库
- **Mongoose** - ODM（对象文档映射）
- **JWT** - 身份认证
- **bcryptjs** - 密码加密

### API 端点

#### 认证 API (`/auth`)
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `GET /auth/me` - 获取当前用户信息

#### 习惯 API (`/habits`)
- `POST /habits/create` - 创建习惯
- `GET /habits` - 获取所有习惯（支持排序）
- `GET /habits/:id` - 获取习惯详情
- `PUT /habits/:id` - 更新习惯
- `DELETE /habits/:id` - 删除习惯
- `POST /habits/:id/checkin` - 打卡
- `GET /habits/:id/checkins` - 获取打卡记录

#### 统计 API (`/stats`)
- `GET /stats/overview` - 获取统计数据

## 前端架构

### 技术栈
- **React Native** - 跨平台移动应用框架
- **Expo** - React Native 开发工具链
- **React Navigation** - 导航库
- **AsyncStorage** - 本地存储
- **Axios** - HTTP 客户端
- **Context API** - 状态管理

### 页面结构

#### 认证流程
1. **App.js** → 检查 token
2. 如果有 token → **MainTabs**（主页）
3. 如果没有 token → **AuthStack**（登录/注册）

#### 主应用流程
- **HomeScreen** - 习惯列表，快速打卡
- **CreateHabitScreen** - 创建新习惯
- **HabitDetailScreen** - 查看习惯详情和打卡记录
- **ProfileScreen** - 查看个人资料和统计数据
- **SettingsScreen** - 应用设置

### 导航结构

```
NavigationContainer
└── Stack Navigator
    ├── Auth Stack (未登录)
    │   ├── Login Screen
    │   └── Register Screen
    └── Main Stack (已登录)
        ├── Main Tabs
        │   ├── Home Tab
        │   ├── Profile Tab
        │   └── Settings Tab
        ├── Create Habit Screen
        └── Habit Detail Screen
```

## 数据流

### 认证流程
1. 用户注册/登录 → 后端验证 → 返回 JWT token
2. Token 保存到 AsyncStorage
3. 所有 API 请求在 Header 中携带 token
4. 后端验证 token → 返回数据

### 习惯管理流程
1. 用户创建习惯 → POST `/habits/create`
2. 显示习惯列表 → GET `/habits`
3. 查看详情 → GET `/habits/:id`
4. 打卡 → POST `/habits/:id/checkin` → 更新 streak 和 totalCompletions

## 安全特性

1. **密码加密** - 使用 bcryptjs 加密存储
2. **JWT 认证** - 无状态的 token 认证
3. **中间件保护** - 所有受保护的路由都需要认证
4. **数据验证** - 前后端都进行数据验证
5. **错误处理** - 统一的错误响应格式

## 开发工作流

### 后端开发
1. 修改代码
2. Nodemon 自动重启
3. 测试 API（使用 Postman 或类似工具）

### 前端开发
1. 修改代码
2. Expo 热重载
3. 在模拟器或真实设备上查看效果

## 部署建议

### 后端部署
- 使用 PM2 或类似工具管理进程
- 配置环境变量
- 使用 MongoDB Atlas 或类似云服务
- 配置 HTTPS
- 设置 CORS 白名单

### 前端部署
- 使用 Expo 的构建服务
- 配置生产环境的 API 地址
- 优化资源文件大小
- 测试不同设备和操作系统




