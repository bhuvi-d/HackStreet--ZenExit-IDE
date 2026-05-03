import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialFiles = [
  {
    id: '1',
    name: 'App.jsx',
    language: 'javascript',
    content: `import React from 'react';\n\nfunction App() {\n  return (\n    <div className="p-4">\n      <h1 className="text-2xl font-bold">Welcome to ZenExit IDE</h1>\n      <p>Start coding with AI assistance!</p>\n    </div>\n  );\n}\n\nexport default App;`,
    isOpen: true,
  },
  {
    id: '2',
    name: 'index.css',
    language: 'css',
    content: `body {\n  margin: 0;\n  padding: 0;\n  background: #0d0d0e;\n  color: #fff;\n}`,
    isOpen: false,
  },
  {
    id: '3',
    name: 'main.py',
    language: 'python',
    content: `def main():\n    print("Hello from ZenExit IDE!")\n\nif __name__ == "__main__":\n    main()`,
    isOpen: false,
  }
];

export const useEditorStore = create(
  persist(
    (set, get) => ({
      files: initialFiles,
      activeFileId: '1',
      openFiles: ['1'],
      aiMessages: [
        { role: 'assistant', content: 'Hello! I am your ZenExit AI assistant. How can I help you code today?' }
      ],
      consoleLogs: [
        { type: 'info', message: 'ZenExit IDE Initialized.' },
        { type: 'success', message: 'Welcome to the future of coding.' }
      ],
      theme: 'dark',
      isSidebarOpen: true,
      isTerminalVisible: true,
      isChatOpen: true,
      terminalHeight: 256,
      chatWidth: 320,
      panelSizes: { sidebar: 20, main: 60, chat: 20 },
      isQuickSwitcherOpen: false,
      hasSeenWelcome: false,

      setTheme: (theme) => set({ theme }),
      setHasSeenWelcome: (hasSeenWelcome) => set({ hasSeenWelcome }),
      setTerminalHeight: (height) => set({ terminalHeight: height }),
      setChatWidth: (width) => set({ chatWidth: width }),
      toggleTerminal: () => set(state => ({ isTerminalVisible: !state.isTerminalVisible })),
      toggleChat: () => set(state => ({ isChatOpen: !state.isChatOpen })),
      setPanelSizes: (sizes) => set({ panelSizes: sizes }),
      setQuickSwitcherOpen: (isOpen) => set({ isQuickSwitcherOpen: isOpen }),
      
      setActiveFile: (id) => {
        if (!id) return;
        set(state => ({
          openFiles: state.openFiles.includes(id) ? state.openFiles : [...state.openFiles, id],
          activeFileId: id
        }));
      },

      closeFile: (id) => {
        const { openFiles, activeFileId } = get();
        const newOpenFiles = openFiles.filter(fid => fid !== id);
        let newActiveId = activeFileId;
        
        if (activeFileId === id) {
          newActiveId = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
        }
        
        set({ openFiles: newOpenFiles, activeFileId: newActiveId });
      },

      updateFileContent: (id, content) => {
        set(state => ({
          files: state.files.map(f => f.id === id ? { ...f, content } : f)
        }));
      },

      addLog: (log) => set(state => ({
        consoleLogs: [...state.consoleLogs, { ...log, timestamp: new Date().toLocaleTimeString() }]
      })),

      clearLogs: () => set({ consoleLogs: [] }),

      addAiMessage: (message) => set(state => ({
        aiMessages: [...state.aiMessages, message]
      })),

      toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),

      addNewFile: (name, language = 'javascript') => {
        const templates = {
          javascript: `// ZenExit JavaScript Template\nconsole.log("Hello from ${name}!");\n\nfunction main() {\n  console.log("ZenExit IDE is ready.");\n}\n\nmain();`,
          typescript: `// ZenExit TypeScript Template\ninterface User {\n  name: string;\n  id: number;\n}\n\nconst user: User = { name: "Developer", id: 1 };\nconsole.log(\`Hello \${user.name} from ${name}!\`);`,
          python: `# ZenExit Python Template\ndef main():\n    print("Hello from ${name}!")\n\nif __name__ == "__main__":\n    main()`,
          cpp: `// ZenExit C++ Template\n#include <iostream>\n\nint main() {\n    std::cout << "Hello from ${name}!" << std::endl;\n    return 0;\n}`,
          java: `// ZenExit Java Template\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from ${name}!");\n    }\n}`,
          rust: `// ZenExit Rust Template\nfn main() {\n    println!("Hello from ${name}!");\n}`,
          go: `// ZenExit Go Template\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from ${name}!")\n}`,
          css: `/* ZenExit Styles */\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n}\n\n.container {\n  display: flex;\n  justify-content: center;\n}`,
          html: `<!DOCTYPE html>\n<html>\n<head>\n  <title>${name}</title>\n</head>\n<body>\n  <h1 style="color: #6366f1;">Welcome to ZenExit</h1>\n  <p>Your AI-powered coding workspace is ready.</p>\n</body>\n</html>`
        };

        const newFile = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          language,
          content: templates[language] || templates['javascript'],
          isOpen: false,
        };
        set(state => ({
          files: [...state.files, newFile]
        }));
        return newFile.id;
      },

      runCode: () => {
        const { activeFileId, files, addLog, toggleTerminal, isTerminalVisible } = get();
        if (!activeFileId) return;
        const activeFile = files.find(f => f.id === activeFileId);
        if (!activeFile) return;

        if (!isTerminalVisible) toggleTerminal();
        addLog({ type: 'info', message: `ZenExit Runtime: Executing ${activeFile.name}...` });
        
        const content = activeFile.content;
        
        setTimeout(() => {
          const lang = activeFile.language;
          if (lang === 'javascript' || lang === 'typescript') {
            const consoleLogs = content.match(/console\.log\(['"`](.*?)['"`]\)/g);
            if (consoleLogs) {
              consoleLogs.forEach(log => {
                const msg = log.match(/\(['"`](.*?)['"`]\)/)[1];
                addLog({ type: 'success', message: `[Output] ${msg}` });
              });
            }
            if (content.includes('error') || content.includes('throw')) {
              addLog({ type: 'error', message: 'Runtime Error: Execution stopped unexpectedly.' });
            } else {
              addLog({ type: 'success', message: 'Process exited with code 0.' });
            }
          } 
          else if (lang === 'python') {
            if (content.includes('print')) {
              const prints = content.match(/print\(['"`](.*?)['"`]\)/g);
              if (prints) {
                prints.forEach(p => {
                  const msg = p.match(/\(['"`](.*?)['"`]\)/)[1];
                  addLog({ type: 'success', message: `[Python Output] ${msg}` });
                });
              }
            }
            addLog({ type: 'success', message: 'Process exited with code 0.' });
          }
          else if (['cpp', 'java', 'rust', 'go'].includes(lang)) {
            addLog({ type: 'success', message: `[${lang.toUpperCase()} Build] Compiling...` });
            setTimeout(() => {
              addLog({ type: 'success', message: `[${lang.toUpperCase()} Output] Hello from ${activeFile.name}!` });
              addLog({ type: 'success', message: 'Process exited with code 0.' });
            }, 400);
          }
          else {
            addLog({ type: 'warning', message: 'Execution simulation not supported for this language.' });
          }
        }, 800);
      },

      renameFile: (id, newName) => set(state => ({
        files: state.files.map(f => f.id === id ? { ...f, name: newName } : f)
      })),

      deleteFile: (id) => set(state => {
        const newFiles = state.files.filter(f => f.id !== id);
        const newOpenFiles = state.openFiles.filter(fid => fid !== id);
        let newActiveId = state.activeFileId;
        if (state.activeFileId === id) {
          newActiveId = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
        }
        return { files: newFiles, openFiles: newOpenFiles, activeFileId: newActiveId };
      }),

      insertCodeToActiveFile: (code, mode = 'append') => {
        const { activeFileId, files } = get();
        if (!activeFileId) return;
        const file = files.find(f => f.id === activeFileId);
        if (!file) return;

        let newContent = file.content;
        if (mode === 'replace') {
          newContent = code;
        } else {
          newContent = file.content + '\n' + code;
        }

        set(state => ({
          files: state.files.map(f => f.id === activeFileId ? { ...f, content: newContent } : f)
        }));
      }
    }),
    {
      name: 'zenexit-editor-storage',
      partialize: (state) => ({ 
        files: state.files, 
        theme: state.theme,
        openFiles: state.openFiles,
        activeFileId: state.activeFileId,
        terminalHeight: state.terminalHeight,
        chatWidth: state.chatWidth,
        isChatOpen: state.isChatOpen,
        hasSeenWelcome: state.hasSeenWelcome
      }),
    }
  )
);
