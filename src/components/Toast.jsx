import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 sm:right-8 z-50 animate-bounce">
      <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 shadow-2xl backdrop-blur-md border border-slate-700/50 dark:border-slate-200/50 text-xs font-semibold tracking-wide">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
