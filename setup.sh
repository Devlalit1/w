#!/bin/bash
# DevVerse AI - Setup Script for Linux/Mac
# Run this to initialize the entire project

set -e

echo "🚀 DevVerse AI - Project Setup"
echo "================================"

# Run Python generator
echo "📁 Generating project structure..."
python3 generate-project.py

# Install dependencies
echo ""
echo "📦 Installing dependencies..."

if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

echo "Installing root dependencies..."
pnpm install

# Setup backend
echo ""
echo "🔧 Setting up backend..."
cd apps/backend
pnpm install
cd ../..

# Setup frontend
echo ""
echo "🎨 Setting up frontend..."
cd apps/web
pnpm install
cd ../..

# Setup AI service
echo ""
echo "🤖 Setting up AI service..."
cd apps/ai-service
pip install -r requirements.txt || true
cd ../..

# Setup database
echo ""
echo "🗄️  Setting up database..."
cd apps/backend
pnpm prisma generate
pnpm prisma migrate dev --name init || true
cd ../..

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure .env file in apps/backend/.env"
echo "2. Configure .env.local file in apps/web/.env.local"
echo "3. Run 'pnpm dev' to start development servers"
echo ""
