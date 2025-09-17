@echo off
REM 完善版：提交并推送所有更改到GitHub

REM 检查Git是否可用
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误：未找到Git命令！请确保Git已正确安装并添加到系统路径中。
    pause
    exit /b 1
)

REM 设置中文显示
chcp 65001 >nul

REM 添加所有文件到git
echo 正在添加所有文件到Git...
git add .
if %errorlevel% neq 0 (
    echo 错误：添加文件失败！
    pause
    exit /b 1
)

REM 提交更改
set /p commit_msg=请输入提交信息（默认为"Update project files"）：
if "%commit_msg%"=="" set commit_msg=Update project files

echo 正在提交更改...
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo 错误：提交失败！请检查是否有冲突或未解决的问题。
    pause
    exit /b 1
)

REM 推送至GitHub
echo 正在推送至GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo 推送失败！
    echo 请确保您有正确的权限并且已连接到互联网。
    echo 您可以尝试使用以下命令手动设置远程仓库：
    echo git remote add origin https://github.com/jinyang756/jucaishengtaiqianduan.git
    echo 或者使用Git GUI或其他工具手动提交和推送。
    pause
    exit /b 1
) else (
    echo 成功将更改推送到GitHub！
    echo 现在您可以通过GitHub集成部署到Vercel：
    echo 1. 访问 https://vercel.com/new
    echo 2. 选择GitHub仓库：jinyang756/jucaishengtaiqianduan
    echo 3. 选择团队ID：team_j2tTU2rju1M82Tv3r64SmTPa
    pause
)