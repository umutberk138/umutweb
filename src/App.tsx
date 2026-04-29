import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BentoGrid } from './components/BentoGrid';
import { Terminal } from './components/Terminal';
import { MatrixBackground } from './components/MatrixBackground';
import { AppMode } from './types';
import { Monitor, Terminal as TerminalIcon, LayoutGrid, Sun, Moon, LogIn, LogOut, User } from 'lucide-react';
import { db } from './lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { NotificationCenter } from './components/NotificationCenter';
import { Profile } from './components/Profile';
import { PortfolioView } from './components/PortfolioView';
import { DarknetGate } from './components/DarknetGate';
import { AdminPanel } from './components/AdminPanel';
import { useI18n } from './lib/i18n';
import { CommandPalette } from './components/CommandPalette';
import { AmbientSystem } from './components/AmbientSystem';

export default function App() {
  const [mode, setMode] = useState<AppMode>('PORTFOLIO');
  const { lang, setLang, t } = useI18n();
  const [user, setUser] = useState<any>(null);
  const [showPalette, setShowPalette] = useState(false);

  useEffect(() => {
    const handlePalette = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handlePalette);
    return () => window.removeEventListener('keydown', handlePalette);
  }, []);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('apex-theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    const checkSession = () => {
      const session = localStorage.getItem('darknet_user');
      setUser(session ? JSON.parse(session) : null);
    };
    checkSession();
    window.addEventListener('storage', checkSession);
    window.addEventListener('darknet_auth_change', checkSession);
    return () => {
      window.removeEventListener('storage', checkSession);
      window.removeEventListener('darknet_auth_change', checkSession);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('apex-theme', theme);
    
    if (user?.id) {
      const userRef = doc(db, 'registrations', user.id);
      setDoc(userRef, { lastTheme: theme }, { merge: true }).catch(() => {});
    }
  }, [theme, user]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogout = () => {
    localStorage.removeItem('darknet_user');
    window.dispatchEvent(new Event('darknet_auth_change'));
    setMode('PORTFOLIO');
  };

  const renderContent = () => {
    switch (mode) {
      case 'PORTFOLIO':
        return <PortfolioView key="portfolio" />;
      case 'TERMINAL':
        return <Terminal key="terminal" />;
      case 'DARKNET':
        return <DarknetGate key="darknet" />;
      case 'ADMIN':
        return <AdminPanel key="admin" />;
      case 'PROFILE':
        return <Profile key="profile" />;
      case 'BENTO':
      default:
        return <BentoGrid key="bento" onNavigate={setMode} />;
    }
  };

  return (
    <div className="min-h-screen relative font-sans transition-colors duration-300 overflow-x-hidden">
      <NotificationCenter />
      <AmbientSystem />
      <AnimatePresence>
        {showPalette && (
          <CommandPalette 
            onClose={() => setShowPalette(false)} 
            onNavigate={(m) => setMode(m === 'DESKTOP' ? 'BENTO' : m)} 
          />
        )}
      </AnimatePresence>
      {theme === 'dark' && <MatrixBackground />}

      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-apex-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-apex-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <header className="sticky top-0 z-50 px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center bg-apex-card border border-apex-border p-4 rounded-3xl shadow-2xl transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div 
              className="relative cursor-pointer group"
              onClick={() => setMode('PROFILE')}
            >
                <div className="w-12 h-12 bg-zinc-950 border-2 border-white/5 rounded-2xl flex items-center justify-center font-bold text-apex-accent shadow-2xl overflow-hidden group-hover:border-emerald-500 transition-all duration-500 group-active:scale-95">
                  {(user?.mugshotUrl || user?.avatarUrl) ? (
                    <img 
                      src={user?.mugshotUrl || user?.avatarUrl} 
                      alt="Identity" 
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700" 
                    />
                  ) : (
                    <User size={24} />
                  )}
                </div>
              <motion.div 
                 animate={{ scale: [1, 1.2, 1] }} 
                 transition={{ repeat: Infinity, duration: 2 }}
                 className={`absolute -top-1 -right-1 w-4 h-4 border-2 border-apex-card rounded-full ${user ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`} 
              />
            </div>
            <div className="hidden sm:block pl-2 text-left">
              <h2 className="font-black text-base italic leading-none tracking-tighter uppercase text-white">UMUT <span className="text-emerald-500">İNCE</span></h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-zinc-500 font-mono font-bold tracking-[0.2em] uppercase">BIS Node_24903032</span>
                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                <span className="text-[9px] text-emerald-500/80 font-mono font-black uppercase flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Encrypted
                </span>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-1 md:gap-2 bg-black/5 dark:bg-zinc-800/50 p-1.5 rounded-2xl border border-apex-border transition-colors">
            <button 
              onClick={() => setMode('BENTO')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'BENTO' ? 'bg-apex-accent text-zinc-950 shadow-lg shadow-apex-accent/20' : 'hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500'}`}
            >
              <LayoutGrid size={16} /> <span className="hidden md:inline">{t('nav.bento')}</span>
            </button>
            <button 
              onClick={() => setMode('PORTFOLIO')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'PORTFOLIO' ? 'bg-apex-accent text-zinc-950 shadow-lg shadow-apex-accent/20' : 'hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500'}`}
            >
              <User size={16} /> <span className="hidden md:inline">{t('nav.portfolio')}</span>
            </button>
            <button 
              onClick={() => setMode('DARKNET')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'DARKNET' ? (theme === 'dark' ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-200 text-zinc-900') : 'hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500'}`}
            >
              <TerminalIcon size={16} /> <span className="hidden md:inline">{t('nav.darknet')}</span>
            </button>
            <button 
              onClick={() => setMode('ADMIN')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'ADMIN' ? (theme === 'dark' ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-200 text-zinc-900') : 'hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500'}`}
            >
              <Monitor size={16} /> <span className="hidden md:inline">{t('nav.control')}</span>
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'TR' ? 'EN' : 'TR')}
              className="px-3 py-2 bg-apex-bg border border-apex-border rounded-xl hover:bg-apex-accent/10 transition-all text-apex-accent text-[10px] font-black font-mono shadow-sm"
              aria-label="Toggle Language"
            >
              {lang}
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2.5 bg-apex-bg border border-apex-border rounded-xl hover:bg-apex-accent/10 transition-all text-apex-accent shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            {user ? (
              <div className="flex items-center gap-3 bg-apex-bg border border-apex-border p-1.5 rounded-2xl shadow-sm">
                <div className="hidden lg:flex flex-col text-right px-2">
                  <span className="text-[10px] font-black text-white uppercase tracking-tighter truncate max-w-[100px]">{user.alias}</span>
                  <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-widest leading-none">Node_Active</span>
                </div>
                <div 
                  onClick={() => setMode('PROFILE')}
                  className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  {user.mugshotUrl || user.avatarUrl ? (
                    <img 
                      src={user.mugshotUrl || user.avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-opacity"
                    />
                  ) : (
                    <User size={18} className="text-zinc-500" />
                  )}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setMode('DARKNET')}
                className="flex items-center gap-2 px-6 py-2.5 bg-apex-accent text-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-apex-accent/20"
              >
                <LogIn size={18} /> <span>Connect Node</span>
              </button>
            )}

            <div className="hidden lg:block h-4 w-px bg-apex-border" />
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[10px] uppercase text-zinc-500 leading-none mb-1 text-right">Auth_Status</span>
              <span className={`text-[10px] font-black uppercase tracking-wider ${user ? 'text-emerald-500' : 'text-rose-500'}`}>
                {user ? 'Secured' : 'Public'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pb-20 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 px-8 py-4 pointer-events-none">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-[10px] font-mono font-bold text-zinc-600 tracking-[0.2em] uppercase">
          <div className="flex gap-4">
            <span>System Ready</span>
            <span>Uptime: 99.98%</span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-apex-accent rounded-full animate-blink" />
              <span>Encrypted</span>
            </div>
            <span>umutince.online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
