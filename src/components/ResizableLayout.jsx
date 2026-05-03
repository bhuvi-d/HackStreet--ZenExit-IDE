import React from 'react';
import FileExplorer from './FileExplorer';
import EditorTabs from './EditorTabs';
import ChatPanel from './ChatPanel';
import ConsolePanel from './ConsolePanel';
import { useEditorStore } from '../store/useEditorStore';

const ResizableLayout = () => {
  const { isSidebarOpen, isTerminalVisible } = useEditorStore();

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0a0b] overflow-hidden">
      {/* Upper section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-64 border-r border-border/50 overflow-hidden">
            <FileExplorer />
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 bg-[#1e1e1e] overflow-hidden">
          <EditorTabs />
        </div>

        {/* AI Assistant */}
        <div className="w-80 border-l border-border/50 overflow-hidden">
          <ChatPanel />
        </div>
      </div>

      {/* Terminal - FORCED AT BOTTOM */}
      {isTerminalVisible && (
        <div className="h-64 border-t-4 border-primary/50 bg-[#0d0d0e] overflow-hidden">
          <ConsolePanel />
        </div>
      )}
    </div>
  );
};

export default ResizableLayout;
