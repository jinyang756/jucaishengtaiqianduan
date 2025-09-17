// 导入Cypress的commands
import './commands';

// 在所有测试运行前执行的代码
beforeEach(() => {
  // 设置默认视口大小
  cy.viewport(1280, 720);
  
  // 清除所有cookie和localStorage
  cy.clearCookies();
  cy.clearLocalStorage();
});

// 自定义命令扩展
// you can add global configuration and behavior that modifies Cypress.
// or create custom commands and overwrite existing commands.