import React, { useState, useEffect } from 'react';
import { Shield, Target, Award, Terminal, Cpu, Zap, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AchievementTracker: React.FC = () => {
    const [achievements, setAchievements] = useState<string[]>([]);
    const [latest, setLatest] = useState<string | null>(null);

    const list = [
        { id: 'first_login', title: 'NODE_DISCOVERY', desc: 'Securely accessed the Shadow Network.', icon: <Shield size={18} /> },
        { id: 'cli_user', title: 'CLI_OPERATOR', desc: 'Used the terminal interface.', icon: <Terminal size={18} /> },
        { id: 'game_master', title: 'NEURAL_REFLEX', desc: 'Played the Snake protocol.', icon: <Target size={18} /> },
        { id: 'profile_updated', title: 'IDENTITY_SYNC', desc: 'Modified node bio.', icon: <Zap size={18} /> },
    ];

    useEffect(() => {
        const stored = localStorage.getItem('apex_achievements');
        if (stored) setAchievements(JSON.parse(stored));

        const interval = setInterval(() => {
            // Simulated check for achievements based on user activity
            // In a real app we'd bind this to specific events
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const unlock = (id: string) => {
        if (!achievements.includes(id)) {
            const next = [...achievements, id];
            setAchievements(next);
            localStorage.setItem('apex_achievements', JSON.stringify(next));
            setLatest(id);
            setTimeout(() => setLatest(null), 5000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <Award className="text-emerald-500" />
                <h3 className="text-xl font-black italic uppercase text-white font-mono">Achievement Protocol</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {list.map(item => (
                    <div 
                        key={item.id}
                        className={`p-5 rounded-3xl border transition-all duration-500 ${
                            achievements.includes(item.id) 
                            ? 'bg-emerald-500/10 border-emerald-500/30' 
                            : 'bg-zinc-950 border-white/5 grayscale opacity-40'
                        }`}
                    >
                        <div className="flex gap-4 items-start">
                            <div className={`p-3 rounded-2xl ${achievements.includes(item.id) ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500'}`}>
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="text-[12px] font-black uppercase text-white font-mono">{item.title}</h4>
                                <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-widest">{item.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {latest && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="fixed bottom-24 right-6 z-[100] bg-emerald-500 p-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-4"
                    >
                        <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-emerald-500">
                           <Award size={24} />
                        </div>
                        <div className="font-mono text-zinc-950">
                            <h5 className="font-black text-xs uppercase tracking-tighter">Achievement Unlocked</h5>
                            <p className="text-[9px] font-black uppercase tracking-widest">{list.find(l => l.id === latest)?.title}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
