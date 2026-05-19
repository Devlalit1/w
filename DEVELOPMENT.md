# DevVerse AI - Development Guide

## Quick Start

### 1. Initialize Project

```bash
# Run the initialization script
node initialize-project.js

# Or use Python
python generate-project.py
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env

# Frontend  
cp apps/web/.env.example apps/web/.env.local
```

### 4. Database Setup

```bash
cd apps/backend
pnpm prisma generate
pnpm prisma migrate dev --name init
```

### 5. Start Development

```bash
# Start all services
pnpm dev

# Or individually:
pnpm -r --filter backend dev
pnpm -r --filter web dev
```

## Project Structure

```
devverse-ai/
├── apps/
│   ├── backend/           # NestJS API
│   ├── web/               # Next.js Frontend
│   └── ai-service/        # FastAPI Service
├── packages/
│   ├── shared/            # Shared types
│   └── ui/                # UI components
├── infrastructure/        # Docker & deployment
└── docs/                  # Documentation
```

## API Documentation

### Authentication

**POST /auth/register**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name"
}
```

**POST /auth/login**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Projects

**POST /projects**
```json
{
  "name": "My Project",
  "description": "Optional description",
  "teamId": "optional-team-id"
}
```

**GET /projects** - Get user's projects

**GET /projects/:id** - Get project details

### Workspaces

**POST /workspaces**
```json
{
  "projectId": "project-id",
  "name": "Workspace Name"
}
```

**GET /workspaces/:id** - Get workspace with nodes and edges

**POST /workspaces/:id/nodes**
```json
{
  "type": "SERVICE",
  "label": "Node Label",
  "position": { "x": 0, "y": 0, "z": 0 }
}
```

### Teams

**POST /teams**
```json
{
  "name": "Team Name",
  "slug": "team-slug"
}
```

**GET /teams** - Get user's teams

## Component Architecture

### Backend (NestJS)

- **Modules**: Organized by feature (auth, users, projects, workspaces, ai)
- **Services**: Business logic
- **Controllers**: HTTP endpoints
- **Entities**: Database models (Prisma schema)
- **DTOs**: Data validation schemas
- **Guards**: Authentication/Authorization
- **Middleware**: Logging, CORS, etc.

### Frontend (Next.js)

- **App Router**: File-based routing
- **Components**: Reusable UI components
- **Store**: Zustand state management
- **Hooks**: Custom React hooks
- **Services**: API client wrapper
- **Types**: TypeScript interfaces

## Development Workflow

### Adding a New Feature

1. **Backend**
   ```bash
   # Create new module
   nest g module features/my-feature
   nest g service features/my-feature
   nest g controller features/my-feature
   ```

2. **Update Database**
   ```bash
   # Add models to schema.prisma
   # Create migration
   pnpm prisma migrate dev --name add_my_feature
   ```

3. **Frontend**
   ```bash
   # Create components
   src/components/my-feature/
   
   # Create hooks
   src/hooks/use-my-feature.ts
   ```

## Code Quality

### Linting

```bash
pnpm lint
```

### Type Checking

```bash
pnpm type-check
```

### Formatting

```bash
pnpm format
```

### Testing

```bash
pnpm test
pnpm test:watch
```

## Deployment

### Docker

```bash
docker-compose up
```

### Vercel (Frontend)

```bash
# Deploy to Vercel
cd apps/web
vercel deploy
```

### Railway (Backend)

```bash
# Deploy to Railway
cd apps/backend
railway up
```

## Troubleshooting

### Database Connection Issues

```bash
cd apps/backend

# Check database URL
cat .env | grep DATABASE_URL

# Reset database
pnpm prisma db push --force-reset

# View database
pnpm prisma studio
```

### Build Issues

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

### Port Already in Use

```bash
# Backend (port 3001)
lsof -i :3001
kill -9 <PID>

# Frontend (port 3000)
lsof -i :3000
kill -9 <PID>
```

## Performance Optimization

- Code splitting with Next.js dynamic imports
- Redis caching for frequently accessed data
- Database query optimization with Prisma
- Image optimization with Next.js Image
- WebSocket for real-time updates
- ISR for static page regeneration

## Security Considerations

- Environment variables for sensitive data
- JWT tokens with expiration
- HTTPS enforcement in production
- Input validation with Zod
- SQL injection prevention via Prisma
- CORS configuration
- Rate limiting on API endpoints

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Create a pull request
5. Code review and merge

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Support

For issues or questions:
1. Check GitHub issues
2. Check documentation
3. Create a new issue with details

---

Happy coding! 🚀
