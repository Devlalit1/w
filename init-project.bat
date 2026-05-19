@echo off
REM Create monorepo directory structure

REM Root level files already created

REM Apps directories
mkdir apps\backend\src\common
mkdir apps\backend\src\auth
mkdir apps\backend\src\projects
mkdir apps\backend\src\workspaces
mkdir apps\backend\src\ai
mkdir apps\backend\src\teams
mkdir apps\backend\prisma\migrations
mkdir apps\web\src\app
mkdir apps\web\src\components
mkdir apps\web\src\hooks
mkdir apps\web\src\store
mkdir apps\web\src\lib
mkdir apps\web\src\services
mkdir apps\web\src\types
mkdir apps\web\public
mkdir apps\ai-service\app

REM Packages directories
mkdir packages\shared\src
mkdir packages\ui\src

REM Infrastructure
mkdir infrastructure\docker
mkdir infrastructure\k8s

echo Directory structure created successfully!
