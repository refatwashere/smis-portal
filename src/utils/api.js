import { supabase, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase';

// API response handler
const handleResponse = async (promise, successMessage = 'Operation successful') => {
  try {
    const { data, error } = await promise;
    
    if (error) {
      throw error;
    }
    
    return handleSupabaseSuccess(data, successMessage);
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Auth API
export const authAPI = {
  signIn: (email, password) => 
    handleResponse(
      supabase.auth.signInWithPassword({ email, password }),
      'Successfully signed in!'
    ),
    
  signUp: (email, password, userData) =>
    handleResponse(
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            role: 'teacher',
            created_at: new Date().toISOString()
          },
          emailRedirectTo: window.location.origin
        }
      }),
      'Account created! Please check your email to verify your account.'
    ),
    
  signOut: () =>
    handleResponse(
      supabase.auth.signOut(),
      'Successfully signed out!'
    ),
    
  resetPassword: (email) =>
    handleResponse(
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      }),
      'Password reset email sent!'
    ),
    
  updatePassword: (newPassword) =>
    handleResponse(
      supabase.auth.updateUser({ password: newPassword }),
      'Password updated successfully!'
    ),
    
  getSession: () =>
    handleResponse(
      supabase.auth.getSession()
    ),
    
  getUser: () =>
    handleResponse(
      supabase.auth.getUser()
    )
};

// Classes API
export const classesAPI = {
  fetchAll: (teacherId) =>
    handleResponse(
      supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false }),
      'Classes loaded successfully'
    ),
    
  create: (className, teacherId) =>
    handleResponse(
      supabase
        .from('classes')
        .insert([
          { 
            name: className.trim(),
            teacher_id: teacherId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select(),
      'Class created successfully!'
    ),
    
  update: (classId, updates) =>
    handleResponse(
      supabase
        .from('classes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', classId)
        .select(),
      'Class updated successfully!'
    ),
    
  delete: (classId) =>
    handleResponse(
      supabase
        .from('classes')
        .delete()
        .eq('id', classId),
      'Class deleted successfully!'
    )
};

// Students API
export const studentsAPI = {
  fetchByClass: (classId, page = 1, pageSize = 10) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    return handleResponse(
      supabase
        .from('students')
        .select('*', { count: 'exact' })
        .eq('class_id', classId)
        .order('created_at', { ascending: false })
        .range(from, to),
      'Students loaded successfully'
    );
  },
  
  create: (studentData, classId, teacherId) =>
    handleResponse(
      supabase
        .from('students')
        .insert([
          { 
            ...studentData,
            class_id: classId,
            teacher_id: teacherId,
            created_at: new Date().toISOString()
          }
        ])
        .select(),
      'Student added successfully!'
    ),
    
  update: (studentId, updates) =>
    handleResponse(
      supabase
        .from('students')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId)
        .select(),
      'Student updated successfully!'
    ),
    
  delete: (studentId) =>
    handleResponse(
      supabase
        .from('students')
        .delete()
        .eq('id', studentId),
      'Student deleted successfully!'
    )
};

// Updates API
export const updatesAPI = {
  fetchByClass: (classId) =>
    handleResponse(
      supabase
        .from('updates')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: false }),
      'Updates loaded successfully'
    ),
    
  create: (updateData, classId, teacherId) =>
    handleResponse(
      supabase
        .from('updates')
        .insert([
          { 
            ...updateData,
            class_id: classId,
            teacher_id: teacherId,
            created_at: new Date().toISOString()
          }
        ])
        .select(),
      'Update posted successfully!'
    ),
    
  update: (updateId, updates) =>
    handleResponse(
      supabase
        .from('updates')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', updateId)
        .select(),
      'Update modified successfully!'
    ),
    
  delete: (updateId) =>
    handleResponse(
      supabase
        .from('updates')
        .delete()
        .eq('id', updateId),
      'Update deleted successfully!'
    )
};

// Storage API for file uploads
export const storageAPI = {
  uploadFile: async (bucket, path, file) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      
      return {
        success: true,
        data: {
          ...data,
          publicUrl
        },
        message: 'File uploaded successfully!'
      };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  deleteFile: (bucket, path) =>
    handleResponse(
      supabase.storage
        .from(bucket)
        .remove([path]),
      'File deleted successfully!'
    )
};
