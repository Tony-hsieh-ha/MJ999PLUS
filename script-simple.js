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
        console.log('Login section shown');
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
