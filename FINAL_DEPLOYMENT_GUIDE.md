# 最终部署指南：聚财生态基金前端项目

## 部署准备已完成

✅ **后端连接配置已更新**
- vercel.json 中环境变量已改为 `VITE_API_URL`，值为 `https://jucaishengtaihouduan.vercel.app/api`
- src/apiConfig.js 中默认后端地址已更新为相同值
- .env.local 文件已创建，确保本地开发环境能正确连接后端

✅ **API 密钥配置完成**
- VERCEL_PROJECT_API_KEY 环境变量已添加到 vercel.json 和 .env.local
- .env.example 文件已创建，提供安全的环境变量配置模板
- .gitignore 已正确配置，确保敏感信息不会被提交到 GitHub

✅ **代码已提交并推送到 GitHub**
- 最新提交：c2c7262 (Add .env.example file as environment variable template)
- GitHub 仓库：jinyang756/jucaishengtaiqianduan

✅ **项目构建验证通过**
- `npm run build` 命令成功执行，生成了 dist 目录
- 构建产物大小正常：HTML (21.18 kB)、CSS (21.88 kB)、JS (18.47 kB)

## 通过 GitHub 集成部署到 Vercel

由于 Vercel CLI 部署时遇到链接问题，推荐使用 GitHub 集成方式部署，这是最稳定可靠的方法：

1. **访问 Vercel 官网**：打开浏览器，访问 [https://vercel.com/new](https://vercel.com/new)
2. **导入 GitHub 仓库**：
   - 点击 "Import Project"
   - 选择 "Import from Git Repository"
   - 选择 GitHub 并授权
   - 在仓库列表中找到并选择 `jinyang756/jucaishengtaiqianduan`
3. **选择团队**：在 "Team" 下拉菜单中选择团队 ID：`team_j2tTU2rju1M82Tv3r64SmTPa`
4. **确认配置**：
   - 构建命令：`npm run build`（应自动检测）
   - 输出目录：`dist`（应自动检测）
   - 环境变量：
     - `VITE_API_URL=https://jucaishengtaihouduan.vercel.app/api`（后端 API 地址）
     - `VERCEL_PROJECT_API_KEY=prj_EWKFUoc5qEzEANrr2kcsMzashsE7`（项目 API 密钥）
   - 这些环境变量应自动从 vercel.json 读取

项目信息：
- **项目名称**: green-fund-management-system
- **构建工具**: Vite
- **GitHub 仓库**: https://github.com/jinyang756/jucaishengtaiqianduan.git
5. **部署项目**：点击 "Deploy" 按钮开始部署

## 部署完成后验证

部署成功后，您可以：

1. **访问部署的网站**：Vercel 会分配一个类似于 `jucaishengtaiqianduan.vercel.app` 的域名
2. **测试后端连接**：
   - 尝试登录/注册功能
   - 打开浏览器开发者工具（F12）→ Network 标签
   - 确认 API 请求的地址是 `https://jucaishengtaihouduan.vercel.app/api`
3. **检查构建日志**：如果遇到问题，查看 Vercel 控制台的构建日志获取详细信息

## 其他部署选项

如果需要，您也可以使用项目中的 Docker 配置进行部署：

```bash
# 构建 Docker 镜像
docker build -t green-fund-frontend .

# 运行 Docker 容器
docker run -p 8080:80 green-fund-frontend
```

## 注意事项

- 确保后端服务 `https://jucaishengtaihouduan.vercel.app` 正在运行且可访问
- 后端需要正确配置 CORS 策略，允许前端域名访问
- 如果需要自定义域名，请在 Vercel 控制台的项目设置中配置
- 后续代码更新推送到 GitHub 后，Vercel 会自动触发重新部署（如果已启用自动部署）

部署成功后，您的聚财生态基金前端项目将正式上线，用户可以通过分配的域名访问完整功能！