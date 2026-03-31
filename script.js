// MJ999 智能配對系統 - 主要 JavaScript

class MJ999System {
    constructor() {
        console.log('MJ999System Constructor Start');
        this.currentUser = null;
        this.players = [];
        this.isAdmin = false;
        this.lineCode = null;
        
        console.log('MJ999System Constructor: Properties initialized');
        this.init();
        console.log('MJ999System Constructor: init() called');
    }

    async init() {
        console.log('MJ999 init() Start');
        
        try {
            console.log('Step 1: 初始化事件監聽器');
            this.initEventListeners();
            console.log('Step 1 Complete: 事件監聽器初始化完成');
            
            console.log('Step 2: 檢查已登入用戶');
            this.checkExistingUser();
            console.log('Step 2 Complete: 用戶狀態檢查完成');
            
            console.log('Step 3: 顯示初始畫面');
            this.showInitialView();
            console.log('Step 3 Complete: 初始畫面顯示完成');
            
            console.log('Step 4: 異步載入資料 (不阻塞)');
            // 使用非阻塞方式載入資料
            setTimeout(() => {
                this.loadDataAsync();
            }, 100);
            
            console.log('MJ999 init() Complete: 所有同步步驟完成');
        } catch (error) {
            console.error('MJ999 init() Error:', error);
            this.handleInitError(error);
        }
    }

    loadDataAsync() {
        console.log('loadDataAsync() Start');
        
        Promise.all([
            this.checkLineCallback().catch(err => {
                console.error('LINE 登入回調檢查失敗:', err);
            }),
            this.loadPlayers().catch(err => {
                console.error('玩家資料載入失敗:', err);
            })
        ]).then(() => {
            console.log('loadDataAsync(): 所有異步載入完成');
            if (this.currentUser) {
                this.updateRegistrationStatus();
                console.log('loadDataAsync(): 報名狀態已更新');
            }
        }).catch(error => {
            console.error('loadDataAsync() Error:', error);
        });
    }

    handleInitError(error) {
        console.error('handleInitError() Start:', error);
        
        try {
            console.log('handleInitError(): 嘗試恢復基本 UI');
            const loading = document.getElementById('loading');
            if (loading) {
                loading.classList.add('hidden');
                console.log('handleInitError(): 載入動畫已隱藏');
            }
            
            const loginSection = document.getElementById('login-section');
            if (loginSection) {
                loginSection.classList.remove('hidden');
                loginSection.classList.add('visible');
                console.log('handleInitError(): 登入區域已顯示');
            }
            
            const loginBtn = document.getElementById('line-login-btn');
            if (loginBtn) {
                loginBtn.disabled = false;
                console.log('handleInitError(): 登入按鈕已啟用');
            }
            
            this.showMessage('系統初始化部分功能可能受限，但您可以繼續使用', 'info');
            console.log('handleInitError(): UI 恢復完成');
        } catch (uiError) {
            console.error('handleInitError(): UI 恢復也失敗:', uiError);
        }
    }

    // 檢查 LINE 登入回調
    async checkLineCallback() {
        console.log('checkLineCallback() Start');
        
        const userData = sessionStorage.getItem('line_user_data');
        console.log('checkLineCallback(): userData found:', !!userData);
        
        if (userData) {
            console.log('checkLineCallback(): 處理用戶資料');
            this.showLoading(true);
            
            try {
                const parsedData = JSON.parse(userData);
                console.log('checkLineCallback(): 用戶資料解析成功:', parsedData.displayName);
                
                this.setCurrentUser(parsedData);
                this.showMessage('登入成功！歡迎 ' + parsedData.displayName, 'success');
                console.log('checkLineCallback(): 用戶設置完成');
            } catch (error) {
                console.error('checkLineCallback(): 用戶資料解析失敗:', error);
                this.showMessage('登入失敗: ' + error.message, 'error');
            } finally {
                this.showLoading(false);
                sessionStorage.removeItem('line_user_data');
                console.log('checkLineCallback(): 清理完成');
            }
        } else {
            console.log('checkLineCallback(): 沒有用戶資料需要處理');
        }
    }

    // 處理 LINE 登入
    async processLineLogin(code, state) {
        console.log('processLineLogin() Start');
        // 模擬 API 調用
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData = {
                    userId: 'U' + Math.random().toString(36).substr(2, 9),
                    displayName: 'LINE 用戶 ' + Math.floor(Math.random() * 1000),
                    pictureUrl: 'https://via.placeholder.com/80'
                };
                console.log('processLineLogin(): 模擬資料生成完成');
                resolve(mockData);
            }, 1000);
        });
    }

    // 初始化事件監聽器
    initEventListeners() {
        console.log('initEventListeners() Start');
        
        try {
            // LINE 登入按鈕
            const loginBtn = document.getElementById('line-login-btn');
            if (loginBtn) {
                loginBtn.addEventListener('click', () => {
                    console.log('initEventListeners(): 登入按鈕被點擊');
                    this.redirectToLineLogin();
                });
                console.log('initEventListeners(): 登入按鈕事件綁定完成');
            } else {
                console.warn('initEventListeners(): 找不到登入按鈕');
            }

            // 登出按鈕
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    console.log('initEventListeners(): 登出按鈕被點擊');
                    this.handleLogout();
                });
                console.log('initEventListeners(): 登出按鈕事件綁定完成');
            } else {
                console.warn('initEventListeners(): 找不到登出按鈕');
            }

            // 報名按鈕
            const registerBtns = document.querySelectorAll('.btn-register');
            console.log('initEventListeners(): 找到報名按鈕數量:', registerBtns.length);
            
            registerBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    console.log('initEventListeners(): 報名按鈕被點擊');
                    const timeSlot = e.target.dataset.time;
                    this.handleRegistration(timeSlot);
                });
            });
            console.log('initEventListeners(): 報名按鈕事件綁定完成');

            // 管理員按鈕
            const viewPlayersBtn = document.getElementById('view-players-btn');
            if (viewPlayersBtn) {
                viewPlayersBtn.addEventListener('click', () => {
                    console.log('initEventListeners(): 查看玩家按鈕被點擊');
                    this.togglePlayersList();
                });
            }

            const addPlayerBtn = document.getElementById('add-player-btn');
            if (addPlayerBtn) {
                addPlayerBtn.addEventListener('click', () => {
                    console.log('initEventListeners(): 新增玩家按鈕被點擊');
                    this.showAddPlayerDialog();
                });
            }

            const matchPlayersBtn = document.getElementById('match-players-btn');
            if (matchPlayersBtn) {
                matchPlayersBtn.addEventListener('click', () => {
                    console.log('initEventListeners(): 配對按鈕被點擊');
                    this.handleMatchPlayers();
                });
            }
            
            console.log('initEventListeners(): 所有事件綁定完成');
        } catch (error) {
            console.error('initEventListeners() Error:', error);
        }
    }

    // 重定向到 LINE 登入
    redirectToLineLogin() {
        console.log('redirectToLineLogin() Start');
        const lineLoginUrl = 'line-login.html';
        console.log('redirectToLineLogin(): 重定向到', lineLoginUrl);
        window.location.href = lineLoginUrl;
    }

    // 處理登出
    handleLogout() {
        console.log('handleLogout() Start');
        
        try {
            // 清除用戶資料
            this.currentUser = null;
            this.isAdmin = false;
            
            // 清除本地儲存
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('line_user_data');
            
            console.log('handleLogout(): 用戶資料已清除');
            
            // 顯示登入畫面
            this.showLoginView();
            
            // 顯示登出成功訊息
            this.showMessage('已成功登出', 'success');
            
            console.log('handleLogout(): 登出完成');
        } catch (error) {
            console.error('handleLogout() Error:', error);
            this.showMessage('登出失敗: ' + error.message, 'error');
        }
    }

    // 顯示登入畫面
    showLoginView() {
        console.log('showLoginView() Start');
        
        try {
            // 隱載入動畫
            this.showLoading(false);
            
            // 顯示登入區域
            const loginSection = document.getElementById('login-section');
            if (loginSection) {
                loginSection.classList.remove('hidden');
                loginSection.classList.add('visible');
            }
            
            // 隱藏用戶區域
            const userSection = document.getElementById('user-section');
            if (userSection) {
                userSection.classList.add('hidden');
                userSection.classList.remove('visible');
            }
            
            // 隱藏報名區域
            const registrationSection = document.getElementById('registration-section');
            if (registrationSection) {
                registrationSection.classList.add('hidden');
                registrationSection.classList.remove('visible');
            }
            
            // 隱藏管理員區域
            const adminSection = document.getElementById('admin-section');
            if (adminSection) {
                adminSection.classList.add('hidden');
                adminSection.classList.remove('visible');
            }
            
            console.log('showLoginView(): 登入畫面顯示完成');
        } catch (error) {
            console.error('showLoginView() Error:', error);
        }
    }

    // 設置當前用戶
    setCurrentUser(userData) {
        console.log('setCurrentUser() Start:', userData.displayName);
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        this.updateUserDisplay();
        this.showRegistrationSection();
        console.log('setCurrentUser(): 用戶設置完成');
    }

    // 檢查已存在的用戶
    checkExistingUser() {
        console.log('checkExistingUser() Start');
        
        const savedUser = localStorage.getItem('currentUser');
        console.log('checkExistingUser(): 找到儲存用戶:', !!savedUser);
        
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                console.log('checkExistingUser(): 用戶資料解析成功:', this.currentUser.displayName);
                this.updateUserDisplay();
                this.showRegistrationSection();
                console.log('checkExistingUser(): 已登入用戶設置完成');
            } catch (error) {
                console.error('checkExistingUser(): 載入用戶資料失敗:', error);
                localStorage.removeItem('currentUser');
            }
        } else {
            console.log('checkExistingUser(): 沒有已儲存的用戶');
        }
    }

    // 更新用戶顯示
    updateUserDisplay() {
        console.log('updateUserDisplay() Start');
        
        if (!this.currentUser) {
            console.log('updateUserDisplay(): 沒有當前用戶');
            return;
        }

        try {
            const userName = document.getElementById('user-name');
            if (userName) {
                userName.textContent = this.currentUser.displayName;
            }

            const userId = document.getElementById('user-id');
            if (userId) {
                userId.textContent = 'ID: ' + this.currentUser.userId;
            }

            const userAvatar = document.getElementById('user-avatar');
            if (userAvatar) {
                userAvatar.src = this.currentUser.pictureUrl || 'https://via.placeholder.com/100';
            }
            
            // 更新 MJ999 風格的額外資訊
            const userFriends = document.getElementById('user-friends');
            if (userFriends && this.currentUser.friends) {
                userFriends.textContent = this.currentUser.friends;
            }
            
            const userStatusMsg = document.getElementById('user-status-msg');
            if (userStatusMsg && this.currentUser.statusMessage) {
                userStatusMsg.textContent = this.currentUser.statusMessage;
            }
            
            // 更新登出按鈕的用戶資訊
            const logoutAvatar = document.getElementById('logout-avatar');
            if (logoutAvatar) {
                logoutAvatar.src = this.currentUser.pictureUrl || 'https://via.placeholder.com/30';
            }
            
            const logoutName = document.getElementById('logout-name');
            if (logoutName) {
                logoutName.textContent = this.currentUser.displayName;
            }
            
            console.log('updateUserDisplay(): 用戶資訊顯示完成');
            
            // 檢查是否為管理員
            this.checkAdminStatus();
        } catch (error) {
            console.error('updateUserDisplay() Error:', error);
        }
    }

    // 檢查管理員狀態
    checkAdminStatus() {
        console.log('checkAdminStatus() Start');
        
        const adminIds = ['admin123', 'manager456'];
        this.isAdmin = adminIds.includes(this.currentUser.userId);
        console.log('checkAdminStatus(): 用戶是否為管理員:', this.isAdmin);
        
        if (this.isAdmin) {
            this.showAdminSection();
            console.log('checkAdminStatus(): 管理員區域已顯示');
        }
    }

    // 顯示初始畫面
    showInitialView() {
        console.log('showInitialView() Start');
        
        try {
            // 確保載入動畫隱藏
            this.showLoading(false);
            console.log('showInitialView(): 載入動畫已隱藏');
            
            // 確保登入按鈕可用
            const loginBtn = document.getElementById('line-login-btn');
            if (loginBtn) {
                loginBtn.disabled = false;
                console.log('showInitialView(): 登入按鈕已啟用');
            } else {
                console.warn('showInitialView(): 找不到登入按鈕元素');
            }
            
            if (this.currentUser) {
                console.log('showInitialView(): 顯示已登入用戶畫面');
                document.getElementById('login-section').classList.add('hidden');
                document.getElementById('user-section').classList.remove('hidden');
            } else {
                console.log('showInitialView(): 顯示登入畫面');
                document.getElementById('login-section').classList.remove('hidden');
                document.getElementById('user-section').classList.add('hidden');
            }
            
            // 添加動畫效果
            setTimeout(() => {
                try {
                    document.querySelectorAll('.section:not(.hidden)').forEach(section => {
                        section.classList.add('visible');
                    });
                    console.log('showInitialView(): 動畫效果添加完成');
                } catch (animError) {
                    console.error('showInitialView(): 添加動畫效果失敗:', animError);
                }
            }, 100);
            
            console.log('showInitialView(): 初始畫面顯示完成');
        } catch (error) {
            console.error('showInitialView() Error:', error);
            this.forceShowLogin();
        }
    }

    // 強制顯示登入介面
    forceShowLogin() {
        console.log('forceShowLogin() Start');
        
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
            
            console.log('forceShowLogin(): 強制顯示完成');
        } catch (error) {
            console.error('forceShowLogin() Error:', error);
        }
    }

    // 顯示報名區域
    showRegistrationSection() {
        console.log('showRegistrationSection() Start');
        
        try {
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('user-section').classList.remove('hidden');
            document.getElementById('registration-section').classList.remove('hidden');
            
            // 更新報名狀態
            this.updateRegistrationStatus();
            
            // 添加動畫
            setTimeout(() => {
                document.getElementById('registration-section').classList.add('visible');
            }, 100);
            
            console.log('showRegistrationSection(): 報名區域顯示完成');
        } catch (error) {
            console.error('showRegistrationSection() Error:', error);
        }
    }

    // 顯示管理員區域
    showAdminSection() {
        console.log('showAdminSection() Start');
        
        try {
            document.getElementById('admin-section').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('admin-section').classList.add('visible');
            }, 100);
            console.log('showAdminSection(): 管理員區域顯示完成');
        } catch (error) {
            console.error('showAdminSection() Error:', error);
        }
    }

    // 處理報名
    async handleRegistration(timeSlot) {
        console.log('handleRegistration() Start:', timeSlot);
        
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
            
            console.log('handleRegistration(): 報名完成');
        } catch (error) {
            console.error('handleRegistration() Error:', error);
            this.showMessage('報名失敗: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 更新報名狀態
    updateRegistrationStatus() {
        console.log('updateRegistrationStatus() Start');
        
        if (!this.currentUser) {
            console.log('updateRegistrationStatus(): 沒有當前用戶');
            return;
        }

        try {
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
            
            console.log('updateRegistrationStatus(): 報名狀態更新完成');
        } catch (error) {
            console.error('updateRegistrationStatus() Error:', error);
        }
    }

    // 載入玩家資料
    async loadPlayers() {
        console.log('loadPlayers() Start');
        
        try {
            const savedPlayers = localStorage.getItem('players');
            if (savedPlayers) {
                this.players = JSON.parse(savedPlayers);
                console.log('loadPlayers(): 載入玩家數量:', this.players.length);
            } else {
                console.log('loadPlayers(): 沒有儲存的玩家資料');
            }
        } catch (error) {
            console.error('loadPlayers() Error:', error);
            this.players = [];
        }
    }

    // 儲存玩家資料
    async savePlayers() {
        console.log('savePlayers() Start');
        
        try {
            localStorage.setItem('players', JSON.stringify(this.players));
            console.log('savePlayers(): 玩家資料儲存完成');
        } catch (error) {
            console.error('savePlayers() Error:', error);
            throw error;
        }
    }

    // 切換玩家清單顯示
    togglePlayersList() {
        console.log('togglePlayersList() Start');
        
        try {
            const playersList = document.getElementById('players-list');
            playersList.classList.toggle('hidden');
            
            if (!playersList.classList.contains('hidden')) {
                this.displayPlayers();
            }
            
            console.log('togglePlayersList(): 玩家清單切換完成');
        } catch (error) {
            console.error('togglePlayersList() Error:', error);
        }
    }

    // 顯示玩家清單
    displayPlayers() {
        console.log('displayPlayers() Start');
        
        try {
            const container = document.getElementById('players-container');
            container.innerHTML = '';

            if (this.players.length === 0) {
                container.innerHTML = '<p style="text-align: center; opacity: 0.7;">暫無報名玩家</p>';
                console.log('displayPlayers(): 沒有玩家需要顯示');
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
            
            console.log('displayPlayers(): 玩家清單顯示完成');
        } catch (error) {
            console.error('displayPlayers() Error:', error);
        }
    }

    // 移除玩家
    async removePlayer(playerId) {
        console.log('removePlayer() Start:', playerId);
        
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
            
            console.log('removePlayer(): 玩家移除完成');
        } catch (error) {
            console.error('removePlayer() Error:', error);
            this.showMessage('移除失敗: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 顯示新增玩家對話框
    showAddPlayerDialog() {
        console.log('showAddPlayerDialog() Start');
        
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
        console.log('addManualPlayer() Start:', name, userId, timeSlot);
        
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
            
            console.log('addManualPlayer(): 玩家新增完成');
        } catch (error) {
            console.error('addManualPlayer() Error:', error);
            this.showMessage('新增失敗: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 處理配對
    async handleMatchPlayers() {
        console.log('handleMatchPlayers() Start');
        
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
            
            console.log('handleMatchPlayers(): 配對處理完成');
        } catch (error) {
            console.error('handleMatchPlayers() Error:', error);
            this.showMessage('配對失敗: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 發送 LINE Notify 通知（模擬）
    async sendLineNotify(matchResults) {
        console.log('sendLineNotify() Start');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('sendLineNotify(): LINE Notify 通知已發送:', matchResults);
                resolve();
            }, 1000);
        });
    }

    // 顯示載入動畫
    showLoading(show) {
        console.log('showLoading() Start:', show);
        
        try {
            const loading = document.getElementById('loading');
            if (show) {
                loading.classList.remove('hidden');
            } else {
                loading.classList.add('hidden');
            }
            console.log('showLoading(): 載入狀態設置完成');
        } catch (error) {
            console.error('showLoading() Error:', error);
        }
    }

    // 顯示訊息
    showMessage(text, type = 'info') {
        console.log('showMessage() Start:', text, type);
        
        try {
            const message = document.getElementById('message');
            message.textContent = text;
            message.className = `message ${type}`;
            message.classList.remove('hidden');

            // 3秒後自動隱藏
            setTimeout(() => {
                message.classList.add('hidden');
            }, 3000);
            
            console.log('showMessage(): 訊息顯示完成');
        } catch (error) {
            console.error('showMessage() Error:', error);
        }
    }
}

// 初始化系統
console.log('System Initialization Start');

let mj999;

// DOM 載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded Event Fired');
    
    try {
        console.log('Creating MJ999System instance...');
        mj999 = new MJ999System();
        console.log('MJ999System instance created successfully');
    } catch (error) {
        console.error('MJ999System creation failed:', error);
        
        // 即使初始化失敗也要確保 UI 可用
        try {
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
            
            const message = document.getElementById('message');
            if (message) {
                message.textContent = '系統初始化部分功能可能受限，但您可以繼續使用';
                message.className = 'message info';
                message.classList.remove('hidden');
            }
            
            console.log('Fallback UI recovery completed');
        } catch (fallbackError) {
            console.error('Fallback UI recovery failed:', fallbackError);
        }
    }
});

console.log('System Initialization Script End');

// 強行破解載入圈圈的定時炸彈 - 最高優先權
console.log('Setting up 3-second timeout bomb...');
setTimeout(() => {
    console.log('🚀 TIMEOUT BOMB DETONATED! 強制解除載入狀態');
    
    try {
        const loading = document.getElementById('loading');
        const loginBtn = document.getElementById('line-login-btn');
        const loginSection = document.getElementById('login-section');
        
        if (loading) {
            loading.classList.add('hidden');
            console.log('💣 載入動畫已強制隱藏');
        }
        
        if (loginBtn) {
            loginBtn.disabled = false;
            console.log('💣 登入按鈕已強制啟用');
        }
        
        if (loginSection) {
            loginSection.classList.remove('hidden');
            loginSection.classList.add('visible');
            console.log('💣 登入區域已強制顯示');
        }
        
        console.log('💣💣💣 強制解除載入狀態完成！用戶應該能看到登入按鈕了！');
    } catch (bombError) {
        console.error('💣 BOMB ERROR:', bombError);
    }
}, 3000); // 3秒後沒反應就直接開門

console.log('Script End - 定時炸彈已設定，3秒後引爆');
