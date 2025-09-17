// 统一导出所有模拟数据

// 导入工具函数
export * from './mockDataUtils.js';

// 导入基金相关模拟数据
import { generateFunds, mockFunds } from './funds.js';
export { generateFunds, mockFunds };

// 导入新闻相关模拟数据
import { generateNews, mockNews } from './news.js';
export { generateNews, mockNews };

// 导入用户相关模拟数据
import { generateUsers, mockUsers } from './users.js';
export { generateUsers, mockUsers };

// 导入交易记录相关模拟数据
import { generateTransactions, mockTransactions } from './transactions.js';
export { generateTransactions, mockTransactions };

// 导入投资组合相关模拟数据
import { generatePortfolios, mockPortfolios } from './portfolio.js';
export { generatePortfolios, mockPortfolios };

// 导入杠杆相关模拟数据
import { generateLeverageApplications, mockLeverageApplications, generateLeverageTransactions, mockLeverageTransactions } from './leverage.js';
export { generateLeverageApplications, mockLeverageApplications, generateLeverageTransactions, mockLeverageTransactions };

// 导出所有模拟数据的集合
export const mockData = {
  funds: mockFunds,
  news: mockNews,
  users: mockUsers,
  transactions: mockTransactions,
  portfolios: mockPortfolios,
  leverageApplications: mockLeverageApplications,
  leverageTransactions: mockLeverageTransactions
};

// 导出所有生成函数的集合
export const generators = {
  generateFunds,
  generateNews,
  generateUsers,
  generateTransactions,
  generatePortfolios,
  generateLeverageApplications,
  generateLeverageTransactions
};