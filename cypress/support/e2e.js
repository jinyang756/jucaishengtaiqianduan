// Cypress E2E 支持文件

// 导入commands.js
import './commands';

// 全局设置和配置
Cypress.on('uncaught:exception', (err, runnable) => {
  // 防止某些非关键错误中断测试
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  // 其他错误仍会导致测试失败
  return true;
});

// 在所有测试运行前的设置
before(() => {
  // 可以在这里添加全局设置
});

beforeEach(() => {
  // 可以在这里添加每个测试前的设置
});