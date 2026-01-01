# 降级到 Expo SDK 52 - 完整步骤

## ✅ package.json 已更新

`package.json` 已经更新为 SDK 52：
- `expo`: ~52.0.0
- `react-native`: 0.76.2
- `babel-preset-expo`: ~11.0.0

## 📋 执行步骤

### 方法 1: 使用脚本（推荐）

我已经创建了一个脚本文件 `downgrade_to_sdk52.cmd`，你可以直接运行：

```cmd
cd D:\Habit Tracker\frontend
downgrade_to_sdk52.cmd
```

### 方法 2: 手动执行（在 CMD 中）

```cmd
cd D:\Habit Tracker\frontend

REM 删除 node_modules
rmdir /s /q node_modules

REM 删除 package-lock.json
del package-lock.json

REM 删除 .expo 缓存（如果存在）
rmdir /s /q .expo

REM 重新安装依赖
npm install
```

### 方法 3: 在 PowerShell 中执行

```powershell
cd "D:\Habit Tracker\frontend"

Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse .expo -ErrorAction SilentlyContinue

npm install
```

## 🚀 安装完成后

### 1. 启动 Expo（清除缓存）

```cmd
cd D:\Habit Tracker\frontend
npx expo start --clear
```

### 2. 在手机上重新连接

1. **完全关闭 Expo Go 应用**
2. **清除 Expo Go 缓存**：
   - Android: 设置 → 应用 → Expo Go → 清除缓存
   - iOS: 卸载并重新安装 Expo Go
3. **重新打开 Expo Go**
4. **重新扫描二维码**

## ⚠️ 重要提示

- 确保 Expo Go 应用支持 SDK 52（大多数版本都支持）
- 如果提示版本不匹配，检查 Expo Go 应用版本
- 安装过程可能需要几分钟，请耐心等待

## ✅ 验证

安装完成后，应该能够：
- ✅ 正常启动 Expo 服务器
- ✅ 没有 SDK 版本错误
- ✅ 应用可以正常显示和运行


