#!/bin/bash

# MJ999 智能配對系統 - 部署腳本

echo "🚀 MJ999 智能配對系統 - 開始部署..."

# 檢查是否為 Git 倉庫
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 倉庫..."
    git init
    git add .
    git commit -m "Initial commit: MJ999 智能配對系統"
    echo "✅ Git 倉庫初始化完成"
else
    echo "📦 Git 倉庫已存在"
fi

# 檢查是否有遠端倉庫
if ! git remote | grep -q origin; then
    echo "🔗 請新增遠端倉庫："
    echo "   git remote add origin <您的 GitHub 倉庫 URL>"
    echo "   例如: git remote add origin https://github.com/username/MJ999PLUS.git"
    exit 1
fi

# 添加所有變更
echo "📝 添加檔案變更..."
git add .

# 檢查是否有變更
if git diff --staged --quiet; then
    echo "ℹ️  沒有檔案變更需要提交"
else
    # 提交變更
    echo "💾 提交變更..."
    git commit -m "Update: 修復載入問題並優化 LINE 登入流程

- 修復 script.js 初始化時卡在載入狀態的問題
- 優化 LINE 登入回調處理邏輯
- 新增環境變數設定指南
- 確保頁面能立即顯示登入按鈕

Changes:
- 修改 init() 方法，先顯示 UI 再異步載入資料
- 更新 line-login.html 處理真實 LINE API 調用
- 新增 ENV_SETUP.md 詳細說明文件
- 新增 deploy.sh 部署腳本"
fi

# 推送到遠端倉庫
echo "📤 推送到遠端倉庫..."
git push origin main

echo "✅ 部署完成！"
echo ""
echo "📋 下一步："
echo "1. 前往 Vercel 後台設定環境變數"
echo "2. 查看 ENV_SETUP.md 了解詳細設定步驟"
echo "3. 重新部署 Vercel 專案"
echo ""
echo "🔗 重要連結："
echo "- LINE Developers: https://developers.line.biz/"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- LINE Notify: https://notify-bot.line.me/"
