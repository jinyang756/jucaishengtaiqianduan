@echo off
REM Simple script to deploy to Vercel with the provided team ID

REM Set team ID
set VERCEL_TEAM_ID=team_j2tTU2rju1M82Tv3r64SmTPa

REM Try to deploy with the team ID using the correct --scope parameter
echo Deploying to Vercel with team ID: %VERCEL_TEAM_ID%
echo Using correct --scope parameter format
vercel --confirm --scope %VERCEL_TEAM_ID%

REM If deployment fails, provide manual instructions
echo.
echo If the automatic deployment failed, please try the manual GitHub integration method:
echo 1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository (jinyang756/jucaishengtaiqianduan)
4. When prompted for organization, select the team with ID: team_j2tTU2rju1M82Tv3r64SmTPa
5. Click "Deploy"

echo.
pause