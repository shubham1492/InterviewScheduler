import React, { createContext, useContext, useState, useEffect } from 'react';
import { convertTimeToIST, formatDualTime } from '../utils/timezoneUtils';
import { 
  formatWhatsAppBookingMessage, 
  getWhatsAppShareUrl, 
  openWhatsAppNotification, 
  DEFAULT_HOST_WHATSAPP 
} from '../utils/whatsapp';
import { 
  listenToBookedSlots, 
  saveBookingToFirebase, 
  deleteBookingFromFirebase 
} from '../firebase';

const AppContext = createContext();

export const initialCandidates = [
  {
    id: 'cand-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@techlead.io',
    company: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    role: 'Senior Full Stack Engineer',
    interviewType: 'System Design',
    experience: '6 Years',
    date: '2026-08-04',
    time: '10:30 AM EST (09:00 PM IST)',
    duration: '45 min',
    status: 'Upcoming',
    meetLink: 'https://meet.google.com/xyz-abcd-123',
    linkedin: 'https://linkedin.com/in/sarah-chen-dev',
    notes: 'Strong candidate with distributed systems experience. Lead author on high-throughput microservices migration.',
    rating: 4.8,
    techStack: ['React', 'Node.js', 'Go', 'Kubernetes', 'PostgreSQL'],
    resumeUrl: 'sarah_chen_resume.pdf'
  },
  {
    id: 'cand-2',
    name: 'Marcus Vance',
    email: 'm.vance@linear.app',
    company: 'Linear App',
    role: 'Frontend Architect',
    interviewType: 'Coding Challenge',
    experience: '8 Years',
    date: '2026-08-04',
    time: '02:00 PM EST (01:30 AM IST)',
    duration: '30 min',
    status: 'Upcoming',
    meetLink: 'https://meet.google.com/abc-efgh-456',
    linkedin: 'https://linkedin.com/in/marcusvance',
    notes: 'Expert in WebGL, Canvas animations and web performance optimization. Created custom render pipeline.',
    rating: 4.9,
    techStack: ['TypeScript', 'React', 'WebGL', 'TailwindCSS', 'Vite'],
    resumeUrl: 'marcus_vance_cv.pdf'
  }
];

export const initialWeeklySchedule = [
  { day: 'Monday', active: true, startTime: '09:00 AM', endTime: '05:00 PM', breaks: [{ label: 'Lunch Break', start: '12:00 PM', end: '01:00 PM' }] },
  { day: 'Tuesday', active: true, startTime: '09:00 AM', endTime: '05:00 PM', breaks: [{ label: 'Lunch Break', start: '12:30 PM', end: '01:30 PM' }] },
  { day: 'Wednesday', active: true, startTime: '09:00 AM', endTime: '05:00 PM', breaks: [{ label: 'Tech Sync', start: '03:00 PM', end: '03:30 PM' }] },
  { day: 'Thursday', active: true, startTime: '09:00 AM', endTime: '05:00 PM', breaks: [{ label: 'Lunch Break', start: '12:00 PM', end: '01:00 PM' }] },
  { day: 'Friday', active: true, startTime: '09:00 AM', endTime: '03:00 PM', breaks: [] },
  { day: 'Saturday', active: false, startTime: '10:00 AM', endTime: '02:00 PM', breaks: [] },
  { day: 'Sunday', active: false, startTime: '10:00 AM', endTime: '02:00 PM', breaks: [] },
];

export const initialSlotBookings = {
  '2026-08-01_09:00 AM': { name: 'Full Day Event', email: 'reserved@system.org', role: 'Reserved', timezone: 'Eastern Time (US & Canada)', istTime: '06:30 PM IST' },
  '2026-08-01_10:30 AM': { name: 'Full Day Event', email: 'reserved@system.org', role: 'Reserved', timezone: 'Eastern Time (US & Canada)', istTime: '08:00 PM IST' },
  '2026-08-01_01:00 PM': { name: 'Full Day Event', email: 'reserved@system.org', role: 'Reserved', timezone: 'Eastern Time (US & Canada)', istTime: '10:30 PM IST' },
  
  '2026-08-02_04:00 PM': { name: 'David Kim', email: 'david.k@vercel.com', role: 'Full Stack Engineer', timezone: 'Eastern Time (US & Canada)', istTime: '01:30 AM IST (+1d)' },
  
  '2026-08-03_11:00 AM': { name: 'Elena Rostova', email: 'elena@databricks.com', role: 'Staff Backend Engineer', timezone: 'Eastern Time (US & Canada)', istTime: '08:30 PM IST' },
  '2026-08-03_02:30 PM': { name: 'Alex Johnson', email: 'alex.j@tech.co', role: 'DevOps Lead', timezone: 'Eastern Time (US & Canada)', istTime: '12:00 AM IST (+1d)' },
  
  '2026-08-04_10:30 AM': { name: 'Sarah Chen', email: 'sarah.chen@techlead.io', role: 'Senior Full Stack', timezone: 'Eastern Time (US & Canada)', istTime: '08:00 PM IST' },
  '2026-08-04_02:30 PM': { name: 'Marcus Vance', email: 'm.vance@linear.app', role: 'Frontend Architect', timezone: 'Eastern Time (US & Canada)', istTime: '12:00 AM IST (+1d)' },
  
  '2026-08-05_09:00 AM': { name: 'Aria Montgomery', email: 'aria.m@figma.com', role: 'UI/UX Architect', timezone: 'Eastern Time (US & Canada)', istTime: '06:30 PM IST' },
  
  '2026-08-13_09:00 AM': { name: 'Rachel Green', email: 'rachel@design.io', role: 'Product Designer', timezone: 'Eastern Time (US & Canada)', istTime: '06:30 PM IST' },
  '2026-08-13_01:00 PM': { name: 'Kevin Lee', email: 'k.lee@startup.co', role: 'Software Engineer', timezone: 'Eastern Time (US & Canada)', istTime: '10:30 PM IST' },
};

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('candidate-portal');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2026-08-13');
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM');
  const [duration, setDuration] = useState('30 min');
  const [timezone, setTimezone] = useState('Eastern Time (US & Canada)');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isMobileSimulated, setIsMobileSimulated] = useState(false);

  // Availability & Scheduling Settings State
  const [weeklySchedule, setWeeklySchedule] = useState(() => {
    try {
      const saved = localStorage.getItem('interview_scheduler_weekly_schedule');
      return saved ? JSON.parse(saved) : initialWeeklySchedule;
    } catch (e) {
      return initialWeeklySchedule;
    }
  });

  const [bufferTime, setBufferTime] = useState(() => {
    try {
      return localStorage.getItem('interview_scheduler_buffer_time') || '15 min';
    } catch (e) {
      return '15 min';
    }
  });

  const [maxInterviewsPerDay, setMaxInterviewsPerDay] = useState(() => {
    try {
      const saved = localStorage.getItem('interview_scheduler_max_interviews');
      return saved ? parseInt(saved, 10) : 5;
    } catch (e) {
      return 5;
    }
  });

  const [isRecurringSchedule, setIsRecurringSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem('interview_scheduler_recurring');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  const [hostWhatsAppPhone, setHostWhatsAppPhone] = useState(() => {
    try {
      return localStorage.getItem('interview_scheduler_host_whatsapp') || DEFAULT_HOST_WHATSAPP;
    } catch (e) {
      return DEFAULT_HOST_WHATSAPP;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('interview_scheduler_host_whatsapp', hostWhatsAppPhone);
    } catch (e) {}
  }, [hostWhatsAppPhone]);

  // Admin Password & Lock Protection State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [targetAdminView, setTargetAdminView] = useState('admin');
  const adminMasterPassword = 'admin123';

  // Load slotBookings from localStorage with fallback to initialSlotBookings
  const [slotBookings, setSlotBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('interview_scheduler_slot_bookings');
      return saved ? JSON.parse(saved) : initialSlotBookings;
    } catch (e) {
      return initialSlotBookings;
    }
  });

  // Load candidates from localStorage with fallback to initialCandidates
  const [candidates, setCandidates] = useState(() => {
    try {
      const saved = localStorage.getItem('interview_scheduler_candidates');
      return saved ? JSON.parse(saved) : initialCandidates;
    } catch (e) {
      return initialCandidates;
    }
  });

  const [selectedCandidate, setSelectedCandidate] = useState(initialCandidates[0]);

  // Persist weeklySchedule to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('interview_scheduler_weekly_schedule', JSON.stringify(weeklySchedule));
    } catch (e) {
      console.error(e);
    }
  }, [weeklySchedule]);

  // Persist bufferTime to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('interview_scheduler_buffer_time', bufferTime);
    } catch (e) {
      console.error(e);
    }
  }, [bufferTime]);

  // Persist maxInterviewsPerDay to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('interview_scheduler_max_interviews', maxInterviewsPerDay.toString());
    } catch (e) {
      console.error(e);
    }
  }, [maxInterviewsPerDay]);

  // Persist isRecurringSchedule to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('interview_scheduler_recurring', JSON.stringify(isRecurringSchedule));
    } catch (e) {
      console.error(e);
    }
  }, [isRecurringSchedule]);

  // Persist slotBookings to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('interview_scheduler_slot_bookings', JSON.stringify(slotBookings));
    } catch (e) {
      console.error(e);
    }
  }, [slotBookings]);

  // Persist candidates to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('interview_scheduler_candidates', JSON.stringify(candidates));
    } catch (e) {
      console.error(e);
    }
  }, [candidates]);

  // Subscribe to live Firebase Firestore updates
  useEffect(() => {
    const unsubscribe = listenToBookedSlots((remoteBookings) => {
      if (remoteBookings && Object.keys(remoteBookings).length > 0) {
        setSlotBookings((prev) => ({
          ...prev,
          ...remoteBookings
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Save all Availability management settings
  const saveAvailabilitySettings = (newSettings = {}) => {
    if (newSettings.schedule) setWeeklySchedule(newSettings.schedule);
    if (newSettings.bufferTime) setBufferTime(newSettings.bufferTime);
    if (newSettings.maxInterviewsPerDay !== undefined) setMaxInterviewsPerDay(newSettings.maxInterviewsPerDay);
    if (newSettings.timezone) setTimezone(newSettings.timezone);
    if (newSettings.isRecurringSchedule !== undefined) setIsRecurringSchedule(newSettings.isRecurringSchedule);

    showToast("Availability schedule & rules saved successfully!");
  };

  // Reset to factory demo data if requested by admin
  const resetToDefaultData = () => {
    setSlotBookings(initialSlotBookings);
    setCandidates(initialCandidates);
    setWeeklySchedule(initialWeeklySchedule);
    setBufferTime('15 min');
    setMaxInterviewsPerDay(5);
    setIsRecurringSchedule(true);
    try {
      localStorage.removeItem('interview_scheduler_slot_bookings');
      localStorage.removeItem('interview_scheduler_candidates');
      localStorage.removeItem('interview_scheduler_weekly_schedule');
      localStorage.removeItem('interview_scheduler_buffer_time');
      localStorage.removeItem('interview_scheduler_max_interviews');
      localStorage.removeItem('interview_scheduler_recurring');
    } catch (e) {}
    showToast("Reset all slots and availability to default demo data!");
  };

  const [latestBooking, setLatestBooking] = useState({
    candidateName: 'Sarah Chen',
    candidateEmail: 'sarah.chen@techlead.io',
    company: 'Stripe',
    jobRole: 'Senior Full Stack Engineer',
    date: 'August 13, 2026',
    time: '10:30 AM EST ➔ 08:00 PM IST',
    meetLink: 'https://meet.google.com/xyz-abcd-123'
  });

  // Apply dark mode class to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Open password modal for accessing protected admin views
  const openAdminAuthModal = (desiredView = 'admin') => {
    if (isAdminAuthenticated) {
      setCurrentView(desiredView);
    } else {
      setTargetAdminView(desiredView);
      setIsAdminAuthModalOpen(true);
    }
  };

  // Validate admin password
  const loginAdmin = (passwordInput) => {
    if (passwordInput === adminMasterPassword) {
      setIsAdminAuthenticated(true);
      setIsAdminAuthModalOpen(false);
      setCurrentView(targetAdminView);
      showToast("Host Admin Unlocked Successfully!");
      return true;
    }
    return false;
  };

  // Logout/Lock Admin
  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('candidate-portal');
    showToast("Host Admin Portal Locked.");
  };

  // Guard view navigation for protected admin pages
  const safeSetCurrentView = (viewName) => {
    const adminViews = ['admin', 'availability', 'analytics', 'candidate-details', 'settings'];
    if (adminViews.includes(viewName) && !isAdminAuthenticated) {
      openAdminAuthModal(viewName);
    } else {
      setCurrentView(viewName);
    }
  };

  const addBooking = (newBooking) => {
    const bookingKey = `${selectedDate}_${selectedSlot}`;
    const istConverted = convertTimeToIST(selectedSlot, timezone, selectedDate);
    const dualTimeStr = formatDualTime(selectedSlot, timezone, selectedDate);

    const bookingPayload = {
      name: newBooking.name,
      email: newBooking.email,
      company: newBooking.company || 'Independent',
      role: newBooking.jobRole || 'Candidate',
      duration: duration,
      timezone: timezone,
      istTime: istConverted
    };

    // Register the slot locally and sync to Firebase
    setSlotBookings((prev) => ({
      ...prev,
      [bookingKey]: bookingPayload
    }));

    saveBookingToFirebase(bookingKey, bookingPayload);

    const createdCandidate = {
      id: `cand-${Date.now()}`,
      name: newBooking.name,
      email: newBooking.email,
      company: newBooking.company || 'Independent',
      role: newBooking.jobRole || 'Full Stack Engineer',
      experience: newBooking.experience || '5+ Years',
      date: selectedDate,
      time: dualTimeStr,
      duration: duration,
      timezone: timezone,
      istTime: istConverted,
      status: 'Upcoming',
      meetLink: `https://meet.google.com/sch-${Math.floor(Math.random()*900+100)}-meet`,
      linkedin: newBooking.linkedin || 'https://linkedin.com',
      notes: newBooking.notes || 'Newly booked interview slot.',
      rating: 5.0,
      techStack: ['React', 'Node.js', 'TypeScript', 'System Design'],
      resumeUrl: newBooking.resumeName || 'candidate_resume.pdf'
    };

    setCandidates([createdCandidate, ...candidates]);
    setSelectedCandidate(createdCandidate);

    const bookingDetails = {
      candidateName: newBooking.name,
      candidateEmail: newBooking.email,
      company: newBooking.company || 'Independent',
      jobRole: newBooking.jobRole || 'Full Stack Engineer',
      date: selectedDate,
      time: dualTimeStr,
      duration: duration,
      meetLink: createdCandidate.meetLink,
      notes: newBooking.notes || 'None'
    };

    const waMsg = formatWhatsAppBookingMessage(bookingDetails);
    const waUrl = getWhatsAppShareUrl({ booking: bookingDetails, phone: hostWhatsAppPhone });

    setLatestBooking({
      ...bookingDetails,
      whatsappMessage: waMsg,
      whatsappUrl: waUrl,
      hostPhone: hostWhatsAppPhone
    });

    if (newBooking.notifyWhatsApp !== false) {
      setTimeout(() => {
        openWhatsAppNotification(bookingDetails, hostWhatsAppPhone);
      }, 400);
    }

    setIsBookingModalOpen(false);
    setCurrentView('success');
    showToast(`Slot ${selectedSlot} (${istConverted}) booked successfully!`);
  };

  // Delete a booked slot by date & time slot
  const deleteSlotBooking = (dateStr, slotStr) => {
    const bookingKey = `${dateStr}_${slotStr}`;
    
    // Remove locally
    setSlotBookings((prev) => {
      const copy = { ...prev };
      delete copy[bookingKey];
      return copy;
    });

    // Remove from Firebase Firestore
    deleteBookingFromFirebase(bookingKey);

    // Remove corresponding candidate from list
    setCandidates((prev) => prev.filter(c => !(c.date === dateStr && (c.time.includes(slotStr) || (c.time.split(' ')[0] + ' ' + c.time.split(' ')[1]) === slotStr))));

    showToast(`Deleted booked slot (${slotStr}) for ${dateStr}. Slot is now open again!`);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView: safeSetCurrentView,
        isDarkMode,
        toggleDarkMode,
        selectedDate,
        setSelectedDate,
        selectedSlot,
        setSelectedSlot,
        duration,
        setDuration,
        timezone,
        setTimezone,
        isBookingModalOpen,
        setIsBookingModalOpen,
        candidates,
        setCandidates,
        selectedCandidate,
        setSelectedCandidate,
        latestBooking,
        setLatestBooking,
        toastMessage,
        showToast,
        slotBookings,
        setSlotBookings,
        addBooking,
        deleteSlotBooking,
        resetToDefaultData,
        isMobileSimulated,
        setIsMobileSimulated,
        // WhatsApp Notification Exports
        hostWhatsAppPhone,
        setHostWhatsAppPhone,
        // Availability Settings
        weeklySchedule,
        setWeeklySchedule,
        bufferTime,
        setBufferTime,
        maxInterviewsPerDay,
        setMaxInterviewsPerDay,
        isRecurringSchedule,
        setIsRecurringSchedule,
        saveAvailabilitySettings,
        // Admin Lock Auth Exports
        isAdminAuthenticated,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        openAdminAuthModal,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

