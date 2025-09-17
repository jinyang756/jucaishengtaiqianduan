@echo off
REM 新的 Vercel 部署脚本
SET VERCEL_TEAM_ID=team_j2tTU2rju1M82Tv3r64SmTPa

echo 清理可能的旧配置...
if exist .vercel rmdir /s /q .vercel

echo 开始重新部署到 Vercel...
vercel --yes --prod --scope=%VERCEL_TEAM_ID% .

if %ERRORLEVEL% EQU 0 (
    echo 部署成功！
) else (
    echo 部署失败！请尝试以下步骤：
    echo 1. 确保您已经登录 Vercel CLI (运行 vercel login)
    echo 2. 或者通过 GitHub 集成方式部署：访问 https://vercel.com/new 并选择仓库 jinyang756/jucaishengtaiqianduan
    echo 3. 选择团队 ID: %VERCEL_TEAM_ID%
    echo 4. 确认构建参数并点击部署
)

pause