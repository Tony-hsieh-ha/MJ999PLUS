# Vercel 環境變數設定指南

## 必要的環境變數

### 1. LINE Login 相關

```
LINE_CHANNEL_ID=2004473747
LINE_CHANNEL_SECRET=your_line_channel_secret_here
```

**取得方式：**
1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 登入您的 LINE 帳號
3. 建立新的 Provider 或選擇現有的
4. 建立新的 Channel，選擇 "LINE Login"
5. 在 Channel 設定頁面找到：
   - Channel ID (複製到 LINE_CHANNEL_ID)
   - Channel Secret (複製到 LINE_CHANNEL_SECRET)

### 2. LINE Notify 相關 (可選)

```
LINE_NOTIFY_TOKEN=your_line_notify_token_here
```

**取得方式：**
1. 前往 [LINE Notify](https://notify-bot.line.me/)
2. 登入您的 LINE 帳號
3. 產生 Access Token
4. 複製 Token 到 LINE_NOTIFY_TOKEN

### 3. Firebase 相關 (可選，如需資料庫功能)

```
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
FIREBASE_APP_ID=your_app_id_here
FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

**取得方式：**
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案
3. 在專案設定中找到 Firebase 配置
4. 複製所有設定值

## Vercel 後台設定步驟

### 1. 登入 Vercel
- 前往 [vercel.com](https://vercel.com)
- 登入您的帳號

### 2. 選擇您的專案
- 在 Dashboard 中找到 "MJ999 智能配對系統" 專案
- 點擊進入專案頁面

### 3. 設定環境變數
- 點擊 "Settings" 標籤
- 在左側選單中點擊 "Environment Variables"
- 點擊 "Add New" 按鈕

### 4. 新增環境變數
逐一新增以下變數：

**LINE_CHANNEL_ID**
- Name: `LINE_CHANNEL_ID`
- Value: `2004473747`
- Environment: `Production`, `Preview`, `Development` (全選)

**LINE_CHANNEL_SECRET**
- Name: `LINE_CHANNEL_SECRET`
- Value: `your_line_channel_secret_here` (替換為實際值)
- Environment: `Production`, `Preview`, `Development` (全選)

**LINE_NOTIFY_TOKEN** (可選)
- Name: `LINE_NOTIFY_TOKEN`
- Value: `your_line_notify_token_here` (替換為實際值)
- Environment: `Production`, `Preview`, `Development` (全選)

### 5. 重新部署
- 設定完成後，點擊 "Redeploy" 按鈕
- 或前往 "Deployments" 頁面手動重新部署

## LINE Login 回調 URL 設定

在 LINE Developers Console 中，需要設定正確的回調 URL：

```
https://your-domain.vercel.app/line-login.html
```

**注意：**
- 將 `your-domain` 替換為您的實際 Vercel 域名
- 確保回調 URL 與部署的 URL 完全一致
- 不要對 URL 中的冒號 (:) 和斜線 (/) 進行編碼

## 安全注意事項

1. **永遠不要將敏感資料提交到 Git**
2. **只在 Vercel 後台設定環境變數**
3. **定期更換 LINE Channel Secret**
4. **在生產環境中使用 HTTPS**
5. **考慮使用 Vercel 的 Edge Function 來處理敏感的 API 調用**

## 測試步驟

1. 設定完成後，重新部署專案
2. 開啟您的 Vercel 應用程式
3. 點擊 "使用 LINE 登入"
4. 確認能正常重定向到 LINE 授權頁面
5. 確認登入後能正常返回並顯示用戶資訊

## 故障排除

### 常見錯誤

1. **400 Bad Request**
   - 檢查 redirectUri 是否正確
   - 確認沒有對 URL 進行編碼

2. **Invalid client_id**
   - 檢查 LINE_CHANNEL_ID 是否正確

3. **Invalid client_secret**
   - 檢查 LINE_CHANNEL_SECRET 是否正確

4. **redirect_uri_mismatch**
   - 檢查 LINE Developers Console 中的回調 URL 設定

### 除錯方法

1. 開啟瀏覽器開發者工具
2. 查看 Console 錯誤訊息
3. 檢查 Network 標籤中的 API 請求
4. 確認環境變數是否正確載入

## 聯絡支援

如遇到問題，請：
1. 檢查上述設定是否正確
2. 查看 Vercel 部署日誌
3. 檢查 LINE Developers Console 設定
4. 聯繫開發團隊協助
