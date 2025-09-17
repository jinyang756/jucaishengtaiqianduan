// 交易记录模拟数据
import { generateId, getRandomNumber, getRandomDateString, getRandomAmount, getRandomElement } from './mockDataUtils.js';

// 生成交易记录数据
export function generateTransactions(count = 100) {
  const transactions = [];
  const transactionTypes = ['purchase', 'redeem', 'dividend', 'reinvestment'];
  const statuses = ['completed', 'processing', 'failed', 'canceled'];
  const paymentMethods = ['balance', 'bank_transfer', 'alipay', 'wechat_pay'];
  
  // 模拟基金ID列表
  const fundIds = [];
  for (let i = 1; i <= 30; i++) {
    fundIds.push(`fund_${i.toString().padStart(4, '0')}`);
  }
  
  // 模拟用户ID列表
  const userIds = [];
  for (let i = 1; i <= 20; i++) {
    userIds.push(`user_${Math.random().toString(36).substr(2, 9)}`);
  }
  
  for (let i = 0; i < count; i++) {
    const type = getRandomElement(transactionTypes);
    const fundId = getRandomElement(fundIds);
    const userId = getRandomElement(userIds);
    const status = getRandomElement(statuses);
    const paymentMethod = getRandomElement(paymentMethods);
    
    // 根据交易类型设置金额范围
    let amount, shares, fee;
    
    if (type === 'purchase') {
      amount = getRandomAmount(1000, 500000, 2);
      shares = getRandomAmount(amount / 2, amount / 0.5, 4);
      fee = getRandomAmount(amount * 0.001, amount * 0.015, 2);
    } else if (type === 'redeem') {
      amount = getRandomAmount(1000, 300000, 2);
      shares = getRandomAmount(amount / 2, amount / 0.5, 4);
      fee = getRandomAmount(amount * 0.001, amount * 0.01, 2);
    } else if (type === 'dividend') {
      amount = getRandomAmount(100, 50000, 2);
      shares = 0;
      fee = 0;
    } else {
      // reinvestment
      amount = getRandomAmount(100, 20000, 2);
      shares = getRandomAmount(amount / 2, amount / 0.5, 4);
      fee = 0;
    }
    
    // 生成日期（过去一年）
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const transactionDate = getRandomDateString(oneYearAgo, now, true);
    
    // 计算完成日期（如果交易状态是已完成）
    let completionDate = null;
    if (status === 'completed') {
      const transactionDateObj = new Date(transactionDate);
      const completionDelay = getRandomNumber(0, 3); // 0-3天完成
      const completionDateObj = new Date(transactionDateObj);
      completionDateObj.setDate(transactionDateObj.getDate() + completionDelay);
      completionDate = completionDateObj.toISOString();
    }
    
    transactions.push({
      id: generateId('transaction'),
      userId,
      fundId,
      type,
      amount,
      shares,
      price: getRandomAmount(0.5, 5, 4),
      fee,
      status,
      paymentMethod,
      transactionDate,
      completionDate,
      createdAt: getRandomDateString(oneYearAgo, now, true),
      updatedAt: getRandomDateString(oneYearAgo, now, true),
      // 交易备注信息
      notes: type === 'purchase' ? '基金购买' : 
             type === 'redeem' ? '基金赎回' : 
             type === 'dividend' ? '基金分红' : '红利再投资'
    });
  }
  
  // 按交易日期降序排序
  return transactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
}

// 导出默认数据
export const mockTransactions = generateTransactions();