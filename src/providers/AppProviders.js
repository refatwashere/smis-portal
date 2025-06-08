import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from '../components/ui/ToastProvider';
import { AppProvider } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';

/**
 * AppProviders component that wraps the application with all necessary providers
 * and handles initial app setup like session management.
 */
const AppProviders = ({ children }) => {
  useEffect(() => {
    // Check for existing session on initial load
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Session exists, user is signed in
        console.log('User session exists:', session.user);
      } else {
        // No session, user is signed out
        console.log('No active session');
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth state changed: ${event}`, session);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <ToastProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </ToastProvider>
    </Router>
  );
};

export default AppProviders;
