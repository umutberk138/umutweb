import React, { useState } from 'react';
import { Hash, Lock, Unlock, Mail, ShieldAlert, Cpu } from 'lucide-react';

export const SecurityTools: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'ENCODE' | 'DECODE'>('ENCODE');

    const process = () => {
        try {
            if (mode === 'ENCODE') setOutput(btoa(input));
            else setOutput(atob(input));
        } catch (e) {
            setOutput('ERROR: INVALID CHARACTER SET');
        }
    };

    return (
        <div className="space-y-6 font-mono text-xs">
            <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => setMode('ENCODE')}
                  className={`flex-1 py-3 rounded-xl border font-black uppercase tracking-widest transition-all ${mode === 'ENCODE' ? 'bg-emerald-500 text-zinc-950 border-emerald-500' : 'bg-black/20 text-zinc-500 border-white/5'}`}
                >
                    <Lock size={12} className="inline mr-2" /> Encrypt
                </button>
                <button 
                  onClick={() => setMode('DECODE')}
                  className={`flex-1 py-3 rounded-xl border font-black uppercase tracking-widest transition-all ${mode === 'DECODE' ? 'bg-emerald-500 text-zinc-950 border-emerald-500' : 'bg-black/20 text-zinc-500 border-white/5'}`}
                >
                    <Unlock size={12} className="inline mr-2" /> Decrypt
                </button>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Input String</label>
                <textarea 
                   className="w-full h-24 bg-zinc-950 border border-white/5 rounded-2xl p-4 text-emerald-500 outline-none focus:border-emerald-500/50 transition-all resize-none"
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   placeholder="ENTER_DATA_TO_PROCESS..."
                />
            </div>

            <button 
                onClick={process}
                className="w-full py-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-zinc-950 transition-all"
            >
                Execute Protocol
            </button>

            {output && (
                <div className="space-y-3 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Processed Result</label>
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 break-all text-white font-black group relative">
                        {output}
                        <button 
                          onClick={() => navigator.clipboard.writeText(output)}
                          className="absolute right-4 top-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Mail size={14} />
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center gap-4 text-rose-500">
                <ShieldAlert size={20} />
                <span className="text-[9px] uppercase font-black leading-tight tracking-widest">Warning: Base64 protocols are lightweight. Use neural encryption for level 5 data.</span>
            </div>
        </div>
    );
};

export const SystemHealth: React.FC = () => {
   const [cpu, setCpu] = useState(42);
   const [ram, setRam] = useState(65);

   useEffect(() => {
     const int = setInterval(() => {
        setCpu(c => Math.max(10, Math.min(99, c + (Math.random() - 0.5) * 10)));
        setRam(r => Math.max(10, Math.min(99, r + (Math.random() - 0.5) * 2)));
     }, 2000);
     return () => clearInterval(int);
   }, []);

   return (
       <div className="space-y-8 font-mono">
           <div className="space-y-3">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                   <span className="text-zinc-500">CPU_UTILIZATION</span>
                   <span className={cpu > 80 ? 'text-rose-500' : 'text-emerald-500'}>{cpu.toFixed(1)}%</span>
               </div>
               <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                   <motion.div 
                     animate={{ width: `${cpu}%` }}
                     className={`h-full transition-colors ${cpu > 80 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]'}`}
                   />
               </div>
           </div>

           <div className="space-y-3">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                   <span className="text-zinc-500">MEMORY_COMMIT</span>
                   <span className="text-blue-500">{ram.toFixed(1)}%</span>
               </div>
               <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                   <motion.div 
                     animate={{ width: `${ram}%` }}
                     className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]"
                   />
               </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
               <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 text-center">
                  <div className="text-[10px] text-zinc-600 mb-1">TEMP</div>
                  <div className="text-xl font-black text-white">42°C</div>
               </div>
               <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 text-center">
                  <div className="text-[10px] text-zinc-600 mb-1">NODE_ID</div>
                  <div className="text-[10px] font-black text-emerald-500 truncate">S-18-UMUT</div>
               </div>
           </div>
       </div>
   );
};
