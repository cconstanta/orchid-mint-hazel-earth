@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "NODEDIR="
if exist "%~dp0node\node.exe" set "NODEDIR=%~dp0node"
if exist "%~dp0..\node\node.exe" set "NODEDIR=%~dp0..\node"
if exist "%~d0\node\node.exe" set "NODEDIR=%~d0\node"

if not defined NODEDIR (
    echo.
    echo  Node.js на флешке не найден.
    echo  Скачайте Windows Binary ^(.zip^) с https://nodejs.org
    echo  Распакуйте так, чтобы был файл:
    echo      node\node.exe
    echo  рядом с этим проектом ИЛИ в корне флешки.
    echo.
    pause
    exit /b 1
)

set "PATH=%NODEDIR%;%PATH%"
echo Node:
"%NODEDIR%\node.exe" -v
echo npm:
call npm.cmd -v
if errorlevel 1 (
    echo npm не запустился. Проверьте папку node.
    pause
    exit /b 1
)

if not exist "%~dp0node_modules\" (
    echo.
    echo Первый запуск: качаю зависимости, подождите...
    call npm.cmd install
    if errorlevel 1 (
        echo npm install не удался. Нужен интернет на ЭТОМ компьютере один раз.
        pause
        exit /b 1
    )
)

echo.
echo Сайт запускается. Откройте в браузере:
echo    http://localhost:8080
echo Сотрудникам код: 2468
echo Остановить: это окно, Ctrl+C
echo.

call npm.cmd run dev
pause
