# MJ999 智能配對系統

一個基於 LINE Login 的麻將智能配對平台，採用黑金風格設計。

## 功能特色

- 🔐 **LINE Login 整合**: 使用 LINE Login v2.1 安全登入
- 📝 **智能報名系統**: 支援多時段報名 (30分鐘/10人桌, 60分鐘/20人桌)
- 👥 **一鍵配對**: 自動配對並透過 LINE Notify 發送通知
- 👤 **玩家管理**: 管理員可查看報名清單、手動新增/刪除玩家
- 🎨 **黑金風格 UI**: 現代化的漸變設計與動畫效果
- 📱 **響應式設計**: 完美支援桌面與行動裝置

## 檔案結構

```
MJ999PLUS/
├── index.html          # 主頁面 - 玩家報名介面
├── line-login.html     # LINE 登入跳轉頁
├── script.js          # 前端邏輯
├── style.css          # 黑金風格 UI 設計
├── vercel.json        # Vercel 部署設定
└── README.md          # 說明文件
```

## 部署設定

### Vercel 部署

1. 將所有檔案上傳至 Vercel
2. 設定環境變數：
   - `LINE_CHANNEL_ID`: 您的 LINE Channel ID
   - `LINE_CHANNEL_SECRET`: 您的 LINE Channel Secret
   - `LINE_NOTIFY_TOKEN`: LINE Notify Token (可選)

### LINE Login 設定

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 建立新的 Channel (Login)
3. 設定 Callback URL: `https://your-domain.vercel.app/line-login.html`
4. 取得 Channel ID 和 Channel Secret

### 重要設定

**避免 400 Error 的關鍵設定**:
- `line-login.html` 中的 `redirectUri` 必須嚴格等於您的 Vercel 網址
- 使用 `window.location.origin + '/'` 動態獲取，避免手動 URL 編碼
- 絕對禁止對網址中的冒號 (:) 和斜線 (/) 進行編碼

## 使用說明

### 玩家操作流程

1. 開啟網站首頁
2. 點擊「使用 LINE 登入」
3. 授權 LINE 帳號登入
4. 選擇報名時段 (30/10 或 60/20)
5. 完成報名

### 管理員操作

1. 使用管理員 LINE 帳號登入
2. 自動顯示管理後台
3. 查看報名清單
4. 手動新增/刪除玩家
5. 執行一鍵配對

## 技術規格

- **前端**: 純 HTML5, CSS3, JavaScript (ES6+)
- **後端**: Vercel Static Hosting
- **認證**: LINE Login v2.1
- **通知**: LINE Notify API
- **儲存**: LocalStorage (開發階段)
- **部署**: Vercel Platform

## 瀏覽器支援

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 開發說明

### 本地開發

```bash
# 使用任何靜態伺服器
npx serve .
# 或
python -m http.server 8000
```

### 自訂設定

1. 修改 `script.js` 中的管理員 ID 清單
2. 調整 `style.css` 中的主題色彩
3. 更新 `index.html` 中的應用程式資訊

## 安全注意事項

- 所有 LINE API 調用應在後端進行
- 前端僅用於開發測試
- 生產環境需實作適當的驗證機制
- 建議使用 HTTPS 確保資料傳輸安全

## 授權

MIT License

## 支援

如有問題，請聯繫開發團隊。
