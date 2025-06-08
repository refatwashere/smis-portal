// Application constants
export const APP_NAME = 'SMIS Portal';
export const APP_DESCRIPTION = 'St. Mary\'s International School Management System';

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'sb:token',
  USER_DATA: 'user_data',
  THEME_PREFERENCE: 'theme_preference',
  LAST_ACTIVE_CLASS: 'last_active_class',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/v1/token',
    SIGNUP: '/auth/v1/signup',
    LOGOUT: '/auth/v1/logout',
    USER: '/auth/v1/user',
  },
  CLASSES: '/rest/v1/classes',
  STUDENTS: '/rest/v1/students',
  UPDATES: '/rest/v1/updates',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORDS_DONT_MATCH: "Passwords don't match",
  INVALID_PHONE: 'Please enter a valid phone number',
};

// User roles
export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
};

// Update categories
export const UPDATE_CATEGORIES = [
  'Academic',
  'Event',
  'Holiday',
  'Exam',
  'Assignment',
  'General',
];

// Class levels
export const CLASS_LEVELS = [
  'Nursery',
  'LKG',
  'UKG',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
];

// Subjects
export const SUBJECTS = [
  'English',
  'Mathematics',
  'Science',
  'Social Studies',
  'Hindi',
  'Bengali',
  'Computer Science',
  'Physical Education',
  'Art',
  'Music',
  'Dance',
  'Drama',
  'Sanskrit',
  'French',
  'Environmental Studies',
];

// Days of the week
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Time slots for class schedule
export const TIME_SLOTS = [
  '08:00 AM - 08:45 AM',
  '08:45 AM - 09:30 AM',
  '09:30 AM - 10:15 AM',
  '10:15 AM - 10:30 AM', // Break
  '10:30 AM - 11:15 AM',
  '11:15 AM - 12:00 PM',
  '12:00 PM - 12:30 PM', // Lunch
  '12:30 PM - 01:15 PM',
  '01:15 PM - 02:00 PM',
  '02:00 PM - 02:45 PM',
];

// Theme colors
export const THEME_COLORS = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  light: '#F9FAFB',
  dark: '#111827',
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Default avatar URL
export const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

// Default class banner URL
export const DEFAULT_CLASS_BANNER = 'https://images.unsplash.com/photo-1523050853548-5d7a4b9f4b0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';

// Default student avatar URL
export const DEFAULT_STUDENT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon&f=y';

// Default teacher avatar URL
export const DEFAULT_TEACHER_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=robohash&f=y';
