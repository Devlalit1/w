import os
import json
from pathlib import Path

root = r"d:\web d"

# Create directories
dirs = [
    # Backend
    r"apps\backend\src\common\middleware",
    r"apps\backend\src\common\validators",
    r"apps\backend\src\common\guards",
    r"apps\backend\src\auth\strategies",
    r"apps\backend\src\auth\dto",
    r"apps\backend\src\users\entities",
    r"apps\backend\src\users\dto",
    r"apps\backend\src\teams\entities",
    r"apps\backend\src\teams\dto",
    r"apps\backend\src\projects\entities",
    r"apps\backend\src\projects\dto",
    r"apps\backend\src\workspaces\entities",
    r"apps\backend\src\workspaces\dto",
    r"apps\backend\src\ai\services",
    r"apps\backend\src\ai\dto",
    r"apps\backend\prisma\migrations",
    r"apps\backend\src\websocket",
    # Frontend
    r"apps\web\src\app\(auth)",
    r"apps\web\src\app\(dashboard)",
    r"apps\web\src\app\workspace",
    r"apps\web\src\components\common",
    r"apps\web\src\components\layouts",
    r"apps\web\src\components\3d-viewer",
    r"apps\web\src\components\forms",
    r"apps\web\src\hooks\api",
    r"apps\web\src\hooks\ui",
    r"apps\web\src\store",
    r"apps\web\src\lib\utils",
    r"apps\web\src\services\api",
    r"apps\web\src\types",
    r"apps\web\public",
    # AI Service
    r"apps\ai-service\app\services",
    r"apps\ai-service\app\models",
    r"apps\ai-service\app\routers",
    # Packages
    r"packages\shared\src",
    r"packages\ui\src",
]

for dir_path in dirs:
    full_path = os.path.join(root, dir_path)
    Path(full_path).mkdir(parents=True, exist_ok=True)
    print(f"Created: {dir_path}")

print("Directory structure created!")
