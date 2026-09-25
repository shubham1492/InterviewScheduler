import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DatePickerControl = ({ value, onChange, className = '' }) => {
  const { weeklySchedule } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current selected date or fallback to today
  const selectedDateObj = useMemo(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  }, [value]);

  const [viewYear, setViewYear] = useState(selectedDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDateObj.getMonth());

  // Sync view when value changes
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-').map(Number);
      setViewYear(y);
      setViewMonth(m - 1);
    }
  }, [value]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Generate days grid for current viewYear & viewMonth
  const daysGrid = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();

    const grid = [];
    for (let i = 0; i < firstDay; i++) {
      grid.push({ isPadding: true });
    }

    const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(viewMonth + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${viewYear}-${mm}-${dd}`;
      
      const dateObj = new Date(viewYear, viewMonth, d);
      const dayName = fullDayNames[dateObj.getDay()];
      const dayConfig = weeklySchedule ? weeklySchedule.find(s => s.day === dayName) : null;
      const isActiveDay = dayConfig ? dayConfig.active : (dateObj.getDay() !== 0 && dateObj.getDay() !== 6);

      grid.push({
        day: d,
        dateStr,
        isActiveDay,
        isToday: new Date().toISOString().slice(0, 10) === dateStr
      });
    }

    return grid;
  }, [viewYear, viewMonth, weeklySchedule]);

  const handleSelectDate = (dateStr) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  const formattedLabel = useMemo(() => {
    if (!value) return 'Select Date';
    const [y, m, d] = value.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [value]);

  const handleQuickJump = (daysToAdd) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const targetStr = `${yyyy}-${mm}-${dd}`;
    onChange(targetStr);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-brand-600 dark:text-brand-400 focus:ring-2 focus:ring-brand-500 outline-none flex items-center justify-between shadow-xs hover:border-brand-400 transition-all cursor-pointer group"
      >
        <div className="flex items-center space-x-2 truncate">
          <CalendarIcon className="w-4 h-4 text-brand-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <span className="truncate">{formattedLabel}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-500' : ''}`} />
      </button>

      {/* Floating Interactive Popover Calendar */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 p-4 rounded-2xl glass-modal border border-white/60 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Popover Header: Month & Year Navigator */}
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {monthNames[viewMonth]} {viewYear}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors ml-1"
                title="Close Calendar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            {dayNames.map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Month Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {daysGrid.map((item, idx) => {
              if (item.isPadding) {
                return <div key={`pad-${idx}`} className="h-8" />;
              }

              const isSelected = value === item.dateStr;

              let btnClasses = "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-950/60 hover:text-brand-600 border border-slate-200/60 dark:border-slate-800/60";
              if (isSelected) {
                btnClasses = "bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold shadow-md shadow-brand-500/30 scale-105 border-brand-500";
              } else if (!item.isActiveDay) {
                btnClasses = "bg-slate-100/50 dark:bg-slate-900/30 text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed border-transparent";
              }

              return (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => handleSelectDate(item.dateStr)}
                  className={`h-8 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center relative group ${btnClasses}`}
                >
                  <span>{item.day}</span>
                  {item.isToday && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 absolute bottom-0.5" />
                  )}
                  {item.isActiveDay && !isSelected && !item.isToday && (
                    <span className="w-1 h-1 rounded-full bg-emerald-500/80 absolute bottom-0.5 opacity-60" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Date Jumps Footer */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Select</span>
              <div className="relative" title="Pick any date from browser datepicker">
                <input
                  type="date"
                  value={value}
                  onChange={(e) => {
                    if (e.target.value) handleSelectDate(e.target.value);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-700 outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1">
              <button
                type="button"
                onClick={() => handleQuickJump(0)}
                className="py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-[10px] font-bold transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleQuickJump(1)}
                className="py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold transition-colors"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handleQuickJump(7)}
                className="py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold transition-colors"
              >
                +7 Days
              </button>
              <button
                type="button"
                onClick={() => handleQuickJump(14)}
                className="py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold transition-colors"
              >
                +14 Days
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
