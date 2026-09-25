import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileViewWrapper } from './components/MobileViewWrapper';
import { CandidateBookingModal } from './components/CandidateBookingModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

// Views
import { LandingView } from './views/LandingView';
import { PublicBookingView } from './views/PublicBookingView';
import { CandidatePortalView } from './views/CandidatePortalView';
import { BookingSuccessView } from './views/BookingSuccessView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AvailabilityView } from './views/AvailabilityView';
import { AnalyticsView } from './views/AnalyticsView';
import { CandidateDetailsView } from './views/CandidateDetailsView';
import { SettingsView } from './views/SettingsView';

export function AppContent() {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'candidate-portal':
        return <CandidatePortalView />;
      case 'landing':
        return <LandingView />;
      case 'booking':
        return <PublicBookingView />;
      case 'success':
        return <BookingSuccessView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'availability':
        return <AvailabilityView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'candidate-details':
        return <CandidateDetailsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CandidatePortalView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer />

      <CandidateBookingModal />
      <AdminAuthModal />
      <Toast />
    </div>
  );
}

