import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Calendar, MessageCircle, Instagram, Lock } from 'lucide-react';

export const Footer = () => {
  const { currentView, openAdminAuthModal, isAdminAuthenticated } = useApp();

  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-[#0b0f19]/60 backdrop-blur-md py-6 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        
        {/* Left Copy */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <Calendar className="w-4 h-4 text-brand-500" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Interview Support Pro</span>
          <span>•</span>
          <span>Candidate Booking & Timezone Sync</span>
        </div>

        {/* Center/Right Social & Admin Links */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://wa.me/919595579336"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>WhatsApp: 9595579336</span>
          </a>

          <a
            href="https://www.instagram.com/interviewtrainingit?igsh=dXBhNzBldDdndXow"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/30 text-xs font-bold transition-all"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <span>@interviewtrainingit</span>
          </a>

          {/* Host Admin Link (Password Protected) */}
          <button
            onClick={() => openAdminAuthModal('admin')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600 transition-all border border-slate-200 dark:border-slate-800 shadow-xs group"
          >
            {isAdminAuthenticated ? (
              <ShieldCheck className="w-4 h-4 text-emerald-500 group-hover:text-white transition-colors" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-500 group-hover:text-white transition-colors" />
            )}
            <span>{isAdminAuthenticated ? 'Host Admin (Unlocked)' : 'Host Admin Portal'}</span>
          </button>
        </div>

      </div>
    </footer>
  );
};

