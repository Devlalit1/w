// Shared TypeScript types for DevVerse AI

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  avatar: string | null;
  members: TeamMember[];
  createdAt: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user?: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdBy: string;
  teamId: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  creator?: Pick<User, 'id' | 'name' | 'avatar'>;
  workspaces?: Workspace[];
}

export interface Workspace {
  id: string;
  name: string;
  projectId: string;
  ownerId: string;
  isPublic: boolean;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  nodes: WorkspaceNode[];
  edges: WorkspaceEdge[];
  project?: Pick<Project, 'id' | 'name'>;
  owner?: Pick<User, 'id' | 'name' | 'avatar'>;
}

export type NodeType = 'SERVICE' | 'DATABASE' | 'API' | 'QUEUE' | 'CACHE' | 'FRONTEND' | 'BACKEND' | 'GATEWAY' | 'STORAGE' | 'EXTERNAL';
export type EdgeType = 'CONNECTION' | 'DEPENDENCY' | 'DATAFLOW' | 'SYNC' | 'ASYNC';

export interface WorkspaceNode {
  id: string;
  workspaceId: string;
  type: NodeType;
  label: string;
  description: string | null;
  position: { x: number; y: number; z: number };
  data: Record<string, any>;
  color: string | null;
}

export interface WorkspaceEdge {
  id: string;
  workspaceId: string;
  sourceId: string;
  targetId: string;
  type: EdgeType;
  label: string | null;
}

export interface AIAnalysis {
  id: string;
  projectId: string;
  type: 'ARCHITECTURE' | 'DOCUMENTATION' | 'COMPLEXITY' | 'SECURITY' | 'PERFORMANCE';
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  result: Record<string, any>;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Pick<User, 'id' | 'email' | 'name' | 'role' | 'avatar'>;
}
