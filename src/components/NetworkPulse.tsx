import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Registration } from '../types';
import { Activity, Globe, Shield } from 'lucide-react';

export const NetworkPulse: React.FC = () => {
  const [recentNodes, setRecentNodes] = useState<Registration[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'registrations'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
      setRecentNodes(data);
    });

    return () => unsub();
  }, []);

  return (
    <div className="space-y-4">
      {recentNodes.map((node, i) => (
        <div 
          key={node.id} 
          className="flex items-center gap-4 p-4 bg-zinc-950/50 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all animate-in fade-in slide-in-from-right duration-500"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 border border-emerald-500/20 flex items-center justify-center shrink-0">
            {node.mugshotUrl ? (
              <img src={node.mugshotUrl} alt={node.alias} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Globe size={16} className="text-emerald-500/50" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-black uppercase text-white truncate">{node.alias}</span>
              <span className="text-[10px] font-mono text-zinc-600">
                {new Date(node.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[9px] font-mono text-emerald-500/60 uppercase tracking-widest">{node.city || 'NODE'} // {node.country || 'UNKNOWN'}</span>
               <div className="h-1 w-1 rounded-full bg-zinc-800" />
               <span className="text-[9px] font-mono text-zinc-500 uppercase">{node.ip.split('.').slice(0, 2).join('.')}.X.X</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
             <Shield size={10} className="text-emerald-500" />
             <span className="text-[8px] font-black italic text-emerald-400">ACTIVE</span>
          </div>
        </div>
      ))}
      
      {recentNodes.length === 0 && (
         <div className="p-8 text-center border border-dashed border-white/5 rounded-3xl opacity-30">
            <Activity className="mx-auto mb-2 text-zinc-500" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Scanning for new uplinks...</span>
         </div>
      )}
    </div>
  );
};
