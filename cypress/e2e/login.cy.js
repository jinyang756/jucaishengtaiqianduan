// 登录页面E2E测试
describe('登录页面测试', () => {
  beforeEach(() => {
    // 访问登录页面
    cy.visit('/login.html');
  });

  it('页面加载正确，显示所有必要元素', () => {
    // 检查页面标题
    cy.title().should('include', '登录');
    
    // 检查表单元素是否存在
    cy.get('form').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
    
    // 检查链接是否存在
    cy.get('a[href="register.html"]').should('exist');
  });

  it('成功登录测试', () => {
    // 使用模拟数据登录
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // 验证登录成功后重定向到主页
    cy.url().should('eq', 'http://localhost:5173/index.html');
    
    // 检查是否存在用户菜单或仪表板元素
    cy.get('nav').should('exist');
  });

  it('登录失败 - 无效凭据', () => {
    // 使用无效凭据登录
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // 验证登录失败后显示错误消息
    cy.get('.error-message').should('be.visible');
    cy.url().should('include', '/login.html');
  });

  it('登录失败 - 空字段', () => {
    // 不输入任何内容直接提交
    cy.get('button[type="submit"]').click();
    
    // 验证显示必填字段错误
    cy.get('.form-error').should('exist');
  });

  it('跳转到注册页面', () => {
    // 点击注册链接
    cy.get('a[href="register.html"]').click();
    
    // 验证跳转到注册页面
    cy.url().should('include', '/register.html');
  });
});