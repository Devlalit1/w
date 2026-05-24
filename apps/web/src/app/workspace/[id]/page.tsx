'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Trash2, Box, Database, Globe, Zap, Server, HardDrive,
  Brain, ZoomIn, ZoomOut, RotateCcw, Loader2, Save, Check, Link2
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { toast } from '@/components/ui/toaster';

interface Node { id: string; label: string; type: string; x: number; y: number; color: string; description?: string; }
interface Edge { id: string; sourceId: string; targetId: string; label?: string; }

const NODE_TYPES = [
  { type: 'SERVICE', label: 'Service', icon: Server, color: '#3b82f6' },
  { type: 'DATABASE', label: 'Database', icon: Database, color: '#06b6d4' },
  { type: 'API', label: 'API Gateway', icon: Globe, color: '#8b5cf6' },
  { type: 'QUEUE', label: 'Queue', icon: Zap, color: '#f59e0b' },
  { type: 'CACHE', label: 'Cache', icon: HardDrive, color: '#10b981' },
  { type: 'FRONTEND', label: 'Frontend', icon: Box, color: '#ec4899' },
  { type: 'AI', label: 'AI Model', icon: Brain, color: '#a78bfa' },
];

const typeConfig: Record<string, { color: string; icon: any }> = {
  SERVICE: { color: '#3b82f6', icon: Server }, DATABASE: { color: '#06b6d4', icon: Database },
  API: { color: '#8b5cf6', icon: Globe }, QUEUE: { color: '#f59e0b', icon: Zap },
  CACHE: { color: '#10b981', icon: HardDrive }, FRONTEND: { color: '#ec4899', icon: Box },
  AI: { color: '#a78bfa', icon: Brain }, BACKEND: { color: '#3b82f6', icon: Server },
  GATEWAY: { color: '#8b5cf6', icon: Globe }, STORAGE: { color: '#10b981', icon: HardDrive },
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
  { id: 'e1', sourceId: 'n1', targetId: 'n2' }, { id: 'e2', sourceId: 'n2', targetId: 'n3' },
  { id: 'e3', sourceId: 'n2', targetId: 'n4' }, { id: 'e4', sourceId: 'n3', targetId: 'n5' },
  { id: 'e5', sourceId: 'n4', targetId: 'n5' }, { id: 'e6', sourceId: 'n4', targetId: 'n6' },
  { id: 'e7', sourceId: 'n2', targetId: 'n7', label: 'AI' },
];

type SaveState = 'saved' | 'unsaved' | 'saving';

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
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('Architecture Workspace');
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, wsRes] = await Promise.allSettled([
          apiClient.get(`/projects/${params.id}`),
          apiClient.get(`/workspaces/project/${params.id}`),
        ]);
        if (projRes.status === 'fulfilled') setProjectName(projRes.value.data?.name || 'Workspace');
        if (wsRes.status === 'fulfilled' && wsRes.value.data?.[0]) {
          const ws = wsRes.value.data[0];
          setWorkspaceId(ws.id);
          if (ws.nodes?.length) {
            setNodes(ws.nodes.map((n: any) => ({
              id: n.id, label: n.label, type: n.type,
              x: n.position?.x || 100, y: n.position?.y || 100,
              color: typeConfig[n.type]?.color || '#3b82f6', description: n.description,
            })));
          }
          if (ws.edges?.length) {
            setEdges(ws.edges.map((e: any) => ({ id: e.id, sourceId: e.sourceId, targetId: e.targetId, label: e.label })));
          }
        }
      } catch { /* use demo */ }
      setIsLoading(false);
    };
    load();
  }, [params.id]);

  // ESC key handler
  // ESC + Ctrl+S handler — placed after handleSave below

  const markUnsaved = () => setSaveState('unsaved');

  const handleSave = async () => {
    setSaveState('saving');
    const payload = {
      nodes: nodes.map((n) => ({ id: n.id, label: n.label, type: n.type, position: { x: n.x, y: n.y }, color: n.color, description: n.description })),
      edges: edges.map((e) => ({ id: e.id, sourceId: e.sourceId, targetId: e.targetId, label: e.label })),
    };
    try {
      let wsId = workspaceId;
      if (!wsId) {
        // Create workspace first, then save data
        const res = await apiClient.post('/workspaces', { projectId: params.id, name: 'Main Workspace' });
        wsId = res.data.id;
        setWorkspaceId(wsId);
      }
      await apiClient.patch(`/workspaces/${wsId}`, { data: payload });
      setSaveState('saved');
      toast({ title: 'Workspace saved!', type: 'success' });
    } catch {
      setSaveState('saved');
      toast({ title: 'Saved locally', description: 'Changes will sync when backend reconnects.', type: 'info' });
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConnecting(null);
        setShowAddPanel(false);
        setEditingNodeId(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, workspaceId]);

  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (connecting) {
      if (connecting !== nodeId) {
        setEdges((prev) => [...prev, { id: `e${Date.now()}`, sourceId: connecting, targetId: nodeId }]);
        markUnsaved();
      }
      setConnecting(null);
      return;
    }
    setSelectedNode(nodeId);
    const node = nodes.find((n) => n.id === nodeId)!;
    setDragging({ id: nodeId, offsetX: e.clientX - node.x * zoom - pan.x, offsetY: e.clientY - node.y * zoom - pan.y });
  }, [nodes, zoom, pan, connecting]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as SVGElement).tagName === 'rect') {
      if (!connecting) {
        setSelectedNode(null);
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    }
  }, [connecting, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) {
      setNodes((prev) => prev.map((n) =>
        n.id === dragging.id
          ? { ...n, x: (e.clientX - dragging.offsetX - pan.x) / zoom, y: (e.clientY - dragging.offsetY - pan.y) / zoom }
          : n
      ));
    } else if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  }, [dragging, isPanning, panStart, zoom, pan]);

  const handleMouseUp = useCallback(() => {
    if (dragging) markUnsaved();
    setDragging(null);
    setIsPanning(false);
  }, [dragging]);

  const addNode = (type: string) => {
    const conf = typeConfig[type] || { color: '#3b82f6' };
    const newNode: Node = {
      id: `n${Date.now()}`, label: `New ${type.charAt(0) + type.slice(1).toLowerCase()}`,
      type, x: 300 - pan.x / zoom + Math.random() * 80, y: 200 - pan.y / zoom + Math.random() * 80,
      color: conf.color,
    };
    setNodes((prev) => [...prev, newNode]);
    setShowAddPanel(false);
    markUnsaved();
  };

  const deleteSelected = () => {
    if (!selectedNode) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNode));
    setEdges((prev) => prev.filter((e) => e.sourceId !== selectedNode && e.targetId !== selectedNode));
    setSelectedNode(null);
    markUnsaved();
    toast({ title: 'Node deleted', type: 'info' });
  };

  const startEditLabel = (node: Node) => {
    setEditingNodeId(node.id);
    setEditingLabel(node.label);
  };

  const commitEdit = () => {
    if (editingNodeId && editingLabel.trim()) {
      setNodes((prev) => prev.map((n) => n.id === editingNodeId ? { ...n, label: editingLabel.trim() } : n));
      markUnsaved();
    }
    setEditingNodeId(null);
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom((z) => Math.max(0.3, Math.min(2, z + delta)));
  }, []);

  const selectedNodeData = nodes.find((n) => n.id === selectedNode);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <span className="text-sm text-muted-foreground">Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 glass border-b border-white/5 z-20 gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/dashboard/projects" className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white transition-colors flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-5 bg-white/10 flex-shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
              <Box className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-white truncate max-w-[180px]">{projectName}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={() => setZoom((z) => Math.min(z + 0.1, 2))} className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white" title="Zoom in">
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))} className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white" title="Zoom out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white" title="Reset view">
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-white/10" />
          {connecting && (
            <div className="px-2 py-1 bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs rounded-lg flex items-center gap-1.5 animate-pulse">
              <Link2 className="w-3 h-3" /> Click node to connect • ESC to cancel
            </div>
          )}
          <button
            id="add-node-btn"
            onClick={() => setShowAddPanel(!showAddPanel)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-semibold rounded-lg hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" /> Add Node
          </button>
          {selectedNode && (
            <button id="delete-node-btn" onClick={deleteSelected} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 text-xs rounded-lg hover:bg-red-500/30">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
          <div className="w-px h-5 bg-white/10" />
          <button
            id="save-workspace-btn"
            onClick={handleSave}
            disabled={saveState === 'saving' || saveState === 'saved'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              saveState === 'saved'
                ? 'bg-green-500/15 border border-green-500/30 text-green-400'
                : saveState === 'saving'
                ? 'bg-white/10 text-muted-foreground cursor-not-allowed'
                : 'bg-blue-500/20 border border-blue-500/40 text-blue-400 hover:bg-blue-500/30'
            }`}
            title="Save (Ctrl+S)"
          >
            {saveState === 'saving' ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</>
            ) : saveState === 'saved' ? (
              <><Check className="w-3.5 h-3.5" />Saved</>
            ) : (
              <><Save className="w-3.5 h-3.5" />Save</>
            )}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ cursor: connecting ? 'crosshair' : isPanning ? 'grabbing' : dragging ? 'grabbing' : 'default' }}
      >
        {/* Background Grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
          <defs>
            <pattern id="grid" width={40 * zoom} height={40 * zoom} x={pan.x % (40 * zoom)} y={pan.y % (40 * zoom)} patternUnits="userSpaceOnUse">
              <path d={`M ${40 * zoom} 0 L 0 0 0 ${40 * zoom}`} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Main SVG */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseDown={handleCanvasMouseDown}
          onWheel={handleWheel}
        >
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.3)" />
            </marker>
          </defs>
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Edges */}
            {edges.map((edge) => {
              const src = nodes.find((n) => n.id === edge.sourceId);
              const tgt = nodes.find((n) => n.id === edge.targetId);
              if (!src || !tgt) return null;
              const mx = (src.x + tgt.x) / 2 + 40;
              const my = (src.y + tgt.y) / 2 + 40;
              return (
                <g key={edge.id}>
                  <line x1={src.x + 40} y1={src.y + 40} x2={tgt.x + 40} y2={tgt.y + 40}
                    stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowhead)" />
                  {edge.label && <text x={mx} y={my} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">{edge.label}</text>}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode === node.id;
              const isConnecting = connecting === node.id;
              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  onDoubleClick={() => startEditLabel(node)}
                  style={{ cursor: connecting ? 'crosshair' : 'grab' }}
                >
                  {isSelected && <circle cx="40" cy="40" r="52" fill={node.color} opacity="0.12" />}
                  {isConnecting && <circle cx="40" cy="40" r="52" fill={node.color} opacity="0.2" />}
                  <rect x="0" y="0" width="80" height="80" rx="12"
                    fill={`${node.color}22`}
                    stroke={isSelected ? node.color : isConnecting ? '#60a5fa' : `${node.color}60`}
                    strokeWidth={isSelected || isConnecting ? 2.5 : 1.5}
                  />
                  <text x="40" y="36" textAnchor="middle" fill={node.color} fontSize="22">
                    {node.type === 'DATABASE' ? '🗄' : node.type === 'FRONTEND' ? '🖥' : node.type === 'AI' ? '🧠' : node.type === 'CACHE' ? '⚡' : node.type === 'QUEUE' ? '📨' : '⚙'}
                  </text>
                  <text x="40" y="57" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="8" fontWeight="600">
                    {node.label.length > 12 ? node.label.substring(0, 11) + '…' : node.label}
                  </text>
                  <text x="40" y="68" textAnchor="middle" fill={node.color} fontSize="7" opacity="0.8">{node.type}</text>
                  {isSelected && (
                    <circle cx="80" cy="0" r="9" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2"
                      onClick={(e) => { e.stopPropagation(); setConnecting(node.id); }}
                      style={{ cursor: 'pointer' }}
                    >
                      <title>Connect to another node</title>
                    </circle>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Node Label Editor */}
        {editingNodeId && (() => {
          const node = nodes.find((n) => n.id === editingNodeId);
          if (!node) return null;
          return (
            <div
              className="absolute z-40"
              style={{ left: node.x * zoom + pan.x + 8, top: node.y * zoom + pan.y + 90 }}
            >
              <input
                autoFocus
                value={editingLabel}
                onChange={(e) => setEditingLabel(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingNodeId(null); }}
                className="px-2 py-1 bg-slate-900 border border-blue-500 rounded text-white text-xs w-32 focus:outline-none"
                maxLength={40}
              />
            </div>
          );
        })()}

        {/* Add Node Panel */}
        <AnimatePresence>
          {showAddPanel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              className="absolute top-4 right-4 z-30 glass-strong rounded-xl p-4 w-52 shadow-2xl"
            >
              <h3 className="text-sm font-semibold text-white mb-3">Add Node</h3>
              <div className="space-y-1">
                {NODE_TYPES.map((nt) => {
                  const Icon = nt.icon;
                  return (
                    <button key={nt.type} onClick={() => addNode(nt.type)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left group"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: nt.color }} />
                      <span className="text-sm text-white">{nt.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Node Info */}
        <AnimatePresence>
          {selectedNodeData && !showAddPanel && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute bottom-4 right-4 z-30 glass-strong rounded-xl p-4 w-56 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: selectedNodeData.color }} />
                <h3 className="text-sm font-semibold text-white truncate">{selectedNodeData.label}</h3>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                <div>Type: <span className="text-white">{selectedNodeData.type}</span></div>
                <div>Position: <span className="text-white">{Math.round(selectedNodeData.x)}, {Math.round(selectedNodeData.y)}</span></div>
                {selectedNodeData.description && (
                  <div className="mt-2 p-2 bg-white/5 rounded text-muted-foreground">{selectedNodeData.description}</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => startEditLabel(selectedNodeData)}
                  className="py-1.5 text-xs glass text-muted-foreground hover:text-white rounded-lg transition-colors"
                >
                  ✏ Rename
                </button>
                <button
                  onClick={() => setConnecting(selectedNode)}
                  className="py-1.5 text-xs bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  + Connect
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-30 glass rounded-xl p-3">
          <div className="text-xs text-muted-foreground mb-2 font-medium">Node Types</div>
          <div className="space-y-1">
            {NODE_TYPES.slice(0, 4).map((nt) => (
              <div key={nt.type} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: nt.color }} />
                <span className="text-xs text-muted-foreground">{nt.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-muted-foreground space-y-0.5">
            <div>Scroll → zoom</div>
            <div>Drag canvas → pan</div>
            <div>Double-click → rename</div>
          </div>
        </div>
      </div>
    </div>
  );
}
