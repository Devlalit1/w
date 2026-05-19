'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
}

let toastQueue: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

export function toast({ title, description, type = 'info' }: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).slice(2);
  toastQueue = [...toastQueue, { id, title, description, type }];
  listeners.forEach((l) => l(toastQueue));
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    listeners.forEach((l) => l(toastQueue));
  }, 4000);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => { listeners = listeners.filter((l) => l !== setToasts); };
  }, []);

  const colors = { success: 'border-green-500/30 bg-green-500/10 text-green-400', error: 'border-red-500/30 bg-red-500/10 text-red-400', info: 'border-blue-500/30 bg-blue-500/10 text-blue-400' };

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl w-72 ${colors[t.type]} animate-slide-up`}>
          <div className="flex-1">
            <div className="font-medium text-sm text-white">{t.title}</div>
            {t.description && <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>}
          </div>
          <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
            <X className="w-3.5 h-3.5 text-muted-foreground hover:text-white" />
          </button>
        </div>
      ))}
    </div>
  );
}
