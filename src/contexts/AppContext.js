import { createContext, useContext, useReducer, useCallback } from 'react';
import { useToast } from '../components/ui/ToastProvider';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

const initialState = {
  currentUser: null,
  session: null,
  isLoading: false,
  classes: [],
  selectedClass: null,
  students: [],
  updates: [],
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 0
  },
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SESSION':
      return { ...state, session: action.payload };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_CLASSES':
      return { ...state, classes: action.payload };
    case 'ADD_CLASS':
      return { ...state, classes: [action.payload, ...state.classes] };
    case 'SET_SELECTED_CLASS':
      return { ...state, selectedClass: action.payload };
    case 'SET_STUDENTS':
      return { ...state, students: action.payload };
    case 'ADD_STUDENT':
      return { ...state, students: [action.payload, ...state.students] };
    case 'SET_UPDATES':
      return { ...state, updates: action.payload };
    case 'ADD_UPDATE':
      return { ...state, updates: [action.payload, ...state.updates] };
    case 'SET_PAGINATION':
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    case 'RESET_STATE':
      return { ...initialState };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { success, error: showError } = useToast();

  // Auth actions
  const login = useCallback(async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      dispatch({ type: 'SET_SESSION', payload: data.session });
      dispatch({ type: 'SET_USER', payload: data.user });
      success('Successfully logged in!');
      return data.user;
    } catch (error) {
      showError(error.message || 'Failed to log in');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [success, showError]);

  const signup = useCallback(async ({ email, password, name, phone }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim(),
            role: 'teacher',
            created_at: new Date().toISOString()
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;
      
      success('Account created! Please check your email to verify your account.');
      return data.user;
    } catch (error) {
      showError(error.message || 'Failed to create account');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [success, showError]);

  const logout = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      dispatch({ type: 'RESET_STATE' });
      success('Successfully logged out');
    } catch (error) {
      showError(error.message || 'Failed to log out');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [success, showError]);

  // Class actions
  const fetchClasses = useCallback(async () => {
    if (!state.currentUser) return [];
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', state.currentUser.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      dispatch({ type: 'SET_CLASSES', payload: data || [] });
      return data || [];
    } catch (error) {
      showError('Failed to load classes');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentUser, showError]);

  const addClass = useCallback(async (classData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data, error } = await supabase
        .from('classes')
        .insert([{ 
          name: classData.name,
          description: classData.description,
          grade: classData.grade,
          subject: classData.subject,
          schedule: classData.schedule,
          room: classData.room,
          teacher_id: state.currentUser?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      dispatch({ type: 'ADD_CLASS', payload: data });
      return data;
    } catch (error) {
      console.error('Error adding class:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentUser?.id]);

  const updateClass = useCallback(async (id, updates) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data, error } = await supabase
        .from('classes')
        .update({ 
          name: updates.name,
          description: updates.description,
          grade: updates.grade,
          subject: updates.subject,
          schedule: updates.schedule,
          room: updates.room,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update the class in the state
      dispatch({ 
        type: 'SET_CLASSES', 
        payload: state.classes.map(cls => 
          cls.id === id ? { ...cls, ...data } : cls
        ) 
      });
      
      // Update selected class if it's the one being edited
      if (state.selectedClass?.id === id) {
        dispatch({ type: 'SET_SELECTED_CLASS', payload: data });
      }
      
      return data;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.classes, state.selectedClass]);

  const deleteClass = useCallback(async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove the class from the state
      dispatch({ 
        type: 'SET_CLASSES', 
        payload: state.classes.filter(cls => cls.id !== id)
      });
      
      // Clear selected class if it's the one being deleted
      if (state.selectedClass?.id === id) {
        dispatch({ type: 'SET_SELECTED_CLASS', payload: null });
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.classes, state.selectedClass]);

  const getClassById = useCallback(async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Check if the class is already in the state
      const existingClass = state.classes.find(cls => cls.id === id);
      if (existingClass) return existingClass;
      
      // If not, fetch it from the database
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching class:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.classes]);

  // Student actions
  const fetchStudents = useCallback(async (classId, page = 1, pageSize = 10) => {
    if (!classId) return [];
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, count, error } = await supabase
        .from('students')
        .select('*', { count: 'exact' })
        .eq('class_id', classId)
        .order('created_at', { ascending: false })
        .range(from, to);
        
      if (error) throw error;
      
      dispatch({ type: 'SET_STUDENTS', payload: data || [] });
      dispatch({ 
        type: 'SET_PAGINATION', 
        payload: { 
          page,
          pageSize,
          totalItems: count || 0
        } 
      });
      
      return data || [];
    } catch (error) {
      showError('Failed to load students');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [showError]);

  const addStudent = useCallback(async (studentData) => {
    if (!state.selectedClass || !state.currentUser) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data, error } = await supabase
        .from('students')
        .insert([
          { 
            name: studentData.name.trim(),
            identifier: studentData.identifier.trim(),
            class_id: state.selectedClass.id,
            teacher_id: state.currentUser.id,
            created_at: new Date().toISOString()
          }
        ])
        .select();
        
      if (error) throw error;
      
      const newStudent = data[0];
      dispatch({ type: 'ADD_STUDENT', payload: newStudent });
      success(`Student "${newStudent.name}" added successfully!`);
      return newStudent;
    } catch (error) {
      showError(error.message || 'Failed to add student');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.selectedClass, state.currentUser, success, showError]);

  // Update actions
  const fetchUpdates = useCallback(async (classId) => {
    if (!classId) return [];
    
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      dispatch({ type: 'SET_UPDATES', payload: data || [] });
      return data || [];
    } catch (error) {
      showError('Failed to load updates');
      throw error;
    }
  }, [showError]);

  const addUpdate = useCallback(async (updateData) => {
    if (!state.selectedClass || !state.currentUser) return null;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data, error } = await supabase
        .from('updates')
        .insert([
          { 
            text: updateData.text.trim(),
            category: updateData.category || 'Academic',
            class_id: state.selectedClass.id,
            teacher_id: state.currentUser.id,
            created_at: new Date().toISOString()
          }
        ])
        .select();
        
      if (error) throw error;
      
      const newUpdate = data[0];
      dispatch({ type: 'ADD_UPDATE', payload: newUpdate });
      success('Update added successfully!');
      return newUpdate;
    } catch (error) {
      showError(error.message || 'Failed to add update');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.selectedClass, state.currentUser, success, showError]);

  // Profile actions
  const updateProfile = useCallback(async (profileData) => {
    if (!state.currentUser) return null;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: profileData.name.trim(),
          email: profileData.email.trim(),
          phone: profileData.phone?.trim(),
          avatar_url: profileData.avatar ? await uploadAvatar(profileData.avatar) : undefined
        }
      });

      if (error) throw error;
      
      dispatch({ type: 'SET_USER', payload: data.user });
      return data.user;
    } catch (error) {
      showError(error.message || 'Failed to update profile');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentUser, showError]);

  // Select class
  const selectClass = useCallback((classItem) => {
    dispatch({ type: 'SET_SELECTED_CLASS', payload: classItem });
    return fetchStudents(classItem.id);
  }, [fetchStudents]);

  // Update pagination
  const updatePagination = useCallback((updates) => {
    dispatch({ type: 'SET_PAGINATION', payload: updates });
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        signup,
        updateProfile,
        fetchClasses,
        addClass,
        updateClass,
        deleteClass,
        getClassById,
        selectClass,
        fetchStudents,
        addStudent,
        fetchUpdates,
        addUpdate,
        updatePagination,
        setLoading: (isLoading) => dispatch({ type: 'SET_LOADING', payload: isLoading }),
        setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
