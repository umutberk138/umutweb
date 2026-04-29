import React, { useState, useEffect } from 'react';
import { Save, Trash2, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';

export const ShadowPad: React.FC = () => {
    const { t, lang } = useI18n();
    const [note, setNote] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('shadow_note');
        if (stored) setNote(stored);
    }, []);

    const save = () => {
        localStorage.setItem('shadow_note', note);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const clear = () => {
        if (confirm(lang === 'TR' ? 'TÜM VERİLER SİLİNSİN Mİ?' : 'ERASE ALL DATA?')) {
            setNote('');
            localStorage.removeItem('shadow_note');
        }
    };

    return (
        <div className="flex flex-col h-[400px] bg-zinc-950 rounded-[32px] border border-white/5 overflow-hidden font-mono shadow-inner shadow-black">
            <div className="p-4 bg-zinc-900 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                    <FileText size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Node_Tactical_Intel.not</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={save} className="p-2 bg-zinc-950 rounded-lg text-emerald-500 hover:text-white transition-colors">
                        <Save size={14} />
                    </button>
                    <button onClick={clear} className="p-2 bg-zinc-950 rounded-lg text-rose-500 hover:text-white transition-colors">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <textarea 
               className="flex-1 p-6 bg-transparent text-emerald-500 outline-none resize-none text-[12px] leading-relaxed custom-scrollbar selection:bg-emerald-500 selection:text-zinc-950"
               value={note}
               spellCheck={false}
               onChange={e => setNote(e.target.value)}
               placeholder={lang === 'TR' ? 'TAKTIK_GÜNLÜKLERİ_BAŞLATILIYOR...' : 'INITIATE_TACTICAL_LOGS...'}
            />

            <div className="p-3 bg-zinc-900/50 flex justify-between items-center px-6">
                <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-zinc-600" />
                    <span className="text-[9px] text-zinc-600 font-bold uppercase">{new Date().toLocaleDateString()}</span>
                </div>
                <AnimatePresence>
                    {saved && (
                        <motion.span 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[9px] text-emerald-500 font-black uppercase animate-pulse"
                        >
                            {lang === 'TR' ? 'Sektör_Kaydedildi' : 'Sector_Committed'}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
