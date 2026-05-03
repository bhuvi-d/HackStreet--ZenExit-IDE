import React, { useState, useEffect } from 'react';
import { Search, FileText, X } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { motion, AnimatePresence } from 'framer-motion';

const QuickSwitcher = () => {
  const { files, isQuickSwitcherOpen, setQuickSwitcherOpen, setActiveFile } = useEditorStore();
  const [query, setQuery] = useState('');

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id) => {
    setActiveFile(id);
    setQuickSwitcherOpen(false);
    setQuery('');
  };

  useEffect(() => {
    if (isQuickSwitcherOpen) {
      const input = document.getElementById('switcher-input');
      input?.focus();
    }
  }, [isQuickSwitcherOpen]);

  if (!isQuickSwitcherOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-sidebar border border-border shadow-2xl rounded-xl overflow-hidden"
      >
        <div className="flex items-center gap-3 p-4 border-b border-border bg-secondary/30">
          <Search size={18} className="text-primary" />
          <input 
            id="switcher-input"
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files by name..."
            className="flex-1 bg-transparent border-none text-sm focus:ring-0 placeholder:text-muted-foreground"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setQuickSwitcherOpen(false);
              if (e.key === 'Enter' && filteredFiles.length > 0) handleSelect(filteredFiles[0].id);
            }}
          />
          <button onClick={() => setQuickSwitcherOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {filteredFiles.length > 0 ? (
            filteredFiles.map(file => (
              <div
                key={file.id}
                onClick={() => handleSelect(file.id)}
                className="flex items-center gap-3 p-3 hover:bg-primary/10 rounded-lg cursor-pointer transition-all group"
              >
                <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <FileText size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{file.language}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm italic">
              No files matching "{query}"
            </div>
          )}
        </div>
        
        <div className="p-3 bg-secondary/20 border-t border-border flex justify-between items-center px-4">
          <div className="flex gap-4 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            <div className="flex gap-1 items-center">
              <span className="bg-muted px-1 rounded">↑↓</span>
              <span>Navigate</span>
            </div>
            <div className="flex gap-1 items-center">
              <span className="bg-muted px-1 rounded">Enter</span>
              <span>Open</span>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground italic">ESC to dismiss</span>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickSwitcher;
