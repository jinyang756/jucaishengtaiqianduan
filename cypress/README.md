# Cypress E2E 测试指南

本项目使用 Cypress 进行端到端（E2E）测试，确保应用程序的主要功能正常运行。

## 测试文件结构

```
cypress/
  ├── e2e/               # E2E 测试文件
  │   ├── login.cy.js    # 登录页面测试
  │   ├── register.cy.js # 注册页面测试
  │   └── dashboard.cy.js # 仪表盘页面测试
  ├── fixtures/          # 测试数据
  ├── support/           # 支持文件
  │   ├── commands.js    # 自定义命令
  │   └── index.js       # 全局配置
```

## 安装依赖

确保已安装项目依赖：

```bash
npm install
```

## 运行测试

### 方式 1: 交互式模式

使用 Cypress 交互式界面运行测试，可以查看测试执行过程：

```bash
npm run e2e
```

### 方式 2: 无头模式

在命令行中运行所有测试，适合 CI/CD 环境：

```bash
npm run e2e:run
```

## 自定义命令

项目中定义了以下自定义 Cypress 命令：

- `cy.login(email, password)` - 登录用户
- `cy.logout()` - 登出用户
- `cy.checkNavigation()` - 检查导航菜单
- `cy.checkApiResponse(url, method)` - 检查 API 响应

## 环境变量

测试使用以下环境变量：

- `CYPRESS_apiUrl` - API 基础 URL，默认为 `http://localhost:3000/api`

可以在 `.env` 文件中设置或通过命令行传入。

## 注意事项

- 运行测试前确保开发服务器已经启动：`npm run dev`
- 测试会自动清除 cookie 和 localStorage，确保测试环境的清洁
- 测试使用模拟数据，请确保 mockData 目录下的文件可用