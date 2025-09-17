@echo off
REM Simple Vercel Deployment Script

REM Clean up old .vercel directory if exists
if exist ".vercel" (
    echo Cleaning up old Vercel configuration...
    rmdir /s /q .vercel
)

REM Set Vercel Team ID
set VERCEL_TEAM_ID=team_j2tTU2rju1M82Tv3r64SmTPa

REM Start deployment with Vercel CLI
echo Deploying to Vercel with team ID: %VERCEL_TEAM_ID%
echo Please make sure you have logged in with 'vercel login' first!
echo.

REM Command to deploy
vercel --yes --prod --scope=%VERCEL_TEAM_ID% .

REM If deployment fails, provide manual deployment instructions
echo.
if errorlevel 1 (
    echo Deployment failed!
    echo Alternative deployment method:
    echo 1. Go to https://vercel.com/new
    echo 2. Select GitHub repository: jinyang756/jucaishengtaiqianduan
    echo 3. Choose team ID: %VERCEL_TEAM_ID%
    echo 4. Confirm build settings and deploy
)

pause