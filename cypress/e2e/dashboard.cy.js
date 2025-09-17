// 仪表盘页面E2E测试
describe('仪表盘页面测试', () => {
  beforeEach(() => {
    // 首先登录
    cy.login('admin@example.com', 'password123');
  });

  it('页面加载正确，显示用户仪表盘', () => {
    // 检查页面标题
    cy.title().should('include', '仪表盘');
    
    // 检查主要组件是否存在
    cy.get('.dashboard-container').should('exist');
    cy.get('.summary-cards').should('exist');
    cy.get('.fund-performance').should('exist');
    cy.get('.recent-transactions').should('exist');
    
    // 检查导航菜单
    cy.checkNavigation();
  });

  it('检查基金数据展示', () => {
    // 检查基金列表是否显示
    cy.get('.fund-list').should('exist');
    cy.get('.fund-item').should('have.length.greaterThan', 0);
    
    // 检查基金表现图表
    cy.get('canvas').should('exist');
  });

  it('检查交易历史', () => {
    // 检查最近交易记录
    cy.get('.transaction-item').should('have.length.greaterThan', 0);
    
    // 检查交易记录详情
    cy.get('.transaction-item').first().click();
    cy.get('.transaction-details').should('be.visible');
  });

  it('导航到不同页面', () => {
    // 导航到基金列表页面
    cy.get('a[href="funds.html"]').click();
    cy.url().should('include', '/funds.html');
    
    // 返回仪表盘
    cy.visit('/index.html');
    
    // 导航到用户资料页面
    cy.get('a[href="user-profile.html"]').click();
    cy.url().should('include', '/user-profile.html');
  });

  it('登出功能测试', () => {
    // 使用自定义命令登出
    cy.logout();
    
    // 验证返回登录页面
    cy.url().should('include', '/login.html');
    
    // 验证无法直接访问仪表盘
    cy.visit('/index.html');
    cy.url().should('include', '/login.html');
  });

  it('响应式布局测试', () => {
    // 测试不同屏幕尺寸
    cy.viewport('iphone-6');
    cy.get('.mobile-menu-button').should('exist');
    
    cy.viewport('ipad-2');
    cy.get('.tablet-layout').should('exist');
    
    cy.viewport('macbook-15');
    cy.get('.desktop-layout').should('exist');
  });
});