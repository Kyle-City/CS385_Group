# 如何扫描二维码 - 详细指南

## 📱 找到二维码的方法

### 方法 1: 查看终端窗口（最常见）

Expo 服务器启动后，二维码会直接显示在终端窗口中。

**步骤：**
1. 找到运行 `npm start` 的终端/命令行窗口
2. 在终端输出中查找二维码（通常是一个方形的 ASCII 艺术图案）
3. 二维码通常显示在类似这样的文本之后：
   ```
   › Metro waiting on exp://...
   › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
   ```

### 方法 2: 使用 Expo 开发工具（Web 界面）

1. **打开浏览器**，访问：`http://localhost:19002`
   - 这是 Expo 的开发工具界面
   - 你会看到一个网页，上面有二维码

2. **或者访问**：`http://localhost:19000`
   - Expo 的另一种界面

### 方法 3: 使用隧道模式（推荐用于真实设备）

如果本地网络有问题，可以使用隧道模式：

1. 停止当前的 Expo 服务器（在终端按 `Ctrl+C`）

2. 重新启动，使用隧道模式：
   ```powershell
   cd "D:\Habit Tracker\frontend"
   npx expo start --tunnel
   ```

3. 这样会生成一个可以通过互联网访问的 URL 和二维码

## 📲 使用手机扫描二维码

### iOS 设备（iPhone/iPad）

**方法 A：使用相机应用（最简单）**
1. 打开 iPhone 的 **相机** 应用
2. 对准终端或网页上的二维码
3. 点击屏幕上出现的通知
4. 选择 "在 Expo Go 中打开"

**方法 B：使用 Expo Go 应用**
1. 打开 **Expo Go** 应用
2. 点击 "Scan QR code" 或 "扫描二维码"
3. 对准二维码扫描

### Android 设备

**使用 Expo Go 应用**
1. 打开 **Expo Go** 应用
2. 点击 "Scan QR code" 或 "扫描二维码" 按钮
3. 允许相机权限（如果提示）
4. 对准二维码扫描

## 🔧 如果看不到二维码怎么办？

### 选项 1: 重启 Expo 服务器（在前台运行以便查看输出）

1. 停止当前服务器：
   - 找到运行 Expo 的终端窗口
   - 按 `Ctrl + C` 停止

2. 重新启动（在前台运行）：
   ```powershell
   cd "D:\Habit Tracker\frontend"
   npm start
   ```
   这次不要后台运行，这样你可以看到完整的输出

### 选项 2: 使用 URL 直接连接

1. 在终端输出中找到类似这样的 URL：
   ```
   exp://192.168.1.100:8081
   ```
   或者
   ```
   exp://localhost:8081
   ```

2. **对于 Android**：
   - 在 Expo Go 应用中点击 "Enter URL manually"
   - 输入这个 URL

3. **对于 iOS**：
   - 在 Safari 浏览器中输入这个 URL
   - 会提示在 Expo Go 中打开

### 选项 3: 手动输入连接信息

如果二维码无法扫描，可以手动输入：

1. 查看终端输出，找到类似这样的信息：
   ```
   Metro waiting on exp://192.168.x.x:8081
   ```

2. 在 Expo Go 应用中：
   - 点击 "Enter URL manually" 或 "手动输入 URL"
   - 输入完整的 exp:// URL

## 🌐 使用网络地址（如果二维码不工作）

### 步骤 1: 查找你的电脑 IP 地址

在 PowerShell 中运行：
```powershell
ipconfig
```

查找 "IPv4 地址"，例如：`192.168.1.100`

### 步骤 2: 确保手机和电脑在同一网络

- 手机和电脑必须连接到同一个 Wi-Fi 网络
- 确保防火墙没有阻止连接

### 步骤 3: 使用 IP 地址连接

在 Expo Go 应用中输入：
```
exp://你的IP地址:8081
```
例如：`exp://192.168.1.100:8081`

## ✅ 检查清单

在扫描二维码之前，确保：

- [ ] Expo Go 应用已安装在手机上
- [ ] 手机和电脑连接到同一个 Wi-Fi 网络
- [ ] Expo 服务器正在运行（终端显示 "Metro waiting on..."）
- [ ] 防火墙允许端口 8081 的连接
- [ ] 相机权限已授予 Expo Go 应用（Android）

## 🆘 仍然无法连接？

1. **尝试使用隧道模式**（最可靠）：
   ```powershell
   npx expo start --tunnel
   ```

2. **检查防火墙设置**：
   - Windows 防火墙可能阻止了连接
   - 临时关闭防火墙测试，或添加例外规则

3. **使用 USB 连接（Android）**：
   ```powershell
   npx expo start --android
   ```
   需要先连接手机并启用 USB 调试

4. **查看详细日志**：
   在终端中会显示详细的错误信息，可以帮助诊断问题

## 💡 小贴士

- **最佳体验**：使用 Expo Go 应用扫描二维码是最简单的方法
- **网络问题**：如果二维码扫描后无法加载，尝试使用隧道模式
- **快速测试**：可以先在 Web 浏览器中测试（按 `w` 键），确保应用可以运行




