import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldCheck } from 'lucide-react';
import { useI18n } from '../lib/i18n';

interface AccessGateProps {
  onSuccess: () => void;
}

export const AccessGate: React.FC<AccessGateProps> = ({ onSuccess }) => {
  const { lang, t } = useI18n();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.toLowerCase() === 'umut' && pass === '2026') {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="h-[600px] flex items-center justify-center relative overflow-hidden rounded-3xl bg-zinc-950 border border-apex-border shadow-2xl">
      <div className="absolute inset-0 bg-emerald-500/5 transition-opacity" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8 bg-zinc-900 border border-apex-border rounded-3xl relative z-10 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500">
            <Lock size={32} className={error ? 'animate-bounce text-rose-500' : ''} />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">{lang === 'TR' ? 'Darknet Erişimi' : 'Darknet Access'}</h2>
          <p className="text-[10px] text-zinc-500 font-mono font-bold tracking-widest uppercase italic">// Apex OS {lang === 'TR' ? 'Kısıtlı Bölge' : 'Restricted Zone'}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">{lang === 'TR' ? 'Kimlik' : 'Identity'}</label>
            <input 
              type="text" 
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder={lang === 'TR' ? 'KULLANICI ADI' : 'USERNAME'}
              className="w-full bg-zinc-800 border border-apex-border rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-600"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">{lang === 'TR' ? 'Gizli Anahtar' : 'Secret Key'}</label>
            <input 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder={lang === 'TR' ? 'ŞİFRE' : 'PASSWORD'}
              className="w-full bg-zinc-800 border border-apex-border rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-600"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-tighter italic"
          >
            {lang === 'TR' ? 'Protokolü Doğrula' : 'Authenticate Protocol'}
          </button>
        </form>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center"
          >
            <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">{lang === 'TR' ? 'Erişim Engellendi: Geçersiz Bilgiler' : 'Access Denied: Invalid Credentials'}</span>
          </motion.div>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-zinc-600" />
          <span className="text-[9px] text-zinc-600 font-mono font-bold tracking-widest uppercase">{lang === 'TR' ? 'Şifreleme Seviyesi' : 'Encryption Level'}: MIL-SPEC</span>
        </div>
      </motion.div>
    </div>
  );
};
