// St. Mary's International School (SMIS) WEB PORTAL
import React, { useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useApp } from './contexts/AppContext';
import { useToast } from './components/ui/ToastProvider';
import { ToastProvider } from './components/ui/ToastProvider';
import { AppProvider } from './contexts/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Header from './components/Header';

// Pages
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import ClassesPage from './pages/ClassesPage';
import ClassForm from './components/ClassForm';
import StudentsPage from './pages/StudentsPage';
import UpdatesPage from './pages/UpdatesPage';
import SettingsPage from './pages/SettingsPage';
import CalendarPage from './pages/CalendarPage';
import PageNotFound from './pages/PageNotFound';

// Main App component wrapped with providers
function App() {
  return (
    <Router>
      <AppProviders>
        <AppContent />
      </AppProviders>
    </Router>
  );
}

// Component that wraps all providers
function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AppProvider>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </AppProvider>
    </ToastProvider>
  );
}

// Main app content component
function AppContent() {
  const { currentUser, isLoading, logout } = useApp();
  const { showError } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      showError(error.message || 'Failed to log out');
    }
  };

  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!currentUser ? (
        <AuthPage />
      ) : (
        <div className="flex h-screen bg-gray-100">
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header 
              currentUser={currentUser} 
              onLogout={handleLogout}
              onNavigate={handleNavigate}
              onShowAuthModal={() => navigate('/auth')}
              unreadUpdates={0} // TODO: Implement unread updates count
            />
            
            {/* Main content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
              <div className="container mx-auto">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  
                  {/* Classes Routes */}
                  <Route path="/classes" element={<ClassesPage />} />
                  <Route path="/classes/new" element={<ClassForm />} />
                  <Route path="/classes/:id/edit" element={<ClassForm isEditing={true} />} />
                  
                  {/* Students Routes */}
                  <Route path="/students" element={<StudentsPage />} />
                  <Route path="/students/new" element={<ClassForm />} />
                  
                  {/* Updates Routes */}
                  <Route path="/updates" element={<UpdatesPage />} />
                  <Route path="/updates/new" element={<div className="p-6"><h1>Create New Update</h1><p>Update creation form coming soon.</p></div>} />
                  
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export { App, AppProviders, AppContent };
