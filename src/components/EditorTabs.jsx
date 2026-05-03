import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { X, Play, Save, Settings, Check, Code2 } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const EditorTabs = () => {
  const { 
    files, 
    activeFileId, 
    openFiles, 
    setActiveFile, 
    closeFile, 
    updateFileContent,
    theme,
    addLog,
    isTerminalVisible,
    toggleTerminal,
    runCode
  } = useEditorStore();

  const [isSaved, setIsSaved] = useState(false);

  const activeFile = files.find(f => f.id === activeFileId);
  const openFileList = files.filter(f => openFiles.includes(f.id));

  const handleEditorChange = (value) => {
    if (activeFileId) {
      updateFileContent(activeFileId, value);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    addLog({ type: 'success', message: `Saved ${activeFile?.name || 'file'}` });
    setTimeout(() => setIsSaved(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile]);

  const handleRunCode = () => {
    runCode();
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Tab Bar */}
      <div className="flex items-center bg-sidebar/50 border-b border-border h-11 overflow-x-auto no-scrollbar scroll-smooth px-2">
        {openFileList.map(file => (
          <div
            key={file.id}
            className={clsx(
              "flex items-center gap-2 px-4 h-full border-r border-border cursor-pointer transition-all min-w-[140px] max-w-[220px] group relative",
              activeFileId === file.id 
                ? "bg-background/40 text-foreground" 
                : "text-muted-foreground/60 hover:bg-accent/20 hover:text-foreground"
            )}
            onClick={() => setActiveFile(file.id)}
          >
            {activeFileId === file.id && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_-2px_10px_rgba(99,102,241,0.5)]"
              />
            )}
            <span className={clsx(
              "text-[10px] font-black uppercase tracking-tight truncate flex-1",
              activeFileId === file.id ? "text-primary" : ""
            )}>
              {file.name}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.id);
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-accent p-0.5 rounded transition-all transform hover:rotate-90"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-3 px-4 border-l border-border h-full">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleRunCode}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[10px] font-black tracking-widest transition-all border border-primary/20 shadow-lg shadow-primary/5"
          >
            <Play size={14} fill="currentColor" />
            RUN CODE
          </motion.button>
          <div className="h-4 w-[1px] bg-border" />
          <button 
            onClick={handleSave}
            className="p-2 text-muted-foreground hover:text-foreground transition-all rounded-md hover:bg-accent relative"
            title="Save (Ctrl+S)"
          >
            {isSaved ? <Check size={16} className="text-green-500" /> : <Save size={16} />}
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-all rounded-md hover:bg-accent">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex-1 relative">
        {activeFile ? (
          <Editor
            height="100%"
            language={activeFile.language}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            value={activeFile.content}
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              minimap: { enabled: true, scale: 0.75 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 },
              fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
              fontLigatures: true,
              smoothScrolling: true,
              cursorBlinking: 'expand',
              cursorSmoothCaretAnimation: 'on',
              lineHeight: 1.6,
              renderWhitespace: 'none',
              bracketPairColorization: { enabled: true },
              guides: { bracketPairs: true, indentation: true },
              wordWrap: 'on'
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground/20 select-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <Code2 size={120} strokeWidth={1} />
              <p className="mt-4 text-lg font-light tracking-widest uppercase">ZenExit IDE</p>
              <p className="text-[10px] mt-1 opacity-50 uppercase tracking-tighter">Open a file to start crafting</p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorTabs;
