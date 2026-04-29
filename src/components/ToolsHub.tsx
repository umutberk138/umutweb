import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { useI18n } from '../lib/i18n';

export const ToolsHub: React.FC = () => {
  const { lang } = useI18n();
  const [activeTab, setActiveTab] = useState<'CIPHER' | 'HEALTH' | 'AWARDS' | 'PAD'>('CIPHER');

  const tabs = [
    { id: 'CIPHER', label: lang === 'TR' ? 'ŞİFRE' : 'CIPHER' },
    { id: 'HEALTH', label: lang === 'TR' ? 'SAĞLIK' : 'HEALTH' },
    { id: 'AWARDS', label: lang === 'TR' ? 'ÖDÜLLER' : 'AWARDS' },
    { id: 'PAD', label: lang === 'TR' ? 'NOT' : 'PAD' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex gap-2 p-1 bg-zinc-950 rounded-2xl border border-white/5 self-start">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase transition-all ${
              activeTab === t.id ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-500 hover:text-white'
            }`}
          >
            {t.label}
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
