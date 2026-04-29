import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { 
  Users, 
  MessageSquare, 
  Activity, 
  Trophy, 
  History,
  Settings,
  Server,
  TrendingUp,
  Zap,
  Shield
} from 'lucide-react';
import { VisitorStat, ActivityLog } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { MarketTicker, BinaryClock } from './OSWidgets';

export const Dashboard: React.FC = () => {
  const { t, lang } = useI18n();
  const [visitors, setVisitors] = useState<number>(7);
  const [statsData, setStatsData] = useState({
    messages: 0,
    topScore: 0,
    stability: '99.9%'
  });
  const [chartData, setChartData] = useState<{name: string, value: number}[]>([]);

  useEffect(() => {
    // Real-time message count and chart data
    const qMessages = query(collection(db, 'shadow_chat'), orderBy('timestamp', 'desc'), limit(100));
    const unsubMessages = onSnapshot(qMessages, (snap) => {
      setStatsData(prev => ({ ...prev, messages: snap.size }));
      
      // Process chart data (messages per minute/hour or just raw count over time)
      const counts: Record<string, number> = {};
      snap.docs.forEach(doc => {
        const ts = doc.data().timestamp as Timestamp;
        if (ts) {
          const timeLabel = new Date(ts.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          counts[timeLabel] = (counts[timeLabel] || 0) + 1;
        }
      });
      
      const sortedChartData = Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(-10);
      
      setChartData(sortedChartData);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'shadow_chat'));

    // Top high score
    const qUsers = query(collection(db, 'users'), orderBy('highScore', 'desc'), limit(1));
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      if (!snap.empty) {
        setStatsData(prev => ({ ...prev, topScore: snap.docs[0].data().highScore || 0 }));
      }
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));

    const interval = setInterval(() => {
      setVisitors(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(3, Math.min(25, prev + delta));
      });
    }, 4000);

    return () => {
      clearInterval(interval);
      unsubMessages();
      unsubUsers();
    };
  }, []);

  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(() => {
    const qRecentUsers = query(collection(db, 'users'), orderBy('lastSeen', 'desc'), limit(5));
    const unsubRecent = onSnapshot(qRecentUsers, (snap) => {
      setNodes(snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));

    return () => {
      unsubRecent();
    };
  }, []);

  const [kernelLogs, setKernelLogs] = useState<string[]>(
    lang === 'TR' ? [
      '>> PAKET_ALINDI_0x42: TAMAM',
      '>> KİMLİK_SENKRONİZASYONU_TAMAMLANDI',
      '>> KRİPTO_KATMANI_AKTİF',
      '>> GÜVENLİK_DUVARI_GELİŞTİRİLDİ_V2',
      '>> DAĞITIK_SİSTEM_HAZIR'
    ] : [
      '>> RECV_PACKET_0x42: OK',
      '>> AUTH_SYNC_COMPLETE',
      '>> CRYPTO_LAYER_ACTIVE',
      '>> FIREWALL_ENHANCED_V2',
      '>> DIST_SYS_READY'
    ]
  );

  useEffect(() => {
    const logs = lang === 'TR' ? [
      '>> DÜĞÜMLER_TARANIYOR...',
      '>> PAKET_İNCELENİYOR: TEMİZ',
      '>> ŞİFRELEME_ÖZETİ_RSA4096',
      '>> BULUT_DURUMU_SENKRONİZE_EDİLİYOR',
      '>> TEHDİT_GEÇERSİZ_KILINDI_BÖLGE_C',
      '>> ÖNBELLEK_TEMİZLEME_BAŞARILI',
      '>> VERİTABANI_GECİKMESİ_OPTİMİZE_EDİLDİ'
    ] : [
      '>> SCANNING_NODES...',
      '>> PACKET_INSPECT: CLEAN',
      '>> ENCRYPT_HASH_RSA4096',
      '>> SYNCING_CLOUD_STATE',
      '>> THREAT_NULLIFIED_ZONE_C',
      '>> CACHE_FLUSH_SUCCESS',
      '>> DB_LATENCY_OPTIMIZED'
    ];
    
    const interval = setInterval(() => {
      setKernelLogs(prev => {
        const next = [...prev, logs[Math.floor(Math.random() * logs.length)]];
        return next.slice(-6);
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [lang]);

  const stats = [
    { label: t('dashboard.live_visitors'), value: visitors, icon: Users, color: 'text-blue-400', sub: t('dashboard.active_sessions') },
    { label: t('dashboard.chat_volume'), value: statsData.messages, icon: MessageSquare, color: 'text-emerald-500', sub: t('dashboard.messages_processed') },
    { label: t('dashboard.peak_score'), value: statsData.topScore, icon: Trophy, color: 'text-amber-400', sub: t('dashboard.global_high_score') },
    { label: t('dashboard.stability_index'), value: statsData.stability, icon: Activity, color: 'text-indigo-400', sub: t('dashboard.system_health') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8 overflow-hidden">
        <MarketTicker />
        <BinaryClock />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-mono text-emerald-500 tracking-tighter">
          // {t('dashboard.performance')}
        </h2>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-widest uppercase">{t('dashboard.optimization')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-apex-card border border-apex-border p-5 rounded-3xl shadow-xl"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest font-bold">{stat.label}</span>
              <stat.icon size={16} className={stat.color} />
            </div>
            <div className={`text-3xl font-mono font-bold tracking-tighter ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-[10px] text-zinc-600 mt-1 uppercase tracking-tighter font-bold">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-apex-card border border-apex-border rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                <TrendingUp size={12} className="text-emerald-500" /> {t('dashboard.throughput')}
              </h3>
              <p className="text-2xl font-black italic tracking-tighter uppercase mt-1">{t('dashboard.traffic')}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest">{t('dashboard.live_node')}</span>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    border: '1px solid #27272a',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontFamily: 'monospace'
                  }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-zinc-900 border border-apex-border rounded-3xl p-6 flex flex-col justify-between">
           <div>
             <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 mb-4">
               <Zap size={12} className="text-amber-400" /> {t('dashboard.metrics')}
             </h3>
             <div className="space-y-4">
                {[
                  { label: t('dashboard.cpu_load'), val: '12.4%', color: 'bg-emerald-500' },
                  { label: t('dashboard.memory'), val: '4.2GB / 16GB', color: 'bg-blue-500', pct: '26%' },
                  { label: t('dashboard.firewall'), val: lang === 'TR' ? 'Aktif (v4.1)' : 'Active (v4.1)', color: 'bg-amber-400', pct: '100%' },
                  { label: t('dashboard.latency'), val: '18ms', color: 'bg-indigo-500', pct: '15%' }
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-mono uppercase mb-1">
                      <span className="text-zinc-500">{m.label}</span>
                      <span className="text-zinc-300 font-bold">{m.val}</span>
                    </div>
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: m.pct || m.val }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full ${m.color}`}
                      />
                    </div>
                  </div>
                ))}
             </div>
           </div>
           
           <div className="mt-8 p-3 bg-black/40 border border-zinc-800 rounded-2xl">
              <h4 className="text-[9px] font-mono font-bold text-zinc-600 uppercase mb-2">{t('dashboard.kernel_status')}:</h4>
              <div className="space-y-1 overflow-hidden h-[80px]">
                 {kernelLogs.map((log, i) => (
                   <div key={i} className="text-[8px] font-mono text-emerald-500/60 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                     {log}
                   </div>
                 ))}
              </div>
           </div>

           <button className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black border border-emerald-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all mt-6">
             {t('dashboard.reset')}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Table */}
        <div className="bg-apex-card border border-apex-border rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-bottom border-apex-border flex items-center justify-between bg-zinc-800/20">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-zinc-400">
               {t('dashboard.nodes_title')}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/30 text-[9px] uppercase font-mono text-zinc-500 tracking-widest border-b border-apex-border">
                  <th className="px-4 py-3 font-bold">{t('dashboard.node_id')}</th>
                  <th className="px-4 py-3 font-bold">{t('dashboard.peak_score')}</th>
                  <th className="px-4 py-3 font-bold">{t('dashboard.last_active')}</th>
                  <th className="px-4 py-3 font-bold">{t('dashboard.state')}</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-mono">
                {nodes.map((n, i) => (
                  <tr key={i} className="border-t border-apex-border hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-zinc-500">{n.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3 text-zinc-300 font-bold">{n.highScore || 0}</td>
                    <td className="px-4 py-3 text-emerald-600">
                      {n.lastSeen ? new Date(n.lastSeen).toLocaleTimeString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        {lang === 'TR' ? 'DOĞRULANDI' : 'VERIFIED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-apex-card border border-apex-border rounded-3xl p-6 shadow-xl">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-6 border-b border-apex-border pb-4 text-zinc-400">
            <History size={14} className="text-emerald-500" /> {t('dashboard.modules')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {[
                { name: t('dashboard.matrix_bg'), status: lang === 'TR' ? 'Aktif' : 'Active' },
                { name: 'Dark Mode', status: lang === 'TR' ? 'Aktif' : 'Active' },
                { name: 'Terminal', status: lang === 'TR' ? 'Doğrulandı' : 'Authenticated' },
                { name: 'Encryption', status: 'MIL-SPEC' }
             ].map((m, i) => (
                <div key={i} className="p-3 bg-zinc-800/30 border border-apex-border rounded-2xl flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-widest">{m.name}</span>
                    <span className="text-[9px] font-bold text-emerald-400 px-2 py-0.5 bg-emerald-400/5 rounded-full">{m.status}</span>
                </div>
             ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-apex-border">
             <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-4 text-zinc-400">
                <Settings size={14} className="text-blue-500" /> {t('dashboard.preferences')}
             </h3>
             <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-medium">{t('dashboard.auto_opt')}</span>
                    <div className="w-8 h-4 bg-emerald-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-zinc-950 rounded-full" /></div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-medium">{t('dashboard.matrix_bg')}</span>
                    <div className="w-8 h-4 bg-emerald-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-zinc-950 rounded-full" /></div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-medium">{t('dashboard.logging')}</span>
                    <div className="w-8 h-4 bg-zinc-800 rounded-full relative"><div className="absolute left-0.5 top-0.5 w-3 h-3 bg-zinc-500 rounded-full" /></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
