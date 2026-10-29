@echo off
chcp 65001 >nul
echo ========================================================
echo       KHOI PHUC DU AN VE VERSION 1.0 NGUYEN BAN
echo ========================================================
echo Dang tien hanh khoi phuc du an ve trang thai Version 1.0...
echo.

set SRC=_backup_version_1.0

if not exist "%SRC%" (
    echo [LOI] Khong tim thay thu muc sao luu %SRC%!
    echo Dang thu khoi phuc bang Git...
    git checkout version-1.0 -f
    pause
    exit /b
)

copy /Y "%SRC%\index.html" "index.html" >nul
copy /Y "%SRC%\server.js" "server.js" >nul
copy /Y "%SRC%\package.json" "package.json" >nul
copy /Y "%SRC%\package-lock.json" "package-lock.json" >nul
copy /Y "%SRC%\manifest.json" "manifest.json" >nul
copy /Y "%SRC%\sw.js" "sw.js" >nul

echo [1/3] Da khoi phuc cac file goc (index.html, server.js...).

if exist "%SRC%\js" xcopy /E /I /Y "%SRC%\js" "js" >nul
if exist "%SRC%\css" xcopy /E /I /Y "%SRC%\css" "css" >nul
if exist "%SRC%\data" xcopy /E /I /Y "%SRC%\data" "data" >nul
if exist "%SRC%\assets" xcopy /E /I /Y "%SRC%\assets" "assets" >nul

echo [2/3] Da khoi phuc cac thu muc js, css, data, assets.

call npm run copy-assets >nul 2>&1
echo [3/3] Da dong bo sang thu muc build www.

echo.
echo ========================================================
echo   THANH CONG! DU AN DA TRO VE HOAN TOAN VERSION 1.0
echo ========================================================
echo.
pause
