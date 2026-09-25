import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { convertTimeToIST, formatDualTime, TIMEZONE_OPTIONS, getShortTimezoneCode, generateSlotsFromSchedule, getDayNameFromDateStr } from '../utils/timezoneUtils';
import { DatePickerControl } from '../components/DatePickerControl';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  ArrowRightLeft,
  ChevronDown,
  User,
  ShieldCheck,
  Instagram,
  MessageCircle,
  PhoneCall,
  ExternalLink,
  Trash2,
  KeyRound
} from 'lucide-react';

export const CandidatePortalView = () => {
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
    deleteSlotBooking,
    isAdminAuthenticated,
    openAdminAuthModal,
    weeklySchedule
  } = useApp();

  const [isCustomDurationMode, setIsCustomDurationMode] = useState(false);
  const [customMinsInput, setCustomMinsInput] = useState('30');
  const [customStartTimeInput, setCustomStartTimeInput] = useState('');

  // Generate selectable dates starting from TODAY for the current month and next 60 days
  const availableDatesList = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const dayName = getDayNameFromDateStr(dateStr);
      const dayConfig = weeklySchedule ? weeklySchedule.find(s => s.day === dayName) : null;
      const isAvailable = dayConfig ? dayConfig.active : true;

      if (isAvailable) {
        const label = d.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        dates.push({ dateStr, label, day: d.getDate() });
      }
    }
    return dates;
  }, [weeklySchedule]);

  const selectedDayName = useMemo(() => getDayNameFromDateStr(selectedDate), [selectedDate]);
  const isDayActive = useMemo(() => {
    if (!selectedDate || !weeklySchedule) return true;
    const dayConfig = weeklySchedule.find(d => d.day === selectedDayName);
    return dayConfig ? dayConfig.active : true;
  }, [selectedDate, selectedDayName, weeklySchedule]);

  // Generate daily slots dynamically based on selected date, duration & custom start time
  const allDailySlots = useMemo(() => {
    if (!selectedDate || !weeklySchedule) return [];
    const dayConfig = weeklySchedule.find(d => d.day === selectedDayName);

    if (!dayConfig || dayConfig.active === false) return [];
    return generateSlotsFromSchedule(dayConfig, duration, customSlotStartTime);
  }, [selectedDate, selectedDayName, duration, customSlotStartTime, weeklySchedule]);

  // Compute booked vs open slots for selectedDate
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

  // Auto-select first open slot when date/schedule/duration changes if selectedSlot is invalid
  useEffect(() => {
    if (availableSlots && availableSlots.length > 0) {
      if (!selectedSlot || !availableSlots.includes(selectedSlot)) {
        setSelectedSlot(availableSlots[0]);
      }
    } else {
      setSelectedSlot('');
    }
  }, [availableSlots, selectedSlot, setSelectedSlot]);

  const selectedSlotIST = useMemo(() => {
    return selectedSlot ? convertTimeToIST(selectedSlot, timezone, selectedDate) : '';
  }, [selectedSlot, timezone, selectedDate]);

  const selectedDateLabel = useMemo(() => {
    const found = availableDatesList.find(d => d.dateStr === selectedDate);
    return found ? found.label : selectedDate;
  }, [selectedDate, availableDatesList]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Welcome Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-300 text-xs font-semibold border border-brand-200 dark:border-brand-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interview Support Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Select Date & Book Your Slot
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Choose a date and timezone below. Select an available open slot on the left, or review existing bookings on the right.
        </p>

        {/* Social / Contact Header Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a 
            href="https://wa.me/919595579336" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all hover:scale-105 shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
            <span>WhatsApp: 9595579336</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <a 
            href="https://www.instagram.com/interviewtrainingit?igsh=dXBhNzBldDdndXow" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-amber-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/30 text-xs font-bold transition-all hover:scale-105 shadow-xs"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <span>Instagram: @interviewtrainingit</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (7 Cols): Controls + Available Open Slots + CTA */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-7 rounded-card border border-white/60 dark:border-slate-800 shadow-soft-lg space-y-6">
          
          {/* Controls Grid: Date Calendar Control, Timezone, Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
            
            {/* 1. Date Calendar Control Picker */}
            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-brand-500" />
                <span>Select Date</span>
              </label>
              <DatePickerControl
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </div>

            {/* 2. Candidate Timezone Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-brand-500" />
                  <span>Timezone</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Syncs IST
                </span>
              </div>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer shadow-xs"
              >
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Slot Duration & Custom Range Selector */}
            <div className="space-y-1.5 md:col-span-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                  <span>Session Duration & Custom Time Range</span>
                </label>
                {isCustomDurationMode && (
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                    Custom Mode Active
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {['30 min', '45 min', '60 min'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDuration(d);
                      setIsCustomDurationMode(false);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      duration === d && !isCustomDurationMode
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20 scale-[1.02]'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {d}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustomDurationMode(true)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isCustomDurationMode
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-md shadow-purple-500/20 scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/60 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                  }`}
                >
                  ⚡ Custom...
                </button>
              </div>

              {/* Custom Duration & Custom Time Range Sub-Panel */}
              {isCustomDurationMode && (
                <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/60 space-y-3 animate-in fade-in zoom-in-95 duration-150 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Custom Duration Minutes Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Custom Duration (Minutes)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="5"
                          max="240"
                          step="5"
                          value={customMinsInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomMinsInput(val);
                            if (val && !isNaN(val)) setDuration(`${val} min`);
                          }}
                          placeholder="e.g. 15, 20, 75"
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300 outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-xs font-bold text-slate-500">mins</span>
                      </div>
                    </div>

                    {/* Custom Specific Start Time (e.g. 9:15 AM) */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Custom Slot Start Time (e.g. 09:15 AM)
                      </label>
                      <input
                        type="time"
                        value={customStartTimeInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomStartTimeInput(val);
                          if (val) {
                            const [hStr, mStr] = val.split(':');
                            let h = parseInt(hStr, 10);
                            const period = h >= 12 ? 'PM' : 'AM';
                            let h12 = h % 12;
                            if (h12 === 0) h12 = 12;
                            const formattedH = h12 < 10 ? `0${h12}` : `${h12}`;
                            const timeStr12h = `${formattedH}:${mStr} ${period}`;
                            setCustomSlotStartTime(timeStr12h);
                            setSelectedSlot(timeStr12h);
                          } else {
                            setCustomSlotStartTime('');
                          }
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      />
                    </div>

                  </div>

                  <p className="text-[10px] text-purple-600 dark:text-purple-300 italic">
                    💡 Example: Select custom duration (e.g., 60 mins) and set start time to 09:15 AM to book a custom 9:15 AM – 10:15 AM slot!
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Section: Available Open Slots for Selected Date */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Available Open Slots to Book</span>
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {availableSlots.length} Open Slots
              </span>
            </div>

            {availableSlots.length === 0 ? (
              !isDayActive ? (
                <div className="p-4 text-center text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-2xl border border-amber-500/20 font-semibold">
                  Host is off on {selectedDayName}s. Please select an active working day (Monday – Friday) from the calendar.
                </div>
              ) : bookedSlots.length > 0 ? (
                <div className="p-4 text-center text-xs text-rose-500 bg-rose-500/10 rounded-2xl border border-rose-500/20 font-semibold">
                  All time slots are fully booked for this date! Please choose another date from the calendar.
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-blue-600 dark:text-blue-400 bg-blue-500/10 rounded-2xl border border-blue-500/20 font-semibold">
                  No open slots available for {duration} duration. Try selecting 30 min duration or another date.
                </div>
              )
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableSlots.map((slot) => {
                  const active = selectedSlot === slot;
                  const istConverted = convertTimeToIST(slot, timezone, selectedDate);
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center justify-center space-y-1 text-center ${
                        active
                          ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white border-brand-500 shadow-md shadow-brand-500/25 scale-[1.02]'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 opacity-80" />
                        <span>{slot}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
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

          {/* CTA Button */}
          <button
            disabled={availableSlots.length === 0 || !selectedSlot}
            onClick={() => setIsBookingModalOpen(true)}
            className={`w-full py-4 rounded-2xl text-xs font-bold text-white transition-all flex items-center justify-center space-x-2 ${
              availableSlots.length === 0 || !selectedSlot
                ? 'bg-slate-400 dark:bg-slate-800 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-brand-500/30 active:scale-95'
            }`}
          >
            <span>
              {selectedSlot ? `Proceed to Book (${selectedSlot} ➔ ${selectedSlotIST})` : 'Select an Open Slot above'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

        {/* RIGHT COLUMN (5 Cols): Already Booked Slots Panel + Contact */}
        <div className="lg:col-span-5 glass-panel p-6 sm:p-7 rounded-card border border-white/60 dark:border-slate-800 shadow-soft-lg space-y-5 sticky top-24">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Lock className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>Already Booked Slots</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ({getShortTimezoneCode(timezone, selectedDate)} & Converted IST)
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                {bookedSlots.length} Booked
              </span>
              
              {!isAdminAuthenticated && bookedSlots.length > 0 && (
                <button
                  onClick={() => openAdminAuthModal('admin')}
                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-bold flex items-center space-x-1 transition-colors border border-slate-200 dark:border-slate-700"
                  title="Unlock Admin to Delete Slots"
                >
                  <KeyRound className="w-3 h-3 text-amber-500" />
                  <span className="hidden sm:inline">Delete Slots</span>
                </button>
              )}
            </div>
          </div>

          {/* Booked Slots List - SINGLE LINE PER ITEM + ADMIN DELETE ACTION */}
          {bookedSlots.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-1">
              <ShieldCheck className="w-6 h-6 mx-auto text-emerald-500/60 mb-1" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">All slots available!</p>
              <p className="text-[11px]">No slots have been booked yet for {selectedDateLabel}.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {bookedSlots.map(({ slot, info }) => {
                const sourceTzShort = info.timezone ? getShortTimezoneCode(info.timezone, selectedDate) : getShortTimezoneCode(timezone, selectedDate);
                const istConverted = convertTimeToIST(slot, info.timezone || timezone, selectedDate);
                return (
                  <div
                    key={slot}
                    className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-2 text-xs transition-all hover:bg-rose-500/15 group/item"
                  >
                    {/* Time details in single line */}
                    <div className="flex items-center space-x-1.5 min-w-0 flex-wrap sm:flex-nowrap gap-y-1">
                      <Clock className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {slot} {sourceTzShort}
                      </span>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-white/80 dark:bg-slate-800/90 px-2 py-0.5 rounded-md border border-rose-500/20 whitespace-nowrap">
                        ➜ {istConverted}
                      </span>
                    </div>

                    {/* Right side: Candidate Name Pill + Admin Delete Button */}
                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-[11px] max-w-[110px] sm:max-w-[130px] truncate">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{info.name || 'Reserved'}</span>
                      </div>

                      {/* Delete Slot Button for Admin */}
                      {isAdminAuthenticated ? (
                        <button
                          onClick={() => deleteSlotBooking(selectedDate, slot)}
                          className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-600 dark:text-rose-300 hover:text-white transition-all shadow-xs scale-100 active:scale-90"
                          title={`Delete/Cancel ${slot} slot for ${selectedDateLabel}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => openAdminAuthModal('admin')}
                          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Admin Lock: Click to enter password & delete slot"
                        >
                          <Lock className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Direct Support & Training Contacts (WhatsApp & Instagram) */}
          <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-brand-500" />
              <span>Interview Support Contacts</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="https://wa.me/919595579336"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 transition-all text-xs font-bold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <div className="truncate">
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold leading-tight">WhatsApp</div>
                  <div className="text-[11px]">9595579336</div>
                </div>
              </a>

              <a
                href="https://www.instagram.com/interviewtrainingit?igsh=dXBhNzBldDdndXow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-700 dark:text-pink-400 transition-all text-xs font-bold"
              >
                <Instagram className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <div className="truncate">
                  <div className="text-[9px] text-pink-600 dark:text-pink-400 uppercase font-semibold leading-tight">Instagram</div>
                  <div className="text-[11px] truncate">@interviewtrainingit</div>
                </div>
              </a>
            </div>
          </div>

          {/* Quick Note Footer */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
            <span>Booked slots are locked in real-time to avoid overlap.</span>
          </div>

        </div>

      </div>

    </div>
  );
};

