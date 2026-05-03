import React, { useState, useCallback, useEffect, useRef } from 'react';
import FileExplorer from './FileExplorer';
import EditorTabs from './EditorTabs';
import ChatPanel from './ChatPanel';
import ConsolePanel from './ConsolePanel';
import { useEditorStore } from '../store/useEditorStore';

const ResizableLayout = () => {
  const { 
    isSidebarOpen, 
    isTerminalVisible, 
    terminalHeight, 
    setTerminalHeight,
    isChatOpen,
    chatWidth,
    setChatWidth
  } = useEditorStore();
  
  const [isResizingTerminal, setIsResizingTerminal] = useState(false);
  const [isResizingChat, setIsResizingChat] = useState(false);
  const layoutRef = useRef(null);

  const startResizingTerminal = useCallback(() => setIsResizingTerminal(true), []);
  const startResizingChat = useCallback(() => setIsResizingChat(true), []);
  const stopResizing = useCallback(() => {
    setIsResizingTerminal(false);
    setIsResizingChat(false);
  }, []);

  const resize = useCallback((e) => {
    if (!layoutRef.current) return;
    const layoutRect = layoutRef.current.getBoundingClientRect();

    if (isResizingTerminal) {
      const newHeight = layoutRect.bottom - e.clientY;
      if (newHeight > 100 && newHeight < layoutRect.height * 0.8) {
        setTerminalHeight(newHeight);
      }
    }

    if (isResizingChat) {
      const newWidth = layoutRect.right - e.clientX;
      if (newWidth > 200 && newWidth < layoutRect.width * 0.5) {
        setChatWidth(newWidth);
      }
    }
  }, [isResizingTerminal, isResizingChat, setTerminalHeight, setChatWidth]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div ref={layoutRef} className="flex flex-col h-full w-full bg-[#0a0a0b] overflow-hidden select-none">
      {/* Upper section */}
      <div className="flex flex-1 overflow-hidden relative min-h-0">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-64 border-r border-border/50 overflow-hidden flex flex-col min-w-0 min-h-0 shrink-0">
            <FileExplorer />
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 bg-[#1e1e1e] overflow-hidden flex flex-col min-w-0 min-h-0 relative">
          <EditorTabs />
        </div>

        {/* AI Assistant Resizer & Panel */}
        {isChatOpen && (
          <>
            {/* Horizontal Resize Handle */}
            <div 
              onMouseDown={startResizingChat}
              className="w-1.5 h-full cursor-ew-resize bg-primary/5 hover:bg-primary transition-colors z-50 group shrink-0"
            >
              <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-0.5 h-12 bg-primary/40 rounded-full" />
              </div>
            </div>
            
            <div 
              className="border-l border-border/50 overflow-hidden flex flex-col min-w-0 min-h-0 shrink-0"
              style={{ width: chatWidth }}
            >
              <ChatPanel />
            </div>
          </>
        )}
      </div>

      {/* Terminal - FORCED AT BOTTOM */}
      {isTerminalVisible && (
        <div className="relative flex flex-col shrink-0" style={{ height: terminalHeight }}>
          {/* Resize Handle */}
          <div 
            onMouseDown={startResizingTerminal}
            className="absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize bg-primary/20 hover:bg-primary transition-colors z-50 group"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-primary/40 rounded-full group-hover:bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="flex-1 border-t border-border bg-[#0d0d0e] overflow-hidden mt-0.5 min-h-0">
            <ConsolePanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResizableLayout;
