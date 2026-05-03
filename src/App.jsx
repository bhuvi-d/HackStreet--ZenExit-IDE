import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import ResizableLayout from './components/ResizableLayout';
import QuickSwitcher from './components/QuickSwitcher';
import WelcomeModal from './components/WelcomeModal';
import { 
  Menu, 
  Moon, 
  Sun, 
  Monitor, 
  Search, 
  Layers, 
  Layout, 
  Zap, 
  ChevronRight,
  UserCircle,
  Sparkles
} from 'lucide-react';
import { useEditorStore } from './store/useEditorStore';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { 
    theme, 
    setTheme, 
    toggleSidebar, 
    isSidebarOpen, 
    setQuickSwitcherOpen, 
    isQuickSwitcherOpen,
    toggleTerminal,
    isTerminalVisible,
    runCode,
    addNewFile,
    setActiveFile
  } = useEditorStore();

  const [showWelcome, setShowWelcome] = React.useState(true);
  const [isFileDropdownOpen, setIsFileDropdownOpen] = React.useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('zenexit-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setQuickSwitcherOpen(!isQuickSwitcherOpen);
      }
      if (e.key === 'Escape') {
        setQuickSwitcherOpen(false);
        setIsFileDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuickSwitcherOpen]);

  const handleCreateLanguageFile = (name, lang) => {
    const id = addNewFile(name, lang);
    setActiveFile(id);
    setIsFileDropdownOpen(false);
  };

  const languages = [
    { name: 'JavaScript', lang: 'javascript', ext: 'js' },
    { name: 'TypeScript', lang: 'typescript', ext: 'ts' },
    { name: 'Python', lang: 'python', ext: 'py' },
    { name: 'C++', lang: 'cpp', ext: 'cpp' },
    { name: 'Java', lang: 'java', ext: 'java' },
    { name: 'Rust', lang: 'rust', ext: 'rs' },
    { name: 'Go', lang: 'go', ext: 'go' },
    { name: 'HTML', lang: 'html', ext: 'html' },
    { name: 'CSS', lang: 'css', ext: 'css' },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30 font-sans antialiased">
      <AnimatePresence>
        {showWelcome && <WelcomeModal onComplete={() => setShowWelcome(false)} />}
      </AnimatePresence>

      <QuickSwitcher />
      
      {/* Premium Top Bar */}
      <header className="h-11 border-b border-border bg-sidebar/80 backdrop-blur-md flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 px-2 py-1 cursor-pointer group"
          >
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-300">
              <Zap size={14} fill="white" />
            </div>
            <span className="text-sm font-black tracking-tight uppercase italic bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent pr-1">
              ZenExit IDE
            </span>
          </motion.div>
          
          <nav className="hidden lg:flex items-center gap-2 relative">
            {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map(item => (
              <div key={item} className="relative">
                <button 
                  id={item === 'File' ? 'tour-file' : item === 'Run' ? 'tour-run' : undefined}
                  onClick={() => {
                    if (item === 'File') setIsFileDropdownOpen(!isFileDropdownOpen);
                    else {
                      setIsFileDropdownOpen(false);
                      if (item === 'Terminal') toggleTerminal();
                      if (item === 'Run') runCode();
                    }
                  }}
                  className={clsx(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                    (item === 'Terminal' && isTerminalVisible) || (item === 'File' && isFileDropdownOpen)
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {item}
                </button>

                {item === 'File' && isFileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsFileDropdownOpen(false)} 
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-sidebar border border-border shadow-2xl rounded-xl overflow-hidden z-50 p-1.5"
                    >
                      <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/50 mb-1">
                        New Boilerplate
                      </div>
                      <div className="space-y-0.5">
                        {languages.map((l) => (
                          <button
                            key={l.lang}
                            onClick={() => handleCreateLanguageFile(`main.${l.ext}`, l.lang)}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all group"
                          >
                            <div className="flex items-center gap-2">
                              <Sparkles size={12} className="text-primary/50 group-hover:text-primary" />
                              <span>{l.name} File</span>
                            </div>
                            <span className="text-[10px] opacity-50 uppercase">{l.ext}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div 
            onClick={() => setQuickSwitcherOpen(true)}
            className="flex items-center gap-3 bg-secondary/50 hover:bg-secondary border border-border px-3 py-1.5 rounded-lg text-xs text-muted-foreground cursor-pointer transition-all group min-w-[200px]"
          >
            <Search size={14} className="group-hover:text-primary transition-colors" />
            <span className="flex-1">Search files...</span>
            <span className="text-[10px] bg-background px-1.5 py-0.5 rounded border border-border">Ctrl P</span>
          </div>

          <div className="flex items-center gap-1 border-x border-border px-3 h-6">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-primary"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className={`p-1.5 hover:bg-accent rounded-full transition-colors ${!isSidebarOpen ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
            >
              <Layout size={18} />
            </motion.button>
          </div>

          <div className="flex items-center gap-4">
            <Search size={20} className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center cursor-pointer hover:ring-2 ring-primary ring-offset-2 ring-offset-background transition-all shadow-lg">
              <UserCircle size={16} className="text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Interface */}
      <main className="flex-1 relative bg-[#0a0a0b]">
        <ResizableLayout />
      </main>

      {/* Status Bar */}
      <footer className="h-7 border-t border-border bg-primary flex items-center justify-between px-4 text-[10px] text-white font-bold tracking-tight uppercase">
        <div className="flex items-center gap-6 h-full">
          <div className="flex items-center gap-1.5 hover:bg-white/10 px-3 h-full cursor-pointer transition-colors">
            <Layers size={11} />
            <span>Ln 1, Col 1</span>
          </div>
          <div className="flex items-center gap-1.5 hover:bg-white/10 px-3 h-full cursor-pointer transition-colors">
            <span>Spaces: 2</span>
          </div>
          <div className="flex items-center gap-1.5 hover:bg-white/10 px-3 h-full cursor-pointer transition-colors">
            <span>UTF-8</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 h-full">
          <div 
            onClick={toggleTerminal}
            className={clsx(
              "flex items-center gap-1.5 px-3 h-full cursor-pointer transition-colors",
              isTerminalVisible ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/50"
            )}
          >
            <Sparkles size={11} />
            <span>AI: ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 px-4 h-full cursor-pointer transition-colors">
            <Zap size={11} />
            <span>Zen Mode</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
