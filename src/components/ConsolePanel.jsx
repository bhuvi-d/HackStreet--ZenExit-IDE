import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2, XCircle, Info, CheckCircle2, AlertTriangle, Command, ChevronRight, X } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { motion, AnimatePresence } from 'framer-motion';

const ConsolePanel = () => {
  const { consoleLogs, clearLogs, toggleTerminal } = useEditorStore();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  const getLogIcon = (type) => {
    switch (type) {
      case 'error': return <XCircle size={12} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={12} className="text-yellow-500" />;
      case 'success': return <CheckCircle2 size={12} className="text-green-500" />;
      default: return <Info size={12} className="text-blue-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0e] font-mono select-text">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-sidebar/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-primary uppercase text-[10px] font-black tracking-widest">
            <Terminal size={14} />
            <span>Output Console</span>
          </div>
          <div className="h-3 w-[1px] bg-border" />
          <div className="flex gap-4">
             {['Problems', 'Output', 'Debug Console', 'Terminal'].map(tab => (
               <span key={tab} className={`text-[10px] uppercase font-bold tracking-tight cursor-pointer ${tab === 'Output' ? 'text-foreground' : 'text-muted-foreground/40 hover:text-muted-foreground transition-colors'}`}>
                 {tab}
               </span>
             ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={clearLogs}
            className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-all group"
            title="Clear Logs"
          >
            <Trash2 size={14} className="group-active:scale-90" />
          </button>
          <button 
            onClick={toggleTerminal}
            className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-red-500 transition-all group"
            title="Close Terminal"
          >
            <X size={14} className="group-active:scale-90" />
          </button>
        </div>
      </div>
      
      {/* Terminal Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar bg-black/20">
        {consoleLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-10 select-none">
            <Terminal size={64} strokeWidth={1} />
            <span className="text-[10px] mt-4 uppercase font-black tracking-widest">ZenExit Terminal Active</span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {consoleLogs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 items-start group"
              >
                <div className="flex items-center gap-1 min-w-[80px] mt-1 text-[10px] text-muted-foreground/30 font-bold group-hover:text-muted-foreground/50 transition-colors">
                  <ChevronRight size={10} />
                  <span>{log.timestamp || '00:00:00'}</span>
                </div>
                <div className="flex gap-2.5 items-center flex-1">
                  <div className="mt-0.5">{getLogIcon(log.type)}</div>
                  <span className={`
                    text-[12px] leading-tight font-medium tracking-tight whitespace-pre-wrap
                    ${log.type === 'error' ? 'text-red-400' : ''}
                    ${log.type === 'warning' ? 'text-yellow-400' : ''}
                    ${log.type === 'success' ? 'text-green-400' : ''}
                    ${log.type === 'info' ? 'text-blue-400' : ''}
                  `}>
                    {log.message}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ConsolePanel;
