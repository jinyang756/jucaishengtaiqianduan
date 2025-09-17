// 注册页面E2E测试
describe('注册页面测试', () => {
  beforeEach(() => {
    // 访问注册页面
    cy.visit('/register.html');
  });

  it('页面加载正确，显示所有必要元素', () => {
    // 检查页面标题
    cy.title().should('include', '注册');
    
    // 检查表单元素是否存在
    cy.get('form').should('exist');
    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('input[name="confirmPassword"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
    
    // 检查链接是否存在
    cy.get('a[href="login.html"]').should('exist');
  });

  it('成功注册测试', () => {
    // 生成随机邮箱以避免重复注册
    const randomEmail = `testuser_${Math.floor(Math.random() * 10000)}@example.com`;
    
    // 填写注册表单
    cy.get('input[name="name"]').type('测试用户');
    cy.get('input[name="email"]').type(randomEmail);
    cy.get('input[name="password"]').type('Test@123');
    cy.get('input[name="confirmPassword"]').type('Test@123');
    cy.get('button[type="submit"]').click();
    
    // 验证注册成功后重定向到登录页面或主页
    cy.url().should('include', '/login.html');
    
    // 检查是否显示成功消息
    cy.contains('注册成功，请登录').should('be.visible');
  });

  it('注册失败 - 邮箱已存在', () => {
    // 使用已存在的邮箱注册
    cy.get('input[name="name"]').type('重复用户');
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('Test@123');
    cy.get('input[name="confirmPassword"]').type('Test@123');
    cy.get('button[type="submit"]').click();
    
    // 验证显示邮箱已存在错误
    cy.contains('该邮箱已被注册').should('be.visible');
  });

  it('注册失败 - 密码不一致', () => {
    // 输入不一致的密码
    cy.get('input[name="name"]').type('测试用户');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('Password1');
    cy.get('input[name="confirmPassword"]').type('Password2');
    cy.get('button[type="submit"]').click();
    
    // 验证显示密码不一致错误
    cy.contains('两次输入的密码不一致').should('be.visible');
  });

  it('注册失败 - 密码格式不正确', () => {
    // 输入不符合要求的密码
    cy.get('input[name="name"]').type('测试用户');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('123');
    cy.get('input[name="confirmPassword"]').type('123');
    cy.get('button[type="submit"]').click();
    
    // 验证显示密码格式错误
    cy.contains('密码必须包含').should('be.visible');
  });

  it('跳转到登录页面', () => {
    // 点击登录链接
    cy.get('a[href="login.html"]').click();
    
    // 验证跳转到登录页面
    cy.url().should('include', '/login.html');
  });
});