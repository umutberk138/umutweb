import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Code2, 
  TrendingUp,
  Globe,
  Terminal as TerminalIcon,
  LayoutGrid
} from 'lucide-react';
import { AppMode } from '../types';
import { db, auth } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface BentoGridProps {
  onNavigate?: (mode: AppMode) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ onNavigate }) => {
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    if (auth.currentUser) {
      const unsub = onSnapshot(doc(db, 'users', auth.currentUser.uid), (snap) => {
        if (snap.exists()) {
          setHighScore(snap.data().highScore || 0);
        }
      });
      return () => unsub();
    }
  }, []);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-3 gap-4"
    >
      {/* Bio Card */}
      <motion.div 
        variants={item}
        onClick={() => onNavigate?.('PORTFOLIO')}
        className="md:col-span-2 md:row-span-2 bg-apex-card border border-apex-border rounded-3xl p-8 flex flex-col justify-between group overflow-hidden relative shadow-2xl cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-apex-accent/5 blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-apex-accent/10" />
        <div>
          <span className="text-apex-accent font-mono text-xs tracking-widest uppercase mb-4 block">Strategic Analysis // v2.4</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-inherit leading-tight">
            UMUT <br /> <span className="text-apex-accent italic">İNCE.</span>
          </h1>
          <p className="text-apex-muted text-lg max-w-sm leading-relaxed">
            Kapadokya Üniversitesi Yönetim Bilişim Sistemleri (YBS) öğrencisi ve Amazon E-ticaret stratejisti. Cinar Cappadocia projesi mimarı.
          </p>
        </div>
        <div className="flex gap-4 mt-8">
          <a href="https://github.com/umutberk138" target="_blank" rel="noreferrer" className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-apex-accent/20 text-white transition-all"><Github size={20} /></a>
          <a href="https://wa.me/905400893252" target="_blank" rel="noreferrer" className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-apex-accent/20 text-white transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.8 8.38 8.38 0 0 1 3.8.9L21 3.2Z"/></svg>
          </a>
          <a href="mailto:umutberk138@gmail.com" className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-apex-accent/20 text-white transition-all"><Mail size={20} /></a>
        </div>
      </motion.div>

      {/* Expertise Card */}
      <motion.div 
        variants={item}
        className="md:row-span-1 bg-apex-card border border-apex-border rounded-3xl p-6 relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><Code2 size={20} /></div>
          <span className="text-sm font-semibold uppercase tracking-wider text-apex-muted">Geliştirme</span>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs mb-1"><span className="text-apex-muted">React / TS</span><span className="text-emerald-400">92%</span></div>
            <div className="h-1 bg-apex-bg rounded-full overflow-hidden"><motion.div initial={{width:0}} animate={{width:'92%'}} className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" /></div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs mb-1"><span className="text-apex-muted">Python</span><span className="text-emerald-400">84%</span></div>
            <div className="h-1 bg-apex-bg rounded-full overflow-hidden"><motion.div initial={{width:0}} animate={{width:'84%'}} className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" /></div>
          </div>
        </div>
      </motion.div>

      {/* Business Card */}
      <motion.div 
        variants={item}
        className="md:row-span-1 bg-apex-card border border-apex-border rounded-3xl p-6 flex flex-col justify-between"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><TrendingUp size={20} /></div>
          <span className="text-sm font-semibold uppercase tracking-wider text-apex-muted">Strateji</span>
        </div>
        <p className="text-[10px] text-apex-muted leading-tight mb-2">E-Ticaret pazaryeri yönetimi ve büyüme stratejileri üzerine uzmanlık.</p>
        <div className="py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center">
          <span className="text-emerald-400 font-mono text-lg font-bold italic tracking-tighter">Peak Performance</span>
        </div>
      </motion.div>

      {/* Projects Grid Card */}
      <motion.div 
        variants={item}
        onClick={() => onNavigate?.('DARKNET')}
        className="md:col-span-2 bg-zinc-900 border border-apex-border rounded-3xl p-8 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div>
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-zinc-800 rounded-2xl border border-zinc-700"><Globe className="text-emerald-500" /></div>
            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] rounded-full border border-emerald-500/20 font-bold uppercase tracking-widest">98th Percentile</div>
          </div>
          <h3 className="text-2xl font-bold mb-2 tracking-tight">Path to Peak Efficiency</h3>
          <p className="text-zinc-500 text-sm leading-snug">Geliştirdiğim en son çözümlere ve dijital ürünlere göz atın.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-500/70">
          <span>#Next.js</span> <span>#Optimization</span> <span>#Strategy</span>
        </div>
      </motion.div>

      {/* Darknet Entry Card */}
      <motion.div 
        variants={item}
        onClick={() => onNavigate?.('ADMIN')}
        className="bg-zinc-900 border border-apex-border rounded-3xl p-6 group cursor-pointer relative overflow-hidden flex flex-col justify-center items-center gap-2"
      >
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">High Score</span>
        <div className="text-5xl font-black text-emerald-400 italic">{highScore}</div>
        <div className="w-full bg-zinc-800 h-1 rounded-full mt-2">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${Math.min(100, (highScore / 1000) * 100)}%` }} 
            className="h-full bg-emerald-400 rounded-full" 
          />
        </div>
      </motion.div>

      {/* Hire Me / Contact Card */}
      <motion.div 
        variants={item}
        onClick={() => onNavigate?.('PORTFOLIO')}
        className="md:col-span-2 bg-zinc-900 border border-apex-border rounded-3xl p-6 flex flex-col justify-center gap-3 group cursor-pointer relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-2">
           <Mail size={16} className="text-blue-400" />
           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Connect</span>
        </div>
        <h4 className="text-lg font-bold leading-none tracking-tight">Sinyal Gönder.</h4>
        <p className="text-[10px] text-zinc-500 leading-tight">İş birliği veya projeleriniz için bir kanal açın.</p>
        <div className="mt-2 text-xs font-bold text-blue-400 group-hover:underline flex items-center gap-1">
            OPEN_CHANNEL <ExternalLink size={10} />
        </div>
      </motion.div>

      {/* Security Info Card */}
      <motion.div 
        variants={item}
        className="bg-apex-card border border-apex-border rounded-3xl p-6 flex flex-col justify-between"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Core Stability</span>
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-bold tracking-tight text-white">99.98</span>
          <span className="text-xs text-zinc-500 uppercase font-bold">%</span>
        </div>
        <div className="flex gap-1 h-1.5">
          <div className="flex-1 bg-emerald-500 rounded-full" />
          <div className="flex-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
          <div className="flex-1 bg-emerald-500 rounded-full" />
          <div className="w-4 bg-zinc-800 rounded-full" />
        </div>
      </motion.div>
    </motion.div>
  );
};
