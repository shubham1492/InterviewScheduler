import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  Users, 
  Building2, 
  Code2, 
  PieChart as PieIcon, 
  CheckCircle2, 
  XCircle,
  Sparkles
} from 'lucide-react';

export const AnalyticsView = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Performance Metrics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Analytics & Insights
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track interview volume, candidate conversion rates, company breakdown, and duration trends.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-slate-500">Time Range:</span>
          <select className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none">
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="year">Year to Date (2026)</option>
          </select>
        </div>
      </div>

      {/* KPI Stat Summary Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-white/60 dark:border-slate-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Interviews Conducted</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">314</div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/60 dark:border-slate-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">342</div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.1% growth</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/60 dark:border-slate-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Cancellation Rate</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">4.2%</div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-1.5% lower (Good)</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/60 dark:border-slate-800 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Duration</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">38 Min</div>
          <div className="text-[11px] font-medium text-slate-500">Target 45 Min</div>
        </div>

      </div>

      {/* Main Charts Row 1: Line Chart (Interviews per Month) & Donut Chart (Outcome Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Line Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Interviews per Month (2026)</h3>
              <p className="text-xs text-slate-500">Completed technical evaluations timeline</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold">
              Steady Growth
            </span>
          </div>

          {/* SVG Smooth Curve Line Chart */}
          <div className="h-64 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="4 4" />

              {/* Area Gradient Fill */}
              <path
                d="M 10,140 Q 90,110 170,80 T 330,50 T 490,20 L 490,180 L 10,180 Z"
                fill="url(#chartGradient)"
              />

              {/* Smooth Path */}
              <path
                d="M 10,140 Q 90,110 170,80 T 330,50 T 490,20"
                fill="none"
                stroke="#6366f1"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Points */}
              {[
                { x: 10, y: 140, val: 24, label: 'Jan' },
                { x: 90, y: 110, val: 32, label: 'Feb' },
                { x: 170, y: 80, val: 45, label: 'Mar' },
                { x: 250, y: 95, val: 40, label: 'Apr' },
                { x: 330, y: 50, val: 58, label: 'May' },
                { x: 410, y: 35, val: 64, label: 'Jun' },
                { x: 490, y: 20, val: 72, label: 'Jul' },
              ].map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" className="fill-white dark:fill-slate-900 stroke-brand-600 stroke-[3]" />
                  <text x={p.x} y="195" textAnchor="middle" className="text-[10px] fill-slate-400 font-semibold">{p.label}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Donut Chart Outcomes */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Outcome Breakdown</h3>
            <p className="text-xs text-slate-500">Completed vs Cancelled vs Pending</p>
          </div>

          {/* Donut Graphic */}
          <div className="flex justify-center py-4 relative">
            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="80, 100"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#6366f1"
                strokeWidth="4"
                strokeDasharray="14, 100"
                strokeDashoffset="-80"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="4"
                strokeDasharray="6, 100"
                strokeDashoffset="-94"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">80%</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Passed & Completed</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Completed / Passed</span>
              </span>
              <span className="font-bold">80% (251)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                <span>Upcoming Scheduled</span>
              </span>
              <span className="font-bold">14% (44)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Cancelled / No-show</span>
              </span>
              <span className="font-bold">6% (19)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Most Common Companies & Tech Stack Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Most Common Companies */}
        <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-brand-500" />
              <span>Top Candidate Organizations</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">By Volume</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Stripe', count: 48, pct: 85 },
              { name: 'Linear App', count: 36, pct: 70 },
              { name: 'Databricks', count: 29, pct: 58 },
              { name: 'Vercel', count: 24, pct: 45 },
              { name: 'Figma', count: 18, pct: 35 },
            ].map((co) => (
              <div key={co.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>{co.name}</span>
                  <span>{co.count} candidates</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-purple-600" 
                    style={{ width: `${co.pct}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Common Technologies Evaluated */}
        <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-purple-500" />
              <span>Most Evaluated Technologies</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Topics</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { name: 'System Design Architecture', count: '142 Sessions' },
              { name: 'React & Frontend Performance', count: '118 Sessions' },
              { name: 'Node.js Microservices', count: '94 Sessions' },
              { name: 'Distributed Systems (Go/Rust)', count: '82 Sessions' },
              { name: 'PostgreSQL & Query Optimization', count: '65 Sessions' },
              { name: 'GraphQL & REST API Design', count: '52 Sessions' },
            ].map((t) => (
              <div key={t.name} className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1 flex-grow">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</div>
                <div className="text-[10px] font-semibold text-brand-600 dark:text-brand-400">{t.count}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
