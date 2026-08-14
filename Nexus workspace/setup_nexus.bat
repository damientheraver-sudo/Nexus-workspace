@echo off
title Nexus Workspace - Project Setup
color 0B

echo.
echo ============================================
echo          NEXUS WORKSPACE SETUP
echo ============================================
echo.
echo Creating project structure...
echo.

:: Create main project folder
if not exist "Nexus-Workspace" mkdir "Nexus-Workspace"

cd "Nexus-Workspace"

:: Create main folders
mkdir css 2>nul
mkdir js 2>nul
mkdir cpp 2>nul
mkdir cpp\examples 2>nul
mkdir assets 2>nul
mkdir assets\images 2>nul
mkdir assets\icons 2>nul

:: Create HTML file
if not exist "index.html" (
    type nul > "index.html"
)

:: Create CSS files
if not exist "css\main.css" (
    type nul > "css\main.css"
)

if not exist "css\dashboard.css" (
    type nul > "css\dashboard.css"
)

if not exist "css\components.css" (
    type nul > "css\components.css"
)

if not exist "css\responsive.css" (
    type nul > "css\responsive.css"
)

:: Create JavaScript files
if not exist "js\app.js" (
    type nul > "js\app.js"
)

if not exist "js\navigation.js" (
    type nul > "js\navigation.js"
)

if not exist "js\dashboard.js" (
    type nul > "js\dashboard.js"
)

if not exist "js\tasks.js" (
    type nul > "js\tasks.js"
)

if not exist "js\timer.js" (
    type nul > "js\timer.js"
)

if not exist "js\notes.js" (
    type nul > "js\notes.js"
)

if not exist "js\storage.js" (
    type nul > "js\storage.js"
)

:: Create C++ files
if not exist "cpp\main.cpp" (
    type nul > "cpp\main.cpp"
)

if not exist "cpp\examples\engineering.cpp" (
    type nul > "cpp\examples\engineering.cpp"
)

:: Create README
if not exist "README.md" (
    type nul > "README.md"
)

echo.
echo ============================================
echo       NEXUS WORKSPACE CREATED!
echo ============================================
echo.
echo Project location:
echo %CD%
echo.
echo Folder structure:
echo.
tree /F

echo.
echo ============================================
echo Opening Nexus Workspace in VS Code...
echo ============================================
echo.

:: Open project in VS Code
code .

if errorlevel 1 (
    echo.
    echo [WARNING] VS Code command "code" was not found.
    echo You can manually open the Nexus-Workspace folder in VS Code.
    echo.
)

echo.
pause