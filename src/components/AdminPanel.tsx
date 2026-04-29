import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { Lock, Eye, EyeOff, Shield, Database, Users, MapPin, Monitor, Trash2, ChevronRight, Activity, Terminal as TerminalIcon } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Registration } from '../types';

export const AdminPanel: React.FC = () => {
  const { t, lang } = useI18n();
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nodes, setNodes] = useState<Registration[]>([]);
  const [selectedNode, setSelectedNode] = useState<Registration | null>(null);

  useEffect(() => {
    if (isAuthorized) {
      const q = query(collection(db, 'registrations'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
        setNodes(data);
      });
      return () => unsubscribe();
    }
  }, [isAuthorized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'umut') {
      setIsAuthorized(true);
    } else {
      alert(lang === 'TR' ? 'ERİŞİM ENGELLENDİ: GEÇERSİZ ANAHTAR' : 'ACCESS DENIED: INVALID KEY');
    }
  };

  const deleteNode = async (id: string) => {
    if (window.confirm(t('admin.delete_confirm'))) {
      await deleteDoc(doc(db, 'registrations', id));
      if (selectedNode?.id === id) setSelectedNode(null);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-10 rounded-[40px] w-full max-w-md border border-rose-500/10"
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
              <Shield size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">{t('admin.restricted')}</h2>
              <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-1">{t('admin.auth_needed')}</p>
            </div>
            
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder={t('admin.password_placeholder')}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/5 p-4 rounded-xl focus:outline-none focus:border-rose-500 text-white font-bold transition-all pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button className="w-full py-4 bg-rose-500 text-zinc-950 font-black italic uppercase tracking-widest rounded-xl hover:bg-rose-400 transition-all shadow-xl shadow-rose-500/10">
                {t('admin.login_button')}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-emerald-500 animate-pulse" size={16} />
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-emerald-500/60">{t('admin.subtitle')}</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">{t('admin.title').split(' ')[0]} <span className="text-emerald-500">{t('admin.title').split(' ').slice(1).join(' ')}</span></h1>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-zinc-900 border border-white/5 rounded-2xl text-right">
             <div className="text-[9px] text-zinc-500 font-black uppercase">{t('admin.active_nodes')}</div>
             <div className="text-xl font-black text-white">{nodes.length}</div>
          </div>
          <div className="px-6 py-3 bg-zinc-900 border border-white/5 rounded-2xl text-right">
             <div className="text-[9px] text-zinc-500 font-black uppercase">{lang === 'TR' ? 'Admin Yetkisi' : 'Admin Auth'}</div>
             <div className="text-xl font-black text-emerald-500 underline decoration-emerald-500/20 underline-offset-4 font-mono">ROOT</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Node List */}
        <div className="lg:col-span-1 glass-panel rounded-3xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
              <Users size={14} /> {t('admin.nodes_title')}
            </h3>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {nodes.length === 0 ? (
              <div className="p-8 text-center text-zinc-600 font-mono text-[10px] uppercase">{lang === 'TR' ? 'Kayıtlı düğüm yok' : 'No nodes registered'}</div>
            ) : (
              nodes.map((node) => (
                <button 
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`w-full p-4 border-b border-white/5 text-left transition-all flex items-center justify-between group ${selectedNode?.id === node.id ? 'bg-emerald-500/10 border-l-2 border-l-emerald-500' : 'hover:bg-white/[0.02]'}`}
                >
                  <div>
                    <div className="text-sm font-black italic uppercase text-white group-hover:text-emerald-400">{node.alias}</div>
                    <div className="text-[10px] font-mono text-zinc-600 mt-0.5">{node.ip}</div>
                  </div>
                  <ChevronRight size={16} className={`text-zinc-700 transition-transform ${selectedNode?.id === node.id ? 'translate-x-1 text-emerald-500' : ''}`} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Node Details */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-10 flex flex-col">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div 
                key={selectedNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-6 items-center">
                    {selectedNode.mugshotUrl && (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border border-emerald-500/30 bg-zinc-900 shrink-0">
                        <img src={selectedNode.mugshotUrl} alt="Mugshot" className="w-full h-full object-cover grayscale contrast-125" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                         <span className="w-2 h-2 bg-emerald-500 rounded-full animate-blink" />
                         <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-500">{t('admin.node_profile')}</span>
                      </div>
                      <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">{selectedNode.alias}</h2>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteNode(selectedNode.id!)}
                    className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-zinc-950 transition-all"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-950/50 p-6 rounded-3xl border border-white/5 space-y-4">
                     <div className="flex items-center gap-3 text-zinc-400 mb-2">
                        <Lock size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-mono font-black uppercase tracking-widest">{lang === 'TR' ? 'Gerçek Kimlik' : 'Real Identity'}</span>
                     </div>
                      <div className="space-y-3 font-mono text-sm">
                        <div><span className="text-zinc-600 mr-2">{lang === 'TR' ? 'İSİM' : 'NAME'}:</span> <span className="text-white font-black">{selectedNode.name}</span></div>
                        <div><span className="text-zinc-600 mr-2">{lang === 'TR' ? 'EPOSTA' : 'MAIL'}:</span> <span className="text-white lowercase">{selectedNode.email}</span></div>
                        <div><span className="text-zinc-600 mr-2">{lang === 'TR' ? 'TAKMA AD' : 'ALIAS'}:</span> <span className="text-emerald-500 font-black">{selectedNode.alias}</span></div>
                        <div><span className="text-zinc-600 mr-2">{lang === 'TR' ? 'ŞİFRE' : 'PASS'}:</span> <span className="text-rose-500 font-black">{selectedNode.password}</span></div>
                      </div>
                   </div>

                   <div className="bg-zinc-950/50 p-6 rounded-3xl border border-white/5 space-y-4">
                      <div className="flex items-center gap-3 text-zinc-400 mb-2">
                         <MapPin size={16} className="text-emerald-500" />
                         <span className="text-[10px] font-mono font-black uppercase tracking-widest">{lang === 'TR' ? 'Coğrafi Veriler' : 'Geo-Spatial Data'}</span>
                      </div>
                      <div className="space-y-3 font-mono text-sm">
                        <div><span className="text-zinc-600 mr-2">IPADDR:</span> <span className="text-white">{selectedNode.ip}</span></div>
                        <div><span className="text-zinc-600 mr-2">{lang === 'TR' ? 'KONUM' : 'LOCALE'}:</span> <span className="text-white uppercase">{selectedNode.city}, {selectedNode.country}</span></div>
                        <div><span className="text-zinc-600 mr-2">BIO:</span> <span className="text-zinc-400 italic text-xs">{selectedNode.bio || (lang === 'TR' ? 'Yok' : 'None')}</span></div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-950/50 p-6 rounded-3xl border border-white/5 space-y-4">
                     <div className="flex items-center gap-3 text-zinc-400 mb-2">
                        <Monitor size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-mono font-black uppercase tracking-widest">{lang === 'TR' ? 'Donanım Parmak İzi' : 'Hardware Fingerprint'}</span>
                     </div>
                     <div className="space-y-3 font-mono text-xs">
                       <div className="flex justify-between"><span className="text-zinc-600">OS/PLATFORM:</span> <span className="text-white">{selectedNode.platform}</span></div>
                       <div className="flex justify-between"><span className="text-zinc-600">{lang === 'TR' ? 'ÇÖZÜNÜRLÜK' : 'RESOLUTION'}:</span> <span className="text-white">{selectedNode.screen}</span></div>
                       <div className="flex justify-between"><span className="text-zinc-600">{lang === 'TR' ? 'ÇEKİRDEK/BELLEK' : 'CORES/MEM'}:</span> <span className="text-white">{selectedNode.cores} {lang === 'TR' ? 'Çekirdek' : 'Cores'} / {selectedNode.memory || '?'}GB</span></div>
                     </div>
                  </div>

                  <div className="bg-zinc-950/50 p-6 rounded-3xl border border-white/5 space-y-4">
                     <div className="flex items-center gap-3 text-zinc-400 mb-2">
                        <Users size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-mono font-black uppercase tracking-widest">Social Matrix</span>
                     </div>
                     <div className="space-y-3 font-mono text-xs">
                       <div className="flex justify-between"><span className="text-zinc-600">GITHUB:</span> <span className="text-white">{selectedNode.github || 'N/A'}</span></div>
                       <div className="flex justify-between"><span className="text-zinc-600">LINKEDIN:</span> <span className="text-white">{selectedNode.linkedin || 'N/A'}</span></div>
                       <div className="flex justify-between"><span className="text-zinc-600">{lang === 'TR' ? 'WEB SİTESİ' : 'WEBSITE'}:</span> <span className="text-white">{selectedNode.website || 'N/A'}</span></div>
                     </div>
                  </div>
                </div>

                <div className="bg-zinc-950/50 p-6 rounded-3xl border border-white/5">
                   <div className="flex items-center gap-3 text-zinc-400 mb-4">
                      <TerminalIcon size={16} className="text-emerald-500" />
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest">{lang === 'TR' ? 'Tam İstek Başlığı' : 'Full Request Header'}</span>
                   </div>
                   <div className="font-mono text-[10px] text-zinc-500 break-all bg-black/40 p-4 rounded-xl border border-white/5">
                      {selectedNode.uagent}
                   </div>
                   <div className="mt-4 text-[10px] font-mono text-zinc-700 uppercase tracking-widest flex justify-between">
                     <span>{lang === 'TR' ? 'Uplink Zaman Damgası:' : 'Uplink Timestamp:'}</span>
                     <span>{new Date(selectedNode.timestamp).toLocaleString()}</span>
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                <div className="w-32 h-32 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center">
                  <Database size={48} className="text-zinc-700" />
                </div>
                <div>
                   <h2 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-500">{lang === 'TR' ? 'Sinyal Bekleniyor' : 'Waiting for Signal'}</h2>
                   <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-700 mt-2">{lang === 'TR' ? 'Veri paketlerini incelemek için sol kanaldan bir düğüm seçin' : 'Select a node from the left channel to inspect data packets'}</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
