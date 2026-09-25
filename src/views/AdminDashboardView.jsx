import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  User, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MoreVertical, 
  Search, 
  Filter, 
  Plus, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  FileText
} from 'lucide-react';

export const AdminDashboardView = () => {
  const { candidates, setSelectedCandidate, setCurrentView, showToast, selectedDate, setSelectedDate, slotBookings } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Host Calendar State & Navigation
  const selectedDateObj = useMemo(() => {
    if (selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      const [y, m, d] = selectedDate.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  }, [selectedDate]);

  const [viewYear, setViewYear] = useState(selectedDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDateObj.getMonth());

  // Keep view in sync if selectedDate changes externally
  useEffect(() => {
    if (selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      const [y, m, d] = selectedDate.split('-').map(Number);
      setViewYear(y);
      setViewMonth(m - 1);
    }
  }, [selectedDate]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  const jumpToToday = () => {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  };

  // Dynamic Days Grid for viewYear & viewMonth
  const daysGrid = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayOffset = new Date(viewYear, viewMonth, 1).getDay();

    const paddingCells = [];
    for (let i = 0; i < firstDayOffset; i++) {
      paddingCells.push({ isPadding: true });
    }

    const dayCells = [];
    const mm = String(viewMonth + 1).padStart(2, '0');

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dd = String(dayNum).padStart(2, '0');
      const dateStr = `${viewYear}-${mm}-${dd}`;
      const dayBookingsCount = Object.keys(slotBookings).filter(k => k.startsWith(dateStr)).length;
      const isSelected = dateStr === selectedDate;
      const isToday = new Date().toISOString().slice(0, 10) === dateStr;

      dayCells.push({
        dayNum,
        dateStr,
        dayBookingsCount,
        isSelected,
        isToday
      });
    }

    return [...paddingCells, ...dayCells];
  }, [viewYear, viewMonth, slotBookings, selectedDate]);

  // Compute total booked slots in current viewed month
  const monthTotalBookedSlots = useMemo(() => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const prefix = `${viewYear}-${mm}`;
    return Object.keys(slotBookings).filter(k => k.startsWith(prefix)).length;
  }, [viewYear, viewMonth, slotBookings]);

  // Format selectedDate into a human readable string e.g., "Friday, Sep 25, 2026"
  const selectedDateFormatted = useMemo(() => {
    if (!selectedDate || !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) return 'Selected Date';
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [selectedDate]);

  // Compute dynamic agenda timeline items for selectedDate
  const selectedDateAgendaItems = useMemo(() => {
    if (!selectedDate) return [];

    const matchingCandidates = candidates.filter(c => c.date === selectedDate);
    const slotKeysForDate = Object.keys(slotBookings).filter(k => k.startsWith(selectedDate));

    const items = [];
    matchingCandidates.forEach(cand => {
      items.push({
        id: cand.id,
        name: cand.name,
        email: cand.email,
        company: cand.company,
        role: cand.role,
        time: cand.time,
        status: cand.status,
        meetLink: cand.meetLink,
        interviewType: cand.interviewType || 'Interview Session'
      });
    });

    slotKeysForDate.forEach(key => {
      const slotTimeStr = key.split('_')[1] || '';
      const info = slotBookings[key];
      const alreadyIncluded = matchingCandidates.some(c => c.time.includes(slotTimeStr));

      if (!alreadyIncluded && info) {
        items.push({
          id: key,
          name: info.name || 'Candidate',
          email: info.email || 'N/A',
          company: info.company || 'Independent',
          role: info.role || 'Interview Candidate',
          time: `${slotTimeStr} (${info.istTime || 'IST'})`,
          status: 'Upcoming',
          meetLink: info.meetLink || 'https://meet.google.com/xyz-abcd-123',
          interviewType: 'Slot Reservation'
        });
      }
    });

    return items;
  }, [selectedDate, candidates, slotBookings]);

  const [dateFilterMode, setDateFilterMode] = useState('all');

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
      const matchesQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           c.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = dateFilterMode === 'all' || c.date === selectedDate;
      return matchesStatus && matchesQuery && matchesDate;
    }).sort((a, b) => {
      if (a.date === selectedDate && b.date !== selectedDate) return -1;
      if (a.date !== selectedDate && b.date === selectedDate) return 1;
      return 0;
    });
  }, [candidates, filterStatus, searchQuery, dateFilterMode, selectedDate]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Upcoming':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            <span>Upcoming</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Completed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3 h-3 text-rose-500" />
            <span>Cancelled</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            <span>Pending</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Host Administrator Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Interview Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage candidate schedules, meeting rooms, and interview evaluations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentView('availability')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-colors"
          >
            Manage Availability
          </button>
          <button
            onClick={() => setCurrentView('booking')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-md shadow-brand-500/20 active:scale-95 transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Slot</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Today's Interviews */}
        <div className="glass-panel p-5 rounded-2xl border border-white/60 dark:border-slate-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Today's</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">2</div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Next at 10:30 AM</span>
          </div>
        </div>

        {/* Upcoming */}
        <div className="glass-panel p-5 rounded-2xl border border-white/60 dark:border-slate-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Upcoming</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">5</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">This Week</div>
        </div>

        {/* Completed */}
        <div className="glass-panel p-5 rounded-2xl border border-white/60 dark:border-slate-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">28</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">This Month</div>
        </div>

        {/* Cancelled */}
        <div className="glass-panel p-5 rounded-2xl border border-white/60 dark:border-slate-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Cancelled</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">2</div>
          <div className="text-[11px] text-rose-500 font-medium">6.7% Rate</div>
        </div>

        {/* Evaluation Score */}
        <div className="glass-panel p-5 rounded-2xl border border-white/60 dark:border-slate-800 shadow-soft space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Rating</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-500">4.8 / 5</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">34 Evaluations</div>
        </div>

      </div>

      {/* Interactive Month Calendar Manager for Host (Fully Dynamic) */}
      <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft space-y-4">
        
        {/* Header Bar: Title + Month Controls + Month Booked Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Host Calendar Manager — {monthNames[viewMonth]} {viewYear}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold border border-brand-500/20">
                  {monthTotalBookedSlots} {monthTotalBookedSlots === 1 ? 'Booking' : 'Bookings'} in {monthNames[viewMonth].slice(0, 3)}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Navigate months to manage slots and view bookings for any date.
              </p>
            </div>
          </div>

          {/* Month Navigation Controls */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={jumpToToday}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              Today
            </button>

            <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 px-2 min-w-[110px] text-center select-none">
                {monthNames[viewMonth]} {viewYear}
              </span>

              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Dynamic Month Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-bold text-slate-400 uppercase py-1 text-[11px]">{day}</div>
          ))}

          {daysGrid.map((item, i) => {
            if (item.isPadding) {
              return (
                <div key={`empty-${i}`} className="p-3 bg-slate-50/30 dark:bg-slate-900/10 rounded-xl opacity-30 cursor-not-allowed border border-transparent min-h-[64px]" />
              );
            }

            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDate(item.dateStr)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-between min-h-[64px] relative group ${
                  item.isSelected
                    ? 'bg-gradient-to-tr from-brand-600 to-purple-600 text-white border-brand-500 shadow-md scale-105 z-10'
                    : item.dayBookingsCount > 0
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span>{item.dayNum}</span>
                  {item.isToday && !item.isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500" title="Today" />
                  )}
                </div>

                {item.dayBookingsCount > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    item.isSelected ? 'bg-white/30 text-white' : 'bg-purple-500 text-white shadow-xs'
                  }`}>
                    {item.dayBookingsCount} {item.dayBookingsCount === 1 ? 'Slot' : 'Slots'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout: Candidate Cards Grid + Today's Agenda Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Cols: Candidate Bookings List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Controls Bar: Search & Filter */}
          <div className="flex flex-col gap-3 bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidates or companies..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              {/* Filter Status Tabs */}
              <div className="flex items-center space-x-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['All', 'Upcoming', 'Completed', 'Cancelled', 'Pending'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      filterStatus === st
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Quick Filter Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Viewing Calendar Date: <span className="text-brand-600 dark:text-brand-400 font-extrabold">{selectedDateFormatted} ({selectedDate})</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-extrabold text-[10px]">
                  {selectedDateAgendaItems.length} {selectedDateAgendaItems.length === 1 ? 'Booking' : 'Bookings'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDateFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    dateFilterMode === 'all'
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  All Dates
                </button>
                <button
                  onClick={() => setDateFilterMode('selected')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    dateFilterMode === 'selected'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Only {selectedDate}
                </button>
              </div>
            </div>

          </div>

          {/* Candidate Cards Grid */}
          <div className="space-y-4">
            {filteredCandidates.length === 0 ? (
              <div className="p-8 text-center text-xs space-y-2 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-800 dark:text-slate-200">No candidates match the filter criteria for {dateFilterMode === 'selected' ? selectedDate : 'all dates'}.</p>
                <p className="text-slate-400">Try changing status filter or switching to "All Dates".</p>
              </div>
            ) : (
              filteredCandidates.map((cand) => {
                const isSelectedDateMatch = cand.date === selectedDate;
                return (
                  <div 
                    key={cand.id}
                    className={`glass-panel p-5 rounded-2xl border transition-all space-y-4 group relative ${
                      isSelectedDateMatch
                        ? 'border-brand-500/80 dark:border-brand-500/60 bg-brand-500/5 shadow-md shadow-brand-500/10'
                        : 'border-white/60 dark:border-slate-800 shadow-soft hover:border-brand-500/50'
                    }`}
                  >
                    {isSelectedDateMatch && (
                      <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Selected Date Booking ({selectedDate})</span>
                      </div>
                    )}
                    
                    {/* Candidate Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm flex-shrink-0">
                          {cand.name.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                              {cand.name}
                            </h4>
                            {getStatusBadge(cand.status)}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                              <Building2 className="w-3 h-3" />
                              <span>{cand.company}</span>
                            </span>
                            <span>•</span>
                            <span>{cand.role}</span>
                            <span>•</span>
                            <span className="text-purple-600 dark:text-purple-400 font-semibold">{cand.interviewType}</span>
                          </div>
                        </div>
                      </div>

                      {/* Date & Time Slot */}
                      <div className="text-right sm:text-right space-y-1">
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center sm:justify-end space-x-1">
                          <CalendarIcon className="w-3.5 h-3.5 text-brand-500" />
                          <span className={isSelectedDateMatch ? "text-brand-600 dark:text-brand-400 font-extrabold" : ""}>{cand.date}</span>
                        </div>
                        <div className="inline-flex flex-col items-end gap-1">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                            {cand.time} ({cand.duration})
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                      
                      {/* Left: Join Meeting CTA */}
                      <a
                        href={cand.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Google Meet</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>

                      {/* Right Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCandidate(cand);
                            setCurrentView('candidate-details');
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/80 hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors flex items-center space-x-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Details & Resume</span>
                        </button>

                        <button
                          onClick={() => showToast(`Reschedule link sent to ${cand.email}`)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        >
                          Reschedule
                        </button>

                        <button
                          onClick={() => showToast(`Cancelled booking for ${cand.name}`)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right 4 Cols: Dynamic Timeline Agenda for Selected Date */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft space-y-6 sticky top-24">
          
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Schedule Agenda</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{selectedDateFormatted}</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              {selectedDateAgendaItems.length} {selectedDateAgendaItems.length === 1 ? 'Interview' : 'Interviews'}
            </span>
          </div>

          {/* Dynamic Timeline Items */}
          {selectedDateAgendaItems.length === 0 ? (
            <div className="p-6 text-center text-xs space-y-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">No interviews scheduled for this date</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Slots are available for candidate booking on {selectedDateFormatted}.</p>
              </div>
              <button
                onClick={() => setCurrentView('booking')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm transition-all"
              >
                + Book Slot for {selectedDate}
              </button>
            </div>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {selectedDateAgendaItems.map((item, idx) => (
                <div key={item.id || idx} className="relative pl-8 space-y-1">
                  <div className={`absolute left-1.5 top-1 w-4 h-4 rounded-full ring-4 ring-white dark:ring-[#111827] ${
                    idx % 2 === 0 ? 'bg-brand-600' : 'bg-purple-600'
                  }`} />
                  <div className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center justify-between">
                    <span>{item.time}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      {item.status}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.name} ({item.company})
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-0.5">
                    <span>{item.role} • {item.interviewType}</span>
                    <a
                      href={item.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:text-blue-400 font-bold text-[11px] flex items-center space-x-1"
                    >
                      <Video className="w-3 h-3" />
                      <span>Meet Link</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Stats Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-600/10 to-purple-600/10 border border-brand-500/20 space-y-2 text-xs">
            <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Host Productivity Tip</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Selected date is synced with live Firestore updates. All meeting links & WhatsApp notifications are pre-verified.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
