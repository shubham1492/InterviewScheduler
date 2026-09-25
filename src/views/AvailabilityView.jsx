import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TIMEZONE_OPTIONS } from '../utils/timezoneUtils';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Globe, 
  Coffee, 
  Utensils, 
  Palmtree, 
  Calendar, 
  Save, 
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Sliders
} from 'lucide-react';

export const AvailabilityView = () => {
  const { 
    showToast,
    weeklySchedule,
    bufferTime,
    setBufferTime,
    maxInterviewsPerDay,
    setMaxInterviewsPerDay,
    timezone,
    setTimezone,
    isRecurringSchedule,
    setIsRecurringSchedule,
    saveAvailabilitySettings
  } = useApp();

  // Generate 48 time options across 24 hours in 30-minute intervals
  const all24HourTimeOptions = React.useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const formattedHour = displayHour < 10 ? `0${displayHour}` : `${displayHour}`;
        const formattedMin = min === 0 ? '00' : `${min}`;
        options.push(`${formattedHour}:${formattedMin} ${period}`);
      }
    }
    return options;
  }, []);

  const [schedule, setSchedule] = useState(weeklySchedule || []);

  useEffect(() => {
    if (weeklySchedule) {
      setSchedule(weeklySchedule);
    }
  }, [weeklySchedule]);

  const toggleDayActive = (index) => {
    const updated = [...schedule];
    updated[index] = {
      ...updated[index],
      active: !updated[index].active
    };
    setSchedule(updated);
  };

  const addBreakSlot = (index, type) => {
    const updated = [...schedule];
    let label = 'Coffee Break';
    if (type === 'lunch') label = 'Lunch Break';
    if (type === 'holiday') label = 'Holiday Block';

    const dayObj = { ...updated[index], breaks: [...updated[index].breaks] };
    dayObj.breaks.push({
      label,
      start: '01:00 PM',
      end: '02:00 PM'
    });
    updated[index] = dayObj;
    setSchedule(updated);
    showToast(`Added ${label} to ${updated[index].day}`);
  };

  const removeBreakSlot = (dayIdx, breakIdx) => {
    const updated = [...schedule];
    const dayObj = { ...updated[dayIdx], breaks: [...updated[dayIdx].breaks] };
    dayObj.breaks.splice(breakIdx, 1);
    updated[dayIdx] = dayObj;
    setSchedule(updated);
  };

  const handleSave = () => {
    saveAvailabilitySettings({
      schedule,
      bufferTime,
      maxInterviewsPerDay,
      timezone,
      isRecurringSchedule
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Schedule Settings</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Availability Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure weekly working hours, break blocks, buffer times, and daily interview limits.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Weekly Schedule</span>
        </button>
      </div>

      {/* Main Grid: Weekly Scheduler Left (8 Cols), Rules & Constraints Right (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Days List */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex items-center justify-between px-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Weekly Working Hours</h2>
            <span className="text-xs text-slate-500">Auto-syncs with Google Calendar</span>
          </div>

          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div
                key={item.day}
                className={`glass-panel p-5 rounded-2xl border transition-all space-y-3 ${
                  item.active
                    ? 'border-white/60 dark:border-slate-800 shadow-soft'
                    : 'border-slate-200/50 dark:border-slate-800/40 opacity-60 bg-slate-50/50 dark:bg-slate-900/20'
                }`}
              >
                
                {/* Top Row: Day Toggle + Hours Selection */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Day Switcher */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleDayActive(idx)}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                        item.active ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        item.active ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>

                    <span className="text-base font-bold text-slate-900 dark:text-white w-28">
                      {item.day}
                    </span>

                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      item.active 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {item.active ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  {/* Hours Controls */}
                  {item.active ? (
                    <div className="flex items-center space-x-2 text-xs font-medium">
                      <select
                        value={item.startTime}
                        onChange={(e) => {
                          const upd = [...schedule];
                          upd[idx].startTime = e.target.value;
                          setSchedule(upd);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer shadow-xs"
                      >
                        {all24HourTimeOptions.map((t) => (
                          <option key={`st-${t}`} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>

                      <span className="text-slate-400 font-bold">to</span>

                      <select
                        value={item.endTime}
                        onChange={(e) => {
                          const upd = [...schedule];
                          upd[idx].endTime = e.target.value;
                          setSchedule(upd);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer shadow-xs"
                      >
                        {all24HourTimeOptions.map((t) => (
                          <option key={`et-${t}`} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <span className="text-xs italic text-slate-400">Off / Day Blocked</span>
                  )}

                </div>

                {/* Breaks Section */}
                {item.active && (
                  <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Breaks & Overrides
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => addBreakSlot(idx, 'lunch')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold hover:bg-amber-500/20 transition-colors flex items-center space-x-1"
                        >
                          <Utensils className="w-3 h-3" />
                          <span>+ Lunch</span>
                        </button>
                        <button
                          onClick={() => addBreakSlot(idx, 'coffee')}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold hover:bg-purple-500/20 transition-colors flex items-center space-x-1"
                        >
                          <Coffee className="w-3 h-3" />
                          <span>+ Break</span>
                        </button>
                      </div>
                    </div>

                    {item.breaks.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center justify-between p-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                          <Coffee className="w-3.5 h-3.5 text-amber-500" />
                          <span>{b.label} ({b.start} - {b.end})</span>
                        </span>
                        <button
                          onClick={() => removeBreakSlot(idx, bIdx)}
                          className="text-rose-500 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Global Constraints & Rules */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft-lg space-y-6 sticky top-24">
          
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-brand-500" />
              <span>Scheduling Controls</span>
            </h3>
          </div>

          {/* Timezone Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-brand-500" />
              <span>Default Timezone</span>
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* Buffer Time Between Meetings */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-500" />
              <span>Buffer Time Between Meetings</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['0 min', '10 min', '15 min', '30 min'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBufferTime(b)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    bufferTime === b
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Max Interviews per Day Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Max Interviews per Day
              </label>
              <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-lg bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800">
                {maxInterviewsPerDay} Interviews
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={maxInterviewsPerDay}
              onChange={(e) => setMaxInterviewsPerDay(parseInt(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
          </div>

          {/* Recurring Schedule Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Recurring Schedule</div>
              <div className="text-[10px] text-slate-400">Apply weekly indefinitely</div>
            </div>
            <button
              onClick={() => setIsRecurringSchedule(!isRecurringSchedule)}
              className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                isRecurringSchedule ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                isRecurringSchedule ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Vacation / Holiday Override Trigger */}
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 space-y-2">
            <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-bold text-xs">
              <Palmtree className="w-4 h-4" />
              <span>Vacation & Out of Office</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Block entire date ranges for upcoming holidays or conferences.
            </p>
            <button 
              onClick={() => showToast('Opened Vacation Date Range Picker')}
              className="w-full py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-colors"
            >
              + Add Vacation Block
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
