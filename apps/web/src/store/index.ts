import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

interface WorkspaceNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  color: string;
}

interface WorkspaceState {
  nodes: WorkspaceNode[];
  edges: any[];
  selectedNodeId: string | null;
  addNode: (node: WorkspaceNode) => void;
  updateNode: (id: string, updates: Partial<WorkspaceNode>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: any) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  clearWorkspace: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'devverse-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  updateNode: (id, updates) =>
    set((state) => ({ nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)) })),
  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.sourceId !== id && e.targetId !== id),
    })),
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
  removeEdge: (id) => set((state) => ({ edges: state.edges.filter((e) => e.id !== id) })),
  selectNode: (id) => set({ selectedNodeId: id }),
  clearWorkspace: () => set({ nodes: [], edges: [], selectedNodeId: null }),
}));
