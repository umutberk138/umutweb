import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { Terminal, Gamepad2, Skull, Ghost, Zap, Layout, MessageSquare, Sparkles, Activity } from 'lucide-react';
import { SnakeGame } from './SnakeGame';
import { ShadowCortex } from './ShadowCortex';
import { ShadowChat } from './ShadowChat';
import { NetworkPulse } from './NetworkPulse';

import { FileExplorer } from './FileExplorer';
import { AchievementTracker } from './AchievementSystem';

interface DarknetDashboardProps {
  alias: string;
}

export const DarknetDashboard: React.FC<DarknetDashboardProps> = ({ alias }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'HOME' | 'GAMES' | 'CHAT' | 'CORTEX' | 'STORAGE' | 'AWARDS'>('HOME');

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-1000">
      <header className="flex justify-between items-center bg-zinc-950/50 p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
            <Skull size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tight text-white">{alias} // {t('darknet.dashboard.active')}</h2>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">IP: {Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}.X.X // {t('darknet.dashboard.tunnel')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['HOME', 'GAMES', 'CHAT', 'CORTEX', 'STORAGE', 'AWARDS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                : 'bg-zinc-900 text-zinc-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'HOME' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full overflow-y-auto pr-2 custom-scrollbar"
            >
              <div className="glass-panel p-8 rounded-[40px] border-l-4 border-l-rose-500 space-y-4">
                <Ghost className="text-rose-500" size={32} />
                <h3 className="text-2xl font-black italic uppercase text-white">{t('darknet.dashboard.entities_title')}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{t('darknet.dashboard.entities_desc')}</p>
              </div>

              <div className="glass-panel p-8 rounded-[40px] border-l-4 border-l-emerald-500 space-y-4">
                <Zap className="text-emerald-500" size={32} />
                <h3 className="text-2xl font-black italic uppercase text-white">{t('darknet.dashboard.quick_access_title')}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{t('darknet.dashboard.quick_access_desc')}</p>
              </div>

              <div className="glass-panel p-8 rounded-[40px] border-l-4 border-l-blue-500 space-y-4">
                <Layout className="text-blue-500" size={32} />
                <h3 className="text-2xl font-black italic uppercase text-white">{t('darknet.dashboard.sys_status_title')}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{t('darknet.dashboard.sys_status_desc')}</p>
              </div>

              <div className="col-span-full glass-panel p-10 rounded-[40px] border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black italic uppercase text-emerald-500 flex items-center gap-3">
                    <Activity size={20} /> Real-time Node Pulsar
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono font-black text-zinc-500">LIVE_DATA_STREAM</span>
                  </div>
                </div>
                
                <NetworkPulse />
              </div>
            </motion.div>
          )}

          {activeTab === 'GAMES' && (
            <motion.div 
              key="games"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col space-y-6"
            >
              <div className="flex items-center gap-4 text-emerald-500 mb-2">
                <Gamepad2 size={24} />
                <h3 className="text-2xl font-black italic uppercase italic tracking-tighter">{t('darknet.dashboard.shadow_games')}</h3>
              </div>
              <div className="flex-1 bg-zinc-950 border border-white/5 rounded-[40px] p-8 flex items-center justify-center overflow-hidden">
                <div className="w-full max-w-xl aspect-square bg-black border-4 border-emerald-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                  <SnakeGame />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'CHAT' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <ShadowChat userAlias={alias} />
            </motion.div>
          )}

          {activeTab === 'CORTEX' && (
            <motion.div 
              key="cortex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <ShadowCortex />
            </motion.div>
          )}

          {activeTab === 'STORAGE' && (
            <motion.div 
              key="storage"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full space-y-8 overflow-y-auto pr-2"
            >
               <FileExplorer />
            </motion.div>
          )}

          {activeTab === 'AWARDS' && (
            <motion.div 
              key="awards"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full"
            >
               <AchievementTracker />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
