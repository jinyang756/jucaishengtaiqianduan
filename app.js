// API基础URL
// 在Vercel环境中使用相对路径，确保前后端能够正确连接
const API_BASE_URL = '';

// 通用请求函数
async function request(url, method = 'GET', data = null, headers = {}) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        // 添加token（如果存在）
        const token = localStorage.getItem('token');
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_BASE_URL}${url}`, options);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '请求失败');
        }
        
        // 处理空响应
        if (response.status === 204) {
            return {};
        }
        
        return await response.json();
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    }
}

// 错误提示函数
function showError(message) {
    alert(message);
}

// 用户服务
export const userService = {
    // 登录
    async login(username, password) {
        try {
            const data = await request('/api/users/login', 'POST', { username, password });
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            showError(error.message || '登录失败，请检查用户名和密码');
            throw error;
        }
    },
    
    // 注册
    async register(username, password, email, phone = null) {
        try {
            return await request('/api/users/register', 'POST', { username, password, email, phone });
        } catch (error) {
            showError(error.message || '注册失败，请稍后重试');
            throw error;
        }
    },
    
    // 获取当前用户信息
    async getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },
    
    // 更新用户信息
    async updateUser(userData) {
        const user = await this.getCurrentUser();
        if (!user) {
            throw new Error('用户未登录');
        }
        
        try {
            const updatedUser = await request(`/api/users/me?user_id=${user.id}`, 'PUT', userData);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            showError(error.message || '更新用户信息失败');
            throw error;
        }
    },
    
    // 登出
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    
    // 检查是否登录
    isLoggedIn() {
        return !!localStorage.getItem('token');
    }
};

// 基金服务
export const fundService = {
    // 获取基金列表
    async getFundList() {
        try {
            // 模拟数据，实际应该调用API
            return [
                {
                    id: '1',
                    name: '清洁能源基金',
                    code: 'JCFUND001',
                    returnRate: 8.65,
                    todayChange: 1.23,
                    trend: 'up',
                    category: 'energy',
                    description: '投资于太阳能、风能、水能等清洁能源领域的优质企业'
                },
                {
                    id: '2',
                    name: '环保科技基金',
                    code: 'JCFUND002',
                    returnRate: 7.32,
                    todayChange: 0.89,
                    trend: 'up',
                    category: 'technology',
                    description: '专注于环保技术研发和应用的科技企业'
                },
                {
                    id: '3',
                    name: '碳资产管理基金',
                    code: 'JCFUND003',
                    returnRate: 12.45,
                    todayChange: -0.32,
                    trend: 'down',
                    category: 'carbon',
                    description: '投资于碳交易市场和碳资产管理相关企业'
                },
                {
                    id: '4',
                    name: '绿色交通基金',
                    code: 'JCFUND004',
                    returnRate: 9.78,
                    todayChange: 1.56,
                    trend: 'up',
                    category: 'transport',
                    description: '投资于新能源汽车和绿色交通基础设施企业'
                },
                {
                    id: '5',
                    name: '绿色建筑基金',
                    code: 'JCFUND005',
                    returnRate: 6.23,
                    todayChange: 0.45,
                    trend: 'up',
                    category: 'building',
                    description: '专注于节能建筑材料和绿色建筑技术企业'
                },
                {
                    id: '6',
                    name: '可持续农业基金',
                    code: 'JCFUND006',
                    returnRate: 5.89,
                    todayChange: -0.12,
                    trend: 'down',
                    category: 'agriculture',
                    description: '投资于有机农业和可持续食品生产企业'
                }
            ];
        } catch (error) {
            showError(error.message || '获取基金列表失败');
            throw error;
        }
    },
    
    // 获取基金详情
    async getFundDetail(fundId) {
        try {
            // 模拟数据，实际应该调用API
            const funds = await this.getFundList();
            return funds.find(fund => fund.id === fundId) || null;
        } catch (error) {
            showError(error.message || '获取基金详情失败');
            throw error;
        }
    },
    
    // 获取基金历史数据
    async getFundHistory(fundId, timeRange = '1d') {
        try {
            // 模拟数据，实际应该调用API
            const now = new Date();
            const data = [];
            
            // 根据时间范围生成不同数量的数据点
            let days = 1;
            if (timeRange === '1w') days = 7;
            if (timeRange === '1m') days = 30;
            
            for (let i = days; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                
                // 生成随机价格数据，围绕基准价格波动
                const basePrice = 100 + Math.random() * 50;
                const price = parseFloat((basePrice + Math.random() * 10 - 5).toFixed(2));
                
                data.push({
                    date: date.toISOString().split('T')[0],
                    price: price
                });
            }
            
            return data;
        } catch (error) {
            showError(error.message || '获取基金历史数据失败');
            throw error;
        }
    }
};

// 资产服务
export const assetService = {
    // 获取用户资产
    async getUserAssets() {
        try {
            const user = await userService.getCurrentUser();
            if (!user) {
                throw new Error('用户未登录');
            }
            
            // 模拟数据，实际应该调用API
            return {
                totalBalance: user.balance || 10000.00,
                availableBalance: (user.balance || 10000.00) * 0.7,
                investedBalance: (user.balance || 10000.00) * 0.3,
                assetDistribution: [
                    { name: '碳资产管理基金', value: 35, color: '#22c55e' },
                    { name: '清洁能源基金', value: 25, color: '#10b981' },
                    { name: '环保科技基金', value: 20, color: '#059669' },
                    { name: '绿色交通基金', value: 15, color: '#047857' },
                    { name: '其他', value: 5, color: '#065f46' }
                ]
            };
        } catch (error) {
            showError(error.message || '获取资产信息失败');
            throw error;
        }
    },
    
    // 充值
    async deposit(amount, method = 'USDT') {
        try {
            const user = await userService.getCurrentUser();
            if (!user) {
                throw new Error('用户未登录');
            }
            
            // 模拟充值成功，实际应该调用API
            console.log(`充值 ${amount} ${method} 成功`);
            
            // 更新本地用户余额
            user.balance = (user.balance || 0) + amount;
            localStorage.setItem('user', JSON.stringify(user));
            
            return { success: true, message: '充值成功' };
        } catch (error) {
            showError(error.message || '充值失败，请稍后重试');
            throw error;
        }
    },
    
    // 获取交易记录
    async getTransactionHistory(type = 'all', page = 1, pageSize = 10) {
        try {
            const user = await userService.getCurrentUser();
            if (!user) {
                throw new Error('用户未登录');
            }
            
            // 模拟数据，实际应该调用API
            const now = new Date();
            const records = [];
            
            // 生成模拟交易记录
            const types = ['buy', 'sell', 'deposit', 'withdraw'];
            const fundNames = ['碳资产管理基金', '清洁能源基金', '环保科技基金', '绿色交通基金'];
            
            for (let i = 0; i < 20; i++) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                
                const recordType = types[Math.floor(Math.random() * types.length)];
                if (type !== 'all' && recordType !== type) {
                    continue;
                }
                
                const amount = parseFloat((Math.random() * 1000 + 100).toFixed(2));
                const price = parseFloat((Math.random() * 10 + 90).toFixed(2));
                
                let record = {
                    id: `tx${Date.now()}${i}`,
                    type: recordType,
                    amount: amount,
                    date: date.toISOString(),
                    status: 'completed'
                };
                
                if (recordType === 'buy' || recordType === 'sell') {
                    record.fundName = fundNames[Math.floor(Math.random() * fundNames.length)];
                    record.price = price;
                    record.quantity = parseFloat((amount / price).toFixed(4));
                }
                
                records.push(record);
            }
            
            // 分页
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedRecords = records.slice(startIndex, endIndex);
            
            return {
                records: paginatedRecords,
                total: records.length,
                page: page,
                pageSize: pageSize,
                totalPages: Math.ceil(records.length / pageSize)
            };
        } catch (error) {
            showError(error.message || '获取交易记录失败');
            throw error;
        }
    },
    
    // 获取持仓明细
    async getPositions() {
        try {
            const user = await userService.getCurrentUser();
            if (!user) {
                throw new Error('用户未登录');
            }
            
            // 模拟数据，实际应该调用API
            return [
                {
                    id: 'pos1',
                    fundName: '碳资产管理基金',
                    code: 'JCFUND003',
                    quantity: 100.50,
                    avgPrice: 105.20,
                    currentPrice: 118.35,
                    profitLoss: parseFloat((100.50 * (118.35 - 105.20)).toFixed(2)),
                    profitLossRate: parseFloat((((118.35 - 105.20) / 105.20) * 100).toFixed(2)),
                    type: 'long'
                },
                {
                    id: 'pos2',
                    fundName: '清洁能源基金',
                    code: 'JCFUND001',
                    quantity: 85.75,
                    avgPrice: 98.45,
                    currentPrice: 106.78,
                    profitLoss: parseFloat((85.75 * (106.78 - 98.45)).toFixed(2)),
                    profitLossRate: parseFloat((((106.78 - 98.45) / 98.45) * 100).toFixed(2)),
                    type: 'long'
                }
            ];
        } catch (error) {
            showError(error.message || '获取持仓明细失败');
            throw error;
        }
    }
};

// 交易服务
export const tradeService = {
    // 开仓
    async openPosition(fundId, quantity, price, type = 'long', leverage = 1, marginMode = 'cross') {
        try {
            const user = await userService.getCurrentUser();
            if (!user) {
                throw new Error('用户未登录');
            }
            
            // 模拟开仓成功，实际应该调用API
            const fund = await fundService.getFundDetail(fundId);
            if (!fund) {
                throw new Error('基金不存在');
            }
            
            console.log(`开${type === 'long' ? '多' : '空'} ${fund.name} ${quantity}份，价格${price}，杠杆${leverage}倍，保证金模式${marginMode}`);
            
            // 更新本地用户余额（简化模拟）
            const requiredMargin = quantity * price / leverage;
            if ((user.balance || 0) < requiredMargin) {
                throw new Error('余额不足，无法开仓');
            }
            
            // 实际应用中应该由后端处理余额更新
            user.balance = (user.balance || 0) - requiredMargin;
            localStorage.setItem('user', JSON.stringify(user));
            
            return {
                success: true,
                message: '开仓成功',
                positionId: `pos${Date.now()}`
            };
        } catch (error) {
            showError(error.message || '开仓失败，请稍后重试');
            throw error;
        }
    },
    
    // 平仓
    async closePosition(positionId) {
        try {
            const user = await userService.getCurrentUser();
            if (!user) {
                throw new Error('用户未登录');
            }
            
            // 模拟平仓成功，实际应该调用API
            console.log(`平仓 ${positionId} 成功`);
            
            // 简化模拟：平仓后返还保证金并添加盈亏
            const profit = parseFloat((Math.random() * 500 - 200).toFixed(2));
            user.balance = (user.balance || 0) + 1000 + profit; // 假设保证金为1000
            localStorage.setItem('user', JSON.stringify(user));
            
            return {
                success: true,
                message: '平仓成功',
                profit: profit
            };
        } catch (error) {
            showError(error.message || '平仓失败，请稍后重试');
            throw error;
        }
    },
    
    // 设置止盈止损
    async setStopOrders(positionId, takeProfitPrice = null, stopLossPrice = null) {
        try {
            // 模拟设置止盈止损，实际应该调用API
            console.log(`设置止盈止损：持仓${positionId}，止盈价${takeProfitPrice}，止损价${stopLossPrice}`);
            
            return {
                success: true,
                message: '止盈止损设置成功'
            };
        } catch (error) {
            showError(error.message || '设置止盈止损失败');
            throw error;
        }
    }
};

// 新闻服务
export const newsService = {
    // 获取新闻列表
    async getNewsList(page = 1, pageSize = 10) {
        try {
            // 模拟数据，实际应该调用API
            return [
                {
                    id: 'news1',
                    title: '国家发改委发布《绿色低碳技术创新支持政策》',
                    source: '国家发改委官网',
                    publishTime: '2025-09-18',
                    category: 'policy'
                },
                {
                    id: 'news2',
                    title: '碳交易市场成交量创历史新高，绿色金融迎来发展机遇',
                    source: '中国碳交易网',
                    publishTime: '2025-09-18',
                    category: 'market'
                },
                {
                    id: 'news3',
                    title: '新能源汽车销量同比增长35%，产业链投资价值凸显',
                    source: '汽车工业协会',
                    publishTime: '2025-09-18',
                    category: 'industry'
                }
            ];
        } catch (error) {
            showError(error.message || '获取新闻列表失败');
            throw error;
        }
    },
    
    // 获取新闻详情
    async getNewsDetail(newsId) {
        try {
            // 模拟数据，实际应该调用API
            const newsList = await this.getNewsList();
            const news = newsList.find(n => n.id === newsId);
            
            if (!news) {
                throw new Error('新闻不存在');
            }
            
            // 模拟新闻内容
            let content = '';
            if (newsId === 'news1') {
                content = `
                    <div class="space-y-4">
                        <div class="text-sm text-gray-500">
                            <span>发布时间：2025年9月18日</span>
                            <span class="mx-2">|</span>
                            <span>来源：国家发改委官网</span>
                        </div>
                        
                        <p class="text-gray-700 leading-relaxed">
                            近日，国家发展改革委发布《绿色低碳技术创新支持政策》，旨在加快推动绿色低碳技术创新，助力实现"双碳"目标。
                        </p>
                        
                        <h3 class="text-lg font-semibold text-gray-900">政策主要内容</h3>
                        
                        <ul class="list-disc list-inside space-y-2 text-gray-700">
                            <li>加大对清洁能源技术研发的支持力度</li>
                            <li>完善绿色低碳技术标准体系</li>
                            <li>建立绿色技术创新平台</li>
                            <li>加强国际合作与交流</li>
                        </ul>
                        
                        <h3 class="text-lg font-semibold text-gray-900">对基金市场的影响</h3>
                        
                        <p class="text-gray-700 leading-relaxed">
                            业内专家表示，该政策的出台将为绿色生态基金带来重大利好。清洁能源、环保科技、碳资产管理等相关基金有望受益于政策支持，
                            预计未来3-5年将迎来快速发展期。投资者可重点关注相关领域的优质基金产品。
                        </p>
                    </div>
                `;
            } else if (newsId === 'news2') {
                content = `
                    <div class="space-y-4">
                        <div class="text-sm text-gray-500">
                            <span>发布时间：2025年9月18日</span>
                            <span class="mx-2">|</span>
                            <span>来源：中国碳交易网</span>
                        </div>
                        
                        <p class="text-gray-700 leading-relaxed">
                            昨日，全国碳交易市场成交量达到500万吨，创历史新高。碳价稳中有升，达到62元/吨，
                            显示出市场对碳资产价值的认可度不断提升。
                        </p>
                        
                        <h3 class="text-lg font-semibold text-gray-900">市场表现分析</h3>
                        
                        <p class="text-gray-700 leading-relaxed">
                            分析人士指出，碳交易市场的活跃表现主要得益于以下因素：
                        </p>
                        
                        <ol class="list-decimal list-inside space-y-2 text-gray-700">
                            <li>企业碳减排意识增强，主动参与碳市场交易</li>
                            <li>相关政策法规不断完善，市场机制日趋成熟</li>
                            <li>投资者对绿色金融产品的关注度提升</li>
                            <li>国际碳市场价格上涨带动国内市场情绪</li>
                        </ol>
                    </div>
                `;
            } else if (newsId === 'news3') {
                content = `
                    <div class="space-y-4">
                        <div class="text-sm text-gray-500">
                            <span>发布时间：2025年9月18日</span>
                            <span class="mx-2">|</span>
                            <span>来源：汽车工业协会</span>
                        </div>
                        
                        <p class="text-gray-700 leading-relaxed">
                            最新数据显示，今年8月新能源汽车销量达到80万辆，同比增长35%，环比增长8%。
                            新能源汽车市场渗透率达到38%，继续保持快速增长态势。
                        </p>
                        
                        <h3 class="text-lg font-semibold text-gray-900">行业发展趋势</h3>
                        
                        <p class="text-gray-700 leading-relaxed">
                            新能源汽车行业的快速发展主要受益于：
                        </p>
                        
                        <ul class="list-disc list-inside space-y-2 text-gray-700">
                            <li>技术进步推动产品性能不断提升</li>
                            <li>充电基础设施建设加快</li>
                            <li>消费者环保意识增强</li>
                            <li>政策支持力度持续加大</li>
                        </ul>
                    </div>
                `;
            }
            
            return {
                ...news,
                content: content
            };
        } catch (error) {
            showError(error.message || '获取新闻详情失败');
            throw error;
        }
    }
};

// 规则服务
export const rulesService = {
    // 获取交易规则
    async getTradingRules() {
        try {
            // 模拟数据，实际应该调用API
            return {
                highFrequency: {
                    period: '5-10分钟',
                    minInvestment: '100 USDT',
                    feeRate: '0.1%'
                },
                privateFund: {
                    minSubscription: '50万 USDT',
                    lockPeriod: '3个月',
                    expectedReturn: '年化8%-15%'
                },
                digitalCurrency: {
                    tradingCurrency: 'USDT/港币',
                    tradingHours: '24小时',
                    leverageRange: '1-100倍'
                },
                greenFund: {
                    subscriptionRedemption: '24小时',
                    minInvestment: '100 USDT',
                    feeRate: '0.15%-0.35%'
                }
            };
        } catch (error) {
            showError(error.message || '获取交易规则失败');
            throw error;
        }
    },
    
    // 获取投资策略
    async getInvestmentStrategies() {
        try {
            // 模拟数据，实际应该调用API
            return [
                {
                    title: '分散投资策略',
                    description: '建议投资者将资金分散投资于不同的基金产品，降低单一投资的风险。可根据自身风险偏好，配置不同比例的高、中、低风险基金。'
                },
                {
                    title: '定期定额投资',
                    description: '对于长期看好的基金产品，建议采用定期定额投资策略，通过分散投资时间来降低市场波动风险。'
                },
                {
                    title: '止盈止损策略',
                    description: '设置合理的止盈止损点位，当基金收益达到预期目标时及时止盈，当亏损达到预设比例时及时止损，控制投资风险。'
                },
                {
                    title: '关注政策动向',
                    description: '绿色金融投资受政策影响较大，投资者应密切关注相关政策变化，及时调整投资策略。'
                }
            ];
        } catch (error) {
            showError(error.message || '获取投资策略失败');
            throw error;
        }
    }
};

// 个人中心服务
const profileService = {
  // 获取个人资料
  async getPersonalProfile() {
    return request('/api/users/me/profile', 'GET');
  },
  
  // 更新个人资料
  async updatePersonalProfile(data) {
    return request('/api/users/me/profile', 'PUT', data);
  },
  
  // 获取通知列表
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return request(`/api/users/me/notifications?${queryString}`, 'GET');
  },
  
  // 获取单个通知详情
  async getNotificationDetail(notificationId) {
    return request(`/api/users/me/notifications/${notificationId}`, 'GET');
  },
  
  // 标记通知为已读
  async markNotificationsRead(notificationIds) {
    return request('/api/users/me/notifications/read', 'POST', { notification_ids: notificationIds });
  },
  
  // 提交提现申请
  async createWithdrawal(data) {
    return request('/api/users/me/withdrawals', 'POST', data);
  },
  
  // 获取提现记录
  async getWithdrawals(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return request(`/api/users/me/withdrawals?${queryString}`, 'GET');
  }
};

// 社交分享服务
const shareService = {
  // 分享到微信（模拟）
  shareToWechat(content) {
    showToast('微信分享链接已复制到剪贴板');
    // 实际项目中可以调用微信SDK或者复制链接到剪贴板
    console.log('Share to Wechat:', content);
  },
  
  // 分享到微博（模拟）
  shareToWeibo(content) {
    showToast('微博分享链接已复制到剪贴板');
    // 实际项目中可以调用微博SDK或者复制链接到剪贴板
    console.log('Share to Weibo:', content);
  },
  
  // 复制分享链接
  copyShareLink(link) {
    navigator.clipboard.writeText(link).then(() => {
      showToast('分享链接已复制到剪贴板');
    }).catch(err => {
      showErrorToast('复制失败，请手动复制');
      console.error('Could not copy text: ', err);
    });
  }
};

// 导出所有服务
export default {
  userService,
  fundService,
  assetService,
  tradeService,
  newsService,
  rulesService,
  profileService,
  shareService
};