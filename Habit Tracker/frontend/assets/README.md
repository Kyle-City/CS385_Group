# 资源文件说明

这个目录用于存放应用的图标和启动画面资源。

## 必需的文件（可选）

以下文件在 `app.json` 中被引用，但在开发阶段不是必需的。如果你需要自定义图标，可以添加以下文件：

- `icon.png` - 应用图标（1024x1024px）
- `splash.png` - 启动画面（1242x2436px 或类似尺寸）
- `adaptive-icon.png` - Android 自适应图标（1024x1024px）
- `favicon.png` - Web 图标（48x48px）

如果不提供这些文件，Expo 会使用默认图标和启动画面，应用仍然可以正常运行。

## 生成资源文件

你可以使用以下工具生成这些资源：
- [Expo Asset Generator](https://www.favicon-generator.org/)
- [App Icon Generator](https://appicon.co/)

或者使用 Expo 的 CLI 工具：
```bash
npx expo install @expo/configure-splash-screen
```




