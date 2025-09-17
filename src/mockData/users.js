// 用户相关模拟数据

// 生成随机用户ID
function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

// 生成随机手机号
function generatePhoneNumber() {
  const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '170', '171', '173', '176', '177', '178', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.random().toString().substr(2, 8);
  return prefix + suffix;
}

// 生成随机身份证号
function generateIdCard() {
  // 简单生成，非真实校验
  const areaCode = Math.floor(Math.random() * 900000) + 100000;
  const birthYear = Math.floor(Math.random() * 80) + 1940;
  const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  const sequence = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  const checkDigit = '0123456789X'[Math.floor(Math.random() * 11)];
  
  return `${areaCode}${birthYear}${birthMonth}${birthDay}${sequence}${checkDigit}`;
}

// 生成随机用户名
function generateUserName() {
  const firstNames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'];
  const lastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '强', '磊', '军', '洋', '勇', '杰', '丽', '涛', '艳', '辉', '刚', '明', '佳', '俊'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return firstName + lastName;
}

// 生成随机邮箱
function generateEmail() {
  const domains = ['gmail.com', 'qq.com', '163.com', '126.com', 'sina.com', 'sohu.com', 'outlook.com', 'hotmail.com'];
  const username = Math.random().toString(36).substring(2, 10);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  return username + '@' + domain;
}

// 生成模拟用户数据
export function generateUsers(count = 10) {
  const users = [];
  const roles = ['admin', 'user', 'manager'];
  
  for (let i = 0; i < count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const isActive = Math.random() > 0.1; // 90%的用户是活跃的
    const user = {
      id: generateUserId(),
      username: generateUserName(),
      phone: generatePhoneNumber(),
      email: generateEmail(),
      idCard: generateIdCard(),
      role,
      status: isActive ? 'active' : 'inactive',
      createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // 随机过去一年
      lastLoginAt: isActive ? new Date(Date.now() - Math.random() * 604800000).toISOString() : null, // 随机过去一周或null
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2, 10)}`,
      personalInfo: {
        gender: Math.random() > 0.5 ? 'male' : 'female',
        age: Math.floor(Math.random() * 50) + 18, // 18-68岁
        address: `中国${Math.floor(Math.random() * 34) + 1}省${Math.floor(Math.random() * 100) + 1}市${Math.floor(Math.random() * 1000) + 1}路${Math.floor(Math.random() * 1000) + 1}号`,
        education: ['本科', '硕士', '博士', '大专', '高中'][Math.floor(Math.random() * 5)],
        occupation: ['上班族', '自由职业', '学生', '退休', '其他'][Math.floor(Math.random() * 5)],
        incomeLevel: ['5万以下', '5-10万', '10-20万', '20-50万', '50万以上'][Math.floor(Math.random() * 5)]
      },
      riskProfile: {
        riskTolerance: ['保守型', '稳健型', '平衡型', '成长型', '进取型'][Math.floor(Math.random() * 5)],
        investmentExperience: ['无经验', '1年以下', '1-3年', '3-5年', '5年以上'][Math.floor(Math.random() * 5)],
        investmentObjective: ['保本为主', '稳健增值', '追求高收益', '长期投资', '短期投机'][Math.floor(Math.random() * 5)],
        timeHorizon: ['1年以内', '1-3年', '3-5年', '5-10年', '10年以上'][Math.floor(Math.random() * 5)]
      },
      accountInfo: {
        totalAssets: Math.floor(Math.random() * 10000000), // 0-1000万
        availableBalance: Math.floor(Math.random() * 1000000), // 0-100万
        frozenBalance: Math.floor(Math.random() * 100000), // 0-10万
        totalProfit: Math.floor(Math.random() * 200000) - 50000, // -5万到15万
        fundCount: Math.floor(Math.random() * 20) + 1 // 1-20只基金
      },
      preferences: {
        language: 'zh-CN',
        theme: 'light',
        notifications: {
          email: true,
          sms: true,
          app: true
        },
        marketingConsent: Math.random() > 0.3, // 70%同意营销
        favoriteCategories: ['股票型', '混合型', '债券型', '指数型'].filter(() => Math.random() > 0.5)
      }
    };
    
    users.push(user);
  }
  
  return users;
}

// 生成模拟交易记录
function generateTransactions(userId, count = 20) {
  const transactions = [];
  const transactionTypes = ['purchase', 'redemption', 'dividend', 'fee'];
  const transactionStatuses = ['completed', 'pending', 'failed'];
  
  for (let i = 0; i < count; i++) {
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const status = transactionStatuses[Math.floor(Math.random() * transactionStatuses.length)];
    const amount = Math.floor(Math.random() * 100000) + 100; // 100-100000元
    const fee = Math.floor(amount * 0.01); // 1%手续费
    
    // 根据交易类型调整金额
    let actualAmount = amount;
    if (type === 'redemption' || type === 'fee') {
      actualAmount = -amount;
    }
    
    const transaction = {
      id: `txn_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      fundId: `fund_${Math.floor(Math.random() * 20).toString().padStart(4, '0')}`,
      type,
      status: type === 'fee' ? 'completed' : status, // 手续费交易默认为已完成
      amount,
      actualAmount,
      fee,
      date: new Date(Date.now() - Math.random() * 1209600000).toISOString(), // 随机过去两周
      description: getTransactionDescription(type),
      paymentMethod: ['balance', 'bank_card', 'alipay', 'wechat'].filter(() => Math.random() > 0.5)[0] || 'balance'
    };
    
    transactions.push(transaction);
  }
  
  // 按日期排序
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return transactions;
}

// 获取交易描述
function getTransactionDescription(type) {
  const descriptions = {
    purchase: ['购买基金', '申购基金', '基金买入'],
    redemption: ['赎回基金', '卖出基金', '基金赎回'],
    dividend: ['基金分红', '分红入账', '红利发放'],
    fee: ['交易手续费', '管理费', '托管费']
  };
  
  const descArray = descriptions[type] || ['交易'];
  return descArray[Math.floor(Math.random() * descArray.length)];
}

// 生成模拟持仓记录
function generatePortfolios(userId, count = 10) {
  const portfolios = [];
  
  for (let i = 0; i < count; i++) {
    const fundId = `fund_${Math.floor(Math.random() * 20).toString().padStart(4, '0')}`;
    const holdingAmount = Math.floor(Math.random() * 50000) + 100; // 100-50000份
    const avgCost = Math.random() * 4 + 0.5; // 0.5-4.5元
    const currentNav = Math.random() * 4 + 0.5; // 0.5-4.5元
    const totalCost = holdingAmount * avgCost;
    const currentValue = holdingAmount * currentNav;
    const profit = currentValue - totalCost;
    const profitRate = (profit / totalCost) * 100;
    
    const portfolio = {
      id: `portfolio_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      fundId,
      fundName: `基金${i + 1}`,
      fundCode: `F${Math.floor(Math.random() * 900000) + 100000}`,
      holdingAmount,
      avgCost: Number(avgCost.toFixed(4)),
      currentNav: Number(currentNav.toFixed(4)),
      totalCost: Number(totalCost.toFixed(2)),
      currentValue: Number(currentValue.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      profitRate: Number(profitRate.toFixed(2)),
      purchaseDate: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // 随机过去一年
      status: 'holding',
      allocationRatio: Number((Math.random() * 30 + 1).toFixed(2)) // 1-30%
    };
    
    portfolios.push(portfolio);
  }
  
  return portfolios;
}

// 生成模拟用户配置
function generateUserConfigs(userId) {
  return {
    userId,
    notifications: {
      dailyReport: Math.random() > 0.5,
      weeklyReport: Math.random() > 0.5,
      fundAlerts: Math.random() > 0.5,
      marketNews: Math.random() > 0.5,
      transactionConfirmations: true,
      riskWarnings: true
    },
    display: {
      theme: ['light', 'dark', 'system'][Math.floor(Math.random() * 3)],
      language: 'zh-CN',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm:ss',
      currencyFormat: 'CNY',
      decimalPlaces: 2
    },
    security: {
      twoFactorAuth: Math.random() > 0.5,
      loginHistory: [],
      trustedDevices: []
    },
    paymentMethods: [
      {
        id: `payment_${Math.random().toString(36).substr(2, 9)}`,
        type: 'bank_card',
        name: '招商银行储蓄卡',
        number: '**** **** **** 1234',
        isDefault: true
      },
      {
        id: `payment_${Math.random().toString(36).substr(2, 9)}`,
        type: 'alipay',
        name: '支付宝',
        number: '****@gmail.com',
        isDefault: false
      }
    ]
  };
}

// 模拟用户登录数据
const mockLoginCredentials = {
  admin: {
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  user1: {
    username: 'user1',
    password: 'user123',
    role: 'user'
  },
  manager: {
    username: 'manager',
    password: 'manager123',
    role: 'manager'
  }
};

// 生成模拟用户列表
export const mockUsers = generateUsers(10);

// 获取指定用户的详细信息
export function getUserDetail(userId) {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return null;
  
  return {
    ...user,
    transactions: generateTransactions(userId),
    portfolios: generatePortfolios(userId),
    configs: generateUserConfigs(userId)
  };
}

// 验证用户登录
export function verifyLogin(username, password) {
  for (const key in mockLoginCredentials) {
    const creds = mockLoginCredentials[key];
    if (creds.username === username && creds.password === password) {
      // 查找对应的用户
      const user = mockUsers.find(u => u.role === creds.role && u.status === 'active');
      if (user) {
        // 生成令牌
        const token = `token_${Math.random().toString(36).substr(2, 20)}`;
        
        return {
          success: true,
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            avatar: user.avatar
          },
          expiresAt: new Date(Date.now() + 86400000).toISOString() // 24小时后过期
        };
      }
    }
  }
  
  return {
    success: false,
    message: '用户名或密码错误'
  };
}

// 分页获取用户列表
export function getUsersPaged(page = 1, pageSize = 10, keyword = '', filters = {}) {
  let results = [...mockUsers];
  
  // 关键词搜索
  if (keyword && keyword.trim()) {
    const lowerKeyword = keyword.toLowerCase();
    results = results.filter(user => 
      user.username.toLowerCase().includes(lowerKeyword) ||
      user.phone.includes(keyword) ||
      user.email.toLowerCase().includes(lowerKeyword)
    );
  }
  
  // 角色筛选
  if (filters.role && filters.role !== 'all') {
    results = results.filter(user => user.role === filters.role);
  }
  
  // 状态筛选
  if (filters.status && filters.status !== 'all') {
    results = results.filter(user => user.status === filters.status);
  }
  
  // 排序
  if (filters.sortBy) {
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'lastLoginAt':
          if (!a.lastLoginAt) return 1;
          if (!b.lastLoginAt) return -1;
          return new Date(b.lastLoginAt) - new Date(a.lastLoginAt);
        case 'username':
          return a.username.localeCompare(b.username);
        default:
          return 0;
      }
    });
  }
  
  // 分页
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResults = results.slice(startIndex, endIndex);
  
  return {
    data: paginatedResults,
    total: results.length,
    page,
    pageSize,
    totalPages: Math.ceil(results.length / pageSize)
  };
}

// 更新用户信息
export function updateUser(userId, updateData) {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return {
      success: false,
      message: '用户不存在'
    };
  }
  
  // 更新用户信息
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...updateData
  };
  
  return {
    success: true,
    user: mockUsers[userIndex]
  };
}

// 切换用户状态
export function toggleUserStatus(userId) {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return {
      success: false,
      message: '用户不存在'
    };
  }
  
  // 切换状态
  const currentStatus = mockUsers[userIndex].status;
  mockUsers[userIndex].status = currentStatus === 'active' ? 'inactive' : 'active';
  
  return {
    success: true,
    user: mockUsers[userIndex]
  };
}