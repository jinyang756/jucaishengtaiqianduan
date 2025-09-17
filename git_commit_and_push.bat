@echo off
REM Script to commit and push all changes to GitHub

echo Adding all files to git...
git add .

echo Committing changes...
git commit -m "Update project files"

echo Pushing to GitHub...
git push origin main

if errorlevel 1 (
    echo Push failed!
    echo Make sure you have the correct permissions and are connected to the internet.
    echo Alternatively, you can manually commit and push using Git GUI or other tools.
) else (
    echo Successfully pushed changes to GitHub!
    echo Now you can deploy to Vercel through GitHub integration:
    echo 1. Go to https://vercel.com/new
    echo 2. Select GitHub repository: jinyang756/jucaishengtaiqianduan
    echo 3. Choose team ID: team_j2tTU2rju1M82Tv3r64SmTPa
    echo 4. Confirm build settings and deploy
    echo 
    echo 请参考 FINAL_DEPLOYMENT_GUIDE.md 获取详细部署指南
)

pause