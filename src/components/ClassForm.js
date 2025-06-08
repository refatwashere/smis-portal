import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from './ui/ToastProvider';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea'; // Using default import
import { X, Save, Calendar as CalendarIcon, Users, BookOpen } from 'lucide-react';

const ClassForm = ({ isEditing = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, addClass, updateClass, getClassById } = useApp();
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    grade: '',
    subject: '',
    schedule: '',
    room: '',
    teacherId: currentUser?.id || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && id) {
      loadClassData();
    }
  }, [id, isEditing]);

  const loadClassData = async () => {
    try {
      setIsLoading(true);
      const classData = await getClassById(id);
      if (classData) {
        setFormData({
          name: classData.name || '',
          description: classData.description || '',
          grade: classData.grade || '',
          subject: classData.subject || '',
          schedule: classData.schedule || '',
          room: classData.room || '',
          teacherId: classData.teacherId || currentUser?.id
        });
      }
    } catch (err) {
      error('Failed to load class data');
      console.error('Error loading class:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Class name is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.grade) newErrors.grade = 'Grade level is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      if (isEditing) {
        await updateClass(id, formData);
        success('Class updated successfully');
      } else {
        await addClass(formData);
        success('Class created successfully');
      }
      navigate('/classes');
    } catch (err) {
      error(err.message || 'Failed to save class');
      console.error('Error saving class:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Class' : 'Create New Class'}
          </h2>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Class Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Mathematics 101"
              error={errors.name}
              icon="bookOpen"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`block w-full rounded-md border ${
                errors.subject ? 'border-red-300' : 'border-gray-300'
              } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            >
              <option value="">Select a subject</option>
              <option value="mathematics">Mathematics</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="history">History</option>
              <option value="geography">Geography</option>
              <option value="art">Art</option>
              <option value="music">Music</option>
              <option value="physical-education">Physical Education</option>
              <option value="computer-science">Computer Science</option>
              <option value="foreign-language">Foreign Language</option>
            </select>
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
              Grade Level <span className="text-red-500">*</span>
            </label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className={`block w-full rounded-md border ${
                errors.grade ? 'border-red-300' : 'border-gray-300'
              } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            >
              <option value="">Select grade level</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                <option key={grade} value={`grade-${grade}`}>
                  Grade {grade}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
            {errors.grade && (
              <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
              Schedule
            </label>
            <div className="relative">
              <Input
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                placeholder="e.g., Mon, Wed, Fri 10:00 AM - 11:00 AM"
                leftIcon={<CalendarIcon className="h-4 w-4 text-gray-400" />}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label htmlFor="room" className="block text-sm font-medium text-gray-700">
              Room Number
            </label>
            <Input
              id="room"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder="e.g., Room 205"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">
              Teacher
            </label>
            <div className="relative">
              <Input
                id="teacherId"
                name="teacherId"
                value={currentUser?.user_metadata?.name || 'Current User'}
                disabled
                leftIcon={<Users className="h-4 w-4 text-gray-400" />}
              />
            </div>
          </div>
          
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description of the class..."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Class'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm;
