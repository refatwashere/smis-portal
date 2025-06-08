import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    Missing Supabase environment variables.
    Please check your .env file and make sure the following are set:
    - REACT_APP_SUPABASE_URL
    - REACT_APP_SUPABASE_ANON_KEY
  `);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to handle errors consistently
export const handleSupabaseError = (error, defaultMessage = 'An error occurred') => {
  console.error('Supabase Error:', error);
  throw new Error(error?.message || defaultMessage);
};

// Helper function to handle success responses
export const handleSupabaseSuccess = (data, defaultMessage = 'Operation successful') => ({
  success: true,
  data,
  message: defaultMessage
});

// Subscribe to auth state changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// Sign up with email and password
export const signUpWithEmail = async (email, password, userMetadata = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userMetadata
    },
  });
  
  if (error) throw error;
  return data;
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Get current user
export const getCurrentUser = () => {
  return supabase.auth.getUser();
};

// Get current session
export const getSession = () => {
  return supabase.auth.getSession();
};

// Reset password
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });
  
  if (error) throw error;
  return data;
};

// Update user
export const updateUser = async (updates) => {
  const { data, error } = await supabase.auth.updateUser(updates);
  
  if (error) throw error;
  return data;
};
