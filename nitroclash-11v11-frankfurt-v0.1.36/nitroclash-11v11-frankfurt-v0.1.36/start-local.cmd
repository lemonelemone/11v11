@echo off
title NitroClash 11v11 Frankfurt Server
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js 24 is required. & pause & exit /b 1)
netstat -ano | findstr ":8011" | findstr "LISTENING" >nul && (echo ERROR: Another 11v11 server is already using port 8011. & echo Close the older 11v11 server window, then try again. & pause & exit /b 1)
node server.mjs
set "NC11_EXIT=%errorlevel%"
echo.
echo NitroClash 11v11 server stopped with exit code %NC11_EXIT%.
echo If the code is not 0, copy the error shown above.
pause
exit /b %NC11_EXIT%
