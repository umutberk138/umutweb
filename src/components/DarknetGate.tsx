import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { Shield, Lock, Cpu, Globe, Send, Terminal as TerminalIcon, Camera, RefreshCw } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { DarknetDashboard } from './DarknetDashboard';

export const DarknetGate: React.FC = () => {
  const { t } = useI18n();
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('REGISTER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    alias: '',
    password: ''
  });
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'TRANSMITTING' | 'TRANSITIONING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [mugshot, setMugshot] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), msg]);
  };

  const startCamera = async () => {
    setShowCamera(true);
    setMugshot(null);
    setIsApproved(false);
    addLog('REQUESTING OPTICAL ACCESS...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      addLog('OPTICAL SENSORS ONLINE.');
      
      // Automatic capture sequence
      setIsScanning(true);
      addLog('SCANNING FACIAL BIOMETRICS...');
      
      setTimeout(() => {
        captureMugshot();
      }, 2500);

    } catch (err) {
      addLog('ERROR: OPTICAL ACCESS DENIED.');
      setShowCamera(false);
    }
  };

  const captureMugshot = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d', { willReadFrequently: true });
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setMugshot(dataUrl);
        setIsScanning(false);
        
        // Stop camera stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setShowCamera(false);
        addLog('IDENTITY PATTERN CAPTURED. AWAITING APPROVAL.');
      }
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'REGISTER' && !isApproved) {
      addLog('WARNING: IDENTITY APPROVAL REQUIRED.');
      return;
    }

    setStatus('TRANSMITTING');
    addLog(authMode === 'REGISTER' ? 'INITIATING NODE DISCOVERY...' : 'VERIFYING CREDENTIALS...');

    try {
      let finalUser: any = null;
      if (authMode === 'REGISTER') {
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        addLog(`SIGNAL: ${geoData.ip} // ${geoData.city}`);

        let batteryInfo = 'N/A';
        try {
          const battery = await (navigator as any).getBattery?.();
          if (battery) batteryInfo = `${Math.round(battery.level * 100)}%`;
        } catch (e) {}

        const userData = {
          ...formData,
          mugshotUrl: mugshot,
          ip: geoData.ip,
          city: geoData.city,
          country: geoData.country_name,
          isp: geoData.org,
          uagent: navigator.userAgent,
          screen: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          platform: (navigator as any).platform || 'Unknown',
          cores: navigator.hardwareConcurrency || 0,
          memory: (navigator as any).deviceMemory || 0,
          battery: batteryInfo,
          connection: (navigator as any).connection?.effectiveType || 'N/A',
          timestamp: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'registrations'), userData);
        finalUser = { id: docRef.id, ...userData };
        setCurrentUser(finalUser);
        addLog('UPLINK ESTABLISHED. NODE CREATED.');
      } else {
        const q = query(
          collection(db, 'registrations'),
          where('email', '==', formData.email),
          where('password', '==', formData.password)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          addLog('ACCESS DENIED: INVALID KEY');
          setStatus('ERROR');
          setTimeout(() => setStatus('IDLE'), 3000);
          return;
        }

        const userDoc = snapshot.docs[0];
        finalUser = { id: userDoc.id, ...userDoc.data() };
        setCurrentUser(finalUser);
        addLog('CREDENTIALS VERIFIED. ACCESS GRANTED.');
      }

      // Transition Phase
      setStatus('TRANSITIONING');
      
      localStorage.setItem('darknet_user', JSON.stringify({
        id: finalUser?.id || 'temp',
        alias: formData.alias || finalUser?.alias,
        email: formData.email,
        mugshotUrl: mugshot || finalUser?.mugshotUrl
      }));

      // Finish transition after delay
      setTimeout(() => {
        setStatus('SUCCESS');
        window.dispatchEvent(new Event('storage')); // Notify App.tsx
      }, 3500);

    } catch (error) {
      console.error(error);
      addLog('FAILURE: PROTOCOL BREACHED.');
      setStatus('ERROR');
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  if (status === 'TRANSITIONING') {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 font-mono animate-in fade-in duration-700">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-64 h-64 flex items-center justify-center"
        >
          {/* Animated Rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute border border-emerald-500/20 rounded-full"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ 
                width: i * 100 + 100, 
                height: i * 100 + 100, 
                opacity: [0, 0.5, 0],
                rotate: i % 2 === 0 ? 360 : -360
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 0.2
              }}
            />
          ))}

          {/* Center Identity */}
          <div className="relative z-10 w-32 h-32 rounded-3xl overflow-hidden border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] bg-zinc-950">
            {currentUser?.mugshotUrl ? (
              <img src={currentUser.mugshotUrl} alt="Identity" className="w-full h-full object-cover grayscale contrast-125" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-emerald-500">
                <Shield size={48} />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-emerald-500/90 py-1 text-center">
              <span className="text-[10px] font-black text-zinc-950 tracking-widest">VERIFIED</span>
            </div>
          </div>
        </motion.div>

        <div className="text-center space-y-4 max-w-md w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Access Granted</h2>
            <p className="text-emerald-500 text-xs font-black uppercase tracking-[0.3em] mt-2">Node Handshake Successful</p>
          </motion.div>

          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 space-y-1.5 text-left overflow-hidden">
             <motion.div 
               initial={{ x: -10, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 1 }}
               className="text-[10px] flex justify-between"
             >
                <span className="text-zinc-600">ID_PATTERN:</span>
                <span className="text-emerald-500 font-bold truncate ml-4">CONFIRMED_{currentUser?.id?.slice(0, 8)}</span>
             </motion.div>
             <motion.div 
               initial={{ x: -10, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 1.2 }}
               className="text-[10px] flex justify-between"
             >
                <span className="text-zinc-600">ENCRYPTION:</span>
                <span className="text-emerald-500 font-bold">AES_256_GCM</span>
             </motion.div>
             <motion.div 
               initial={{ x: -10, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 1.4 }}
               className="text-[10px] flex justify-between"
             >
                <span className="text-zinc-600">UPLINK_STRENGTH:</span>
                <span className="text-emerald-500 font-bold">STABLE_99%</span>
             </motion.div>
             
             {/* Progress Bar */}
             <div className="w-full h-1 bg-zinc-800 rounded-full mt-4 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 2.5, ease: "easeInOut" }}
                 className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
               />
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'SUCCESS') {
    return <DarknetDashboard alias={formData.alias || currentUser?.alias} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full animate-blink ${status === 'ERROR' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            <span className={`text-[11px] font-mono font-black uppercase tracking-[0.4em] ${status === 'ERROR' ? 'text-rose-500' : 'text-emerald-500'}`}>
              {status === 'ERROR' ? 'Protocol Error' : authMode === 'REGISTER' ? t('darknet.unauthorized') : t('darknet.login_title')}
            </span>
          </div>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
            {authMode === 'REGISTER' ? (
              <>{t('darknet.title').split(' ')[0]} <br /><span className="text-emerald-500">{t('darknet.title').split(' ').slice(1).join(' ')}</span></>
            ) : (
              <>{t('darknet.login_title')} <br /><span className="text-rose-500">Node</span></>
            )}
          </h1>
          <p className="text-zinc-500 font-medium leading-relaxed max-w-sm italic">
            {authMode === 'REGISTER' ? t('darknet.subtitle') : 'Submit your origin email and protocol password to re-establish uplink.'}
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl space-y-4 font-mono text-[11px]">
          <div className="flex items-center gap-3 text-zinc-600">
            <TerminalIcon size={14} /> <span>SYSTEM_LOG: V2.4_READY</span>
          </div>
          <div className="space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="text-emerald-500/80">{'>> '} {log}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel p-10 rounded-[48px] shadow-3xl relative border border-white/10 group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
        
        <form onSubmit={handleAuth} className="space-y-6 relative z-10">
          {authMode === 'REGISTER' && (
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Cpu size={12} /> {t('darknet.name_label')}
              </label>
              <input 
                required
                type="text" 
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-950/80 border border-white/5 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white font-bold transition-all"
              />
            </div>
          )}

          {authMode === 'REGISTER' && (
            <div className="space-y-4">
              <label className="text-[11px] font-mono font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Camera size={12} /> Identity Pattern Scan
              </label>
              
              <div className="relative aspect-video bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center group shadow-2xl">
                {mugshot ? (
                  <div className="relative w-full h-full">
                    <img src={mugshot} alt="Mugshot" className="w-full h-full object-cover grayscale brightness-125 contrast-125" />
                    <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay" />
                    
                    {!isApproved ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-center">
                        <span className="text-[10px] font-mono font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Validate Identity Pattern?</span>
                        <div className="flex gap-4">
                          <button 
                            type="button"
                            onClick={() => setIsApproved(true)}
                            className="px-6 py-2 bg-emerald-500 text-zinc-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                          >
                            Approve
                          </button>
                          <button 
                            type="button"
                            onClick={startCamera}
                            className="px-6 py-2 bg-zinc-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                          >
                            Recapture
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-emerald-500/90 text-zinc-950 rounded-full">
                        <Shield size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Confirmed</span>
                      </div>
                    )}
                  </div>
                ) : showCamera ? (
                  <div className="relative w-full h-full">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale opacity-60" />
                    <div className="absolute inset-0 border-[30px] border-emerald-500/5 pointer-events-none" />
                    
                    {/* Scanning Overlay */}
                    {isScanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-48 h-48 border border-emerald-500/40 relative">
                           <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500" />
                           <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500" />
                           <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500" />
                           <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500" />
                           <div className="absolute top-1/2 left-0 w-full h-0.5 bg-emerald-500 animate-scan opacity-40 shadow-[0_0_10px_rgba(16,185,129,1)]" />
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500 mt-6 tracking-[0.5em] animate-pulse">ANALYZING_FACIAL_NODES...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={startCamera}
                    className="flex flex-col items-center gap-4 text-zinc-700 hover:text-emerald-500 transition-all p-12 group/btn"
                  >
                    <div className="w-20 h-20 rounded-full border border-dashed border-zinc-800 flex items-center justify-center group-hover/btn:border-emerald-500/50 group-hover/btn:scale-110 transition-all">
                       <Camera size={32} />
                    </div>
                    <div className="text-center">
                       <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] block">Initialize Optical Scan</span>
                       <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Biometric Protocol V4.2</span>
                    </div>
                  </button>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] font-mono font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Globe size={12} /> {t('darknet.email_label')}
            </label>
            <input 
              required
              type="email" 
              placeholder="email@node.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-zinc-950/80 border border-white/5 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white font-bold transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authMode === 'REGISTER' && (
              <div className="space-y-2">
                <label className="text-[11px] font-mono font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Lock size={12} /> {t('darknet.alias_label')}
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="Alias"
                  value={formData.alias}
                  onChange={e => setFormData({...formData, alias: e.target.value})}
                  className="w-full bg-zinc-950/80 border border-white/5 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white font-bold transition-all"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Shield size={12} /> {t('darknet.password_label')}
              </label>
              <input 
                required
                type="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-zinc-950/80 border border-white/5 p-4 rounded-2xl focus:outline-none focus:border-rose-500 text-white font-bold transition-all"
              />
            </div>
          </div>

          <button 
            disabled={status === 'TRANSMITTING'}
            className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-700 text-zinc-950 font-black italic uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {status === 'TRANSMITTING' ? (
              <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Send size={18} /> {authMode === 'REGISTER' ? t('darknet.button') : 'Authenticate'}</>
            )}
          </button>
        </form>

        <button 
          onClick={() => setAuthMode(authMode === 'REGISTER' ? 'LOGIN' : 'REGISTER')}
          className="w-full text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500 hover:text-emerald-500 transition-colors pt-4 border-t border-white/5"
        >
          {authMode === 'REGISTER' ? t('darknet.login_switch') : t('darknet.register_switch')}
        </button>
      </div>
    </div>
  );
};
