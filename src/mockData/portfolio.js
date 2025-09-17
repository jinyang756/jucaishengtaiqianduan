// 用户投资组合模拟数据
import { generateId, getRandomNumber, getRandomPercentage, getRandomAmount, getRandomElement } from './mockDataUtils.js';

// 生成投资组合数据
export function generatePortfolios(count = 50) {
  const portfolios = [];
  const assetAllocationTypes = ['aggressive', 'balanced', 'conservative'];
  const riskLevels = ['低风险', '中低风险', '中风险', '中高风险', '高风险'];
  
  // 模拟用户ID列表
  const userIds = [];
  for (let i = 1; i <= 30; i++) {
    userIds.push(`user_${Math.random().toString(36).substr(2, 9)}`);
  }
  
  // 模拟基金ID列表
  const fundIds = [];
  for (let i = 1; i <= 50; i++) {
    fundIds.push(`fund_${i.toString().padStart(4, '0')}`);
  }
  
  for (let i = 0; i < count; i++) {
    const userId = getRandomElement(userIds);
    const assetAllocation = getRandomElement(assetAllocationTypes);
    const portfolioRiskLevel = getRandomElement(riskLevels);
    
    // 根据资产配置类型设置不同的基金持有数量
    let holdingCount;
    if (assetAllocation === 'aggressive') {
      holdingCount = getRandomNumber(5, 15);
    } else if (assetAllocation === 'balanced') {
      holdingCount = getRandomNumber(3, 10);
    } else {
      holdingCount = getRandomNumber(2, 8);
    }
    
    // 生成持仓基金数据
    const holdings = [];
    let totalInvestment = 0;
    let totalCurrentValue = 0;
    
    // 从基金列表中随机选择不重复的基金
    const selectedFundIds = [];
    while (selectedFundIds.length < holdingCount) {
      const fundId = getRandomElement(fundIds);
      if (!selectedFundIds.includes(fundId)) {
        selectedFundIds.push(fundId);
      }
    }
    
    // 为每个选中的基金生成持仓数据
    selectedFundIds.forEach(fundId => {
      const investmentAmount = getRandomAmount(5000, 200000, 2);
      const shares = getRandomAmount(investmentAmount / 3, investmentAmount / 0.5, 4);
      const purchasePrice = getRandomAmount(0.5, 5, 4);
      const currentPrice = getRandomAmount(purchasePrice * 0.8, purchasePrice * 1.5, 4);
      const currentValue = shares * currentPrice;
      const profit = currentValue - investmentAmount;
      const profitRate = (profit / investmentAmount) * 100;
      
      // 根据投资比例设置不同的持有时间
      const holdingPeriodDays = getRandomNumber(30, 1800); // 1个月到5年
      
      holdings.push({
        id: generateId('holding'),
        fundId,
        investmentAmount,
        shares,
        purchasePrice,
        currentPrice,
        currentValue,
        profit,
        profitRate: Number(profitRate.toFixed(2)),
        holdingPeriodDays,
        isProfit: profit >= 0,
        // 持仓占比（将在最后计算）
        allocationRatio: 0,
        // 最近一次交易日期
        lastTransactionDate: new Date(Date.now() - holdingPeriodDays * 24 * 60 * 60 * 1000).toISOString()
      });
      
      totalInvestment += investmentAmount;
      totalCurrentValue += currentValue;
    });
    
    // 计算持仓占比
    holdings.forEach(holding => {
      holding.allocationRatio = Number(((holding.currentValue / totalCurrentValue) * 100).toFixed(2));
    });
    
    const totalProfit = totalCurrentValue - totalInvestment;
    const totalProfitRate = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
    
    // 生成组合表现数据（近1月、近3月、近6月、近1年收益率）
    const monthlyReturn = getRandomPercentage(-5, 10, 2);
    const quarterlyReturn = getRandomPercentage(-10, 20, 2);
    const halfYearlyReturn = getRandomPercentage(-15, 30, 2);
    const yearlyReturn = getRandomPercentage(-20, 50, 2);
    
    portfolios.push({
      id: generateId('portfolio'),
      userId,
      name: `${getRandomElement(['进取型', '稳健型', '保守型', '平衡型'])}投资组合${i + 1}`,
      description: getRandomElement([
        '多元化配置，平衡风险与收益',
        '积极进取，追求高收益',
        '稳健为主，注重资产保值',
        '长期投资，价值导向'
      ]),
      assetAllocation,
      riskLevel: portfolioRiskLevel,
      totalInvestment: Number(totalInvestment.toFixed(2)),
      totalCurrentValue: Number(totalCurrentValue.toFixed(2)),
      totalProfit: Number(totalProfit.toFixed(2)),
      totalProfitRate: Number(totalProfitRate.toFixed(2)),
      monthlyReturn,
      quarterlyReturn,
      halfYearlyReturn,
      yearlyReturn,
      createdAt: new Date(Date.now() - getRandomNumber(30, 1800) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      holdings: holdings.sort((a, b) => b.currentValue - a.currentValue), // 按持仓价值排序
      // 组合配置建议
      suggestions: getRandomElement([
        '当前配置较为合理，建议保持',
        '可适当增加低风险资产比例',
        '建议分散投资，降低集中度',
        '可考虑增加新兴市场配置'
      ])
    });
  }
  
  return portfolios;
}

// 导出默认数据
export const mockPortfolios = generatePortfolios();