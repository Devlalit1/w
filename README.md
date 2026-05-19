# DevVerse AI

An AI-powered 3D developer workspace for visualizing software architectures, exploring APIs, and collaborating in real-time.

## 🚀 Features

- **3D Architecture Visualization** - Interactive 3D graph visualization of software structures
- **AI-Powered Analysis** - Generate system diagrams and documentation using AI
- **Real-time Collaboration** - Work together with team members in shared workspaces
- **Code Intelligence** - Analyze code complexity and generate insights
- **API Explorer** - Visualize and explore APIs in 3D space
- **Database Visualization** - Simulate and visualize database relationships
- **Smart Documentation** - Auto-generate documentation from architecture
- **Debugging Assistant** - AI-powered debugging and troubleshooting

## 🛠 Tech Stack

### Frontend
- Next.js 15 + React 19
- TypeScript
- TailwindCSS + shadcn/ui
- React Three Fiber + Three.js
- Zustand + React Query

### Backend
- NestJS
- PostgreSQL + Prisma
- Redis
- WebSocket (Socket.io)
- JWT + OAuth

### AI Service
- FastAPI
- LangChain
- OpenAI API

### DevOps
- Docker & Docker Compose
- GitHub Actions
- Vercel + Railway

## 📦 Monorepo Structure

```
devverse-ai/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── backend/      # NestJS API
│   └── ai-service/   # FastAPI microservice
├── packages/
│   ├── shared/       # Shared types & utils
│   └── ui/          # UI components library
└── infrastructure/   # Docker & deployment
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 9+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
cp apps/backend/.env.example apps/backend/.env.local
cp apps/ai-service/.env.example apps/ai-service/.env.local

# Initialize database
cd apps/backend
pnpm prisma migrate dev

# Start development
pnpm dev
```

## 📝 Development

### Code Quality
```bash
pnpm lint
pnpm format
pnpm type-check
```

### Building
```bash
pnpm build
```

### Testing
```bash
pnpm test
```

## 🔐 Security

- Rate limiting on API endpoints
- Input validation with Zod
- XSS & CSRF protection
- Secure JWT handling
- OAuth integration
- Secure file uploads

## 📊 Project Status

Currently in active development. See [plan.md](./plan.md) for detailed roadmap.

## 📄 License

MIT

## 👥 Team

Built by the DevVerse AI team for the next generation of developer tools.
