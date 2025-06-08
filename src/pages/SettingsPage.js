import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../components/ui/ToastProvider';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Check, 
  X,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  LogOut
} from 'lucide-react';
import { Tab } from '@headlessui/react';

const SettingsPage = () => {
  const { currentUser, updateProfile, updatePassword, logout } = useApp();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: null,
    avatarPreview: ''
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    announcements: true,
    assignments: true,
    grades: true,
    events: true
  });
  
  const [errors, setErrors] = useState({});
  const tabs = ['Profile', 'Password', 'Notifications', 'Privacy', 'Billing', 'Danger Zone'];

  // Initialize form with current user data
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.user_metadata?.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        avatar: null,
        avatarPreview: currentUser.user_metadata?.avatar_url || ''
      });
    }
  }, [currentUser]);

  // Profile handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({
          ...prev,
          avatar: file,
          avatarPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!profileForm.name.trim()) newErrors.name = 'Name is required';
    if (!profileForm.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (profileForm.phone && !/^\+?[0-9\s-()]{10,}$/.test(profileForm.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        avatar: profileForm.avatar
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Password handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordForm(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    
    setIsSaving(true);
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false
      });
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  // Notification handlers
  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      // In a real app, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification preferences saved');
    } catch (error) {
      console.error('Error saving notifications:', error);
      toast.error('Failed to save notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  // Danger zone handlers
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // In a real app, call delete account API
        await new Promise(resolve => setTimeout(resolve, 1000));
        await logout();
        toast.success('Your account has been deleted');
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  // Toggle switch component
  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {description && <span className="text-sm text-gray-500">{description}</span>}
      </div>
      <button
        type="button"
        className={`${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        onClick={onChange}
      >
        <span className="sr-only">Toggle {label.toLowerCase()}</span>
        <span
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        >
          <span
            className={`${
              enabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
            } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
            aria-hidden="true"
          >
            <X className="h-3 w-3 text-gray-400" />
          </span>
          <span
            className={`${
              enabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
            } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
            aria-hidden="true"
          >
            <Check className="h-3 w-3 text-blue-600" />
          </span>
        </span>
      </button>
    </div>
  );

  // Password input field component
  const PasswordInput = ({ name, label, value, onChange, showPassword, onToggle, error }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type={showPassword ? 'text' : 'password'}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`pl-10 ${error ? 'border-red-300' : ''}`}
          placeholder="••••••••"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onToggle}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
        
        <div className="mt-8">
          <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
            <div className="sm:flex">
              <div className="w-full sm:w-48 flex-shrink-0 mb-6 sm:mb-0">
                <Tab.List className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col rounded-lg bg-white p-1 sm:p-2">
                  {tabs.map((tab, index) => (
                    <Tab
                      key={index}
                      className={({ selected }) =>
                        `w-full px-4 py-2.5 text-sm font-medium rounded-md focus:outline-none ${
                          selected
                            ? 'bg-blue-50 text-blue-700 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`
                      }
                    >
                      {tab}
                    </Tab>
                  ))}
                </Tab.List>
              </div>
              
              <div className="flex-1 sm:ml-8">
                <Tab.Panels>
                  {/* Profile Tab */}
                  <Tab.Panel>
                    <Card className="p-6">
                      <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your account's profile information and email address.
                      </p>
                      
                      <form onSubmit={handleProfileSubmit} className="mt-6 space-y-6">
                        <div className="flex items-center space-x-6">
                          <div className="flex-shrink-0 h-20 w-20">
                            <img
                              className="h-20 w-20 rounded-full object-cover"
                              src={profileForm.avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name || 'User')}&background=random`}
                              alt=""
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="avatar-upload"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Change Photo
                              <input
                                id="avatar-upload"
                                name="avatar-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleAvatarChange}
                              />
                            </label>
                            <p className="mt-2 text-xs text-gray-500">
                              JPG, GIF or PNG. Max size 2MB.
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              type="text"
                              id="name"
                              name="name"
                              value={profileForm.name}
                              onChange={handleProfileChange}
                              className={`pl-10 ${errors.name ? 'border-red-300' : ''}`}
                              placeholder="John Doe"
                            />
                          </div>
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              type="email"
                              id="email"
                              name="email"
                              value={profileForm.email}
                              onChange={handleProfileChange}
                              className={`pl-10 ${errors.email ? 'border-red-300' : ''}`}
                              placeholder="you@example.com"
                            />
                          </div>
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={profileForm.phone}
                              onChange={handleProfileChange}
                              className={`pl-10 ${errors.phone ? 'border-red-300' : ''}`}
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                          )}
                        </div>
                        
                        <div className="flex justify-end pt-4">
                          <Button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </form>
                    </Card>
                  </Tab.Panel>
                  
                  {/* Password Tab */}
                  <Tab.Panel>
                    <Card className="p-6">
                      <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Ensure your account is using a long, random password to stay secure.
                      </p>
                      
                      <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-6">
                        <PasswordInput
                          name="currentPassword"
                          label="Current Password"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          showPassword={passwordForm.showCurrentPassword}
                          onToggle={() => togglePasswordVisibility('showCurrentPassword')}
                          error={errors.currentPassword}
                        />
                        
                        <PasswordInput
                          name="newPassword"
                          label="New Password"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          showPassword={passwordForm.showNewPassword}
                          onToggle={() => togglePasswordVisibility('showNewPassword')}
                          error={errors.newPassword}
                        />
                        
                        <PasswordInput
                          name="confirmPassword"
                          label="Confirm New Password"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          showPassword={passwordForm.showConfirmPassword}
                          onToggle={() => togglePasswordVisibility('showConfirmPassword')}
                          error={errors.confirmPassword}
                        />
                        
                        <div className="flex justify-end pt-4">
                          <Button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            {isSaving ? 'Updating...' : 'Update Password'}
                          </Button>
                        </div>
                      </form>
                    </Card>
                  </Tab.Panel>
                  
                  {/* Notifications Tab */}
                  <Tab.Panel>
                    <Card className="p-6">
                      <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Configure how you receive notifications.
                      </p>
                      
                      <div className="mt-6 space-y-6">
                        <h3 className="text-base font-medium text-gray-900">Notification Methods</h3>
                        <div className="space-y-4">
                          <ToggleSwitch
                            enabled={notifications.email}
                            onChange={() => handleNotificationToggle('email')}
                            label="Email"
                            description="Receive notifications via email"
                          />
                          
                          <ToggleSwitch
                            enabled={notifications.push}
                            onChange={() => handleNotificationToggle('push')}
                            label="Push Notifications"
                            description="Receive push notifications on your device"
                          />
                          
                          <ToggleSwitch
                            enabled={notifications.sms}
                            onChange={() => handleNotificationToggle('sms')}
                            label="SMS"
                            description="Receive text message notifications"
                          />
                        </div>
                        
                        <h3 className="text-base font-medium text-gray-900 pt-4">Notification Types</h3>
                        <div className="space-y-4">
                          <ToggleSwitch
                            enabled={notifications.announcements}
                            onChange={() => handleNotificationToggle('announcements')}
                            label="Announcements"
                            description="Important school announcements and news"
                          />
                          
                          <ToggleSwitch
                            enabled={notifications.assignments}
                            onChange={() => handleNotificationToggle('assignments')}
                            label="Assignments"
                            description="New assignments and due date reminders"
                          />
                          
                          <ToggleSwitch
                            enabled={notifications.grades}
                            onChange={() => handleNotificationToggle('grades')}
                            label="Grades"
                            description="Grade updates and report cards"
                          />
                          
                          <ToggleSwitch
                            enabled={notifications.events}
                            onChange={() => handleNotificationToggle('events')}
                            label="Events"
                            description="Upcoming school events and activities"
                          />
                        </div>
                        
                        <div className="flex justify-end pt-4">
                          <Button
                            type="button"
                            onClick={handleSaveNotifications}
                            disabled={isSaving}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            {isSaving ? 'Saving...' : 'Save Preferences'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Tab.Panel>
                  
                  {/* Privacy Tab */}
                  <Tab.Panel>
                    <Card className="p-6">
                      <h2 className="text-lg font-medium text-gray-900">Privacy Settings</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Control your privacy settings and data sharing preferences.
                      </p>
                      
                      <div className="mt-6 space-y-6">
                        <div className="border-b border-gray-200 pb-5">
                          <h3 className="text-base font-medium text-gray-900">Data Sharing</h3>
                          <p className="mt-2 text-sm text-gray-500">
                            Control how your data is shared with third-party applications and services.
                          </p>
                          
                          <div className="mt-4 space-y-4">
                            <ToggleSwitch
                              enabled={true}
                              onChange={() => {}}
                              label="Allow analytics"
                              description="Help us improve our services by sharing usage data"
                            />
                            
                            <ToggleSwitch
                              enabled={false}
                              onChange={() => {}}
                              label="Marketing communications"
                              description="Receive promotional emails and offers"
                            />
                          </div>
                        </div>
                        
                        <div className="border-b border-gray-200 pb-5">
                          <h3 className="text-base font-medium text-gray-900">Data Export</h3>
                          <p className="mt-2 text-sm text-gray-500">
                            Request a copy of all your personal data stored in our systems.
                          </p>
                          
                          <div className="mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Request Data Export
                            </Button>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <h3 className="text-base font-medium text-gray-900">Data Retention</h3>
                          <p className="mt-2 text-sm text-gray-500">
                            Your data will be retained for as long as your account is active. You can request account deletion at any time.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Tab.Panel>
                  
                  {/* Billing Tab */}
                  <Tab.Panel>
                    <Card className="p-6">
                      <h2 className="text-lg font-medium text-gray-900">Billing Information</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage your subscription and payment methods.
                      </p>
                      
                      <div className="mt-6">
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-blue-700">
                                This is a demo application. Billing functionality is not implemented.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Tab.Panel>
                  
                  {/* Danger Zone Tab */}
                  <Tab.Panel>
                    <Card className="p-6 border-red-200 bg-red-50">
                      <h2 className="text-lg font-medium text-red-800">Danger Zone</h2>
                      <p className="mt-1 text-sm text-red-700">
                        These actions are irreversible. Proceed with caution.
                      </p>
                      
                      <div className="mt-6 space-y-6">
                        <div className="border-t border-red-200 pt-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h3 className="text-base font-medium text-red-800">Delete Account</h3>
                              <p className="mt-1 text-sm text-red-700">
                                Permanently delete your account and all associated data.
                              </p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                              <Button
                                type="button"
                                onClick={handleDeleteAccount}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t border-red-200 pt-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h3 className="text-base font-medium text-red-800">Sign Out of All Devices</h3>
                              <p className="mt-1 text-sm text-red-700">
                                Sign out of all devices where you're currently signed in.
                              </p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                              <Button
                                type="button"
                                onClick={handleLogout}
                                variant="outline"
                                className="inline-flex items-center px-4 py-2 border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out Everywhere
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t border-red-200 pt-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h3 className="text-base font-medium text-red-800">Export All Data</h3>
                              <p className="mt-1 text-sm text-red-700">
                                Download all your data in a portable format.
                              </p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                              <Button
                                type="button"
                                variant="outline"
                                className="inline-flex items-center px-4 py-2 border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export Data
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Tab.Panel>
                </Tab.Panels>
              </div>
            </div>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
