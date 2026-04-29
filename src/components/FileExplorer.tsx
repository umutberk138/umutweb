import React, { useState } from 'react';
import { File, Folder, HardDrive, Search, Terminal, ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from '../lib/i18n';

export const FileExplorer: React.FC = () => {
  const { t } = useI18n();
  const [path, setPath] = useState([t('file_explorer.home')]);
  const files = [
    { name: t('file_explorer.projects'), type: 'FOLDER', size: '4.2GB' },
    { name: t('file_explorer.identities'), type: 'FOLDER', size: '128KB' },
    { name: t('file_explorer.logs'), type: 'FILE', size: '12KB' },
    { name: t('file_explorer.key'), type: 'FILE', size: '4KB' },
    { name: t('file_explorer.strategy'), type: 'FILE', size: '1.2MB' },
    { name: t('file_explorer.node_sys'), type: 'FILE', size: '88KB' },
  ];

  return (
    <div className="bg-zinc-950/80 rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[500px] font-mono">
      <div className="p-4 bg-zinc-900 flex items-center gap-4 border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/50" />
          <div className="w-3 h-3 rounded-full bg-amber-500/50" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
        </div>
        <div className="flex-1 bg-black/40 rounded-lg px-4 py-1.5 flex items-center gap-3 text-[10px] text-zinc-500">
           <ArrowUp size={12} className="rotate-90" />
           <span className="truncate">{path.join(' / ')}</span>
        </div>
        <Search size={14} className="text-zinc-700" />
      </div>

      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 overflow-y-auto">
        {files.map((file, i) => (
          <motion.button
            key={file.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-colors group"
          >
            <div className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 shadow-xl transition-all group-hover:scale-110 group-hover:border-emerald-500/40`}>
               {file.type === 'FOLDER' ? (
                 <Folder size={32} className="text-emerald-500" />
               ) : (
                 <File size={32} className="text-blue-500" />
               )}
            </div>
            <div className="text-center">
              <span className="text-[10px] font-black text-zinc-300 block truncate w-24">{file.name}</span>
              <span className="text-[8px] text-zinc-600 uppercase tracking-widest">{file.size}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="p-3 bg-zinc-900/50 border-t border-white/5 flex justify-between items-center px-6">
         <div className="flex items-center gap-2">
            <HardDrive size={12} className="text-zinc-600" />
            <span className="text-[9px] text-zinc-600 font-bold">{t('widgets.storage_usage').replace('%{usage}', '74%')}</span>
         </div>
         <span className="text-[9px] text-zinc-700">{t('widgets.total_items').replace('%{count}', '6')}</span>
      </div>
    </div>
  );
};
