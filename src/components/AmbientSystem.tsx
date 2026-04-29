import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Maximize2, SkipForward } from 'lucide-react';
import { useI18n } from '../lib/i18n';

export const AmbientSystem: React.FC = () => {
  const { t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(Array(15).fill(0));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setLevel(Array(15).fill(0).map(() => Math.random() * 20 + 5));
      } else {
        setLevel(prev => prev.map(v => Math.max(0, v - 2)));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-zinc-950/90 p-3 rounded-2xl border border-white/5 backdrop-blur-xl shadow-2xl">
      <div className="flex items-end gap-1 h-6 w-20 px-2 border-r border-white/5">
        {level.map((h, i) => (
          <div 
            key={i} 
            className="w-1 bg-emerald-500/40 rounded-full transition-all duration-150"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
      
      <div className="flex flex-col">
        <span className="text-[8px] font-mono text-emerald-500 font-black uppercase tracking-widest animate-pulse">
          {isPlaying ? t('ambient.active') : t('ambient.dormant')}
        </span>
        <span className="text-[9px] font-mono text-zinc-500">{t('ambient.track')}</span>
      </div>

      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          isPlaying ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
        }`}
      >
        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {/* Hidden Audio placeholder - actual URL depends on user preference but we simulate it */}
      <audio ref={audioRef} loop hidden />
    </div>
  );
};
