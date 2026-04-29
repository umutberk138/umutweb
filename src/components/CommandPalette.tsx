import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Terminal, Globe, User, Shield, Hash, Zap, Command } from 'lucide-react';
import { useI18n } from '../lib/i18n';

interface CommandPaletteProps {
  onClose: () => void;
  onNavigate: (mode: 'DESKTOP' | 'TERMINAL' | 'DARKNET' | 'PORTFOLIO' | 'PROFILE') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onClose, onNavigate }) => {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    { id: 'desktop', icon: <Globe size={16} />, label: t('commands.desktop'), action: () => onNavigate('DESKTOP') },
    { id: 'terminal', icon: <Terminal size={16} />, label: t('commands.terminal'), action: () => onNavigate('TERMINAL') },
    { id: 'darknet', icon: <Shield size={16} />, label: t('commands.darknet'), action: () => onNavigate('DARKNET') },
    { id: 'portfolio', icon: <Zap size={16} />, label: t('commands.portfolio'), action: () => onNavigate('PORTFOLIO') },
    { id: 'profile', icon: <User size={16} />, label: t('commands.profile'), action: () => onNavigate('PROFILE') },
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') setSelectedIndex(s => (s + 1) % filtered.length);
      if (e.key === 'ArrowUp') setSelectedIndex(s => (s - 1 + filtered.length) % filtered.length);
      if (e.key === 'Enter') {
        filtered[selectedIndex]?.action();
        onClose();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filtered, selectedIndex, onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-32 bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-zinc-900 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 p-6 border-b border-white/5">
          <Search className="text-emerald-500" />
          <input 
            autoFocus
            placeholder={t('commands.search_placeholder')}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-zinc-600 text-lg"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1 px-3 py-1 bg-zinc-950 rounded-lg border border-white/5">
             <Command size={12} className="text-zinc-500" />
             <span className="text-[10px] font-mono font-black text-zinc-500">ESC</span>
          </div>
        </div>

        <div className="p-4 max-h-[400px] overflow-y-auto">
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => { cmd.action(); onClose(); }}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-mono text-left ${
                i === selectedIndex ? 'bg-emerald-500 text-zinc-950 translate-x-2' : 'text-zinc-400 hover:bg-white/5'
              }`}
            >
              <div className={i === selectedIndex ? 'text-zinc-950' : 'text-emerald-500'}>
                {cmd.icon}
              </div>
              <span className="flex-1 font-black italic tracking-tighter uppercase">{cmd.label}</span>
              <Hash size={14} className="opacity-30" />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-12 text-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
              {lang === 'TR' ? 'Eşleşen komut bulunamadı.' : 'No matching commands found.'}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
