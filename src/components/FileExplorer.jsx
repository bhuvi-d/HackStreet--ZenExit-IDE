import React, { useState } from 'react';
import { 
  FolderIcon, 
  FileIcon, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Search,
  MoreVertical,
  Code2,
  Trash2,
  Edit2,
  FolderPlus
} from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const FileExplorer = () => {
  const { files, setActiveFile, activeFileId, addNewFile, renameFile, deleteFile } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredFileId, setHoveredFileId] = useState(null);

  const getIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx': return <Code2 size={14} className="text-yellow-400" />;
      case 'ts':
      case 'tsx': return <Code2 size={14} className="text-blue-400" />;
      case 'py': return <Code2 size={14} className="text-blue-500" />;
      case 'cpp':
      case 'c': return <Code2 size={14} className="text-red-500" />;
      case 'java': return <Code2 size={14} className="text-orange-500" />;
      case 'rs': return <Code2 size={14} className="text-orange-700" />;
      case 'go': return <Code2 size={14} className="text-cyan-500" />;
      case 'css': return <Code2 size={14} className="text-blue-300" />;
      case 'html': return <Code2 size={14} className="text-orange-400" />;
      default: return <FileIcon size={14} className="text-foreground/60" />;
    }
  };

  const handleCreateFile = () => {
    const name = prompt('Enter filename (e.g. main.cpp, script.py):');
    if (name) {
      const ext = name.split('.').pop().toLowerCase();
      const langMap = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'cpp': 'cpp',
        'c': 'cpp',
        'java': 'java',
        'rs': 'rust',
        'go': 'go',
        'css': 'css',
        'html': 'html'
      };
      const id = addNewFile(name, langMap[ext] || 'javascript');
      setActiveFile(id);
    }
  };

  const handleRename = (e, id, currentName) => {
    e.stopPropagation();
    const newName = prompt('Rename to:', currentName);
    if (newName && newName !== currentName) {
      renameFile(id, newName);
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this file?')) {
      deleteFile(id);
    }
  };

  return (
    <div className="flex flex-col h-full text-foreground/80 select-none">
      <div className="p-4 flex items-center justify-between border-b border-border bg-sidebar/50">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Workspace</h2>
        <div className="flex gap-1">
          <button onClick={handleCreateFile} className="hover:bg-accent p-1 rounded transition-all active:scale-90" title="New File">
            <Plus size={14} />
          </button>
          <button className="hover:bg-accent p-1 rounded transition-all active:scale-90" title="New Folder">
            <FolderPlus size={14} />
          </button>
        </div>
      </div>

      <div className="px-3 py-3">
        <div className="flex items-center gap-2 p-1.5 bg-secondary/30 rounded-lg border border-border focus-within:ring-1 ring-primary/30 transition-all">
          <Search size={14} className="text-muted-foreground ml-1" />
          <input 
            type="text" 
            placeholder="Search files..." 
            className="bg-transparent border-none text-xs focus:ring-0 w-full placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 custom-scrollbar">
        {/* Project Root Folder */}
        <div 
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent/30 rounded-md cursor-pointer transition-colors group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="text-muted-foreground/60 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            <ChevronRight size={14} />
          </div>
          <FolderIcon size={16} className="text-primary/70 group-hover:text-primary transition-colors" />
          <span className="text-xs font-semibold tracking-tight uppercase text-muted-foreground/80">ZENEXIT_IDE</span>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-3 mt-1 space-y-0.5 border-l border-border/40 pl-1"
            >
              {files.map(file => (
                <motion.div
                  key={file.id}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-all duration-200 rounded-md relative group",
                    activeFileId === file.id 
                      ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" 
                      : "hover:bg-accent/40 text-muted-foreground hover:text-foreground"
                  )}
                  onMouseEnter={() => setHoveredFileId(file.id)}
                  onMouseLeave={() => setHoveredFileId(null)}
                  onClick={() => setActiveFile(file.id)}
                  whileTap={{ scale: 0.98 }}
                >
                  {getIcon(file.name)}
                  <span className="text-xs truncate flex-1">{file.name}</span>
                  
                  {hoveredFileId === file.id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleRename(e, file.id, file.name)}
                        className="p-1 hover:bg-background/50 rounded text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, file.id)}
                        className="p-1 hover:bg-background/50 rounded text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileExplorer;
