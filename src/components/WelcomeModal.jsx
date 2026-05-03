import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Terminal, Play, FileCode, ChevronRight, ArrowRight, X } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';

const WelcomeModal = ({ onComplete }) => {
  const [tourStep, setTourStep] = useState(0); // 0 = Modal, 1-3 = Tour Steps
  const [highlightPos, setHighlightPos] = useState(null);

  const steps = [
    {
      targetId: 'tour-file',
      title: 'Boilerplate Engine',
      description: 'Quickly start projects with built-in templates for 9+ languages in the File menu.',
      icon: <FileCode className="text-primary" />
    },
    {
      targetId: 'tour-run',
      title: 'Real-time Execution',
      description: 'Run your code instantly and see the output in the bottom-docked terminal.',
      icon: <Play className="text-green-500" />
    },
    {
      targetId: 'tour-ai',
      title: 'ZenExit AI',
      description: 'Get deep code insights, debugging help, and optimizations directly in your workspace.',
      icon: <Sparkles className="text-purple-500" />
    }
  ];

  useEffect(() => {
    if (tourStep > 0) {
      const target = document.getElementById(steps[tourStep - 1].targetId);
      if (target) {
        const rect = target.getBoundingClientRect();
        setHighlightPos({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      }
    }
  }, [tourStep]);

  const handleNext = () => {
    if (tourStep < steps.length) {
      setTourStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <AnimatePresence>
        {tourStep === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center pointer-events-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-sidebar border border-border shadow-2xl rounded-3xl p-8 text-center relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap size={32} className="text-primary" fill="currentColor" />
              </div>

              <h1 className="text-2xl font-black tracking-tight uppercase italic mb-2">Welcome to ZenExit</h1>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Your high-performance workspace is ready. How would you like to begin your journey?
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleSkip}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                  CONTINUE TO ZEN SPACE
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setTourStep(1)}
                  className="w-full py-4 bg-secondary text-foreground font-bold rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2"
                >
                  SEE QUICK TOUR
                  <Sparkles size={16} className="text-primary" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="absolute inset-0 pointer-events-auto">
            {/* Dark Overlay with Hole */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" style={{
              maskImage: highlightPos ? `radial-gradient(circle ${Math.max(highlightPos.width, highlightPos.height) + 20}px at ${highlightPos.left + highlightPos.width/2}px ${highlightPos.top + highlightPos.height/2}px, transparent 100%, black 100%)` : 'none',
              WebkitMaskImage: highlightPos ? `radial-gradient(circle ${Math.max(highlightPos.width, highlightPos.height) + 20}px at ${highlightPos.left + highlightPos.width/2}px ${highlightPos.top + highlightPos.height/2}px, transparent 100%, black 100%)` : 'none'
            }} />

            {/* Tour Info Card */}
            <AnimatePresence mode="wait">
              {highlightPos && (
                <motion.div 
                  key={tourStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    top: highlightPos.top > window.innerHeight / 2 ? highlightPos.top - 180 : highlightPos.top + highlightPos.height + 40,
                    left: Math.min(Math.max(40, highlightPos.left + highlightPos.width / 2 - 140), window.innerWidth - 320)
                  }}
                  className="absolute w-72 bg-sidebar border border-primary/30 shadow-2xl rounded-2xl p-5 z-[210]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      {steps[tourStep - 1].icon}
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-tight">{steps[tourStep - 1].title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                    {steps[tourStep - 1].description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[1, 2, 3].map(s => (
                        <div key={s} className={`w-1.5 h-1.5 rounded-full transition-colors ${s === tourStep ? 'bg-primary' : 'bg-muted'}`} />
                      ))}
                    </div>
                    <button 
                      onClick={handleNext}
                      className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                    >
                      {tourStep === 3 ? 'FINISH' : 'NEXT'}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skip Button */}
            <button 
              onClick={handleSkip}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeModal;
