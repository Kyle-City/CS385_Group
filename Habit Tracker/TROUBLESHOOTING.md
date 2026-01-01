# 故障排除指南

## 常见问题及解决方案

### 后端问题

#### 1. MongoDB 连接错误

**错误信息**：`MongoDB connection error`

**解决方案**：
- 确保 MongoDB 服务正在运行
- 检查 `.env` 文件中的 `MONGODB_URI` 是否正确
- 如果使用本地 MongoDB：`mongodb://localhost:27017/habit-tracker`
- 如果使用 MongoDB Atlas，确保：
  - IP 地址已添加到白名单
  - 用户名和密码正确
  - 连接字符串格式正确

#### 2. 端口已被占用

**错误信息**：`Port 3000 is already in use`

**解决方案**：
- 修改 `.env` 文件中的 `PORT` 为其他端口（如 3001）
- 相应地更新前端的 API 地址配置

#### 3. JWT Secret 未设置

**警告**：使用默认的 fallback-secret

**解决方案**：
- 在 `.env` 文件中设置 `JWT_SECRET` 为强密码
- 生产环境必须使用强密码

#### 4. 依赖安装失败

**解决方案**：
- 确保 Node.js 版本 >= 14
- 删除 `node_modules` 和 `package-lock.json`
- 运行 `npm install` 重新安装

### 前端问题

#### 1. 无法连接到后端 API

**错误信息**：`Network Error` 或 `Connection refused`

**解决方案**：
- 确保后端服务器正在运行（`npm run dev`）
- 检查 API 地址配置：
  - 模拟器/模拟器：`http://localhost:3000`
  - 真实设备：使用电脑的 IP 地址（如 `http://192.168.1.100:3000`）
- 检查设备/模拟器与电脑是否在同一网络
- 如果使用真实设备，检查防火墙设置

#### 2. Token 无效错误

**错误信息**：`Token is not valid`

**解决方案**：
- 退出登录后重新登录
- 检查后端的 `JWT_SECRET` 是否已更改
- 清除应用的 AsyncStorage 数据（卸载重装或清除应用数据）

#### 3. Expo 启动失败

**错误信息**：`Expo CLI error`

**解决方案**：
- 确保已安装 Expo CLI：`npm install -g expo-cli`
- 或使用 npx：`npx expo start`
- 检查 Node.js 版本是否兼容

#### 4. 依赖安装失败

**解决方案**：
- 确保 Node.js 版本兼容（建议 14-18）
- 删除 `node_modules` 和 `package-lock.json`
- 运行 `npm install` 重新安装
- 如果使用 yarn：`yarn install`

#### 5. 导航错误

**错误信息**：`Navigation error` 或页面无法跳转

**解决方案**：
- 确保所有导航依赖已正确安装
- 检查 `package.json` 中的依赖版本是否兼容
- 重启 Expo 开发服务器

### 数据库问题

#### 1. 数据不显示

**解决方案**：
- 检查数据库连接是否正常
- 使用 MongoDB Compass 或其他工具查看数据是否存在
- 检查用户 ID 是否匹配（确保登录的用户与数据所有者一致）

#### 2. 打卡记录重复

**解决方案**：
- 检查 Checkin 模型的唯一索引是否正常工作
- 后端已有检查机制防止同一天重复打卡
- 如果问题持续，可以手动清理数据库

### 开发环境问题

#### 1. 热重载不工作

**解决方案**：
- 重启开发服务器
- 清除 Expo 缓存：`expo start -c`
- 重新安装依赖

#### 2. 代码更改不生效

**解决方案**：
- 重启开发服务器
- 清除缓存
- 检查是否有编译错误

### 生产环境部署建议

#### 后端
- 使用环境变量管理敏感信息
- 设置强 JWT_SECRET
- 使用 MongoDB Atlas 或其他云数据库
- 配置 CORS 白名单
- 使用 HTTPS
- 添加错误日志记录

#### 前端
- 配置正确的 API 地址
- 处理网络错误和超时
- 添加错误边界
- 优化图片和资源大小

## 调试技巧

### 后端调试
1. 使用 `console.log` 记录关键信息
2. 使用 Postman 或类似工具测试 API
3. 检查服务器日志
4. 使用 MongoDB Compass 查看数据库

### 前端调试
1. 使用 React Native Debugger
2. 查看 Expo 开发工具的控制台
3. 使用 `console.log` 记录状态和错误
4. 检查 Network 请求是否成功

## 获取帮助

如果以上方案都无法解决问题：
1. 检查错误日志的完整信息
2. 确认所有依赖版本是否兼容
3. 查看项目的 GitHub Issues（如果有）
4. 检查 Expo 和 React Navigation 的官方文档




