import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { convertTimeToIST, formatDualTime, TIMEZONE_OPTIONS, getShortTimezoneCode, generateSlotsFromSchedule, getDayNameFromDateStr } from '../utils/timezoneUtils';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  Lock,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

export const PublicBookingView = () => {
  const { 
    selectedDate, 
    setSelectedDate, 
    selectedSlot, 
    setSelectedSlot,
    customSlotStartTime,
    setCustomSlotStartTime,
    duration,
    setDuration,
    timezone,
    setTimezone,
    setIsBookingModalOpen,
    slotBookings,
    weeklySchedule
  } = useApp();

  const selectedDayName = useMemo(() => getDayNameFromDateStr(selectedDate), [selectedDate]);
  const isDayActive = useMemo(() => {
    if (!selectedDate || !weeklySchedule) return true;
    const dayConfig = weeklySchedule.find(d => d.day === selectedDayName);
    return dayConfig ? dayConfig.active : true;
  }, [selectedDate, selectedDayName, weeklySchedule]);

  // Generate slots dynamically based on selected date & host's weekly schedule
  const allDailySlots = useMemo(() => {
    if (!selectedDate || !weeklySchedule) return [];
    const dayConfig = weeklySchedule.find(d => d.day === selectedDayName);

    if (!dayConfig || dayConfig.active === false) return [];
    return generateSlotsFromSchedule(dayConfig, duration, customSlotStartTime);
  }, [selectedDate, selectedDayName, duration, customSlotStartTime, weeklySchedule]);

  // Compute available vs booked slots for the selected date
  const { bookedSlots, availableSlots } = useMemo(() => {
    const booked = [];
    const available = [];

    allDailySlots.forEach((slot) => {
      const key = `${selectedDate}_${slot}`;
      if (slotBookings[key]) {
        booked.push({ slot, info: slotBookings[key] });
      } else {
        available.push(slot);
      }
    });

    return { bookedSlots: booked, availableSlots: available };
  }, [selectedDate, allDailySlots, slotBookings]);

  // Auto-select first available open slot when availableSlots changes
  useEffect(() => {
    if (availableSlots && availableSlots.length > 0) {
      if (!selectedSlot || !availableSlots.includes(selectedSlot)) {
        setSelectedSlot(availableSlots[0]);
      }
    } else {
      setSelectedSlot('');
    }
  }, [availableSlots, selectedSlot, setSelectedSlot]);

  // Dynamic Calendar days grid for current year & month
  const calendarDays = useMemo(() => {
    const today = new Date();
    const [selY, selM] = selectedDate ? selectedDate.split('-').map(Number) : [today.getFullYear(), today.getMonth() + 1];
    
    const year = selY || today.getFullYear();
    const month = selM ? selM - 1 : today.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const days = [];
    
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: '', isCurrentMonth: false, status: 'unavailable' });
    }

    const mm = String(month + 1).padStart(2, '0');

    for (let day = 1; day <= daysInMonth; day++) {
      const dd = String(day).padStart(2, '0');
      const dateStr = `${year}-${mm}-${dd}`;
      const dayName = getDayNameFromDateStr(dateStr);
      const dayConfig = weeklySchedule ? weeklySchedule.find(d => d.day === dayName) : null;
      const isAvailableDay = dayConfig ? dayConfig.active : true;

      if (!isAvailableDay) {
        days.push({ day, isCurrentMonth: true, status: 'unavailable', dateStr });
      } else {
        const daySlots = generateSlotsFromSchedule(dayConfig, duration, customSlotStartTime);
        let bookedCount = 0;
        daySlots.forEach((slot) => {
          if (slotBookings[`${dateStr}_${slot}`]) bookedCount++;
        });

        const openSlots = Math.max(0, daySlots.length - bookedCount);
        const status = (openSlots === 0 || daySlots.length === 0) ? 'booked' : 'available';

        days.push({
          day,
          isCurrentMonth: true,
          status,
          openSlots,
          bookedCount,
          dateStr
        });
      }
    }

    return days;
  }, [selectedDate, duration, customSlotStartTime, weeklySchedule, slotBookings]);

  const selectedSlotIST = useMemo(() => {
    return selectedSlot ? convertTimeToIST(selectedSlot, timezone, selectedDate) : '';
  }, [selectedSlot, timezone, selectedDate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4" />
            <span>Interactive Calendar Booking</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Select Date & Book Available Slot
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Times selected in <strong className="text-brand-600 dark:text-brand-400">{getShortTimezoneCode(timezone, selectedDate)}</strong> are automatically converted and booked in <strong className="text-emerald-600 dark:text-emerald-400">IST (India Standard Time)</strong> for your calendar!
          </p>
        </div>

        {/* Calendar Status Legend */}
        <div className="flex items-center space-x-4 bg-slate-100 dark:bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-medium">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
            <span className="text-slate-700 dark:text-slate-300">Open Slots</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
            <span className="text-slate-700 dark:text-slate-300">Booked / Full</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
            <span className="text-slate-700 dark:text-slate-300">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar Left (7 Cols), Floating Slot Details Right (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Monthly Calendar */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] rounded-card p-6 border border-slate-200 dark:border-slate-800/80 shadow-soft space-y-6">
          
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">August 2026</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-300 text-xs font-semibold border border-brand-200 dark:border-brand-800">
                Current Month
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCurrentMonthIndex((prev) => prev - 1)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentMonthIndex((prev) => prev + 1)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((item, idx) => {
              const isSelected = selectedDate === item.dateStr;
              
              let statusClasses = "bg-slate-50 dark:bg-slate-900/40 text-slate-400 cursor-not-allowed";
              if (item.isCurrentMonth) {
                if (item.status === 'available') {
                  statusClasses = isSelected
                    ? "bg-brand-600 text-white ring-2 ring-brand-500 shadow-lg shadow-brand-500/30 scale-105"
                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:scale-105 cursor-pointer";
                } else if (item.status === 'booked') {
                  statusClasses = isSelected
                    ? "bg-rose-600 text-white ring-2 ring-rose-500 shadow-lg scale-105"
                    : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 cursor-pointer";
                } else {
                  statusClasses = "bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 cursor-not-allowed";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={!item.isCurrentMonth || item.status === 'unavailable'}
                  onClick={() => item.dateStr && setSelectedDate(item.dateStr)}
                  className={`h-20 rounded-2xl p-2 flex flex-col justify-between transition-all duration-200 text-left relative group ${statusClasses}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-sm font-bold ${isSelected ? 'text-white' : ''}`}>
                      {item.day}
                    </span>
                    {item.status === 'available' && item.isCurrentMonth && (
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
                    )}
                    {item.status === 'booked' && item.isCurrentMonth && (
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-rose-500'}`} />
                    )}
                  </div>

                  {item.status === 'available' && item.isCurrentMonth && (
                    <div className="mt-auto">
                      <span className={`text-[10px] font-semibold block px-1.5 py-0.5 rounded-md ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {item.openSlots} open
                      </span>
                    </div>
                  )}

                  {item.status === 'booked' && item.isCurrentMonth && (
                    <div className="mt-auto">
                      <span className={`text-[10px] font-semibold block px-1.5 py-0.5 rounded-md ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}>
                        Full Booked
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Column: Date Slot & Booking Panel */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft-lg space-y-6 sticky top-24">
          
          {/* Selected Date Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <div>
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Selected Date</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : 'Select a date'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>

          {/* Timezone Selector & IST Sync Notice */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-500" />
                <span>Candidate Timezone</span>
              </label>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center space-x-1">
                <ArrowRightLeft className="w-3 h-3" />
                <span>Syncs to IST</span>
              </span>
            </div>
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

          {/* Flexible Slot Duration Selector (30 min, 45 min, 60 min) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-500" />
              <span>Slot Duration</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['30 min', '45 min', '60 min'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    duration === d
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20 scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Booked Slots for Selected Date (Converted to IST) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-500" />
                <span>Booked Slots (IST Calendar)</span>
              </span>
              <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                {bookedSlots.length} Booked
              </span>
            </div>

            {bookedSlots.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                No slots booked yet for this date. All slots open!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {bookedSlots.map(({ slot, info }) => {
                  const sourceTzShort = info.timezone ? getShortTimezoneCode(info.timezone, selectedDate) : getShortTimezoneCode(timezone, selectedDate);
                  const istConverted = convertTimeToIST(slot, info.timezone || timezone, selectedDate);
                  return (
                    <div
                      key={slot}
                      className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2 flex-wrap">
                        <Clock className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{slot} {sourceTzShort}</span>
                        <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-white/60 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-rose-500/20">
                          ➜ {istConverted}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 truncate max-w-[110px]">
                        {info.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Available Open Time Slots */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Available Open Slots ({getShortTimezoneCode(timezone, selectedDate)})</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {availableSlots.length} Open
              </span>
            </div>
            
            {availableSlots.length === 0 ? (
              <div className="p-4 text-center text-xs text-rose-500 bg-rose-500/10 rounded-xl border border-rose-500/20 font-semibold">
                All time slots are fully booked for this date! Please choose another date.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                {availableSlots.map((slot) => {
                  const active = selectedSlot === slot;
                  const istConverted = convertTimeToIST(slot, timezone, selectedDate);
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center space-y-1 text-center ${
                        active
                          ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white border-brand-500 shadow-md shadow-brand-500/25 scale-[1.02]'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 opacity-80" />
                        <span>{slot}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        IST: {istConverted}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Book Selected Slot Action CTA */}
          <button
            disabled={availableSlots.length === 0 || !selectedSlot}
            onClick={() => setIsBookingModalOpen(true)}
            className={`w-full py-3.5 rounded-2xl text-xs font-bold text-white transition-all flex items-center justify-center space-x-2 ${
              availableSlots.length === 0 || !selectedSlot
                ? 'bg-slate-400 dark:bg-slate-800 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-brand-500/30 active:scale-95'
            }`}
          >
            <span>
              Book Slot ({selectedSlot ? `${selectedSlot} ➔ ${selectedSlotIST}` : 'Select Slot'})
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};


