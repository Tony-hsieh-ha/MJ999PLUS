// 緊急修復版本 - 絕對能解除載入狀態
console.log('🚨 EMERGENCY SCRIPT LOADED');

// 立即執行 - 不等 DOM
(function() {
    console.log('🚨 EMERGENCY: 立即檢查載入狀態');
    
    // 嘗試立即隱藏載入
    function forceHideLoading() {
        try {
            const loading = document.getElementById('loading');
            if (loading) {
                loading.style.display = 'none';
                loading.classList.add('hidden');
                loading.style.visibility = 'hidden';
                loading.style.opacity = '0';
                console.log('🚨 EMERGENCY: 載入動畫已強制隱藏');
            }
            
            // 確保登入區域顯示
            const loginSection = document.getElementById('login-section');
            if (loginSection) {
                loginSection.style.display = 'block';
                loginSection.classList.remove('hidden');
                loginSection.style.visibility = 'visible';
                loginSection.style.opacity = '1';
                console.log('🚨 EMERGENCY: 登入區域已強制顯示');
            }
            
            // 確保登入按鈕可用
            const loginBtn = document.getElementById('line-login-btn');
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.style.display = 'block';
                loginBtn.style.visibility = 'visible';
                console.log('🚨 EMERGENCY: 登入按鈕已強制啟用');
            }
            
            // 隱藏用戶區域
            const userSection = document.getElementById('user-section');
            if (userSection) {
                userSection.classList.add('hidden');
                userSection.style.display = 'none';
            }
            
        } catch (error) {
            console.error('🚨 EMERGENCY ERROR:', error);
        }
    }
    
    // 立即嘗試一次
    forceHideLoading();
    
    // 500ms 後再嘗試
    setTimeout(forceHideLoading, 500);
    
    // 1秒後再嘗試
    setTimeout(forceHideLoading, 1000);
    
    // 2秒後再嘗試
    setTimeout(forceHideLoading, 2000);
    
    // 3秒後最終嘗試
    setTimeout(() => {
        console.log('🚨 EMERGENCY: 最終強制解除');
        forceHideLoading();
        
        // 直接操作 DOM 強制顯示
        document.body.innerHTML += `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: #1a1a1a; color: #FFD700; padding: 20px; border-radius: 10px; 
                        border: 2px solid #FFD700; z-index: 9999; text-align: center;">
                <h2>MJ999 智能配對系統</h2>
                <button onclick="window.location.href='line-login.html'" 
                        style="background: #00C300; color: white; padding: 10px 20px; 
                               border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                    使用 LINE 登入
                </button>
            </div>
        `;
    }, 3000);
})();

console.log('🚨 EMERGENCY SCRIPT SETUP COMPLETE');
