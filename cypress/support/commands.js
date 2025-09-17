// 自定义命令扩展
// you can add global configuration and behavior that modifies Cypress.
// or create custom commands and overwrite existing commands.

// 登录命令
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login.html');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login.html');
});

// 登出命令
Cypress.Commands.add('logout', () => {
  cy.get('#logout-button').click();
  cy.url().should('include', '/login.html');
});

// 检查导航链接
Cypress.Commands.add('checkNavigation', () => {
  cy.get('nav').should('be.visible');
  cy.get('nav a').should('have.length.greaterThan', 0);
});

// 检查API响应
Cypress.Commands.add('checkApiResponse', (url, method = 'GET') => {
  cy.request({
    url: `${Cypress.env('apiUrl')}${url}`,
    method: method,
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.be.oneOf([200, 401, 403]);
  });
});