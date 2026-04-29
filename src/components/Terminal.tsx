import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SnakeGame } from './SnakeGame';
import { AccessGate } from './AccessGate';
import { ShadowChat } from './ShadowChat';
import { ToolsHub } from './ToolsHub';
import { Terminal as TerminalIcon, ShieldCheck, ShieldX, Settings } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useI18n } from '../lib/i18n';

interface TerminalLine {
  text: string;
  type: 'prompt' | 'output' | 'error' | 'success';
}

export const Terminal: React.FC = () => {
  const { lang, t } = useI18n();
  const [input, setInput] = useState('');
  const [showGame, setShowGame] = useState(false);
  const [showGate, setShowGate] = useState(true);
  const [activeModule, setActiveModule] = useState<'TERMINAL' | 'GAMES' | 'CHAT' | 'TOOLS'>('TERMINAL');

  const [history, setHistory] = useState<TerminalLine[]>([
    { text: lang === 'TR' ? 'STRATEJİK ANALİZ v2.4 [Yapım 16:38:06]' : 'STRATEGIC ANALYSIS v2.4 [Build 16:38:06]', type: 'output' },
    { text: lang === 'TR' ? '(c) Umut Hub Kurumsal. Optimize Edilmiş Bağlam Etkin.' : '(c) Umut Hub Corporation. Optimized Context Enabled.', type: 'output' },
    { text: '', type: 'output' },
    { text: lang === 'TR' ? 'Sistem kimliği doğrulandı:' : 'System identity verified:', type: 'success' },
    { text: lang === 'TR' ? 'Kullanılabilir rutinlerin listesi için "help" yazın.' : 'Type "help" for a list of available routines.', type: 'output' },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, activeModule]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmdInput = input.trim();
    if (!cmdInput) return;
    
    const parts = cmdInput.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    const newHistory = [...history, { text: `user@hub:~$ ${cmdInput}`, type: 'prompt' as const }];

    switch (cmd) {
      case 'help':
        newHistory.push({ 
          text: lang === 'TR' 
            ? 'Kullanılabilir rutinler: help, clear, whoami, status, games, chat, tools, optimize, broadcast [msg], leaderboard' 
            : 'Available routines: help, clear, whoami, status, games, chat, tools, optimize, broadcast [msg], leaderboard', 
          type: 'output' 
        });
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'games':
        newHistory.push({ text: lang === 'TR' ? 'Oyun Protokolüne erişiliyor...' : 'Accessing Games Protocol...', type: 'success' });
        setTimeout(() => setActiveModule('GAMES'), 500);
        break;
      case 'chat':
        newHistory.push({ text: lang === 'TR' ? 'Gölge odası bağlantısı başlatılıyor...' : 'Initializing shadows room connection...', type: 'success' });
        setTimeout(() => setActiveModule('CHAT'), 500);
        break;
      case 'tools':
        newHistory.push({ text: lang === 'TR' ? 'Yardımcı sürücü bağlanıyor...' : 'Mounting utility drive...', type: 'success' });
        setTimeout(() => setActiveModule('TOOLS'), 500);
        break;
      case 'whoami':
        if (auth.currentUser) {
           newHistory.push({ text: `ID: ${auth.currentUser.uid}`, type: 'output' });
           newHistory.push({ text: `NODE: ${auth.currentUser.displayName || auth.currentUser.email}`, type: 'output' });
           newHistory.push({ text: lang === 'TR' ? 'DURUM: YETKİLİ_DÜĞÜM' : 'STATUS: AUTHORIZED_NODE', type: 'success' });
        } else {
           newHistory.push({ text: lang === 'TR' ? 'MİSAFİR_DÜĞÜM // YETKİSİZ' : 'GUEST_NODE // UNAUTHORIZED', type: 'error' });
        }
        break;
      case 'leaderboard':
        newHistory.push({ text: lang === 'TR' ? 'Küresel İndeks Sorgulanıyor...' : 'Querying Global Index...', type: 'output' });
        try {
          const q = query(collection(db, 'users'), orderBy('highScore', 'desc'), limit(5));
          const snap = await getDocs(q);
          snap.docs.forEach((doc, idx) => {
            newHistory.push({ text: `#${idx + 1} - ${doc.id.slice(0, 8)}: ${doc.data().highScore || 0} pts`, type: 'output' });
          });
        } catch (error) {
          newHistory.push({ text: lang === 'TR' ? 'Liderlik tablosu alınırken hata oluştu.' : 'Error fetching leaderboard.', type: 'error' });
        }
        break;
      case 'broadcast':
        if (!auth.currentUser) {
          newHistory.push({ text: lang === 'TR' ? 'Yayın için kimlik doğrulaması gerekli.' : 'Auth required for broadcast.', type: 'error' });
          break;
        }
        if (!args) {
          newHistory.push({ text: lang === 'TR' ? 'Kullanım: broadcast [mesaj]' : 'Usage: broadcast [message]', type: 'error' });
          break;
        }
        try {
          await addDoc(collection(db, 'shadow_chat'), {
            alias: 'SYSTEM_BROADCAST',
            text: `[!] ${auth.currentUser.displayName || 'Anon'}: ${args}`,
            timestamp: serverTimestamp(),
            isSystem: true
          });
          newHistory.push({ text: lang === 'TR' ? 'Sinyal Gölge Odasına yayınlandı.' : 'Signal broadcasted to Shadows Room.', type: 'success' });
        } catch (err) {
          newHistory.push({ text: lang === 'TR' ? 'Yayın başarısız.' : 'Broadcast failed.', type: 'error' });
        }
        break;
      case 'status':
        newHistory.push({ text: lang === 'TR' ? 'ÇEKİRDEK STABİLİTESİ: %99.98' : 'CORE STABILITY: 99.98%', type: 'success' });
        newHistory.push({ text: lang === 'TR' ? 'YOL VERİMLİLİĞİ: 98. Yüzdelik Dilim' : 'PATH EFFICIENCY: 98th Percentile', type: 'success' });
        newHistory.push({ text: lang === 'TR' ? 'TAHSİS: OPTİMİZE EDİLDİ' : 'ALLOCATION: OPTIMIZED', type: 'success' });
        break;
      case 'optimize':
        newHistory.push({ text: lang === 'TR' ? 'Optimizasyon dizisi başlatılıyor...' : 'Initiating optimization sequence...', type: 'output' });
        setTimeout(() => {
          setHistory(prev => [...prev, { text: lang === 'TR' ? 'Tamamlandı. Sistem verimi +%14.2 olarak projekt edildi.' : 'Done. System yield projected at +14.2%.', type: 'success' }]);
        }, 800);
        break;
      case 'snake':
        newHistory.push({ text: lang === 'TR' ? 'YILAN_PROTOKOLÜ başlatılıyor...' : 'Initializing SNAKE_PROTOCOL...', type: 'success' });
        setTimeout(() => setShowGame(true), 500);
        break;
      default:
        newHistory.push({ text: `rutin: ${cmd}: komut bulunamadı.`, type: 'error' });
    }

    setHistory(newHistory);
    setInput('');
  };

  if (activeModule === 'GAMES' && showGame) {
     return <SnakeGame onExit={() => setShowGame(false)} />;
  }

  const renderModule = () => {
    if (showGate) return <AccessGate onSuccess={() => setShowGate(false)} />;

    return (
      <div className="flex flex-col md:flex-row gap-6 h-[700px]">
        {/* Module Sidebar */}
        <div className="w-full md:w-48 space-y-2">
            {[
                { id: 'TERMINAL', label: 'Terminal', icon: TerminalIcon },
                { id: 'GAMES', label: lang === 'TR' ? 'Oyun Merkezi' : 'Games Hub', icon: ShieldCheck },
                { id: 'CHAT', label: lang === 'TR' ? 'Gölge Sohbet' : 'Shadows Chat', icon: ShieldX },
                { id: 'TOOLS', label: lang === 'TR' ? 'Yardımcı Araçlar' : 'Utility Tools', icon: Settings }
            ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => setActiveModule(m.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-mono font-bold uppercase tracking-widest border transition-all ${
                    activeModule === m.id 
                        ? 'bg-emerald-500 border-emerald-500 text-zinc-950' 
                        : 'bg-zinc-900 border-apex-border text-zinc-500 hover:border-emerald-500/30'
                  }`}
                >
                    <m.icon size={14} /> {m.label}
                </button>
            ))}
        </div>

        {/* Module Content */}
        <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="h-full"
                >
                    {activeModule === 'TERMINAL' && (
                        <div className="flex flex-col h-full bg-zinc-900 border border-apex-border rounded-3xl p-6 font-mono shadow-2xl backdrop-blur-md">
                            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 mb-4 text-sm">
                                {history.map((line, i) => (
                                    <div key={i} className="flex gap-2 break-all">
                                        <span className={
                                            line.type === 'error' ? 'text-red-400' : 
                                            line.type === 'success' ? 'text-emerald-400' : 
                                            line.type === 'prompt' ? 'text-emerald-500' : 'text-zinc-400'
                                        }>
                                            {line.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleCommand} className="flex items-center gap-2">
                                <span className="text-emerald-500 shrink-0">user@hub:~$</span>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    autoFocus
                                    className="flex-1 bg-transparent border-none outline-none text-emerald-400"
                                    spellCheck={false}
                                    autoComplete="off"
                                />
                                <div className="w-2 h-5 bg-emerald-500 animate-pulse" />
                            </form>
                        </div>
                    )}

                    {activeModule === 'GAMES' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full overflow-y-auto pr-2">
                             <div 
                                onClick={() => setShowGame(true)}
                                className="bg-zinc-900 border border-apex-border p-8 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-emerald-500/50 transition-all group shadow-xl"
                             >
                                <div className="text-5xl group-hover:scale-110 transition-transform">🐍</div>
                                <div className="text-center">
                                    <h4 className="font-black italic uppercase tracking-tighter text-xl">SNAKE_PROTOCOL</h4>
                                    <p className="text-[10px] text-zinc-500 font-mono">{lang === 'TR' ? 'Güvenli yolda gezin.' : 'Navigate the secure path.'}</p>
                                </div>
                             </div>
                             
                             <div className="bg-zinc-900 border border-apex-border/50 p-8 rounded-3xl flex flex-col items-center justify-center gap-4 opacity-50 grayscale">
                                <div className="text-5xl">🎯</div>
                                <div className="text-center">
                                    <h4 className="font-black italic uppercase tracking-tighter text-xl">2048_MODULE</h4>
                                    <p className="text-[10px] text-zinc-500 font-mono">{lang === 'TR' ? 'Entegrasyon devam ediyor...' : 'Integration in progress...'}</p>
                                </div>
                             </div>

                             <div className="bg-zinc-900 border border-apex-border/50 p-8 rounded-3xl flex flex-col items-center justify-center gap-4 opacity-50 grayscale">
                                <div className="text-5xl">🧠</div>
                                <div className="text-center">
                                    <h4 className="font-black italic uppercase tracking-tighter text-xl">MEMORY_X</h4>
                                    <p className="text-[10px] text-zinc-500 font-mono">{lang === 'TR' ? 'Nöral kalibrasyon gerekli.' : 'Neural calibration required.'}</p>
                                </div>
                             </div>
                        </div>
                    )}

                    {activeModule === 'CHAT' && <ShadowChat userAlias={auth.currentUser?.displayName || 'Anon'} />}
                    {activeModule === 'TOOLS' && <ToolsHub />}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    );
  };

  return renderModule();

};
