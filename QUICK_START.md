# 🚀 DevVerse AI - AI-Powered 3D Developer Workspace

**A production-grade SaaS application for visualizing software architectures in 3D, powered by AI.**

![Status](https://img.shields.io/badge/status-active%20development-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?logo=typescript&logoColor=white)

## 📋 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org))
- **pnpm** 9+ (`npm install -g pnpm`)
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download))
- **Redis** 7+ ([Download](https://redis.io/download))

### Installation (5 minutes)

```bash
# 1. Navigate to project
cd "d:\web d"

# 2. Initialize project structure
node initialize-project.js

# 3. Install dependencies
pnpm install

# 4. Copy environment files
copy .env.example .env
copy apps\backend\.env.example apps\backend\.env

# 5. Setup database
cd apps\backend
pnpm prisma generate
pnpm prisma migrate dev --name init
cd ..\..

# 6. Start development servers
pnpm dev
```

Your application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **AI Service**: http://localhost:8000 (when running)

## 🎯 Features

- **🎨 3D Architecture Visualization** - Interactive graph visualization with Three.js
- **🤖 AI-Powered Analysis** - Automatic documentation and complexity analysis
- **👥 Real-Time Collaboration** - WebSocket-based live workspace sharing
- **📊 Code Intelligence** - Analyze dependencies and system design
- **🎯 Drag-and-Drop Interface** - Intuitive node/edge manipulation
- **🌙 Dark/Light Mode** - Full theme support
- **📱 Responsive Design** - Works on desktop and tablet
- **🔐 Secure Authentication** - JWT + OAuth support
- **⚡ High Performance** - Optimized rendering and caching

## 📁 Project Structure

```
devverse-ai/
├── apps/
│   ├── backend/              # NestJS API server
│   │   ├── src/
│   │   │   ├── auth/         # Authentication & authorization
│   │   │   ├── users/        # User management
│   │   │   ├── teams/        # Team management
│   │   │   ├── projects/     # Project CRUD
│   │   │   ├── workspaces/   # 3D workspace logic
│   │   │   ├── ai/           # AI integrations
│   │   │   ├── common/       # Shared utilities
│   │   │   └── database/     # Prisma ORM
│   │   └── prisma/           # Database schema
│   │
│   ├── web/                  # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/          # Pages & layouts
│   │   │   ├── components/   # React components
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── store/        # Zustand stores
│   │   │   ├── lib/          # Utilities & API client
│   │   │   ├── services/     # API services
│   │   │   └── types/        # TypeScript types
│   │   └── public/           # Static assets
│   │
│   └── ai-service/           # FastAPI AI microservice
│       └── app/
│           ├── main.py       # FastAPI app
│           ├── services/     # AI services
│           └── routers/      # API routes
│
├── packages/
│   ├── shared/               # Shared types & validators
│   │   └── src/
│   │       ├── types.ts      # Shared TypeScript types
│   │       └── validators.ts # Zod validation schemas
│   │
│   └── ui/                   # Reusable UI components library
│       └── src/
│           ├── components/   # UI components
│           ├── hooks/        # UI hooks
│           └── styles/       # Global styles
│
├── infrastructure/           # DevOps & deployment
│   ├── docker/              # Docker configs
│   └── k8s/                 # Kubernetes configs
│
├── docs/                    # Documentation
├── .env.example             # Environment template
├── docker-compose.yml       # Local development stack
├── package.json             # Root workspace config
├── tsconfig.json            # TypeScript config
└── README.md                # This file
```

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 15** | React framework with SSR |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **TailwindCSS** | Styling |
| **Zustand** | State management |
| **React Query** | Data fetching |
| **Three.js** | 3D rendering |
| **Framer Motion** | Animations |

### Backend
| Technology | Purpose |
|-----------|---------|
| **NestJS** | Node.js framework |
| **TypeScript** | Type safety |
| **Prisma** | ORM |
| **PostgreSQL** | Database |
| **Redis** | Caching & sessions |
| **JWT** | Authentication |
| **Socket.io** | Real-time |

### AI/ML
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | Python API framework |
| **LangChain** | AI orchestration |
| **OpenAI API** | Language models |

### DevOps
| Technology | Purpose |
|-----------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Local development |
| **GitHub Actions** | CI/CD |
| **Vercel** | Frontend hosting |
| **Railway** | Backend hosting |

## 📖 Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development guide and API documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design patterns
- **[TODO.md](./TODO.md)** - Remaining tasks and roadmap

## 🔑 Key Concepts

### Workspaces
A workspace is a 3D environment where users can:
- Create nodes representing services, databases, APIs, etc.
- Create edges representing connections and dependencies
- Collaborate in real-time with team members
- View AI-generated insights and analysis

### Nodes
Represent system components:
- SERVICE - Microservice or application
- DATABASE - Database system
- API - External or internal API
- COMPONENT - UI/Code component
- MICROSERVICE - Containerized service
- CACHE - Caching layer
- QUEUE - Message queue
- STORAGE - File storage

### Edges
Represent relationships:
- CONNECTION - Direct connection
- DEPENDENCY - Code dependency
- API_CALL - API invocation
- DATA_FLOW - Data movement
- MESSAGE_QUEUE - Async messaging
- REPLICATION - Data replication

## 🔐 Security

- ✅ **JWT Authentication** with token expiration
- ✅ **Password Hashing** with bcrypt
- ✅ **CORS Protection** configurable origins
- ✅ **Input Validation** with Zod schemas
- ✅ **SQL Injection Prevention** via Prisma ORM
- ✅ **XSS Protection** React escaping + sanitization
- ✅ **CSRF Tokens** for state-changing operations
- ✅ **Rate Limiting** on API endpoints
- ✅ **Environment Secrets** never committed

## ⚡ Performance

- **Code Splitting** - Automatic with Next.js
- **Image Optimization** - Next.js Image component
- **Database Indexing** - Optimized Prisma queries
- **Caching** - Redis for sessions and frequently accessed data
- **3D Optimization** - LOD rendering, frustum culling
- **Bundle Size** - Tree-shaking and minification
- **Lazy Loading** - Dynamic imports for heavy components

## 📊 API Endpoints

### Authentication
```
POST   /auth/register          # Create account
POST   /auth/login             # Login user
POST   /auth/refresh           # Refresh token
POST   /auth/logout            # Logout user
```

### Users
```
GET    /users/profile          # Get current user
GET    /users/:id              # Get user by ID
PUT    /users/profile          # Update profile
DELETE /users/:id              # Delete account
```

### Projects
```
POST   /projects               # Create project
GET    /projects               # List user projects
GET    /projects/:id           # Get project
PUT    /projects/:id           # Update project
DELETE /projects/:id           # Delete project
```

### Workspaces
```
POST   /workspaces             # Create workspace
GET    /workspaces/:id         # Get workspace
PUT    /workspaces/:id         # Update workspace
DELETE /workspaces/:id         # Delete workspace

POST   /workspaces/:id/nodes   # Create node
PUT    /workspaces/:id/nodes/:nodeId  # Update node
DELETE /workspaces/:id/nodes/:nodeId  # Delete node

POST   /workspaces/:id/edges   # Create edge
DELETE /workspaces/:id/edges/:edgeId  # Delete edge
```

### Teams
```
POST   /teams                  # Create team
GET    /teams                  # List user teams
GET    /teams/:id              # Get team
PUT    /teams/:id              # Update team
DELETE /teams/:id              # Delete team

POST   /teams/:id/members      # Add member
DELETE /teams/:id/members/:userId  # Remove member
```

### AI
```
POST   /ai/analyze/:projectId       # Analyze project
POST   /ai/documentation/:projectId # Generate docs
POST   /ai/complexity/:projectId    # Analyze complexity
```

## 🚀 Deployment

### Production Checklist
- [ ] Setup environment variables
- [ ] Configure database backups
- [ ] Setup SSL certificates
- [ ] Enable rate limiting
- [ ] Configure CDN for static assets
- [ ] Setup error tracking (Sentry)
- [ ] Setup performance monitoring
- [ ] Setup health checks

### Deploy to Vercel (Frontend)
```bash
cd apps/web
vercel deploy --prod
```

### Deploy to Railway (Backend)
```bash
cd apps/backend
railway deploy
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙋 Support

For support, please:
1. Check [DEVELOPMENT.md](./DEVELOPMENT.md) for common issues
2. Review existing [GitHub Issues](https://github.com/devverse/devverse-ai/issues)
3. Create a new issue with detailed information

## 🎉 Acknowledgments

- Built with modern web technologies
- Inspired by collaborative tools and 3D visualization platforms
- Powered by AI and machine learning

---

**Made with ❤️ for developers, architects, and teams**

*Last Updated: May 19, 2026*
