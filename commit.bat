@echo off
echo MJ999 智能配對系統 - Git 提交腳本
echo.

REM 檢查是否為 Git 倉庫
if not exist ".git" (
    echo 初始化 Git 倉庫...
    git init
    echo.
)

REM 添加所有變更
echo 添加檔案變更...
git add .
echo.

REM 檢查是否有變更
git diff --staged --quiet
if %errorlevel% equ 0 (
    echo 沒有檔案變更需要提交
    echo.
    pause
    exit /b 0
)

REM 提交變更
echo 提交變更...
git commit -m "Fix: 修復載入卡住問題並改用模擬登入

問題修復：
- 修復 script.js 初始化時卡在載入狀態的問題
- 移除前端 LINE API 調用，改用模擬登入邏輯
- 確保 showInitialView() 正確隱藏載入動畫

變更內容：
- 修改 init() 方法執行順序
- line-login.html 改用模擬用戶資料
- 移除 getAccessToken() 和 getUserProfile() 函數
- 新增 commit.bat 腳本

測試：
- 頁面應立即顯示登入按鈕
- LINE 登入流程使用模擬資料
- 不再卡在載入狀態"

if %errorlevel% neq 0 (
    echo 提交失敗！
    pause
    exit /b 1
)

echo.
echo 變更已提交完成！
echo.
echo 下一步：
echo 1. 推送到遠端倉庫: git push origin main
echo 2. 前往 Vercel 重新部署
echo.
echo 重要：請確保已在 Vercel 設定環境變數
echo.
pause
