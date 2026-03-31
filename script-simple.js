// 極簡版本 - 專注解決載入問題
console.log('Simple Script Loading');

// 立即隱藏載入動畫
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
        console.log('Loading hidden');
    }
}

// 顯示登入區域
function showLogin() {
    const loginSection = document.getElementById('login-section');
    if (loginSection) {
        loginSection.classList.remove('hidden');
        loginSection.classList.add('visible'); // 關鍵：添加 visible 類別
        loginSection.style.display = 'block';
        loginSection.style.opacity = '1';
        loginSection.style.transform = 'translateY(0)';
        console.log('Login section shown');
    }
    
    // 確保登入按鈕可見
    const loginBtn = document.getElementById('line-login-btn');
    if (loginBtn) {
        loginBtn.style.display = 'inline-flex';
        loginBtn.style.visibility = 'visible';
        loginBtn.disabled = false;
        console.log('Login button shown');
    }
    
    // 隱藏其他區域
    const userSection = document.getElementById('user-section');
    if (userSection) {
        userSection.classList.add('hidden');
        userSection.classList.remove('visible');
        userSection.style.display = 'none';
    }
    
    const registrationSection = document.getElementById('registration-section');
    if (registrationSection) {
        registrationSection.classList.add('hidden');
        registrationSection.classList.remove('visible');
        registrationSection.style.display = 'none';
    }
    
    const adminSection = document.getElementById('admin-section');
    if (adminSection) {
        adminSection.classList.add('hidden');
        adminSection.classList.remove('visible');
        adminSection.style.display = 'none';
    }
}

// 多重時機嘗試
hideLoading();
showLogin();

setTimeout(() => {
    hideLoading();
    showLogin();
}, 100);

setTimeout(() => {
    hideLoading();
    showLogin();
}, 1000);

setTimeout(() => {
    hideLoading();
    showLogin();
}, 3000);

console.log('Simple Script Complete');
