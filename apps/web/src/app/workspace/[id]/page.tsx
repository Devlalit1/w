'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Plus, Trash2, Box, Database, Globe, Zap, Server, HardDrive,
  Brain, ZoomIn, ZoomOut, RotateCcw, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';

interface Node {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  color: string;
  description?: string;
}

interface Edge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

const NODE_TYPES = [
  { type: 'SERVICE', label: 'Service', icon: Server, color: '#3b82f6' },
  { type: 'DATABASE', label: 'Database', icon: Database, color: '#06b6d4' },
  { type: 'API', label: 'API', icon: Globe, color: '#8b5cf6' },
  { type: 'QUEUE', label: 'Queue', icon: Zap, color: '#f59e0b' },
  { type: 'CACHE', label: 'Cache', icon: HardDrive, color: '#10b981' },
  { type: 'FRONTEND', label: 'Frontend', icon: Box, color: '#ec4899' },
  { type: 'AI', label: 'AI Model', icon: Brain, color: '#a78bfa' },
];

const typeConfig: Record<string, { color: string; icon: any }> = {
  SERVICE: { color: '#3b82f6', icon: Server },
  DATABASE: { color: '#06b6d4', icon: Database },
  API: { color: '#8b5cf6', icon: Globe },
  QUEUE: { color: '#f59e0b', icon: Zap },
  CACHE: { color: '#10b981', icon: HardDrive },
  FRONTEND: { color: '#ec4899', icon: Box },
  AI: { color: '#a78bfa', icon: Brain },
  BACKEND: { color: '#3b82f6', icon: Server },
  GATEWAY: { color: '#8b5cf6', icon: Globe },
  STORAGE: { color: '#10b981', icon: HardDrive },
  EXTERNAL: { color: '#6b7280', icon: Globe },
};

const DEMO_NODES: Node[] = [
  { id: 'n1', label: 'React Frontend', type: 'FRONTEND', x: 120, y: 100, color: '#ec4899' },
  { id: 'n2', label: 'API Gateway', type: 'API', x: 350, y: 100, color: '#8b5cf6' },
  { id: 'n3', label: 'Auth Service', type: 'SERVICE', x: 220, y: 280, color: '#3b82f6', description: 'JWT + OAuth' },
  { id: 'n4', label: 'User Service', type: 'SERVICE', x: 480, y: 280, color: '#3b82f6' },
  { id: 'n5', label: 'PostgreSQL', type: 'DATABASE', x: 350, y: 440, color: '#06b6d4' },
  { id: 'n6', label: 'Redis Cache', type: 'CACHE', x: 600, y: 440, color: '#10b981' },
  { id: 'n7', label: 'Gemini AI', type: 'AI', x: 620, y: 100, color: '#a78bfa', description: 'AI Analysis' },
];

const DEMO_EDGES: Edge[] = [
  { id: 'e1', sourceId: 'n1', targetId: 'n2' },
  { id: 'e2', sourceId: 'n2', targetId: 'n3' },
  { id: 'e3', sourceId: 'n2', targetId: 'n4' },
  { id: 'e4', sourceId: 'n3', targetId: 'n5' },
  { id: 'e5', sourceId: 'n4', targetId: 'n5' },
  { id: 'e6', sourceId: 'n4', targetId: 'n6' },
  { id: 'e7', sourceId: 'n2', targetId: 'n7', label: 'AI' },
];

export default function WorkspacePage() {
  const params = useParams();
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>(DEMO_NODES);
  const [edges, setEdges] = useState<Edge[]>(DEMO_EDGES);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('Architecture Workspace');
  const [isSaving] = useState(false);

  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        const [projRes, wsRes] = await Promise.allSettled([
          apiClient.get(`/projects/${params.id}`),
          apiClient.get(`/workspaces/project/${params.id}`),
        ]);
        if (projRes.status === 'fulfilled') setProjectName(projRes.value.data?.name || 'Workspace');
        if (wsRes.status === 'fulfilled' && wsRes.value.data?.[0]) {
          const ws = wsRes.value.data[0];
          if (ws.nodes?.length) {
            setNodes(ws.nodes.map((n: any) => ({
              id: n.id, label: n.label, type: n.type,
              x: n.position?.x || 100, y: n.position?.y || 100,
              color: typeConfig[n.type]?.color || '#3b82f6',
              description: n.description,
            })));
          }
          if (ws.edges?.length) {
            setEdges(ws.edges.map((e: any) => ({
              id: e.id, sourceId: e.sourceId, targetId: e.targetId, label: e.label,
            })));
          }
        }
      } catch { /* use demo data */ }
      setIsLoading(false);
    };
    loadWorkspace();
  }, [params.id]);

  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (connecting) {
      if (connecting !== nodeId) {
        const newEdge: Edge = { id: `e${Date.now()}`, sourceId: connecting, targetId: nodeId };
        setEdges((prev) => [...prev, newEdge]);
      }
      setConnecting(null);
      return;
    }
    setSelectedNode(nodeId);
    const node = nodes.find((n) => n.id === nodeId)!;
    setDragging({ id: nodeId, offsetX: e.clientX - node.x * zoom - pan.x, offsetY: e.clientY - node.y * zoom - pan.y });
  }, [nodes, zoom, pan, connecting]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === dragging.id
          ? { ...n, x: (e.clientX - dragging.offsetX - pan.x) / zoom, y: (e.clientY - dragging.offsetY - pan.y) / zoom }
          : n
      )
    );
  }, [dragging, zoom, pan]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const addNode = (type: string) => {
    const conf = typeConfig[type] || { color: '#3b82f6', icon: Box };
    const newNode: Node = {
      id: `n${Date.now()}`,
      label: `New ${type.charAt(0) + type.slice(1).toLowerCase()}`,
      type,
      x: 300 + Math.random() * 100,
      y: 200 + Math.random() * 100,
      color: conf.color,
    };
    setNodes((prev) => [...prev, newNode]);
    setShowAddPanel(false);
  };

  const deleteSelected = () => {
    if (!selectedNode) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNode));
    setEdges((prev) => prev.filter((e) => e.sourceId !== selectedNode && e.targetId !== selectedNode));
    setSelectedNode(null);
  };

  const selectedNodeData = nodes.find((n) => n.id === selectedNode);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 glass border-b border-white/5 z-20">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/projects" className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Box className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-white">{projectName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setZoom((z) => Math.min(z + 0.1, 2))} className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white">
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))} className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white">
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-white/10" />
          <button
            onClick={() => setShowAddPanel(!showAddPanel)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-semibold rounded-lg hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" /> Add Node
          </button>
          {selectedNode && (
            <button onClick={deleteSelected} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 text-xs rounded-lg hover:bg-red-500/30">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden" style={{ cursor: connecting ? 'crosshair' : dragging ? 'grabbing' : 'default' }}>
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Main SVG Canvas */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={() => { if (!connecting) setSelectedNode(null); }}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Edges */}
            {edges.map((edge) => {
              const src = nodes.find((n) => n.id === edge.sourceId);
              const tgt = nodes.find((n) => n.id === edge.targetId);
              if (!src || !tgt) return null;
              const mx = (src.x + tgt.x) / 2;
              const my = (src.y + tgt.y) / 2;
              return (
                <g key={edge.id}>
                  <line
                    x1={src.x + 40} y1={src.y + 40}
                    x2={tgt.x + 40} y2={tgt.y + 40}
                    stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
                    strokeDasharray="4 4"
                    markerEnd="url(#arrowhead)"
                  />
                  {edge.label && (
                    <text x={mx + 40} y={my + 40} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Arrow marker */}
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.3)" />
              </marker>
            </defs>

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode === node.id;
              const conf = typeConfig[node.type] || { color: '#3b82f6', icon: Box };
              const Icon = conf.icon;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  style={{ cursor: 'grab' }}
                >
                  {/* Glow */}
                  {isSelected && (
                    <circle cx="40" cy="40" r="48" fill={node.color} opacity="0.15" />
                  )}

                  {/* Box */}
                  <rect
                    x="0" y="0" width="80" height="80" rx="12"
                    fill={`${node.color}22`}
                    stroke={isSelected ? node.color : `${node.color}60`}
                    strokeWidth={isSelected ? 2 : 1.5}
                  />

                  {/* Icon text placeholder */}
                  <text x="40" y="34" textAnchor="middle" fill={node.color} fontSize="20">⬡</text>

                  {/* Label */}
                  <text x="40" y="55" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="8" fontWeight="500">
                    {node.label.length > 12 ? node.label.substring(0, 11) + '…' : node.label}
                  </text>
                  <text x="40" y="67" textAnchor="middle" fill={node.color} fontSize="7" opacity="0.8">
                    {node.type}
                  </text>

                  {/* Connect button on hover */}
                  {isSelected && (
                    <circle
                      cx="80" cy="0" r="8"
                      fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2"
                      onClick={(e) => { e.stopPropagation(); setConnecting(node.id); }}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Add Node Panel */}
        {showAddPanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-4 right-4 z-30 glass-strong rounded-xl p-4 w-52"
          >
            <h3 className="text-sm font-semibold text-white mb-3">Add Node</h3>
            <div className="space-y-1">
              {NODE_TYPES.map((nt) => {
                const Icon = nt.icon;
                return (
                  <button
                    key={nt.type}
                    onClick={() => addNode(nt.type)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
                  >
                    <Icon className="w-4 h-4" style={{ color: nt.color }} />
                    <span className="text-sm text-white">{nt.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Selected Node Info */}
        {selectedNodeData && !showAddPanel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute bottom-4 right-4 z-30 glass-strong rounded-xl p-4 w-56"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ background: selectedNodeData.color }} />
              <h3 className="text-sm font-semibold text-white">{selectedNodeData.label}</h3>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div>Type: <span className="text-white">{selectedNodeData.type}</span></div>
              <div>Position: <span className="text-white">{Math.round(selectedNodeData.x)}, {Math.round(selectedNodeData.y)}</span></div>
              {selectedNodeData.description && (
                <div className="mt-2 p-2 bg-white/5 rounded text-muted-foreground">{selectedNodeData.description}</div>
              )}
            </div>
            <button
              onClick={() => setConnecting(selectedNode)}
              className="mt-3 w-full py-1.5 text-xs bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              + Connect to...
            </button>
          </motion.div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-30 glass rounded-xl p-3">
          <div className="text-xs text-muted-foreground mb-2 font-medium">Legend</div>
          <div className="space-y-1">
            {NODE_TYPES.slice(0, 4).map((nt) => (
              <div key={nt.type} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: nt.color }} />
                <span className="text-xs text-muted-foreground">{nt.label}</span>
              </div>
            ))}
          </div>
        </div>

        {connecting && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 glass rounded-xl px-4 py-2 text-sm text-blue-400 border border-blue-500/30">
            Click another node to connect, or press Escape to cancel
          </div>
        )}
      </div>
    </div>
  );
}
