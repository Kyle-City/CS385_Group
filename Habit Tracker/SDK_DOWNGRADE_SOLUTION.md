# 降级到 SDK 52 解决方案

## 问题说明

PlatformConstants 错误在 SDK 54 中是一个已知的严重问题，影响了应用的正常运行。降级到 SDK 52（更稳定的版本）是一个可靠的解决方案。

## 降级步骤

### 1. 停止当前运行的 Expo 服务器

在运行 `npm start` 的终端按 `Ctrl + C`

### 2. 更新 package.json

将以下依赖版本改为 SDK 52 兼容的版本：

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "react": "18.3.1",
    "react-native": "0.76.2",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/stack": "^6.4.1",
    "@react-navigation/bottom-tabs": "^6.6.1",
    "react-native-screens": "~4.2.0",
    "react-native-safe-area-context": "4.12.0",
    "@react-native-async-storage/async-storage": "2.1.0",
    "expo-status-bar": "~2.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "babel-preset-expo": "^11.0.0"
  }
}
```

### 3. 删除并重新安装依赖

```cmd
cd D:\Habit Tracker\frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

### 4. 更新 app.json

确保 app.json 中的 SDK 版本配置正确（通常不需要修改）

### 5. 重新启动

```cmd
npx expo start --clear
```

## 注意事项

- SDK 52 是一个更稳定、经过充分测试的版本
- 确保 Expo Go 应用支持 SDK 52（大多数版本都支持）
- 如果 Expo Go 提示版本不匹配，可能需要安装支持 SDK 52 的版本



