import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  formatWhatsAppBookingMessage, 
  getWhatsAppShareUrl, 
  openWhatsAppNotification, 
  DEFAULT_HOST_WHATSAPP 
} from '../utils/whatsapp';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Mail, 
  Download, 
  Home, 
  Sparkles,
  Send,
  X,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  Share2
} from 'lucide-react';

export const BookingSuccessView = () => {
  const { latestBooking, setCurrentView, showToast, hostWhatsAppPhone } = useApp();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [customPhone, setCustomPhone] = useState(hostWhatsAppPhone || DEFAULT_HOST_WHATSAPP);

  // Generate and download a real .ics (iCalendar) file
  const handleDownloadIcs = () => {
    const summary = `Interview Support - ${latestBooking.meetingType || 'Technical Interview'} (${latestBooking.candidateName})`;
    const description = `Interview Session for ${latestBooking.candidateName} (${latestBooking.candidateEmail}).\\nDate: ${latestBooking.date}\\nTime: ${latestBooking.time}`;
    
    // Format date string for ics (fallback to current date if needed)
    const dateFormatted = (latestBooking.date || '2026-08-13').replace(/-/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Interview Support//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `DTSTART:${dateFormatted}T090000Z`,
      `DTEND:${dateFormatted}T093000Z`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `interview_invite_${(latestBooking.candidateName || 'candidate').replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded .ics Calendar Invitation file!');
  };

  // Build real Google Calendar event creation URL
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Interview Support - Session with ${latestBooking.candidateName}`);
    const details = encodeURIComponent(`Candidate: ${latestBooking.candidateName}\nEmail: ${latestBooking.candidateEmail}\nTime: ${latestBooking.time}`);
    const dateFormatted = (latestBooking.date || '2026-08-13').replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateFormatted}T090000Z/${dateFormatted}T093000Z`;
  };

  // Build mailto link for sending real confirmation email via user's email client
  const getMailtoUrl = () => {
    const subject = encodeURIComponent(`Interview Confirmation: ${latestBooking.meetingType || 'Technical Interview'} on ${latestBooking.date}`);
    const body = encodeURIComponent(
      `Hello ${latestBooking.candidateName},\n\n` +
      `Your interview slot has been successfully confirmed!\n\n` +
      `--- Interview Details ---\n` +
      `Candidate Name: ${latestBooking.candidateName}\n` +
      `Date: ${latestBooking.date}\n` +
      `Slot Time: ${latestBooking.time}\n\n` +
      `Please be available at the scheduled time.\n\n` +
      `Best regards,\n` +
      `Interview Support Team`
    );
    return `mailto:${latestBooking.candidateEmail}?subject=${subject}&body=${body}`;
  };

  const handleCopyEmailBody = () => {
    const text = `Hello ${latestBooking.candidateName},\n\nYour interview slot has been successfully confirmed!\n\nDate: ${latestBooking.date}\nTime: ${latestBooking.time}\n\nBest regards,\nInterview Support Team`;
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    showToast('Email body copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyWhatsAppBody = () => {
    const msgText = latestBooking.whatsappMessage || formatWhatsAppBookingMessage(latestBooking);
    navigator.clipboard.writeText(msgText);
    setCopiedWhatsApp(true);
    showToast('WhatsApp notification text copied to clipboard!');
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
      
      {/* Top Success Badge Animation */}
      <div className="flex flex-col items-center text-center space-y-4">
        
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center ring-8 ring-emerald-500/20 shadow-glow-indigo animate-bounce">
            <CheckCircle2 className="w-14 h-14" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interview Scheduled!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Slot reserved for <strong className="text-slate-800 dark:text-slate-200">{latestBooking.candidateEmail}</strong>.
          </p>
        </div>

        {/* Status Badges (Email & WhatsApp Confirmation) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            onClick={() => setShowEmailModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-xs font-semibold border border-brand-200 dark:border-brand-800 hover:scale-105 transition-transform"
          >
            <Mail className="w-3.5 h-3.5 text-brand-500" />
            <span>Email Confirmation Preview</span>
          </button>

          <button
            onClick={() => openWhatsAppNotification(latestBooking, hostWhatsAppPhone)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Notify Host on WhatsApp (+91 9595579336)</span>
          </button>
        </div>

      </div>

      {/* Meeting Details Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-card border border-white/60 dark:border-slate-800 shadow-soft-lg space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {latestBooking.meetingType || 'Technical Interview Session'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Host: Interview Support • Candidate: {latestBooking.candidateName}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            CONFIRMED
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Meeting Date</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{latestBooking.date}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Selected & Converted Time</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex flex-col gap-1 mt-0.5">
                <span className="text-brand-600 dark:text-brand-400 font-extrabold">{latestBooking.time}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* WhatsApp Host Notification Banner Card */}
      <div className="glass-panel p-6 sm:p-7 rounded-card border border-emerald-500/30 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-950/20 to-slate-900/60 shadow-soft-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20">
              💬
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>WhatsApp Notification Active</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                Notify Host on WhatsApp (+91 9595579336)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Send 1-click booking confirmation with slot date, IST time & candidate details to host WhatsApp.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => openWhatsAppNotification(latestBooking, hostWhatsAppPhone)}
              className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center space-x-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send WhatsApp Notification</span>
            </button>

            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="px-3.5 py-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
              Preview Message
            </button>
          </div>
        </div>

        {/* Message Preview snippet */}
        <div className="p-4 rounded-xl bg-slate-900/90 text-emerald-300 text-xs font-mono whitespace-pre-line leading-relaxed border border-slate-800 shadow-inner">
          {latestBooking.whatsappMessage || formatWhatsAppBookingMessage(latestBooking)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setCurrentView('candidate-portal')}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Candidate Portal</span>
        </button>
      </div>

      {/* Interactive Email Preview / Send Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-card border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-brand-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Candidate Email Confirmation
                </h3>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
                <div><strong className="text-slate-700 dark:text-slate-300">To:</strong> {latestBooking.candidateEmail}</div>
                <div><strong className="text-slate-700 dark:text-slate-300">Subject:</strong> Interview Confirmation: {latestBooking.meetingType || 'Technical Interview'}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line font-sans leading-relaxed">
                {`Hello ${latestBooking.candidateName},\n\nYour interview slot has been successfully confirmed!\n\n📅 Date: ${latestBooking.date}\n⏰ Slot Time: ${latestBooking.time}\n\nPlease be available at the scheduled time.\n\nBest regards,\nInterview Support Team`}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleCopyEmailBody}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center space-x-1.5"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied' : 'Copy Email Body'}</span>
              </button>

              <a
                href={getMailtoUrl()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-brand-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send via Mail App</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Interactive WhatsApp Preview / Custom Send Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-card border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  WhatsApp Host Notification
                </h3>
              </div>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Host WhatsApp Number</label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="e.g. 919595579336"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-emerald-300 text-xs font-mono whitespace-pre-line leading-relaxed border border-slate-800 max-h-60 overflow-y-auto">
                {latestBooking.whatsappMessage || formatWhatsAppBookingMessage(latestBooking)}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleCopyWhatsAppBody}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center space-x-1.5"
              >
                {copiedWhatsApp ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWhatsApp ? 'Copied' : 'Copy Message Text'}</span>
              </button>

              <button
                onClick={() => openWhatsAppNotification(latestBooking, customPhone)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Open WhatsApp Web / App</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

