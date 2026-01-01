@echo off
echo ========================================
echo 降级到 Expo SDK 52
echo ========================================
echo.

echo 步骤 1: 删除 node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo node_modules 已删除
) else (
    echo node_modules 不存在，跳过
)

echo.
echo 步骤 2: 删除 package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo package-lock.json 已删除
) else (
    echo package-lock.json 不存在，跳过
)

echo.
echo 步骤 3: 删除 .expo 缓存...
if exist .expo (
    rmdir /s /q .expo
    echo .expo 已删除
) else (
    echo .expo 不存在，跳过
)

echo.
echo 步骤 4: 重新安装依赖（这可能需要几分钟）...
call npm install

echo.
echo ========================================
echo 安装完成！
echo ========================================
echo.
echo 现在可以运行: npx expo start --clear
echo.
pause


