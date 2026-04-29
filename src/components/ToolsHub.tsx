import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Key, 
  Hash, 
  RefreshCw, 
  Copy, 
  CheckCircle2, 
  Binary,
  CircleDollarSign
} from 'lucide-react';

import { SecurityTools, SystemHealth } from './ApexTools';
import { AchievementTracker } from './AchievementSystem';
import { ShadowPad } from './ShadowPad';

export const ToolsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CIPHER' | 'HEALTH' | 'AWARDS' | 'PAD'>('CIPHER');

  return (
    <div className="space-y-8">
      <div className="flex gap-2 p-1 bg-zinc-950 rounded-2xl border border-white/5 self-start">
        {['CIPHER', 'HEALTH', 'AWARDS', 'PAD'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase transition-all ${
              activeTab === t ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-500 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
        >
          {activeTab === 'CIPHER' && <SecurityTools />}
          {activeTab === 'HEALTH' && <SystemHealth />}
          {activeTab === 'AWARDS' && <AchievementTracker />}
          {activeTab === 'PAD' && <ShadowPad />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
