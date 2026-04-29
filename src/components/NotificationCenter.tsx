import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { SystemNotification } from '../types';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useI18n } from '../lib/i18n';

export const NotificationCenter: React.FC = () => {
  const { lang } = useI18n();
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  useEffect(() => {
    // Listen for new messages globally and show as notifications
    const q = query(collection(db, 'shadow_chat'), orderBy('timestamp', 'desc'), limit(1));
    let isInitial = true;

    const unsubscribe = onSnapshot(q, (snap) => {
      if (isInitial) {
        isInitial = false;
        return;
      }
      
      if (!snap.empty) {
        const data = snap.docs[0].data();
        const alias = data.alias || (lang === 'TR' ? 'Bilinmeyen' : 'Unknown');
        const newNotif: SystemNotification = {
          id: snap.docs[0].id,
          title: lang === 'TR' ? `${alias} Kişisinden Yeni İleti` : `New Transmission from ${alias}`,
          message: (data.text || '').length > 50 ? (data.text || '').substring(0, 50) + '...' : (data.text || ''),
          type: data.isSystem ? 'alert' : 'success',
          timestamp: Date.now()
        };
        
        setNotifications(prev => [newNotif, ...prev].slice(0, 3));
        
        // Auto remove after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
        }, 5000);
      }
    });

    return () => unsubscribe();
  }, [lang]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl min-w-[280px] flex items-start gap-4 ${
              n.type === 'success' 
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-100' 
                : n.type === 'alert'
                ? 'bg-rose-950/80 border-rose-500/30 text-rose-100'
                : 'bg-zinc-900/80 border-zinc-700 text-zinc-100'
            }`}
          >
            <div className={`p-2 rounded-xl scale-90 ${
              n.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
              n.type === 'alert' ? 'bg-rose-500/20 text-rose-400' : 'bg-zinc-800 text-zinc-400'
            }`}>
              {n.type === 'success' ? <CheckCircle size={18} /> : 
               n.type === 'alert' ? <AlertTriangle size={18} /> : <Info size={18} />}
            </div>
            
            <div className="flex-1">
              <h4 className="text-[10px] font-black uppercase tracking-wider mb-0.5 opacity-80">{n.title}</h4>
              <p className="text-sm font-medium leading-tight">{n.message}</p>
            </div>
            
            <button 
              onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
              className="text-zinc-500 hover:text-zinc-200"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
