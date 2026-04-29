import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Clock, Globe } from 'lucide-react';
import { useI18n } from '../lib/i18n';

export const MarketTicker: React.FC = () => {
  const { t } = useI18n();
  const [data, setData] = useState([
    { symbol: 'AMZN', price: '189.50', change: '+1.2%', up: true },
    { symbol: 'BTC', price: '64,212', change: '-0.8%', up: false },
    { symbol: 'ETH', price: '3,124', change: '+2.4%', up: true },
    { symbol: 'YBS_CAPP', price: t('widgets.market_stable'), change: '0.0%', up: true },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(item => ({
        ...item,
        price: (parseFloat(item.price.replace(',', '')) + (Math.random() - 0.5)).toFixed(2),
        up: Math.random() > 0.4
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, [t]);

  return (
    <div className="flex gap-4 overflow-hidden py-2 select-none">
      <div className="flex gap-8 animate-ticker whitespace-nowrap">
        {[...data, ...data].map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-zinc-950/80 px-4 py-2 rounded-xl border border-white/5 font-mono">
            <span className="text-[10px] font-black text-white">{item.symbol}</span>
            <span className="text-[10px] text-zinc-400">{item.symbol === 'YBS_CAPP' ? '' : '$'}{item.price}</span>
            <div className={`flex items-center gap-1 text-[9px] font-black ${item.up ? 'text-emerald-500' : 'text-rose-500'}`}>
               {item.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
               {item.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BinaryClock: React.FC = () => {
  const { t } = useI18n();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toBinary = (n: number) => n.toString(2).padStart(6, '0').split('');

  return (
    <div className="flex gap-4 items-center bg-zinc-950/50 p-4 rounded-2xl border border-white/5">
      <div className="flex flex-col gap-2">
        <Clock size={16} className="text-emerald-500" />
        <span className="text-[10px] font-mono text-zinc-500">{t('widgets.binary_clock')}</span>
      </div>
      <div className="flex gap-4">
        {[time.getHours(), time.getMinutes(), time.getSeconds()].map((val, idx) => (
          <div key={idx} className="grid grid-cols-2 gap-1">
            {toBinary(val).map((bit, bi) => (
              <div 
                key={bi} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  bit === '1' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,1)]' : 'bg-zinc-800'
                }`} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
