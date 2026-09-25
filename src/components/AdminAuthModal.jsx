import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, KeyRound, Eye, EyeOff, ShieldAlert, ArrowRight, X } from 'lucide-react';

export const AdminAuthModal = () => {
  const { 
    isAdminAuthModalOpen, 
    setIsAdminAuthModalOpen, 
    loginAdmin 
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput);
    if (success) {
      setPasswordInput('');
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect Password! Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111827] rounded-card border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAdminAuthModalOpen(false);
            setErrorMsg('');
            setPasswordInput('');
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-brand-500/25">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Lock className="w-7 h-7 text-brand-600 dark:text-brand-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Host Admin Portal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter host master password to manage schedules, slots, and candidates.
            </p>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
            <KeyRound className="w-3.5 h-3.5 text-brand-500" />
            <span>Default Password: <strong className="text-brand-600 dark:text-brand-400">admin123</strong></span>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Admin Password</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none pr-10 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-500 font-semibold pt-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>Unlock Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Protected area for host interviewers & administrators only.
          </p>
        </div>

      </div>
    </div>
  );
};
