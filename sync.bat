@echo off

echo Pushing FreelanceHub to GitHub...

git init
git remote remove origin 2>nul
git remote add origin https://github.com/harisaqeelkhan/FreelanceHub-FullStack.git

git add .

:: timestamp wali commit message
for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set DATE=%%a-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ("%time%") do set TIME=%%a%%b
git commit -m "Update %DATE% %TIME%"

git branch -M main
git push -u origin main

echo.
echo Done! Check: https://github.com/harisaqeelkhan/FreelanceHub-FullStack
pause
