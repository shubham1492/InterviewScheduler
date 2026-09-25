import React from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, X, Wifi, Battery, Signal } from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';

export const MobileViewWrapper = ({ children }) => {
  const { isMobileSimulated, setIsMobileSimulated } = useApp();

  if (!isMobileSimulated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 flex flex-col items-center justify-center relative">
      
      {/* Top Banner Control */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-white text-xs font-bold bg-purple-900/60 px-3.5 py-1.5 rounded-full border border-purple-500/30">
          <Smartphone className="w-4 h-4 text-purple-400" />
          <span>Interactive Mobile Device Simulator (iPhone 15 Pro Shell)</span>
        </div>

        <button
          onClick={() => setIsMobileSimulated(false)}
          className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Preview</span>
        </button>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div className="w-full max-w-[400px] h-[820px] bg-slate-900 rounded-[50px] border-[10px] border-slate-800 shadow-2xl shadow-purple-500/20 overflow-hidden relative flex flex-col ring-1 ring-white/10">
        
        {/* Phone Top Notch / Dynamic Island */}
        <div className="w-full h-11 bg-[#0b0f19] px-6 flex items-center justify-between text-slate-400 text-xs select-none z-50">
          <span className="font-bold text-white text-[11px]">9:41</span>
          
          {/* Dynamic Island Pill */}
          <div className="w-24 h-4 bg-black rounded-full mx-auto" />

          <div className="flex items-center space-x-1.5">
            <Signal className="w-3.5 h-3.5 text-white" />
            <Wifi className="w-3.5 h-3.5 text-white" />
            <Battery className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Scrollable Mobile Viewport */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 pb-20">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav />

        {/* Phone Home Indicator Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/40 rounded-full z-50 pointer-events-none" />

      </div>

    </div>
  );
};
