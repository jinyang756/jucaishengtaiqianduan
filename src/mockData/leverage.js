// 杠杆申请和交易模拟数据
import { generateId, getRandomNumber, getRandomAmount, getRandomElement, getRandomDateString } from './mockDataUtils.js';

// 生成杠杆申请记录
export function generateLeverageApplications(count = 50) {
  const applications = [];
  const statuses = ['pending', 'approved', 'rejected', 'cancelled'];
  const leverageRatios = [1, 5, 10, 20, 50, 100];
  const reasons = ['市场机会把握', '短期投资需求', '提高资金利用率', '分散投资风险'];
  
  // 模拟用户ID列表
  const userIds = [];
  for (let i = 1; i <= 30; i++) {
    userIds.push(`user_${Math.random().toString(36).substr(2, 9)}`);
  }
  
  for (let i = 0; i < count; i++) {
    const userId = getRandomElement(userIds);
    const status = getRandomElement(statuses);
    const requestedRatio = getRandomElement(leverageRatios);
    const approvedRatio = status === 'approved' ? requestedRatio : null;
    const reason = getRandomElement(reasons);
    
    // 生成申请金额范围
    const amount = getRandomAmount(10000, 1000000, 2);
    
    // 生成日期（过去3个月）
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    const applyDate = getRandomDateString(threeMonthsAgo, now, true);
    
    // 计算审核日期（如果已审核）
    let reviewDate = null;
    if (status === 'approved' || status === 'rejected') {
      const applyDateObj = new Date(applyDate);
      const reviewDelay = getRandomNumber(1, 3); // 1-3天审核完成
      const reviewDateObj = new Date(applyDateObj);
      reviewDateObj.setDate(applyDateObj.getDate() + reviewDelay);
      reviewDate = reviewDateObj.toISOString();
    }
    
    // 生成风险评估分数
    const riskScore = getRandomNumber(30, 100);
    
    applications.push({
      id: generateId('leverage_application'),
      userId,
      requestedRatio,
      approvedRatio,
      amount,
      status,
      reason,
      riskScore,
      applyDate,
      reviewDate,
      reviewNotes: status === 'rejected' ? getRandomElement([
        '风险评估不通过',
        '资产规模不足',
        '交易经验不足',
        '不符合杠杆使用条件'
      ]) : null,
      createdAt: applyDate,
      updatedAt: reviewDate || applyDate
    });
  }
  
  // 按申请日期降序排序
  return applications.sort((a, b) => new Date(b.applyDate) - new Date(a.applyDate));
}

// 生成杠杆交易记录
export function generateLeverageTransactions(count = 80) {
  const transactions = [];
  const transactionTypes = ['open', 'close', 'margin_call', 'force_close'];
  const statuses = ['completed', 'processing', 'failed'];
  
  // 模拟用户ID列表
  const userIds = [];
  for (let i = 1; i <= 20; i++) {
    userIds.push(`user_${Math.random().toString(36).substr(2, 9)}`);
  }
  
  // 模拟基金ID列表
  const fundIds = [];
  for (let i = 1; i <= 40; i++) {
    fundIds.push(`fund_${i.toString().padStart(4, '0')}`);
  }
  
  for (let i = 0; i < count; i++) {
    const userId = getRandomElement(userIds);
    const type = getRandomElement(transactionTypes);
    const status = getRandomElement(statuses);
    const fundId = getRandomElement(fundIds);
    const leverageRatio = getRandomElement([1, 5, 10, 20, 50, 100]);
    
    // 根据交易类型设置金额范围
    let amount, initialMargin, maintenanceMargin, profitLoss;
    
    if (type === 'open') {
      amount = getRandomAmount(10000, 500000, 2);
      initialMargin = amount * 0.1; // 10%初始保证金
      maintenanceMargin = initialMargin * 0.75; // 维持保证金
      profitLoss = 0;
    } else if (type === 'close') {
      amount = getRandomAmount(10000, 500000, 2);
      initialMargin = 0;
      maintenanceMargin = 0;
      profitLoss = getRandomAmount(-amount * 0.2, amount * 0.3, 2); // -20%到30%盈亏
    } else if (type === 'margin_call') {
      amount = getRandomAmount(5000, 200000, 2);
      initialMargin = 0;
      maintenanceMargin = amount * 0.075; // 7.5%维持保证金
      profitLoss = -amount * 0.03; // 亏损3%
    } else {
      // force_close
      amount = getRandomAmount(10000, 300000, 2);
      initialMargin = 0;
      maintenanceMargin = 0;
      profitLoss = -amount * getRandomAmount(0.05, 0.15, 2); // 亏损5%-15%
    }
    
    // 生成日期（过去6个月）
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    const transactionDate = getRandomDateString(sixMonthsAgo, now, true);
    
    transactions.push({
      id: generateId('leverage_transaction'),
      userId,
      fundId,
      type,
      amount,
      leverageRatio,
      initialMargin,
      maintenanceMargin,
      profitLoss,
      status,
      transactionDate,
      createdAt: transactionDate,
      updatedAt: transactionDate,
      // 交易备注
      notes: type === 'open' ? '开仓交易' : 
             type === 'close' ? '平仓交易' : 
             type === 'margin_call' ? '追加保证金通知' : '强制平仓'
    });
  }
  
  // 按交易日期降序排序
  return transactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
}

// 导出默认数据
export const mockLeverageApplications = generateLeverageApplications();
export const mockLeverageTransactions = generateLeverageTransactions();