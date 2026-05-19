# DevVerse AI Project Initialization Script
# This script creates the complete monorepo structure

$rootPath = "d:\web d"

# Create directory structure
$directories = @(
    # Backend structure
    "apps\backend\src\common\middleware",
    "apps\backend\src\common\validators",
    "apps\backend\src\common\guards",
    "apps\backend\src\common\filters",
    "apps\backend\src\common\decorators",
    "apps\backend\src\auth\strategies",
    "apps\backend\src\auth\dto",
    "apps\backend\src\users\entities",
    "apps\backend\src\users\dto",
    "apps\backend\src\teams\entities",
    "apps\backend\src\teams\dto",
    "apps\backend\src\projects\entities",
    "apps\backend\src\projects\dto",
    "apps\backend\src\workspaces\entities",
    "apps\backend\src\workspaces\dto",
    "apps\backend\src\ai\services",
    "apps\backend\src\ai\dto",
    "apps\backend\src\database\seeders",
    "apps\backend\src\websocket",
    "apps\backend\prisma\migrations",
    
    # Frontend structure
    "apps\web\src\app\(auth)",
    "apps\web\src\app\(dashboard)",
    "apps\web\src\app\workspace",
    "apps\web\src\components\common",
    "apps\web\src\components\layouts",
    "apps\web\src\components\3d-viewer",
    "apps\web\src\components\forms",
    "apps\web\src\hooks\api",
    "apps\web\src\hooks\ui",
    "apps\web\src\store",
    "apps\web\src\lib\utils",
    "apps\web\src\lib\api",
    "apps\web\src\lib\constants",
    "apps\web\src\services\api",
    "apps\web\src\services\websocket",
    "apps\web\src\types\models",
    "apps\web\src\types\api",
    "apps\web\public\icons",
    
    # AI Service
    "apps\ai-service\app\services",
    "apps\ai-service\app\models",
    "apps\ai-service\app\routers",
    "apps\ai-service\app\utils",
    "apps\ai-service\tests",
    
    # Packages
    "packages\shared\src\types",
    "packages\shared\src\constants",
    "packages\shared\src\utils",
    "packages\ui\src\components",
    "packages\ui\src\hooks",
    "packages\ui\src\styles",
    
    # Infrastructure
    "infrastructure\docker",
    "infrastructure\k8s",
    "infrastructure\terraform"
)

Write-Host "Creating directory structure..." -ForegroundColor Green

foreach ($dir in $directories) {
    $fullPath = Join-Path $rootPath $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Created: $dir"
    }
}

Write-Host "`nDirectory structure created successfully!" -ForegroundColor Green
