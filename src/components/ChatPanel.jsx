import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  Trash2, 
  Copy, 
  Check, 
  FileInput,
  Lightbulb,
  Zap
} from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { getAiResponse } from '../utils/mockAI';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPanel = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { aiMessages, addAiMessage, files, activeFileId, insertCodeToActiveFile, clearLogs } = useEditorStore();
  const chatEndRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);

  const activeFile = files.find(f => f.id === activeFileId);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    addAiMessage(userMsg);
    setInput('');
    setIsLoading(true);

    try {
      const context = activeFile ? activeFile.content : '';
      const response = await getAiResponse(input, context);
      addAiMessage({ 
        role: 'assistant', 
        content: response.content,
        suggestedCode: response.suggestedCode 
      });
    } catch (error) {
      addAiMessage({ role: 'assistant', content: 'Sorry, I encountered an error processing your request.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-sidebar/30 backdrop-blur-md">
      {/* AI Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-background/20">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-primary font-black tracking-tighter">
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span className="text-xs uppercase">AI Assistant</span>
          </div>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">Real-time Insights</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => clearLogs()}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 hover:bg-accent rounded"
            title="Clear Chat"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {aiMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-4">
            <Bot size={48} strokeWidth={1} />
            <p className="mt-4 text-xs font-medium uppercase tracking-widest">Awaiting Input</p>
            <p className="text-[10px] mt-2">I can optimize, explain, or debug your active file content.</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {aiMessages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  msg.role === 'assistant' ? 'bg-primary/20 text-primary' : 'bg-secondary text-foreground'
                }`}>
                  {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground/60">
                  {msg.role === 'assistant' ? 'ZenExit Bot' : 'You'}
                </span>
              </div>
              
              <div className="flex flex-col gap-3 w-full">
                <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'assistant' 
                    ? 'bg-secondary/40 text-foreground border border-border/50' 
                    : 'bg-primary/80 text-white self-end ml-8'
                }`}>
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                  ))}
                </div>
                
                {msg.role === 'assistant' && msg.suggestedCode && (
                  <div className="flex gap-2 pl-2">
                    <button 
                      onClick={() => insertCodeToActiveFile(msg.suggestedCode)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg text-[10px] font-bold transition-all border border-primary/20"
                    >
                      <Zap size={12} />
                      INSERT CODE
                    </button>
                    <button 
                      onClick={() => handleCopy(msg.suggestedCode, idx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-muted-foreground hover:text-foreground rounded-lg text-[10px] font-bold transition-all border border-border"
                    >
                      {copiedId === idx ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      {copiedId === idx ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex flex-col gap-2 items-start">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  <Bot size={14} />
                </div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground/60 italic animate-pulse">
                  Analyzing Code...
                </span>
              </div>
            <div className="bg-secondary/30 rounded-xl px-4 py-3 border border-border/50 flex gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                    className="w-1 h-1 bg-primary rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* AI Input Area */}
      <div className="p-4 border-t border-border bg-background/20">
        <div className="bg-secondary/40 border border-border rounded-2xl p-2 focus-within:ring-1 ring-primary/40 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={activeFile ? `Ask about ${activeFile.name}...` : "Ask AI for insights..."}
            className="w-full bg-transparent border-none px-2 py-2 text-xs focus:ring-0 resize-none max-h-32 min-h-[60px] placeholder:text-muted-foreground/50"
          />
          <div className="flex items-center justify-between px-2 pt-1 border-t border-border/20">
            <div className="flex gap-2">
               <Lightbulb size={14} className="text-yellow-500/50" />
               <span className="text-[9px] text-muted-foreground uppercase font-bold">Optimization Mode</span>
            </div>
            <button 
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-30 disabled:grayscale transition-all active:scale-90"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
