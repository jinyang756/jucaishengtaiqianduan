# 聚财生态基金前端项目

## 绿色生态基金管理系统 - 前端项目

这是一个基于HTML、JavaScript、Tailwind CSS和Chart.js开发的绿色生态基金管理系统前端界面。

**GitHub 仓库**: https://github.com/jinyang756/jucaishengtaiqianduan.git
**团队 ID**: team_j2tTU2rju1M82Tv3r64SmTPa

### 功能特性
- 基金净值实时监控
- 收益率数据可视化
- 响应式设计，支持移动端访问
- 现代化UI设计
- 实时数据更新功能

### 技术栈
- HTML5
- JavaScript (ES6+)
- Tailwind CSS v3
- Chart.js
- Vite 构建工具

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
- `vercel.json`: Vercel部署配置
- `.env.example`: 环境变量配置模板
- `FINAL_DEPLOYMENT_GUIDE.md`: 详细部署指南

### 环境变量配置
项目需要以下环境变量配置（可通过.env.local文件设置本地开发环境）：
- `VITE_API_URL`: 后端API地址
- `VERCEL_PROJECT_API_KEY`: Vercel项目API密钥

请参考.env.example文件创建您自己的.env.local文件。
