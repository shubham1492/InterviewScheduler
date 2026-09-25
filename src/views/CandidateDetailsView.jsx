import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Mail, 
  Building2, 
  Briefcase, 
  Linkedin, 
  FileText, 
  Star, 
  Calendar, 
  Clock, 
  Video, 
  Download, 
  MessageSquare, 
  Send, 
  Plus, 
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  Eye,
  Award,
  Sparkles
} from 'lucide-react';

export const CandidateDetailsView = () => {
  const { selectedCandidate, setCurrentView, showToast } = useApp();
  const candidate = selectedCandidate;

  const [notes, setNotes] = useState(candidate?.notes || 'Strong candidate with distributed systems experience. Lead author on high-throughput microservices migration.');
  const [newNoteInput, setNewNoteInput] = useState('');
  const [noteList, setNoteList] = useState([
    { id: 1, author: 'Alex Rivera (Host)', date: 'Aug 4, 2026', text: 'Candidate demonstrated deep mastery of database sharding and caching topologies.' },
    { id: 2, author: 'Recruiter Operations', date: 'Aug 1, 2026', text: 'Resume verified. High match score for Senior Level 6 engineering track.' }
  ]);

  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;

    setNoteList([
      { id: Date.now(), author: 'Alex Rivera (You)', date: 'Just now', text: newNoteInput },
      ...noteList
    ]);
    setNewNoteInput('');
    showToast('New interviewer note appended');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <button
          onClick={() => setCurrentView('admin')}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => showToast(`Drafting email to ${candidate.email}...`)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-brand-500" />
            <span>Email Candidate</span>
          </button>

          <button
            onClick={() => setIsResumePreviewOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-md shadow-brand-500/20 active:scale-95 transition-all flex items-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Resume</span>
          </button>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 Cols): Candidate Profile Header Card */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 sm:p-8 rounded-card border border-white/60 dark:border-slate-800 shadow-soft-lg space-y-6">
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 text-white text-2xl font-extrabold flex items-center justify-center shadow-lg shadow-brand-500/20">
                {candidate.name.charAt(0)}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {candidate.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    {candidate.status}
                  </span>
                </div>
                
                <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                  {candidate.role}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-0.5">
                  <Building2 className="w-3 h-3" />
                  <span>{candidate.company} • {candidate.experience} Experience</span>
                </p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Interviewer Score</span>
              <div className="flex items-center space-x-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
                  {candidate.rating} / 5.0
                </span>
              </div>
            </div>

            {/* Candidate Specs Table */}
            <div className="space-y-2.5 text-xs">
              
              <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                <span className="text-slate-400 font-medium flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{candidate.email}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                <span className="text-slate-400 font-medium flex items-center space-x-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-blue-500" />
                  <span>LinkedIn</span>
                </span>
                <a 
                  href={candidate.linkedin} 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                >
                  <span>Profile Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                <span className="text-slate-400 font-medium flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-500" />
                  <span>Interview Slot</span>
                </span>
                <span className="font-bold text-brand-600 dark:text-brand-400 text-right">{candidate.date} @ {candidate.time}</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-400 font-medium flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-500" />
                  <span>Attached CV</span>
                </span>
                <button
                  onClick={() => setIsResumePreviewOpen(true)}
                  className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  {candidate.resumeUrl}
                </button>
              </div>

            </div>

            {/* Tech Stack Skills Badges */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Verified Technical Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {candidate.techStack.map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 text-[11px] font-semibold border border-brand-200 dark:border-brand-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Download Resume Action */}
            <button
              onClick={() => showToast(`Downloading ${candidate.resumeUrl}...`)}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Candidate Resume</span>
            </button>

          </div>

        </div>

        {/* Right Column (7 Cols): Resume Preview Box, Interview Notes, & Evaluation Logs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Resume Quick Preview Canvas Simulation */}
          <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Resume Document Canvas Preview</h3>
              </div>

              <button
                onClick={() => setIsResumePreviewOpen(true)}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
              >
                <span>Full Modal View</span>
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* PDF Canvas Mock */}
            <div className="w-full h-56 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 overflow-hidden text-xs relative font-mono">
              <div className="w-3/4 h-4 bg-slate-300 dark:bg-slate-700 rounded animate-pulse" />
              <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-5/6 h-2 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-4/6 h-2 bg-slate-200 dark:bg-slate-800 rounded" />

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-1/3 h-3 bg-brand-400/40 rounded" />
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="w-5/6 h-2 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-slate-900 to-transparent flex items-end justify-center pb-4">
                <button
                  onClick={() => setIsResumePreviewOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-md"
                >
                  Expand Full Resume Document
                </button>
              </div>
            </div>

          </div>

          {/* Interviewer Notes Section */}
          <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-brand-500" />
                <span>Interviewer Evaluation Notes</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">{noteList.length} Notes</span>
            </div>

            {/* New Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder="Add evaluation note or feedback..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm transition-colors flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            {/* Note Timeline */}
            <div className="space-y-3 pt-2">
              {noteList.map((n) => (
                <div key={n.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{n.author}</span>
                    <span className="text-[10px] text-slate-400">{n.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {n.text}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Resume PDF Viewer Modal */}
      {isResumePreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="glass-modal w-full max-w-4xl h-[85vh] rounded-modal p-6 shadow-2xl flex flex-col relative space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Resume Preview — {candidate.name}
                </h3>
                <p className="text-xs text-slate-400">{candidate.resumeUrl}</p>
              </div>

              <button
                onClick={() => setIsResumePreviewOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Simulated PDF Viewer Page */}
            <div className="flex-1 bg-white text-slate-900 rounded-2xl p-8 overflow-y-auto font-sans shadow-inner space-y-6 border border-slate-200 text-sm">
              <div className="border-b pb-4 space-y-1">
                <h1 className="text-2xl font-bold">{candidate.name}</h1>
                <p className="text-xs text-slate-600">{candidate.email} • {candidate.linkedin}</p>
                <p className="text-xs font-semibold text-brand-600">{candidate.role} — {candidate.company}</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Executive Summary</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Accomplished software engineer with {candidate.experience} experience designing high-scale cloud platforms, distributed systems, and modern web applications. Deep proficiency in {candidate.techStack.join(', ')}.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Professional Experience</h2>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{candidate.role} — {candidate.company}</span>
                    <span>2022 - Present</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-2">
                    <li>Led architecture redesign for high-frequency payment pipelines handling $50M+ daily volume.</li>
                    <li>Reduced P99 API latency by 42% through microservices caching and SQL query optimization.</li>
                    <li>Mentored junior engineers and spearheaded automated CI/CD deployment pipelines.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Technical Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {candidate.techStack.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded bg-slate-100 text-xs font-semibold text-slate-700 border">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">PDF Document • 2 Pages</span>
              <button
                onClick={() => {
                  showToast(`Downloaded ${candidate.resumeUrl}`);
                  setIsResumePreviewOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
