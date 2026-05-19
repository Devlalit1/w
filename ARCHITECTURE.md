# DevVerse AI - System Architecture

## Overview

DevVerse AI is a modern, scalable SaaS application built with a microservices-inspired monorepo architecture. It provides AI-powered 3D visualization of software architectures with real-time collaboration.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Pages      │  │ Components   │  │  3D Viewer   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Zustand     │  │  React Query │  │ Socket.io    │       │
│  │  Store       │  │  Client      │  │  Client      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                           │ HTTP/WS
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (NestJS)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Auth     │  │ Projects │  │ Teams    │  │ AI       │     │
│  │ Controller│ │Controller│  │Controller│  │Controller│     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Users    │  │Workspaces│  │ WebSocket│  │  Files   │     │
│  │ Service  │  │ Service  │  │ Gateway  │  │ Service  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────┘
        │                       │                    │
        ├────────┬──────────────┘                    │
        │        │                                  │
┌───────┴──────┐ │  ┌──────────────────┐    ┌────────────────┐
│  PostgreSQL  │ │  │  Redis Cache     │    │ File Storage   │
│  Database    │ │  │  (Sessions, etc) │    │ (S3 or local)  │
└──────────────┘ │  └──────────────────┘    └────────────────┘
                 │
         ┌───────┴──────────┐
         │                  │
    ┌────────────────┐ ┌─────────────────┐
    │ FastAPI AI     │ │ Job Queue       │
    │ Service        │ │ (Background     │
    │ - Analysis     │ │ Jobs)           │
    │ - Documentation│ └─────────────────┘
    │ - Complexity   │
    └────────────────┘
```

## Technology Stack

### Frontend Layer
- **Framework**: Next.js 15 (React 19)
- **Styling**: TailwindCSS + shadcn/ui
- **3D Graphics**: Three.js + React Three Fiber
- **State**: Zustand
- **API Client**: Axios + React Query
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Real-time**: Socket.io Client

### Backend Layer
- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Cache**: Redis
- **Auth**: JWT + Passport
- **Real-time**: Socket.io Server
- **File Upload**: Express Multer

### AI Layer
- **Framework**: FastAPI
- **AI Models**: OpenAI API + LangChain
- **Async**: Celery (optional)
- **Task Queue**: Redis (RQ or Celery)

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (Frontend) + Railway (Backend)
- **Monitoring**: Cloud provider metrics

## Module Architecture

### Backend Modules

#### 1. Auth Module
- Registration and login
- JWT token generation
- OAuth integration (Google, GitHub)
- Password hashing with bcrypt
- Role-based access control

#### 2. Users Module
- User profile management
- User settings
- Activity logging
- User deletion (soft delete)

#### 3. Teams Module
- Team creation and management
- Team members management
- Team permissions
- Team invitations

#### 4. Projects Module
- Project CRUD operations
- Project ownership
- Team project association
- Project settings

#### 5. Workspaces Module
- Workspace management
- Node and edge management (3D graph)
- Workspace history (undo/redo)
- Real-time collaboration

#### 6. AI Module
- Architecture analysis
- Documentation generation
- Code complexity analysis
- API analysis
- Integration with FastAPI service

#### 7. WebSocket Gateway
- Real-time cursor positions
- Live node updates
- Collaboration notifications
- Presence awareness

### Frontend Pages/Screens

#### Authentication
- `/auth/login` - Login page
- `/auth/signup` - Registration page
- `/auth/forgot-password` - Password reset

#### Dashboard
- `/dashboard` - Main dashboard
- `/dashboard/projects` - Projects list
- `/dashboard/teams` - Teams management
- `/dashboard/settings` - User settings

#### Workspace
- `/workspace/[id]` - 3D visualization
- `/workspace/[id]/collaborate` - Collaboration mode
- `/workspace/[id]/settings` - Workspace settings
- `/workspace/[id]/share` - Share options

#### Shared/Documentation
- `/` - Landing page
- `/pricing` - Pricing page
- `/docs` - Documentation
- `/about` - About page

## Data Models

### Core Entities

```
User
├── id (PK)
├── email (unique)
├── password (hashed)
├── name
├── avatar
├── role
├── createdAt
├── updatedAt
└── deletedAt (soft delete)

Team
├── id (PK)
├── name
├── slug (unique)
├── avatar
├── members (TeamMember[])
└── projects (Project[])

Project
├── id (PK)
├── name
├── slug
├── description
├── createdBy (FK: User)
├── teamId (FK: Team)
├── workspaces (Workspace[])
└── files (ProjectFile[])

Workspace
├── id (PK)
├── name
├── projectId (FK: Project)
├── ownerId (FK: User)
├── data (JSON)
├── nodes (WorkspaceNode[])
├── edges (WorkspaceEdge[])
├── collaborations (Collaboration[])
└── history (WorkspaceHistory[])

WorkspaceNode
├── id (PK)
├── workspaceId (FK: Workspace)
├── type (SERVICE|DATABASE|API|...)
├── label
├── position (JSON: {x, y, z})
├── data (JSON)
└── edges (WorkspaceEdge[])

WorkspaceEdge
├── id (PK)
├── workspaceId (FK: Workspace)
├── sourceId (FK: WorkspaceNode)
├── targetId (FK: WorkspaceNode)
├── type (CONNECTION|DEPENDENCY|...)
└── label
```

## API Response Format

All API responses follow a standard format:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    // Response payload
  },
  "timestamp": "2026-05-19T10:30:00Z"
}
```

## Authentication Flow

```
1. User registers/logs in
   │
   ├─ Backend validates credentials
   ├─ Generates JWT token
   └─ Returns token to frontend
   
2. Frontend stores token in localStorage
   
3. Subsequent requests include token
   │
   ├─ Backend verifies JWT
   ├─ Extracts user info
   └─ Processes request
   
4. Token expires
   │
   ├─ Frontend detects 401 error
   ├─ Redirects to login
   └─ User logs in again
```

## Real-time Communication

WebSocket events for real-time collaboration:

```
Client → Server:
- 'cursor:move' - Cursor position update
- 'node:create' - New node created
- 'node:update' - Node updated
- 'node:delete' - Node deleted
- 'edge:create' - New edge created
- 'collaboration:join' - User joined
- 'collaboration:leave' - User left

Server → Client (Broadcast):
- 'cursor:updated' - Other user's cursor moved
- 'node:created' - Node created by other user
- 'node:updated' - Node updated by other user
- 'user:joined' - User joined workspace
- 'user:left' - User left workspace
```

## Performance Considerations

1. **Database**
   - Indexes on frequently queried columns
   - Connection pooling with Redis
   - Query optimization with Prisma

2. **Frontend**
   - Code splitting with dynamic imports
   - Image optimization
   - Lazy loading for heavy components
   - Memoization of expensive components

3. **Backend**
   - Redis caching for user sessions
   - API response caching
   - Background job processing
   - Connection pooling

4. **3D Rendering**
   - LOD (Level of Detail) for nodes
   - Frustum culling
   - Virtual scrolling for large graphs
   - WebGL optimization

## Security Architecture

1. **Authentication**
   - JWT with short expiration
   - Refresh token mechanism
   - OAuth for social login

2. **Authorization**
   - Role-based access control (RBAC)
   - Resource ownership validation
   - Team permissions

3. **Data Protection**
   - HTTPS/TLS encryption
   - Password hashing (bcrypt)
   - SQL injection prevention (Prisma)
   - XSS prevention (React escaping)
   - CSRF tokens

4. **Rate Limiting**
   - API endpoint rate limiting
   - File upload size limits
   - WebSocket message rate limiting

## Scalability Strategy

1. **Horizontal Scaling**
   - Stateless backend services
   - Redis session store
   - Database read replicas

2. **Vertical Scaling**
   - Optimized database queries
   - Caching strategies
   - Connection pooling

3. **Future Enhancements**
   - Kubernetes deployment
   - Microservices separation
   - Event-driven architecture
   - Message queues (RabbitMQ, Kafka)

---

This architecture provides a solid foundation for a scalable, maintainable SaaS application.
