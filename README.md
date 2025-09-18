# 聚财生态基金前端项目

## 绿色生态基金管理系统 - 前端项目

这是一个基于HTML、JavaScript、Tailwind CSS和Chart.js开发的绿色生态基金管理系统前端界面。

**GitHub 仓库**: https://github.com/jinyang756/jucaishengtaiqianduan.git
**团队 ID**: team_j2tTU2rju1M82Tv3r64SmTPa

### 功能特性
- 基金净值实时监控
- 收益率数据可视化
- 响应式设计，支持移动端访问
- 现代化UI设计，符合Awwwards级别
- 实时数据更新功能
- 完整的无障碍设计，符合WCAG标准
- 国际化支持
- 完善的API连接测试和响应式布局测试

### 技术栈
- HTML5
- JavaScript (ES6+)
- Tailwind CSS v3
- Chart.js
- Vite 构建工具
- Cypress 端到端测试
- ARIA 无障碍属性支持

### 部署方式
1. **传统部署**
   ```bash
   npm install
   npm run build
   # 将dist目录部署到Web服务器
   ```

2. **Docker部署**
   ```bash
   docker build -t green-fund-management .
   docker run -p 80:80 green-fund-management
   ```

3. **Vercel部署 (推荐)**
   通过GitHub集成方式部署（详见FINAL_DEPLOYMENT_GUIDE.md）
   ```bash
   # 或者使用简化的部署脚本
   git_commit_and_push.bat
   # 然后按照提示在Vercel网站完成部署
   ```

### 开发环境
```bash
npm install
npm run dev
```

### 项目结构
- `src/`: 源代码目录
- `dist/`: 构建输出目录
- `public/`: 静态资源
- `index.html`: 主页面
- `login.html`: 登录页面
- `register.html`: 注册页面
- `system-settings.html`: 系统设置页面
- `user-profile.html`: 用户配置页面
- `investment-method.html`: 投资方式页面
- `vercel.json`: Vercel部署配置
- `.env.example`: 环境变量配置模板
- `FINAL_DEPLOYMENT_GUIDE.md`: 详细部署指南
- `API_MOCK_DATA_GUIDE.md`: API模拟数据指南
- `CHANGELOG.md`: 版本变更记录
- `cypress/`: 端到端测试目录

### 环境变量配置
项目需要以下环境变量配置（可通过.env.local文件设置本地开发环境）：
- `VITE_API_URL`: 后端API地址
- `VERCEL_PROJECT_API_KEY`: Vercel项目API密钥

请参考.env.example文件创建您自己的.env.local文件。

### 无障碍设计
项目实现了完整的无障碍设计，包括：
- 符合WCAG标准的ARIA属性支持
- 表单元素的label和描述关联
- 交互元素的状态通知
- 键盘导航支持
- 屏幕阅读器友好的内容结构

### 测试
项目包含多种测试方式：
1. **API连接测试**：通过URL参数`?test-api`可以自动测试API连接
2. **响应式布局测试**：通过URL参数`?test-responsive`可以测试不同屏幕尺寸下的布局
3. **端到端测试**：使用Cypress进行UI自动化测试

### 开发规范
- 代码风格统一，使用ESLint进行代码质量检查
- 缩进统一为2个空格
- 文件名使用小写字母和连字符(-)的组合
- 注释清晰，便于维护
