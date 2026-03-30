// MJ999 智能配對系統 - 主要 JavaScript

class MJ999System {
    constructor() {
        this.currentUser = null;
        this.players = [];
        this.isAdmin = false;
        this.lineCode = null;
        
        this.init();
    }

    async init() {
        try {
            console.log('MJ999 初始化開始...');
            
            // 初始化事件監聽器
            this.initEventListeners();
            console.log('事件監聽器初始化完成');
            
            // 檢查是否有已登入用戶
            this.checkExistingUser();
            console.log('用戶狀態檢查完成');
            
            // 立即顯示登入按鈕，避免卡在載入狀態
            this.showInitialView();
            console.log('初始畫面顯示完成');
            
            // 異步載入資料，不阻塞 UI
            Promise.all([
                this.checkLineCallback().catch(err => {
                    console.error('LINE 登入回調檢查失敗:', err);
                    // 不拋出錯誤，讓系統繼續運行
                }),
                this.loadPlayers().catch(err => {
                    console.error('玩家資料載入失敗:', err);
                    // 不拋出錯誤，讓系統繼續運行
                })
            ]).catch(error => {
                console.error('載入資料時發生錯誤:', error);
            }).finally(() => {
                console.log('異步載入完成');
                // 如果有登入用戶，更新報名狀態
                if (this.currentUser) {
                    this.updateRegistrationStatus();
                }
            });
            
            console.log('MJ999 初始化完成');
        } catch (error) {
            console.error('MJ999 初始化過程中發生嚴重錯誤:', error);
            
            // 確保即使初始化失敗也要顯示基本 UI
            try {
                this.showLoading(false);
                const loginSection = document.getElementById('login-section');
                if (loginSection) {
                    loginSection.classList.remove('hidden');
                    loginSection.classList.add('visible');
                }
                
                const loginBtn = document.getElementById('line-login-btn');
                if (loginBtn) {
                    loginBtn.disabled = false;
                }
                
                this.showMessage('系統初始化部分功能可能受限，但您可以繼續使用', 'info');
            } catch (uiError) {
                console.error('UI 恢復也失敗了:', uiError);
            }
        }
    }

    // 檢查 LINE 登入回調
    async checkLineCallback() {
        const userData = sessionStorage.getItem('line_user_data');
        
        if (userData) {
            this.showLoading(true);
            try {
                const parsedData = JSON.parse(userData);
                this.setCurrentUser(parsedData);
                this.showMessage('登入成功！歡迎 ' + parsedData.displayName, 'success');
            } catch (error) {
                console.error('LINE 登入處理失敗:', error);
                this.showMessage('登入失敗: ' + error.message, 'error');
            } finally {
                this.showLoading(false);
                // 清除 sessionStorage
                sessionStorage.removeItem('line_user_data');
            }
        }
    }

    // 處理 LINE 登入
    async processLineLogin(code, state) {
        // 模擬 API 調用 - 實際應用中需要呼叫 LINE API
        // 這裡先返回模擬資料
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    userId: 'U' + Math.random().toString(36).substr(2, 9),
                    displayName: 'LINE 用戶 ' + Math.floor(Math.random() * 1000),
                    pictureUrl: 'https://via.placeholder.com/80'
                });
            }, 1000);
        });
    }

    // 初始化事件監聽器
    initEventListeners() {
        // LINE 登入按鈕
        document.getElementById('line-login-btn').addEventListener('click', () => {
            this.redirectToLineLogin();
        });

        // 報名按鈕
        document.querySelectorAll('.btn-register').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const timeSlot = e.target.dataset.time;
                this.handleRegistration(timeSlot);
            });
        });

        // 管理員按鈕
        document.getElementById('view-players-btn')?.addEventListener('click', () => {
            this.togglePlayersList();
        });

        document.getElementById('add-player-btn')?.addEventListener('click', () => {
            this.showAddPlayerDialog();
        });

        document.getElementById('match-players-btn')?.addEventListener('click', () => {
            this.handleMatchPlayers();
        });
    }

    // 重定向到 LINE 登入
    redirectToLineLogin() {
        const lineLoginUrl = 'line-login.html';
        window.location.href = lineLoginUrl;
    }

    // 設置當前用戶
    setCurrentUser(userData) {
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        this.updateUserDisplay();
        this.showRegistrationSection();
    }

    // 檢查已存在的用戶
    checkExistingUser() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.updateUserDisplay();
                this.showRegistrationSection();
            } catch (error) {
                console.error('載入用戶資料失敗:', error);
                localStorage.removeItem('currentUser');
            }
        }
    }

    // 更新用戶顯示
    updateUserDisplay() {
        if (!this.currentUser) return;

        document.getElementById('user-name').textContent = this.currentUser.displayName;
        document.getElementById('user-id').textContent = 'ID: ' + this.currentUser.userId;
        document.getElementById('user-avatar').src = this.currentUser.pictureUrl || 'https://via.placeholder.com/80';
        
        // 檢查是否為管理員
        this.checkAdminStatus();
    }

    // 檢查管理員狀態
    checkAdminStatus() {
        // 簡單的管理員檢查邏輯
        const adminIds = ['admin123', 'manager456']; // 實際應用中應該從後端獲取
        this.isAdmin = adminIds.includes(this.currentUser.userId);
        
        if (this.isAdmin) {
            this.showAdminSection();
        }
    }

    // 顯示初始畫面
    showInitialView() {
        try {
            console.log('顯示初始畫面開始...');
            
            // 確保載入動畫隱藏
            this.showLoading(false);
            
            // 確保登入按鈕可用
            const loginBtn = document.getElementById('line-login-btn');
            if (loginBtn) {
                loginBtn.disabled = false;
                console.log('登入按鈕已啟用');
            } else {
                console.warn('找不到登入按鈕元素');
            }
            
            if (this.currentUser) {
                console.log('顯示已登入用戶畫面');
                document.getElementById('login-section').classList.add('hidden');
                document.getElementById('user-section').classList.remove('hidden');
            } else {
                console.log('顯示登入畫面');
                document.getElementById('login-section').classList.remove('hidden');
                document.getElementById('user-section').classList.add('hidden');
            }
            
            // 添加動畫效果
            setTimeout(() => {
                try {
                    document.querySelectorAll('.section:not(.hidden)').forEach(section => {
                        section.classList.add('visible');
                    });
                    console.log('動畫效果添加完成');
                } catch (animError) {
                    console.error('添加動畫效果失敗:', animError);
                }
            }, 100);
            
            console.log('初始畫面顯示完成');
        } catch (error) {
            console.error('顯示初始畫面失敗:', error);
            
            // 強制顯示登入區域
            try {
                const loading = document.getElementById('loading');
                if (loading) loading.classList.add('hidden');
                
                const loginSection = document.getElementById('login-section');
                if (loginSection) {
                    loginSection.classList.remove('hidden');
                    loginSection.classList.add('visible');
                }
                
                const userSection = document.getElementById('user-section');
                if (userSection) {
                    userSection.classList.add('hidden');
                }
                
                const loginBtn = document.getElementById('line-login-btn');
                if (loginBtn) {
                    loginBtn.disabled = false;
                }
            } catch (forceError) {
                console.error('強制恢復UI也失敗:', forceError);
            }
        }
    }

    // 顯示報名區域
    showRegistrationSection() {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('user-section').classList.remove('hidden');
        document.getElementById('registration-section').classList.remove('hidden');
        
        // 更新報名狀態
        this.updateRegistrationStatus();
        
        // 添加動畫
        setTimeout(() => {
            document.getElementById('registration-section').classList.add('visible');
        }, 100);
    }

    // 顯示管理員區域
    showAdminSection() {
        document.getElementById('admin-section').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('admin-section').classList.add('visible');
        }, 100);
    }

    // 處理報名
    async handleRegistration(timeSlot) {
        if (!this.currentUser) {
            this.showMessage('請先登入', 'error');
            return;
        }

        this.showLoading(true);
        
        try {
            // 檢查是否已報名
            const existingRegistration = this.players.find(p => 
                p.userId === this.currentUser.userId && p.timeSlot === timeSlot
            );

            if (existingRegistration) {
                this.showMessage('您已報名此時段', 'info');
                return;
            }

            // 新增報名
            const registration = {
                id: Date.now().toString(),
                userId: this.currentUser.userId,
                displayName: this.currentUser.displayName,
                pictureUrl: this.currentUser.pictureUrl,
                timeSlot: timeSlot,
                registrationTime: new Date().toISOString()
            };

            this.players.push(registration);
            await this.savePlayers();
            
            this.showMessage(`成功報名 ${timeSlot} 時段`, 'success');
            this.updateRegistrationStatus();
            
        } catch (error) {
            console.error('報名失敗:', error);
            this.showMessage('報名失敗: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 更新報名狀態
    updateRegistrationStatus() {
        if (!this.currentUser) return;

        document.querySelectorAll('.time-slot').forEach(slot => {
            const timeSlot = slot.dataset.time;
            const isRegistered = this.players.some(p => 
                p.userId === this.currentUser.userId && p.timeSlot === timeSlot
            );
            
            const btn = slot.querySelector('.btn-register');
            const statusIndicator = slot.querySelector('.status-indicator');
            
            if (isRegistered) {
                btn.textContent = '已報名';
                btn.disabled = true;
                statusIndicator.textContent = '已報名';
                statusIndicator.className = 'status-indicator registered';
            } else {
                btn.textContent = '報名';
                btn.disabled = false;
                statusIndicator.textContent = '可報名';
                statusIndicator.className = 'status-indicator available';
            }
        });
    }

    // 載入玩家資料
    async loadPlayers() {
        try {
            const savedPlayers = localStorage.getItem('players');
            if (savedPlayers) {
                this.players = JSON.parse(savedPlayers);
            }
        } catch (error) {
            console.error('載入玩家資料失敗:', error);
            this.players = [];
        }
    }

    // 儲存玩家資料
    async savePlayers() {
        try {
            localStorage.setItem('players', JSON.stringify(this.players));
        } catch (error) {
            console.error('儲存玩家資料失敗:', error);
            throw error;
        }
    }

    // 切換玩家清單顯示
    togglePlayersList() {
        const playersList = document.getElementById('players-list');
        playersList.classList.toggle('hidden');
        
        if (!playersList.classList.contains('hidden')) {
            this.displayPlayers();
        }
    }

    // 顯示玩家清單
    displayPlayers() {
        const container = document.getElementById('players-container');
        container.innerHTML = '';

        if (this.players.length === 0) {
            container.innerHTML = '<p style="text-align: center; opacity: 0.7;">暫無報名玩家</p>';
            return;
        }

        // 按時段分組
        const groupedPlayers = this.players.reduce((groups, player) => {
            if (!groups[player.timeSlot]) {
                groups[player.timeSlot] = [];
            }
            groups[player.timeSlot].push(player);
            return groups;
        }, {});

        // 顯示各時段的玩家
        Object.keys(groupedPlayers).forEach(timeSlot => {
            const groupDiv = document.createElement('div');
            groupDiv.innerHTML = `<h4 style="color: #FFD700; margin: 20px 0 10px 0;">${timeSlot} 時段 (${groupedPlayers[timeSlot].length}人)</h4>`;
            
            groupedPlayers[timeSlot].forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'player-item';
                playerDiv.innerHTML = `
                    <div class="player-info">
                        <img src="${player.pictureUrl || 'https://via.placeholder.com/40'}" alt="${player.displayName}" class="player-avatar">
                        <div class="player-details">
                            <h4>${player.displayName}</h4>
                            <p>ID: ${player.userId} | 報名時間: ${new Date(player.registrationTime).toLocaleString('zh-TW')}</p>
                        </div>
                    </div>
                    <div class="player-actions">
                        <button class="btn btn-remove" onclick="mj999.removePlayer('${player.id}')">移除</button>
                    </div>
                `;
                groupDiv.appendChild(playerDiv);
            });
            
            container.appendChild(groupDiv);
        });
    }

    // 移除玩家
    async removePlayer(playerId) {
        if (!confirm('確定要移除此玩家嗎？')) return;

        this.showLoading(true);
        
        try {
            this.players = this.players.filter(p => p.id !== playerId);
            await this.savePlayers();
            this.displayPlayers();
            this.showMessage('玩家已移除', 'success');
            
            // 如果移除的是當前用戶，更新報名狀態
            if (this.currentUser) {
                this.updateRegistrationStatus();
            }
        } catch (error) {
            console.error('移除玩家失敗:', error);
            this.showMessage('移除失敗: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 顯示新增玩家對話框
    showAddPlayerDialog() {
        const name = prompt('請輸入玩家名稱:');
        if (!name) return;

        const userId = prompt('請輸入玩家 ID:');
        if (!userId) return;

        const timeSlot = prompt('請選擇時段 (30/10 或 60/20):');
        if (!timeSlot || !['30/10', '60/20'].includes(timeSlot)) {
            this.showMessage('時段輸入錯誤', 'error');
            return;
        }

        this.addManualPlayer(name, userId, timeSlot);
    }

    // 手動新增玩家
    async addManualPlayer(name, userId, timeSlot) {
        this.showLoading(true);
        
        try {
            const player = {
                id: Date.now().toString(),
                userId: userId,
                displayName: name,
                pictureUrl: 'https://via.placeholder.com/80',
                timeSlot: timeSlot,
                registrationTime: new Date().toISOString()
            };

            this.players.push(player);
            await this.savePlayers();
            
            this.showMessage('玩家新增成功', 'success');
            this.displayPlayers();
        } catch (error) {
            console.error('新增玩家失敗:', error);
            this.showMessage('新增失敗: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 處理配對
    async handleMatchPlayers() {
        this.showLoading(true);
        
        try {
            // 按時段分組
            const groupedPlayers = this.players.reduce((groups, player) => {
                if (!groups[player.timeSlot]) {
                    groups[player.timeSlot] = [];
                }
                groups[player.timeSlot].push(player);
                return groups;
            }, {});

            let matchResults = [];
            
            // 為每個時段進行配對
            Object.keys(groupedPlayers).forEach(timeSlot => {
                const players = groupedPlayers[timeSlot];
                const maxPlayers = timeSlot === '30/10' ? 10 : 20;
                
                if (players.length >= maxPlayers) {
                    // 簡單配對邏輯：取前 maxPlayers 名玩家
                    const matchedPlayers = players.slice(0, maxPlayers);
                    matchResults.push({
                        timeSlot: timeSlot,
                        players: matchedPlayers,
                        tableId: 'Table_' + Date.now()
                    });
                }
            });

            if (matchResults.length > 0) {
                // 發送 LINE Notify 通知（模擬）
                await this.sendLineNotify(matchResults);
                this.showMessage(`配對成功！共 ${matchResults.length} 桌`, 'success');
            } else {
                this.showMessage('人數不足，無法配對', 'info');
            }
            
        } catch (error) {
            console.error('配對失敗:', error);
            this.showMessage('配對失敗: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 發送 LINE Notify 通知（模擬）
    async sendLineNotify(matchResults) {
        // 實際應用中需要呼叫 LINE Notify API
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('LINE Notify 通知已發送:', matchResults);
                resolve();
            }, 1000);
        });
    }

    // 顯示載入動畫
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    // 顯示訊息
    showMessage(text, type = 'info') {
        const message = document.getElementById('message');
        message.textContent = text;
        message.className = `message ${type}`;
        message.classList.remove('hidden');

        // 3秒後自動隱藏
        setTimeout(() => {
            message.classList.add('hidden');
        }, 3000);
    }
}

// 初始化系統
let mj999;
let forceLoadTimeout;

// 強制載入機制 - 3秒後強制隱藏載入動畫
forceLoadTimeout = setTimeout(() => {
    console.warn('強制載入機制觸發：3秒內未完成初始化，強制顯示UI');
    const loading = document.getElementById('loading');
    if (loading && !loading.classList.contains('hidden')) {
        loading.classList.add('hidden');
    }
    
    // 確保登入按鈕可用
    const loginBtn = document.getElementById('line-login-btn');
    if (loginBtn && loginBtn.disabled) {
        loginBtn.disabled = false;
        console.log('登入按鈕已強制啟用');
    }
    
    // 確保登入區域顯示
    const loginSection = document.getElementById('login-section');
    if (loginSection && loginSection.classList.contains('hidden')) {
        loginSection.classList.remove('hidden');
        loginSection.classList.add('visible');
        console.log('登入區域已強制顯示');
    }
}, 3000);

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('MJ999 系統初始化開始...');
        mj999 = new MJ999System();
        
        // 清除強制載入超時
        clearTimeout(forceLoadTimeout);
        console.log('MJ999 系統初始化完成');
    } catch (error) {
        console.error('MJ999 系統初始化失敗:', error);
        
        // 即使初始化失敗也要確保 UI 可用
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
        
        const loginBtn = document.getElementById('line-login-btn');
        if (loginBtn) {
            loginBtn.disabled = false;
        }
        
        const loginSection = document.getElementById('login-section');
        if (loginSection) {
            loginSection.classList.remove('hidden');
            loginSection.classList.add('visible');
        }
        
        // 顯示錯誤訊息但不阻止操作
        const message = document.getElementById('message');
        if (message) {
            message.textContent = '系統初始化部分功能可能受限，但您可以繼續使用';
            message.className = 'message info';
            message.classList.remove('hidden');
        }
    }
});
