import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Video, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  Code2,
  Briefcase,
  Star
} from 'lucide-react';

export const LandingView = () => {
  const { setCurrentView, setIsBookingModalOpen } = useApp();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-brand-500/20 via-purple-500/20 to-pink-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        
        {/* Top Tagline Pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-sm backdrop-blur-md mb-8 animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Seamless Technical Interview Booking</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span className="text-slate-400 font-normal">Real-Time Calendar Sync</span>
          </div>
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Title, Subtitle, CTA buttons, Trust Metrics */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Book Your <br className="hidden sm:inline" />
              <span className="gradient-text">Interview Slot</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Choose a convenient time from my available schedule. Fast, automated calendar sync with instant Google Meet link delivery.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  setCurrentView('booking');
                  setIsBookingModalOpen(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-brand-500/25 active:scale-95 transition-all group"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Slot</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView('booking')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm backdrop-blur-md transition-all"
              >
                <Clock className="w-4 h-4 text-brand-500" />
                <span>View Availability</span>
              </button>
            </div>

            {/* Trust Section Metrics */}
            <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">300+</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Interviews Conducted</div>
              </div>
              <div className="space-y-1 border-l border-slate-200 dark:border-slate-800 pl-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400">98%</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">On Time Starts</div>
              </div>
              <div className="space-y-1 border-l border-slate-200 dark:border-slate-800 pl-4">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">Open</span>
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Available This Week</div>
              </div>
            </div>

          </div>

          {/* Right Column: Host Profile Card & Modern Floating Cards */}
          <div className="lg:col-span-5 relative">
            
            {/* Host Profile Card (Apple + Linear design) */}
            <div className="glass-panel p-6 sm:p-8 rounded-card shadow-soft-lg border border-white/60 dark:border-slate-800 relative z-10 space-y-6 transform hover:scale-[1.01] transition-transform duration-300">
              
              {/* Card Header Profile */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Host Alex Rivera"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/40 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Alex Rivera</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                      HOST
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">Full Stack Engineer</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-0.5">
                    <Briefcase className="w-3 h-3" />
                    <span>8+ Years of Experience</span>
                  </p>
                </div>
              </div>

              {/* Host Spec Pills */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-slate-400 uppercase">Platform</div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Google Meet</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-slate-400 uppercase">Default Duration</div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">30 Minutes</div>
                  </div>
                </div>
              </div>

              {/* Topics Expertise */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <Code2 className="w-3.5 h-3.5 text-brand-500" />
                  <span>Interview Assessment Domains</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['System Design', 'React & Vite', 'Node.js & Go', 'Distributed DBs', 'Coding Algorithms'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Book CTA inside card */}
              <button
                onClick={() => {
                  setCurrentView('booking');
                  setIsBookingModalOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Check Next Available Timeslot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modern Floating Badges around Card */}
            <div className="absolute -top-4 -right-4 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-soft border border-slate-200 dark:border-slate-800 flex items-center space-x-2 animate-float pointer-events-none z-20">
              <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Star className="w-4 h-4 fill-emerald-500" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">4.95 Rating</div>
                <div className="text-[9px] text-slate-400">Candidate Feedback</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-soft border border-slate-200 dark:border-slate-800 flex items-center space-x-2 pointer-events-none z-20">
              <div className="w-7 h-7 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">Instant Sync</div>
                <div className="text-[9px] text-slate-400">Google Calendar Integrated</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
