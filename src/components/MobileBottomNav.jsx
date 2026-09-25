import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, LayoutDashboard, BarChart3, Settings, Plus } from 'lucide-react';

export const MobileBottomNav = () => {
  const { currentView, setCurrentView, setIsBookingModalOpen } = useApp();

  const tabs = [
    { id: 'landing', label: 'Home', icon: Sparkles },
    { id: 'booking', label: 'Calendar', icon: Calendar },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-2 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        
        {/* Nav Items Left */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          {tabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const active = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  active
                    ? 'text-brand-600 dark:text-brand-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Floating Action Button */}
        <button
          onClick={() => {
            setCurrentView('booking');
            setIsBookingModalOpen(true);
          }}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 border-2 border-white dark:border-[#0f172a] active:scale-90 transition-transform -mt-5"
          aria-label="Book Interview"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Nav Items Right */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          {tabs.slice(2).map((tab) => {
            const Icon = tab.icon;
            const active = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                  active
                    ? 'text-brand-600 dark:text-brand-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
