# 清理缓存 - 命令提示符（CMD）版本

## 如果你使用的是命令提示符（CMD）

在 CMD 中使用以下命令：

### 方法 1: 清除缓存并重新启动（推荐）

```cmd
cd D:\Habit Tracker\frontend
npx expo start --clear
```

### 方法 2: 完全清理（在 CMD 中）

```cmd
cd D:\Habit Tracker\frontend

REM 删除 node_modules 文件夹
rmdir /s /q node_modules

REM 删除 package-lock.json
del package-lock.json

REM 删除 .expo 文件夹（如果存在）
rmdir /s /q .expo

REM 重新安装依赖
npm install

REM 清除缓存启动
npx expo start --clear
```

## 如果你使用的是 PowerShell

使用以下命令：

```powershell
cd "D:\Habit Tracker\frontend"

Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse .expo -ErrorAction SilentlyContinue

npm install
npx expo start --clear
```

## 快速修复（最简单）

如果只是想解决 TurboModule 错误，最简单的方法是：

```cmd
cd D:\Habit Tracker\frontend
npx expo start --clear
```

这通常就足够了！



