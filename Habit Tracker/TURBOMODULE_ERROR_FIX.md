# TurboModuleRegistry/PlatformConstants 错误修复

## 错误信息
```
Invariant Violation: TurboModuleRegistry.getEnforcing(.): 'PlatformConstants' could not be found
```

## 原因
这个错误通常在 Expo SDK 升级后出现，主要是由于：
1. 缓存问题
2. Expo Go 应用和开发服务器之间的连接问题
3. 依赖版本不匹配

## 解决方案

### 方法 1: 清除缓存并重新启动（推荐）

```powershell
cd "D:\Habit Tracker\frontend"
npx expo start --clear
```

这会将清除所有缓存并重新启动开发服务器。

### 方法 2: 在 Expo Go 应用中重新加载

1. 在手机上打开 Expo Go 应用
2. 摇一摇手机（或按设备菜单键）
3. 选择 "Reload" 或 "重新加载"

### 方法 3: 完全清除并重新安装

如果方法 1 和 2 都不行，尝试完全清理：

```powershell
cd "D:\Habit Tracker\frontend"

# 停止所有 Expo 进程
# 在运行 npm start 的终端按 Ctrl+C

# 删除 node_modules 和缓存
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse .expo -ErrorAction SilentlyContinue

# 重新安装
npm install

# 清除缓存启动
npx expo start --clear
```

### 方法 4: 检查 Expo Go 应用版本

确保你的 Expo Go 应用是最新版本：
- **iOS**: App Store → 更新 Expo Go
- **Android**: Google Play → 更新 Expo Go

### 方法 5: 使用不同的连接方式

如果仍然有问题，尝试使用隧道模式：

```powershell
npx expo start --tunnel
```

这会创建一个可以通过互联网访问的连接，有时可以解决连接问题。

## 常见情况

### 如果你刚刚升级了 Expo SDK

1. 确保 Expo Go 应用已更新到最新版本（SDK 54）
2. 清除缓存：`npx expo start --clear`
3. 重新扫描二维码连接

### 如果错误持续出现

1. 完全删除 `node_modules` 和 `.expo` 目录
2. 重新运行 `npm install`
3. 使用 `npx expo start --clear` 启动

## 验证修复

修复后，应用应该能够：
- ✅ 正常加载
- ✅ 显示登录界面
- ✅ 没有 TurboModuleRegistry 错误

## 注意事项

- 这个错误通常不影响应用的核心功能，但可能导致某些特性无法使用
- 如果错误只在特定功能出现，可能是该功能的依赖问题
- 确保所有依赖都已更新到与 SDK 54 兼容的版本



