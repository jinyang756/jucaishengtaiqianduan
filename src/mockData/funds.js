// 基金列表模拟数据

// 生成随机数的工具函数
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成随机百分比的工具函数
function getRandomPercentage(min, max, decimals = 2) {
  const num = Math.random() * (max - min) + min;
  return Number(num.toFixed(decimals));
}

// 生成随机日期的工具函数
export function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// 生成随机基金数据
export function generateFunds(count = 20) {
  const fundTypes = ['股票型', '债券型', '混合型', '货币型', '指数型', 'QDII', 'FOF'];
  const riskLevels = ['低风险', '中低风险', '中风险', '中高风险', '高风险'];
  const managers = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
  const fundCompanies = ['华夏基金', '易方达基金', '广发基金', '南方基金', '博时基金', '嘉实基金', '汇添富基金', '鹏华基金'];
  const fundTags = ['环保主题', '科技主题', '消费主题', '医疗主题', '新能源主题', '金融主题', '价值投资', '成长投资'];
  
  const funds = [];
  
  for (let i = 1; i <= count; i++) {
    const fundType = fundTypes[getRandomNumber(0, fundTypes.length - 1)];
    const riskLevel = riskLevels[getRandomNumber(0, riskLevels.length - 1)];
    const scale = Number((Math.random() * 99 + 1).toFixed(2)); // 1-100亿
    const manager = managers[getRandomNumber(0, managers.length - 1)];
    const fundCompany = fundCompanies[getRandomNumber(0, fundCompanies.length - 1)];
    
    // 根据基金类型和风险等级调整收益率范围
    let dailyReturn, weeklyReturn, monthlyReturn, quarterlyReturn, yearlyReturn, sinceInceptionReturn;
    
    if (riskLevel === '低风险' || fundType === '货币型') {
      dailyReturn = getRandomPercentage(-0.1, 0.1, 4);
      weeklyReturn = getRandomPercentage(-0.3, 0.5, 2);
      monthlyReturn = getRandomPercentage(-0.5, 1.0, 2);
      quarterlyReturn = getRandomPercentage(-1.0, 3.0, 2);
      yearlyReturn = getRandomPercentage(1.0, 5.0, 2);
      sinceInceptionReturn = getRandomPercentage(5.0, 20.0, 2);
    } else if (riskLevel === '中低风险' || fundType === '债券型') {
      dailyReturn = getRandomPercentage(-0.2, 0.2, 4);
      weeklyReturn = getRandomPercentage(-0.5, 1.0, 2);
      monthlyReturn = getRandomPercentage(-1.0, 3.0, 2);
      quarterlyReturn = getRandomPercentage(-3.0, 8.0, 2);
      yearlyReturn = getRandomPercentage(3.0, 10.0, 2);
      sinceInceptionReturn = getRandomPercentage(10.0, 50.0, 2);
    } else if (riskLevel === '中风险' || fundType === '混合型') {
      dailyReturn = getRandomPercentage(-0.5, 0.5, 4);
      weeklyReturn = getRandomPercentage(-1.5, 3.0, 2);
      monthlyReturn = getRandomPercentage(-5.0, 8.0, 2);
      quarterlyReturn = getRandomPercentage(-10.0, 15.0, 2);
      yearlyReturn = getRandomPercentage(5.0, 30.0, 2);
      sinceInceptionReturn = getRandomPercentage(30.0, 100.0, 2);
    } else {
      // 中高风险和高风险
      dailyReturn = getRandomPercentage(-1.0, 1.0, 4);
      weeklyReturn = getRandomPercentage(-3.0, 5.0, 2);
      monthlyReturn = getRandomPercentage(-8.0, 12.0, 2);
      quarterlyReturn = getRandomPercentage(-15.0, 25.0, 2);
      yearlyReturn = getRandomPercentage(10.0, 50.0, 2);
      sinceInceptionReturn = getRandomPercentage(50.0, 200.0, 2);
    }
    
    // 随机选择标签
    const tags = [];
    const tagCount = getRandomNumber(1, 3);
    const shuffledTags = [...fundTags].sort(() => 0.5 - Math.random());
    
    for (let j = 0; j < tagCount; j++) {
      tags.push(shuffledTags[j]);
    }
    
    // 计算基金净值
    const nav = Number((Math.random() * 4 + 0.5).toFixed(4)); // 0.5-4.5之间
    
    // 生成成立日期（1-10年前）
    const now = new Date();
    const inceptionDate = new Date(now.getFullYear() - getRandomNumber(1, 10), now.getMonth(), now.getDate());
    
    funds.push({
      id: `fund_${i.toString().padStart(4, '0')}`,
      name: `${fundCompany}${fundType}${i}号`,
      code: `F${getRandomNumber(100000, 999999)}`,
      type: fundType,
      riskLevel,
      scale: `${scale}亿`,
      manager,
      company: fundCompany,
      nav,
      dailyReturn,
      weeklyReturn,
      monthlyReturn,
      quarterlyReturn,
      yearlyReturn,
      sinceInceptionReturn,
      tags,
      inceptionDate: inceptionDate.toISOString().split('T')[0],
      purchaseFee: Number((Math.random() * 1.5 + 0.1).toFixed(2)), // 0.1-1.6%
      redemptionFee: Number((Math.random() * 1.0).toFixed(2)), // 0-1%
      minPurchase: getRandomNumber(1, 1000), // 1-1000元
      performanceRank: getRandomNumber(1, 100), // 1-100名
      performanceRating: getRandomNumber(1, 5) // 1-5星
    });
  }
  
  return funds;
}

// 生成基金持有比例数据
function generateFundHoldings(fundId) {
  const stockHoldings = [];
  const bondHoldings = [];
  const cashHoldings = [];
  
  // 生成股票持仓（前10大重仓股）
  for (let i = 1; i <= 10; i++) {
    const stockName = ['贵州茅台', '宁德时代', '腾讯控股', '阿里巴巴', '招商银行', '比亚迪', '美团-W', '中国平安', '五粮液', '美的集团'][i - 1] || `股票${i}`;
    const stockCode = `${getRandomNumber(600000, 601000)}`;
    const proportion = Number((Math.random() * 8 + 1).toFixed(2)); // 1-9%
    
    stockHoldings.push({
      name: stockName,
      code: stockCode,
      proportion,
      marketValue: Number((Math.random() * 10000 + 1000).toFixed(2)), // 1000-11000万
      change: getRandomPercentage(-5, 5, 2) // -5% 到 5%
    });
  }
  
  // 生成债券持仓
  for (let i = 1; i <= 5; i++) {
    const bondName = `国债${i}期`;
    const bondCode = `${getRandomNumber(100000, 199999)}`;
    const proportion = Number((Math.random() * 5 + 0.5).toFixed(2)); // 0.5-5.5%
    
    bondHoldings.push({
      name: bondName,
      code: bondCode,
      proportion,
      marketValue: Number((Math.random() * 5000 + 500).toFixed(2)), // 500-5500万
      interestRate: getRandomPercentage(2, 5, 2) // 2-5%
    });
  }
  
  // 生成现金及等价物
  cashHoldings.push({
    name: '银行存款',
    proportion: Number((Math.random() * 5 + 1).toFixed(2)) // 1-6%
  });
  
  cashHoldings.push({
    name: '其他现金等价物',
    proportion: Number((Math.random() * 5 + 0.5).toFixed(2)) // 0.5-5.5%
  });
  
  return {
    fundId,
    stockHoldings,
    bondHoldings,
    cashHoldings,
    assetAllocation: {
      stocks: Number((Math.random() * 60 + 20).toFixed(2)), // 20-80%
      bonds: Number((Math.random() * 50).toFixed(2)), // 0-50%
      cash: Number((Math.random() * 20 + 5).toFixed(2)), // 5-25%
      others: Number((Math.random() * 5).toFixed(2)) // 0-5%
    }
  };
}

// 生成基金历史净值数据
function generateFundNavHistory(fundId, days = 365) {
  const history = [];
  let nav = Math.random() * 3 + 0.5; // 初始净值 0.5-3.5
  
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // 随机波动（-1%到1%）
    const change = (Math.random() - 0.5) * 0.02; // -1%到1%
    nav = Math.max(0.01, nav * (1 + change)); // 确保净值不会为负数
    
    history.push({
      date: date.toISOString().split('T')[0],
      nav: Number(nav.toFixed(4)),
      change: Number((change * 100).toFixed(4))
    });
  }
  
  return {
    fundId,
    history
  };
}

// 模拟基金筛选条件
export const fundFilters = {
  types: ['全部', '股票型', '债券型', '混合型', '货币型', '指数型', 'QDII', 'FOF'],
  riskLevels: ['全部', '低风险', '中低风险', '中风险', '中高风险', '高风险'],
  performancePeriods: ['近1周', '近1月', '近3月', '近6月', '近1年', '近3年', '成立以来'],
  tags: ['环保主题', '科技主题', '消费主题', '医疗主题', '新能源主题', '金融主题', '价值投资', '成长投资']
};

// 导出模拟数据
export const mockFunds = generateFunds();
export const mockFundHoldings = generateFundHoldings('fund_0001');
export const mockFundNavHistory = generateFundNavHistory('fund_0001');

// 获取基金详情
export function getFundDetail(fundId) {
  const fund = mockFunds.find(f => f.id === fundId);
  if (!fund) return null;
  
  return {
    ...fund,
    holdings: generateFundHoldings(fundId),
    navHistory: generateFundNavHistory(fundId)
  };
}

// 搜索基金
export function searchFunds(keyword, filters = {}) {
  let results = [...mockFunds];
  
  // 关键词搜索
  if (keyword && keyword.trim()) {
    const lowerKeyword = keyword.toLowerCase();
    results = results.filter(fund => 
      fund.name.toLowerCase().includes(lowerKeyword) ||
      fund.code.includes(keyword) ||
      fund.manager.includes(keyword) ||
      fund.company.includes(keyword)
    );
  }
  
  // 类型筛选
  if (filters.type && filters.type !== '全部') {
    results = results.filter(fund => fund.type === filters.type);
  }
  
  // 风险等级筛选
  if (filters.riskLevel && filters.riskLevel !== '全部') {
    results = results.filter(fund => fund.riskLevel === filters.riskLevel);
  }
  
  // 标签筛选
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(fund => 
      filters.tags.some(tag => fund.tags.includes(tag))
    );
  }
  
  // 排序
  if (filters.sortBy) {
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case 'dailyReturn':
          return b.dailyReturn - a.dailyReturn;
        case 'weeklyReturn':
          return b.weeklyReturn - a.weeklyReturn;
        case 'monthlyReturn':
          return b.monthlyReturn - a.monthlyReturn;
        case 'yearlyReturn':
          return b.yearlyReturn - a.yearlyReturn;
        case 'nav':
          return b.nav - a.nav;
        default:
          return 0;
      }
    });
  }
  
  return results;
}

// 分页获取基金列表
export function getFundsPaged(page = 1, pageSize = 10, keyword = '', filters = {}) {
  const filteredFunds = searchFunds(keyword, filters);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    data: filteredFunds.slice(startIndex, endIndex),
    total: filteredFunds.length,
    page,
    pageSize,
    totalPages: Math.ceil(filteredFunds.length / pageSize)
  };
}