# jucaishengtaiqianduan

## 绿色生态基金管理系统 - 前端项目

这是一个基于HTML、JavaScript、Tailwind CSS和Chart.js开发的绿色生态基金管理系统前端界面。

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
