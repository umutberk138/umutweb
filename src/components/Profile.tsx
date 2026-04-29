import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Shield, Hash, Save, Link as LinkIcon, Github, Linkedin, Globe, Camera } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useI18n } from '../lib/i18n';

export const Profile: React.FC = () => {
  const { lang } = useI18n();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [session, setSession] = useState<any>(null);

  // Editable fields
  const [formData, setFormData] = useState({
    alias: '',
    bio: '',
    avatarUrl: '',
    github: '',
    linkedin: '',
    website: ''
  });

  useEffect(() => {
    const rawSession = localStorage.getItem('darknet_user');
    if (rawSession) {
      const sess = JSON.parse(rawSession);
      setSession(sess);
      fetchUserData(sess.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (id: string) => {
    try {
      const docRef = doc(db, 'registrations', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setFormData({
          alias: data.alias || '',
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || '',
          github: data.github || '',
          linkedin: data.linkedin || '',
          website: data.website || ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.id || updating) return;
    setUpdating(true);
    try {
      const docRef = doc(db, 'registrations', session.id);
      await updateDoc(docRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      
      // Update local session
      const newSession = { ...session, alias: formData.alias, avatarUrl: formData.avatarUrl };
      localStorage.setItem('darknet_user', JSON.stringify(newSession));
      window.dispatchEvent(new Event('darknet_auth_change'));
      
      setUserData(prev => ({ ...prev, ...formData }));
      alert(lang === 'TR' ? 'Düğüm profili başarıyla senkronize edildi.' : 'Node profiles synchronized successfully.');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'registrations');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center p-12 font-mono text-emerald-500 animate-pulse">{lang === 'TR' ? 'DROİD SENKRONİZE EDİLİYOR...' : 'SYNCHRONIZING DROID...'}</div>;
  if (!session) return <div className="text-center p-12 text-zinc-500 font-mono">{lang === 'TR' ? 'Profil erişimi için uplink gerekli.' : 'Uplink required for profile access.'}</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-apex-card border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Shield size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[40px] border-2 border-emerald-500/30 p-1.5 transition-all group-hover:border-emerald-500">
              <div className="w-full h-full rounded-[32px] overflow-hidden bg-zinc-950 flex items-center justify-center">
                {userData?.mugshotUrl || formData.avatarUrl ? (
                  <img 
                    src={userData?.mugshotUrl || formData.avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <User size={60} className="text-zinc-800" />
                )}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-zinc-950 p-3 rounded-2xl shadow-xl">
              <Camera size={20} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
               {userData?.alias || (lang === 'TR' ? 'Gölge Düğümü' : 'Shadow Node')}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <div className="px-4 py-1.5 bg-zinc-900 border border-white/5 rounded-xl text-[10px] font-mono font-black text-zinc-400 tracking-widest flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> {userData?.email}
               </div>
               <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono font-black uppercase tracking-widest rounded-xl">
                 ID: {session.id.slice(0, 8)}...
               </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
              <User size={16} /> {lang === 'TR' ? 'Kimlik Parametreleri' : 'Identity Parameters'}
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">{lang === 'TR' ? 'Güvenlik Takma Adı' : 'Security Alias'}</label>
                <input 
                  type="text" 
                  value={formData.alias}
                  onChange={e => setFormData({ ...formData, alias: e.target.value })}
                  className="w-full bg-black/50 border border-white/5 px-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500 text-sm font-bold text-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Avatar URL</label>
                <input 
                  type="text" 
                  placeholder="https://image-url.com/avatar.jpg"
                  value={formData.avatarUrl}
                  onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full bg-black/50 border border-white/5 px-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500 text-sm font-mono text-zinc-400 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">{lang === 'TR' ? 'Kısa Biyografi' : 'Short Bio'}</label>
                <textarea 
                  rows={4}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder={lang === 'TR' ? 'Ağa kendinden bahset...' : 'Tell the network about yourself...'}
                  className="w-full bg-black/50 border border-white/5 px-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500 text-sm font-medium text-white transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
              <LinkIcon size={16} /> {lang === 'TR' ? 'Bağlantı Entegrasyonları' : 'Link Integrations'}
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Github size={12} /> {lang === 'TR' ? 'Github Profili' : 'Github Profile'}
                </label>
                <input 
                  type="text" 
                  value={formData.github}
                  onChange={e => setFormData({ ...formData, github: e.target.value })}
                  className="w-full bg-black/50 border border-white/5 px-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500 text-sm font-mono text-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Linkedin size={12} /> {lang === 'TR' ? 'LinkedIn Profili' : 'LinkedIn Profile'}
                </label>
                <input 
                  type="text" 
                  value={formData.linkedin}
                  onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full bg-black/50 border border-white/5 px-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500 text-sm font-mono text-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Globe size={12} /> {lang === 'TR' ? 'Kişisel Web Sitesi' : 'Personal Website'}
                </label>
                <input 
                  type="text" 
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-black/50 border border-white/5 px-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500 text-sm font-mono text-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-950/50 border border-emerald-500/10 p-6 rounded-3xl space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-zinc-600">{lang === 'TR' ? 'Donanım Düğüm Hashi' : 'Hardware Node Hash'}</span>
                <span className="text-[10px] font-mono text-emerald-500/60 font-black">XU-902-BIS-39</span>
             </div>
             <button 
              type="submit"
              disabled={updating}
              className="w-full py-5 bg-emerald-500 text-zinc-950 font-black italic uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
             >
              {updating ? (
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Save size={18} /> {lang === 'TR' ? 'Matris Kimliğini Güncelle' : 'Update Matrix Identity'}</>
              )}
             </button>
          </div>
        </div>
      </form>

      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
        <h3 className="text-sm font-black uppercase tracking-widest text-rose-500 flex items-center gap-2 mb-6">
          <Shield size={16} /> {lang === 'TR' ? 'Cihaz Parmak İzi (Salt Okunur)' : 'Device Fingerprint (Read Only)'}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
           {userData && [
             { label: lang === 'TR' ? 'İşletim Sistemi/Platform' : 'OS/Platform', value: userData.platform },
             { label: lang === 'TR' ? 'Ekran Çözünürlüğü' : 'Screen Resolution', value: userData.screen },
             { label: lang === 'TR' ? 'CPU Çekirdek Sayısı' : 'CPU Cores', value: userData.cores },
             { label: lang === 'TR' ? 'IP Adresi' : 'IP Address', value: userData.ip }
           ].map((stat, i) => (
             <div key={i} className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-600 tracking-widest block">{stat.label}</span>
                <span className="text-xs font-bold text-zinc-300 block truncate">{stat.value}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
