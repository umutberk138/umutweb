import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useI18n } from '../lib/i18n';

interface ChatMessage {
  id: string;
  alias: string;
  text: string;
  timestamp: any;
  avatarUrl?: string;
}

export const ShadowChat: React.FC<{ userAlias: string }> = ({ userAlias }) => {
  const { lang } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'shadow_chat'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'shadow_chat');
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'shadow_chat'), {
        alias: userAlias || (lang === 'TR' ? 'Anonim' : 'Anonymous'),
        text: input,
        timestamp: serverTimestamp()
      });
      setInput('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'shadow_chat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 border border-blue-500/10 rounded-[40px] overflow-hidden font-mono shadow-2xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
        <div className="flex items-center gap-3 text-blue-500">
           <MessageSquare size={20} />
           <span className="text-xs font-black uppercase tracking-[0.4em]">{lang === 'TR' ? 'GÖLGE_SOHBET_AKIŞI' : 'SHADOW_CHAT_FEED'}</span>
        </div>
        <span className="text-[9px] font-bold text-zinc-500 bg-zinc-800 px-2 py-1 rounded">{lang === 'TR' ? 'ŞİFRELENMİŞ_SSL_V3' : 'ENCRYPTED_SSL_V3'}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className="group animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 group-hover:border-blue-500/30 transition-all">
                  <User size={18} />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-[10px] font-black uppercase text-blue-500 tracking-tighter truncate">{msg.alias}</span>
                     <span className="text-[8px] text-zinc-600">
                        {msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleTimeString() : '...'}
                     </span>
                  </div>
                  <p className="text-sm text-zinc-400 font-medium leading-relaxed bg-zinc-900/50 p-3 rounded-2xl rounded-tl-none border border-white/5 group-hover:border-white/10 transition-all">
                    {msg.text}
                  </p>
               </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-6 bg-zinc-900/30 border-t border-white/5">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={lang === 'TR' ? 'Ağa yayın yap...' : 'Broadcast to the network...'}
            className="w-full bg-black border border-white/5 p-4 pr-12 rounded-2xl focus:outline-none focus:border-blue-500 text-sm font-bold text-white transition-all placeholder:text-zinc-700"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-500 text-zinc-950 rounded-xl hover:scale-105 transition-all disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
