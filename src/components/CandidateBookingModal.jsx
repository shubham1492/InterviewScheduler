import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { convertTimeToIST, formatDualTime, getShortTimezoneCode } from '../utils/timezoneUtils';
import { 
  X, 
  User, 
  Mail, 
  Building2, 
  Briefcase, 
  Linkedin, 
  FileText, 
  Upload, 
  CheckCircle, 
  Loader2, 
  Calendar, 
  Clock, 
  MessageSquare,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

export const CandidateBookingModal = () => {
  const { 
    isBookingModalOpen, 
    setIsBookingModalOpen, 
    selectedDate, 
    selectedSlot, 
    duration,
    timezone,
    addBooking,
    hostWhatsAppPhone 
  } = useApp();

  const [formData, setFormData] = useState({
    name: 'Jordan Miller',
    email: 'jordan.m@innovate.tech',
    company: 'Innovate AI',
    jobRole: 'Senior Full Stack Engineer',
    experience: '6 Years',
    linkedin: 'https://linkedin.com/in/jordanmiller-dev',
    notes: 'Excited for the conversation!',
    resumeName: 'jordan_miller_resume.pdf',
    notifyWhatsApp: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState('jordan_miller_resume.pdf');

  if (!isBookingModalOpen) return null;

  const istConverted = convertTimeToIST(selectedSlot, timezone, selectedDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      addBooking({
        ...formData,
        resumeName: uploadedFile
      });
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="glass-modal w-full max-w-2xl rounded-modal p-6 sm:p-8 shadow-2xl relative my-auto space-y-6">
        
        {/* Modal Close Button */}
        <button
          onClick={() => setIsBookingModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-300 text-xs font-semibold border border-brand-200 dark:border-brand-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Slot Booking Form</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Confirm Your Slot Booking
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reserving slot on <strong className="text-brand-600 dark:text-brand-400">{selectedDate}</strong> at <strong className="text-purple-600 dark:text-purple-400">{selectedSlot} {getShortTimezoneCode(timezone, selectedDate)}</strong> ({duration}).
          </p>
        </div>

        {/* Booking Summary Pill */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-50 to-purple-50 dark:from-slate-900 dark:to-slate-900/90 border border-brand-200/60 dark:border-brand-900/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center space-x-2 flex-wrap">
            <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDate}</span>
            <span className="text-slate-400">•</span>
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSlot} {getShortTimezoneCode(timezone, selectedDate)}</span>
            <ArrowRightLeft className="w-3 h-3 text-emerald-500" />
            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Host Time: {istConverted}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300 shadow-xs self-start sm:self-auto">
            {duration} Session
          </span>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-brand-500" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Jordan Miller"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-brand-500" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jordan@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            {/* Company */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-brand-500" />
                <span>Current Company</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Innovate AI"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            {/* Job Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-brand-500" />
                <span>Target Job Role</span>
              </label>
              <input
                type="text"
                required
                value={formData.jobRole}
                onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                placeholder="Full Stack Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>



            {/* Years of Experience */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Years of Experience
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="1-3 Years">1 - 3 Years</option>
                <option value="4-6 Years">4 - 6 Years</option>
                <option value="7-9 Years">7 - 9 Years</option>
                <option value="10+ Years">10+ Years</option>
              </select>
            </div>

          </div>

          {/* LinkedIn URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <Linkedin className="w-3.5 h-3.5 text-blue-500" />
              <span>LinkedIn Profile URL</span>
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/jordanmiller-dev"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          {/* Resume Upload Dropzone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                <span>Resume Upload (PDF / DOCX)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Max 10 MB</span>
            </label>

            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700/80 hover:border-brand-500 dark:hover:border-brand-400 rounded-2xl p-4 text-center bg-slate-50/50 dark:bg-slate-900/50 transition-colors group cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {uploadedFile ? uploadedFile : "Click to upload or drag & drop"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    PDF, DOCX formatted resume files accepted
                  </p>
                </div>
                {uploadedFile && (
                  <span className="ml-auto flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    <CheckCircle className="w-3 h-3" />
                    <span>Uploaded</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 text-brand-500" />
              <span>Additional Notes / Topic Requests</span>
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any specific projects or topics you would like to discuss..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
            />
          </div>

          {/* WhatsApp Notification Preference */}
          <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                💬
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                  <span>WhatsApp Host Alert</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">Recommended</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Notify host (+91 9595579336) on WhatsApp automatically upon booking
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.notifyWhatsApp}
              onChange={(e) => setFormData({ ...formData, notifyWhatsApp: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-brand-500/30 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirming Booking...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Book Interview</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
